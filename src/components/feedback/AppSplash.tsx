import { motion } from "motion/react";
import { C } from "@/app/constants";
import { Sparkle } from "@/components/feedback/Sparkle";
import learnFunLogo from "@/imports/Learn_fun.png";

export function AppSplash({ onDone }: { onDone: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-[9999] font-fredoka bg-gradient-to-br from-lf-purple to-lf-navy"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Floating stars */}
      {([
        { top:"8%",  left:"6%",  size:28, color:C.yellow, delay:0 },
        { top:"12%", right:"8%", size:20, color:C.pink,   delay:0.3 },
        { top:"78%", left:"4%",  size:24, color:C.teal,   delay:0.6 },
        { top:"82%", right:"6%", size:18, color:C.orange, delay:0.9 },
        { top:"45%", left:"2%",  size:16, color:"rgba(255,255,255,0.5)", delay:1.2 },
        { top:"38%", right:"3%", size:22, color:C.yellow, delay:0.5 },
      ] as { top: string; left?: string; right?: string; size: number; color: string; delay: number }[]).map((s, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ top: s.top, left: s.left, right: s.right }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.7, 1] }}
          transition={{ delay: s.delay, duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}>
          <Sparkle size={s.size} color={s.color} />
        </motion.div>
      ))}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          className="flex items-center justify-center rounded-3xl py-3 px-[18px] bg-white border-[5px] border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}>
          <img src={learnFunLogo} alt="LearnFun" className="w-[160px] max-w-[60vw] h-auto object-contain" />
        </motion.div>
      </motion.div>

      {/* Loading dots */}
      <motion.div className="flex gap-2 mt-12"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="rounded-full w-2.5 h-2.5 bg-lf-yellow"
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, delay: i * 0.18, repeat: Infinity }} />
        ))}
      </motion.div>

      {/* Tap to skip */}
      <motion.button onClick={onDone}
        className="absolute bottom-10 font-nunito font-semibold text-[13px] text-white/45 bg-transparent border-none cursor-pointer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
        Tap to continue →
      </motion.button>
    </motion.div>
  );
}
