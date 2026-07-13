import React, { useState, useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { C } from "../../../app/constants";
import { speak } from "../../../lib/speech";
import { useSpeechCleanup } from "../../../hooks/useSpeech";
import dragTasksData from "../../../data/dragTasks.json";

import type { DragTask, DDState } from "./types";
import { DDBg, DistractorZone, CorrectOverlay, DDVictory } from "./GameUI";
import { DraggableObject } from "./DraggableObject";
import { DropZone } from "./DropZone";

const DRAG_TASKS: DragTask[] = dragTasksData;

export function DragDropGame({ onBack }: { onBack: () => void }) {
  useSpeechCleanup();
  const [taskIndex, setTaskIndex]     = useState(0);
  const [ddState,   setDDState]       = useState<DDState>("idle");
  const [isDragging, setIsDragging]   = useState(false);
  const [isOver,    setIsOver]        = useState(false);
  const [wrongFlash, setWrongFlash]   = useState(false);
  const [hintActive, setHintActive]   = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [mistakeCount, setMistakeCount] = useState(0);

  const zoneRef = useRef<HTMLDivElement | null>(null);
  const task    = DRAG_TASKS[taskIndex];
  const totalTasks = DRAG_TASKS.length;

  function resetRound(nextIndex: number) {
    setDDState("idle");
    setIsDragging(false);
    setIsOver(false);
    setWrongFlash(false);
    setHintActive(false);
    setMistakeCount(0);
    setShowCorrect(false);
    if (nextIndex >= totalTasks) {
      setShowVictory(true);
    } else {
      setTaskIndex(nextIndex);
    }
  }

  function handleDragStart() {
    if (ddState !== "idle") return;
    setIsDragging(true);
    setIsOver(false);
  }

  function handleDragEnd(clientX: number, clientY: number) {
    if (ddState !== "idle") { setIsDragging(false); return; }
    setIsDragging(false);

    // Check if pointer landed over the drop zone
    const el = zoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const landed = clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;

    if (landed) {
      // Correct!
      setDDState("correct");
      setIsOver(false);
      setStarsEarned(s => s + 1);
      setShowCorrect(true);
      setTimeout(() => { setDDState("completed"); resetRound(taskIndex + 1); }, 1800);
    } else {
      // Wrong — shake + penalise
      setDDState("incorrect");
      setWrongFlash(true);
      setMistakeCount(m => m + 1);
      setTimeout(() => {
        setDDState("idle");
        setWrongFlash(false);
      }, 600);
    }
  }

  // Pointer move — track whether we're over the zone
  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging || !zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const over = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    setIsOver(over);
  }

  function handleHint() {
    setHintActive(h => !h);
    speak(`${task.zone.hint} Put the ${task.object.label} in the ${task.zone.label}`, { rate: 0.8, pitch: 1.3 });
  }

  function handleVoice() {
    speak(task.voiceLine, { rate: 0.75, pitch: 1.3 });
  }

  function handlePlayAgain() {
    setTaskIndex(0);
    setStarsEarned(0);
    setShowVictory(false);
    setDDState("idle");
    setMistakeCount(0);
    setShowCorrect(false);
  }

  const bgTop = `linear-gradient(160deg,${task.object.bg} 0%,${task.zone.bg} 100%)`;

  return (
    <div
      className="relative overflow-hidden min-h-[100vh] h-[100dvh] font-fredoka font-nunito"
      style={{ background:bgTop }}
      onPointerMove={handlePointerMove}
    >
      <DDBg color={task.object.color} />

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 bg-white/90 border-b-[3px] border-lf-navy shadow-[0_3px_16px_rgba(26,0,80,0.10)] py-[clamp(8px,2vw,14px)] px-[clamp(10px,3vw,24px)]">
        {/* Exit */}
        <motion.button onClick={onBack}
          className="flex-shrink-0 flex items-center gap-1 rounded-2xl px-3 py-2 bg-lf-muted border-[2.5px] border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer"
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.94 }}
        >
          <ChevronLeft size={18} style={{ color:C.navy }} strokeWidth={3} />
          <span className="font-fredoka font-bold text-[14px] text-lf-navy">Exit</span>
        </motion.button>

        {/* Title */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[clamp(18px,3vw,26px)]">✋</span>
          <h1 className="font-fredoka font-bold text-[clamp(15px,2.5vw,20px)] text-lf-navy whitespace-nowrap">
            Drag & Drop
          </h1>
        </div>

        {/* Round progress pills */}
        <div className="hidden sm:flex items-center gap-1.5">
          {DRAG_TASKS.map((_, i) => (
            <motion.div key={i}
              className="rounded-full h-[10px]"
              style={{
                width: i === taskIndex ? 28 : 10,
                background: i < taskIndex ? C.green : i === taskIndex ? task.object.color : C.muted,
                border: i === taskIndex ? `2px solid ${C.navy}` : "2px solid transparent",
                transition:"width 0.3s, background 0.3s",
              }}
            />
          ))}
        </div>

        {/* Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalTasks }).map((_, i) => (
            <motion.span key={i}
              className="text-[clamp(14px,2.5vw,20px)]"
              style={{ filter: i < starsEarned ? "none" : "grayscale(1) opacity(0.3)" }}
              animate={i === starsEarned - 1 ? { scale:[1,1.4,1] } : {}}
              transition={{ type:"spring", stiffness:400 }}
            >⭐</motion.span>
          ))}
        </div>

        {/* Voice replay */}
        <motion.button onClick={handleVoice}
          className="flex-shrink-0 rounded-2xl flex items-center justify-center bg-lf-blue border-[2.5px] border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer text-[20px] w-10 h-10"
          whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
        >🔊</motion.button>

        {/* Hint */}
        <motion.button onClick={handleHint}
          className="flex-shrink-0 rounded-2xl flex items-center justify-center border-[2.5px] border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer text-[20px] w-10 h-10"
          style={{ background: hintActive ? C.yellow : C.orange }}
          whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
          animate={hintActive ? { rotate:[0,-6,6,-4,0] } : {}}
          transition={{ duration:0.4 }}
        >💡</motion.button>
      </div>

      {/* ── Main play area ──────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 z-10 pt-[clamp(70px,14vw,90px)] pb-4">
        {/* Instruction banner */}
        <motion.div
          key={task.id + "-instruction"}
          className="text-center px-6 py-3 rounded-3xl mb-6 bg-white/82 shadow-[4px_5px_0_rgba(26,0,80,0.15)] max-w-[min(90vw,520px)]"
          style={{ border:`3px solid ${task.object.color}` }}
          initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ type:"spring", stiffness:280, damping:22 }}
        >
          <span className="font-fredoka font-bold text-[clamp(16px,3.5vw,24px)] text-lf-navy">
            {task.instruction}
          </span>
          {/* Hint sub-text when active */}
          {hintActive && (
            <motion.p
              initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
              className="font-nunito text-[13px] text-lf-muted-fg mt-1"
            >
              💡 Look for the {task.zone.label}!
            </motion.p>
          )}
        </motion.div>

        {/* Drag area — object LEFT, arrow, zone RIGHT on wide; stacked on narrow */}
        <div className="flex items-center justify-center gap-6 flex-wrap w-full max-w-[720px] px-[clamp(12px,4vw,48px)]">
          {/* Draggable object */}
          <DraggableObject
            task={task} ddState={ddState}
            onDragStart={handleDragStart} onDragEnd={handleDragEnd}
            isDragging={isDragging}
          />

          {/* Arrow connector */}
          <motion.div
            className="text-[clamp(28px,6vw,48px)] select-none opacity-55"
            animate={{ x:[0,8,0], opacity:[0.4,0.8,0.4] }}
            transition={{ duration:1.5, repeat:Infinity, ease:"easeInOut" }}
          >
            ➡️
          </motion.div>

          {/* Drop zone */}
          <div className="flex flex-col items-center gap-4">
            <DropZone task={task} ddState={ddState} isOver={isOver} zoneRef={zoneRef} />
            {/* Distractor zone below */}
            {task.distractor && (
              <DistractorZone task={task} wrongFlash={wrongFlash} />
            )}
          </div>
        </div>

        {/* Mistake feedback */}
        {mistakeCount > 0 && ddState === "idle" && (
          <motion.div
            className="mt-4 px-4 py-2 rounded-2xl bg-lf-red/12 border-2 border-lf-red"
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
          >
            <span className="font-nunito font-bold text-[13px] text-lf-red">
              {mistakeCount === 1 ? "Oops! Try again 😊" : "Almost! Drop it on the " + task.zone.label + "!"}
            </span>
          </motion.div>
        )}

        {/* Hint pulsing arrow when hint active */}
        {hintActive && ddState === "idle" && (
          <motion.div
            className="mt-3 pointer-events-none text-[clamp(20px,4vw,28px)]"
            animate={{ y:[0,-8,0], opacity:[0.6,1,0.6] }}
            transition={{ duration:0.9, repeat:Infinity }}
          >
            ⬆ Drop on the {task.zone.label}! ⬆
          </motion.div>
        )}
      </div>

      {/* ── Correct overlay ─────────────────────────────────── */}
      {showCorrect && (
        <CorrectOverlay
          reward={task.reward}
          onNext={() => {}}
          isLast={taskIndex === totalTasks - 1}
        />
      )}

      {/* ── Victory screen ──────────────────────────────────── */}
      {showVictory && (
        <DDVictory
          starsEarned={starsEarned}
          total={totalTasks}
          onPlayAgain={handlePlayAgain}
          onExit={onBack}
        />
      )}
    </div>
  );
}
