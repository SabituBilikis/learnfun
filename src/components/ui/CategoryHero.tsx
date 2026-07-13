import { motion } from "motion/react";
import { C } from "@/app/constants";

export function CategoryHero({ title, emoji, subtitle, color, dark, mascot }: {
  title: string; emoji: string; subtitle: string; color: string; dark: string; mascot: string;
}) {
  return (
    <div
      className="relative flex items-center justify-between overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${dark} 100%)`,
        borderRadius: 28, border: `3px solid ${C.navy}`, boxShadow: `5px 7px 0 ${C.navy}`,
        padding: "clamp(20px, 3vw, 36px)", minHeight: "clamp(140px, 18vh, 200px)",
      }}
    >
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.18) 0%,transparent 55%)", borderRadius: 26 }} />
      {["A","B","C","Z","Y"].map((l, i) => (
        <span key={l} className="absolute pointer-events-none select-none" style={{
          fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
          fontSize: "clamp(32px,5vw,68px)", color: "rgba(255,255,255,0.12)",
          top:  ["8%","55%","28%","12%","60%"][i], left: ["4%","10%","78%","88%","68%"][i],
          transform: `rotate(${[-20,15,-10,25,-30][i]}deg)`,
        }}>{l}</span>
      ))}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <span style={{ fontSize: "clamp(32px,5vw,60px)", lineHeight: 1 }}>{emoji}</span>
          <div>
            <h1 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: "clamp(26px,4vw,52px)", color: C.white, textShadow: "3px 3px 0 rgba(26,0,80,0.28)", lineHeight: 1 }}>{title}</h1>
            <p style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: "clamp(12px,1.4vw,17px)", color: "rgba(255,255,255,0.88)" }}>{subtitle}</p>
          </div>
        </div>
      </div>
      <motion.span className="relative z-10 select-none" style={{ fontSize: "clamp(64px,10vw,120px)", lineHeight: 1 }}
        animate={{ rotate: [-6, 6, -6], y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >{mascot}</motion.span>
    </div>
  );
}
