import { useMemo, useRef, useState } from "react";
import "./TalkButton.css";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

// Add missing vendor-prefixed typing
declare global {
  interface Window {
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    SpeechRecognition?: SpeechRecognitionConstructor;
  }
}

export default function TalkButton({
  onTranscript,
}: {
  onTranscript: (text: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const recRef = useRef<SpeechRecognition | null>(null);

  const supported = useMemo(
    () => Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    []
  );

  function start() {
    if (!supported) return;

    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) return;

    // Stop any existing session cleanly
    recRef.current?.stop();

    const rec = new Rec();
    recRef.current = rec;

    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results)
        .map((r) => r[0]?.transcript ?? "")
        .join("")
        .trim();

      setLastHeard(text);

      const last = event.results[event.results.length - 1];
      if (last.isFinal && text) onTranscript(text);
    };

    rec.start();
  }

  return (
    <div className="talkWrap">
      {lastHeard && <div className="toast">Heard: “{lastHeard}”</div>}

      <button
        className={`talkBtn ${listening ? "live" : ""}`}
        onClick={start}
        disabled={!supported}
      >
        {supported ? (listening ? "Listening…" : "Talk") : "Talk (unsupported)"}
      </button>
    </div>
  );
}
