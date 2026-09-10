import type { Category, CardState } from "@/app/constants";
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

/** Determines whether a category is unlocked based on index, previous completion, or existing progress. */
export function isCategoryUnlocked(index: number, categories: Category[], progress: UserProgress): boolean {
  if (index < 4) return true; // First 4 categories always unlocked
  const currentCat = categories[index];
  if (!currentCat) return false;

  // Unlocked if user has existing progress in this category
  const currentDone =
    currentCat.id === "alphabet" ? progress.lettersLearned
    : currentCat.id === "numbers" ? progress.numbersLearned
    : (progress.catProgress[currentCat.id] ?? 0);
  if (currentDone > 0) return true;

  // Unlocked if previous category is 100% complete
  const prevCat = categories[index - 1];
  if (prevCat && categoryPercent(prevCat, progress) === 100) return true;

  // Unlocked if any subsequent category has progress
  for (let j = index + 1; j < categories.length; j++) {
    const subCat = categories[j];
    const subDone =
      subCat.id === "alphabet" ? progress.lettersLearned
      : subCat.id === "numbers" ? progress.numbersLearned
      : (progress.catProgress[subCat.id] ?? 0);
    if (subDone > 0) return true;
  }

  return false;
}

/** Determines dynamic CardState ("locked" | "complete" | "active" | "new") */
export function getCategoryState(index: number, categories: Category[], progress: UserProgress): CardState {
  const unlocked = isCategoryUnlocked(index, categories, progress);
  if (!unlocked) return "locked";
  const pct = categoryPercent(categories[index], progress);
  if (pct === 100) return "complete";
  if (pct > 0) return "active";
  return "new";
}

/** Counts total unlocked categories */
export function getUnlockedCategoryCount(categories: Category[], progress: UserProgress): number {
  return categories.filter((_, i) => isCategoryUnlocked(i, categories, progress)).length;
}

/** Calculate total earned stars based on completed lesson progress */
export function calculateEarnedStars(categories: Category[], progress: UserProgress): number {
  let earned = 0;
  // Alphabet: 3 stars per letter
  earned += (progress.lettersLearned ?? 0) * 3;
  // Numbers: 3 stars per number
  earned += (progress.numbersLearned ?? 0) * 3;
  // Other categories
  for (const cat of categories) {
    if (cat.id === "alphabet" || cat.id === "numbers") continue;
    const done = progress.catProgress[cat.id] ?? 0;
    const starsPerLesson = cat.id === "phonics" ? 5 : 3;
    earned += done * starsPerLesson;
  }
  return earned;
}

/** Parse a route index param, clamped to [0, max). Bad input falls back to 0. */
export function parseIndexParam(raw: string | undefined, max: number): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 && n < max ? n : 0;
}
