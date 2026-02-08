import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RECIPES } from "../data/recipes";
import "./RecipeSelect.css";

type Selected = (typeof RECIPES)[number] | null;

export default function RecipeSelect() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<Selected>(null);

  const stepLines = useMemo(() => {
    if (!selected) return [];
    return selected.steps.map((s, i) => ({ num: i + 1, text: s.text }));
  }, [selected]);

  useEffect(() => {
    if (selected) document.body.classList.add("modalOpen");
    else document.body.classList.remove("modalOpen");
  
    return () => document.body.classList.remove("modalOpen");
  }, [selected]);
  

  return (
    <div className="selectPage">
      <header className="selectTop">
        <div className="selectTitle">Choose a recipe</div>
        <div className="selectSub">Scroll like a shop — tap to preview.</div>
      </header>

      <main className="recipeFeed">
        {RECIPES.map((r) => (
          <button key={r.id} className="shopCard" onClick={() => setSelected(r)}>
            <div className="shopImageWrap">
              <img className="shopImage" src={r.image} alt={r.title} />
              <div className="shopImageFade" />
            </div>

            <div className="shopBody">
              <div className="shopTitleRow">
                <div className="shopTitle">{r.title}</div>
                <div className="shopSteps">{r.steps.length} steps</div>
              </div>
              <div className="shopDesc">{r.description}</div>
            </div>
          </button>
        ))}
      </main>

      {/* ===== Modal Preview ===== */}
      <div
        className={`modalBackdrop ${selected ? "open" : ""}`}
        onClick={() => setSelected(null)}
      />

      <section
        className={`modalSheet ${selected ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Recipe preview"
      >
        <div className="modalCard">
          <div className="modalHeader">
            <div className="modalTitle">{selected?.title ?? ""}</div>
            <button className="modalClose" onClick={() => setSelected(null)}>
              ✕
            </button>
          </div>

          <div className="modalMeta">
            {selected ? `${selected.steps.length} steps • ${selected.description}` : ""}
          </div>

          <div className="modalSteps">
            {stepLines.map((s) => (
              <div key={s.num} className="modalStepRow">
                <div className="modalStepNum">{s.num}</div>
                <div className="modalStepText">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="modalActions">
            <button className="btn ghost" onClick={() => setSelected(null)}>
              Close
            </button>
            <button
              className="btn primary"
              onClick={() => {
                if (!selected) return;
                nav(`/cook/${selected.id}`);
              }}
            >
              Start
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
