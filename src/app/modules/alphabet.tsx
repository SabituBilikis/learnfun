import { motion } from "motion/react";
import { Check, Play } from "lucide-react";
import { C, LETTERS } from "../constants";
import { Sparkle, AmbientSparkles, BackButton, StarRow, CategoryHero, StatPill, ProgressTrack, CTAButton } from "./primitives";
import { useProgress, formatStreak } from "../../hooks/useProgress";

const LETTER_PALETTE = [C.red, C.orange, "#F5C518", C.green, C.teal, C.blue, C.purple, C.pink];

type LetterState = "complete" | "current" | "upcoming";

function LetterCard({ letter, word, emoji, state, index, onTap }: {
  letter: string; word: string; emoji: string; state: LetterState; index: number; onTap?: () => void;
}) {
  const color  = LETTER_PALETTE[index % LETTER_PALETTE.length];
  const isDone = state === "complete";
  const isCurr = state === "current";
  const bg     = isDone || isCurr ? color : C.muted;
  const fg     = isDone || isCurr ? C.white : C.mutedFg;
  const border = isDone || isCurr ? C.navy : "rgba(26,0,80,0.15)";
  const shadow = isDone || isCurr ? `3px 4px 0 ${C.navy}` : "none";

  return (
    <motion.div
      onClick={onTap}
      className="relative flex flex-col items-center justify-center rounded-3xl cursor-pointer select-none"
      style={{ aspectRatio: "1", background: bg, border: `2.5px solid ${border}`, boxShadow: shadow, padding: "clamp(6px,1vw,14px)", overflow: "hidden" }}
      initial={{ opacity: 0, scale: 0.65 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.025, type: "spring", stiffness: 340, damping: 24 }}
      whileHover={state === "upcoming" ? {} : { scale: 1.1 }}
      whileTap={state === "upcoming" ? {} : { scale: 0.92 }}
    >
      {isCurr && (
        <motion.div className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{ border: `3px solid ${C.yellow}` }}
          animate={{ opacity: [1, 0.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
        />
      )}
      <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(20px,3vw,34px)", color: fg, lineHeight: 1 }}>
        {letter}
      </span>
      <span style={{ fontSize: "clamp(14px,2vw,24px)", lineHeight: 1.3 }}>{emoji}</span>
      <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "clamp(7px,0.75vw,11px)", color: isDone || isCurr ? "rgba(255,255,255,0.85)" : C.mutedFg, textAlign: "center", lineHeight: 1.2, marginTop: 1 }}>
        {word}
      </span>
      {isDone && (
        <div className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: C.yellow, border: `1.5px solid ${C.navy}` }}>
          <Check size={10} color={C.navy} strokeWidth={3} />
        </div>
      )}
      {isCurr && (
        <motion.div className="absolute top-1 right-1"
          animate={{ rotate: [0, 18, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Sparkle size={13} color={C.yellow} />
        </motion.div>
      )}
    </motion.div>
  );
}

export function AlphabetPage({ onBack, onContinue, learnedCount }: { onBack: () => void; onContinue: () => void; learnedCount: number }) {
  const { progress: userProgress } = useProgress();
  const progress = Math.round((learnedCount / LETTERS.length) * 100);
  const stars    = 2;
  const nextLetter = LETTERS[learnedCount];

  const letterState = (i: number): LetterState => {
    if (i < learnedCount) return "complete";
    if (i === learnedCount) return "current";
    return "upcoming";
  };

  return (
    <div className="flex flex-col" style={{ height: "100dvh", background: "#FFFFFF", fontFamily: "'Fredoka','Nunito',sans-serif", overflow: "hidden" }}>

      {/* ── Fixed top bar ─────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 z-30"
        style={{ padding: "10px clamp(16px,3vw,48px)", background: "#FFFFFF", borderBottom: `3px solid ${C.navy}`, boxShadow: "0 2px 16px rgba(26,0,80,0.08)" }}>
        <BackButton onClick={onBack} />
        <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(18px,2.2vw,28px)", color: C.navy }}>
          🔤 Alphabet
        </h2>
        <div className="flex items-center gap-3">
          <StarRow earned={stars} total={3} size={22} />
          <div className="px-3 py-1.5 rounded-xl flex items-center gap-1.5"
            style={{ background: C.red, border: `2px solid ${C.navy}`, boxShadow: `2px 3px 0 ${C.navy}` }}>
            <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 14, color: C.white }}>
              {learnedCount}/{LETTERS.length} ✓
            </span>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ───────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "clamp(16px,2.5vw,32px) clamp(16px,3vw,48px)" }}>

        {/* Hero */}
        <CategoryHero title="Alphabet" emoji="🔤" subtitle="Learn all 26 letters · Sounds · Words" color={C.red} dark="#CC2A20" mascot="🦊" />

        {/* Floating sparkles on hero */}
        <div className="relative" style={{ marginTop: -10 }}>
          <AmbientSparkles
            rotate={20}
            scaleTo={1.25}
            opacityRange={null}
            baseDuration={3}
            durationStep={0.5}
            spots={[
              { top:"-60px", left:"8%",   size:18, color:C.yellow },
              { top:"-40px", right:"12%", size:14, color:C.pink },
              { top:"-70px", left:"45%",  size:12, color:C.teal },
            ]}
          />
        </div>

        {/* Stats + progress bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-5 p-4 rounded-3xl"
          style={{ background: C.cream, border: `2.5px solid ${C.navy}`, boxShadow: `4px 5px 0 ${C.navy}` }}>
          <div className="flex gap-3 flex-shrink-0">
            <StatPill emoji="⭐" value={`${stars}/3`}           label="Stars"   valueColor="#CC9F00"  />
            <StatPill emoji="🎯" value={`${learnedCount}/26`} label="Done"    valueColor={C.blue}   />
            <StatPill emoji="🔥" value={formatStreak(userProgress.streakDays)} label="Streak"  valueColor={C.orange} />
          </div>
          <div className="flex-1">
            <ProgressTrack progress={progress} color={C.red} height={14} label="Overall Progress" />
          </div>
        </div>

        {/* Section heading */}
        <div className="flex items-center gap-2 mt-7 mb-4">
          <Sparkle size={16} color={C.yellow} />
          <h3 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(17px,2vw,24px)", color: C.navy }}>
            All 26 Letters
          </h3>
          <span style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: C.mutedFg }}>
            — tap any letter to learn!
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {[
            { bg: C.red,   label: "Learned",  icon: <Check size={11} color={C.navy} strokeWidth={3} /> },
            { bg: C.orange, label: "Current",  icon: <Sparkle size={11} color={C.yellow} /> },
            { bg: C.muted, label: "Coming up", icon: null },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-lg flex items-center justify-center" style={{ background: item.bg, border: `1.5px solid ${item.bg === C.muted ? "rgba(26,0,80,0.15)" : C.navy}` }}>
                {item.icon}
              </div>
              <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 12, color: C.mutedFg }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 26 letter cards grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(70px,9vw,108px),1fr))", gap: "clamp(8px,1.2vw,16px)" }}>
          {LETTERS.map((l, i) => (
            <LetterCard key={l.l} letter={l.l} word={l.word} emoji={l.emoji} state={letterState(i)} index={i} onTap={letterState(i) !== "upcoming" ? () => onContinue() : undefined} />
          ))}
        </div>

        <div style={{ height: 110 }} />
      </div>

      {/* ── Fixed bottom continue bar ─────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between gap-4 z-30"
        style={{ padding: "12px clamp(16px,3vw,48px)", background: "#FFFFFF", borderTop: `3px solid ${C.navy}`, boxShadow: "0 -4px 20px rgba(26,0,80,0.10)" }}>
        <div className="hidden sm:block">
          {nextLetter ? (
            <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: C.mutedFg }}>
              Next up: <span style={{ color: C.navy }}>{nextLetter.l} — {nextLetter.word} {nextLetter.emoji}</span>
            </p>
          ) : (
            <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, color: C.green }}>
              All letters complete! 🎉
            </p>
          )}
          <p style={{ fontFamily: "'Nunito',sans-serif", fontSize: 12, color: C.mutedFg }}>
            {LETTERS.length - learnedCount} letters remaining
          </p>
        </div>
        <div className="hidden sm:flex flex-1 max-w-xs">
          <ProgressTrack progress={progress} color={C.red} height={10} />
        </div>
        <CTAButton label="Continue Learning" color={C.red} icon={<Play size={16} fill={C.white} />} onClick={onContinue} />
      </div>
    </div>
  );
}
