import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Camera from "../components/Camera";
import Instructions from "../components/Instructions";
import TalkButton from "../components/TalkButton";
import { RECIPES } from "../data/recipes";
import "./Cook.css";

export default function Cook() {
  const { recipeId } = useParams();
  const nav = useNavigate();

  const recipe = useMemo(
    () => RECIPES.find((r) => r.id === recipeId) ?? RECIPES[0],
    [recipeId]
  );

  const steps = recipe.steps;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const goNext = () => setCurrentIndex((i) => Math.min(steps.length - 1, i + 1));

  return (
    <div className="cookApp">
      <header className="cookTopbar">
        <button className="cookBack" onClick={() => nav("/")}>
          ←
        </button>
        <div className="cookTitle">{recipe.title}</div>

        {/* remove the counter here if you only want "Step X" in the pill */}
        <div className="cookSpacer" />
      </header>

      <main className="cookMain">
        <section className="cameraStage">
          <Camera />

          {/* Instruction pill overlay */}
          <div className="nowOverlay">
            <Instructions
              steps={steps}
              currentIndex={currentIndex}
              onPrev={goPrev}
              onNext={goNext}
            />
          </div>

          {/* Talk button floats bottom center */}
          <div className="talkButtonWrap">
            <TalkButton autoStopMs={8000} />
          </div>

        </section>
      </main>
    </div>
  );
}
