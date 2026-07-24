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
const MAX_PROFILES = 10;
const MAX_STARS = 1_000_000;
const MAX_STREAK_DAYS = 100_000;
const MAX_CATEGORY_PROGRESS = 1_000;
const MAX_CATEGORY_ENTRIES = 20;
const SAFE_PROFILE_ID = /^[a-zA-Z0-9_-]{1,64}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

function isFiniteWholeNumber(value: unknown, maximum: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= maximum;
}

function isSafeProfileId(value: string): boolean {
  return SAFE_PROFILE_ID.test(value) && value !== "__proto__" && value !== "constructor" && value !== "prototype";
}

function isValidIsoDate(value: unknown): value is string {
  return typeof value === "string" && ISO_DATE.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());
}

export function sanitizeProfileName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const name = value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, 40);
  return name ? name : null;
}

function sanitizeAvatar(value: unknown): string {
  return typeof value === "string" && value.length > 0 && value.length <= 16 ? value : "🐯";
}

/** Accepts only fields with the right shape, so corrupt or tampered
 *  localStorage can never crash the app or inject bad values. */
export function sanitizeProgress(raw: unknown): UserProgress {
  const base = defaultProgress();
  if (typeof raw !== "object" || raw === null) return base;
  const candidate = raw as Record<string, unknown>;

  if (isFiniteWholeNumber(candidate.lettersLearned, 26)) base.lettersLearned = candidate.lettersLearned;
  if (isFiniteWholeNumber(candidate.numbersLearned, 20)) base.numbersLearned = candidate.numbersLearned;
  if (isFiniteWholeNumber(candidate.starsTotal, MAX_STARS)) base.starsTotal = candidate.starsTotal;
  if (isFiniteWholeNumber(candidate.streakDays, MAX_STREAK_DAYS)) base.streakDays = candidate.streakDays;
  if (isValidIsoDate(candidate.lastSeen)) base.lastSeen = candidate.lastSeen;
  if (typeof candidate.catProgress === "object" && candidate.catProgress !== null) {
    for (const [id, count] of Object.entries(candidate.catProgress).slice(0, MAX_CATEGORY_ENTRIES)) {
      if (isSafeProfileId(id) && isFiniteWholeNumber(count, MAX_CATEGORY_PROGRESS)) base.catProgress[id] = count;
    }
  }
  return base;
}

export function sanitizeProfilesState(raw: unknown): ProfilesState {
  if (typeof raw !== "object" || raw === null) return defaultProfilesState();
  const candidate = raw as Record<string, unknown>;
  if (typeof candidate.profiles !== "object" || candidate.profiles === null) return defaultProfilesState();

  const profiles: Record<string, Profile> = Object.create(null) as Record<string, Profile>;
  for (const [id, rawProfile] of Object.entries(candidate.profiles).slice(0, MAX_PROFILES)) {
    if (!isSafeProfileId(id) || typeof rawProfile !== "object" || rawProfile === null) continue;
    const profile = rawProfile as Record<string, unknown>;
    const name = sanitizeProfileName(profile.name);
    if (!name) continue;
    profiles[id] = {
      id,
      name,
      avatar: sanitizeAvatar(profile.avatar),
      progress: sanitizeProgress(profile.progress),
    };
  }

  const profileIds = Object.keys(profiles);
  if (profileIds.length === 0) return defaultProfilesState();
  const activeProfileId = typeof candidate.activeProfileId === "string" && profiles[candidate.activeProfileId]
    ? candidate.activeProfileId
    : profileIds[0];
  return { activeProfileId, profiles };
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
      return sanitizeProfilesState(parsed);
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
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(sanitizeProfilesState(state)));
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
