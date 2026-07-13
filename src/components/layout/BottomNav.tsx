import { useState } from "react";
import { motion } from "motion/react";
import { Home, BookOpen, Gamepad2, Trophy, Users } from "lucide-react";
import { C } from "@/app/constants";

const TABS = [
  { id: "home",    Icon: Home,     label: "Home",    color: C.red    },
  { id: "learn",   Icon: BookOpen, label: "Learn",   color: C.blue   },
  { id: "games",   Icon: Gamepad2, label: "Games",   color: C.green  },
  { id: "rewards", Icon: Trophy,   label: "Rewards", color: C.yellow },
  { id: "parent",  Icon: Users,    label: "Parent",  color: C.purple },
];

export function BottomNav({ onGames, onRewards, onLearn, onParent }: { onGames?: () => void; onRewards?: () => void; onLearn?: () => void; onParent?: () => void }) {
  const [active, setActive] = useState("home");
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-30"
      style={{
        padding: "6px 12px 8px",
        background: "rgba(255,255,255,0.97)",
        borderTop: `3px solid ${C.navy}`,
        boxShadow: "0 -4px 20px rgba(26,0,80,0.12)",
      }}
    >
      <div className="flex justify-around max-w-lg mx-auto">
        {TABS.map(({ id, Icon, label, color }) => {
          const isActive = active === id;
          return (
            <motion.button
              key={id}
              onClick={() => {
                setActive(id);
                if (id === "games"   && onGames)   onGames();
                if (id === "rewards" && onRewards)  onRewards();
                if (id === "learn"   && onLearn)    onLearn();
                if (id === "parent"  && onParent)   onParent();
              }}
              className="flex flex-col items-center gap-0.5 rounded-2xl"
              style={{
                padding: "6px 12px 4px",
                background: isActive ? C.muted : "transparent",
                minWidth: 56,
              }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: isActive ? color : C.muted,
                  border:     isActive ? `2.5px solid ${C.navy}` : "2.5px solid transparent",
                  boxShadow:  isActive ? `2px 3px 0 ${C.navy}` : "none",
                }}
                animate={isActive ? { scale: [1, 1.14, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Icon size={17} style={{ color: isActive ? C.white : C.mutedFg }} />
              </motion.div>
              <span
                style={{
                  fontFamily: "'Fredoka',sans-serif", fontWeight: 700,
                  fontSize: 11,
                  color: isActive ? color : C.mutedFg,
                }}
              >
                {label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
