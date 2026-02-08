import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Camera from "../components/Camera";
import Instructions from "../components/Instructions";
import TalkButton, { type DebugEntry } from "../components/TalkButton";
import { RECIPES } from "../data/recipes";
import "./Cook.css";

export default function Cook() {
  const { recipeId } = useParams();
  const nav = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const recipe = useMemo(
    () => RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0],
    [recipeId]
  );

  const steps = recipe.steps;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));

  // Debug mode
  const [debugMode, setDebugMode] = useState(false);
  const [debugLog, setDebugLog] = useState<DebugEntry[]>([]);
  const debugIdRef = useRef(0);
  const debugPanelRef = useRef<HTMLDivElement | null>(null);

  const addDebugEntry = useCallback((entry: Omit<DebugEntry, "id">) => {
    setDebugLog((prev) => {
      const next = [...prev, { ...entry, id: ++debugIdRef.current }];
      // keep last 50 entries
      return next.length > 50 ? next.slice(-50) : next;
    });
    // auto-scroll after render
    requestAnimationFrame(() => {
      debugPanelRef.current?.scrollTo({ top: debugPanelRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const typeIcon: Record<DebugEntry["type"], string> = {
    "tool-call": ">>",
    snapshot: "[]",
    "gemini-request": "->",
    "gemini-response": "<-",
    error: "!!",
  };

  return (
    <div className="cookApp">
      <header className="cookTopbar">
        <button className="cookBack" onClick={() => nav("/")}>
          ←
        </button>
        <div className="cookTitle">{recipe.title}</div>

        <button
          className={`debugToggle ${debugMode ? "active" : ""}`}
          onClick={() => setDebugMode((v) => !v)}
          aria-label="Toggle debug mode"
          title="Toggle debug mode"
        >
          {debugMode ? "DBG" : "DBG"}
        </button>
      </header>

      <main className="cookMain">
        <section className="cameraStage">
          <Camera videoRef={videoRef} />

          {/* Instruction pill overlay */}
          <div className="nowOverlay">
            <Instructions
              steps={steps}
              currentIndex={currentIndex}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>

          {/* Debug panel overlay */}
          {debugMode && (
            <div className="debugPanel" ref={debugPanelRef}>
              <div className="debugHeader">
                <span>Debug Log</span>
                <button className="debugClear" onClick={() => setDebugLog([])}>Clear</button>
              </div>
              {debugLog.length === 0 && (
                <div className="debugEmpty">Waiting for tool calls...</div>
              )}
              {debugLog.map((entry) => (
                <div key={entry.id} className={`debugEntry debugEntry--${entry.type}`}>
                  <span className="debugTime">{entry.time}</span>
                  <span className="debugType">{typeIcon[entry.type]}</span>
                  <span className="debugMsg">{entry.message}</span>
                  {entry.imageDataUrl && (
                    <img className="debugThumb" src={entry.imageDataUrl} alt="snapshot" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Talk button floats bottom center */}
          <div className="talkButtonWrap">
            <TalkButton
              videoRef={videoRef}
              currentStep={steps[currentIndex]?.text ?? ""}
              onPassStep={goNext}
              onDebugLog={addDebugEntry}
            />
          </div>

        </section>
      </main>
    </div>
  );
}
