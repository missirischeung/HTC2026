import { useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import { GoogleGenAI, Type } from "@google/genai";
import "./TalkButton.css";

export interface DebugEntry {
  id: number;
  time: string;
  type: "snapshot" | "gemini-request" | "gemini-response" | "error" | "tool-call";
  message: string;
  imageDataUrl?: string; // thumbnail for snapshot entries
}

interface TalkButtonProps {
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  currentStep?: string;
  onPassStep?: () => void;
  onDebugLog?: (entry: Omit<DebugEntry, "id">) => void;
}

/** Grab a JPEG frame from a <video> element. Returns { base64, dataUrl }. */
function captureFrame(video: HTMLVideoElement): { base64: string; dataUrl: string } | null {
  if (!video.videoWidth || !video.videoHeight) return null;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
  return { base64: dataUrl.split(",")[1], dataUrl };
}

/** Call Gemini with image + question + step context → returns { feedback, passed } */
async function askGemini(
  base64Image: string,
  question: string,
  currentStep: string
): Promise<{ feedback: string; passed: boolean }> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("VITE_GEMINI_API_KEY is not set");

  const ai = new GoogleGenAI({ apiKey });

  const tools = [
    {
      functionDeclarations: [
        {
          name: "give_feedback",
          description:
            "Provide feedback to the user with a feedback string and a passed boolean. The passed boolean should be true if the user is asking whether the current recipe step is complete/good enough AND your assessment is positive. If your feedback is negative, set passed to false.",
          parameters: {
            type: Type.OBJECT,
            required: ["feedback", "passed"],
            properties: {
              feedback: { type: Type.STRING },
              passed: { type: Type.BOOLEAN },
            },
          },
        },
      ],
    },
  ];

  const config = {
    tools,
    systemInstruction: [
      {
        text: `You are a cooking assistant. Given an image and a user's question, answer the question about the dish. The user is currently on this recipe step: "${currentStep}". If the question or image is not related to cooking a dish, say that isn't relevant to the recipe. You MUST call the give_feedback tool with your response.`,
      },
    ],
  };

  const contents = [
    {
      role: "user" as const,
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image,
          },
        },
        {
          text: `The user is asking: "${question}". Given the image, provide feedback on their cooking progress.`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config,
    contents,
  });

  // Extract the give_feedback function call
  const functionCalls = response.functionCalls;
  if (functionCalls && functionCalls.length > 0) {
    const call = functionCalls[0];
    if (call.name === "give_feedback" && call.args) {
      return {
        feedback: (call.args.feedback as string) ?? "Looks good!",
        passed: (call.args.passed as boolean) ?? false,
      };
    }
  }

  // Fallback if no function call returned — use text response
  const text = response.text ?? "I couldn't analyze the image right now.";
  return { feedback: text, passed: false };
}

function now() {
  return new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export default function TalkButton({
  videoRef,
  currentStep = "",
  onPassStep,
  onDebugLog,
}: TalkButtonProps) {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [toolCalled, setToolCalled] = useState(false);
  const toolTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const agentId = import.meta.env.VITE_AGENT_ID;

  // Keep latest values in refs so the clientTools closure always sees current data
  const currentStepRef = useRef(currentStep);
  currentStepRef.current = currentStep;
  const onPassStepRef = useRef(onPassStep);
  onPassStepRef.current = onPassStep;
  const videoRefRef = useRef(videoRef);
  videoRefRef.current = videoRef;
  const onDebugLogRef = useRef(onDebugLog);
  onDebugLogRef.current = onDebugLog;

  const conversation = useConversation({
    onConnect: () => console.log("Connected to agent"),
    onDisconnect: () => {
      console.log("Disconnected from agent");
      setIsAgentActive(false);
    },
    onError: (error: string) => console.error("Agent error:", error),
    onMessage: (message: unknown) => console.log("Message:", message),
  });

  useEffect(() => {
    if (isAgentActive && agentId) {
      conversation.startSession({
        agentId,
        connectionType: "webrtc",
        clientTools: {
          asks_question: async (params: { user_question?: string }) => {
            const log = onDebugLogRef.current;
            const question = params?.user_question || "How does my dish look?";
            console.log("asks_question tool called:", question);
            setToolCalled(true);
            if (toolTimerRef.current) clearTimeout(toolTimerRef.current);
            toolTimerRef.current = setTimeout(
              () => setToolCalled(false),
              3000
            );

            log?.({ time: now(), type: "tool-call", message: `asks_question — "${question}"` });

            // Capture camera frame
            const video = videoRefRef.current?.current;
            if (!video) {
              log?.({ time: now(), type: "error", message: "Camera not available" });
              return "Camera is not available. Please turn on the camera for visual feedback.";
            }

            const frame = captureFrame(video);
            if (!frame) {
              log?.({ time: now(), type: "error", message: "Could not capture frame" });
              return "Could not capture an image from the camera.";
            }

            log?.({ time: now(), type: "snapshot", message: "Frame captured", imageDataUrl: frame.dataUrl });

            try {
              log?.({ time: now(), type: "gemini-request", message: `Sending to Gemini — step: "${currentStepRef.current}"` });

              const { feedback, passed } = await askGemini(
                frame.base64,
                question,
                currentStepRef.current
              );

              console.log("Gemini feedback:", { feedback, passed });
              log?.({ time: now(), type: "gemini-response", message: `feedback: "${feedback}" | passed: ${passed}` });

              if (passed && onPassStepRef.current) {
                onPassStepRef.current();
              }

              return feedback;
            } catch (err) {
              console.error("Gemini API error:", err);
              log?.({ time: now(), type: "error", message: `Gemini error: ${err}` });
              return "Sorry, I couldn't analyze the image right now.";
            }
          },
        },
      });
    } else if (!isAgentActive && conversation.status === "connected") {
      conversation.endSession();
    }
  }, [isAgentActive, agentId]);

  useEffect(() => {
    return () => {
      if (toolTimerRef.current) clearTimeout(toolTimerRef.current);
    };
  }, []);

  const isConnected = conversation.status === "connected";
  const isConnecting = conversation.status === "connecting";
  const isSpeaking = conversation.isSpeaking;

  const label = isConnecting
    ? "Connecting…"
    : isConnected
      ? isSpeaking
        ? "Speaking…"
        : "Listening…"
      : "Talk";

  const icon = isConnecting
    ? "⏳"
    : isConnected
      ? isSpeaking
        ? "🗣️"
        : "🎙️"
      : "🎤";

  if (!agentId) {
    return null;
  }

  return (
    <div className="talkWrap">
      {toolCalled && (
        <div className="toolIndicator">
          <span className="toolIndicatorIcon">📸</span>
          <span>Analyzing your dish…</span>
        </div>
      )}
      <button
        type="button"
        className={`talkBtn ${isConnected ? "listening" : ""} ${isConnecting ? "connecting" : ""}`}
        onClick={() => setIsAgentActive((v) => !v)}
        disabled={isConnecting}
        aria-pressed={isConnected}
        aria-label={isConnected ? "End conversation" : "Start conversation"}
      >
        <span className="talkIcon">{icon}</span>
        <span className="talkText">{label}</span>
      </button>
    </div>
  );
}
