import React, { useState } from "react";
import { motion, AnimatePresence, type TargetAndTransition } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Check } from "lucide-react";
import { C, LETTERS, LETTER_COLORS_FULL, CATEGORIES } from "../constants";
import { CTAButton, StatPill, Sparkle } from "./primitives";
import { useProgress } from "../../hooks/useProgress";
import { AlphabetPage } from "./alphabet";
import { LessonScreen } from "./lessonScreen";
import { MemoryMatchGame } from "./memoryMatch";
import { RainingConfetti } from "./lessonComplete";
import { LearnFunIcon } from "./pwaFlow";

// ── Transition system ─────────────────────────────────────────────────────────
type TDir = "forward"|"back"|"up"|"zoom-in"|"zoom-out"|"fade"|"burst";

const T_VARIANTS: Record<TDir, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  "forward":  { initial:{x:"100%",opacity:0.6}, animate:{x:0,opacity:1}, exit:{x:"-28%",opacity:0,scale:0.94} },
  "back":     { initial:{x:"-100%",opacity:0.6}, animate:{x:0,opacity:1}, exit:{x:"28%",opacity:0,scale:0.94} },
  "up":       { initial:{y:"100%",opacity:0.8}, animate:{y:0,opacity:1}, exit:{opacity:0,scale:0.95,y:"-4%"} },
  "zoom-in":  { initial:{scale:0.72,opacity:0}, animate:{scale:1,opacity:1}, exit:{scale:1.08,opacity:0} },
  "zoom-out": { initial:{scale:1.18,opacity:0}, animate:{scale:1,opacity:1}, exit:{scale:0.84,opacity:0} },
  "fade":     { initial:{opacity:0}, animate:{opacity:1}, exit:{opacity:0} },
  "burst":    { initial:{scale:0.5,opacity:0,rotate:-6}, animate:{scale:1,opacity:1,rotate:0}, exit:{scale:1.1,opacity:0} },
};

const T_EASE = [0.32, 0, 0.18, 1] as const;
const T_DUR  = 0.40;

function JScreen({ id, dir, bg, children }: { id: string; dir: TDir; bg?: string; children: React.ReactNode }) {
  const v = T_VARIANTS[dir];
  return (
    <motion.div key={id}
      className="absolute inset-0 overflow-y-auto overflow-x-hidden lf-carousel"
      style={{ background: bg ?? "#F3EEFF", zIndex: 10 }}
      initial={v.initial} animate={v.animate} exit={v.exit}
      transition={{ duration: T_DUR, ease: T_EASE }}
    >
      {children}
    </motion.div>
  );
}

// ── Journey state machine ─────────────────────────────────────────────────────
type JStep =
  | "splash"
  | "home"
  | "category"
  | "lesson"
  | "game-prompt"
  | "game"
  | "reward"
  | "next-lesson"
  | "cat-complete"
  | "dashboard";

// ── J-Splash ─────────────────────────────────────────────────────────────────
function JSplash({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  React.useEffect(() => {
    const iv = setInterval(() => setPct(p => { if (p >= 100) { clearInterval(iv); return 100; } return p + 2.5; }), 50);
    return () => clearInterval(iv);
  }, []);
  React.useEffect(() => { if (pct >= 100) { const t = setTimeout(onDone, 400); return () => clearTimeout(t); } }, [pct]);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-8 px-8 bg-gradient-to-br from-[#1A0050] via-[#4B0082] to-[#7B2FF7]">
      {/* Ambient sparkles */}
      {[[C.yellow,8,5],[C.pink,15,92],[C.teal,72,8],[C.orange,80,90]].map(([col,top,left],i)=>(
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ top:`${top}%`, left:`${left}%` }}
          animate={{ y:[0,-12,0], scale:[1,1.3,1], opacity:[0.5,1,0.5] }}
          transition={{ duration:2.8+i*0.5, repeat:Infinity, ease:"easeInOut", delay:i*0.3 }}>
          <Sparkle size={18+i*3} color={col as string} />
        </motion.div>
      ))}
      {/* Logo */}
      <motion.div className="flex flex-col items-center gap-4"
        initial={{ scale:0.4, opacity:0, y:20 }} animate={{ scale:1, opacity:1, y:0 }}
        transition={{ type:"spring", stiffness:240, damping:18, delay:0.1 }}>
        <motion.div animate={{ rotate:[0,-5,5,-3,0], y:[0,-6,0] }}
          transition={{ duration:2.4, repeat:Infinity, ease:"easeInOut" }}>
          <LearnFunIcon size={100} />
        </motion.div>
        <div className="text-center">
          <h1 className="font-fredoka font-bold text-[clamp(28px,7vw,42px)] text-white tracking-[0.5px]">LearnFun</h1>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.55 }}
            className="font-nunito text-[15px] text-white/60 mt-1">
            Play · Learn · Grow
          </motion.p>
        </div>
      </motion.div>
      {/* Progress */}
      <motion.div className="w-full max-w-xs flex flex-col gap-2" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}>
        <div className="h-2.5 bg-white/15 rounded-full overflow-hidden border-[1.5px] border-white/20">
          <motion.div className="h-full rounded-full relative overflow-hidden bg-gradient-to-r from-lf-yellow to-lf-orange"
            animate={{ width:`${pct}%` }} transition={{ ease:"easeOut", duration:0.08 }}>
            <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              animate={{ x:["-100%","200%"] }} transition={{ duration:1, repeat:Infinity, ease:"linear" }} />
          </motion.div>
        </div>
        <div className="flex justify-between">
          <span className="font-nunito text-[12px] text-white/45">
            {pct < 100 ? "Starting your adventure…" : "Ready! ✨"}
          </span>
          <span className="font-fredoka font-bold text-[12px] text-lf-yellow">{Math.round(Math.min(pct,100))}%</span>
        </div>
      </motion.div>
    </div>
  );
}

// ── J-Home ────────────────────────────────────────────────────────────────────
function JHome({ onStartJourney, onExit }: { onStartJourney: () => void; onExit: () => void }) {
  const { progress } = useProgress();
  return (
    <div className="flex flex-col h-screen bg-white font-fredoka font-nunito">
      {/* Top nav */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 bg-white/95 border-b-[3px] border-b-lf-navy shadow-[0_3px_16px_rgba(26,0,80,0.08)]">
        <div className="flex items-center gap-2">
          <LearnFunIcon size={36} />
          <span className="font-fredoka font-bold text-[20px] text-lf-navy">LearnFun</span>
        </div>
        <button onClick={onExit}
          className="font-nunito font-bold text-[12px] text-lf-mutedFg bg-transparent border-none cursor-pointer">
          ✕ Exit
        </button>
      </div>

      {/* Hero banner */}
      <motion.div className="mx-4 mt-4 rounded-3xl overflow-hidden flex-shrink-0 border-[3px] border-lf-navy shadow-[5px_7px_0_var(--color-lf-navy)]"
        style={{ background:`linear-gradient(135deg,${C.purple} 0%,#6B1FD4 55%,${C.pink} 100%)` }}
        initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ type:"spring", stiffness:260, damping:22 }}>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <p className="font-nunito text-[13px] text-white/70 font-semibold">Good morning! 🌞</p>
            <h2 className="font-fredoka font-bold text-[clamp(18px,4vw,24px)] text-white leading-[1.2]">
              Ready to learn today?
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <StatPill emoji="⭐" value={String(progress.starsTotal)} label="Stars" valueColor={C.yellow} />
              <StatPill emoji="🔥" value={String(progress.streakDays)} label="Days" valueColor={C.orange} />
            </div>
          </div>
          <motion.span style={{ fontSize:"clamp(44px,10vw,64px)" }}
            animate={{ rotate:[0,-8,8,-5,0], y:[0,-6,0] }}
            transition={{ duration:2.5, repeat:Infinity, ease:"easeInOut" }}>🦊</motion.span>
        </div>
      </motion.div>

      {/* Categories scroll */}
      <div className="flex-1 overflow-y-auto lf-carousel px-4 py-4">
        <h3 className="font-fredoka font-bold text-[16px] text-lf-navy mb-[10px]">
          📚 Keep Learning
        </h3>
        {CATEGORIES.slice(0,4).map((cat, i) => (
          <motion.button key={cat.id}
            onClick={cat.id === "alphabet" ? onStartJourney : undefined}
            className="w-full rounded-2xl flex items-center gap-3 mb-3 text-left"
            style={{ padding:"12px 14px", background:cat.state==="complete"?`${cat.color}18`:"#FFFFFF", border:`2.5px solid ${cat.state==="complete"?cat.color:C.muted}`, boxShadow:cat.id==="alphabet"?`3px 4px 0 ${C.navy}`:`3px 4px 0 rgba(26,0,80,0.10)`, cursor:cat.id==="alphabet"?"pointer":"default" }}
            initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.08+i*0.07, type:"spring", stiffness:280, damping:22 }}
            whileHover={cat.id==="alphabet"?{ scale:1.02 }:{}}
            whileTap={cat.id==="alphabet"?{ scale:0.97 }:{}}>
            <div className="rounded-2xl flex items-center justify-center flex-shrink-0 w-12 h-12 text-[24px]"
              style={{ background:`${cat.color}22`, border:`2px solid ${cat.color}55` }}>
              {cat.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-fredoka font-bold text-[15px] text-lf-navy">{cat.title}</span>
                {cat.id === "alphabet" && (
                  <span className="rounded-xl px-2 py-0.5 font-fredoka font-bold text-[10px] text-white" style={{ background:cat.color }}>START →</span>
                )}
              </div>
              <div className="h-[5px] bg-lf-muted rounded-full mt-[5px] overflow-hidden">
                <div className="h-full rounded-full" style={{ width:`${cat.progress}%`, background:cat.color }} />
              </div>
              <span className="font-nunito text-[10px] text-lf-mutedFg">{cat.progress}% complete</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* CTA strip */}
      <div className="px-4 pb-5 flex-shrink-0">
        <motion.button onClick={onStartJourney}
          className="w-full rounded-2xl flex items-center justify-center gap-2 h-14 border-[3px] border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)] font-fredoka font-bold text-[18px] text-white cursor-pointer bg-gradient-to-br from-lf-red to-lf-orange"
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
          animate={{ boxShadow:["4px 5px 0 rgba(26,0,80,1)","6px 8px 0 rgba(26,0,80,1)","4px 5px 0 rgba(26,0,80,1)"] }}
          transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
          🚀 Start Today&apos;s Lesson!
        </motion.button>
      </div>
    </div>
  );
}

// ── J-Game Prompt interstitial ────────────────────────────────────────────────
function JGamePrompt({ letterEmoji, letterLabel, onPlay, onSkip }: {
  letterEmoji: string; letterLabel: string; onPlay: () => void; onSkip: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-6 text-center bg-gradient-to-br from-[#E8DFFF] to-[#F3EEFF] font-fredoka font-nunito">
      {[0,1,2].map(i=>(
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ top:`${20+i*25}%`, left: i%2===0 ? "5%" : undefined, right: i%2!==0 ? "5%" : undefined }}
          animate={{ rotate:[0,360] }} transition={{ duration:8+i*3, repeat:Infinity, ease:"linear" }}>
          <Sparkle size={16+i*4} color={[C.yellow,C.pink,C.teal][i]} />
        </motion.div>
      ))}
      <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:"spring", stiffness:280, damping:18 }}>
        <div className="rounded-full flex items-center justify-center w-[120px] h-[120px] bg-gradient-to-br from-lf-yellow to-lf-orange border-[4px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] text-[60px]">
          {letterEmoji}
        </div>
      </motion.div>
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h1 className="font-fredoka font-bold text-[clamp(24px,5vw,34px)] text-lf-navy">
          Amazing, {letterLabel}! 🎉
        </h1>
        <p className="font-nunito text-[15px] text-lf-mutedFg mt-1.5 leading-relaxed">
          You learned the letter <strong>{letterLabel}</strong>! Now let&apos;s play a quick game to lock it in!
        </p>
      </motion.div>
      <motion.div className="flex flex-col gap-3 w-full max-w-[320px]"
        initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}>
        <motion.button onClick={onPlay}
          className="w-full rounded-2xl flex items-center justify-center gap-2 h-[58px] border-[3px] border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)] font-fredoka font-bold text-[18px] text-white cursor-pointer bg-gradient-to-br from-lf-purple to-[#6B1FD4]"
          whileHover={{ scale:1.04 }} whileTap={{ scale:0.95 }}>
          🃏 Play Memory Match!
        </motion.button>
        <button onClick={onSkip}
          className="font-nunito font-bold text-[13px] text-lf-mutedFg bg-transparent border-none cursor-pointer">
          Skip game → Go to rewards
        </button>
      </motion.div>
    </div>
  );
}

// ── J-Reward interstitial ─────────────────────────────────────────────────────
function JReward({ letterIdx, starsEarned, onContinue }: {
  letterIdx: number; starsEarned: number; onContinue: () => void;
}) {
  const letter = LETTERS[letterIdx];
  const badges = [
    { emoji:"🔤", label:"Letter Ace",   tier:"gold",   color:C.yellow },
    { emoji:"⭐", label:"Star Earner",  tier:"silver", color:"#C0C0C0" },
    { emoji:"🎮", label:"Game Player",  tier:"bronze", color:"#CD7F32" },
  ];
  return (
    <div className="flex flex-col items-center min-h-screen px-5 py-6 bg-gradient-to-br from-[#1A0050] via-[#4B0082] to-[#7B2FF7] font-fredoka font-nunito">
      <RainingConfetti />
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-[480px]">
        {/* Header */}
        <motion.div className="text-center" initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <h1 className="font-fredoka font-bold text-[clamp(26px,6vw,38px)] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            🏆 Rewards Earned!
          </h1>
          <p className="font-nunito text-[14px] text-white/60 mt-1">
            You crushed it today! Here&apos;s what you earned:
          </p>
        </motion.div>

        {/* Stars pop */}
        <motion.div className="flex gap-3"
          initial={{ opacity:0, scale:0.5 }} animate={{ opacity:1, scale:1 }}
          transition={{ type:"spring", stiffness:300, damping:16, delay:0.2 }}>
          {[0,1,2].map(i=>(
            <motion.span key={i} style={{ fontSize:"clamp(30px,7vw,46px)", filter: i<starsEarned?"none":"grayscale(1) opacity(0.3)" }}
              initial={{ scale:0, rotate:-30 }} animate={{ scale:1, rotate:0 }}
              transition={{ type:"spring", stiffness:380, damping:14, delay:0.3+i*0.12 }}>⭐</motion.span>
          ))}
        </motion.div>

        {/* Letter badge */}
        <motion.div className="rounded-3xl flex items-center gap-4 px-5 py-4 w-full bg-white/10 border-2 border-white/20"
          initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4 }}>
          <div className="rounded-2xl flex items-center justify-center flex-shrink-0 w-[60px] h-[60px] bg-gradient-to-br from-lf-yellow to-lf-orange border-[3px] border-lf-navy text-[30px]">
            {letter?.emoji ?? "🎉"}
          </div>
          <div>
            <p className="font-fredoka font-bold text-[18px] text-white">Letter {letter?.l ?? "A"} Mastered!</p>
            <p className="font-nunito text-[13px] text-white/60">+25 XP · +3 Stars · Badge Unlocked</p>
          </div>
          <motion.div className="ml-auto" initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", delay:0.6 }}>
            <Check size={24} color={C.green} strokeWidth={3} />
          </motion.div>
        </motion.div>

        {/* Badges */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {badges.map((b,i)=>(
            <motion.div key={b.label} className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 bg-white/10 border-[1.5px] border-white/20"
              initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
              transition={{ type:"spring", stiffness:320, damping:18, delay:0.5+i*0.1 }}>
              <div className="rounded-full flex items-center justify-center w-12 h-12 text-[22px]"
                style={{ background:`radial-gradient(circle,${b.color}CC,${b.color}66)`, border:`2px solid ${b.color}` }}>
                {b.emoji}
              </div>
              <span className="font-fredoka font-bold text-[10px] text-white/75 text-center leading-[1.2]">{b.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex gap-3 w-full justify-center flex-wrap">
          <StatPill emoji="⭐" value="+3" label="Stars"   valueColor={C.yellow} />
          <StatPill emoji="🏅" value="+1" label="Badge"   valueColor={C.orange} />
          <StatPill emoji="🔥" value="12" label="Streak"  valueColor={C.red}    />
          <StatPill emoji="⚡" value="+25" label="XP"     valueColor={C.teal}   />
        </div>

        {/* CTA */}
        <motion.button onClick={onContinue}
          className="w-full max-w-[400px] rounded-2xl flex items-center justify-center gap-2 h-14 border-[3px] border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)] font-fredoka font-bold text-[18px] text-lf-navy cursor-pointer bg-gradient-to-br from-lf-yellow to-lf-orange"
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75 }}>
          ➡️ Next Lesson!
        </motion.button>
      </div>
    </div>
  );
}

// ── J-Next Lesson teaser ──────────────────────────────────────────────────────
function JNextLesson({ currentIdx, onGo, onSkip }: { currentIdx: number; onGo: () => void; onSkip: () => void }) {
  const next = LETTERS[Math.min(currentIdx + 1, LETTERS.length - 1)];
  const current = LETTERS[currentIdx];
  const col = LETTER_COLORS_FULL[(currentIdx + 1) % LETTER_COLORS_FULL.length];
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 px-6 text-center bg-gradient-to-br from-[#F3EEFF] to-[#EAF4FF] font-fredoka font-nunito">
      <motion.div className="flex items-center gap-4 mb-2"
        initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
        transition={{ type:"spring", stiffness:280, damping:20 }}>
        {/* Current (done) */}
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-2xl flex items-center justify-center w-[72px] h-[72px] border-[3px] text-[36px]"
            style={{ background:`${LETTER_COLORS_FULL[currentIdx]}22`, borderColor:LETTER_COLORS_FULL[currentIdx] }}>
            {current?.emoji}
          </div>
          <span className="font-fredoka font-bold text-[16px]" style={{ color:LETTER_COLORS_FULL[currentIdx] }}>{current?.l}</span>
          <div className="rounded-full flex items-center justify-center w-[22px] h-[22px] bg-lf-green border-2 border-lf-navy">
            <Check size={11} color="#FFF" strokeWidth={3} />
          </div>
        </div>
        {/* Arrow */}
        <motion.span className="text-[28px] text-lf-mutedFg" animate={{ x:[0,8,0] }} transition={{ duration:1.2, repeat:Infinity }}>→</motion.span>
        {/* Next (upcoming) */}
        <motion.div className="flex flex-col items-center gap-1"
          animate={{ y:[0,-6,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>
          <div className="rounded-2xl flex items-center justify-center relative w-[88px] h-[88px] border-[3px] shadow-[4px_5px_0_var(--color-lf-navy)] text-[44px]"
            style={{ background:`${col}22`, borderColor:col }}>
            {next?.emoji}
            <motion.div className="absolute -top-2 -right-2 rounded-full flex items-center justify-center w-6 h-6 bg-lf-orange border-2 border-lf-navy text-[13px]"
              animate={{ rotate:[0,10,-10,0] }} transition={{ duration:1.5, repeat:Infinity }}>
              ✨
            </motion.div>
          </div>
          <span className="font-fredoka font-bold text-[18px]" style={{ color:col }}>{next?.l}</span>
          <span className="font-nunito text-[12px] text-lf-mutedFg">Up next!</span>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}>
        <h2 className="font-fredoka font-bold text-[clamp(22px,5vw,30px)] text-lf-navy">
          Next up: Letter {next?.l}!
        </h2>
        <p className="font-nunito text-[14px] text-lf-mutedFg mt-1.5 leading-relaxed">
          {next?.word} starts with <strong>{next?.l}</strong>. Let&apos;s learn it! {next?.emoji}
        </p>
      </motion.div>
      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <CTAButton label={`Learn ${next?.l} for ${next?.word}!`} color={col} onClick={onGo} />
        <button onClick={onSkip}
          className="font-nunito font-bold text-[13px] text-lf-mutedFg bg-transparent border-none cursor-pointer">
          See category progress →
        </button>
      </div>
    </div>
  );
}

// ── Category Complete ─────────────────────────────────────────────────────────
function JCatComplete({ onDashboard }: { onDashboard: () => void }) {
  const stats = [
    { emoji:"🔤", label:"Letters",  value:"26/26", color:C.red    },
    { emoji:"⭐", label:"Stars",    value:"78",    color:C.yellow },
    { emoji:"🏅", label:"Badges",   value:"6",     color:C.orange },
    { emoji:"🎮", label:"Games",    value:"12",    color:C.purple },
  ];
  return (
    <div className="flex flex-col items-center min-h-screen px-5 py-8 bg-gradient-to-br from-[#FF3B30] via-[#FF9500] to-[#FFD700] font-fredoka font-nunito">
      <RainingConfetti />
      <div className="relative z-10 flex flex-col items-center gap-5 w-full" style={{ maxWidth:460 }}>
        {/* Trophy */}
        <motion.div initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
          transition={{ type:"spring", stiffness:280, damping:16, delay:0.1 }}>
          <div className="rounded-full flex items-center justify-center w-[120px] h-[120px] bg-white/20 border-[4px] border-white/50 backdrop-blur-[8px] text-[64px]">
            🏆
          </div>
        </motion.div>
        <motion.div className="text-center" initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}>
          <h1 className="font-fredoka font-bold text-[clamp(26px,6vw,40px)] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
            Alphabet Complete!
          </h1>
          <p className="font-nunito text-[15px] text-white/80 mt-1.5 leading-relaxed">
            You learned every letter from A to Z! That&apos;s incredible! 🎊
          </p>
        </motion.div>

        {/* Stars */}
        <motion.div className="flex gap-2" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
          {[0,1,2,3,4].map(i=>(
            <motion.span key={i} style={{ fontSize:"clamp(22px,5vw,34px)" }}
              initial={{ scale:0, rotate:-20 }} animate={{ scale:1, rotate:0 }}
              transition={{ type:"spring", stiffness:360, damping:14, delay:0.35+i*0.1 }}>⭐</motion.span>
          ))}
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-4 gap-3 w-full">
          {stats.map((s,i)=>(
            <motion.div key={s.label}
              className="flex flex-col items-center rounded-2xl py-3 px-1 bg-white/20 border-2 border-white/40"
              initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
              transition={{ type:"spring", stiffness:300, damping:18, delay:0.4+i*0.08 }}>
              <span className="text-[clamp(18px,4vw,26px)]">{s.emoji}</span>
              <span className="font-fredoka font-bold text-[clamp(14px,3vw,20px)] text-white mt-0.5">{s.value}</span>
              <span className="font-nunito text-[9px] text-white/70 mt-[1px]">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Certificate */}
        <motion.div className="w-full rounded-3xl overflow-hidden bg-white/20 border-[3px] border-white/50 backdrop-blur-[10px]"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.6 }}>
          <div className="flex items-center gap-4 px-5 py-4">
            <span className="text-[44px] shrink-0">🎓</span>
            <div>
              <p className="font-fredoka font-bold text-[17px] text-white">Certificate of Excellence</p>
              <p className="font-nunito text-[13px] text-white/75 mt-0.5">
                Awarded for completing the full Alphabet module with distinction!
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button onClick={onDashboard}
          className="w-full rounded-2xl flex items-center justify-center gap-2 h-[58px] bg-white/95 border-[3px] border-lf-navy shadow-[4px_6px_0_var(--color-lf-navy)] font-fredoka font-bold text-[18px] text-lf-navy cursor-pointer"
          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.75 }}>
          📊 See My Dashboard →
        </motion.button>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const DASH_WEEK = [
  { day:"Mon", lessons:3, stars:8  },
  { day:"Tue", lessons:5, stars:14 },
  { day:"Wed", lessons:2, stars:5  },
  { day:"Thu", lessons:7, stars:21 },
  { day:"Fri", lessons:4, stars:11 },
  { day:"Sat", lessons:6, stars:17 },
  { day:"Sun", lessons:1, stars:3  },
];
const BAR_COLORS = [C.red, C.orange, C.yellow, C.green, C.teal, C.blue, C.purple];

const DASH_SUBJECTS = [
  { emoji:"🔤", label:"Alphabet", pct:100, color:C.red    },
  { emoji:"🔢", label:"Numbers",  pct:40,  color:C.blue   },
  { emoji:"🔷", label:"Shapes",   pct:80,  color:C.teal   },
  { emoji:"🎨", label:"Colors",   pct:100, color:C.green  },
  { emoji:"🐾", label:"Animals",  pct:25,  color:C.orange },
  { emoji:"🍎", label:"Fruits",   pct:10,  color:C.pink   },
];

function CircleProgress({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.muted} strokeWidth={6} />
      <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={6}
        strokeLinecap="round" strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration:1.2, ease:"easeOut", delay:0.3 }} />
    </svg>
  );
}

function JDashboard({ onRestart, onExit }: { onRestart: () => void; onExit: () => void }) {
  const heroStats = [
    { emoji:"⭐", value:234, label:"Total Stars",  color:C.yellow },
    { emoji:"🔥", value:12,  label:"Day Streak",   color:C.orange },
    { emoji:"🏅", value:6,   label:"Badges",       color:C.purple },
    { emoji:"📚", value:28,  label:"Lessons Done", color:C.blue   },
  ];
  return (
    <div className="min-h-screen bg-[#F3EEFF] font-fredoka font-nunito">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 bg-white/95 border-b-[3px] border-b-lf-navy shadow-[0_3px_16px_rgba(26,0,80,0.09)]">
        <div>
          <h1 className="font-fredoka font-bold text-[clamp(18px,3vw,24px)] text-lf-navy">
            📊 My Dashboard
          </h1>
          <p className="font-nunito text-[12px] text-lf-mutedFg">Journey complete · Great job! 🏆</p>
        </div>
        <div className="flex items-center gap-2">
          <motion.button onClick={onRestart}
            className="rounded-2xl px-3 py-2 flex items-center gap-1.5 bg-lf-green border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] font-fredoka font-bold text-[13px] text-white cursor-pointer"
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.93 }}>
            🔄 Restart
          </motion.button>
          <button onClick={onExit}
            className="font-nunito font-bold text-[12px] text-lf-mutedFg bg-transparent border-none cursor-pointer">
            ✕ Exit
          </button>
        </div>
      </div>

      <div className="overflow-y-auto lf-carousel p-[clamp(12px,3vw,24px)]">

        {/* Hero stats */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {heroStats.map((s,i)=>(
            <motion.div key={s.label}
              className="flex flex-col items-center rounded-2xl py-3 px-1 bg-white border-[2.5px] border-lf-muted shadow-[3px_4px_0_rgba(26,0,80,0.10)]"
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.06*i, type:"spring", stiffness:260, damping:20 }}>
              <span className="text-[clamp(20px,4vw,28px)]">{s.emoji}</span>
              <motion.span
                className="font-fredoka font-bold text-[clamp(18px,4vw,26px)] leading-none mt-0.5" style={{ color:s.color }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2+0.06*i }}>
                {s.value}
              </motion.span>
              <span className="font-nunito text-[9px] text-lf-mutedFg text-center mt-[1px]">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Weekly bar chart */}
        <motion.div className="rounded-3xl p-4 mb-4 bg-white border-2 border-lf-muted shadow-[4px_5px_0_rgba(26,0,80,0.10)]"
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}>
          <h3 className="font-fredoka font-bold text-[15px] text-lf-navy mb-3">
            📅 This Week&apos;s Lessons
          </h3>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={DASH_WEEK} barSize={22} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <XAxis dataKey="day" tick={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fill:C.mutedFg }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:"'Nunito',sans-serif", fontSize:10, fill:C.mutedFg }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ fontFamily:"'Fredoka',sans-serif", borderRadius:12, border:`2px solid ${C.navy}`, fontSize:12 }}
                cursor={{ fill:"rgba(26,0,80,0.05)", radius:6 }} />
              <Bar dataKey="lessons" radius={[6,6,0,0]}>
                {DASH_WEEK.map((d,i)=><Cell key={`lessons-${d.day}`} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Stars chart */}
        <motion.div className="rounded-3xl p-4 mb-4 bg-white border-2 border-lf-muted shadow-[4px_5px_0_rgba(26,0,80,0.10)]"
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.24 }}>
          <h3 className="font-fredoka font-bold text-[15px] text-lf-navy mb-3">
            ⭐ Stars This Week
          </h3>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={DASH_WEEK} barSize={18} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <XAxis dataKey="day" tick={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fill:C.mutedFg }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily:"'Nunito',sans-serif", fontSize:10, fill:C.mutedFg }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontFamily:"'Fredoka',sans-serif", borderRadius:12, border:`2px solid ${C.navy}`, fontSize:12 }} cursor={{ fill:"rgba(255,215,0,0.08)", radius:6 }} />
              <Bar dataKey="stars" radius={[6,6,0,0]} fill={C.yellow} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Subject progress */}
        <motion.div className="rounded-3xl p-4 mb-4 bg-white border-2 border-lf-muted shadow-[4px_5px_0_rgba(26,0,80,0.10)]"
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}>
          <h3 className="font-fredoka font-bold text-[15px] text-lf-navy mb-3.5">
            📚 Subject Mastery
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {DASH_SUBJECTS.map((s,i)=>(
              <motion.div key={s.label} className="flex flex-col items-center gap-1.5"
                initial={{ opacity:0, scale:0.7 }} animate={{ opacity:1, scale:1 }}
                transition={{ delay:0.35+i*0.06, type:"spring" }}>
                <div className="relative flex items-center justify-center">
                  <CircleProgress pct={s.pct} color={s.color} size={60} />
                  <span className="absolute text-[22px]">{s.emoji}</span>
                </div>
                <span className="font-fredoka font-bold text-[11px] text-lf-navy">{s.label}</span>
                <span className="font-nunito font-bold text-[10px]" style={{ color:s.color }}>{s.pct}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent achievements */}
        <motion.div className="rounded-3xl p-4 mb-6 bg-white border-2 border-lf-muted shadow-[4px_5px_0_rgba(26,0,80,0.10)]"
          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.36 }}>
          <h3 className="font-fredoka font-bold text-[15px] text-lf-navy mb-3">
            🏅 Recent Achievements
          </h3>
          {[
            { emoji:"🔤", label:"Alphabet Ace",   desc:"Completed all 26 letters!",    time:"Just now",   color:C.red    },
            { emoji:"🔥", label:"On Fire!",        desc:"12-day learning streak",       time:"Today",      color:C.orange },
            { emoji:"🎮", label:"Game Master",     desc:"Won 10 games in a row",        time:"Yesterday",  color:C.purple },
            { emoji:"⭐", label:"Star Collector",  desc:"Earned 200+ stars total",      time:"3 days ago", color:C.yellow },
          ].map((a,i)=>(
            <motion.div key={a.label} className="flex items-center gap-3 mb-3"
              initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.4+i*0.07 }}>
              <div className="rounded-xl flex items-center justify-center flex-shrink-0 w-10 h-10 text-[20px]"
                style={{ background:`${a.color}20`, border:`2px solid ${a.color}55` }}>
                {a.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-fredoka font-bold text-[13px] text-lf-navy">{a.label}</p>
                <p className="font-nunito text-[11px] text-lf-mutedFg">{a.desc}</p>
              </div>
              <span className="font-nunito text-[10px] text-lf-mutedFg shrink-0">{a.time}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Restart CTA */}
        <CTAButton label="🚀 Start New Journey!" color={C.purple} onClick={onRestart} />
        <div className="h-6" />
      </div>
    </div>
  );
}

// ── Journey orchestrator ──────────────────────────────────────────────────────
export function JourneyFlow({ onExit }: { onExit: () => void }) {
  const [step,    setStep]    = useState<JStep>("home");
  const [dir,     setDir]     = useState<TDir>("fade");
  const [letterIdx, setLetterIdx] = useState(0);
  const [gameSkipped, setGameSkipped] = useState(false);

  function go(next: JStep, d: TDir = "forward") {
    setDir(d);
    setStep(next);
  }

  const bgMap: Partial<Record<JStep, string>> = {
    splash:       "linear-gradient(155deg,#1A0050,#4B0082,#7B2FF7)",
    home:         "#FFFFFF",
    category:     "#F3EEFF",
    lesson:       "#F3EEFF",
    "game-prompt":"linear-gradient(160deg,#E8DFFF,#F3EEFF)",
    game:         "#F3EEFF",
    reward:       "linear-gradient(155deg,#1A0050,#4B0082,#7B2FF7)",
    "next-lesson":"linear-gradient(160deg,#F3EEFF,#EAF4FF)",
    "cat-complete":"linear-gradient(155deg,#FF3B30,#FF9500,#FFD700)",
    dashboard:    "#F3EEFF",
  };

  return (
    <div style={{ height:"100dvh", minHeight:"100vh", overflow:"hidden", position:"relative",
      fontFamily:"'Fredoka','Nunito',sans-serif", background: bgMap[step] ?? "#F3EEFF" }}>

      <AnimatePresence mode="wait">
        {step === "splash" && (
          <JScreen key="splash" id="splash" dir={dir} bg={bgMap.splash}>
            <JSplash onDone={() => go("home", "zoom-out")} />
          </JScreen>
        )}

        {step === "home" && (
          <JScreen key="home" id="home" dir={dir} bg="#FFFFFF">
            <JHome
              onStartJourney={() => go("category", "forward")}
              onExit={onExit}
            />
          </JScreen>
        )}

        {step === "category" && (
          <JScreen key="category" id="category" dir={dir} bg="#F3EEFF">
            <AlphabetPage
              onBack={() => go("home", "back")}
              onContinue={() => { setLetterIdx(0); go("lesson", "zoom-in"); }}
              learnedCount={0}
            />
          </JScreen>
        )}

        {step === "lesson" && (
          <JScreen key={`lesson-${letterIdx}`} id={`lesson-${letterIdx}`} dir={dir} bg="#F3EEFF">
            <LessonScreen
              letterIndex={letterIdx}
              onBack={() => go("category", "back")}
              onComplete={() => go("game-prompt", "up")}
              onNavigate={(i) => { setLetterIdx(i); go("lesson", i > letterIdx ? "forward" : "back"); }}
            />
          </JScreen>
        )}

        {step === "game-prompt" && (
          <JScreen key="game-prompt" id="game-prompt" dir={dir} bg="linear-gradient(160deg,#E8DFFF,#F3EEFF)">
            <JGamePrompt
              letterEmoji={LETTERS[letterIdx]?.emoji ?? "🍎"}
              letterLabel={LETTERS[letterIdx]?.l ?? "A"}
              onPlay={() => go("game", "forward")}
              onSkip={() => { setGameSkipped(true); go("reward", "forward"); }}
            />
          </JScreen>
        )}

        {step === "game" && (
          <JScreen key="game" id="game" dir={dir} bg="#F3EEFF">
            <MemoryMatchGame onBack={() => go("reward", "zoom-in")} />
          </JScreen>
        )}

        {step === "reward" && (
          <JScreen key="reward" id="reward" dir={dir} bg="linear-gradient(155deg,#1A0050,#4B0082,#7B2FF7)">
            <JReward
              letterIdx={letterIdx}
              starsEarned={gameSkipped ? 1 : 3}
              onContinue={() => go("next-lesson", "forward")}
            />
          </JScreen>
        )}

        {step === "next-lesson" && (
          <JScreen key="next-lesson" id="next-lesson" dir={dir} bg="linear-gradient(160deg,#F3EEFF,#EAF4FF)">
            <JNextLesson
              currentIdx={letterIdx}
              onGo={() => {
                const ni = Math.min(letterIdx + 1, LETTERS.length - 1);
                setLetterIdx(ni);
                setGameSkipped(false);
                go("lesson", "forward");
              }}
              onSkip={() => go("cat-complete", "up")}
            />
          </JScreen>
        )}

        {step === "cat-complete" && (
          <JScreen key="cat-complete" id="cat-complete" dir={dir} bg="linear-gradient(155deg,#FF3B30,#FF9500,#FFD700)">
            <JCatComplete onDashboard={() => go("dashboard", "zoom-in")} />
          </JScreen>
        )}

        {step === "dashboard" && (
          <JScreen key="dashboard" id="dashboard" dir={dir} bg="#F3EEFF">
            <JDashboard
              onRestart={() => { setLetterIdx(0); setGameSkipped(false); go("splash", "zoom-out"); }}
              onExit={onExit}
            />
          </JScreen>
        )}
      </AnimatePresence>
    </div>
  );
}
