import { useEffect, useState } from "react";
import "./TalkButton.css";

type Props = {
  onToggleListening?: (isListening: boolean) => void;
  autoStopMs?: number; // optional: automatically stop "listening" after X ms
};

export default function TalkButton({
  onToggleListening,
  autoStopMs = 0,
}: Props) {
  const [isListening, setIsListening] = useState(false);

  // optional auto-stop (pure UI)
  useEffect(() => {
    if (!isListening) return;
    if (!autoStopMs || autoStopMs <= 0) return;

    const t = window.setTimeout(() => setIsListening(false), autoStopMs);
    return () => window.clearTimeout(t);
  }, [isListening, autoStopMs]);

  // notify parent if needed later
  useEffect(() => {
    onToggleListening?.(isListening);
  }, [isListening, onToggleListening]);

  return (
    <div className="talkWrap">
      <button
        type="button"
        className={`talkBtn ${isListening ? "listening" : ""}`}
        onClick={() => setIsListening((v) => !v)}
        aria-pressed={isListening}
        aria-label={isListening ? "Stop listening" : "Start listening"}
      >
        <span className="talkIcon">{isListening ? "🎙️" : "🎤"}</span>
        <span className="talkText">{isListening ? "Listening…" : "Talk"}</span>
      </button>
    </div>
  );
}
