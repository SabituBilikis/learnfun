import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { C } from "../../../app/constants";
import { CTAButton } from "../../../app/modules/primitives";
import { useSettings } from "@/hooks/useSettings";
import { HeartsBar, TimerPill, GameProgressBar, PauseOverlay, VictoryScreen, MatchConfetti } from "../MemoryMatch/GameUI";
import SHADOW_ROUNDS from "../../../data/shadowMatch.json";
import { speak } from "@/lib/speech";

export function ShadowMatchScreen({ onBack }: { onBack: () => void }) {
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
  const [lockBoard, setLockBoard]       = useState(false);

  const totalRounds = SHADOW_ROUNDS.length;
  const roundData = SHADOW_ROUNDS[currentRound];

  // Timer
  useEffect(() => {
    if (paused || won || lives <= 0) return;
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [paused, won, lives]);

  // Voice prompt
  useEffect(() => {
    if (roundData && !paused && !won && lives > 0 && !lockBoard && soundOn) {
      speak("Match the shadow!", { rate: 0.9, pitch: 1.1 });
    }
  }, [currentRound, paused, won, lives, lockBoard, soundOn, roundData]);

  function handleOptionClick(emoji: string) {
    if (lockBoard || paused || won) return;

    if (emoji === roundData.target) {
      // Correct!
      setLockBoard(true);
      if (soundOn) speak("You matched it!", { rate: 0.9, pitch: 1.2 });
      
      setTimeout(() => {
        if (currentRound + 1 >= totalRounds) {
          setWon(true);
        } else {
          setCurrentRound(r => r + 1);
          setLockBoard(false);
        }
      }, 1500);
    } else {
      // Wrong
      setWrongOption(emoji);
      setLives(l => Math.max(0, l - 1));
      if (soundOn) speak("Try again!", { rate: 0.9, pitch: 1.0 });
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
  }

  return (
    <div className="relative overflow-hidden min-h-[100vh] h-[100dvh] bg-gradient-to-br from-[#E6E6FA] via-[#D8BFD8] to-[#E6E6FA] font-fredoka font-nunito">
      
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
            <span className="text-[clamp(20px,3.5vw,28px)]">🌑</span>
            <h1 className="font-fredoka font-bold text-[clamp(16px,3vw,22px)] text-lf-navy whitespace-nowrap overflow-hidden text-ellipsis">
              Shadow Match
            </h1>
          </div>
        </div>

        <div className="hidden sm:flex flex-1 max-w-xs">
          <GameProgressBar matched={currentRound} total={totalRounds} />
        </div>

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

      <div className="sm:hidden absolute left-0 right-0 z-20 px-4 py-1.5 bg-white/88 border-b-2 border-lf-muted top-[clamp(58px,12vw,72px)]">
        <GameProgressBar matched={currentRound} total={totalRounds} />
      </div>

      {/* ── Main Game Area ──────────────────────────────── */}
      {!won && lives > 0 && timeLeft > 0 && roundData && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pt-[clamp(80px,18vw,120px)] pb-6 px-[clamp(16px,4vw,48px)]">
          
          <h2 className="font-fredoka font-bold text-[clamp(24px,5vw,36px)] text-lf-navy mb-8 bg-white/60 px-6 py-2 rounded-2xl border-2 border-white">
            Which one is this?
          </h2>

          {/* Shadow Box */}
          <div className="relative flex items-center justify-center w-[clamp(150px,30vw,240px)] h-[clamp(150px,30vw,240px)] bg-white border-4 border-lf-navy rounded-3xl shadow-[4px_6px_0_var(--color-lf-navy)] mb-12 overflow-hidden">
            <span 
              className="text-[clamp(80px,18vw,140px)] transition-all duration-700" 
              style={{ filter: lockBoard ? "none" : "brightness(0) drop-shadow(2px 4px 0 rgba(0,0,0,0.5))" }}
            >
              {roundData.target}
            </span>
            {lockBoard && <MatchConfetti active={true} />}
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[clamp(12px,3vw,24px)]">
            {roundData.options.map((emoji, idx) => {
              const isWrong = wrongOption === emoji;
              const isCorrect = lockBoard && emoji === roundData.target;
              
              return (
                <motion.button
                  key={`${currentRound}-${idx}`}
                  onClick={() => handleOptionClick(emoji)}
                  className={`flex items-center justify-center rounded-3xl w-[clamp(80px,18vw,120px)] h-[clamp(80px,18vw,120px)] border-4 shadow-[3px_5px_0_var(--color-lf-navy)] bg-white cursor-pointer select-none
                    ${isCorrect ? 'border-lf-green bg-lf-green/10 scale-110 z-20' : isWrong ? 'border-lf-red bg-lf-red/10' : 'border-lf-navy hover:bg-lf-muted'}
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={
                    isWrong ? { x: [-8, 8, -6, 6, -4, 4, 0], scale: 1, opacity: 1 } :
                    isCorrect ? { scale: 1.15, opacity: 1 } :
                    { scale: 1, opacity: 1 }
                  }
                  transition={{ 
                    duration: isWrong ? 0.4 : isCorrect ? 0.6 : 0.4,
                    delay: idx * 0.08
                  }}
                  whileHover={!lockBoard ? { scale: 1.05 } : {}}
                  whileTap={!lockBoard ? { scale: 0.95 } : {}}
                >
                  <span className="text-[clamp(40px,10vw,60px)]">{emoji}</span>
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
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#1A0050]/90 z-[100] backdrop-blur-sm"
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
              Try again!
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
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#1A0050]/90 z-[100] backdrop-blur-sm"
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
              You matched {currentRound} of {totalRounds} shadows.
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
          timeLeft={timeLeft}
          onPlayAgain={resetGame}
          onExit={onBack}
        />
      )}
    </div>
  );
}
