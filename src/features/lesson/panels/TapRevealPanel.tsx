import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function TapRevealPanel({ items, color, onCountChange }: {
  items: string[]; color: string; onCountChange: (c: number) => void;
}) {
  const [revealed, setRevealed] = useState<boolean[]>(() => Array(items.length).fill(false));
  const [last,     setLast]     = useState(-1);
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    setRevealed(Array(items.length).fill(false));
    setLast(-1); setDone(false); onCountChange(0);
  }, [items.join("")]);

  function tap(i: number) {
    if (revealed[i] || done) return;
    const next = [...revealed]; next[i] = true; setRevealed(next);
    setLast(i);
    const c = next.filter(Boolean).length;
    onCountChange(c);
    if (c === items.length) setTimeout(() => setDone(true), 400);
  }

  function reset() {
    setRevealed(Array(items.length).fill(false));
    setLast(-1); setDone(false); onCountChange(0);
  }

  const n = items.length;
  const sz = n <= 4 ? 62 : n <= 6 ? 52 : 44;

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(n, 4)}, ${sz}px)`, gap:8 }}>
        {items.map((em, i) => (
          <motion.button key={i} onClick={() => tap(i)}
            style={{ width:sz, height:sz, borderRadius:Math.round(sz*0.3), background:revealed[i]?`${color}BB`:"rgba(255,255,255,0.18)", border:`2.5px solid ${revealed[i]?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.3)"}`, fontSize:sz<=44?22:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:revealed[i]?"default":"pointer" }}
            whileHover={!revealed[i]?{ scale:1.14 }:{}} whileTap={!revealed[i]?{ scale:0.88 }:{}}
            animate={i===last?{ scale:[1,1.3,1] }:{}} transition={{ type:"spring", stiffness:400, damping:14 }}>
            {revealed[i] ? em : "❓"}
          </motion.button>
        ))}
      </div>
      {done && (
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:360 }}>
          <span style={{ fontSize:16 }}>🎉</span>
          <span className="font-fredoka font-bold text-[13px] text-lf-white">All found!</span>
        </motion.div>
      )}
      {revealed.some(Boolean) && (
        <button onClick={reset} className="font-nunito font-bold text-[11px] text-white/50 bg-transparent border-none cursor-pointer">
          ↺ {done ? "Explore again!" : "Reset"}
        </button>
      )}
    </div>
  );
}
