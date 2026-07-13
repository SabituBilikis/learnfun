import React from "react";
import { motion } from "motion/react";
import { C } from "@/app/constants";

// ── Confetti burst ─────────────────────────────────────────────────────────────
export function ConfettiBurst({ trigger }: { trigger: number }) {
  const PIECES = 20;
  const pieces = React.useMemo(() =>
    Array.from({ length: PIECES }, (_, i) => ({
      angle:  (i / PIECES) * 360 + Math.random() * 10,
      color:  [C.yellow, C.orange, C.pink, C.teal, C.green, C.blue, C.purple, C.white][i % 8],
      size:   6 + Math.random() * 7,
      dist:   100 + Math.random() * 80,
      shape:  i % 3 === 0 ? "50%" : "4px",
    })), []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 30 }}>
      {pieces.map((p, i) => (
        <motion.div
          key={`${trigger}-${i}`}
          className="absolute"
          style={{ width: p.size, height: p.size, background: p.color, borderRadius: p.shape, border: `1.5px solid rgba(26,0,80,0.25)` }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={trigger > 0 ? {
            x: Math.cos((p.angle * Math.PI) / 180) * p.dist,
            y: Math.sin((p.angle * Math.PI) / 180) * p.dist,
            scale: [0, 1.5, 1],
            opacity: [1, 1, 0],
            rotate: [0, 180 + i * 15],
          } : {}}
          transition={{ duration: 0.85, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
