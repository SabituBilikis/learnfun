import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LessonShell } from "@/features/lesson/LessonShell";
import { LessonMascot } from "@/features/lesson/LessonMascot";
import { SoundRings } from "@/components/feedback/SoundRings";
import { PhonicsExplorationPanel } from "./PhonicsExplorationPanel";
import { useProgress } from "@/hooks/useProgress";
import { speak, cancelSpeech } from "@/lib/speech";
import phonicsData from "@/data/phonics.json";

export interface PhonicsLessonScreenProps {
  index: number;
  onBack: () => void;
  onNavigate: (index: number) => void;
  onComplete: () => void;
}

export function PhonicsLessonScreen({
  index,
  onBack,
  onNavigate,
  onComplete,
}: PhonicsLessonScreenProps) {
  const { updateProgress } = useProgress();
  const [playing, setPlaying] = useState(false);
  const [burst, setBurst] = useState(0);
  const [reacting, setReacting] = useState(false);

  const safeIndex = Math.max(0, Math.min(index, phonicsData.length - 1));
  const currentItem = phonicsData[safeIndex] || phonicsData[0];

  useEffect(() => {
    void cancelSpeech();
    setPlaying(false);
    setBurst(0);
    setReacting(false);
  }, [index]);

  const speakItem = async () => {
    if (playing) return;
    setPlaying(true);
    setBurst((b) => b + 1);
    setReacting(true);
    setTimeout(() => setReacting(false), 1200);

    try {
      await speak(currentItem.primary.speechText, { rate: 0.7, pitch: 1.3 });
    } finally {
      setPlaying(false);
    }
  };

  const handleExploreWord = (_word: string) => {
    setBurst((b) => b + 1);
    setReacting(true);
    setTimeout(() => setReacting(false), 1000);
    updateProgress((p) => ({
      ...p,
      starsTotal: p.starsTotal + 1,
    }));
  };

  // Main stage node: Large animated Letter card with SoundRings + Primary illustration
  const mainNode = (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative flex items-center justify-center">
        <SoundRings active={playing} />
        <motion.button
          onClick={speakItem}
          className="relative z-10 flex flex-col items-center justify-center rounded-3xl w-[clamp(140px,18vw,210px)] h-[clamp(140px,18vw,210px)] bg-white/95 border-[5px] border-lf-navy shadow-[6px_8px_0_var(--color-lf-navy)] cursor-pointer"
          animate={playing ? { scale: [1, 1.07, 1] } : { scale: 1 }}
          transition={{ duration: 0.38, repeat: playing ? Infinity : 0 }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.92 }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center font-fredoka font-bold text-3xl text-white border-2 border-lf-navy shadow-[2px_2px_0_var(--color-lf-navy)] mb-1"
            style={{ backgroundColor: currentItem.color }}
          >
            {currentItem.letter}
          </div>
          <span className="text-[clamp(44px,6vw,68px)] leading-none mt-1">
            {currentItem.primary.emoji}
          </span>
          <span className="font-fredoka font-bold text-lg text-lf-navy">
            {currentItem.primary.word}
          </span>
        </motion.button>
      </div>

      <motion.div
        className="px-5 py-1.5 rounded-2xl bg-white/20 border-2 border-white/50 backdrop-blur-[6px]"
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <span className="font-fredoka font-bold text-[clamp(16px,2vw,24px)] text-white tracking-wide">
          Sound: {currentItem.phonemeDisplay}
        </span>
      </motion.div>
    </div>
  );

  return (
    <LessonShell
      color={currentItem.color}
      dark={currentItem.dark}
      letterBg={currentItem.letter}
      emojiBg={currentItem.primary.emoji}
      currentIndex={safeIndex}
      totalEntries={phonicsData.length}
      playing={playing}
      burstCount={burst}
      onBack={onBack}
      onComplete={() => {
        updateProgress((p) => ({ ...p, starsTotal: p.starsTotal + 2 }));
        onComplete();
      }}
      onNavigate={onNavigate}
      onSpeak={speakItem}
      mascotNode={
        <LessonMascot
          reacting={reacting}
          word={currentItem.primary.word}
        />
      }
      mainNode={mainNode}
      panelNode={
        <PhonicsExplorationPanel
          examples={currentItem.examples}
          color={currentItem.color}
          onExplore={handleExploreWord}
        />
      }
    />
  );
}
