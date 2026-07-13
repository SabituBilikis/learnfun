import { beforeEach, describe, expect, test } from "vitest";
import {
  defaultProfilesState,
  loadProfiles,
  sanitizeProgress,
  saveProfiles,
  withDailyStreak,
  defaultProgress,
} from "./progress";

describe("progress persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("loadProfiles returns default state when storage is empty", () => {
    const loaded = loadProfiles();
    expect(loaded.profiles["default"]).toBeDefined();
    expect(loaded.profiles["default"].progress.lettersLearned).toBe(0);
    expect(loaded.profiles["default"].progress.starsTotal).toBe(0);
  });

  test("saveProfiles and loadProfiles work together", () => {
    const state = defaultProfilesState();
    state.profiles["default"].progress.starsTotal = 15;
    saveProfiles(state);
    
    const loaded = loadProfiles();
    expect(loaded.profiles["default"].progress.starsTotal).toBe(15);
  });
});

describe("sanitizeProgress", () => {
  test("returns defaults for junk input", () => {
    expect(sanitizeProgress(null)).toEqual(defaultProgress());
    expect(sanitizeProgress("nope")).toEqual(defaultProgress());
    expect(sanitizeProgress(42)).toEqual(defaultProgress());
  });

  test("drops fields with wrong types and keeps valid ones", () => {
    const result = sanitizeProgress({
      lettersLearned: 5,
      numbersLearned: "ten",
      starsTotal: -3,
      catProgress: { shapes: 2, colors: "done" },
    });
    expect(result.lettersLearned).toBe(5);
    expect(result.numbersLearned).toBe(0);
    expect(result.starsTotal).toBe(0);
    expect(result.catProgress).toEqual({ shapes: 2 });
  });
});

describe("withDailyStreak", () => {
  const TODAY = new Date(2024, 0, 15);

  test("starts at 1 for a new user", () => {
    const prog = defaultProgress();
    const updated = withDailyStreak(prog, TODAY);
    expect(updated.streakDays).toBe(1);
    expect(updated.lastSeen).toBe("2024-01-15");
  });

  test("keeps streak same if played twice in one day", () => {
    const prog = defaultProgress();
    prog.lastSeen = "2024-01-15";
    prog.streakDays = 5;
    const updated = withDailyStreak(prog, TODAY);
    expect(updated.streakDays).toBe(5);
  });

  test("increments streak if played the next calendar day", () => {
    const prog = defaultProgress();
    prog.lastSeen = "2024-01-14";
    prog.streakDays = 5;
    const updated = withDailyStreak(prog, TODAY);
    expect(updated.streakDays).toBe(6);
    expect(updated.lastSeen).toBe("2024-01-15");
  });

  test("resets streak to 1 if a day was skipped", () => {
    const prog = defaultProgress();
    prog.lastSeen = "2023-12-25";
    prog.streakDays = 100;
    const updated = withDailyStreak(prog, TODAY);
    expect(updated.streakDays).toBe(1);
  });
});
