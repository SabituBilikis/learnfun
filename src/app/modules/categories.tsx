import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { C } from "../constants";
import { BackButton, ProgressTrack, StatPill, CTAButton, SoundRings } from "./primitives";
import { NumState } from "./numbers";
import { speak } from "../../lib/speech";
import categoriesData from "../../data/categories.json";
import { LessonShell } from "../../features/lesson/LessonShell";
import { TapRevealPanel } from "../../features/lesson/panels/TapRevealPanel";
import { ColorSwatchPanel } from "../../features/lesson/panels/ColorSwatchPanel";
import { ShapeTapPanel } from "../../features/lesson/panels/ShapeTapPanel";
import { SequencePanel } from "../../features/lesson/panels/SequencePanel";

// ── Data interfaces ───────────────────────────────────────────────────────────
export type PanelType = "tap-reveal" | "color-swatch" | "shape-tap" | "sequence";

export interface CatEntry {
  name: string;
  emoji: string;
  color: string;
  dark: string;
  panelEmojis?: string[];
  soundWord?: string;
  shapeType?: string;
  /** Spoken fun-fact for the shape tap interaction. */
  fact?: string;
}

export interface CatDef {
  id: string;
  title: string;
  icon: string;
  color: string;
  dark: string;
  panelType: PanelType;
  entries: CatEntry[];
}

// ── Category registry — content lives in src/data/categories.json ─────────────
export const CAT_REGISTRY: CatDef[] = categoriesData as CatDef[];

// Components moved to src/features/lesson/panels

// ── GiantCatItem — the main visual card (like GiantNumber) ────────────────────
function GiantCatItem({ entry, onClick, pulsing }: {
  entry: CatEntry; onClick: () => void; pulsing: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        <SoundRings active={pulsing} />
        <motion.button onClick={onClick}
          className="relative z-10 flex items-center justify-center rounded-3xl w-[clamp(130px,17vw,200px)] h-[clamp(130px,17vw,200px)] bg-white/95 border-[5px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] cursor-pointer"
          animate={pulsing?{ scale:[1,1.07,1] }:{ scale:1 }}
          transition={{ duration:0.38, repeat:pulsing?Infinity:0 }}
          whileHover={{ scale:1.07 }} whileTap={{ scale:0.91 }}>
          <span className="text-[clamp(56px,9vw,88px)] leading-none">{entry.emoji}</span>
        </motion.button>
      </div>
      <motion.div className="px-6 py-2 rounded-2xl bg-white/20 border-2 border-white/50 backdrop-blur-[6px]"
        animate={{ opacity:[0.85,1,0.85] }} transition={{ duration:2.4, repeat:Infinity }}>
        <span className="font-fredoka font-bold text-[clamp(16px,2.2vw,26px)] text-white tracking-wide">
          {entry.name}
        </span>
      </motion.div>
      {!pulsing && (
        <motion.span className="font-nunito text-[12px] text-white/55"
          animate={{ opacity:[0.4,0.8,0.4] }} transition={{ duration:2.2, repeat:Infinity }}>
          🔊 Tap to hear
        </motion.span>
      )}
    </div>
  );
}

// ── CatMascot — adapts bubble message to category context ────────────────────
function CatMascot({ reacting, catId }: { reacting: boolean; catId: string }) {
  const msgs: Record<string, string> = {
    shapes:"What shape is this? 🔷", colors:"What color is it? 🎨", animals:"What does it say? 🐾",
    fruits:"How many are there? 🍎", vehicles:"Vroom vroom! 🚗", school:"Let's learn! 📚",
    home:"Look around! 🏠", body:"Point to it! 👆", months:"What month? 📅", days:"Which day? 📆",
  };
  const msg = reacting ? "Amazing! 🌟" : (msgs[catId] || "Let's learn! 📚");
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.span className="select-none block text-[clamp(50px,8.5vw,108px)] leading-none drop-shadow-[2px_4px_0_rgba(26,0,80,0.3)]"
        animate={reacting?{ scale:[1,1.3,1], rotate:[-12,12,0] }:{ y:[0,-10,0] }}
        transition={reacting?{ duration:0.45 }:{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
        🦊
      </motion.span>
      <motion.div className="relative px-4 py-2 rounded-2xl text-center bg-white border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] min-w-[88px]"
        animate={reacting?{ scale:[0.85,1.12,1] }:{}} transition={{ duration:0.35 }}>
        <div className="absolute -top-[11px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[11px] border-b-lf-navy" />
        <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[9px] border-b-white" />
        <motion.span key={msg} className={`font-fredoka font-bold text-[clamp(10px,1.3vw,15px)] whitespace-nowrap ${reacting ? 'text-lf-red' : 'text-lf-navy'}`}
          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.2 }}>
          {msg}
        </motion.span>
      </motion.div>
    </div>
  );
}

// ── GenericLessonScreen ───────────────────────────────────────────────────────
export function GenericLessonScreen({ catId, entryIndex, onBack, onComplete, onNavigate }: {
  catId: string; entryIndex: number; onBack: () => void; onComplete: () => void; onNavigate: (i: number) => void;
}) {
  const [playing,  setPlaying]  = useState(false);
  const [burst,    setBurst]    = useState(0);
  const [reacting, setReacting] = useState(false);
  const [, setTapCount] = useState(0);

  const cat   = CAT_REGISTRY.find(c => c.id === catId)!;
  const entry = cat.entries[entryIndex];

  useEffect(() => {
    setPlaying(false); setBurst(0); setReacting(false); setTapCount(0);
  }, [catId, entryIndex]);

  const speakEntry = () => {
    if (playing) return;
    setPlaying(true); setBurst(b => b+1); setReacting(true);
    const spoke = speak(entry.soundWord || entry.name, {
      rate: 0.7, pitch: 1.25, onEnd: () => setPlaying(false),
    });
    if (!spoke) setTimeout(() => setPlaying(false), 1200);
    setTimeout(() => setReacting(false), 1000);
  };

  function renderPanel() {
    switch (cat.panelType) {
      case "tap-reveal":    return <TapRevealPanel items={entry.panelEmojis || []} color={entry.color} onCountChange={setTapCount} />;
      case "color-swatch":  return <ColorSwatchPanel entry={entry} onCountChange={setTapCount} />;
      case "shape-tap":     return <ShapeTapPanel entry={entry} onCountChange={setTapCount} />;
      case "sequence":      return <SequencePanel entries={cat.entries} currentIndex={entryIndex} color={entry.color} onCountChange={setTapCount} />;
    }
  }

  return (
    <LessonShell
      color={entry.color}
      dark={entry.dark}
      letterBg={entry.emoji}
      emojiBg={entry.emoji}
      currentIndex={entryIndex}
      totalEntries={cat.entries.length}
      playing={playing}
      burstCount={burst}
      onBack={onBack}
      onComplete={onComplete}
      onNavigate={onNavigate}
      onSpeak={speakEntry}
      mascotNode={<CatMascot reacting={reacting} catId={catId} />}
      mainNode={<GiantCatItem entry={entry} onClick={speakEntry} pulsing={playing} />}
      panelNode={renderPanel()}
    />
  );
}

// ── GenericCategoryPage (the lesson grid) ────────────────────────────────────
export function GenericCategoryPage({ catId, onBack, onContinue, learnedCount }: {
  catId: string; onBack: () => void; onContinue: () => void; learnedCount: number;
}) {
  const cat   = CAT_REGISTRY.find(c => c.id === catId)!;
  const total = cat.entries.length;
  const learned = learnedCount;
  const pct = Math.round((learned / total) * 100);

  return (
    <div className="flex flex-col h-screen font-fredoka font-nunito bg-gradient-to-b from-[#F0F4FF] via-[#FFFFFF] via-[55%] to-white">
      {/* Hero */}
      <div className="relative overflow-hidden flex-shrink-0 border-b-[3px] border-b-lf-navy px-[clamp(16px,3vw,40px)] py-[clamp(14px,2.5vw,24px)] shadow-[0_4px_0_var(--color-lf-navy)]"
        style={{ background:`linear-gradient(135deg,${cat.color} 0%,${cat.dark} 100%)` }}>
        <div className="flex items-center justify-between">
          <div>
            <BackButton onClick={onBack} />
            <h1 className="font-fredoka font-bold text-[clamp(22px,5vw,34px)] text-white mt-2 leading-none">
              {cat.icon} {cat.title}
            </h1>
            <p className="font-nunito text-[13px] text-white/75 mt-1">
              {learned} of {total} learned — keep going!
            </p>
          </div>
          <motion.span className="text-[clamp(48px,9vw,76px)]"
            animate={{ y:[0,-8,0], rotate:[0,-5,5,0] }} transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}>
            {cat.icon}
          </motion.span>
        </div>
        <div className="mt-3">
          <ProgressTrack progress={pct} color="rgba(255,255,255,0.9)" height={8} label={`${learned} of ${total} learned`} />
        </div>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <StatPill emoji="✅" value={String(learned)} label="Learned"  valueColor={C.yellow} />
          <StatPill emoji="⭐" value="56"              label="Stars"    valueColor={C.yellow} />
          <StatPill emoji="📖" value={String(total)}   label="Total"    valueColor="#FFF" />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto lf-carousel px-[clamp(16px,3vw,40px)] py-[clamp(14px,2.5vw,24px)]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(clamp(80px,12vw,110px),1fr))] gap-[clamp(8px,1.5vw,14px)] mb-6">
          {cat.entries.map((entry, i) => {
            const state: NumState = i < learned ? "complete" : i === learned ? "current" : "upcoming";
            return (
              <motion.button key={entry.name} onClick={state !== "upcoming" ? onContinue : undefined}
                className={`flex flex-col items-center rounded-3xl overflow-hidden relative gap-1.5 px-[clamp(8px,1.5vw,12px)] py-[clamp(10px,2vw,16px)] border-[2.5px] ${
                  state==="upcoming" ? "bg-lf-muted border-lf-muted cursor-default" :
                  state==="current" ? "bg-white border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)] cursor-pointer" :
                  "cursor-pointer"
                }`}
                style={{
                  ...(state==="complete" ? { backgroundColor: `${entry.color}22`, borderColor: entry.color, boxShadow: `3px 4px 0 ${entry.color}66` } : {})
                }}
                initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay:i*0.02, type:"spring", stiffness:280, damping:22 }}
                whileHover={state!=="upcoming"?{ scale:1.06 }:{}} whileTap={state!=="upcoming"?{ scale:0.94 }:{}}>
                {state==="complete" && (
                  <div className="absolute top-1.5 right-1.5 rounded-full flex items-center justify-center w-[18px] h-[18px]" style={{ background:entry.color }}>
                    <Check size={9} color="#FFF" strokeWidth={3} />
                  </div>
                )}
                {state==="current" && (
                  <motion.div className="absolute top-1.5 right-1.5 rounded-full w-2 h-2 bg-lf-orange"
                    animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }} transition={{ duration:1.2, repeat:Infinity }} />
                )}
                <span className={`text-[clamp(24px,4.5vw,32px)] leading-none ${state==="upcoming" ? "grayscale opacity-25" : ""}`}>{entry.emoji}</span>
                <span className={`font-fredoka font-bold text-[clamp(9px,1.4vw,13px)] text-center leading-[1.2] ${state==="upcoming" ? "text-lf-mutedFg" : "text-lf-navy"}`}>
                  {state==="upcoming" ? "Locked" : entry.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex-shrink-0 px-5 pb-5 pt-2 border-t-2 border-t-lf-muted">
        <CTAButton label={`Continue: ${cat.entries[learned]?.name ?? cat.entries[cat.entries.length-1].name} →`} color={cat.color} onClick={onContinue} />
      </div>
    </div>
  );
}
