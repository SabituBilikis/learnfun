import { motion, AnimatePresence } from "motion/react";
import { X, Volume2, VolumeX } from "lucide-react";
import { C } from "@/app/constants";
import { useSettings } from "@/hooks/useSettings";

export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const soundEnabled = useSettings(s => s.soundEnabled);
  const toggleSound = useSettings(s => s.toggleSound);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ fontFamily: "'Nunito',sans-serif" }}
        >
          <motion.div
            className="relative w-[90%] max-w-sm rounded-3xl flex flex-col overflow-hidden"
            style={{
              background: C.white,
              border: `4px solid ${C.navy}`,
              boxShadow: `0 8px 32px rgba(26,0,80,0.2), 0 12px 0 ${C.navy}`
            }}
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 flex items-center justify-between" style={{ background: C.purple, borderBottom: `3px solid ${C.navy}` }}>
              <h2 style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 700, fontSize: 24, color: C.white }}>
                Settings
              </h2>
              <button 
                onClick={onClose}
                className="rounded-full p-1 cursor-pointer flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ background: "rgba(255,255,255,0.2)", color: C.white }}
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5">
              
              {/* Child Profile */}
              <div className="flex flex-col gap-2">
                <label className="font-fredoka font-bold text-lf-navy text-lg">
                  Child's Name
                </label>
                <input
                  type="text"
                  value={useSettings((s) => s.childName)}
                  onChange={(e) => useSettings.getState().setChildName(e.target.value)}
                  placeholder="e.g. Lily"
                  maxLength={12}
                  className="w-full px-4 py-3 rounded-2xl outline-none"
                  style={{
                    background: C.muted,
                    border: `3px solid ${C.navy}`,
                    fontFamily: "'Fredoka',sans-serif",
                    fontSize: 18,
                    color: C.navy,
                    boxShadow: `inset 0 2px 4px rgba(0,0,0,0.05)`,
                  }}
                />
              </div>

              {/* Sound Toggle */}
              <div 
                onClick={toggleSound}
                className="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-transform hover:-translate-y-1 active:translate-y-0"
                style={{
                  background: soundEnabled ? C.green : C.muted,
                  border: `3px solid ${C.navy}`,
                  boxShadow: `0 4px 0 ${C.navy}`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded-xl w-10 h-10" style={{ background: "rgba(255,255,255,0.2)", color: C.navy }}>
                    {soundEnabled ? <Volume2 size={22} strokeWidth={2.5} /> : <VolumeX size={22} strokeWidth={2.5} />}
                  </div>
                  <span style={{ fontFamily: "'Fredoka',sans-serif", fontWeight: 600, fontSize: 18, color: C.navy }}>
                    Sound Effects
                  </span>
                </div>
                
                {/* Toggle Switch */}
                <div className="relative rounded-full w-12 h-6 flex items-center transition-colors duration-300 px-1" style={{ background: soundEnabled ? C.navy : "rgba(26,0,80,0.2)" }}>
                  <motion.div 
                    className="rounded-full bg-white h-4 w-4 shadow-sm"
                    animate={{ x: soundEnabled ? 24 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
