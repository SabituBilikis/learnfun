import { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate, Outlet, useNavigate } from "react-router";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";
import { AppSplash } from "@/components/feedback/AppSplash";
import { ScreenTimeEnforcer } from "@/components/layout/ScreenTimeEnforcer";
import { useProgress } from "@/hooks/useProgress";
import { MarketingMeasurement } from "@/components/MarketingMeasurement";

// Load page and game code only when its route is opened. This keeps the first
// visit to a public page from downloading every lesson and mini-game.
const HomeScreen = lazy(() => import("@/features/home/HomeScreen").then(m => ({ default: m.HomeScreen })));
const LandingPage = lazy(() => import("@/features/landing/LandingPage").then(m => ({ default: m.LandingPage })));
const FeaturePhonicsPage = lazy(() => import("@/features/seo/FeaturePhonicsPage").then(m => ({ default: m.FeaturePhonicsPage })));
const FeatureAlphabetPage = lazy(() => import("@/features/seo/FeatureAlphabetPage").then(m => ({ default: m.FeatureAlphabetPage })));
const FeatureNumbersPage = lazy(() => import("@/features/seo/FeatureNumbersPage").then(m => ({ default: m.FeatureNumbersPage })));
const OfflineEducationalAppsGuidePage = lazy(() => import("@/features/seo/OfflineEducationalAppsGuidePage").then(m => ({ default: m.OfflineEducationalAppsGuidePage })));
const BlogHubPage = lazy(() => import("@/features/blog/BlogPages").then(m => ({ default: m.BlogHubPage })));
const OfflineLearningArticlePage = lazy(() => import("@/features/blog/BlogPages").then(m => ({ default: m.OfflineLearningArticlePage })));
const AlphabetRoute = lazy(() => import("@/app/routes/alphabetRoutes").then(m => ({ default: m.AlphabetRoute })));
const LetterLessonRoute = lazy(() => import("@/app/routes/alphabetRoutes").then(m => ({ default: m.LetterLessonRoute })));
const CompleteRoute = lazy(() => import("@/app/routes/alphabetRoutes").then(m => ({ default: m.CompleteRoute })));
const PhonicsRoute = lazy(() => import("@/app/routes/phonicsRoutes").then(m => ({ default: m.PhonicsRoute })));
const PhonicsLessonRoute = lazy(() => import("@/app/routes/phonicsRoutes").then(m => ({ default: m.PhonicsLessonRoute })));
const NumbersRoute = lazy(() => import("@/app/routes/numbersRoutes").then(m => ({ default: m.NumbersRoute })));
const NumberLessonRoute = lazy(() => import("@/app/routes/numbersRoutes").then(m => ({ default: m.NumberLessonRoute })));
const NumberCompleteRoute = lazy(() => import("@/app/routes/numbersRoutes").then(m => ({ default: m.NumberCompleteRoute })));
const CategoryRoute = lazy(() => import("@/app/routes/categoryRoutes").then(m => ({ default: m.CategoryRoute })));
const CategoryLessonRoute = lazy(() => import("@/app/routes/categoryRoutes").then(m => ({ default: m.CategoryLessonRoute })));
const CategoryCompleteRoute = lazy(() => import("@/app/routes/categoryRoutes").then(m => ({ default: m.CategoryCompleteRoute })));
const GamesRoute = lazy(() => import("@/app/routes/gamesRoute").then(m => ({ default: m.GamesRoute })));
const ParentRoute = lazy(() => import("@/app/routes/parentRoutes").then(m => ({ default: m.ParentRoute })));

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

// This layout stays mounted between Play routes and resets when Play is exited.
function PlaySession() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ScreenTimeEnforcer />
      <Suspense fallback={<div style={{ height: "100dvh", background: "#F3EEFF" }} />}>
        <Outlet />
      </Suspense>
      {showSplash && <AppSplash onDone={() => setShowSplash(false)} />}
    </>
  );
}

export default function App() {
  const navigate = useNavigate();
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

  return (
    <ErrorBoundary>
      <MarketingMeasurement />
      <Suspense fallback={<div style={{ height: "100dvh", background: "#F3EEFF" }} />}>
        <Routes>
          {/* Root marketing landing page on web, direct game launch on native mobile */}
          <Route path="/" element={isNative ? <Navigate to="/play" replace /> : <LandingPage />} />

          {/* SEO Feature Hubs */}
          <Route path="/features/phonics" element={<FeaturePhonicsPage />} />
          <Route path="/features/alphabet" element={<FeatureAlphabetPage />} />
          <Route path="/features/numbers" element={<FeatureNumbersPage />} />
          <Route path="/guides/offline-educational-apps-toddlers" element={<OfflineEducationalAppsGuidePage />} />
          <Route path="/blog" element={<BlogHubPage />} />
          <Route path="/blog/offline-learning-apps-for-toddlers" element={<OfflineLearningArticlePage />} />

          {/* Main Interactive Learning App / Game Routes */}
          <Route element={<PlaySession />}>
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
          </Route>

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
