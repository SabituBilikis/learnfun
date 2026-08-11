import { useState } from "react";
import { motion } from "motion/react";
import { Volume2 } from "lucide-react";
import { SoundRings } from "@/components/feedback/SoundRings";
import { speak, cancelSpeech } from "@/lib/speech";

export interface ExampleObject {
  word: string;
  emoji: string;
  speechText: string;
}

export function PhonicsExplorationPanel({
  examples,
  color,
  onExplore,
}: {
  examples: ExampleObject[];
  color: string;
  onExplore?: (word: string) => void;
}) {
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const handleTapExample = async (ex: ExampleObject) => {
    await cancelSpeech();
    setPlayingWord(ex.word);
    onExplore?.(ex.word);
    try {
      await speak(ex.speechText, { rate: 0.7, pitch: 1.3 });
    } finally {
      setPlayingWord(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs select-none">
      <span className="font-fredoka font-bold text-xs sm:text-sm text-white/90 bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/40">
        Tap to explore more sounds! 👇
      </span>
      <div className="flex flex-col gap-2.5 w-full">
        {examples.map((ex, idx) => {
          const isPlaying = playingWord === ex.word;
          return (
            <motion.button
              key={ex.word}
              onClick={() => handleTapExample(ex)}
              className="relative flex items-center justify-between px-4 py-3 rounded-2xl bg-white/95 border-[3px] border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)] cursor-pointer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", stiffness: 280 }}
              whileHover={{ scale: 1.04, x: 4 }}
              whileTap={{ scale: 0.96 }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl leading-none drop-shadow-[1px_2px_0_rgba(0,0,0,0.1)]">
                  {ex.emoji}
                </span>
                <span className="font-fredoka font-bold text-base sm:text-lg text-lf-navy">
                  {ex.word}
                </span>
              </div>

              <div className="relative flex items-center justify-center shrink-0">
                <SoundRings active={isPlaying} />
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white border-2 border-lf-navy shadow-[1px_2px_0_var(--color-lf-navy)]"
                  style={{ backgroundColor: color }}
                >
                  <Volume2 size={16} className={isPlaying ? "animate-bounce" : ""} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
