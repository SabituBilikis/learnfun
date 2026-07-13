import { motion } from "motion/react";
import { Star } from "lucide-react";
import { C } from "@/app/constants";

export function StarRow({ earned, total = 3, size = 20 }: { earned: number; total?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span key={i}
          animate={i < earned ? { scale: [1, 1.22, 1] } : {}}
          transition={{ delay: i * 0.18, duration: 0.45 }}
        >
          <Star size={size} fill={i < earned ? C.yellow : "none"} color={i < earned ? "#CC9F00" : C.muted} strokeWidth={1.5} />
        </motion.span>
      ))}
    </div>
  );
}
