import { useNavigate, useParams, Navigate } from "react-router";
import { useProgress } from "@/hooks/useProgress";
import { parseIndexParam } from "@/lib/helpers";
import { CAT_REGISTRY, GenericCategoryPage, GenericLessonScreen } from "@/app/modules/categories";

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
        navigate("/complete/0");
      }}
      onNavigate={(i) => navigate(`/category/${cat.id}/lesson/${i}`)}
    />
  );
}
