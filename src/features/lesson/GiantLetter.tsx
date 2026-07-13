import { motion } from "motion/react";
import { C } from "@/app/constants";

// ── The giant letter card (clickable) ─────────────────────────────────────────
export function GiantLetter({ letter, color, onClick, pulsing }: { letter: string; color: string; onClick: () => void; pulsing: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        onClick={onClick}
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: "clamp(140px,20vw,280px)", height: "clamp(140px,20vw,280px)",
          background: C.white, border: `5px solid ${C.navy}`, boxShadow: `8px 10px 0 ${C.navy}`,
          cursor: "pointer", flexShrink: 0,
        }}
        animate={pulsing ? { scale: [1, 1.06, 1] } : { scale: [1, 1.025, 1] }}
        transition={pulsing
          ? { duration: 0.35, repeat: 3, ease: "easeInOut" }
          : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
      >
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(84px,13vw,180px)", color, lineHeight: 1, userSelect: "none" }}>
          {letter}
        </span>
      </motion.button>
      {/* Lowercase pill */}
      <motion.div
        className="px-6 py-1.5 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.5)" }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(28px,4.5vw,52px)", color: C.white, lineHeight: 1 }}>
          {letter.toLowerCase()}
        </span>
      </motion.div>
    </div>
  );
}
