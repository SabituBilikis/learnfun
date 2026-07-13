import { useState } from "react";
import { ChevronLeft, Users, Settings, BarChart2, Plus, Trash2 } from "lucide-react";
import { C } from "@/app/constants";
import { useSettings } from "@/hooks/useSettings";
import { useProgress } from "@/hooks/useProgress";
import { CATEGORIES } from "@/app/constants";
import { motion } from "motion/react";

export function ParentDashboard({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"profiles" | "analytics" | "settings">("settings");
  const { soundEnabled, toggleSound, screenTimeLimit, setScreenTimeLimit, timePlayedToday } = useSettings();
  const { state, activeProfile, switchProfile, addProfile, deleteProfile, updateProgress } = useProgress();

  const handleWipeData = () => {
    if (confirm("Are you sure you want to delete this profile's progress? This cannot be undone.")) {
      updateProgress((p) => ({
        ...p, lettersLearned: 0, numbersLearned: 0, catProgress: {}, starsTotal: 0, streakDays: 0,
      }));
      alert("Progress wiped for this profile.");
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F3EEFF] font-fredoka text-lf-navy overflow-hidden">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center gap-4 p-4 bg-white border-b-2 border-gray-100 shadow-sm">
        <motion.button 
          onClick={onBack} 
          className="p-2 flex items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200 text-lf-navy"
          whileHover={{ scale:1.05 }} whileTap={{ scale:0.94 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h1 className="text-2xl font-bold">Parent Dashboard</h1>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 bg-white border-b-[3px] border-gray-200 shadow-sm">
        <TabButton active={tab === "profiles"} onClick={() => setTab("profiles")} icon={<Users size={18} />} label="Profiles" />
        <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")} icon={<BarChart2 size={18} />} label="Analytics" />
        <TabButton active={tab === "settings"} onClick={() => setTab("settings")} icon={<Settings size={18} />} label="Settings" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F3EEFF]">
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
          
          {tab === "profiles" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Manage Profiles</h2>
              <div className="grid gap-4">
                {Object.values(state.profiles).map((p) => (
                  <div key={p.id} className={`flex items-center justify-between p-4 rounded-3xl bg-white border-4 ${state.activeProfileId === p.id ? 'border-lf-teal shadow-[4px_6px_0_var(--color-lf-teal)]' : 'border-gray-200 shadow-sm'}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-5xl">{p.avatar}</span>
                      <div>
                        <h3 className="font-bold text-xl">{p.name}</h3>
                        <p className="font-nunito text-sm text-gray-500 font-bold">{p.progress.starsTotal} Stars Earned</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {state.activeProfileId !== p.id && (
                        <button onClick={() => switchProfile(p.id)} className="px-5 py-2.5 rounded-2xl bg-lf-teal/10 text-lf-teal font-bold hover:bg-lf-teal/20 transition-colors">Select</button>
                      )}
                      {Object.keys(state.profiles).length > 1 && (
                        <button onClick={() => { if(confirm("Delete this profile?")) deleteProfile(p.id); }} className="p-3 rounded-2xl text-red-500 bg-red-50 hover:bg-red-100 transition-colors"><Trash2 size={20} /></button>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => {
                    const name = prompt("Enter child's name:");
                    if (name) {
                      const emojis = ["🚀","🌟","🦁","🦄","🦊","🐰","🐻","🐬","🦋","⚽"];
                      addProfile(name, emojis[Math.floor(Math.random() * emojis.length)]);
                    }
                  }}
                  className="flex items-center justify-center gap-2 p-5 rounded-3xl border-4 border-dashed border-gray-300 text-gray-500 font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer bg-white/50"
                >
                  <Plus size={24} /> Add Profile
                </button>
              </div>
            </div>
          )}

          {tab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-4xl">{activeProfile.avatar}</span> {activeProfile.name}'s Learning
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Stars" value={activeProfile.progress.starsTotal} icon="⭐" color={C.yellow} />
                <StatCard label="Day Streak" value={activeProfile.progress.streakDays} icon="🔥" color={C.orange} />
                <StatCard label="Letters Learned" value={`${activeProfile.progress.lettersLearned}/26`} icon="🔤" color={C.red} />
                <StatCard label="Numbers Learned" value={`${activeProfile.progress.numbersLearned}/20`} icon="🔢" color={C.blue} />
              </div>

              <div className="bg-white p-6 rounded-3xl border-4 border-gray-200 shadow-sm">
                <h3 className="text-xl font-bold mb-5">Category Progress</h3>
                <div className="space-y-5">
                  {CATEGORIES.map(c => {
                    // Only show progress for unlocked categories or if they have some progress
                    if (c.state === "locked" && !activeProfile.progress.catProgress[c.id]) return null;
                    const pct = activeProfile.progress.catProgress[c.id] || 0;
                    return (
                      <div key={c.id}>
                        <div className="flex justify-between text-base font-bold mb-1.5">
                          <span className="flex items-center gap-2"><span>{c.emoji}</span> {c.title}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-4 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shadow-inner">
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${pct}%`, backgroundColor: c.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">App Settings</h2>
              
              <div className="bg-white p-6 rounded-3xl border-4 border-gray-200 shadow-sm space-y-6">
                
                {/* Audio */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold">Sound & Voiceovers</h3>
                    <p className="font-nunito text-gray-500">Enable spoken instructions and sound effects.</p>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`relative w-16 h-9 rounded-full transition-colors border-2 shadow-inner ${soundEnabled ? 'bg-lf-green border-lf-green' : 'bg-gray-300 border-gray-300'}`}
                  >
                    <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>

                <div className="w-full h-[2px] bg-gray-100" />

                {/* Screen Time */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold">Daily Screen Time Limit</h3>
                    <span className="font-nunito font-bold text-lf-navy bg-gray-100 px-3 py-1 rounded-xl">
                      {screenTimeLimit === 0 ? "Unlimited" : `${screenTimeLimit} mins`}
                    </span>
                  </div>
                  <p className="font-nunito text-gray-500 mb-4">
                    App will lock automatically when the limit is reached.
                    <br/><span className="text-lf-teal font-bold">(Played today: {Math.floor(timePlayedToday / 60)} mins)</span>
                  </p>
                  
                  <div className="flex gap-2 flex-wrap">
                    {[0, 15, 30, 45, 60].map(limit => (
                      <button
                        key={limit}
                        onClick={() => setScreenTimeLimit(limit)}
                        className={`px-5 py-2.5 rounded-2xl font-bold text-base transition-colors ${screenTimeLimit === limit ? 'bg-lf-teal text-white shadow-[2px_3px_0_#009B94] border-2 border-lf-teal' : 'bg-gray-100 text-gray-500 border-2 border-transparent hover:bg-gray-200'}`}
                      >
                        {limit === 0 ? "Off" : limit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-[2px] bg-gray-100" />
                
                {/* Data */}
                <div>
                  <h3 className="text-lg font-bold text-red-500 mb-1">Danger Zone</h3>
                  <p className="font-nunito text-gray-500 mb-4">Wipe all progress for the current profile.</p>
                  <button 
                    onClick={handleWipeData}
                    className="px-6 py-3 rounded-2xl bg-red-100 text-red-600 font-bold hover:bg-red-200 transition-colors border-2 border-red-200"
                  >
                    Reset Progress
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function TabButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 p-5 font-bold text-lg transition-colors ${active ? 'text-lf-teal border-b-4 border-lf-teal bg-lf-teal/5' : 'text-gray-400 hover:bg-gray-50 border-b-4 border-transparent'}`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <div className="bg-white p-5 rounded-3xl border-4 border-gray-200 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold" style={{ color }}>{value}</div>
        <div className="font-nunito text-sm text-gray-500 font-bold uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );
}
