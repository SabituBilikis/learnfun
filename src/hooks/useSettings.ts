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
const ALLOWED_SCREEN_LIMITS = new Set([0, 15, 30, 45, 60]);
const MAX_DAILY_SECONDS = 24 * 60 * 60;

interface PersistedSettings {
  soundEnabled: boolean;
  screenTimeLimit: number;
  timePlayedToday: number;
  lastPlayedDate: string;
  childName: string;
}

function localDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function safeChildName(value: unknown): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 40) : "";
}

export function sanitizeSettings(raw: unknown, today: string = localDateString()): PersistedSettings {
  const defaults: PersistedSettings = {
    soundEnabled: true,
    screenTimeLimit: 0,
    timePlayedToday: 0,
    lastPlayedDate: today,
    childName: "",
  };
  if (typeof raw !== "object" || raw === null) return defaults;
  const candidate = raw as Record<string, unknown>;
  const lastPlayedDate = typeof candidate.lastPlayedDate === "string" ? candidate.lastPlayedDate : today;
  return {
    soundEnabled: typeof candidate.soundEnabled === "boolean" ? candidate.soundEnabled : defaults.soundEnabled,
    screenTimeLimit: typeof candidate.screenTimeLimit === "number" && ALLOWED_SCREEN_LIMITS.has(candidate.screenTimeLimit)
      ? candidate.screenTimeLimit
      : defaults.screenTimeLimit,
    timePlayedToday: lastPlayedDate === today && typeof candidate.timePlayedToday === "number" && Number.isInteger(candidate.timePlayedToday)
      ? Math.min(Math.max(candidate.timePlayedToday, 0), MAX_DAILY_SECONDS)
      : 0,
    lastPlayedDate: today,
    childName: safeChildName(candidate.childName),
  };
}

function loadSettings(): PersistedSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? sanitizeSettings(JSON.parse(stored)) : sanitizeSettings(null);
  } catch {
    return sanitizeSettings(null);
  }
}

export const useSettings = create<SettingsState>((set) => {
  const initial = typeof window === "undefined" ? sanitizeSettings(null) : loadSettings();

  return {
    soundEnabled: initial.soundEnabled,
    screenTimeLimit: initial.screenTimeLimit,
    timePlayedToday: initial.timePlayedToday,
    lastPlayedDate: initial.lastPlayedDate,
    childName: initial.childName,
    toggleSound: () =>
      set((state) => {
        const next = !state.soundEnabled;
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...state, soundEnabled: next }));
        } catch {}
        return { soundEnabled: next };
      }),
    setScreenTimeLimit: (limit) => 
      set((state) => {
        if (!ALLOWED_SCREEN_LIMITS.has(limit)) return state;
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...state, screenTimeLimit: limit }));
        } catch {}
        return { screenTimeLimit: limit };
      }),
    incrementTimePlayed: (seconds) =>
      set((state) => {
        if (!Number.isInteger(seconds) || seconds < 0) return state;
        const today = localDateString();
        const isNewDay = state.lastPlayedDate !== today;
        const newTime = Math.min(isNewDay ? seconds : state.timePlayedToday + seconds, MAX_DAILY_SECONDS);
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ 
            ...state, 
            timePlayedToday: newTime,
            lastPlayedDate: today
          }));
        } catch {}
        return { timePlayedToday: newTime, lastPlayedDate: today };
      }),
    setChildName: (name) =>
      set((state) => {
        const childName = safeChildName(name);
        try {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...state, childName }));
        } catch {}
        return { childName };
      }),
  };
});
