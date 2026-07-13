import { motion } from "motion/react";
import { C } from "@/app/constants";

// ── Progress dots strip ───────────────────────────────────────────────────────
export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-[3px]" style={{ maxWidth: "clamp(160px,30vw,320px)" }}>
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full flex-shrink-0"
          animate={{
            width:      i === current ? 20 : 6,
            background: i < current
              ? "rgba(255,255,255,0.7)"
              : i === current
                ? C.yellow
                : "rgba(255,255,255,0.28)",
          }}
          transition={{ duration: 0.22 }}
          style={{ height: 6 }}
        />
      ))}
    </div>
  );
}
