import { describe, expect, it } from "vitest";
import { CATEGORIES, LETTERS, LETTER_COLORS_FULL, LETTER_DARKS } from "./constants";

describe("lesson constants", () => {
  it("has the full alphabet", () => {
    expect(LETTERS).toHaveLength(26);
    expect(LETTERS[0].l).toBe("A");
    expect(LETTERS[25].l).toBe("Z");
  });

  it("has a color pair for every letter", () => {
    expect(LETTER_COLORS_FULL).toHaveLength(LETTERS.length);
    expect(LETTER_DARKS).toHaveLength(LETTERS.length);
  });

  it("has unique category ids", () => {
    const ids = CATEGORIES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
