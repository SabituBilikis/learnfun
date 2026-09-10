import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Check, Lock, Star, Volume2, Home } from "lucide-react";
import { C } from "@/app/constants";
import { BackButton } from "@/components/ui/BackButton";
import { useProgress } from "@/hooks/useProgress";
import { usePhonicsAudio } from "@/hooks/usePhonicsAudio";
import { SoundRings } from "@/components/feedback/SoundRings";
import phonicsData from "@/data/phonics.json";

export interface PhonemeItem {
  id: string;
  letter: string;
  phoneme: string;
  phonemeDisplay: string;
  phonemeAudio?: string;
  color: string;
  dark: string;
  primary: {
    word: string;
    emoji: string;
    wordAudio?: string;
    speechText: string;
  };
  examples: Array<{ word: string; emoji: string; wordAudio?: string; speechText: string }>;
}

export function PhonicsOverviewScreen() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const { playingAudioId, playPhoneme } = usePhonicsAudio();

  const items = phonicsData as PhonemeItem[];
  const learnedCount = Math.min(progress.catProgress.phonics ?? 0, items.length);

  const handleCardTap = (index: number) => {
    navigate(`/phonics/lesson/${index}`);
  };

  return (
    <div className="relative flex flex-col h-[100dvh] font-fredoka font-nunito bg-gradient-to-b from-[#FFF9F0] via-[#FFFFFF] via-[55%] to-[#F3EEFF] overflow-hidden select-none">
      {/* ── Top Header ────────────────────────────────────────── */}
      <div className="relative z-20 shrink-0 flex items-center justify-between px-[clamp(14px,3vw,44px)] py-[12px] border-b-[3px] border-b-lf-navy bg-white/90 backdrop-blur-md shadow-[0_4px_0_var(--color-lf-navy)]">
        <div className="flex items-center gap-3">
          <BackButton onClick={() => navigate("/")} />
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] font-fredoka font-bold text-sm text-lf-navy cursor-pointer"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Home size={16} /> Home
          </motion.button>
        </div>

        {/* Reward Star Pill */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-lf-orange border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)]">
          <Star size={16} fill={C.yellow} color="#CC9F00" strokeWidth={1.5} />
          <span className="font-fredoka font-bold text-[15px] text-white">
            {progress.starsTotal}
          </span>
        </div>
      </div>

      {/* ── Title Header ──────────────────────────────────────── */}
      <div className="relative z-10 text-center pt-4 px-4 shrink-0">
        <h1 className="font-fredoka font-bold text-[clamp(24px,5vw,38px)] text-lf-navy leading-tight drop-shadow-[1px_2px_0_rgba(255,255,255,0.8)]">
          Let's Discover Sounds! 🗣️
        </h1>
        <p className="font-nunito font-bold text-[clamp(14px,2vw,18px)] text-lf-mutedFg mt-1">
          Tap a letter and listen.
        </p>
      </div>

      {/* ── Main Stage Grid ───────────────────────────────────── */}
      <div className="relative z-10 flex-1 overflow-y-auto lf-carousel px-[clamp(16px,4vw,56px)] py-4 flex items-center justify-center">
        <div className="w-full max-w-4xl grid grid-cols-2 sm:grid-cols-3 gap-[clamp(12px,2.5vw,24px)] my-auto">
          {items.map((item, index) => {
            const isComplete = index < learnedCount;
            const isUnlocked = true; // All available phonics sounds unlocked for open exploration
            return (
              <motion.button
                key={item.id}
                onClick={() => isUnlocked && handleCardTap(index)}
                disabled={!isUnlocked}
                aria-label={isUnlocked ? `Learn the ${item.letter} sound` : `${item.letter} sound is locked`}
                className={`relative flex flex-col items-center justify-between p-[clamp(12px,2vw,20px)] rounded-3xl bg-white border-[3.5px] border-lf-navy shadow-[5px_7px_0_var(--color-lf-navy)] select-none overflow-hidden min-h-[clamp(150px,22vh,210px)] ${
                  isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-60 grayscale"
                }`}
                initial={{ opacity: 0, y: 24, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.07, type: "spring", stiffness: 270, damping: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.94 }}
              >
                {/* Audio button / status badge */}
                <div className="absolute top-3 right-3 flex items-center justify-center">
                  <motion.button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isUnlocked) {
                        void playPhoneme(item.id, item.phonemeAudio, item.phoneme);
                      }
                    }}
                    disabled={!isUnlocked}
                    aria-label={`Listen to ${item.letter} sound`}
                    className="relative z-20 w-9 h-9 rounded-xl bg-amber-100 border-2 border-lf-navy flex items-center justify-center shadow-[1px_2px_0_var(--color-lf-navy)] cursor-pointer"
                    whileHover={isUnlocked ? { scale: 1.12 } : {}}
                    whileTap={isUnlocked ? { scale: 0.9 } : {}}
                  >
                    <SoundRings active={playingAudioId === item.id} />
                    {isComplete ? (
                      <Check size={16} className="text-lf-green" strokeWidth={3} />
                    ) : isUnlocked ? (
                      <Volume2 size={16} className={`text-lf-navy ${playingAudioId === item.id ? "animate-bounce" : ""}`} />
                    ) : (
                      <Lock size={15} className="text-lf-mutedFg" />
                    )}
                  </motion.button>
                </div>

                {/* Top Badge with Large Letter */}
                <div className="flex items-center justify-center mt-1">
                  <div
                    className="flex items-center justify-center rounded-2xl w-[clamp(54px,8vw,76px)] h-[clamp(54px,8vw,76px)] border-[3px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] font-fredoka font-bold text-[clamp(32px,5vw,48px)] text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.letter}
                  </div>
                </div>

                {/* Familiar Illustration + Word Label */}
                <div className="flex flex-col items-center mt-2 mb-1">
                  <span className="text-[clamp(44px,7vw,64px)] leading-none drop-shadow-[2px_3px_0_rgba(0,0,0,0.12)]">
                    {item.primary.emoji}
                  </span>
                  <span className="font-fredoka font-bold text-[clamp(15px,2vw,22px)] text-lf-navy mt-1 tracking-wide">
                    {item.primary.word}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
