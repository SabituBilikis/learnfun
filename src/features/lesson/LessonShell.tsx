import { motion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, RotateCcw, Star } from "lucide-react";
import { C } from "@/app/constants";
import { useProgress } from "@/hooks/useProgress";
import { useSpeechCleanup } from "@/hooks/useSpeech";
import { BackButton } from "@/components/ui/BackButton";
import { ProgressDots } from "@/components/ui/ProgressDots";
import { ConfettiBurst } from "@/components/feedback/ConfettiBurst";
import { LessonBg } from "@/components/feedback/LessonBg";
import { SoundRings } from "@/components/feedback/SoundRings";
import { Sparkle } from "@/components/feedback/Sparkle";

export interface LessonShellProps {
  color: string;
  dark: string;
  letterBg: string;
  emojiBg: string;
  
  currentIndex: number;
  totalEntries: number;
  
  playing: boolean;
  burstCount: number;
  
  onBack: () => void;
  onComplete: () => void;
  onNavigate: (index: number) => void;
  onSpeak: () => void;
  
  mascotNode: React.ReactNode;
  mainNode: React.ReactNode;
  panelNode: React.ReactNode;
}

export function LessonShell({
  color, dark, letterBg, emojiBg,
  currentIndex, totalEntries,
  playing, burstCount,
  onBack, onComplete, onNavigate, onSpeak,
  mascotNode, mainNode, panelNode
}: LessonShellProps) {
  useSpeechCleanup();
  const { progress } = useProgress();

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < totalEntries - 1;

  return (
    <div className="relative flex flex-col overflow-hidden h-[100dvh] font-fredoka font-nunito"
      style={{ background: `linear-gradient(150deg,${color} 0%,${dark} 100%)` }}>
      
      <LessonBg letter={letterBg} emoji={emojiBg} color={color} />

      {/* ── Top bar ────────────────────────────────────────── */}
      <div className="relative z-20 shrink-0 flex items-center justify-between gap-3 px-[clamp(14px,3vw,44px)] py-[10px]">
        <BackButton onClick={onBack} />
        <ProgressDots current={currentIndex} total={totalEntries} />
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/20 border-2 border-white/50">
            <Star size={15} fill={C.yellow} color="#CC9F00" strokeWidth={1.5} />
            <span className="font-fredoka font-bold text-[15px] text-white">{progress.starsTotal}</span>
          </div>
          <motion.button onClick={onComplete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-lf-green border-2 border-lf-navy shadow-[2px_3px_0_var(--color-lf-navy)] font-fredoka font-bold text-[14px] text-white cursor-pointer"
            whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.93 }}>
            <Check size={14} strokeWidth={3} /> Done!
          </motion.button>
        </div>
      </div>

      {/* ── Main stage ─────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-hidden px-[clamp(12px,3vw,56px)]">
        <ConfettiBurst trigger={burstCount} />

        <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center justify-items-center max-w-[1100px] gap-[clamp(12px,3vw,40px)]">
          <div className="order-2 md:order-1 flex justify-center">{mascotNode}</div>
          <div className="order-1 md:order-2 flex flex-col items-center">{mainNode}</div>
          <div className="order-3 flex justify-center">{panelNode}</div>
        </div>
      </div>

      {/* ── Bottom controls ────────────────────────────────── */}
      <div className="relative z-20 shrink-0 flex items-center justify-center pt-[14px] pb-[20px] px-[clamp(16px,3vw,48px)] gap-[clamp(10px,2.5vw,28px)]">
        <motion.button onClick={() => canPrev && onNavigate(currentIndex - 1)}
          className={`flex items-center justify-center rounded-2xl shrink-0 w-[clamp(48px,6vw,72px)] h-[clamp(48px,6vw,72px)] border-[2.5px] ${canPrev ? 'bg-white/20 border-white/70 cursor-pointer' : 'bg-white/10 border-white/20 cursor-default'}`}
          whileHover={canPrev ? { scale: 1.1 } : {}} whileTap={canPrev ? { scale: 0.9 } : {}}>
          <ChevronLeft size={26} color={canPrev ? C.white : "rgba(255,255,255,0.3)"} strokeWidth={2.5} />
        </motion.button>

        <motion.button onClick={onSpeak}
          className="flex items-center justify-center rounded-2xl w-[clamp(48px,6vw,68px)] h-[clamp(48px,6vw,68px)] bg-white/20 border-[2.5px] border-white/70 cursor-pointer"
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
          <RotateCcw size={22} color={C.white} strokeWidth={2.5} />
        </motion.button>

        <div className="relative flex items-center justify-center shrink-0">
          <SoundRings active={playing} />
          <motion.button onClick={onSpeak}
            className="relative z-10 flex items-center justify-center rounded-full w-[clamp(72px,10vw,108px)] h-[clamp(72px,10vw,108px)] bg-lf-yellow border-[4px] border-lf-navy shadow-[5px_7px_0_var(--color-lf-navy)] cursor-pointer"
            animate={playing ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.38, repeat: playing ? Infinity : 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.91 }}>
            <span className="text-[clamp(26px,4vw,44px)]">🔊</span>
          </motion.button>
        </div>

        <motion.button onClick={onSpeak}
          className="flex items-center justify-center rounded-2xl w-[clamp(48px,6vw,68px)] h-[clamp(48px,6vw,68px)] bg-white/20 border-[2.5px] border-white/70 cursor-pointer"
          whileHover={{ scale: 1.12 }} whileTap={{ scale: 0.9 }}>
          <Sparkle size={22} color={C.yellow} />
        </motion.button>

        <motion.button onClick={() => canNext && onNavigate(currentIndex + 1)}
          className={`flex items-center justify-center rounded-2xl shrink-0 w-[clamp(48px,6vw,72px)] h-[clamp(48px,6vw,72px)] border-[2.5px] ${canNext ? 'bg-white border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] cursor-pointer' : 'bg-white/10 border-white/20 cursor-default'}`}
          whileHover={canNext ? { scale: 1.1 } : {}} whileTap={canNext ? { scale: 0.9 } : {}}>
          <ChevronRight size={26} color={canNext ? C.navy : "rgba(255,255,255,0.3)"} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}
