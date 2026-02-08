import { useEffect, useRef, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import "./TalkButton.css";

export default function TalkButton() {
  const [isAgentActive, setIsAgentActive] = useState(false);
  const [toolCalled, setToolCalled] = useState(false);
  const toolTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const agentId = import.meta.env.VITE_AGENT_ID;

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
          asks_question: async (params: unknown) => {
            console.log("asks_question tool called:", params);
            setToolCalled(true);
            if (toolTimerRef.current) clearTimeout(toolTimerRef.current);
            toolTimerRef.current = setTimeout(() => setToolCalled(false), 3000);
            return "Question acknowledged";
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
          <span className="toolIndicatorIcon">❓</span>
          <span>Question detected</span>
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
