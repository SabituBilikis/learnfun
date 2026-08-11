import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Volume2, Mic, Home, Star, RotateCcw, ChevronRight, Check } from "lucide-react";
import { C } from "@/app/constants";
import { BackButton } from "@/components/ui/BackButton";
import { CTAButton } from "@/components/ui/CTAButton";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { SoundRings } from "@/components/feedback/SoundRings";
import { ConfettiBurst } from "@/components/feedback/ConfettiBurst";
import { AmbientSparkles } from "@/components/feedback/Sparkle";
import { LessonBg } from "@/components/feedback/LessonBg";
import { useProgress } from "@/hooks/useProgress";
import { usePhonicsAudio } from "@/hooks/usePhonicsAudio";
import phonicsData from "@/data/phonics.json";

export interface PhonicsStepRunnerProps {
  index: number;
  onBack: () => void;
  onNavigate: (index: number) => void;
}

export function PhonicsStepRunner({
  index,
  onBack,
  onNavigate,
}: PhonicsStepRunnerProps) {
  const navigate = useNavigate();
  const { progress, updateProgress } = useProgress();
  const { playingAudioId, playPhoneme, playWord, stop } = usePhonicsAudio();

  const safeIndex = Math.max(0, Math.min(index, phonicsData.length - 1));
  const currentItem = phonicsData[safeIndex] || phonicsData[0];

  // Steps 2 through 6 (Step 1 is the Letter Selection Grid on /phonics)
  const [currentStep, setCurrentStep] = useState<2 | 3 | 4 | 5 | 6>(2);
  const [burstCount, setBurstCount] = useState(0);
  const [exploredWords, setExploredWords] = useState<Set<string>>(new Set());
  const [earnedCompletionReward, setEarnedCompletionReward] = useState(false);

  const canNextLetter = safeIndex < phonicsData.length - 1;

  // Auto-play phoneme on Step 2 entry
  useEffect(() => {
    setCurrentStep(2);
    setExploredWords(new Set());
    setEarnedCompletionReward(false);
    void stop();

    const timer = setTimeout(() => {
      void playPhoneme("step2_phoneme", currentItem.phonemeAudio, currentItem.phoneme);
    }, 350);

    return () => {
      clearTimeout(timer);
      void stop();
    };
  }, [safeIndex, currentItem, playPhoneme, stop]);

  // Handle step completion & rewards
  const handleNextStep = () => {
    void stop();
    if (currentStep === 2) {
      setCurrentStep(3);
      void playWord("step3_word", undefined, currentItem.primary.word);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
      void playPhoneme("step5_phoneme", currentItem.phonemeAudio, currentItem.phoneme);
    } else if (currentStep === 5) {
      // Complete! Trigger Step 6 celebration
      const isNewCompletion = safeIndex >= (progress.catProgress.phonics ?? 0);
      setBurstCount((b) => b + 1);
      setEarnedCompletionReward(isNewCompletion);
      updateProgress((p) => ({
        ...p,
        catProgress: {
          ...p.catProgress,
          phonics: Math.max(p.catProgress.phonics || 0, safeIndex + 1),
        },
        starsTotal: p.starsTotal + (safeIndex >= (p.catProgress.phonics ?? 0) ? 5 : 0),
      }));
      setCurrentStep(6);
    }
  };

  // Play explore word in Step 4
  const handleTapExploreWord = (ex: { word: string; wordAudio?: string; speechText: string }) => {
    if (!exploredWords.has(ex.word)) {
      setExploredWords((prev) => new Set(prev).add(ex.word));
      setBurstCount((b) => b + 1);
      updateProgress((p) => ({ ...p, starsTotal: p.starsTotal + 1 }));
    }
    void playWord(ex.word, ex.wordAudio, ex.speechText || ex.word);
  };

  return (
    <div
      className="relative flex flex-col h-[100dvh] font-fredoka font-nunito overflow-hidden select-none"
      style={{
        background: `linear-gradient(150deg, ${currentItem.color} 0%, ${currentItem.dark} 100%)`,
      }}
    >
      <LessonBg letter={currentItem.letter} emoji={currentItem.primary.emoji} color={currentItem.color} />
      <ConfettiBurst trigger={burstCount} />

      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="relative z-20 shrink-0 flex items-center justify-between gap-3 px-[clamp(14px,3vw,44px)] py-[10px]">
        <div className="flex items-center gap-2">
          <BackButton onClick={onBack} />
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white/20 border-2 border-white/50 font-fredoka font-bold text-xs text-white cursor-pointer backdrop-blur-sm"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Home size={15} /> Home
          </motion.button>
        </div>

        {/* Step Indicator (Steps 2..6) */}
        <ProgressDots current={currentStep - 2} total={5} />

        {/* Star Counter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20 border-2 border-white/50">
          <Star size={15} fill={C.yellow} color="#CC9F00" strokeWidth={1.5} />
          <span className="font-fredoka font-bold text-[15px] text-white">{progress.starsTotal}</span>
        </div>
      </div>

      {/* ── Main Stage ─────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-y-auto px-[clamp(12px,3vw,48px)] py-3">
        <AnimatePresence mode="wait">
          {/* ── Step 2: Hear the Sound ─────────────────────── */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              className="flex flex-col items-center gap-4 text-center my-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* Giant Letter */}
              <div
                className="flex items-center justify-center rounded-3xl w-[clamp(120px,16vw,170px)] h-[clamp(120px,16vw,170px)] border-[5px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] font-fredoka font-bold text-[clamp(72px,10vw,100px)] text-white"
                style={{ backgroundColor: currentItem.color }}
              >
                {currentItem.letter}
              </div>

              {/* Phoneme Badge */}
              <div className="px-6 py-1.5 rounded-2xl bg-white/90 border-2 border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)]">
                <span className="font-fredoka font-bold text-[clamp(22px,3.5vw,34px)] text-lf-navy tracking-wider">
                  {currentItem.phonemeDisplay}
                </span>
              </div>

              {/* Giant Speaker Button */}
              <div className="relative flex items-center justify-center mt-2">
                <SoundRings active={playingAudioId === "step2_phoneme"} />
                <motion.button
                  onClick={() =>
                    playPhoneme("step2_phoneme", currentItem.phonemeAudio, currentItem.phoneme)
                  }
                  className="relative z-10 flex items-center gap-3 px-8 py-3.5 rounded-3xl bg-lf-purple text-white border-[4px] border-lf-navy shadow-[5px_7px_0_var(--color-lf-navy)] font-fredoka font-bold text-[clamp(18px,2.5vw,24px)] cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Volume2 size={28} className={playingAudioId === "step2_phoneme" ? "animate-bounce" : ""} />
                  <span>Tap to hear sound</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: See the Word ───────────────────────── */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              className="flex flex-col items-center gap-3 text-center my-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <span className="font-fredoka font-bold text-3xl text-white drop-shadow-[2px_3px_0_rgba(0,0,0,0.3)]">
                  {currentItem.letter}
                </span>
                <span className="font-fredoka font-bold text-2xl text-white/90 bg-white/20 px-4 py-1 rounded-2xl backdrop-blur-sm border border-white/40">
                  {currentItem.phonemeDisplay}
                </span>
              </div>

              {/* Primary Floating Object with Ribbon Label */}
              <motion.div
                className="relative flex flex-col items-center p-6 rounded-3xl bg-white border-[4px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] min-w-[220px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-[clamp(72px,12vw,110px)] leading-none drop-shadow-[2px_4px_0_rgba(0,0,0,0.12)]">
                  {currentItem.primary.emoji}
                </span>

                {/* Yellow Ribbon Banner */}
                <div className="mt-3 px-8 py-2 rounded-2xl bg-lf-yellow border-[3px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)]">
                  <span className="font-fredoka font-bold text-[clamp(22px,3.5vw,32px)] text-lf-navy tracking-wide">
                    {currentItem.primary.word}
                  </span>
                </div>
              </motion.div>

              {/* Replay Audio Button */}
              <div className="relative flex items-center justify-center mt-1">
                <SoundRings active={playingAudioId === "step3_word"} />
                <motion.button
                  onClick={() =>
                    playWord("step3_word", undefined, currentItem.primary.word)
                  }
                  className="relative z-10 w-14 h-14 rounded-2xl bg-lf-yellow border-[3px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Volume2 size={24} className="text-lf-navy" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Explore More (2x2 Grid) ─────────────── */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              className="flex flex-col items-center gap-3 text-center my-auto w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-5 py-1.5 rounded-2xl bg-white/90 border-2 border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)]">
                <h2 className="font-fredoka font-bold text-[clamp(16px,2.5vw,22px)] text-lf-navy">
                  Words that start with {currentItem.phonemeDisplay}
                </h2>
              </div>

              {/* 2x2 Grid Card */}
              <div className="grid grid-cols-2 gap-3 w-full p-4 rounded-3xl bg-white/95 border-[4px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)]">
                {currentItem.examples.map((ex) => {
                  const isPlaying = playingAudioId === ex.word;
                  const isExplored = exploredWords.has(ex.word);
                  return (
                    <motion.button
                      key={ex.word}
                      onClick={() => handleTapExploreWord(ex)}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-[3px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] cursor-pointer min-h-[105px] ${
                        isPlaying ? "bg-amber-100" : isExplored ? "bg-emerald-50" : "bg-white"
                      }`}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      <SoundRings active={isPlaying} />
                      {isExplored && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-lf-green flex items-center justify-center border border-lf-navy">
                          <Check size={12} color="#FFF" strokeWidth={3} />
                        </div>
                      )}
                      <span className="text-[clamp(36px,6vw,52px)] leading-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.1)]">
                        {ex.emoji}
                      </span>
                      <span className="font-fredoka font-bold text-[clamp(13px,1.8vw,17px)] text-lf-navy mt-1">
                        {ex.word}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Step 5: Listen & Repeat ("Your Turn!") ───────── */}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              className="flex flex-col items-center gap-4 text-center my-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-fredoka font-bold text-[clamp(64px,9vw,90px)] text-white drop-shadow-[3px_4px_0_rgba(26,0,80,0.4)] leading-none">
                  {currentItem.letter}
                </span>
                <span className="font-fredoka font-bold text-2xl text-white/90 bg-white/20 px-5 py-1 rounded-2xl backdrop-blur-sm border border-white/40">
                  {currentItem.phonemeDisplay}
                </span>
              </div>

              <h2 className="font-fredoka font-bold text-[clamp(22px,3.5vw,32px)] text-white drop-shadow-[2px_3px_0_rgba(0,0,0,0.3)]">
                Your turn!
              </h2>

              {/* Playful Green Mic Button 🎤 with animated sound waves */}
              <div className="relative flex items-center justify-center">
                <SoundRings active={playingAudioId === "step5_phoneme"} />
                <motion.button
                  onClick={() =>
                    playPhoneme("step5_phoneme", currentItem.phonemeAudio, currentItem.phoneme)
                  }
                  className="relative z-10 flex items-center justify-center rounded-full w-[clamp(100px,15vw,140px)] h-[clamp(100px,15vw,140px)] bg-lf-green border-[5px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] cursor-pointer"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                >
                  <Mic size={48} color="#FFF" />
                </motion.button>
              </div>

              <p className="font-nunito font-bold text-sm text-white/80">
                Tap to hear sound and repeat aloud! 🗣️
              </p>
            </motion.div>
          )}

          {/* ── Step 6: Celebration ("I Know This Sound!") ──── */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              className="flex flex-col items-center gap-4 text-center my-auto p-6 rounded-3xl bg-white/95 border-[4px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] max-w-sm w-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 280 }}
            >
              <h2 className="font-fredoka font-bold text-[clamp(26px,4vw,36px)] text-lf-navy">
                Great job! 🎉
              </h2>

              <motion.span
                className="text-[80px] leading-none select-none"
                animate={{ scale: [1, 1.2, 1], rotate: [-10, 10, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              >
                🐻
              </motion.span>

              <div className="flex flex-col items-center">
                <span className="font-fredoka font-bold text-xl text-lf-navy">
                  You know {currentItem.phonemeDisplay}!
                </span>
                <div className="flex items-center gap-2 mt-2 px-5 py-2 rounded-2xl bg-lf-yellow border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] font-fredoka font-bold text-lg text-lf-navy">
                  <Star fill={C.yellow} size={20} color="#CC9F00" />
                  <span>{earnedCompletionReward ? "+5 Stars!" : "Sound reviewed!"}</span>
                </div>
              </div>

              {/* Action options: Play Again or Next Letter */}
              <div className="flex flex-col gap-2.5 w-full mt-2">
                {canNextLetter && (
                  <motion.button
                    onClick={() => onNavigate(safeIndex + 1)}
                    className="w-full py-3 rounded-2xl bg-lf-green text-white font-fredoka font-bold text-base border-2 border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] cursor-pointer flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <span>Choose Next Letter</span>
                    <ChevronRight size={18} />
                  </motion.button>
                )}

                <motion.button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-2.5 rounded-2xl bg-white text-lf-navy font-fredoka font-bold text-sm border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] cursor-pointer flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation CTA ────────────────────────────── */}
      {currentStep < 6 && (
        <div className="relative z-20 shrink-0 px-5 pb-5 pt-2 border-t-2 border-t-white/30 backdrop-blur-sm flex justify-center items-center">
          <div className="w-full max-w-md flex justify-center">
            <CTAButton
              label={
                currentStep === 2
                  ? "Next →"
                  : currentStep === 3
                  ? "Explore Words →"
                  : currentStep === 4
                  ? "Your Turn →"
                  : "I Know This Sound! ⭐"
              }
              color={currentItem.color}
              onClick={handleNextStep}
            />
          </div>
        </div>
      )}

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
