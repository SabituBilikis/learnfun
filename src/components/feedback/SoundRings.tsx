import { motion } from "motion/react";

// ── Radiating sound-wave rings ────────────────────────────────────────────────
export function SoundRings({ active }: { active: boolean }) {
  return (
    <>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ inset: 0, border: "3px solid rgba(255,255,255,0.55)", borderRadius: "50%" }}
          animate={active
            ? { scale: [1, 1.9 + i * 0.35], opacity: [0.7, 0] }
            : { scale: 1, opacity: 0 }}
          transition={{ duration: 1.1, delay: i * 0.28, repeat: active ? Infinity : 0, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
