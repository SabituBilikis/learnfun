import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import { C } from "../../../app/constants";
import { CTAButton } from "../../../app/modules/primitives";
import CARD_PAIRS from "../../../data/memoryCards.json";
import type { MatchCard } from "./types";
import { MemCard } from "./MemCard";
import { useSettings } from "@/hooks/useSettings";
import { HeartsBar, TimerPill, GameProgressBar, PauseOverlay, VictoryScreen } from "./GameUI";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(): MatchCard[] {
  const pairs = CARD_PAIRS.flatMap(p => [
    { uid: p.id + "_a", ...p, state: "hidden" as const },
    { uid: p.id + "_b", ...p, state: "hidden" as const },
  ]);
  return shuffle(pairs);
}

export function MemoryMatchGame({ onBack }: { onBack: () => void }) {
  const MAX_LIVES = 5;
  const TOTAL_TIME = 120;

  const [deck, setDeck]               = useState<MatchCard[]>(buildDeck);
  const [flipped, setFlipped]         = useState<string[]>([]);
  const [lives, setLives]             = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft]       = useState(TOTAL_TIME);
  const [paused, setPaused]           = useState(false);
  const soundOn = useSettings(s => s.soundEnabled);
  const setSoundOn = useSettings(s => s.toggleSound);
  const [lockBoard, setLockBoard]     = useState(false);
  const [won, setWon]                 = useState(false);
  const [wrongPair, setWrongPair]     = useState<string[]>([]);

  const totalPairs   = CARD_PAIRS.length;
  const matchedPairs = deck.filter(c => c.state === "matched").length / 2;

  // Timer
  useEffect(() => {
    if (paused || won || lives <= 0) return;
    const t = setInterval(() => setTimeLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [paused, won, lives]);

  // Check win
  useEffect(() => {
    if (deck.every(c => c.state === "matched")) setWon(true);
  }, [deck]);

  function handleCardClick(uid: string) {
    if (lockBoard || paused || won) return;
    const card = deck.find(c => c.uid === uid);
    if (!card || card.state !== "hidden") return;
    if (flipped.includes(uid)) return;

    const newFlipped = [...flipped, uid];

    // Reveal this card
    setDeck(d => d.map(c => c.uid === uid ? { ...c, state: "revealed" } : c));

    if (newFlipped.length === 1) {
      setFlipped(newFlipped);
      return;
    }

    // Two cards flipped — check match
    setLockBoard(true);
    const [first] = newFlipped;
    const firstCard  = deck.find(c => c.uid === first)!;
    const secondCard = deck.find(c => c.uid === uid)!;

    if (firstCard.id === secondCard.id) {
      // Match!
      setTimeout(() => {
        setDeck(d => d.map(c => c.uid === first || c.uid === uid ? { ...c, state: "matched" } : c));
        setFlipped([]);
        setLockBoard(false);
      }, 500);
    } else {
      // No match
      setWrongPair([first, uid]);
      setTimeout(() => {
        setDeck(d => d.map(c => c.uid === first || c.uid === uid ? { ...c, state: "hidden" } : c));
        setFlipped([]);
        setWrongPair([]);
        setLives(l => Math.max(0, l - 1));
        setLockBoard(false);
      }, 900);
    }
  }

  function resetGame() {
    setDeck(buildDeck());
    setFlipped([]);
    setLives(MAX_LIVES);
    setTimeLeft(TOTAL_TIME);
    setPaused(false);
    setLockBoard(false);
    setWon(false);
    setWrongPair([]);
  }

  const gridCols = 4; // 12 cards = 4×3

  return (
    <div className="relative overflow-hidden min-h-[100vh] h-[100dvh] bg-gradient-to-br from-[#E8DFFF] via-[#F3EEFF] to-[#EAF4FF] font-fredoka font-nunito">
      {/* Ambient floating emoji decorations */}
      {["🌟","🎈","🍭","🌸","✨","🎉"].map((e, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none select-none opacity-[0.18] z-[1] text-[clamp(20px,3vw,32px)]"
          style={{
            top:`${10 + i * 14}%`,
            left: i % 2 === 0 ? `${2 + i}%` : undefined,
            right: i % 2 !== 0 ? `${2 + i}%` : undefined,
          }}
          animate={{ y:[0, -14, 0], rotate:[0, 12, 0] }}
          transition={{ duration:3.5 + i*0.5, repeat:Infinity, ease:"easeInOut", delay:i*0.4 }}
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
            <span className="text-[clamp(20px,3.5vw,28px)]">🃏</span>
            <h1 className="font-fredoka font-bold text-[clamp(16px,3vw,22px)] text-lf-navy whitespace-nowrap overflow-hidden text-ellipsis">
              Memory Match
            </h1>
          </div>
        </div>

        {/* Center: progress bar */}
        <div className="hidden sm:flex flex-1 max-w-xs">
          <GameProgressBar matched={matchedPairs} total={totalPairs} />
        </div>

        {/* Right: timer + hearts + sound + pause */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <TimerPill seconds={timeLeft} warning={timeLeft <= 20} />
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
        <GameProgressBar matched={matchedPairs} total={totalPairs} />
      </div>

      {/* ── Card grid ───────────────────────────────────── */}
      <div className="absolute inset-0 overflow-y-auto lf-carousel z-10 pt-[clamp(76px,16vw,110px)] pb-6 px-[clamp(12px,3vw,40px)]">
        <div className="flex items-center justify-center min-h-full py-2">
          <div className="grid justify-center gap-[clamp(10px,2vw,20px)]"
            style={{ gridTemplateColumns:`repeat(${gridCols}, clamp(72px,16vw,130px))` }}>
            {deck.map(card => {
              const isWrong = wrongPair.includes(card.uid);
              return (
                <motion.div
                  key={card.uid}
                  animate={isWrong ? { x:[-6,6,-5,5,-3,3,0] } : { x:0 }}
                  transition={{ duration:0.5 }}
                >
                  <MemCard card={card} onClick={() => handleCardClick(card.uid)} gridCols={gridCols} />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

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
              You matched {matchedPairs} of {totalPairs} pairs. So close!
            </p>
            <CTAButton label="🔄 Play Again" color={C.orange} onClick={resetGame} />
          </motion.div>
        </motion.div>
      )}

      {/* ── Victory screen ───────────────────────────────── */}
      {won && (
        <VictoryScreen
          matchedPairs={matchedPairs}
          totalPairs={totalPairs}
          timeLeft={timeLeft}
          onPlayAgain={resetGame}
          onExit={onBack}
        />
      )}
    </div>
  );
}
