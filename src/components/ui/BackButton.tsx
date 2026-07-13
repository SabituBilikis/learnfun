import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-lf-white border-[2.5px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] font-fredoka font-bold text-[15px] text-lf-navy shrink-0"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.94 }}
    >
      <ChevronLeft size={18} /> Back
    </motion.button>
  );
}
