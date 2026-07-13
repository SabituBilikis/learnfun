import { motion } from "motion/react";
import { C } from "../../../app/constants";
import { CTAButton, StatPill } from "../../../app/modules/primitives";
import { RainingConfetti } from "../../../app/modules/lessonComplete";

export function MatchConfetti({ active }: { active: boolean }) {
  if (!active) return null;
  const pieces = Array.from({ length: 12 }, (_, i) => ({
    angle: (i / 12) * 360,
    color: [C.yellow, C.orange, C.pink, C.green, C.teal, C.blue][i % 6],
    dist: 48 + Math.random() * 32,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 50 }}>
      {pieces.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ width: 10, height: 10, background: p.color, left: "50%", top: "50%", marginLeft: -5, marginTop: -5 }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(rad) * p.dist, y: Math.sin(rad) * p.dist, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function HeartsBar({ lives, maxLives }: { lives: number; maxLives: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: maxLives }).map((_, i) => (
        <motion.span
          key={i}
          style={{ fontSize: "clamp(18px,3vw,24px)", filter: i < lives ? "none" : "grayscale(1) opacity(0.3)" }}
          animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
        >
          ❤️
        </motion.span>
      ))}
    </div>
  );
}

export function TimerPill({ seconds, warning }: { seconds: number; warning: boolean }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const display = `${m}:${String(s).padStart(2, "0")}`;
  return (
    <motion.div
      className="flex items-center gap-1.5 rounded-2xl px-3 py-1.5"
      style={{
        background: warning ? C.red : C.green,
        border: `2.5px solid ${C.navy}`,
        boxShadow: `2px 3px 0 ${C.navy}`,
        minWidth: 72, justifyContent: "center",
      }}
      animate={warning ? { scale: [1, 1.06, 1] } : { scale: 1 }}
      transition={{ duration: 0.5, repeat: warning ? Infinity : 0 }}
    >
      <span style={{ fontSize: 16 }}>⏱</span>
      <span className="font-fredoka font-bold text-lf-white text-[clamp(14px,2.5vw,18px)]">
        {display}
      </span>
    </motion.div>
  );
}

export function GameProgressBar({ matched, total }: { matched: number; total: number }) {
  const pct = total > 0 ? (matched / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 w-full">
      <span className="font-fredoka font-bold text-[13px] text-lf-navy whitespace-nowrap">
        {matched}/{total} 🃏
      </span>
      <div className="flex-1 rounded-full overflow-hidden bg-lf-muted border-2 border-lf-navy h-[12px]">
        <motion.div
          className="h-full rounded-full"
          style={{ background:`linear-gradient(90deg,${C.green},${C.teal})` }}
          animate={{ width:`${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      {pct === 100 && (
        <motion.span initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:400 }}>
          🏆
        </motion.span>
      )}
    </div>
  );
}

export function PauseOverlay({ onResume, onExit }: { onResume: () => void; onExit: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      style={{ background:"rgba(26,0,80,0.88)", zIndex:100, backdropFilter:"blur(8px)" }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    >
      <motion.div
        className="rounded-3xl flex flex-col items-center gap-6 p-8 bg-lf-white border-4 border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] max-w-[320px] w-[90%]"
        initial={{ scale:0.7 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:300, damping:20 }}
      >
        <span style={{ fontSize:56 }}>⏸</span>
        <h2 className="font-fredoka font-bold text-[28px] text-lf-navy text-center">
          Game Paused
        </h2>
        <div className="flex flex-col w-full gap-3">
          <CTAButton label="▶ Resume" color={C.green} onClick={onResume} />
          <button
            onClick={onExit}
            className="w-full rounded-2xl flex items-center justify-center font-fredoka font-bold text-[18px] text-lf-navy border-[3px] border-lf-navy bg-transparent cursor-pointer h-[52px]"
          >
            🚪 Exit Game
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function VictoryScreen({ matchedPairs, totalPairs, timeLeft, onPlayAgain, onExit }: {
  matchedPairs: number; totalPairs: number; timeLeft: number; onPlayAgain: () => void; onExit: () => void;
}) {
  const stars = timeLeft > 60 ? 3 : timeLeft > 20 ? 2 : 1;
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
      style={{ background:"linear-gradient(148deg,#6B1FD4,#4B0082,#1A0050)", zIndex:100 }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}
    >
      <RainingConfetti />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5"
        initial={{ scale:0.6, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:"spring", stiffness:280, damping:20, delay:0.15 }}
      >
        <span style={{ fontSize:"clamp(60px,14vw,96px)" }}>🏆</span>
        <h1 className="font-fredoka font-bold text-[clamp(28px,7vw,48px)] text-lf-white text-center shadow-md">
          You Won!
        </h1>
        {/* Stars */}
        <div className="flex gap-3">
          {[0,1,2].map(i => (
            <motion.span key={i}
              style={{ fontSize:"clamp(30px,8vw,52px)", filter: i < stars ? "none" : "grayscale(1) opacity(0.3)" }}
              initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
              transition={{ type:"spring", stiffness:350, damping:14, delay:0.3 + i*0.12 }}
            >⭐</motion.span>
          ))}
        </div>
        {/* Stats */}
        <div className="flex gap-4 flex-wrap justify-center">
          <StatPill emoji="🃏" value={`${matchedPairs}/${totalPairs}`} label="Matched" valueColor={C.green} />
          <StatPill emoji="⏱" value={`${Math.floor(timeLeft/60)}:${String(timeLeft%60).padStart(2,"0")}`} label="Left" valueColor={C.teal} />
        </div>
        {/* Actions */}
        <div className="flex flex-col gap-3 w-full max-w-[280px]">
          <CTAButton label="🔄 Play Again" color={C.green} onClick={onPlayAgain} />
          <button
            onClick={onExit}
            className="w-full rounded-2xl flex items-center justify-center font-fredoka font-bold text-[18px] text-lf-white cursor-pointer h-[54px] bg-white/15 border-[3px] border-white/40"
          >
            🏠 Back to Games
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
