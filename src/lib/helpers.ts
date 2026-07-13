import type { Category } from "@/app/constants";
import type { UserProgress } from "@/lib/progress";

/** Real completion percent for a home card, derived from persisted progress
 *  instead of the design-time placeholder in CATEGORIES. */
export function categoryPercent(cat: Category, progress: UserProgress): number {
  const done =
    cat.id === "alphabet" ? progress.lettersLearned
    : cat.id === "numbers" ? progress.numbersLearned
    : (progress.catProgress[cat.id] ?? 0);
  return Math.min(100, Math.round((done / cat.lessons) * 100));
}

/** Parse a route index param, clamped to [0, max). Bad input falls back to 0. */
export function parseIndexParam(raw: string | undefined, max: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n < max ? n : 0;
}
