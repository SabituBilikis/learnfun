import { describe, expect, test } from "vitest";
import { sanitizeSettings } from "./useSettings";

describe("sanitizeSettings", () => {
  test("accepts only supported limits and bounded local values", () => {
    const result = sanitizeSettings({
      soundEnabled: false,
      screenTimeLimit: 30,
      timePlayedToday: 120,
      lastPlayedDate: "2026-07-23",
      childName: "  Ada  ",
    }, "2026-07-23");

    expect(result).toMatchObject({
      soundEnabled: false,
      screenTimeLimit: 30,
      timePlayedToday: 120,
      childName: "Ada",
    });
  });

  test("resets invalid limits and stale daily time", () => {
    const result = sanitizeSettings({
      screenTimeLimit: 999,
      timePlayedToday: 999_999,
      lastPlayedDate: "2026-07-22",
    }, "2026-07-23");

    expect(result.screenTimeLimit).toBe(0);
    expect(result.timePlayedToday).toBe(0);
    expect(result.lastPlayedDate).toBe("2026-07-23");
  });
});
