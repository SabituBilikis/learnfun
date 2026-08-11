import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Home, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { C } from "@/app/constants";
import { BackButton } from "@/components/ui/BackButton";
import { SoundRings } from "@/components/feedback/SoundRings";
import { ConfettiBurst } from "@/components/feedback/ConfettiBurst";
import { AmbientSparkles } from "@/components/feedback/Sparkle";
import { useProgress } from "@/hooks/useProgress";
import { usePhonicsAudio } from "@/hooks/usePhonicsAudio";
import phonicsData from "@/data/phonics.json";

export interface PhonicsSoundExperienceProps {
  index: number;
  onBack: () => void;
  onNavigate: (index: number) => void;
}

export function PhonicsSoundExperienceScreen({
  index,
  onBack,
  onNavigate,
}: PhonicsSoundExperienceProps) {
  const navigate = useNavigate();
  const { progress, updateProgress } = useProgress();
  const { playingAudioId, playPhoneme, playWord, stop } = usePhonicsAudio();

  const safeIndex = Math.max(0, Math.min(index, phonicsData.length - 1));
  const currentItem = phonicsData[safeIndex] || phonicsData[0];

  const [burstCount, setBurstCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Track unique items explored in this session to reward without spamming
  const exploredSetRef = useRef<Set<string>>(new Set());

  const canPrev = safeIndex > 0;
  const canNext = safeIndex < phonicsData.length - 1;

  // Clear toast timeout helper
  const showRewardToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Auto-play the phoneme sound once when the screen opens
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (active) {
        void playPhoneme("phoneme", currentItem.phonemeAudio, currentItem.phoneme);
      }
    }, 350);

    // Record discovering the letter for progress tracking
    const letterKey = `phonics_${currentItem.id}`;
    if (!exploredSetRef.current.has(letterKey)) {
      exploredSetRef.current.add(letterKey);
      updateProgress((p) => {
        const nextCat = { ...p.catProgress, phonics: Math.max(p.catProgress.phonics || 0, safeIndex + 1) };
        return { ...p, catProgress: nextCat, starsTotal: p.starsTotal + 1 };
      });
      showRewardToast("You discovered a new sound! ⭐");
    }

    return () => {
      active = false;
      clearTimeout(timer);
      void stop();
    };
  }, [safeIndex, currentItem, playPhoneme, stop, updateProgress]);

  // Replay phoneme sound /b/
  const handlePlayPhoneme = () => {
    void playPhoneme("phoneme", currentItem.phonemeAudio, currentItem.phoneme);
  };

  // Play main primary word "Ball"
  const handlePlayMainWord = () => {
    const key = `main_${currentItem.id}_${currentItem.primary.word}`;
    if (!exploredSetRef.current.has(key)) {
      exploredSetRef.current.add(key);
      setBurstCount((b) => b + 1);
      updateProgress((p) => ({ ...p, starsTotal: p.starsTotal + 1 }));
      showRewardToast("Great listening! ⭐");
    }
    void playWord("primary", undefined, currentItem.primary.word);
  };

  // Play explore object word (e.g. Banana, Book, Bear)
  const handlePlayExploreObject = (ex: { word: string; wordAudio?: string; speechText: string }) => {
    const key = `ex_${currentItem.id}_${ex.word}`;
    if (!exploredSetRef.current.has(key)) {
      exploredSetRef.current.add(key);
      setBurstCount((b) => b + 1);
      updateProgress((p) => ({ ...p, starsTotal: p.starsTotal + 1 }));
      showRewardToast("Great listening! ⭐");
    }
    void playWord(ex.word, ex.wordAudio, ex.speechText || ex.word);
  };

  const isPhonemePlaying = playingAudioId === "phoneme";
  const isPrimaryPlaying = playingAudioId === "primary";

  return (
    <div className="relative flex flex-col h-[100dvh] font-fredoka font-nunito bg-gradient-to-b from-[#FFFDF9] via-[#FFFFFF] to-[#F3EEFF] overflow-hidden select-none">
      {/* Confetti celebration burst */}
      <ConfettiBurst trigger={burstCount} />

      {/* Floating Positive Reward Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-5 py-2 rounded-2xl bg-lf-yellow border-2 border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] font-fredoka font-bold text-sm sm:text-base text-lf-navy flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top Navigation Bar ───────────────────────────────── */}
      <div className="relative z-20 shrink-0 flex items-center justify-between px-[clamp(14px,3vw,44px)] py-[12px] border-b-[3px] border-b-lf-navy bg-white/90 backdrop-blur-md shadow-[0_4px_0_var(--color-lf-navy)]">
        <div className="flex items-center gap-2.5">
          <BackButton onClick={onBack} />
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] font-fredoka font-bold text-sm text-lf-navy cursor-pointer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Home size={16} /> Home
          </motion.button>
        </div>

        {/* Letter Navigation Selector */}
        <div className="flex items-center gap-2 bg-amber-100/90 px-3 py-1 rounded-2xl border-2 border-lf-navy">
          <motion.button
            disabled={!canPrev}
            onClick={() => canPrev && onNavigate(safeIndex - 1)}
            className={`p-1 rounded-xl ${canPrev ? "cursor-pointer text-lf-navy" : "opacity-30 cursor-default"}`}
            whileHover={canPrev ? { scale: 1.15 } : {}}
            whileTap={canPrev ? { scale: 0.85 } : {}}
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
          </motion.button>
          <span className="font-fredoka font-bold text-lg text-lf-navy px-1">
            {currentItem.letter}
          </span>
          <motion.button
            disabled={!canNext}
            onClick={() => canNext && onNavigate(safeIndex + 1)}
            className={`p-1 rounded-xl ${canNext ? "cursor-pointer text-lf-navy" : "opacity-30 cursor-default"}`}
            whileHover={canNext ? { scale: 1.15 } : {}}
            whileTap={canNext ? { scale: 0.85 } : {}}
          >
            <ChevronRight size={20} strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Star Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-lf-orange border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)]">
          <Star size={16} fill={C.yellow} color="#CC9F00" strokeWidth={1.5} />
          <span className="font-fredoka font-bold text-[15px] text-white">
            {progress.starsTotal}
          </span>
        </div>
      </div>

      {/* ── Main Discovery Area ──────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto lf-carousel px-[clamp(14px,3.5vw,48px)] py-4 flex flex-col items-center justify-between max-w-4xl mx-auto w-full">
        {/* Stage 1: Large Letter + Phoneme Display + Listen Button */}
        <div className="flex flex-col items-center gap-2 mt-2">
          {/* Large Letter */}
          <motion.div
            className="flex items-center justify-center rounded-3xl w-[clamp(88px,12vw,120px)] h-[clamp(88px,12vw,120px)] border-[4px] border-lf-navy shadow-[5px_7px_0_var(--color-lf-navy)] font-fredoka font-bold text-[clamp(52px,7vw,72px)] text-white"
            style={{ backgroundColor: currentItem.color }}
            animate={isPhonemePlaying ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={{ duration: 0.35, repeat: isPhonemePlaying ? Infinity : 0 }}
          >
            {currentItem.letter}
          </motion.div>

          {/* Phoneme display (e.g. /b/) */}
          <div className="px-5 py-1 rounded-2xl bg-white/90 border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)]">
            <span className="font-fredoka font-bold text-[clamp(18px,2.5vw,26px)] text-lf-navy tracking-wider">
              {currentItem.phonemeDisplay}
            </span>
          </div>

          {/* Large Friendly Speaker Button: "Listen" */}
          <div className="relative flex items-center justify-center mt-1">
            <SoundRings active={isPhonemePlaying} />
            <motion.button
              onClick={handlePlayPhoneme}
              className="relative z-10 flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-lf-yellow border-[3px] border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)] font-fredoka font-bold text-[clamp(15px,2vw,20px)] text-lf-navy cursor-pointer"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.93 }}
            >
              <Volume2 size={22} className={isPhonemePlaying ? "animate-bounce" : ""} />
              <span>Listen</span>
            </motion.button>
          </div>
        </div>

        {/* Stage 2: Main Object Card (e.g. Ball) */}
        <motion.button
          onClick={handlePlayMainWord}
          className="relative flex flex-col items-center justify-center p-4 rounded-3xl bg-white border-[3.5px] border-lf-navy shadow-[5px_7px_0_var(--color-lf-navy)] cursor-pointer my-4 w-full max-w-xs"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          animate={isPrimaryPlaying ? { scale: [1, 1.06, 1], rotate: [-2, 2, 0] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <SoundRings active={isPrimaryPlaying} />
          <span className="text-[clamp(56px,10vw,88px)] leading-none drop-shadow-[2px_4px_0_rgba(0,0,0,0.12)]">
            {currentItem.primary.emoji}
          </span>
          <span className="font-fredoka font-bold text-[clamp(20px,3vw,28px)] text-lf-navy mt-2 tracking-wide">
            {currentItem.primary.word}
          </span>
          <span className="font-nunito font-bold text-xs text-lf-mutedFg mt-0.5">
            Tap object to hear word
          </span>
        </motion.button>

        {/* Stage 3: "Explore More" Objects (e.g. Banana, Book, Bear) */}
        <div className="w-full flex flex-col items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-fredoka font-bold text-sm sm:text-base text-lf-navy">
              Explore More
            </span>
            <span className="text-xs font-bold text-lf-mutedFg bg-white/70 px-2 py-0.5 rounded-lg border border-lf-navy/20">
              Sound {currentItem.phonemeDisplay}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-[clamp(8px,2vw,16px)] w-full max-w-md">
            {currentItem.examples.map((ex) => {
              const isPlaying = playingAudioId === ex.word;
              return (
                <motion.button
                  key={ex.word}
                  onClick={() => handlePlayExploreObject(ex)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] cursor-pointer ${
                    isPlaying ? "bg-amber-100" : "bg-white"
                  }`}
                  whileHover={{ scale: 1.08, y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  animate={isPlaying ? { scale: [1, 1.1, 1] } : {}}
                >
                  <SoundRings active={isPlaying} />
                  <span className="text-[clamp(30px,5vw,44px)] leading-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.1)]">
                    {ex.emoji}
                  </span>
                  <span className="font-fredoka font-bold text-[clamp(11px,1.5vw,15px)] text-lf-navy mt-1 truncate max-w-full">
                    {ex.word}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Ambient Background Sparkles ──────────────────────── */}
      <AmbientSparkles
        zIndex={5}
        spots={[
          { top: "12%", left: "4%", size: 22, color: C.yellow },
          { top: "22%", right: "5%", size: 18, color: C.orange },
          { top: "78%", left: "3%", size: 20, color: C.teal },
        ]}
      />
    </div>
  );
}
