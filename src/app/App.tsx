import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { AppSplash } from "@/components/feedback/AppSplash";
import { HomeScreen } from "@/features/home/HomeScreen";
import { useProgress } from "@/hooks/useProgress";

// Routes
import { AlphabetRoute, LetterLessonRoute, CompleteRoute } from "@/app/routes/alphabetRoutes";
import { NumbersRoute, NumberLessonRoute } from "@/app/routes/numbersRoutes";
import { CategoryRoute, CategoryLessonRoute } from "@/app/routes/categoryRoutes";
import { GamesRoute } from "@/app/routes/gamesRoute";
import { ParentRoute } from "@/app/routes/parentRoutes";

// Lazy-loaded flows
const RewardsPage    = lazy(() => import("@/app/modules/rewards").then(m => ({ default: m.RewardsPage })));
const MemoryMatchGame = lazy(() => import("@/app/modules/memoryMatch").then(m => ({ default: m.MemoryMatchGame })));
const DragDropGame   = lazy(() => import("@/app/modules/dragDrop").then(m => ({ default: m.DragDropGame })));
const FindObjectGame = lazy(() => import("@/app/modules/findObject").then(m => ({ default: m.FindObjectGame })));
const BalloonPopGame = lazy(() => import("@/app/modules/balloonPop").then(m => ({ default: m.BalloonPopGame })));
const PuzzleGame     = lazy(() => import("@/app/modules/puzzle").then(m => ({ default: m.PuzzleGame })));
const ShadowMatchGame= lazy(() => import("@/app/modules/shadowMatch").then(m => ({ default: m.ShadowMatchGame })));
const PWAFlow        = lazy(() => import("@/app/modules/pwaFlow").then(m => ({ default: m.PWAFlow })));
const JourneyFlow    = lazy(() => import("@/app/modules/journey").then(m => ({ default: m.JourneyFlow })));

export default function App() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const touchDailyStreak = useProgress((s) => s.touchDailyStreak);

  useEffect(() => {
    touchDailyStreak();
  }, [touchDailyStreak]);

  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(t);
  }, [showSplash]);

  return (
    <ErrorBoundary>
      {showSplash && <AppSplash onDone={() => setShowSplash(false)} />}
      <Suspense fallback={<div style={{ height: "100dvh", background: "#F3EEFF" }} />}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/alphabet" element={<AlphabetRoute />} />
          <Route path="/alphabet/lesson/:index" element={<LetterLessonRoute />} />
          <Route path="/complete/:index" element={<CompleteRoute />} />
          <Route path="/numbers" element={<NumbersRoute />} />
          <Route path="/numbers/lesson/:index" element={<NumberLessonRoute />} />
          <Route path="/category/:catId" element={<CategoryRoute />} />
          <Route path="/category/:catId/lesson/:index" element={<CategoryLessonRoute />} />
          <Route path="/games" element={<GamesRoute />} />
          <Route path="/games/memory" element={<MemoryMatchGame onBack={() => navigate("/games")} />} />
          <Route path="/games/drag" element={<DragDropGame onBack={() => navigate("/games")} />} />
          <Route path="/games/find" element={<FindObjectGame onBack={() => navigate("/games")} />} />
          <Route path="/games/balloon" element={<BalloonPopGame onBack={() => navigate("/games")} />} />
          <Route path="/games/puzzle" element={<PuzzleGame onBack={() => navigate("/games")} />} />
          <Route path="/games/shadow" element={<ShadowMatchGame onBack={() => navigate("/games")} />} />
          <Route path="/rewards" element={<RewardsPage onBack={() => navigate("/")} />} />
          <Route path="/journey" element={<JourneyFlow onExit={() => navigate("/")} />} />
          <Route path="/pwa" element={<PWAFlow onDone={() => navigate("/")} />} />
          <Route path="/parent" element={<ParentRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
