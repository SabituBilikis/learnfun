import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { C } from "../../../app/constants";
import type { MatchCard } from "./types";
import { MatchConfetti } from "./GameUI";

export function MemCard({
  card, onClick, gridCols,
}: {
  card: MatchCard; onClick: () => void; gridCols: number;
}) {
  const isHidden   = card.state === "hidden";
  const isRevealed = card.state === "revealed";
  const isMatched  = card.state === "matched";
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isMatched) { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 600); }
  }, [isMatched]);

  const cardSize = gridCols <= 3
    ? "clamp(90px,22vw,140px)"
    : gridCols === 4
    ? "clamp(72px,16vw,120px)"
    : "clamp(60px,13vw,100px)";

  return (
    <div className="relative" style={{ width: cardSize, height: cardSize, perspective: 600, cursor: isMatched ? "default" : "pointer" }}>
      <MatchConfetti active={showConfetti} />
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isHidden ? 0 : 180 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onClick={isHidden || isRevealed ? onClick : undefined}
        whileHover={isHidden ? { scale: 1.07 } : {}}
        whileTap={isHidden ? { scale: 0.94 } : {}}
      >
        {/* Card back */}
        <div
          className="absolute inset-0 rounded-3xl flex items-center justify-center border-3 border-lf-navy shadow-[4px_5px_0_var(--color-lf-navy)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: "linear-gradient(135deg,#7B2FF7,#AF52DE)",
          }}
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            {[
              { top:"20%", left:"20%"  }, { top:"20%", right:"20%" },
              { top:"50%", left:"50%", transform:"translate(-50%,-50%)" },
              { bottom:"20%", left:"20%" }, { bottom:"20%", right:"20%" },
            ].map((s, i) => (
              <div key={i} className="absolute rounded-full bg-white/25 w-3 h-3" style={s} />
            ))}
          </div>
          <span style={{ fontSize:"clamp(22px,5vw,34px)", filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>❓</span>
        </div>

        {/* Card front */}
        <div
          className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center gap-1"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: isMatched ? card.bg : "#FFFFFF",
            border: `3px solid ${isMatched ? card.color : C.navy}`,
            boxShadow: isMatched
              ? `0 0 0 3px ${card.color}55, 4px 5px 0 ${C.navy}`
              : `4px 5px 0 ${C.navy}`,
            transition: "background 0.3s",
          }}
        >
          <span style={{ fontSize:"clamp(28px,8vw,52px)", lineHeight:1 }}>{card.emoji}</span>
          {isMatched && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 14 }}
              className="absolute bottom-1.5 right-1.5 rounded-full flex items-center justify-center border-2 border-lf-navy"
              style={{ width:20, height:20, background:card.color }}
            >
              <Check size={11} color="#FFF" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
