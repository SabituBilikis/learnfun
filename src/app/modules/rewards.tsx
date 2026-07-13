import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Play } from "lucide-react";
import { C } from "../constants";
import { BackButton, StatPill, Sparkle, AmbientSparkles } from "./primitives";
import { useProgress } from "../../hooks/useProgress";

interface GameDef {
  id: string; title: string; desc: string; tag: string;
  difficulty: 1 | 2 | 3; players: string;
  color: string; dark: string; mid: string;
  scene: { emoji: string; x: string; y: string; size: number; rot: number; delay: number }[];
}

const GAME_DEFS: GameDef[] = [
  {
    id: "memory", title: "Memory Match", desc: "Flip cards and find the matching pairs!", tag: "🧠 Memory",
    difficulty: 1, players: "1–2", color: "#7B2FF7", dark: "#4B0082", mid: "#9B3DEB",
    scene: [
      { emoji:"🃏", x:"18%", y:"22%", size:52, rot:-12, delay:0    },
      { emoji:"🌟", x:"50%", y:"18%", size:60, rot: 0,  delay:0.15 },
      { emoji:"🃏", x:"82%", y:"22%", size:52, rot: 14, delay:0.08 },
      { emoji:"🎴", x:"18%", y:"62%", size:52, rot: 10, delay:0.22 },
      { emoji:"💜", x:"50%", y:"66%", size:58, rot:-5,  delay:0.3  },
      { emoji:"🎴", x:"82%", y:"62%", size:52, rot:-14, delay:0.18 },
    ],
  },
  {
    id: "find", title: "Find the Object", desc: "Spot the hidden item before time runs out!", tag: "👀 Search",
    difficulty: 1, players: "1", color: "#FF9500", dark: "#CC6D00", mid: "#FFB340",
    scene: [
      { emoji:"🐱", x:"20%", y:"25%", size:54, rot:-8,  delay:0    },
      { emoji:"🍎", x:"55%", y:"18%", size:62, rot: 5,  delay:0.12 },
      { emoji:"🌈", x:"82%", y:"28%", size:50, rot:-6,  delay:0.2  },
      { emoji:"🔍", x:"36%", y:"62%", size:66, rot: 0,  delay:0.08 },
      { emoji:"⭐", x:"72%", y:"64%", size:48, rot: 12, delay:0.25 },
    ],
  },
  {
    id: "drag", title: "Drag & Drop", desc: "Move each object to its perfect spot!", tag: "✋ Skills",
    difficulty: 2, players: "1", color: "#007AFF", dark: "#0050CC", mid: "#3DA5FF",
    scene: [
      { emoji:"🎯", x:"72%", y:"24%", size:64, rot: 0,  delay:0    },
      { emoji:"🧩", x:"20%", y:"30%", size:58, rot:-15, delay:0.1  },
      { emoji:"✋", x:"44%", y:"50%", size:70, rot: 5,  delay:0.05 },
      { emoji:"⭐", x:"78%", y:"68%", size:44, rot: 18, delay:0.28 },
      { emoji:"🔵", x:"20%", y:"68%", size:44, rot:-10, delay:0.2  },
    ],
  },
  {
    id: "balloon", title: "Balloon Pop", desc: "Tap every balloon before they float away!", tag: "🎈 Action",
    difficulty: 1, players: "1", color: "#FF2D9B", dark: "#CC1F7A", mid: "#FF69B4",
    scene: [
      { emoji:"🎈", x:"20%", y:"55%", size:62, rot:-8,  delay:0    },
      { emoji:"🎈", x:"50%", y:"22%", size:72, rot: 3,  delay:0.12 },
      { emoji:"🎈", x:"80%", y:"50%", size:58, rot: 10, delay:0.22 },
      { emoji:"💥", x:"35%", y:"65%", size:46, rot:-5,  delay:0.3  },
      { emoji:"🎉", x:"68%", y:"24%", size:46, rot: 15, delay:0.18 },
    ],
  },
  {
    id: "puzzle", title: "Puzzle", desc: "Slide the pieces into the right places!", tag: "🧩 Logic",
    difficulty: 2, players: "1", color: "#00C7BE", dark: "#008F88", mid: "#00E5DB",
    scene: [
      { emoji:"🧩", x:"20%", y:"28%", size:62, rot:-18, delay:0    },
      { emoji:"🧩", x:"56%", y:"20%", size:58, rot: 12, delay:0.15 },
      { emoji:"🧩", x:"80%", y:"42%", size:54, rot:-8,  delay:0.1  },
      { emoji:"🧩", x:"32%", y:"64%", size:56, rot: 20, delay:0.22 },
      { emoji:"🌟", x:"68%", y:"66%", size:50, rot: 0,  delay:0.28 },
    ],
  },
  {
    id: "shadow", title: "Shadow Match", desc: "Match the silhouette to the right object!", tag: "🌑 Tricky",
    difficulty: 3, players: "1", color: "#3A1FA0", dark: "#1A0050", mid: "#5C35CC",
    scene: [
      { emoji:"🦁", x:"22%", y:"24%", size:60, rot:-10, delay:0    },
      { emoji:"🐘", x:"60%", y:"18%", size:58, rot:  6, delay:0.14 },
      { emoji:"🦋", x:"82%", y:"46%", size:54, rot: 14, delay:0.2  },
      { emoji:"🌑", x:"38%", y:"62%", size:66, rot:  0, delay:0.08 },
      { emoji:"❓", x:"74%", y:"66%", size:50, rot: -8, delay:0.26 },
    ],
  },
];

// ── Difficulty indicator ──────────────────────────────────────────────────────
function DiffBadge({ level }: { level: 1 | 2 | 3 }) {
  const cfg = { 1: { label:"Easy",   color:C.green,  bg:"rgba(52,199,89,0.22)"  },
                2: { label:"Medium", color:C.orange, bg:"rgba(255,149,0,0.22)"  },
                3: { label:"Hard",   color:C.red,    bg:"rgba(255,59,48,0.22)"  } }[level];
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}` }}>
      <div className="flex gap-0.5">
        {[1,2,3].map(n => (
          <div key={n} className="rounded-full" style={{ width:7, height:7, background: n <= level ? cfg.color : "rgba(255,255,255,0.2)" }} />
        ))}
      </div>
      <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:12, color:cfg.color }}>{cfg.label}</span>
    </div>
  );
}

// ── Game card ─────────────────────────────────────────────────────────────────
function GameCard({ game, index, onPlay }: { game: GameDef; index: number; onPlay?: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      className="relative rounded-3xl overflow-hidden cursor-pointer select-none flex flex-col"
      style={{
        minHeight: "clamp(260px,32vw,400px)",
        border: `3px solid ${C.navy}`,
        boxShadow: `5px 7px 0 ${C.navy}`,
      }}
      initial={{ opacity:0, y:36, scale:0.88 }}
      animate={{ opacity:1, y:0,  scale:1    }}
      transition={{ delay: index * 0.07, type:"spring", stiffness:280, damping:22 }}
      whileHover={{ scale:1.03 }}
      whileTap={{ scale:0.97 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => onPlay?.(game.id)}
    >
      {/* ── Full-bleed illustration ── */}
      <div className="relative flex-1 overflow-hidden"
        style={{ background:`linear-gradient(150deg,${game.color} 0%,${game.dark} 100%)`, minHeight:"clamp(160px,22vw,280px)" }}>

        {/* Radial spotlight */}
        <div className="absolute inset-0" style={{ background:"radial-gradient(ellipse at 50% 40%,rgba(255,255,255,0.18) 0%,transparent 65%)" }} />

        {/* Scene emojis */}
        {game.scene.map((s, i) => (
          <motion.span key={i} className="absolute pointer-events-none select-none"
            style={{ left:s.x, top:s.y, fontSize:s.size, lineHeight:1, transform:`rotate(${s.rot}deg)`, filter:"drop-shadow(2px 4px 0 rgba(26,0,80,0.3))" }}
            animate={hovered
              ? { y:[0,-10,0], rotate:[s.rot, s.rot+6, s.rot] }
              : { y:[0,-5,0]  }}
            transition={{ duration:2.4+s.delay*1.2, delay:s.delay, repeat:Infinity, ease:"easeInOut" }}
          >{s.emoji}</motion.span>
        ))}

        {/* Tag — top left */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl"
          style={{ background:"rgba(26,0,80,0.32)", border:"1.5px solid rgba(255,255,255,0.4)", backdropFilter:"blur(8px)" }}>
          <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:12, color:C.white }}>{game.tag}</span>
        </div>

        {/* Players — top right */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl flex items-center gap-1"
          style={{ background:"rgba(255,255,255,0.18)", border:"1.5px solid rgba(255,255,255,0.45)", backdropFilter:"blur(8px)" }}>
          <Users size={11} color={C.white} />
          <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:11, color:C.white }}>{game.players}</span>
        </div>

        {/* Bottom gradient for text legibility */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height:"55%", background:`linear-gradient(to top,${game.dark}EE 0%,transparent 100%)` }} />
      </div>

      {/* ── Info strip ── */}
      <div className="flex items-center justify-between gap-3 flex-shrink-0"
        style={{ background:C.white, padding:"clamp(10px,1.4vw,16px) clamp(12px,1.6vw,18px)", borderTop:`2.5px solid ${C.navy}` }}>
        <div className="min-w-0">
          <h3 className="truncate" style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(14px,1.5vw,20px)", color:C.navy, lineHeight:1.15 }}>
            {game.title}
          </h3>
          <p className="truncate" style={{ fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"clamp(9px,0.9vw,12px)", color:C.mutedFg, marginTop:2 }}>
            {game.desc}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <DiffBadge level={game.difficulty} />
          <motion.button
            onClick={e => { e.stopPropagation(); onPlay?.(game.id); }}
            className="flex items-center gap-1 rounded-xl"
            style={{ padding:"6px 14px", background:game.color, border:`2px solid ${C.navy}`, boxShadow:`2px 3px 0 ${C.navy}`, fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(11px,1vw,14px)", color:C.white, whiteSpace:"nowrap" }}
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
          >
            <Play size={12} fill={C.white} /> Play!
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

// ── Games page hero banner ────────────────────────────────────────────────────
function GamesHeroBanner() {
  const icons = ["🎮","🃏","🎈","🧩","🔍","🌑","🎯","🌟"];
  return (
    <div className="relative flex items-center justify-between overflow-hidden rounded-3xl flex-shrink-0"
      style={{ background:"linear-gradient(135deg,#FF6B35 0%,#FF2D9B 50%,#7B2FF7 100%)", border:`3px solid ${C.navy}`, boxShadow:`5px 7px 0 ${C.navy}`, padding:"clamp(18px,2.8vw,32px) clamp(20px,3.5vw,48px)", minHeight:"clamp(110px,14vh,168px)" }}>

      {/* Inner shine */}
      <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.2) 0%,transparent 55%)", borderRadius:24 }} />

      {/* Floating icon background */}
      {icons.map((ic, i) => (
        <motion.span key={i} className="absolute pointer-events-none select-none"
          style={{ fontSize:`${22+((i*7)%18)}px`, opacity:0.12, top:`${[8,55,28,72,18,62,38,82][i]}%`, left:`${[4,10,22,35,52,64,76,88][i]}%`, transform:`rotate(${[-18,12,-8,22,-15,8,-20,16][i]}deg)` }}
          animate={{ y:[0,-8,0] }} transition={{ duration:3.5+i*0.4, repeat:Infinity, ease:"easeInOut" }}
        >{ic}</motion.span>
      ))}

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <motion.span style={{ fontSize:"clamp(28px,4.5vw,56px)", lineHeight:1 }}
            animate={{ rotate:[-8,8,-8] }} transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}>
            🎮
          </motion.span>
          <div>
            <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(24px,4vw,52px)", color:C.white, textShadow:"3px 3px 0 rgba(26,0,80,0.3)", lineHeight:1 }}>
              Mini Games
            </h1>
            <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"clamp(12px,1.3vw,17px)", color:"rgba(255,255,255,0.88)" }}>
              Pick a game and start playing!
            </p>
          </div>
        </div>
      </div>

      <motion.span className="relative z-10 select-none"
        style={{ fontSize:"clamp(60px,9.5vw,120px)", lineHeight:1, filter:"drop-shadow(3px 6px 0 rgba(26,0,80,0.35))" }}
        animate={{ rotate:[-10,10,-10], y:[0,-10,0] }}
        transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}>
        🦊
      </motion.span>
    </div>
  );
}

const REWARD_BADGES = (progress: any) => [
  { emoji: "🔤", label: "Alphabet Ace",   tier: "gold",   desc: "Learned A–Z",       earned: progress.lettersLearned >= 26 },
  { emoji: "⭐", label: "Star Collector", tier: "gold",   desc: "100 stars earned",  earned: progress.starsTotal >= 100 },
  { emoji: "🎮", label: "Game Master",    tier: "silver", desc: "Won 10 games",      earned: progress.starsTotal >= 30 }, // Using stars as proxy for game wins for now
  { emoji: "🔢", label: "Number Ninja",   tier: "silver", desc: "Counted to 20",     earned: progress.numbersLearned >= 20 },
  { emoji: "🎨", label: "Color Wizard",   tier: "bronze", desc: "Named 8 colors",    earned: (progress.catProgress["colors"] || 0) >= 100 },
  { emoji: "🔥", label: "On Fire!",       tier: "bronze", desc: "7-day streak",      earned: progress.streakDays >= 7 },
  { emoji: "🧩", label: "Puzzle Pro",     tier: "silver", desc: "10 puzzles solved", earned: (progress.catProgress["shapes"] || 0) >= 100 },
  { emoji: "🦋", label: "Explorer",       tier: "gold",   desc: "All categories!",   earned: Object.keys(progress.catProgress).length >= 10 },
];

const STICKERS = (progress: any) => [
  { emoji: "🦊", earned: progress.starsTotal >= 10  }, { emoji: "🌟", earned: progress.starsTotal >= 20  },
  { emoji: "🎈", earned: progress.starsTotal >= 30  }, { emoji: "🍎", earned: progress.starsTotal >= 40  },
  { emoji: "🦁", earned: progress.starsTotal >= 50  }, { emoji: "🌈", earned: progress.starsTotal >= 60  },
  { emoji: "🐸", earned: progress.starsTotal >= 70  }, { emoji: "🦄", earned: progress.starsTotal >= 80  },
  { emoji: "🚀", earned: progress.starsTotal >= 90  }, { emoji: "🎪", earned: progress.starsTotal >= 100 },
  { emoji: "🐬", earned: progress.starsTotal >= 110 }, { emoji: "🏆", earned: progress.starsTotal >= 120 },
];

const ACHIEVEMENTS = (progress: any) => [
  { emoji: "🔤", label: "Alphabet",  progress: Math.floor((progress.lettersLearned / 26) * 100), color: C.red    },
  { emoji: "🔢", label: "Numbers",   progress: Math.floor((progress.numbersLearned / 20) * 100), color: C.blue   },
  { emoji: "🔷", label: "Shapes",    progress: progress.catProgress["shapes"] || 0, color: C.teal   },
  { emoji: "🎨", label: "Colors",    progress: progress.catProgress["colors"] || 0, color: C.green },
  { emoji: "🔥", label: "Streak",    progress: Math.min(100, Math.floor((progress.streakDays / 7) * 100)), color: C.orange },
];

const TIER_COLORS: Record<string, { bg: string; ring: string; shadow: string }> = {
  gold:   { bg: "linear-gradient(135deg,#FFD700,#FFA500)", ring: "#CC8800", shadow: "rgba(255,165,0,0.5)" },
  silver: { bg: "linear-gradient(135deg,#E8E8E8,#B0B0B0)", ring: "#888888", shadow: "rgba(160,160,160,0.5)" },
  bronze: { bg: "linear-gradient(135deg,#CD7F32,#A05A1A)", ring: "#7A4010", shadow: "rgba(160,80,20,0.5)" },
};

function FloatingOrb({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ filter: "blur(60px)", opacity: 0.35, ...style }}
      animate={{ y: [0, -20, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function RewardBadge({ emoji, label, tier, earned, index }: {
  emoji: string; label: string; tier: string; desc?: string; earned: boolean; index: number;
}) {
  const tc = TIER_COLORS[tier];
  return (
    <motion.div
      className="flex flex-col items-center gap-1"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index, type: "spring", stiffness: 280, damping: 18 }}
    >
      <div className="relative" style={{ width: 72, height: 72 }}>
        {/* spinning dashed ring for earned */}
        {earned && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `3px dashed ${tc.ring}`, opacity: 0.7 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
        )}
        <div
          className="absolute inset-1 rounded-full flex items-center justify-center"
          style={{
            background: earned ? tc.bg : "rgba(255,255,255,0.08)",
            boxShadow: earned ? `0 4px 16px ${tc.shadow}` : "none",
            border: earned ? `3px solid ${tc.ring}` : `3px solid rgba(255,255,255,0.15)`,
            fontSize: 28,
            filter: earned ? "none" : "grayscale(1) opacity(0.35)",
          }}
        >
          {earned ? emoji : "🔒"}
        </div>
      </div>
      <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: 11, color: earned ? "#FFFFFF" : "rgba(255,255,255,0.35)", textAlign: "center", lineHeight: 1.2, maxWidth: 72 }}>
        {earned ? label : "???"}
      </span>
    </motion.div>
  );
}

function StickerItem({ emoji, earned, index }: { emoji: string; earned: boolean; index: number }) {
  return (
    <motion.div
      className="flex-shrink-0 rounded-2xl flex items-center justify-center"
      style={{
        width: 64, height: 64,
        background: earned ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
        border: earned ? "2px solid rgba(255,255,255,0.4)" : "2px dashed rgba(255,255,255,0.15)",
        fontSize: 30,
        filter: earned ? "none" : "grayscale(1) opacity(0.25)",
        cursor: earned ? "pointer" : "default",
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.04 * index, type: "spring", stiffness: 320, damping: 20 }}
      whileHover={earned ? { scale: 1.18, rotate: 8 } : {}}
      whileTap={earned ? { scale: 0.92 } : {}}
    >
      {earned ? emoji : "🔒"}
    </motion.div>
  );
}

function AchievementRow({ emoji, label, progress, color, index }: {
  emoji: string; label: string; progress: number; color: string; index: number;
}) {
  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.07 * index }}
    >
      <div
        className="flex-shrink-0 rounded-xl flex items-center justify-center"
        style={{ width: 40, height: 40, background: `${color}30`, border: `2px solid ${color}60`, fontSize: 18 }}
      >
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 14, color: "#FFFFFF" }}>{label}</span>
          <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 13, color }}>
            {progress}%{progress === 100 ? " ✓" : ""}
          </span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 8, background: "rgba(255,255,255,0.12)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.1 + 0.07 * index, duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function RewardsPage({ onBack }: { onBack: () => void }) {
  const { progress } = useProgress();
  const badges = REWARD_BADGES(progress);
  const stickers = STICKERS(progress);
  const achievements = ACHIEVEMENTS(progress);

  const totalStars = progress.starsTotal;
  const earnedBadges = badges.filter(b => b.earned).length;
  const earnedStickers = stickers.filter(s => s.earned).length;
  const streak = progress.streakDays;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height: "100dvh", minHeight: "100vh",
        fontFamily: "'Fredoka','Nunito',sans-serif",
        background: "linear-gradient(160deg,#1A0050 0%,#2D0082 40%,#0D003A 100%)",
      }}
    >
      {/* Ambient orbs */}
      <FloatingOrb style={{ width: 300, height: 300, top: -80, left: -80, background: C.purple }} />
      <FloatingOrb style={{ width: 200, height: 200, bottom: 100, right: -60, background: C.blue }} />
      <FloatingOrb style={{ width: 160, height: 160, top: "40%", left: "30%", background: C.pink }} />

      {/* Ambient sparkles */}
      <AmbientSparkles
        zIndex={5}
        rotate={25}
        baseDuration={3.5}
        durationStep={0.8}
        spots={[
          { top:"6%",  left:"8%",  size:20, color:C.yellow },
          { top:"14%", right:"7%", size:16, color:C.pink   },
          { top:"55%", left:"4%",  size:18, color:C.teal   },
          { top:"78%", right:"9%", size:14, color:C.orange },
        ]}
      />

      {/* Scrollable content */}
      <div
        className="absolute inset-0 overflow-y-auto lf-carousel"
        style={{ zIndex: 10, paddingBottom: 80 }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "clamp(12px,3vw,24px)" }}>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6" style={{ paddingTop: 16 }}>
            <BackButton onClick={onBack} />
            <div>
              <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(22px,5vw,30px)", color: "#FFFFFF", lineHeight: 1 }}>
                My Rewards ✨
              </h1>
              <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                Keep going — you're amazing!
              </p>
            </div>
          </div>

          {/* Hero stat cards */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { emoji: "⭐", value: totalStars, label: "Stars",   color: C.yellow, glow: "rgba(255,215,0,0.35)"  },
              { emoji: "🏅", value: earnedBadges, label: "Badges", color: C.orange, glow: "rgba(255,149,0,0.35)" },
              { emoji: "🔥", value: streak,    label: "Streak",  color: C.red,    glow: "rgba(255,59,48,0.35)"  },
              { emoji: "🎯", value: "Lv 3",   label: "Level",   color: C.teal,   glow: "rgba(0,199,190,0.35)"  },
            ].map(({ emoji, value, label, color, glow }, i) => (
              <motion.div
                key={label}
                className="flex flex-col items-center rounded-2xl py-3 px-1"
                style={{
                  background: "rgba(255,255,255,0.09)",
                  border: `2px solid rgba(255,255,255,0.15)`,
                  boxShadow: `0 4px 20px ${glow}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i, type: "spring", stiffness: 260, damping: 18 }}
              >
                <span style={{ fontSize: "clamp(20px,4vw,28px)" }}>{emoji}</span>
                <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(18px,4vw,24px)", color, lineHeight: 1, marginTop: 2 }}>
                  {value}
                </span>
                <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Badges section */}
          <motion.div
            className="rounded-3xl p-4 mb-5"
            style={{ background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 18, color: "#FFFFFF" }}>
                🏅 Badges
              </h2>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                {earnedBadges}/{badges.length}
              </span>
            </div>
            <div className="grid gap-y-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))" }}>
              {badges.map((b, i) => (
                <RewardBadge key={b.label} {...b} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Stickers section */}
          <motion.div
            className="rounded-3xl p-4 mb-5"
            style={{ background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 18, color: "#FFFFFF" }}>
                🌟 Stickers
              </h2>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                {earnedStickers}/{stickers.length}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto lf-carousel pb-1">
              {stickers.map((s, i) => (
                <StickerItem key={i} emoji={s.emoji} earned={s.earned} index={i} />
              ))}
            </div>
          </motion.div>

          {/* Achievements section */}
          <motion.div
            className="rounded-3xl p-4 mb-6"
            style={{ background: "rgba(255,255,255,0.07)", border: "2px solid rgba(255,255,255,0.12)" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
          >
            <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 18, color: "#FFFFFF", marginBottom: 16 }}>
              🎯 Achievements
            </h2>
            <div className="flex flex-col gap-4">
              {achievements.map((a, i) => (
                <AchievementRow key={a.label} {...a} index={i} />
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            className="w-full rounded-2xl flex items-center justify-center gap-2"
            style={{
              height: 60,
              background: `linear-gradient(135deg,${C.yellow},${C.orange})`,
              border: `3px solid ${C.navy}`,
              boxShadow: `4px 5px 0 ${C.navy}`,
              fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
              fontSize: "clamp(17px,4vw,20px)",
              color: C.navy,
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
          >
            🚀 Continue Learning!
          </motion.button>

        </div>
      </div>
    </div>
  );
}

// ── Full games page ───────────────────────────────────────────────────────────
export function GamesPage({ onBack, onPlay }: { onBack: () => void; onPlay?: (id: string) => void }) {
  const { progress } = useProgress();
  return (
    <div className="flex flex-col overflow-hidden"
      style={{ height:"100dvh", background:"#F8F4FF", fontFamily:"'Fredoka','Nunito',sans-serif" }}>

      {/* Top bar */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4"
        style={{ padding:"10px clamp(16px,3vw,48px)", background:C.white, borderBottom:`3px solid ${C.navy}`, boxShadow:"0 2px 16px rgba(26,0,80,0.08)" }}>
        <BackButton onClick={onBack} />
        <h2 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(18px,2.2vw,28px)", color:C.navy }}>
          🎮 Mini Games
        </h2>
        <div className="flex items-center gap-2">
          <StatPill emoji="⭐" value={String(progress.starsTotal)} label="Stars" valueColor="#CC9F00" />
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ padding:"clamp(16px,2.5vw,28px) clamp(16px,3vw,48px)" }}>

        <GamesHeroBanner />

        {/* Legend row */}
        <div className="flex items-center gap-2 mt-6 mb-4 flex-wrap">
          <Sparkle size={15} color={C.yellow} />
          <h3 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(16px,1.8vw,22px)", color:C.navy }}>
            Choose Your Game
          </h3>
          <div className="ml-auto hidden sm:flex items-center gap-4">
            {([["Easy",1,C.green],["Medium",2,C.orange],["Hard",3,C.red]] as [string,1|2|3,string][]).map(([lbl,lvl,col])=>(
              <div key={lbl} className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1,2,3].map(n=>(
                    <div key={n} className="rounded-full" style={{ width:8, height:8, background: n<=lvl ? col : "rgba(26,0,80,0.12)" }} />
                  ))}
                </div>
                <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:12, color:C.mutedFg }}>{lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Game grid — responsive auto-fill */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(clamp(240px,28vw,360px),1fr))", gap:"clamp(14px,2vw,24px)" }}>
          {GAME_DEFS.map((g, i) => <GameCard key={g.id} game={g} index={i} onPlay={onPlay} />)}
        </div>

        <div style={{ height:28 }} />
      </div>
    </div>
  );
}
