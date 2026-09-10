import React from "react";
import { motion } from "motion/react";
import { Download, RotateCcw, Settings, Star, Users } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import learnFunLogo from "@/imports/Learn_fun.png";
import { C, CATEGORIES } from "@/app/constants";
import { useProgress } from "@/hooks/useProgress";
import { defaultProgress } from "@/lib/progress";
import { calculateEarnedStars } from "@/lib/helpers";
import { usePWAInstall } from "@/hooks/usePWAInstall";

// ── NavPill (reusable nav button) ─────────────────────────────────────────────
function NavPill({
  icon, label, bg, fg = C.navy, showLabel = false, onClick,
}: {
  icon: React.ReactNode; label?: string; bg: string; fg?: string;
  showLabel?: boolean; onClick?: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-2xl cursor-pointer border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] ${
        showLabel && label ? "py-2 pr-3.5 pl-2.5" : "py-2 px-2.5"
      }`}
      style={{ backgroundColor: bg, color: fg }}
      whileHover={{ y: -2 }}
      whileTap={{ y: 2 }}
    >
      {icon}
      {showLabel && label && (
        <span className="hidden sm:block text-sm font-bold font-fredoka">
          {label}
        </span>
      )}
    </motion.button>
  );
}

// ── Top Navigation ────────────────────────────────────────────────────────────
export function TopNav({ onInstall, onSettings, onParent }: { onInstall?: () => void; onSettings?: () => void; onParent?: () => void }) {
  const { progress, activeProfile, updateProgress } = useProgress();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const displayStars = Math.max(progress.starsTotal, calculateEarnedStars(CATEGORIES, progress));

  const handleInstallClick = () => {
    if (isInstallable) {
      promptInstall();
    } else {
      if (onInstall) onInstall();
    }
  };

  const handleEraseData = () => {
    if (confirm("Are you sure you want to erase all learning progress and start fresh?")) {
      updateProgress(() => defaultProgress());
      alert("All progress erased! Starting fresh.");
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between bg-white border-b-[3px] border-b-lf-navy shadow-[0_2px_16px_rgba(26,0,80,0.10)] py-2.5 pr-5 pl-4">
      {/* Logo */}
      <motion.div
        className="h-[52px] cursor-pointer"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <ImageWithFallback
          src={learnFunLogo}
          alt="LearnFun — Play. Learn. Grow."
          className="h-full w-auto object-contain mix-blend-multiply"
        />
      </motion.div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Profile */}
        {activeProfile && (
          <motion.div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F3EEFF] border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] mr-2"
            whileHover={{ y: -2 }}
          >
            <span className="text-xl leading-none">{activeProfile.avatar}</span>
            <span className="font-fredoka font-bold text-lf-navy text-[15px]">{activeProfile.name}</span>
          </motion.div>
        )}

        {/* Erase / Reset Data Button */}
        <motion.button
          onClick={handleEraseData}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] cursor-pointer"
          whileHover={{ y: -2, scale: 1.03 }}
          whileTap={{ y: 2, scale: 0.95 }}
          title="Erase all data and start fresh"
        >
          <RotateCcw size={16} className="text-lf-red stroke-[2.5]" />
          <span className="font-fredoka font-bold text-lf-red text-[15px]">Erase</span>
        </motion.button>

        {/* Stars — desktop */}
        <motion.div
          className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-lf-yellow border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)]"
          whileHover={{ y: -2 }}
        >
          <Star size={15} className="fill-lf-navy text-lf-navy" />
          <span className="font-fredoka font-bold text-lf-navy text-[15px]">{displayStars}</span>
        </motion.div>

        {/* Install App */}
        {!isInstalled && (
          <NavPill
            icon={<Download size={17} />}
            label="Install App"
            bg={C.green} fg={C.white}
            showLabel
            onClick={handleInstallClick}
          />
        )}

        {/* Settings */}
        <NavPill icon={<Settings size={17} />} bg={C.white} onClick={onSettings} />

        {/* Parent */}
        <NavPill
          icon={<Users size={17} />}
          label="Parent"
          bg={C.purple} fg={C.white}
          showLabel
          onClick={onParent}
        />
      </div>
    </div>
  );
}
