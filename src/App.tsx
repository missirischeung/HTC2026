import { useMemo, useState } from "react";
import Camera from "./components/Camera";
import Instructions, { type Step } from "./components/Instructions";
//import TalkButton from "./components/TalkButton";
import "./App.css";

export default function App() {
  const steps: Step[] = useMemo(
    () => [
      { id: 1, text: "Wash and prep ingredients." },
      { id: 2, text: "Dice onions and mince garlic." },
      { id: 3, text: "Heat pan and sauté onions for 3–4 min." },
      { id: 4, text: "Add garlic, cook 30 seconds." },
      { id: 5, text: "Add sauce, simmer 8–10 min." },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () =>
    setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Cooking Coach</div>
        <div className="stepCounter">
          Step {currentIndex + 1} / {steps.length}
        </div>
      </header>

      <main className="main">
        <section className="cameraArea">
          <Camera />
        </section>

        <section className="instructionsArea">
          <Instructions
            steps={steps}
            currentIndex={currentIndex}
            onSelectIndex={setCurrentIndex}
            onPrev={goPrev}
            onNext={goNext}
          />
        </section>
      </main>

      {/* <TalkButton
        onTranscript={(text) => {
          const t = text.toLowerCase();
          if (t.includes("next")) goNext();
          else if (t.includes("back") || t.includes("previous")) goPrev();
          else {
            const match = t.match(/step\s+(\d+)/);
            if (match) {
              const stepNum = Number(match[1]);
              if (!Number.isNaN(stepNum)) {
                setCurrentIndex(
                  Math.min(steps.length - 1, Math.max(0, stepNum - 1))
                );
              }
            }
          }
        }}
      /> */}
    </div>
  );
}
