import { motion } from "motion/react";
import { C } from "@/app/constants";

// ── Illustration panel (emoji + word label) ───────────────────────────────────
export function IllustrationPanel({ emoji, word }: { emoji: string; word: string; color?: string }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.span
        className="select-none"
        style={{ fontSize: "clamp(60px,10vw,148px)", lineHeight: 1, filter: "drop-shadow(4px 7px 0 rgba(26,0,80,0.35))" }}
        animate={{ y: [0, -14, 0], rotate: [-5, 5, -5] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      >
        {emoji}
      </motion.span>
      <motion.div
        className="px-5 py-2 rounded-2xl"
        style={{ background: "rgba(255,255,255,0.22)", border: "2px solid rgba(255,255,255,0.55)", backdropFilter: "blur(8px)" }}
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2.6, repeat: Infinity }}
      >
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(18px,2.5vw,30px)", color: C.white, letterSpacing: 1 }}>
          {word}
        </span>
      </motion.div>
    </div>
  );
}
