import { useNavigate, useParams } from "react-router";
import { useProgress } from "@/hooks/useProgress";
import { parseIndexParam } from "@/lib/helpers";
import { NumbersPage, NumberLessonScreen, NUMBER_DATA } from "@/app/modules/numbers";

export function NumbersRoute() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  return (
    <NumbersPage
      onBack={() => navigate("/")}
      onContinue={() => navigate(`/numbers/lesson/${progress.numbersLearned}`)}
      learnedCount={progress.numbersLearned}
    />
  );
}

export function NumberLessonRoute() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();
  const { index } = useParams();
  const numIndex = parseIndexParam(index, NUMBER_DATA.length);
  return (
    <NumberLessonScreen
      numIndex={numIndex}
      onBack={() => navigate("/")}
      onComplete={() => {
        updateProgress(p => ({ ...p, numbersLearned: Math.max(p.numbersLearned, numIndex + 1), starsTotal: p.starsTotal + 3 }));
        navigate("/complete/0");
      }}
      onNavigate={(i) => navigate(`/numbers/lesson/${i}`)}
    />
  );
}
