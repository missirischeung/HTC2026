import { useEffect, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import "./TalkButton.css";

export default function TalkButton() {
  const [isAgentActive, setIsAgentActive] = useState(false);
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
      });
    } else if (!isAgentActive && conversation.status === "connected") {
      conversation.endSession();
    }
  }, [isAgentActive, agentId]);

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
