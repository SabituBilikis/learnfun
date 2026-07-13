import { useEffect } from "react";
import { motion } from "motion/react";
import { C } from "../../../app/constants";
import { CTAButton } from "../../../app/modules/primitives";
import { RainingConfetti } from "../../../app/modules/lessonComplete";
import type { DragTask } from "./types";

export function DropParticles({ active, color }: { active: boolean; color: string }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex:60 }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * 360;
        const rad   = (angle * Math.PI) / 180;
        const dist  = 60 + (i % 4) * 18;
        const cols  = [C.yellow, C.orange, C.pink, C.green, C.teal, C.blue, C.purple, color];
        return (
          <motion.div key={i}
            className="absolute rounded-full"
            style={{ width:12, height:12, background:cols[i % cols.length], left:"50%", top:"50%", marginLeft:-6, marginTop:-6 }}
            initial={{ x:0, y:0, scale:1, opacity:1 }}
            animate={{ x:Math.cos(rad)*dist, y:Math.sin(rad)*dist, scale:0.2, opacity:0 }}
            transition={{ duration:0.65, ease:"easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function HintRings({ color }: { color: string }) {
  return (
    <>
      {[0,1,2].map(i => (
        <motion.div key={i}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ border:`3px solid ${color}`, borderRadius:"50%" }}
          animate={{ scale:[1, 1.5+i*0.25], opacity:[0.7, 0] }}
          transition={{ duration:1.2, delay:i*0.3, repeat:Infinity, ease:"easeOut" }}
        />
      ))}
    </>
  );
}

export function EarnedStars({ count, total }: { count: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <motion.span key={i}
          style={{ fontSize:"clamp(22px,4vw,32px)", filter: i < count ? "none" : "grayscale(1) opacity(0.25)" }}
          initial={{ scale: i < count ? 0 : 1, rotate: i < count ? -30 : 0 }}
          animate={{ scale:1, rotate:0 }}
          transition={{ type:"spring", stiffness:380, damping:14, delay: i * 0.12 }}
        >⭐</motion.span>
      ))}
    </div>
  );
}

export function DDBg({ color }: { color: string }) {
  const shapes = [
    { emoji:"✨", top:"8%",  left:"5%",  size:26, delay:0   },
    { emoji:"💫", top:"18%", right:"6%", size:22, delay:0.4 },
    { emoji:"🌟", top:"72%", left:"4%",  size:24, delay:0.8 },
    { emoji:"✨", top:"80%", right:"5%", size:20, delay:1.2 },
    { emoji:"💫", top:"45%", left:"2%",  size:18, delay:0.6 },
    { emoji:"🌟", top:"55%", right:"3%", size:22, delay:1.0 },
  ];
  return (
    <>
      {/* Color blobs */}
      <div className="absolute pointer-events-none" style={{ width:320, height:320, borderRadius:"50%", background:color, opacity:0.12, filter:"blur(80px)", top:-60, left:-60, zIndex:0 }} />
      <div className="absolute pointer-events-none" style={{ width:240, height:240, borderRadius:"50%", background:C.teal, opacity:0.10, filter:"blur(70px)", bottom:-40, right:-40, zIndex:0 }} />
      {/* Floating emojis */}
      {shapes.map((s, i) => (
        <motion.span key={i}
          className="absolute pointer-events-none select-none"
          style={{ fontSize:s.size, opacity:0.22, top:s.top, left:"left" in s ? s.left : undefined, right:"right" in s ? s.right : undefined, zIndex:1 }}
          animate={{ y:[0,-14,0], rotate:[0,15,0] }}
          transition={{ duration:3.5+i*0.5, delay:s.delay, repeat:Infinity, ease:"easeInOut" }}
        >{s.emoji}</motion.span>
      ))}
    </>
  );
}

export function DistractorZone({ task, wrongFlash }: { task: DragTask; wrongFlash: boolean }) {
  const d = task.distractor;
  if (!d) return null;
  return (
    <motion.div
      className="flex flex-col items-center gap-2 opacity-60"
      animate={wrongFlash ? { x:[-8,8,-6,6,-3,0], scale:[1,1.04,1] } : { x:0 }}
      transition={{ duration:0.4 }}
    >
      <div className="px-3 py-1 rounded-xl" style={{ background:d.bg, border:`2px solid ${d.color}` }}>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(11px,2vw,15px)", color:d.color }}>{d.label}</span>
      </div>
      <div className="rounded-full flex items-center justify-center"
        style={{ width:"clamp(80px,13vw,110px)", height:"clamp(80px,13vw,110px)", background:d.bg, border:`3px dashed ${d.color}`, fontSize:"clamp(36px,7vw,52px)", opacity:0.7 }}>
        {d.emoji}
      </div>
    </motion.div>
  );
}

export function CorrectOverlay({ reward, onNext, isLast }: { reward: string; onNext: () => void; isLast: boolean }) {
  useEffect(() => { const t = setTimeout(onNext, 1800); return () => clearTimeout(t); }, []);
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
      style={{ zIndex:90 }}
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
    >
      <motion.div
        className="flex flex-col items-center gap-3 rounded-3xl p-6"
        style={{ background:"rgba(255,255,255,0.96)", border:`4px solid ${C.green}`, boxShadow:`0 0 0 6px ${C.green}33, 6px 8px 0 ${C.navy}` }}
        initial={{ scale:0.5, rotate:-8 }} animate={{ scale:1, rotate:0 }}
        transition={{ type:"spring", stiffness:340, damping:16 }}
      >
        <motion.span style={{ fontSize:72 }}
          animate={{ rotate:[0,-15,15,-10,8,-4,0], scale:[1,1.2,1.1,1] }}
          transition={{ duration:0.7 }}
        >{reward}</motion.span>
        <span style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(20px,4vw,28px)", color:C.green }}>
          {isLast ? "All Done! 🎉" : "Amazing! 🎊"}
        </span>
        <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:14, color:C.mutedFg }}>
          {isLast ? "You matched everything!" : "Next one coming up..."}
        </span>
      </motion.div>
    </motion.div>
  );
}

export function DDVictory({ starsEarned, total, onPlayAgain, onExit }: {
  starsEarned: number; total: number; onPlayAgain: () => void; onExit: () => void;
}) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-5"
      style={{ background:"linear-gradient(148deg,#6B1FD4,#4B0082,#1A0050)", zIndex:100 }}
      initial={{ opacity:0 }} animate={{ opacity:1 }}
    >
      <RainingConfetti />
      <motion.div
        className="relative z-10 flex flex-col items-center gap-5 rounded-3xl p-8"
        style={{ background:"rgba(255,255,255,0.10)", border:"3px solid rgba(255,255,255,0.25)", backdropFilter:"blur(12px)", maxWidth:360, width:"90%" }}
        initial={{ scale:0.6, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:"spring", stiffness:280, damping:20, delay:0.1 }}
      >
        <motion.span style={{ fontSize:"clamp(56px,14vw,88px)" }}
          animate={{ y:[0,-12,0] }} transition={{ duration:1.8, repeat:Infinity }}
        >🏆</motion.span>
        <h1 style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:"clamp(26px,6vw,42px)", color:"#FFFFFF", textAlign:"center", textShadow:"0 4px 16px rgba(0,0,0,0.4)" }}>
          You're a Star!
        </h1>
        <EarnedStars count={starsEarned} total={total} />
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:15, color:"rgba(255,255,255,0.7)", textAlign:"center" }}>
          Matched {starsEarned} of {total} perfectly!
        </p>
        <div className="flex flex-col gap-3 w-full">
          <CTAButton label="🔄 Play Again" color={C.green} onClick={onPlayAgain} />
          <button onClick={onExit}
            className="w-full rounded-2xl flex items-center justify-center"
            style={{ height:52, background:"rgba(255,255,255,0.14)", border:"3px solid rgba(255,255,255,0.35)", fontFamily:"'Fredoka',sans-serif", fontWeight:700, fontSize:18, color:"#FFFFFF", cursor:"pointer" }}
          >
            🏠 Back to Games
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
