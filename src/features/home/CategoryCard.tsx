import { motion } from "motion/react";
import { Lock, Star, Check, Play, RotateCcw } from "lucide-react";
import { C, type Category } from "@/app/constants";
import { Sparkle } from "@/components/feedback/Sparkle";

export function CategoryCard({ cat, index, onNavigate }: { cat: Category; index: number; onNavigate?: () => void }) {
  const isLocked   = cat.state === "locked";
  const isComplete = cat.state === "complete";
  const isNew      = cat.state === "new";
  const isActive   = cat.state === "active";
  const stars      = Math.round((cat.progress / 100) * 3);

  const borderCol  = isComplete ? "#FFD700" : isLocked ? "#C4B8DC" : C.navy;
  const shadowCol  = isComplete ? "#B8860B" : isLocked ? "rgba(196,184,220,0.4)" : C.navy;
  const glow       = isComplete ? ", 0 0 22px #FFD70055" : "";

  return (
    <motion.article
      onClick={isLocked ? undefined : onNavigate}
      className="relative flex-shrink-0 flex flex-col cursor-pointer select-none"
      style={{
        width:        "clamp(188px, 19vw, 296px)",
        minHeight:    "clamp(268px, 36vh, 418px)",
        borderRadius: 28,
        border:       `3px solid ${borderCol}`,
        boxShadow:    `4px 6px 0 ${shadowCol}${glow}`,
        overflow:     "hidden",
        filter:       isLocked ? "grayscale(0.5) brightness(0.9)" : "none",
        scrollSnapAlign: "center",
      }}
      initial={{ opacity: 0, y: 36, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.055, type: "spring", stiffness: 280, damping: 22 }}
      whileHover={isLocked ? {} : { scale: 1.04 }}
      whileTap={isLocked ? {} : { scale: 0.97 }}
    >
      {/* ── Illustration area ──────────────────────────── */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          flex: "0 0 52%",
          background: isLocked
            ? "linear-gradient(135deg, #C8BDE0 0%, #A89AC8 100%)"
            : `linear-gradient(140deg, ${cat.color}F2 0%, ${cat.dark}C8 100%)`,
        }}
      >
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 55%)" }} />
        {cat.deco.map((d, i) => (
          <span key={i} className="absolute pointer-events-none select-none" style={{
            fontSize: "1.05rem", opacity: 0.2,
            top: ["12%", "62%", "32%"][i], left: ["9%", "72%", "83%"][i],
            transform: `rotate(${[-18, 22, -12][i]}deg)`,
          }}>{d}</span>
        ))}
        <motion.span className="relative" style={{
          fontSize: "clamp(54px, 7vw, 92px)",
          filter: `drop-shadow(3px 5px 0 rgba(26,0,80,${isLocked ? "0.18" : "0.38"}))`,
          lineHeight: 1,
        }}
          animate={isLocked ? {} : { y: [0, -9, 0] }}
          transition={{ duration: 2.6 + index * 0.14, repeat: Infinity, ease: "easeInOut" }}
        >{cat.emoji}</motion.span>
        {isNew && (
          <motion.div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl" style={{
            background: C.yellow, color: C.navy, border: `2.5px solid ${C.navy}`,
            boxShadow: `2px 3px 0 ${C.navy}`, fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 11,
          }}
            animate={{ rotate: [-5, 5, -5], scale: [1, 1.06, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
          >✨ NEW!</motion.div>
        )}
        {isComplete && (
          <motion.div className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "#FFD700", border: `3px solid ${C.navy}`, boxShadow: `2px 3px 0 ${C.navy}` }}
            animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          ><Check size={16} color={C.navy} strokeWidth={3} /></motion.div>
        )}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(26,0,80,0.2)" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.88)", border: `3px solid ${C.navy}`, boxShadow: `3px 4px 0 ${C.navy}` }}
            ><Lock size={22} color={C.navy} /></div>
          </div>
        )}
        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.88)", border: "1.5px solid rgba(26,0,80,0.12)" }}>
          <span className="font-bold" style={{ color: isLocked ? C.mutedFg : cat.color, fontFamily: "'Nunito',sans-serif", fontSize: 11 }}>
            {cat.lessons} lessons
          </span>
        </div>
        {isComplete && <Sparkle size={16} color={C.yellow} style={{ position: "absolute", top: 8, left: 10, opacity: 0.7 }} />}
      </div>

      {/* ── Info + CTA wrapper ─────────────────────────── */}
      <div className="flex flex-col bg-white" style={{ flex: 1, minHeight: 0 }}>
        <div className="flex flex-col gap-1.5 p-3.5" style={{ flex: 1 }}>
          <div>
            <h3 className="leading-none mb-0.5" style={{
              fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
              fontSize: "clamp(14px, 1.25vw, 19px)", color: isLocked ? C.mutedFg : C.navy,
            }}>{cat.title}</h3>
            <p style={{ color: C.mutedFg, fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: "clamp(10px, 0.8vw, 13px)" }}>
              {cat.subtitle}
            </p>
          </div>
          {(isActive || isComplete) && (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map(n => (
                <Star key={n} size={13} fill={n <= stars ? C.yellow : "none"} color={n <= stars ? "#CC9F00" : C.muted} strokeWidth={1.5} />
              ))}
              <span style={{ color: C.mutedFg, fontFamily: "'Nunito',sans-serif", fontSize: 11, fontWeight: 700, marginLeft: 3 }}>
                {cat.progress}%
              </span>
            </div>
          )}
          {(isActive || isComplete) && (
            <div className="h-2 rounded-full overflow-hidden" style={{ background: C.muted }}>
              <motion.div className="h-full rounded-full"
                style={{ background: isComplete ? "linear-gradient(90deg,#FFD700,#FF9500)" : cat.color }}
                initial={{ width: 0 }} animate={{ width: `${cat.progress}%` }}
                transition={{ duration: 0.9, delay: index * 0.055 + 0.35, ease: "easeOut" }}
              />
            </div>
          )}
        </div>
        {isLocked ? (
          <div className="flex items-center justify-center gap-1.5 flex-shrink-0" style={{
            padding: "11px 16px", background: C.muted, borderTop: `2.5px solid rgba(26,0,80,0.12)`,
            fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(12px, 1vw, 15px)", color: C.mutedFg,
          }}><Lock size={13} /> Locked</div>
        ) : (
          <motion.button className="flex items-center justify-center gap-1.5 flex-shrink-0" style={{
            padding: "11px 16px",
            background: isComplete ? `linear-gradient(90deg,#FFD700,#FF9500)` : cat.color,
            borderTop: `2.5px solid ${C.navy}`, fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
            fontSize: "clamp(12px, 1vw, 15px)", color: C.white, width: "100%",
          }}
            whileHover={{ filter: "brightness(1.08)" }} whileTap={{ filter: "brightness(0.92)" }}
          >
            {isComplete ? <><RotateCcw size={13} /> Play Again</>
             : isNew    ? <><Play size={13} fill={C.white} /> Start!</>
             :             <><Play size={13} fill={C.white} /> Continue</>}
          </motion.button>
        )}
      </div>
    </motion.article>
  );
}
