import { afterEach, describe, expect, it, vi } from "vitest";
import { cancelSpeech, isSpeechSupported, speak } from "./speech";

function stubSpeechSynthesis() {
  const speakFn = vi.fn();
  const cancelFn = vi.fn();
  vi.stubGlobal("speechSynthesis", { speak: speakFn, cancel: cancelFn });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      text: string;
      rate = 1;
      pitch = 1;
      volume = 1;
      onend: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    },
  );
  return { speakFn, cancelFn };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("speak", () => {
  it("speaks with the given settings and cancels previous speech first", () => {
    const { speakFn, cancelFn } = stubSpeechSynthesis();
    const ok = speak("Apple", { rate: 0.65, pitch: 1.3 });
    expect(ok).toBe(true);
    expect(cancelFn).toHaveBeenCalledOnce();
    expect(speakFn).toHaveBeenCalledOnce();
    const utterance = speakFn.mock.calls[0][0];
    expect(utterance.text).toBe("Apple");
    expect(utterance.rate).toBe(0.65);
    expect(utterance.pitch).toBe(1.3);
  });

  it("returns false when the API is unavailable", () => {
    expect(isSpeechSupported()).toBe(false);
    expect(speak("Apple")).toBe(false);
  });

  it("cancelSpeech is a no-op without the API", () => {
    expect(() => cancelSpeech()).not.toThrow();
  });
});
