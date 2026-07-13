import { motion } from "motion/react";

// ── Floating ambient background ────────────────────────────────────────────────
export function LessonBg({ letter, emoji }: { letter: string; emoji: string; color?: string }) {
  const items = [letter, "a", emoji, letter, emoji, "a", letter, emoji];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" style={{ zIndex: 1 }}>
      {items.map((item, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{
            fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
            fontSize: `${28 + (i % 3) * 22}px`,
            color: "rgba(255,255,255,0.07)",
            left: `${(i * 14 + 5) % 88}%`,
            top:  `${(i * 19 + 8) % 82}%`,
          }}
          animate={{ y: [0, -(16 + i * 4), 0], rotate: [-8, 8, -8], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 5 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        >
          {item}
        </motion.span>
      ))}
      {/* Soft orbs */}
      {[{x:"15%",y:"20%",s:200},{x:"75%",y:"65%",s:160},{x:"50%",y:"10%",s:120}].map((o,i)=>(
        <motion.div key={i} className="absolute rounded-full pointer-events-none"
          style={{ width:o.s, height:o.s, left:o.x, top:o.y, background:"rgba(255,255,255,0.06)", filter:"blur(40px)" }}
          animate={{ scale:[1,1.3,1], opacity:[0.4,0.8,0.4] }}
          transition={{ duration:4+i*1.2, repeat:Infinity, ease:"easeInOut" }}
        />
      ))}
    </div>
  );
}
