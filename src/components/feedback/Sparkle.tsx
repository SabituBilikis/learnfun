import React from "react";
import { motion } from "motion/react";
import { C } from "@/app/constants";

// ── Sparkle (shared visual used in many places) ───────────────────────────────
export function Sparkle({ size = 18, color = C.yellow, style }: { size?: number; color?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 0 L13.6 9.2 L22 10.5 L13.6 11.8 L12 22 L10.4 11.8 L2 10.5 L10.4 9.2 Z" />
    </svg>
  );
}

// ── Ambient corner sparkles (looping decorative set) ──────────────────────────
export interface SparkleSpot {
  top: string;
  left?: string;
  right?: string;
  size: number;
  color: string;
}

export function AmbientSparkles({
  spots,
  zIndex,
  rotate = 22,
  scaleTo = 1.3,
  opacityRange = [0.6, 1],
  baseDuration = 3.2,
  durationStep = 0.7,
}: {
  spots: SparkleSpot[];
  zIndex?: number;
  rotate?: number;
  scaleTo?: number;
  /** [min, max] loop opacity, or null to skip animating opacity. */
  opacityRange?: [number, number] | null;
  baseDuration?: number;
  durationStep?: number;
}) {
  return (
    <>
      {spots.map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ zIndex, top: s.top, left: s.left, right: s.right }}
          animate={{
            rotate: [0, rotate, 0],
            scale: [1, scaleTo, 1],
            ...(opacityRange ? { opacity: [opacityRange[0], opacityRange[1], opacityRange[0]] } : {}),
          }}
          transition={{ duration: baseDuration + i * durationStep, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkle size={s.size} color={s.color} />
        </motion.div>
      ))}
    </>
  );
}
