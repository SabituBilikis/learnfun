import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { C } from "../../../app/constants";
import type { DragTask, DDState } from "./types";
import { HintRings, DropParticles } from "./GameUI";

export function DropZone({
  task, ddState, isOver, zoneRef,
}: {
  task: DragTask; ddState: DDState; isOver: boolean; zoneRef: React.RefObject<HTMLDivElement>;
}) {
  const zone = task.zone;
  const isCorrect   = ddState === "correct";
  const isCompleted = ddState === "completed";

  return (
    <div ref={zoneRef} className="relative flex flex-col items-center gap-3">
      {/* Label */}
      <div className="px-4 py-1.5 rounded-2xl" style={{ background:zone.bg, border:`2.5px solid ${zone.color}`, boxShadow:`2px 3px 0 rgba(26,0,80,0.15)` }}>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(14px,2.5vw,18px)", color:zone.color }}>
          {zone.label}
        </span>
      </div>

      {/* Zone circle */}
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        style={{
          width:"clamp(130px,22vw,200px)",
          height:"clamp(130px,22vw,200px)",
          background: isCorrect || isCompleted ? zone.bg : isOver ? `${zone.bg}` : "rgba(255,255,255,0.55)",
          border: `4px dashed ${isCorrect || isCompleted ? zone.color : isOver ? zone.color : "rgba(26,0,80,0.22)"}`,
          boxShadow: isOver ? `0 0 0 6px ${zone.color}33` : "none",
          transition:"background 0.2s, border-color 0.2s, box-shadow 0.2s",
          fontSize:"clamp(52px,11vw,80px)",
        }}
        animate={isOver ? { scale:1.08 } : isCorrect ? { scale:[1,1.15,1] } : { scale:1 }}
        transition={{ type:"spring", stiffness:340, damping:18 }}
      >
        {/* Hint rings */}
        {isOver && !isCorrect && <HintRings color={zone.color} />}

        {/* Zone emoji */}
        <span style={{ opacity: isCorrect || isCompleted ? 1 : isOver ? 0.85 : 0.5 }}>
          {zone.emoji}
        </span>

        {/* Correct checkmark overlay */}
        {(isCorrect || isCompleted) && (
          <motion.div
            className="absolute -top-2 -right-2 rounded-full flex items-center justify-center"
            style={{ width:36, height:36, background:C.green, border:`3px solid ${C.navy}`, boxShadow:`2px 3px 0 ${C.navy}` }}
            initial={{ scale:0 }} animate={{ scale:1 }}
            transition={{ type:"spring", stiffness:420, damping:14, delay:0.15 }}
          >
            <Check size={18} color="#FFF" strokeWidth={3} />
          </motion.div>
        )}

        {/* Particles */}
        <DropParticles active={isCorrect} color={zone.color} />
      </motion.div>

      {/* Hint text */}
      <motion.span
        style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color: isOver ? zone.color : C.mutedFg, fontWeight:700, transition:"color 0.2s" }}
        animate={{ opacity: isOver ? 1 : [0.4,0.8,0.4] }}
        transition={{ duration:2.2, repeat: isOver ? 0 : Infinity }}
      >
        {isOver ? "✓ Drop it!" : zone.hint}
      </motion.span>
    </div>
  );
}
