import { useNavigate, useParams } from "react-router";
import { useProgress } from "@/hooks/useProgress";
import { parseIndexParam } from "@/lib/helpers";
import { NumbersPage, NumberLessonScreen, NUMBER_DATA } from "@/app/modules/numbers";
import { LessonCompleteScreen } from "@/app/modules/lessonComplete";

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
        navigate(`/numbers/complete/${numIndex}`);
      }}
      onNavigate={(i) => navigate(`/numbers/lesson/${i}`)}
    />
  );
}

export function NumberCompleteRoute() {
  const navigate = useNavigate();
  const { index } = useParams();
  const numIndex = parseIndexParam(index, NUMBER_DATA.length);
  const entry = NUMBER_DATA[numIndex];
  const next = numIndex < NUMBER_DATA.length - 1 ? NUMBER_DATA[numIndex + 1] : null;

  return (
    <LessonCompleteScreen
      item={{
        title: String(entry.n),
        word: entry.word,
        emoji: entry.emoji,
        label: `${entry.word} · Mastered!`,
        nextLabel: next ? `${next.n} ${next.emoji}` : undefined,
      }}
      onPlayAgain={() => navigate(`/numbers/lesson/${numIndex}`)}
      onCategories={() => navigate("/")}
      onContinue={next ? () => navigate(`/numbers/lesson/${numIndex + 1}`) : undefined}
    />
  );
}
