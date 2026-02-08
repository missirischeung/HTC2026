import "./Instructions.css";

export type Step = {
  id: number;
  text: string;
};

type Props = {
  steps: Step[];
  currentIndex: number;
  onSelectIndex: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;

  // single-line overlay or full list
  mode: "now" | "list";
  onOpenAll?: () => void;
  onCloseAll?: () => void;
};

export default function Instructions({
  steps,
  currentIndex,
  onSelectIndex,
  onPrev,
  onNext,
  mode,
  onOpenAll,
  onCloseAll,
}: Props) {
  const current = steps[currentIndex];

  /* ================= NOW MODE (center overlay) ================= */
  if (mode === "now") {
    return (
      <div className="nowPanel">
        <div className="nowRow">
          <div className="nowLeft">
            <div className="nowLabel">
              Step {currentIndex + 1}/{steps.length}
            </div>
            <div className="nowText">{current?.text}</div>
          </div>

          <div className="nowActions">
            <button
              className="btn xs"
              onClick={onPrev}
              disabled={currentIndex === 0}
            >
              Prev
            </button>
            <button
              className="btn xs"
              onClick={onNext}
              disabled={currentIndex === steps.length - 1}
            >
              Next
            </button>
            <button className="btn xs ghost" onClick={onOpenAll}>
              All
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= LIST MODE (bottom sheet) ================= */
  return (
    <div className="instructionsPanel">
      <div className="instructionsHeader">
        <div className="instructionsTitle">Instructions</div>
        <div className="instructionsNav">
          <button
            className="btn small"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            Prev
          </button>
          <button
            className="btn small"
            onClick={onNext}
            disabled={currentIndex === steps.length - 1}
          >
            Next
          </button>
          <button className="btn small ghost" onClick={onCloseAll}>
            Close
          </button>
        </div>
      </div>

      <div className="stepsList">
        {steps.map((s, idx) => {
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={s.id}
              className={`stepItem ${isCurrent ? "current" : ""}`}
              onClick={() => onSelectIndex(idx)}
            >
              <div className="stepNum">{idx + 1}</div>
              <div className="stepText">{s.text}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
