import { motion } from "motion/react";
import { C } from "@/app/constants";

// ── Mascot with reactive speech bubble ────────────────────────────────────────
export function LessonMascot({ reacting }: { reacting: boolean; word?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.span
        className="select-none"
        style={{ fontSize: "clamp(56px,9vw,130px)", lineHeight: 1, display: "block", filter: "drop-shadow(2px 4px 0 rgba(26,0,80,0.3))" }}
        animate={reacting
          ? { scale: [1, 1.3, 1], rotate: [-12, 12, 0] }
          : { y: [0, -10, 0] }}
        transition={reacting
          ? { duration: 0.45, ease: "easeInOut" }
          : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        🦊
      </motion.span>
      <motion.div
        className="relative px-4 py-2 rounded-2xl text-center"
        style={{ background: C.white, border: `2.5px solid ${C.navy}`, boxShadow: `3px 4px 0 ${C.navy}`, minWidth: 80 }}
        animate={reacting ? { scale: [0.85, 1.12, 1] } : { scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Bubble tail (upward pointing) */}
        <div className="absolute" style={{ top: -11, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderBottom: `11px solid ${C.navy}` }} />
        <div className="absolute" style={{ top: -7, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "9px solid white" }} />
        <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(13px,1.5vw,18px)", color: reacting ? C.red : C.navy, whiteSpace: "nowrap" }}>
          {reacting ? "Ayyy! 🎉" : "Tap me! 👆"}
        </span>
      </motion.div>
    </div>
  );
}
