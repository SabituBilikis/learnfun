import { useState } from "react";
import { useNavigate } from "react-router";
import { CAT_REGISTRY } from "@/app/modules/categories";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { SettingsModal } from "@/features/settings/SettingsModal";
import { GreetingBanner } from "./GreetingBanner";
import { Carousel } from "./Carousel";

export function HomeScreen() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNavigate = (id: string) => {
    if (id === "alphabet") { navigate("/play/alphabet"); return; }
    if (id === "phonics")  { navigate("/play/phonics");  return; }
    if (id === "numbers")  { navigate("/play/numbers");  return; }
    if (CAT_REGISTRY.some(c => c.id === id)) navigate(`/play/category/${id}`);
  };

  return (
    <div className="relative overflow-hidden h-[100dvh] min-h-screen font-fredoka bg-white">
      {/* Hide webkit scrollbar globally for carousel */}
      <style>{`.lf-carousel::-webkit-scrollbar{display:none}.lf-carousel{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* ── Top navigation ──────────────────────────────── */}
      <TopNav onInstall={() => navigate("/play/pwa")} onSettings={() => setSettingsOpen(true)} onParent={() => navigate("/play/parent")} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* ── Main content ────────────────────────────────── */}
      <div className="absolute left-0 right-0 flex flex-col justify-center gap-3 top-[72px] bottom-[62px] z-20 px-[clamp(12px,3vw,56px)] py-2">
        <GreetingBanner />
        <Carousel onNavigate={handleNavigate} />
      </div>

      {/* ── Bottom navigation ───────────────────────────── */}
      <BottomNav onGames={() => navigate("/play/games")} onRewards={() => navigate("/play/rewards")} onLearn={() => navigate("/play/journey")} onParent={() => navigate("/play/parent")} />
    </div>
  );
}
