import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { C } from "../../../app/constants";
import { CTAButton } from "../../../app/modules/primitives";
import { useSettings } from "@/hooks/useSettings";
import { TimerPill, GameProgressBar, PauseOverlay, VictoryScreen, MatchConfetti } from "../MemoryMatch/GameUI";
import { speak } from "@/lib/speech";



// Better to use CSS for the outlines since unicode outlines for shapes are inconsistent.
const ROUNDS = [
  {
    target: { id: "circle", color: "#34C759", border: "50%" },
    options: ["circle", "square", "triangle"]
  },
  {
    target: { id: "square", color: "#007AFF", border: "16px" },
    options: ["square", "circle", "triangle"]
  },
  {
    target: { id: "triangle", color: "#FF9500", border: "0", isTriangle: true },
    options: ["triangle", "square", "circle"]
  }
];

export function PuzzleScreen({ onBack }: { onBack: () => void }) {
  const TOTAL_TIME = 90;

  const [currentRound, setCurrentRound] = useState(0);
  const [time, setTime] = useState(TOTAL_TIME);
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);
  const [lockBoard, setLockBoard] = useState(false);
  
  const soundOn = useSettings(s => s.soundEnabled);
  const setSoundOn = useSettings(s => s.toggleSound);

  const [options, setOptions] = useState<string[]>([]);
  const [wrongShape, setWrongShape] = useState<string | null>(null);

  const roundData = ROUNDS[currentRound];
  const totalRounds = ROUNDS.length;

  useEffect(() => {
    if (roundData) {
      setOptions([...roundData.options].sort(() => Math.random() - 0.5));
      if (soundOn) speak("Match the shape!", { rate: 0.9, pitch: 1.1 });
    }
  }, [currentRound, roundData]);

  // Timer
  useEffect(() => {
    if (paused || won || time <= 0) return;
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [paused, won, time]);

  function handleDrop(draggedId: string) {
    if (lockBoard) return;

    if (draggedId === roundData.target.id) {
      // Success
      setLockBoard(true);
      if (soundOn) speak("Great job!", { rate: 0.9, pitch: 1.2 });
      
      setTimeout(() => {
        if (currentRound + 1 >= totalRounds) {
          setWon(true);
          if (soundOn) speak("You completed the puzzle!", { rate: 0.9, pitch: 1.2 });
        } else {
          setCurrentRound(r => r + 1);
          setLockBoard(false);
        }
      }, 1500);
    } else {
      // Wrong
      setWrongShape(draggedId);
      if (soundOn) speak("Oops, try again!", { rate: 0.9, pitch: 1.0 });
      setTimeout(() => setWrongShape(null), 600);
    }
  }

  function resetGame() {
    setCurrentRound(0);
    setTime(TOTAL_TIME);
    setWon(false);
    setPaused(false);
    setLockBoard(false);
    setWrongShape(null);
  }

  function ShapeGraphic({ id, color, isOutline }: { id: string, color: string, isOutline?: boolean }) {
    if (id === "triangle") {
      return (
        <div style={{
          width: 0, height: 0,
          borderLeft: "50px solid transparent",
          borderRight: "50px solid transparent",
          borderBottom: `100px solid ${isOutline ? "transparent" : color}`,
          filter: isOutline ? `drop-shadow(0 0 0 ${color}) drop-shadow(0 0 0 ${color})` : "none",
          position: "relative"
        }}>
          {isOutline && (
            <div style={{
               position: "absolute",
               top: 5, left: -42,
               width: 0, height: 0,
               borderLeft: "42px solid transparent",
               borderRight: "42px solid transparent",
               borderBottom: "84px solid white",
            }} />
          )}
        </div>
      );
    }
    
    const br = id === "circle" ? "50%" : "20%";
    return (
      <div style={{
        width: 100, height: 100,
        borderRadius: br,
        backgroundColor: isOutline ? "transparent" : color,
        border: isOutline ? `6px dashed ${color}` : "none",
        boxShadow: isOutline ? "none" : "0 8px 16px rgba(0,0,0,0.15)"
      }} />
    );
  }

  return (
    <div className="relative overflow-hidden min-h-[100vh] h-[100dvh] bg-gradient-to-br from-[#FFF0F5] via-[#FFE4E1] to-[#FFDAB9] font-fredoka font-nunito select-none">
      
      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 flex-wrap bg-white/92 border-b-[3px] border-lf-navy shadow-[0_3px_16px_rgba(26,0,80,0.10)] py-[clamp(8px,2vw,14px)] px-[clamp(10px,3vw,24px)]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <motion.button
            onClick={onBack}
            className="flex-shrink-0 flex items-center gap-1 rounded-2xl px-3 py-2 bg-lf-muted border-[2.5px] border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer"
            whileHover={{ scale:1.05 }} whileTap={{ scale:0.94 }}
          >
            <ChevronLeft size={18} style={{ color:C.navy }} strokeWidth={3} />
            <span className="font-fredoka font-bold text-[14px] text-lf-navy">Exit</span>
          </motion.button>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[clamp(20px,3.5vw,28px)]">🧩</span>
            <h1 className="font-fredoka font-bold text-[clamp(16px,3vw,22px)] text-lf-navy whitespace-nowrap overflow-hidden text-ellipsis">
              Puzzle
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 max-w-xs">
          <GameProgressBar matched={currentRound} total={totalRounds} />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <TimerPill seconds={time} warning={time <= 15} />
          <motion.button
            onClick={() => setSoundOn()}
            className="rounded-2xl flex items-center justify-center bg-lf-muted border-[2.5px] border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer text-[20px] w-10 h-10"
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
          >
            {soundOn ? "🔊" : "🔇"}
          </motion.button>
          <motion.button
            onClick={() => setPaused(p => !p)}
            className="rounded-2xl flex items-center justify-center bg-lf-orange border-[2.5px] border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer text-[20px] w-10 h-10"
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.9 }}
          >
            ⏸
          </motion.button>
        </div>
      </div>

      <div className="sm:hidden absolute left-0 right-0 z-20 px-4 py-1.5 bg-white/88 border-b-2 border-lf-muted top-[clamp(58px,12vw,72px)]">
        <GameProgressBar matched={currentRound} total={totalRounds} />
      </div>

      {/* ── Main Game Area ──────────────────────────────── */}
      {!won && time > 0 && roundData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-[clamp(80px,18vw,120px)] pb-6 px-4">
          
          <motion.h2 
            key={currentRound}
            className="font-fredoka font-bold text-[clamp(24px,5vw,36px)] text-lf-navy mb-8 bg-white/60 px-6 py-2 rounded-2xl border-2 border-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Drag the shape to the matching hole!
          </motion.h2>

          {/* Target Outline */}
          <div className="relative mb-16 w-48 h-48 flex items-center justify-center bg-white rounded-3xl border-4 border-lf-muted shadow-[4px_6px_0_var(--color-lf-muted)]">
            <ShapeGraphic id={roundData.target.id} color={roundData.target.color} isOutline={true} />
            {lockBoard && (
              <motion.div className="absolute inset-0 flex items-center justify-center z-20"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <ShapeGraphic id={roundData.target.id} color={roundData.target.color} />
                <MatchConfetti active={true} />
              </motion.div>
            )}
          </div>

          {/* Options to drag */}
          <div className="flex gap-6 z-30">
            {options.map((opt) => {
              const isWrong = wrongShape === opt;
              const col = opt === "circle" ? "#34C759" : opt === "square" ? "#007AFF" : "#FF9500";
              
              if (lockBoard && opt === roundData.target.id) return <div key={opt} className="w-[100px] h-[100px]" />; // leave empty space

              return (
                <motion.div
                  key={opt}
                  className="cursor-grab active:cursor-grabbing"
                  drag
                  dragSnapToOrigin
                  onDragEnd={(_, info) => {
                    // Simple drop detection based on moving upwards significantly
                    if (info.offset.y < -100) {
                      handleDrop(opt);
                    }
                  }}
                  animate={isWrong ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
                  whileDrag={{ scale: 1.1, zIndex: 50 }}
                >
                  <ShapeGraphic id={opt} color={col} />
                </motion.div>
              );
            })}
          </div>

        </div>
      )}

      {/* ── Pause overlay ───────────────────────────────── */}
      {paused && !won && (
        <PauseOverlay onResume={() => setPaused(false)} onExit={onBack} />
      )}

      {/* ── Time's up ───────────────────────────────────── */}
      {time <= 0 && !won && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#CC6D00]/90 z-[100] backdrop-blur-sm"
          initial={{ opacity:0 }} animate={{ opacity:1 }}
        >
          <motion.div
            className="rounded-3xl flex flex-col items-center gap-5 p-8 bg-white border-4 border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] max-w-[320px] w-[90%]"
            initial={{ scale:0.7 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:280, damping:20 }}
          >
            <span className="text-[64px]">⏰</span>
            <h2 className="font-fredoka font-bold text-[28px] text-lf-navy text-center">
              Time&apos;s Up!
            </h2>
            <p className="font-nunito text-[15px] text-lf-muted-fg text-center">
              You matched {currentRound} shapes.
            </p>
            <CTAButton label="🔄 Play Again" color={C.orange} onClick={resetGame} />
            <button
                onClick={onBack}
                className="w-full rounded-2xl flex items-center justify-center h-[52px] bg-transparent border-3 border-lf-navy font-fredoka font-bold text-[18px] text-lf-navy cursor-pointer"
              >
                🚪 Exit Game
              </button>
          </motion.div>
        </motion.div>
      )}

      {/* ── Victory screen ───────────────────────────────── */}
      {won && (
        <VictoryScreen
          matchedPairs={totalRounds}
          totalPairs={totalRounds}
          timeLeft={time}
          onPlayAgain={resetGame}
          onExit={onBack}
        />
      )}
    </div>
  );
}
