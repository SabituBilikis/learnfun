import React from "react";
import { motion } from "motion/react";
import { Star, ChevronLeft, RotateCcw, Home, Play, ChevronRight } from "lucide-react";
import { C, LESSON_LETTERS } from "../constants";
import { Sparkle, AmbientSparkles } from "./primitives";

// ── Raining confetti ──────────────────────────────────────────────────────────
export function RainingConfetti() {
  const pieces = React.useMemo(() =>
    Array.from({ length: 42 }, (_, i) => ({
      x:     `${(i * 2.4) % 100}%`,
      size:  7 + (i % 5) * 3,
      color: [C.yellow, C.orange, C.pink, C.teal, C.green, C.blue, C.purple, C.white, C.red][i % 9],
      delay: (i * 0.23) % 4,
      dur:   2.4 + (i % 7) * 0.35,
      rot:   (i * 37) % 360,
      drift: ((i % 5) - 2) * 30,
      shape: i % 4 === 0 ? "50%" : i % 4 === 1 ? "3px" : i % 4 === 2 ? "2px 10px" : "50% 20%",
    })), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {pieces.map((p, i) => (
        <motion.div key={i} className="absolute flex-shrink-0"
          style={{ left: p.x, top: -24, width: p.size, height: p.size, background: p.color, borderRadius: p.shape, border: "1px solid rgba(26,0,80,0.12)" }}
          animate={{ y: ["0px", "110vh"], x: [0, p.drift], rotate: [p.rot, p.rot + 540], opacity: [0, 1, 1, 0.2] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "linear", repeatDelay: (i % 4) * 0.3 }}
        />
      ))}
    </div>
  );
}

// ── 3-star celebration row ────────────────────────────────────────────────────
function ThreeStars({ earned = 3 }: { earned?: number }) {
  return (
    <div className="flex items-end justify-center" style={{ gap: "clamp(6px,1.5vw,18px)" }}>
      {[0, 1, 2].map(i => {
        const filled = i < earned;
        const center = i === 1;
        const size   = center ? 80 : 60;
        return (
          <motion.div key={i} className="flex flex-col items-center"
            initial={{ scale: 0, rotate: center ? -20 : i === 0 ? 15 : -15, y: center ? 0 : 12 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{ delay: 0.55 + i * 0.2, type: "spring", stiffness: 420, damping: 16 }}
          >
            <motion.div
              animate={filled ? { scale: [1, 1.12, 1], filter: [`drop-shadow(0 0 8px ${C.yellow})`, `drop-shadow(0 0 20px ${C.yellow})`, `drop-shadow(0 0 8px ${C.yellow})`] } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
            >
              <Star
                size={size}
                fill={filled ? C.yellow : "rgba(255,255,255,0.15)"}
                color={filled ? "#CC9F00" : "rgba(255,255,255,0.35)"}
                strokeWidth={filled ? 1.5 : 1}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Gold reward badge ─────────────────────────────────────────────────────────
function GoldBadge({ letter, emoji, label }: { letter: string; emoji: string; label: string }) {
  return (
    <motion.div className="flex flex-col items-center gap-3"
      initial={{ scale: 0, rotate: -18 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 20 }}
    >
      {/* Glow halo */}
      <div className="relative flex items-center justify-center">
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ inset: -14, background: "radial-gradient(circle, rgba(255,215,0,0.35) 0%, transparent 70%)", filter: "blur(8px)" }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        {/* Outer ring */}
        <motion.div className="absolute rounded-full"
          style={{ inset: -6, border: "3px dashed rgba(255,215,0,0.6)" }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        {/* Badge body */}
        <div className="relative flex flex-col items-center justify-center rounded-full"
          style={{
            width: "clamp(110px,15vw,180px)", height: "clamp(110px,15vw,180px)",
            background: "linear-gradient(145deg,#FFE566,#FFD700,#FFA500)",
            border: `5px solid ${C.navy}`, boxShadow: `6px 8px 0 ${C.navy}, 0 0 40px rgba(255,215,0,0.4)`,
          }}
        >
          <span style={{ fontSize: "clamp(30px,4.5vw,56px)", lineHeight: 1 }}>{emoji}</span>
          <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(24px,3.5vw,42px)", color: C.navy, lineHeight: 1 }}>{letter}</span>
        </div>
      </div>
      {/* Ribbon label */}
      <motion.div className="px-5 py-1.5 rounded-full"
        style={{ background: C.navy, border: `2.5px solid ${C.yellow}`, boxShadow: "3px 4px 0 rgba(0,0,0,0.28)" }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
      >
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(12px,1.5vw,17px)", color: C.yellow, letterSpacing: 0.5 }}>
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ── Soft radial celebration background ───────────────────────────────────────
function CelebrationBg() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 38%, rgba(255,255,255,0.16) 0%, transparent 62%)" }} />
      {[
        { x:"8%",  y:"12%", s:220, c:"rgba(255,215,0,0.14)" },
        { x:"78%", y:"18%", s:160, c:"rgba(255,45,155,0.12)" },
        { x:"15%", y:"72%", s:180, c:"rgba(0,199,190,0.11)" },
        { x:"72%", y:"70%", s:210, c:"rgba(175,82,222,0.13)" },
        { x:"46%", y:"5%",  s:140, c:"rgba(255,149,0,0.12)" },
      ].map((o, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: o.s, height: o.s, left: o.x, top: o.y, background: o.c, filter: "blur(55px)" }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.95, 0.5] }}
          transition={{ duration: 3.8 + i * 0.9, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ── Full lesson complete screen ───────────────────────────────────────────────
export function LessonCompleteScreen({ letterIndex, onContinue, onPlayAgain, onCategories }: {
  letterIndex: number;
  onContinue:  () => void;
  onPlayAgain: () => void;
  onCategories: () => void;
}) {
  const entry    = LESSON_LETTERS[letterIndex];
  const canNext  = letterIndex < LESSON_LETTERS.length - 1;
  const next     = canNext ? LESSON_LETTERS[letterIndex + 1] : null;

  return (
    <div
      className="relative flex flex-col overflow-hidden"
      style={{ height: "100dvh", background: "linear-gradient(148deg,#6B1FD4 0%,#4B0082 48%,#1A0050 100%)", fontFamily: "'Fredoka','Nunito',sans-serif" }}
    >
      <CelebrationBg />
      <RainingConfetti />

      {/* ── Top bar ───────────────────────────────────────── */}
      <div className="relative z-20 flex-shrink-0 flex items-center justify-between"
        style={{ padding: "12px clamp(14px,3vw,44px)" }}>

        <motion.button onClick={onCategories}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.16)", border: "2px solid rgba(255,255,255,0.45)", fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 15, color: C.white }}
          whileHover={{ scale: 1.06, background: "rgba(255,255,255,0.26)" }}
          whileTap={{ scale: 0.94 }}
        >
          <ChevronLeft size={18} /> Categories
        </motion.button>

        {/* XP pill */}
        <motion.div className="flex items-center gap-1.5 px-4 py-2 rounded-full"
          style={{ background: "rgba(255,215,0,0.22)", border: "2px solid rgba(255,215,0,0.7)" }}
          animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkle size={16} color={C.yellow} />
          <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 16, color: C.yellow }}>+10 Stars!</span>
          <Sparkle size={16} color={C.yellow} />
        </motion.div>
      </div>

      {/* ── Main celebration stage ────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center"
        style={{ padding: "0 clamp(16px,4vw,64px)", gap: "clamp(10px,2.5vh,24px)" }}>

        {/* Mascot */}
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0,   opacity: 1 }}
          transition={{ delay: 0.08, type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.span className="select-none block"
            style={{ fontSize: "clamp(52px,9vw,110px)", lineHeight: 1, filter: "drop-shadow(3px 6px 0 rgba(26,0,80,0.35))" }}
            animate={{ rotate: [-14, 14, -14], y: [0, -12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >🦊</motion.span>
        </motion.div>

        {/* Headline */}
        <motion.div className="text-center"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.18, type: "spring", stiffness: 340, damping: 22 }}
        >
          <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(38px,6.5vw,88px)", color: C.white, textShadow: "4px 5px 0 rgba(26,0,80,0.4)", lineHeight: 1, letterSpacing: 1 }}>
            Amazing! 🎉
          </h1>
          <motion.p
            style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "clamp(14px,1.8vw,22px)", color: "rgba(255,255,255,0.88)", marginTop: 6 }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          >
            You learned <span style={{ color: C.yellow }}>{entry.l}</span> is for <span style={{ color: C.yellow }}>{entry.word} {entry.emoji}</span>
          </motion.p>
        </motion.div>

        {/* Stars + Badge — side by side on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center"
          style={{ gap: "clamp(16px,3vw,48px)" }}>
          <ThreeStars earned={3} />
          <GoldBadge letter={entry.l} emoji={entry.emoji} label={`${entry.word} · Mastered!`} />
        </div>
      </div>

      {/* ── Action buttons ────────────────────────────────── */}
      <motion.div
        className="relative z-20 flex-shrink-0 flex flex-col sm:flex-row items-center justify-center"
        style={{ padding: "14px clamp(16px,4vw,64px) 22px", gap: "clamp(10px,1.8vw,16px)" }}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, type: "spring", stiffness: 240, damping: 22 }}
      >
        {/* Play Again */}
        <motion.button onClick={onPlayAgain}
          className="flex items-center justify-center gap-2 rounded-2xl"
          style={{ padding: "12px 22px", background: "rgba(255,255,255,0.16)", border: "2.5px solid rgba(255,255,255,0.55)", fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(14px,1.6vw,18px)", color: C.white, whiteSpace: "nowrap" }}
          whileHover={{ scale: 1.06, background: "rgba(255,255,255,0.26)" }}
          whileTap={{ scale: 0.94 }}
        >
          <RotateCcw size={17} /> Play Again
        </motion.button>

        {/* Back to Categories */}
        <motion.button onClick={onCategories}
          className="flex items-center justify-center gap-2 rounded-2xl"
          style={{ padding: "12px 22px", background: "rgba(255,255,255,0.08)", border: "2.5px solid rgba(255,255,255,0.35)", fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(14px,1.6vw,18px)", color: "rgba(255,255,255,0.8)", whiteSpace: "nowrap" }}
          whileHover={{ scale: 1.06, background: "rgba(255,255,255,0.18)" }}
          whileTap={{ scale: 0.94 }}
        >
          <Home size={17} /> Categories
        </motion.button>

        {/* Continue — primary green, pulsing */}
        {canNext && (
          <motion.button onClick={onContinue}
            className="flex items-center justify-center gap-2 rounded-2xl"
            style={{ padding: "14px 30px", background: `linear-gradient(135deg,${C.green},#28A046)`, border: `3px solid ${C.navy}`, boxShadow: `4px 6px 0 ${C.navy}`, fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(15px,1.8vw,20px)", color: C.white, whiteSpace: "nowrap" }}
            animate={{ boxShadow: ["4px 6px 0 rgba(26,0,80,1)", "6px 9px 0 rgba(26,0,80,1)", "4px 6px 0 rgba(26,0,80,1)"] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
          >
            <Play size={17} fill={C.white} />
            Next: {next?.l} {next?.emoji}
            <ChevronRight size={19} strokeWidth={2.5} />
          </motion.button>
        )}
      </motion.div>

      {/* Corner sparkles */}
      <AmbientSparkles
        zIndex={5}
        rotate={25}
        scaleTo={1.35}
        opacityRange={[0.65, 1]}
        baseDuration={3}
        durationStep={0.6}
        spots={[
          { top:"5%",  left:"2%",  size:22, color:C.yellow },
          { top:"8%",  right:"3%", size:16, color:"rgba(255,255,255,0.85)" },
          { top:"82%", left:"2%",  size:18, color:C.yellow },
          { top:"78%", right:"3%", size:14, color:"rgba(255,255,255,0.75)" },
          { top:"45%", left:"1%",  size:13, color:C.pink },
          { top:"40%", right:"1%", size:13, color:C.teal },
        ]}
      />
    </div>
  );
}
