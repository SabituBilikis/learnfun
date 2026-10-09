import { useNavigate, useParams } from "react-router";
import { useProgress } from "@/hooks/useProgress";
import { parseIndexParam } from "@/lib/helpers";
import { LESSON_LETTERS } from "@/app/constants";
import { AlphabetPage } from "@/app/modules/alphabet";
import { LessonScreen } from "@/app/modules/lessonScreen";
import { LessonCompleteScreen } from "@/app/modules/lessonComplete";

export function AlphabetRoute() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  return (
    <AlphabetPage
      onBack={() => navigate("/play")}
      onContinue={() => navigate(`/play/alphabet/lesson/${progress.lettersLearned}`)}
      onSelectLetter={(i) => navigate(`/play/alphabet/lesson/${i}`)}
      learnedCount={progress.lettersLearned}
    />
  );
}

export function LetterLessonRoute() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();
  const { index } = useParams();
  const letterIndex = parseIndexParam(index, LESSON_LETTERS.length);
  return (
    <LessonScreen
      letterIndex={letterIndex}
      onBack={() => navigate("/play")}
      onComplete={() => {
        updateProgress(p => ({ ...p, lettersLearned: Math.max(p.lettersLearned, letterIndex + 1), starsTotal: p.starsTotal + 3 }));
        navigate(`/play/complete/${letterIndex}`);
      }}
      onNavigate={(i) => navigate(`/play/alphabet/lesson/${i}`)}
    />
  );
}

export function CompleteRoute() {
  const navigate = useNavigate();
  const { index } = useParams();
  const letterIndex = parseIndexParam(index, LESSON_LETTERS.length);
  return (
    <LessonCompleteScreen
      letterIndex={letterIndex}
      onPlayAgain={() => navigate(`/play/alphabet/lesson/${letterIndex}`)}
      onCategories={() => navigate("/play")}
      onContinue={() => navigate(`/play/alphabet/lesson/${Math.min(letterIndex + 1, LESSON_LETTERS.length - 1)}`)}
    />
  );
}
