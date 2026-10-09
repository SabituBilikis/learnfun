import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { AppSplash } from "@/components/feedback/AppSplash";
import { ScreenTimeEnforcer } from "@/components/layout/ScreenTimeEnforcer";
import { HomeScreen } from "@/features/home/HomeScreen";
import { LandingPage } from "@/features/landing/LandingPage";
import { FeaturePhonicsPage } from "@/features/seo/FeaturePhonicsPage";
import { FeatureAlphabetPage } from "@/features/seo/FeatureAlphabetPage";
import { FeatureNumbersPage } from "@/features/seo/FeatureNumbersPage";
import { useProgress } from "@/hooks/useProgress";

import { AlphabetRoute, LetterLessonRoute, CompleteRoute } from "@/app/routes/alphabetRoutes";
import { PhonicsRoute, PhonicsLessonRoute } from "@/app/routes/phonicsRoutes";
import { NumbersRoute, NumberLessonRoute, NumberCompleteRoute } from "@/app/routes/numbersRoutes";
import { CategoryRoute, CategoryLessonRoute, CategoryCompleteRoute } from "@/app/routes/categoryRoutes";
import { GamesRoute } from "@/app/routes/gamesRoute";
import { ParentRoute } from "@/app/routes/parentRoutes";

// Lazy-loaded flows
const RewardsPage     = lazy(() => import("@/app/modules/rewards").then(m => ({ default: m.RewardsPage })));
const MemoryMatchGame = lazy(() => import("@/app/modules/memoryMatch").then(m => ({ default: m.MemoryMatchGame })));
const DragDropGame    = lazy(() => import("@/app/modules/dragDrop").then(m => ({ default: m.DragDropGame })));
const FindObjectGame  = lazy(() => import("@/app/modules/findObject").then(m => ({ default: m.FindObjectGame })));
const BalloonPopGame  = lazy(() => import("@/app/modules/balloonPop").then(m => ({ default: m.BalloonPopGame })));
const PuzzleGame      = lazy(() => import("@/app/modules/puzzle").then(m => ({ default: m.PuzzleGame })));
const ShadowMatchGame = lazy(() => import("@/app/modules/shadowMatch").then(m => ({ default: m.ShadowMatchGame })));
const PWAFlow         = lazy(() => import("@/app/modules/pwaFlow").then(m => ({ default: m.PWAFlow })));
const JourneyFlow     = lazy(() => import("@/app/modules/journey").then(m => ({ default: m.JourneyFlow })));
const AudioDiagnosticScreen = import.meta.env.DEV
  ? lazy(() => import("@/features/development/AudioDiagnosticScreen").then(m => ({ default: m.AudioDiagnosticScreen })))
  : null;

export default function App() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const touchDailyStreak = useProgress((s) => s.touchDailyStreak);
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    touchDailyStreak();
  }, [touchDailyStreak]);

  useEffect(() => {
    if (!isNative) return;

    const backButtonListener = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        void CapacitorApp.exitApp();
      }
    });

    return () => {
      void backButtonListener.then((listener) => listener.remove());
    };
  }, [isNative]);

  useEffect(() => {
    if (!showSplash) return;
    const t = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(t);
  }, [showSplash]);

  return (
    <ErrorBoundary>
      {showSplash && <AppSplash onDone={() => setShowSplash(false)} />}
      <ScreenTimeEnforcer />
      <Suspense fallback={<div style={{ height: "100dvh", background: "#F3EEFF" }} />}>
        <Routes>
          {/* Root marketing landing page on web, direct game launch on native mobile */}
          <Route path="/" element={isNative ? <Navigate to="/play" replace /> : <LandingPage />} />

          {/* SEO Feature Hubs */}
          <Route path="/features/phonics" element={<FeaturePhonicsPage />} />
          <Route path="/features/alphabet" element={<FeatureAlphabetPage />} />
          <Route path="/features/numbers" element={<FeatureNumbersPage />} />

          {/* Main Interactive Learning App / Game Routes */}
          <Route path="/play" element={<HomeScreen />} />
          <Route path="/play/phonics" element={<PhonicsRoute />} />
          <Route path="/play/phonics/lesson/:index" element={<PhonicsLessonRoute />} />
          <Route path="/play/alphabet" element={<AlphabetRoute />} />
          <Route path="/play/alphabet/lesson/:index" element={<LetterLessonRoute />} />
          <Route path="/play/complete/:index" element={<CompleteRoute />} />
          <Route path="/play/numbers" element={<NumbersRoute />} />
          <Route path="/play/numbers/lesson/:index" element={<NumberLessonRoute />} />
          <Route path="/play/numbers/complete/:index" element={<NumberCompleteRoute />} />
          <Route path="/play/category/:catId" element={<CategoryRoute />} />
          <Route path="/play/category/:catId/lesson/:index" element={<CategoryLessonRoute />} />
          <Route path="/play/category/:catId/complete/:index" element={<CategoryCompleteRoute />} />
          <Route path="/play/games" element={<GamesRoute />} />
          <Route path="/play/games/memory" element={<MemoryMatchGame onBack={() => navigate("/play/games")} />} />
          <Route path="/play/games/drag" element={<DragDropGame onBack={() => navigate("/play/games")} />} />
          <Route path="/play/games/find" element={<FindObjectGame onBack={() => navigate("/play/games")} />} />
          <Route path="/play/games/balloon" element={<BalloonPopGame onBack={() => navigate("/play/games")} />} />
          <Route path="/play/games/puzzle" element={<PuzzleGame onBack={() => navigate("/play/games")} />} />
          <Route path="/play/games/shadow" element={<ShadowMatchGame onBack={() => navigate("/play/games")} />} />
          <Route path="/play/rewards" element={<RewardsPage onBack={() => navigate("/play")} />} />
          <Route path="/play/journey" element={<JourneyFlow onExit={() => navigate("/play")} />} />
          <Route path="/play/pwa" element={<PWAFlow onDone={() => navigate("/play")} />} />
          <Route path="/play/parent" element={<ParentRoute />} />

          {/* Backward compatibility redirects */}
          <Route path="/phonics" element={<Navigate to="/play/phonics" replace />} />
          <Route path="/alphabet" element={<Navigate to="/play/alphabet" replace />} />
          <Route path="/numbers" element={<Navigate to="/play/numbers" replace />} />
          <Route path="/games" element={<Navigate to="/play/games" replace />} />
          <Route path="/rewards" element={<Navigate to="/play/rewards" replace />} />
          <Route path="/parent" element={<Navigate to="/play/parent" replace />} />
          <Route path="/category/:catId" element={<CategoryRoute />} />

          {AudioDiagnosticScreen && <Route path="/__audio-diagnostic" element={<AudioDiagnosticScreen />} />}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
