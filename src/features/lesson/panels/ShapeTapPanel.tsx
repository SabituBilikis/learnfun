import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { CatEntry } from "../../../app/modules/categories";
import { ShapeSvg } from "../../../components/icons/ShapeSvg";
import { speak } from "../../../lib/speech";

export function ShapeTapPanel({ entry, onCountChange }: {
  entry: CatEntry; onCountChange: (c: number) => void;
}) {
  const [tapped,   setTapped]   = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>(() => Array((entry.panelEmojis||[]).length).fill(false));
  const [done,     setDone]     = useState(false);

  useEffect(() => {
    setTapped(false);
    setRevealed(Array((entry.panelEmojis||[]).length).fill(false));
    setDone(false); onCountChange(0);
  }, [entry.name]);

  const items = entry.panelEmojis || [];

  function tapShape() {
    if (tapped) return;
    setTapped(true); onCountChange(1);
    speak(entry.fact ? `${entry.name}! ${entry.fact}` : `${entry.name}!`, { rate: 0.7, pitch: 1.3 });
  }

  function tapItem(i: number) {
    if (revealed[i]) return;
    const next = [...revealed]; next[i] = true; setRevealed(next);
    const c = next.filter(Boolean).length;
    onCountChange(1 + c);
    if (tapped && c === items.length) setTimeout(() => setDone(true), 400);
  }

  function reset() {
    setTapped(false);
    setRevealed(Array(items.length).fill(false));
    setDone(false); onCountChange(0);
  }

  const shapeType = entry.shapeType || "circle";
  const col       = entry.color;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Tappable SVG shape */}
      <motion.button onClick={tapShape}
        style={{ background:"none", border:"none", cursor:tapped?"default":"pointer", padding:0 }}
        whileHover={!tapped?{ scale:1.1 }:{}} whileTap={!tapped?{ scale:0.9 }:{}}
        animate={tapped?{ rotate:[0,8,-8,0] }:{ scale:[1,1.04,1] }}
        transition={tapped?{ duration:0.4 }:{ duration:2.5, repeat:Infinity }}>
        <ShapeSvg type={shapeType} color={tapped ? col : "rgba(255,255,255,0.35)"} size={110} />
      </motion.button>
      {!tapped && <p className="font-fredoka text-[12px] text-white/65 text-center">Tap the shape!</p>}
      {tapped && (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
          <p className="font-fredoka font-bold text-[12px] text-white/70 text-center mb-[6px]">Find things shaped like a {entry.name.toLowerCase()}!</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2, 52px)", gap:8 }}>
            {items.map((em, i) => (
              <motion.button key={i} onClick={()=>tapItem(i)}
                style={{ width:52, height:52, borderRadius:16, background:revealed[i]?`${col}BB`:"rgba(255,255,255,0.18)", border:`2.5px solid ${revealed[i]?"rgba(255,255,255,0.85)":"rgba(255,255,255,0.3)"}`, fontSize:26, display:"flex", alignItems:"center", justifyContent:"center", cursor:revealed[i]?"default":"pointer" }}
                whileHover={!revealed[i]?{ scale:1.14 }:{}} whileTap={!revealed[i]?{ scale:0.86 }:{}}
                animate={revealed[i]?{ scale:[1,1.25,1] }:{}} transition={{ type:"spring", stiffness:400 }}>
                {em}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
      {done && (
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0 }} animate={{ scale:1 }}>
          <span className="font-fredoka font-bold text-[13px] text-lf-white">🎉 You know this shape!</span>
        </motion.div>
      )}
      {tapped && <button onClick={reset} className="font-nunito font-bold text-[11px] text-white/50 bg-transparent border-none cursor-pointer">↺ Explore again!</button>}
    </div>
  );
}
