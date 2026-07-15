import { motion } from "motion/react";
import { C, CATEGORIES } from "@/app/constants";
import { useGreeting } from "@/hooks/useGreeting";
import { useProgress, formatStreak } from "@/hooks/useProgress";
import { useSettings } from "@/hooks/useSettings";

export function GreetingBanner() {
  const g = useGreeting();
  const { progress, activeProfile } = useProgress();
  const completedCount = CATEGORIES.filter(c => c.state === "complete" || c.state === "active").length;

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Left: fox + greeting */}
      <div className="flex items-center gap-3">
        <motion.span
          className="text-4xl sm:text-5xl select-none leading-none"
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          🦊
        </motion.span>
        <div>
          <p
            className="text-sm sm:text-base font-semibold leading-tight"
            style={{ fontFamily: "'Nunito',sans-serif", color: C.mutedFg }}
          >
            {g.emoji} {g.text}!
          </p>
          <p
            className="text-xl sm:text-2xl lg:text-3xl leading-tight font-bold"
            style={{ fontFamily: "'Fredoka',sans-serif", color: C.navy }}
          >
            {activeProfile.name || "Little Explorer"}, what shall we learn? ✨
          </p>
        </div>
      </div>

      {/* Right: quick stats pills — solid white cards for guaranteed contrast */}
      <div className="hidden sm:flex items-center gap-2">
        {[
          { emoji:"🎯", value:`${completedCount}/${CATEGORIES.length}`,  label:"Unlocked", valueColor: C.blue   },
          { emoji:"🔥", value:formatStreak(progress.streakDays),         label:"Streak",   valueColor: C.orange },
          { emoji:"⭐", value:String(progress.starsTotal),               label:"Stars",    valueColor: "#CC9F00" },
        ].map(s => (
          <div
            key={s.label}
            className="px-3 py-2 rounded-2xl flex items-center gap-2"
            style={{ background: C.white, border: `2.5px solid ${C.navy}`, boxShadow: `3px 4px 0 ${C.navy}` }}
          >
            <span className="text-base leading-none">{s.emoji}</span>
            <div>
              <p style={{ fontFamily:"'Fredoka',sans-serif", fontWeight:700, color:s.valueColor, fontSize:15, lineHeight:1.1 }}>
                {s.value}
              </p>
              <p style={{ fontFamily:"'Nunito',sans-serif", color:C.mutedFg, fontSize:11 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
