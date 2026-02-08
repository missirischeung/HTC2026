import { useMemo, useState } from "react";
import Camera from "./components/Camera";
import Instructions, { type Step } from "./components/Instructions";
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
  const [showAll, setShowAll] = useState(false);

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">Cooking Coach</div>
        <div className="stepCounter">
          Step {currentIndex + 1} / {steps.length}
        </div>
      </header>

      <main className="main">
        {/* Camera fills most of the screen */}
        <section className="cameraArea">
          <Camera />

          {/* Lyrics overlay on top of camera */}
          <div className="lyricsOverlay">
            <Instructions
              mode="now"
              steps={steps}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
              onPrev={goPrev}
              onNext={goNext}
              onOpenAll={() => setShowAll(true)}
            />
          </div>
        </section>

        {/* Bottom sheet for full list */}
        <div
          className={`sheetBackdrop ${showAll ? "open" : ""}`}
          onClick={() => setShowAll(false)}
        />

        <section className={`sheet ${showAll ? "open" : ""}`}>
          <Instructions
            mode="list"
            steps={steps}
            currentIndex={currentIndex}
            onSelectIndex={(i) => {
              setCurrentIndex(i);
              setShowAll(false);
            }}
            onPrev={goPrev}
            onNext={goNext}
            onCloseAll={() => setShowAll(false)}
          />
        </section>
      </main>
    </div>
  );
}
