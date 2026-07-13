// Persistent learning progress — the single source of truth for stars,
// streaks, and per-category completion. Stored in localStorage.

export interface UserProgress {
  lettersLearned: number;
  numbersLearned: number;
  catProgress: Record<string, number>;
  starsTotal: number;
  streakDays: number;
  lastSeen: string;
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  progress: UserProgress;
}

export interface ProfilesState {
  activeProfileId: string;
  profiles: Record<string, Profile>;
}

export const PROGRESS_KEY = "learnfun_profiles";

export function defaultProgress(): UserProgress {
  return {
    lettersLearned: 0,
    numbersLearned: 0,
    catProgress: {},
    starsTotal: 0,
    streakDays: 0,
    lastSeen: "",
  };
}

function isFiniteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

/** Accepts only fields with the right shape, so corrupt or tampered
 *  localStorage can never crash the app or inject bad values. */
export function sanitizeProgress(raw: unknown): UserProgress {
  const base = defaultProgress();
  if (typeof raw !== "object" || raw === null) return base;
  const candidate = raw as Record<string, unknown>;

  if (isFiniteNonNegative(candidate.lettersLearned)) base.lettersLearned = candidate.lettersLearned;
  if (isFiniteNonNegative(candidate.numbersLearned)) base.numbersLearned = candidate.numbersLearned;
  if (isFiniteNonNegative(candidate.starsTotal)) base.starsTotal = candidate.starsTotal;
  if (isFiniteNonNegative(candidate.streakDays)) base.streakDays = candidate.streakDays;
  if (typeof candidate.lastSeen === "string") base.lastSeen = candidate.lastSeen;
  if (typeof candidate.catProgress === "object" && candidate.catProgress !== null) {
    for (const [id, count] of Object.entries(candidate.catProgress)) {
      if (isFiniteNonNegative(count)) base.catProgress[id] = count;
    }
  }
  return base;
}

export function defaultProfilesState(): ProfilesState {
  const defaultProfileId = "default";
  return {
    activeProfileId: defaultProfileId,
    profiles: {
      [defaultProfileId]: {
        id: defaultProfileId,
        name: "Child",
        avatar: "🐯",
        progress: defaultProgress(),
      }
    }
  };
}

export function loadProfiles(): ProfilesState {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Basic migration/sanitization
      if (parsed.activeProfileId && parsed.profiles) {
        return parsed as ProfilesState;
      }
    }
  } catch {}
  
  // Try to migrate old single-profile save
  try {
    const oldRaw = localStorage.getItem("learnfun_progress");
    if (oldRaw) {
      const oldProgress = sanitizeProgress(JSON.parse(oldRaw));
      const state = defaultProfilesState();
      state.profiles["default"].progress = oldProgress;
      return state;
    }
  } catch {}

  return defaultProfilesState();
}

export function saveProfiles(state: ProfilesState): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state));
  } catch {}
}

export function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Advances the daily streak: same day keeps it, a visit on the next
 *  calendar day extends it, any gap restarts at 1. */
export function withDailyStreak(progress: UserProgress, now: Date = new Date()): UserProgress {
  const today = toLocalDateString(now);
  if (progress.lastSeen === today) return progress;

  const yesterday = toLocalDateString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
  const streakDays = progress.lastSeen === yesterday ? progress.streakDays + 1 : 1;
  return { ...progress, streakDays, lastSeen: today };
}
