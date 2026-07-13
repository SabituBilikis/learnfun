import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { C } from "../../../app/constants";
import { CTAButton } from "../../../app/modules/primitives";
import { useSettings } from "@/hooks/useSettings";
import { TimerPill, GameProgressBar, PauseOverlay, VictoryScreen } from "../MemoryMatch/GameUI";
import { speak } from "@/lib/speech";

interface Balloon {
  id: string;
  emoji: string;
  x: number; // 0 to 100
  duration: number; // seconds
  delay: number; // seconds
  color: string;
}

const BALLOON_COLORS = [
  "#FF2D9B", // Pink
  "#00C7BE", // Teal
  "#FF9500", // Orange
  "#7B2FF7", // Purple
  "#34C759", // Green
  "#007AFF"  // Blue
];



export function BalloonPopScreen({ onBack }: { onBack: () => void }) {
  const TOTAL_TIME = 60;
  const BALLOONS_TO_WIN = 20;

  const [time, setTime] = useState(TOTAL_TIME);
  const [poppedCount, setPoppedCount] = useState(0);
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);
  
  const soundOn = useSettings(s => s.soundEnabled);
  const setSoundOn = useSettings(s => s.toggleSound);

  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [poppedIds, setPoppedIds] = useState<string[]>([]);

  // Spawn balloons
  useEffect(() => {
    if (paused || won) return;
    
    const interval = setInterval(() => {
      const newBalloon: Balloon = {
        id: Math.random().toString(36).substr(2, 9),
        emoji: "🎈",
        x: Math.floor(Math.random() * 80) + 10, // 10% to 90%
        duration: Math.random() * 3 + 4, // 4s to 7s to float up
        delay: 0,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)]
      };
      setBalloons(prev => [...prev, newBalloon]);
    }, 1200); // spawn every 1.2s

    return () => clearInterval(interval);
  }, [paused, won]);

  // Timer
  useEffect(() => {
    if (paused || won) return;
    if (time <= 0) return;
    const t = setInterval(() => setTime(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [paused, won, time]);

  // Intro speech
  useEffect(() => {
    if (soundOn) speak("Pop the balloons!", { rate: 0.9, pitch: 1.1 });
  }, [soundOn]);

  function handlePop(id: string) {
    if (paused || won) return;
    if (poppedIds.includes(id)) return;

    if (soundOn) {
      // Simulate pop sound with speech synth for now, or just generic positive beep.
      // In a real app we'd use an HTML5 audio element with a pop.mp3
      // Since we just have speech, we won't speak on every pop to avoid overlapping chaos.
    }

    setPoppedIds(prev => [...prev, id]);
    setPoppedCount(prev => {
      const next = prev + 1;
      if (next >= BALLOONS_TO_WIN) {
        setWon(true);
        if (soundOn) speak("You did it!", { rate: 0.9, pitch: 1.2 });
      }
      return next;
    });

    // Remove balloon after animation
    setTimeout(() => {
      setBalloons(prev => prev.filter(b => b.id !== id));
    }, 400);
  }

  function resetGame() {
    setBalloons([]);
    setPoppedIds([]);
    setPoppedCount(0);
    setTime(TOTAL_TIME);
    setWon(false);
    setPaused(false);
  }

  return (
    <div className="relative overflow-hidden min-h-[100vh] h-[100dvh] bg-gradient-to-t from-[#B2EBF2] via-[#E0F7FA] to-[#FFFFFF] font-fredoka font-nunito select-none">
      
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
            <span className="text-[clamp(20px,3.5vw,28px)]">🎈</span>
            <h1 className="font-fredoka font-bold text-[clamp(16px,3vw,22px)] text-lf-navy whitespace-nowrap overflow-hidden text-ellipsis">
              Balloon Pop
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 max-w-xs">
          <GameProgressBar matched={poppedCount} total={BALLOONS_TO_WIN} />
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <TimerPill seconds={time} warning={time <= 10} />
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
        <GameProgressBar matched={poppedCount} total={BALLOONS_TO_WIN} />
      </div>

      {/* ── Main Game Area ──────────────────────────────── */}
      <div className="absolute inset-0 z-10 pt-[120px] overflow-hidden touch-none pointer-events-none">
        <AnimatePresence>
          {balloons.map(b => {
            const isPopped = poppedIds.includes(b.id);
            return (
              <motion.div
                key={b.id}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  left: `${b.x}%`,
                  bottom: "-20%", // start below screen
                  width: "clamp(80px,15vw,120px)",
                  height: "clamp(100px,18vw,150px)",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                initial={{ y: 0, scale: 0 }}
                animate={
                  isPopped
                    ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] } // pop animation
                    : { y: "-150vh", scale: 1 } // float up animation
                }
                transition={
                  isPopped
                    ? { duration: 0.3 }
                    : { duration: b.duration, ease: "linear" }
                }
                onAnimationComplete={() => {
                  if (!isPopped) {
                    // It floated away. Just remove it silently.
                    setBalloons(prev => prev.filter(balloon => balloon.id !== b.id));
                  }
                }}
                onPointerDown={(e) => {
                  e.preventDefault();
                  handlePop(b.id);
                }}
              >
                {isPopped ? (
                  <span className="text-[clamp(50px,10vw,80px)]" style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.8))" }}>
                    💥
                  </span>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center">
                    {/* SVG Balloon Shape since emoji balloons are always red on some OS */}
                    <svg viewBox="0 0 100 120" className="w-full h-[85%] drop-shadow-lg" style={{ color: b.color }}>
                      <path fill="currentColor" d="M50 0C25 0 10 20 10 45C10 75 35 100 50 110C65 100 90 75 90 45C90 20 75 0 50 0Z" />
                      <path fill="currentColor" opacity="0.3" d="M35 15C25 25 20 35 25 35C30 35 40 25 45 15C45 10 40 5 35 15Z" />
                    </svg>
                    {/* String */}
                    <svg viewBox="0 0 20 40" className="w-4 h-[15%] text-gray-500 mt-[-5px]">
                      <path fill="none" stroke="currentColor" strokeWidth="2" d="M10 0 Q 0 10, 10 20 T 10 40" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

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
              You popped {poppedCount} balloons! 
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
          matchedPairs={poppedCount}
          totalPairs={BALLOONS_TO_WIN}
          timeLeft={time}
          onPlayAgain={resetGame}
          onExit={onBack}
        />
      )}
    </div>
  );
}
