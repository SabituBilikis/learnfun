import React, { useRef } from "react";
import { motion } from "motion/react";
import { C } from "../../../app/constants";
import type { DragTask, DDState } from "./types";

export function DraggableObject({
  task, ddState, onDragStart, onDragEnd,
  isDragging,
}: {
  task: DragTask; ddState: DDState;
  onDragStart: () => void; onDragEnd: (x:number, y:number) => void;
  isDragging: boolean;
}) {
  const obj = task.object;
  const isCorrect   = ddState === "correct";
  const isIncorrect = ddState === "incorrect";
  const isCompleted = ddState === "completed";
  const disabled    = isCompleted || isCorrect;

  const dragRef = useRef<{ startX:number; startY:number }>({ startX:0, startY:0 });

  function handlePointerDown(e: React.PointerEvent) {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY };
    onDragStart();
  }
  function handlePointerUp(e: React.PointerEvent) {
    e.currentTarget.releasePointerCapture(e.pointerId);
    onDragEnd(e.clientX, e.clientY);
  }

  return (
    <motion.div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="relative flex flex-col items-center gap-3 select-none"
      style={{ cursor: disabled ? "default" : isDragging ? "grabbing" : "grab", touchAction:"none", zIndex: isDragging ? 80 : 10 }}
      animate={
        isCompleted ? { scale:0, opacity:0 } :
        isCorrect   ? { scale:[1,1.3,0.8,0], opacity:[1,1,1,0], y:[0,-20,-10,-60] } :
        isIncorrect ? { x:[0,-18,18,-14,10,-6,0] } :
        isDragging  ? { scale:1.18 } :
        { scale:1, x:0, y:0, opacity:1 }
      }
      transition={
        isCorrect ? { duration:0.55, ease:"easeInOut" } :
        isIncorrect ? { duration:0.45 } :
        isDragging ? { type:"spring", stiffness:400, damping:20 } :
        { type:"spring", stiffness:300, damping:22 }
      }
      whileHover={disabled ? {} : { scale:1.08, rotate:[-2,2,-2,0] }}
    >
      {/* Label above */}
      <div className="px-4 py-1.5 rounded-2xl" style={{ background:obj.bg, border:`2.5px solid ${obj.color}`, boxShadow:`2px 3px 0 rgba(26,0,80,0.15)` }}>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(14px,2.5vw,18px)", color:obj.color }}>
          {obj.label}
        </span>
      </div>

      {/* The object circle */}
      <motion.div
        className="relative rounded-full flex items-center justify-center"
        style={{
          width:"clamp(120px,20vw,180px)",
          height:"clamp(120px,20vw,180px)",
          background: obj.bg,
          border:`4px solid ${obj.color}`,
          boxShadow: isDragging
            ? `0 20px 48px rgba(26,0,80,0.25), 8px 10px 0 rgba(26,0,80,0.18)`
            : `6px 8px 0 rgba(26,0,80,0.20)`,
          fontSize:"clamp(54px,12vw,86px)",
        }}
        animate={isDragging ? { rotate:[0,-4,4,-2,0] } : { rotate:0 }}
        transition={{ duration:0.5, repeat: isDragging ? Infinity : 0 }}
      >
        {obj.emoji}

        {/* Grab shimmer when idle */}
        {!disabled && !isDragging && (
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background:"linear-gradient(135deg,rgba(255,255,255,0.55) 0%,transparent 60%)", pointerEvents:"none" }}
            animate={{ opacity:[0.4,0.9,0.4] }}
            transition={{ duration:2.2, repeat:Infinity }}
          />
        )}

        {/* Drag indicator hand */}
        {!disabled && !isDragging && (
          <motion.div
            className="absolute -bottom-3 -right-2"
            style={{ fontSize:28, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
            animate={{ y:[0,-5,0], rotate:[0,-10,0] }}
            transition={{ duration:1.6, repeat:Infinity }}
          >
            👆
          </motion.div>
        )}
      </motion.div>

      {/* "Grab me!" whisper text */}
      {!disabled && !isDragging && (
        <motion.span
          style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:C.mutedFg, fontWeight:600 }}
          animate={{ opacity:[0.5,1,0.5] }}
          transition={{ duration:2, repeat:Infinity }}
        >
          Grab me!
        </motion.span>
      )}
    </motion.div>
  );
}
