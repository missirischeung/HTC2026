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
};

export default function Instructions({
  steps,
  currentIndex,
  onSelectIndex,
  onPrev,
  onNext,
}: Props) {
  return (
    <div className="instructionsPanel">
      <div className="instructionsHeader">
        <div className="instructionsTitle">Instructions</div>
        <div className="instructionsNav">
          <button className="btn small" onClick={onPrev} disabled={currentIndex === 0}>
            Prev
          </button>
          <button
            className="btn small"
            onClick={onNext}
            disabled={currentIndex === steps.length - 1}
          >
            Next
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
