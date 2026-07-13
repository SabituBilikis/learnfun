import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { C } from "../../../app/constants";
import { CTAButton } from "../../../app/modules/primitives";
import FIND_ROUNDS from "../../../data/findObject.json";
import { useSettings } from "@/hooks/useSettings";
import { HeartsBar, TimerPill, GameProgressBar, PauseOverlay, VictoryScreen, MatchConfetti } from "../MemoryMatch/GameUI";
import { speak } from "@/lib/speech";

export function FindObjectScreen({ onBack }: { onBack: () => void }) {
  const MAX_LIVES = 3;
  const TOTAL_TIME = 60;

  const [currentRound, setCurrentRound] = useState(0);
  const [lives, setLives]               = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft]         = useState(TOTAL_TIME);
  const [paused, setPaused]             = useState(false);
  const soundOn = useSettings(s => s.soundEnabled);
  const setSoundOn = useSettings(s => s.toggleSound);
  const [won, setWon]                   = useState(false);
  
  const [wrongOption, setWrongOption]   = useState<string | null>(null);
  const [correctOption, setCorrectOption] = useState<string | null>(null);
  const [lockBoard, setLockBoard]       = useState(false);

  const totalRounds = FIND_ROUNDS.length;
  const roundData = FIND_ROUNDS[currentRound];

  // Timer
  useEffect(() => {
    if (paused || won || lives <= 0) return;
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [paused, won, lives]);

  // Voice prompt on round start
  useEffect(() => {
    if (roundData && !paused && !won && lives > 0 && !lockBoard && soundOn) {
      speak(roundData.voiceLine || roundData.promptText, { rate: 0.85, pitch: 1.1 });
    }
  }, [currentRound, paused, won, lives, lockBoard, soundOn, roundData]);

  function handleOptionClick(emoji: string) {
    if (lockBoard || paused || won) return;

    if (emoji === roundData.target) {
      // Correct!
      setCorrectOption(emoji);
      setLockBoard(true);
      if (soundOn) speak("Great job!", { rate: 0.9, pitch: 1.2 });
      
      setTimeout(() => {
        if (currentRound + 1 >= totalRounds) {
          setWon(true);
        } else {
          setCurrentRound(r => r + 1);
          setCorrectOption(null);
          setLockBoard(false);
        }
      }, 1500);
    } else {
      // Wrong
      setWrongOption(emoji);
      setLives(l => Math.max(0, l - 1));
      if (soundOn) speak("Oops, try again!", { rate: 0.9, pitch: 1.0 });
      setTimeout(() => {
        setWrongOption(null);
      }, 600);
    }
  }

  function resetGame() {
    setCurrentRound(0);
    setLives(MAX_LIVES);
    setTimeLeft(TOTAL_TIME);
    setPaused(false);
    setLockBoard(false);
    setWon(false);
    setWrongOption(null);
    setCorrectOption(null);
  }

  return (
    <div className="relative overflow-hidden min-h-[100vh] h-[100dvh] bg-gradient-to-br from-[#FFEBD6] via-[#FFF3E0] to-[#FFE0B2] font-fredoka font-nunito">
      {/* Ambient floating emoji decorations */}
      {["🔍","👀","🍎","🚗","⭐","❓"].map((e, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none opacity-[0.2] z-[1] text-[clamp(24px,4vw,36px)]"
          style={{
            top:`${15 + i * 12}%`,
            left: i % 2 === 0 ? `${4 + i*2}%` : undefined,
            right: i % 2 !== 0 ? `${4 + i*2}%` : undefined,
          }}
          animate={{ y:[0, -12, 0], rotate:[0, 10, -10, 0] }}
          transition={{ duration:4 + i*0.5, repeat:Infinity, ease:"easeInOut", delay:i*0.3 }}
        >
          {e}
        </motion.div>
      ))}

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-2 flex-wrap bg-white/92 border-b-[3px] border-lf-navy shadow-[0_3px_16px_rgba(26,0,80,0.10)] py-[clamp(8px,2vw,14px)] px-[clamp(10px,3vw,24px)]">
        {/* Left: exit + title */}
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
            <span className="text-[clamp(20px,3.5vw,28px)]">🔍</span>
            <h1 className="font-fredoka font-bold text-[clamp(16px,3vw,22px)] text-lf-navy whitespace-nowrap overflow-hidden text-ellipsis">
              Find the Object
            </h1>
          </div>
        </div>

        {/* Center: progress bar */}
        <div className="hidden sm:flex flex-1 max-w-xs">
          <GameProgressBar matched={currentRound} total={totalRounds} />
        </div>

        {/* Right: timer + hearts + sound + pause */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <TimerPill seconds={timeLeft} warning={timeLeft <= 15} />
          <HeartsBar lives={lives} maxLives={MAX_LIVES} />
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

      {/* Mobile progress bar (below top bar) */}
      <div className="sm:hidden absolute left-0 right-0 z-20 px-4 py-1.5 bg-white/88 border-b-2 border-lf-muted top-[clamp(58px,12vw,72px)]">
        <GameProgressBar matched={currentRound} total={totalRounds} />
      </div>

      {/* ── Main Game Area ──────────────────────────────── */}
      {!won && lives > 0 && timeLeft > 0 && roundData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-[clamp(80px,18vw,120px)] pb-6 px-[clamp(16px,4vw,48px)]">
          
          <motion.div 
            className="mb-8 px-6 py-3 rounded-3xl bg-white border-4 border-lf-navy shadow-[4px_6px_0_var(--color-lf-navy)] text-center max-w-md w-full"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            key={`prompt-${currentRound}`}
          >
            <h2 className="font-fredoka font-bold text-[clamp(22px,4.5vw,32px)] text-lf-navy leading-tight">
              {roundData.promptText}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 gap-[clamp(16px,4vw,32px)]">
            {roundData.options.map((emoji, idx) => {
              const isWrong = wrongOption === emoji;
              const isCorrect = correctOption === emoji;
              
              return (
                <motion.button
                  key={`${currentRound}-${idx}`}
                  onClick={() => handleOptionClick(emoji)}
                  className={`relative flex items-center justify-center rounded-3xl w-[clamp(100px,25vw,180px)] h-[clamp(100px,25vw,180px)] border-4 shadow-[4px_6px_0_var(--color-lf-navy)] bg-white cursor-pointer select-none
                    ${isCorrect ? 'border-lf-green bg-lf-green/10' : isWrong ? 'border-lf-red bg-lf-red/10' : 'border-lf-navy hover:bg-lf-muted'}
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    isWrong ? { x: [-8, 8, -6, 6, -4, 4, 0], scale: 1, opacity: 1 } :
                    isCorrect ? { scale: [1, 1.15, 1], opacity: 1 } :
                    { scale: 1, opacity: 1 }
                  }
                  transition={{ 
                    duration: isWrong ? 0.4 : isCorrect ? 0.6 : 0.4,
                    delay: idx * 0.08
                  }}
                  whileHover={!lockBoard ? { scale: 1.05 } : {}}
                  whileTap={!lockBoard ? { scale: 0.95 } : {}}
                >
                  <span className="text-[clamp(50px,12vw,90px)]">{emoji}</span>
                  {isCorrect && <MatchConfetti active={true} />}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Pause overlay ───────────────────────────────── */}
      {paused && !won && (
        <PauseOverlay onResume={() => setPaused(false)} onExit={onBack} />
      )}

      {/* ── Game over (no lives) ─────────────────────────── */}
      {lives <= 0 && !won && (
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#CC6D00]/90 z-[100] backdrop-blur-sm"
          initial={{ opacity:0 }} animate={{ opacity:1 }}
        >
          <motion.div
            className="rounded-3xl flex flex-col items-center gap-5 p-8 bg-white border-4 border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] max-w-[320px] w-[90%]"
            initial={{ scale:0.7 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:280, damping:20 }}
          >
            <span className="text-[64px]">💔</span>
            <h2 className="font-fredoka font-bold text-[28px] text-lf-navy text-center">
              No More Hearts!
            </h2>
            <p className="font-nunito text-[15px] text-lf-muted-fg text-center">
              Don't worry — try again! You can do it! 💪
            </p>
            <div className="flex flex-col w-full gap-3">
              <CTAButton label="🔄 Try Again" color={C.green} onClick={resetGame} />
              <button
                onClick={onBack}
                className="w-full rounded-2xl flex items-center justify-center h-[52px] bg-transparent border-3 border-lf-navy font-fredoka font-bold text-[18px] text-lf-navy cursor-pointer"
              >
                🚪 Exit Game
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* ── Time's up ───────────────────────────────────── */}
      {timeLeft <= 0 && !won && lives > 0 && (
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
              You found {currentRound} of {totalRounds} objects. So close!
            </p>
            <CTAButton label="🔄 Play Again" color={C.orange} onClick={resetGame} />
          </motion.div>
        </motion.div>
      )}

      {/* ── Victory screen ───────────────────────────────── */}
      {won && (
        <VictoryScreen
          matchedPairs={totalRounds}
          totalPairs={totalRounds}
          timeLeft={timeLeft}
          onPlayAgain={resetGame}
          onExit={onBack}
        />
      )}
    </div>
  );
}
