import "./Instructions.css";

export type Step = {
  id: number;
  text: string;
  prompt?: string;
};

type Props = {
  steps: Step[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
};

function autoPrompt(full: string): string {
  const s = full.trim();
  const cutPoints = [".", "—", ";", ","];
  for (const p of cutPoints) {
    const idx = s.indexOf(p);
    if (idx > 18 && idx < 70) return s.slice(0, idx).trim();
  }
  if (s.length <= 64) return s;
  return s.slice(0, 64).trim() + "…";
}

export default function Instructions({ steps, currentIndex, onPrev, onNext }: Props) {
  const current = steps[currentIndex];
  const display = current?.prompt?.trim() || (current?.text ? autoPrompt(current.text) : "");

  return (
    <div className="instPill">
      <div className="instChip">Step {currentIndex + 1}</div>

      <button
        type="button"
        className="instChevron"
        onClick={onPrev}
        disabled={currentIndex === 0}
        aria-label="Previous step"
      >
        ‹
      </button>

      <div className="instText" title={display}>
        {display}
      </div>

      <button
        type="button"
        className="instChevron"
        onClick={onNext}
        disabled={currentIndex === steps.length - 1}
        aria-label="Next step"
      >
        ›
      </button>
    </div>
  );
}
