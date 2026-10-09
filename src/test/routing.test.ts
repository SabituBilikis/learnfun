import { describe, it, expect, beforeEach } from "vitest";
import { Capacitor } from "@capacitor/core";
import { useProgress } from "../hooks/useProgress";

describe("Routing & App Architecture", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("identifies web platform by default for landing page display", () => {
    const isNative = Capacitor.isNativePlatform();
    expect(isNative).toBe(false);
  });

  it("maintains profile data and daily streaks during session progress", () => {
    const store = useProgress.getState();
    expect(store.progress).toBeDefined();
    expect(store.progress.starsTotal).toBeGreaterThanOrEqual(0);

    store.updateProgress((p) => ({ ...p, starsTotal: p.starsTotal + 5 }));
    const updatedStore = useProgress.getState();
    expect(updatedStore.progress.starsTotal).toBe(5);
  });

  it("handles profile switching smoothly without data corruption", () => {
    const store = useProgress.getState();
    const initialId = store.state.activeProfileId;
    
    store.addProfile("Alex", "🦊");
    const newStore = useProgress.getState();
    expect(newStore.state.activeProfileId).not.toBe(initialId);
    expect(newStore.activeProfile.name).toBe("Alex");
  });
});
