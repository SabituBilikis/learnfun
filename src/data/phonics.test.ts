import { existsSync } from "node:fs";
import { describe, expect, test } from "vitest";
import phonicsData from "./phonics.json";

describe("phonics content", () => {
  test("defines the complete six-letter learning path", () => {
    expect(phonicsData.map((item) => item.id)).toEqual(["a", "b", "c", "m", "s", "t"]);
    expect(new Set(phonicsData.map((item) => item.letter)).size).toBe(phonicsData.length);

    for (const item of phonicsData) {
      expect(item.phoneme).not.toBe("");
      expect(item.primary.speechText).not.toBe("");
      expect(item.examples).toHaveLength(4);
      expect(new Set(item.examples.map((example) => example.word)).size).toBe(4);
      expect(item.examples.every((example) => example.speechText.length > 0)).toBe(true);
    }
  });

  test("references only bundled phoneme audio", () => {
    for (const item of phonicsData) {
      if (item.phonemeAudio) {
        expect(existsSync(`public${item.phonemeAudio}`)).toBe(true);
      }
    }
  });
});
