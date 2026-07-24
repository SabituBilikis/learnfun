import { beforeEach, describe, expect, test } from "vitest";
import { createParentPin, readParentSecurity, verifyParentPin } from "./parentSecurity";

describe("parent PIN security", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("stores a verifier and accepts only the configured PIN", async () => {
    await createParentPin("123456");
    const record = readParentSecurity();
    expect(record?.pinHash).not.toBe("123456");

    const incorrect = await verifyParentPin("123457");
    expect(incorrect.success).toBe(false);
    expect(incorrect.attemptsRemaining).toBe(4);

    const correct = await verifyParentPin("123456");
    expect(correct.success).toBe(true);
  });
});
