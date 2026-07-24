import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Lock } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { ParentGate } from "@/features/parent/ParentGate";

const PARENT_UNLOCK_DURATION_MS = 15 * 60 * 1000;

export function ScreenTimeEnforcer() {
  const { screenTimeLimit, timePlayedToday, incrementTimePlayed } = useSettings();
  const [showGate, setShowGate] = useState(false);
  const [unlockedUntil, setUnlockedUntil] = useState(0);

  // Track time
  useEffect(() => {
    const interval = setInterval(() => {
      incrementTimePlayed(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [incrementTimePlayed]);

  const isLocked = Date.now() >= unlockedUntil && screenTimeLimit > 0 && timePlayedToday >= screenTimeLimit * 60;

  if (!isLocked) return null;

  if (showGate) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#1A0050]/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm">
          <ParentGate 
            onSuccess={() => {
              setUnlockedUntil(Date.now() + PARENT_UNLOCK_DURATION_MS);
              setShowGate(false);
            }} 
            onBack={() => setShowGate(false)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1A0050]/95 backdrop-blur-md flex flex-col items-center justify-center font-fredoka p-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] p-8 max-w-sm w-full flex flex-col items-center border-4 border-white/20 shadow-2xl"
      >
        <span className="text-7xl mb-4">⏰</span>
        <h2 className="text-3xl font-bold text-[#1A0050] mb-2">Time's Up!</h2>
        <p className="font-nunito font-semibold text-lg text-gray-500 mb-8">
          You've played for {screenTimeLimit} minutes today. A parent can add 15 more minutes.
        </p>
        
        <button
          onClick={() => setShowGate(true)}
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-400 font-bold text-lg transition-colors"
        >
          <Lock size={18} />
          Parent Unlock
        </button>
      </motion.div>
    </div>
  );
}
