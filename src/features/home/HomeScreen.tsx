import { useState } from "react";
import { useNavigate } from "react-router";
import { C } from "@/app/constants";
import { CAT_REGISTRY } from "@/app/modules/categories";
import { AmbientSparkles } from "@/components/feedback/Sparkle";
import { TopNav } from "@/components/layout/TopNav";
import { BottomNav } from "@/components/layout/BottomNav";
import { SettingsModal } from "@/features/settings/SettingsModal";
import { GreetingBanner } from "./GreetingBanner";
import { Carousel } from "./Carousel";

export function HomeScreen() {
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleNavigate = (id: string) => {
    if (id === "alphabet") { navigate("/alphabet"); return; }
    if (id === "numbers")  { navigate("/numbers");  return; }
    if (CAT_REGISTRY.some(c => c.id === id)) navigate(`/category/${id}`);
  };

  return (
    <div className="relative overflow-hidden h-[100dvh] min-h-screen font-fredoka bg-white">
      {/* Hide webkit scrollbar globally for carousel */}
      <style>{`.lf-carousel::-webkit-scrollbar{display:none}.lf-carousel{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {/* ── Top navigation ──────────────────────────────── */}
      <TopNav onInstall={() => navigate("/pwa")} onSettings={() => setSettingsOpen(true)} onParent={() => navigate("/parent")} />
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* ── Main content ────────────────────────────────── */}
      <div className="absolute left-0 right-0 flex flex-col justify-center gap-3 top-[72px] bottom-[62px] z-20 px-[clamp(12px,3vw,56px)] py-2">
        <GreetingBanner />
        <Carousel onNavigate={handleNavigate} />
      </div>

      {/* ── Bottom navigation ───────────────────────────── */}
      <BottomNav onGames={() => navigate("/games")} onRewards={() => navigate("/rewards")} onLearn={() => navigate("/journey")} onParent={() => navigate("/parent")} />

      {/* ── Ambient corner sparkles ─────────────────────── */}
      <AmbientSparkles
        zIndex={8}
        rotate={20}
        scaleTo={1.2}
        opacityRange={[0.7, 1]}
        baseDuration={3.5}
        durationStep={0.6}
        spots={[
          { top:"8%",  left:"3%",   size:24, color:C.yellow },
          { top:"15%", right:"4%",  size:18, color:C.pink   },
          { top:"32%", left:"1%",   size:20, color:C.teal   },
          { top:"6%",  left:"48%",  size:14, color:C.orange },
        ]}
      />
    </div>
  );
}
