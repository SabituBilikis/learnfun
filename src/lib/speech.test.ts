import { afterEach, describe, expect, it, vi } from "vitest";

const { isNativePlatform, nativeSpeak, nativeStop } = vi.hoisted(() => ({
  isNativePlatform: vi.fn(() => false),
  nativeSpeak: vi.fn(() => Promise.resolve()),
  nativeStop: vi.fn(() => Promise.resolve()),
}));

vi.mock("@capacitor/core", () => ({
  Capacitor: { isNativePlatform },
}));

vi.mock("@capacitor-community/text-to-speech", () => ({
  QueueStrategy: { Flush: 0 },
  TextToSpeech: { speak: nativeSpeak, stop: nativeStop },
}));

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
  isNativePlatform.mockReturnValue(false);
  nativeSpeak.mockReset();
  nativeSpeak.mockResolvedValue(undefined);
  nativeStop.mockReset();
  nativeStop.mockResolvedValue(undefined);
  vi.unstubAllGlobals();
});

describe("speak", () => {
  it("speaks in browsers with the given settings and completes when the utterance ends", async () => {
    const { speakFn, cancelFn } = stubSpeechSynthesis();
    const result = speak("Apple", { rate: 0.65, pitch: 1.3 });

    await vi.waitFor(() => expect(speakFn).toHaveBeenCalledOnce());
    expect(cancelFn).toHaveBeenCalledOnce();
    const utterance = speakFn.mock.calls[0][0];
    expect(utterance.text).toBe("Apple");
    expect(utterance.rate).toBe(0.65);
    expect(utterance.pitch).toBe(1.3);
    utterance.onend();
    await expect(result).resolves.toBe(true);
  });

  it("uses native Android speech with the configured English voice", async () => {
    isNativePlatform.mockReturnValue(true);

    await expect(speak("Apple", { rate: 0.65, pitch: 1.3, volume: 0.8 })).resolves.toBe(true);

    expect(nativeSpeak).toHaveBeenCalledWith({
      text: "Apple",
      lang: "en-US",
      rate: 0.65,
      pitch: 1.3,
      volume: 0.8,
      queueStrategy: 0,
    });
  });

  it("releases pending native speech when cancelled", async () => {
    isNativePlatform.mockReturnValue(true);
    nativeSpeak.mockImplementation(() => new Promise<void>(() => undefined));
    const result = speak("Apple");

    await vi.waitFor(() => expect(nativeSpeak).toHaveBeenCalledOnce());
    await cancelSpeech();

    await expect(result).resolves.toBe(false);
    expect(nativeStop).toHaveBeenCalledTimes(2);
  });

  it("returns false when no speech engine is available", async () => {
    expect(isSpeechSupported()).toBe(false);
    await expect(speak("Apple")).resolves.toBe(false);
  });

  it("treats a native engine failure as an unsuccessful narration", async () => {
    isNativePlatform.mockReturnValue(true);
    nativeSpeak.mockRejectedValueOnce(new Error("TTS unavailable"));

    await expect(speak("Apple")).resolves.toBe(false);
  });
});
