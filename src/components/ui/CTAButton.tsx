import React from "react";
import { motion } from "motion/react";

export function CTAButton({ label, color, icon, onClick }: { label: string; color: string; icon?: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-7 py-[13px] border-3 border-lf-navy shadow-[4px_6px_0_var(--color-lf-navy)] rounded-[20px] font-fredoka font-bold text-[17px] text-lf-white whitespace-nowrap"
      style={{ background: color }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      {icon}{label}
    </motion.button>
  );
}
