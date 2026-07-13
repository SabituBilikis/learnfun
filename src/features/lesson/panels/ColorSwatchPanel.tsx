import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { CatEntry } from "../../../app/modules/categories";

export function ColorSwatchPanel({ entry, onCountChange }: {
  entry: CatEntry; onCountChange: (c: number) => void;
}) {
  const [found, setFound]   = useState<boolean[]>(() => Array((entry.panelEmojis||[]).length).fill(false));
  const [done,  setDone]    = useState(false);

  useEffect(() => {
    const items = entry.panelEmojis || [];
    setFound(Array(items.length).fill(false));
    setDone(false); onCountChange(0);
  }, [entry.name]);

  const items = entry.panelEmojis || [];

  function tap(i: number) {
    if (found[i] || done) return;
    const next = [...found]; next[i] = true; setFound(next);
    const c = next.filter(Boolean).length;
    onCountChange(c);
    if (c === items.length) setTimeout(() => setDone(true), 400);
  }

  function reset() { setFound(Array(items.length).fill(false)); setDone(false); onCountChange(0); }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Big color swatch */}
      <motion.div className="flex items-center justify-center rounded-3xl"
        style={{ width:100, height:100, background:entry.color, border:"4px solid rgba(255,255,255,0.85)", boxShadow:`0 8px 24px ${entry.color}80` }}
        animate={{ scale:[1,1.06,1] }} transition={{ duration:2.5, repeat:Infinity }}>
        <span style={{ fontSize:44 }}>{entry.emoji}</span>
      </motion.div>
      {/* Things that are this color */}
      <p className="font-fredoka font-bold text-[12px] text-white/70 text-center">
        Tap the {entry.name.toLowerCase()} things!
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 52px)", gap:8 }}>
        {items.map((em, i) => (
          <motion.button key={i} onClick={() => tap(i)}
            style={{ width:52, height:52, borderRadius:16, background:found[i]?`${entry.color}BB`:"rgba(255,255,255,0.18)", border:`2.5px solid ${found[i]?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.3)"}`, fontSize:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:found[i]?"default":"pointer" }}
            whileHover={!found[i]?{ scale:1.14 }:{}} whileTap={!found[i]?{ scale:0.86 }:{}}
            animate={found[i]?{ scale:[1,1.25,1] }:{}} transition={{ type:"spring", stiffness:400 }}>
            {em}
          </motion.button>
        ))}
      </div>
      {done && (
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring" }}>
          <span className="font-fredoka font-bold text-[13px] text-lf-white">🎉 You know {entry.name}!</span>
        </motion.div>
      )}
      {found.some(Boolean) && <button onClick={reset} className="font-nunito font-bold text-[11px] text-white/50 bg-transparent border-none cursor-pointer">↺ {done?"Again!":"Reset"}</button>}
    </div>
  );
}
