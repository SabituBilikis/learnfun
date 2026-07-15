import { create } from "zustand";

interface SettingsState {
  soundEnabled: boolean;
  toggleSound: () => void;
  screenTimeLimit: number; // 0 means no limit, otherwise in minutes
  setScreenTimeLimit: (limit: number) => void;
  timePlayedToday: number; // in seconds
  incrementTimePlayed: (seconds: number) => void;
  lastPlayedDate: string;
  childName: string;
  setChildName: (name: string) => void;
}

const SETTINGS_KEY = "learnfun_settings";

export const useSettings = create<SettingsState>((set) => {
  let initialSound = true;
  let initialScreenTimeLimit = 0;
  let initialTimePlayedToday = 0;
  let initialLastPlayedDate = new Date().toISOString().split("T")[0];
  let initialChildName = "";

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.soundEnabled === "boolean") initialSound = parsed.soundEnabled;
        if (typeof parsed.screenTimeLimit === "number") initialScreenTimeLimit = parsed.screenTimeLimit;
        if (typeof parsed.timePlayedToday === "number") initialTimePlayedToday = parsed.timePlayedToday;
        if (typeof parsed.lastPlayedDate === "string") initialLastPlayedDate = parsed.lastPlayedDate;
        if (typeof parsed.childName === "string") initialChildName = parsed.childName;
        
        // Reset time played if it's a new day
        const today = new Date().toISOString().split("T")[0];
        if (initialLastPlayedDate !== today) {
          initialTimePlayedToday = 0;
          initialLastPlayedDate = today;
        }
      }
    } catch (e) {
      console.warn("Failed to parse settings", e);
    }
  }

  return {
    soundEnabled: initialSound,
    screenTimeLimit: initialScreenTimeLimit,
    timePlayedToday: initialTimePlayedToday,
    lastPlayedDate: initialLastPlayedDate,
    childName: initialChildName,
    toggleSound: () =>
      set((state) => {
        const next = !state.soundEnabled;
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...state, soundEnabled: next }));
        } catch (e) {}
        return { soundEnabled: next };
      }),
    setScreenTimeLimit: (limit) => 
      set((state) => {
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...state, screenTimeLimit: limit }));
        } catch (e) {}
        return { screenTimeLimit: limit };
      }),
    incrementTimePlayed: (seconds) =>
      set((state) => {
        const today = new Date().toISOString().split("T")[0];
        const isNewDay = state.lastPlayedDate !== today;
        const newTime = isNewDay ? seconds : state.timePlayedToday + seconds;
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ 
            ...state, 
            timePlayedToday: newTime,
            lastPlayedDate: today
          }));
        } catch (e) {}
        return { timePlayedToday: newTime, lastPlayedDate: today };
      }),
    setChildName: (name) =>
      set((state) => {
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...state, childName: name }));
        } catch (e) {}
        return { childName: name };
      }),
  };
});
