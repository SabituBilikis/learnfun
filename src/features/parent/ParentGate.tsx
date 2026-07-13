import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ShieldCheck } from "lucide-react";


export function ParentGate({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [options, setOptions] = useState<number[]>([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    generateProblem();
  }, []);

  function generateProblem() {
    const a = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const b = Math.floor(Math.random() * 5) + 3; // 3 to 7
    const ans = a * b;
    setNum1(a);
    setNum2(b);

    const opts = new Set<number>();
    opts.add(ans);
    while (opts.size < 4) {
      opts.add(ans + (Math.floor(Math.random() * 10) - 5));
    }
    setOptions(Array.from(opts).sort(() => Math.random() - 0.5));
  }

  function handlePick(n: number) {
    if (n === num1 * num2) {
      onSuccess();
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      generateProblem();
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-lf-navy to-[#2D0082] px-6 py-8 font-fredoka font-nunito">
      
      <div className="absolute top-6 left-6">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-1 rounded-2xl px-3 py-2 bg-white/10 border-2 border-white/20 text-white cursor-pointer"
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.94 }}
        >
          <ChevronLeft size={18} />
          <span className="font-fredoka font-bold text-[14px]">Exit</span>
        </motion.button>
      </div>

      <motion.div 
        className="flex flex-col items-center bg-white rounded-3xl p-8 border-[4px] border-lf-orange shadow-[8px_10px_0_var(--color-lf-orange)] max-w-md w-full"
        animate={shake ? { x: [-10, 10, -8, 8, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <div className="w-16 h-16 bg-lf-orange rounded-full flex items-center justify-center text-white mb-4">
          <ShieldCheck size={32} />
        </div>
        
        <h2 className="font-fredoka font-bold text-2xl text-lf-navy mb-2 text-center">
          Parents Only
        </h2>
        
        <p className="font-nunito text-lf-mutedFg mb-6 text-center">
          Please solve the math problem to access the dashboard.
        </p>

        <div className="text-[clamp(32px,6vw,48px)] font-fredoka font-bold text-lf-navy mb-8">
          {num1} &times; {num2} = ?
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
          {options.map((opt, i) => (
            <motion.button
              key={i}
              onClick={() => handlePick(opt)}
              className="py-4 rounded-2xl bg-lf-muted border-[3px] border-lf-navy shadow-[3px_4px_0_var(--color-lf-navy)] font-fredoka font-bold text-2xl text-lf-navy cursor-pointer"
              whileHover={{ scale: 1.05, backgroundColor: "#EAF4FF" }}
              whileTap={{ scale: 0.95 }}
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
