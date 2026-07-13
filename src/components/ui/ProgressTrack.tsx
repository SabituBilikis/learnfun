import { motion } from "motion/react";

export function ProgressTrack({ progress, color, height = 10, label }: { progress: number; color: string; height?: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5">
          <span className="font-nunito font-bold text-[12px] text-lf-muted-fg">{label}</span>
          <span className="font-fredoka font-bold text-[13px]" style={{ color }}>{progress}%</span>
        </div>
      )}
      <div className="rounded-full overflow-hidden bg-lf-muted" style={{ height }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}EE, ${color}AA)` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.25 }}
        />
      </div>
    </div>
  );
}
