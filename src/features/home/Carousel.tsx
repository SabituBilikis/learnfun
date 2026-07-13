import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { C, CATEGORIES } from "@/app/constants";
import { Sparkle } from "@/components/feedback/Sparkle";
import { CategoryCard } from "./CategoryCard";
import { useProgress } from "@/hooks/useProgress";
import { categoryPercent } from "@/lib/helpers";

function CarouselArrow({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center"
      style={{
        background:  disabled ? C.muted : C.white,
        border:     `2.5px solid ${disabled ? "rgba(26,0,80,0.18)" : C.navy}`,
        boxShadow:  disabled ? "none" : `3px 4px 0 ${C.navy}`,
        color:      disabled ? C.mutedFg : C.navy,
        cursor:     disabled ? "default" : "pointer",
        flexShrink: 0,
      }}
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled   ? {} : { scale: 0.93 }}
    >
      {dir === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </motion.button>
  );
}

export function Carousel({ onNavigate }: { onNavigate: (id: string) => void }) {
  const { progress } = useProgress();
  const ref    = useRef<HTMLDivElement>(null);
  const [pos,  setPos]  = useState(0);
  const [max,  setMax]  = useState(1);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setPos(el.scrollLeft);
      setMax(el.scrollWidth - el.clientWidth);
      const cardW = el.firstElementChild?.getBoundingClientRect().width ?? 200;
      setTick(Math.round(el.scrollLeft / (cardW + 16)));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const scrollBy = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const cardW = el.firstElementChild?.getBoundingClientRect().width ?? 295;
    el.scrollBy({ left: dir === "right" ? cardW + 16 : -(cardW + 16), behavior: "smooth" });
  };

  const canLeft  = pos > 4;
  const canRight = pos < max - 4;

  return (
    <div className="flex flex-col gap-2 min-h-0">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkle size={18} color={C.yellow} />
          <h2
            className="truncate"
            style={{
              fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
              fontSize: "clamp(17px, 2vw, 26px)", color: C.navy,
            }}
          >
            Choose Your Adventure!
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="hidden md:block text-xs font-bold"
            style={{ color: C.mutedFg, fontFamily: "'Nunito',sans-serif", whiteSpace: "nowrap" }}
          >
            {CATEGORIES.filter(c => c.state !== "locked").length}/{CATEGORIES.length} unlocked
          </span>
          <CarouselArrow dir="left"  disabled={!canLeft}  onClick={() => scrollBy("left")}  />
          <CarouselArrow dir="right" disabled={!canRight} onClick={() => scrollBy("right")} />
        </div>
      </div>

      {/* Card row */}
      <div
        ref={ref}
        className="lf-carousel flex gap-4 overflow-x-auto"
        style={{
          scrollSnapType: "x proximity",
          WebkitOverflowScrolling: "touch",
          paddingTop: 10, paddingBottom: 14,
          cursor: "grab",
        }}
        onMouseDown={e => { e.currentTarget.style.cursor = "grabbing"; }}
        onMouseUp={e   => { e.currentTarget.style.cursor = "grab"; }}
        onMouseLeave={e => { e.currentTarget.style.cursor = "grab"; }}
      >
        {CATEGORIES.map((c, i) => {
          const pct = categoryPercent(c, progress);
          
          // Determine if locked based on previous category's completion (except first 4 which are always unlocked)
          let isLocked = false;
          if (i >= 4) {
            const prevCat = CATEGORIES[i - 1];
            const prevPct = categoryPercent(prevCat, progress);
            if (prevPct < 100) isLocked = true;
          }

          let state = c.state;
          if (isLocked) state = "locked";
          else if (pct === 100) state = "complete";
          else if (pct > 0) state = "active";
          else state = "new";

          return (
            <CategoryCard 
              key={c.id} 
              cat={{ ...c, progress: pct, state }} 
              index={i} 
              onNavigate={() => onNavigate(c.id)} 
            />
          );
        })}
        <div style={{ minWidth: 8, flexShrink: 0 }} />
      </div>

      {/* Scroll position dots */}
      <div className="flex justify-center gap-1.5 pt-0.5">
        {CATEGORIES.map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full"
            animate={{
              width:      i === tick ? 22 : 8,
              background: i === tick ? C.navy : "rgba(26,0,80,0.18)",
            }}
            transition={{ duration: 0.25 }}
            style={{ height: 8 }}
          />
        ))}
      </div>
    </div>
  );
}
