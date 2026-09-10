import { useNavigate, useParams, Navigate } from "react-router";
import { useProgress } from "@/hooks/useProgress";
import { parseIndexParam } from "@/lib/helpers";
import { CAT_REGISTRY, GenericCategoryPage, GenericLessonScreen } from "@/app/modules/categories";
import { LessonCompleteScreen } from "@/app/modules/lessonComplete";

export function CategoryRoute() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { catId } = useParams();
  if (!catId || !CAT_REGISTRY.some(c => c.id === catId)) return <Navigate to="/" replace />;
  const learnedCount = progress.catProgress[catId] ?? 0;
  return (
    <GenericCategoryPage
      catId={catId}
      onBack={() => navigate("/")}
      onContinue={() => navigate(`/category/${catId}/lesson/${learnedCount}`)}
      learnedCount={learnedCount}
    />
  );
}

export function CategoryLessonRoute() {
  const navigate = useNavigate();
  const { updateProgress } = useProgress();
  const { catId, index } = useParams();
  const cat = CAT_REGISTRY.find(c => c.id === catId);
  if (!cat) return <Navigate to="/" replace />;
  const entryIndex = parseIndexParam(index, cat.entries.length);
  return (
    <GenericLessonScreen
      catId={cat.id}
      entryIndex={entryIndex}
      onBack={() => navigate("/")}
      onComplete={() => {
        updateProgress(p => ({
          ...p,
          catProgress: { ...p.catProgress, [cat.id]: Math.max(p.catProgress[cat.id] ?? 0, entryIndex + 1) },
          starsTotal: p.starsTotal + 3,
        }));
        navigate(`/category/${cat.id}/complete/${entryIndex}`);
      }}
      onNavigate={(i) => navigate(`/category/${cat.id}/lesson/${i}`)}
    />
  );
}

export function CategoryCompleteRoute() {
  const navigate = useNavigate();
  const { catId, index } = useParams();
  const cat = CAT_REGISTRY.find(c => c.id === catId);
  if (!cat) return <Navigate to="/" replace />;
  const entryIndex = parseIndexParam(index, cat.entries.length);
  const entry = cat.entries[entryIndex];
  const next = entryIndex < cat.entries.length - 1 ? cat.entries[entryIndex + 1] : null;

  return (
    <LessonCompleteScreen
      item={{
        title: entry.name,
        word: entry.name,
        emoji: entry.emoji,
        label: `${entry.name} · Mastered!`,
        nextLabel: next ? `${next.name} ${next.emoji}` : undefined,
      }}
      onPlayAgain={() => navigate(`/category/${cat.id}/lesson/${entryIndex}`)}
      onCategories={() => navigate("/")}
      onContinue={next ? () => navigate(`/category/${cat.id}/lesson/${entryIndex + 1}`) : undefined}
    />
  );
}
