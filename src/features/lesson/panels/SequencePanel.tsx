import { useState, useEffect } from "react";
import { motion } from "motion/react";
import type { CatEntry } from "../../../app/modules/categories";

export function SequencePanel({ entries, currentIndex, color, onCountChange }: {
  entries: CatEntry[]; currentIndex: number; color: string; onCountChange: (c: number) => void;
}) {
  const [tapped, setTapped] = useState(false);

  useEffect(() => { setTapped(false); onCountChange(0); }, [currentIndex]);

  function tap() {
    if (tapped) return;
    setTapped(true); onCountChange(1);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-fredoka font-bold text-[12px] text-white/65">
        {entries[currentIndex]?.name} is #{currentIndex + 1} of {entries.length}
      </p>
      {/* Mini sequence strip */}
      <div className="flex flex-wrap justify-center gap-1.5 max-w-[220px]">
        {entries.map((e, i) => {
          const isCur  = i === currentIndex;
          const isPast = i < currentIndex;
          return (
            <motion.div key={e.name}
              className="flex flex-col items-center justify-center rounded-xl"
              style={{ width:36, height:40, background:isCur?`${color}DD`:isPast?"rgba(255,255,255,0.22)":"rgba(255,255,255,0.1)", border:`2px solid ${isCur?"rgba(255,255,255,0.9)":isPast?"rgba(255,255,255,0.4)":"rgba(255,255,255,0.15)"}`, transition:"all 0.2s" }}
              animate={isCur?{ scale:[1,1.1,1] }:{}} transition={{ duration:1.8, repeat:Infinity }}>
              <span style={{ fontSize:isCur?18:14, lineHeight:1, filter:!isPast&&!isCur?"grayscale(1) opacity(0.4)":"none" }}>{e.emoji}</span>
              {isCur && <span className="font-fredoka font-bold text-[8px] text-lf-white leading-none">{i+1}</span>}
            </motion.div>
          );
        })}
      </div>
      {/* Big tap card for current */}
      <motion.button onClick={tap}
        className="flex flex-col items-center justify-center rounded-2xl gap-1 mt-1"
        style={{ width:100, height:100, background:tapped?`${color}CC`:"rgba(255,255,255,0.18)", border:`3px solid ${tapped?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.4)"}`, cursor:tapped?"default":"pointer" }}
        whileHover={!tapped?{ scale:1.08 }:{}} whileTap={!tapped?{ scale:0.9 }:{}}
        animate={!tapped?{ scale:[1,1.05,1] }:{}} transition={{ duration:2, repeat:!tapped?Infinity:0 }}>
        <span style={{ fontSize:36 }}>{entries[currentIndex]?.emoji}</span>
        <span className="font-fredoka font-bold text-[11px] text-lf-white text-center leading-[1.2]">
          {tapped ? entries[currentIndex]?.name : "Tap me!"}
        </span>
      </motion.button>
      {tapped && (
        <motion.div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl"
          style={{ background:"rgba(52,199,89,0.28)", border:"2px solid rgba(255,255,255,0.7)" }}
          initial={{ scale:0 }} animate={{ scale:1 }}>
          <span className="font-fredoka font-bold text-[12px] text-lf-white">⭐ Great job!</span>
        </motion.div>
      )}
    </div>
  );
}
