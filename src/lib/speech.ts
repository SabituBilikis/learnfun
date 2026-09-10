import { Capacitor } from "@capacitor/core";
import { QueueStrategy, TextToSpeech } from "@capacitor-community/text-to-speech";
import { useSettings } from "../hooks/useSettings";

const DEFAULT_LANGUAGE = "en-US";

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  cancelPrevious?: boolean;
  onEnd?: () => void;
}

interface ActiveSpeech {
  finish: (completed: boolean) => void;
}

let activeSpeech: ActiveSpeech | null = null;

function isNativeSpeechPlatform(): boolean {
  return Capacitor.isNativePlatform();
}

function isBrowserSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
}

export function isSpeechSupported(): boolean {
  return isNativeSpeechPlatform() || isBrowserSpeechSupported();
}

function createSpeechRequest(onEnd?: () => void): { finish: (completed: boolean) => void; result: Promise<boolean> } {
  let settled = false;
  let resolveResult: (completed: boolean) => void = () => undefined;
  const result = new Promise<boolean>((resolve) => {
    resolveResult = resolve;
  });

  const finish = (completed: boolean) => {
    if (settled) return;
    settled = true;
    if (activeSpeech?.finish === finish) activeSpeech = null;
    if (completed) onEnd?.();
    resolveResult(completed);
  };

  activeSpeech = { finish };
  return { finish, result };
}

function speakNatively(text: string, options: Required<Omit<SpeakOptions, "cancelPrevious" | "onEnd">>, onEnd?: () => void): Promise<boolean> {
  const request = createSpeechRequest(onEnd);
  try {
    void TextToSpeech.speak({
      text,
      lang: DEFAULT_LANGUAGE,
      rate: options.rate,
      pitch: options.pitch,
      volume: options.volume,
      queueStrategy: QueueStrategy.Flush,
    })
      .then(() => request.finish(true))
      .catch(() => request.finish(false));
  } catch {
    request.finish(false);
  }
  return request.result;
}

function speakInBrowser(text: string, options: Required<Omit<SpeakOptions, "cancelPrevious" | "onEnd">>, onEnd?: () => void): Promise<boolean> {
  const request = createSpeechRequest(onEnd);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = options.rate;
  utterance.pitch = options.pitch;
  utterance.volume = options.volume;
  utterance.onend = () => request.finish(true);
  utterance.onerror = () => request.finish(false);

  try {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch {
          request.finish(false);
        }
      }, 20);
    } else {
      request.finish(false);
    }
  } catch {
    request.finish(false);
  }
  return request.result;
}

/**
 * Speaks text through the platform's native TTS engine in installed apps and
 * Web Speech in browsers. Resolves true only when narration completes.
 */
export async function speak(text: string, options: SpeakOptions = {}): Promise<boolean> {
  if (!useSettings.getState().soundEnabled || !text.trim() || !isSpeechSupported()) return false;

  const { rate = 0.7, pitch = 1.3, volume = 1, cancelPrevious = true, onEnd } = options;
  if (cancelPrevious) await cancelSpeech();
  const voiceOptions = { rate, pitch, volume };

  if (isNativeSpeechPlatform()) return speakNatively(text, voiceOptions, onEnd);
  return speakInBrowser(text, voiceOptions, onEnd);
}

/** Stops the current narration and releases any UI waiting for its completion. */
export async function cancelSpeech(): Promise<void> {
  activeSpeech?.finish(false);

  try {
    if (isNativeSpeechPlatform()) {
      await TextToSpeech.stop();
    } else if (isBrowserSpeechSupported()) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // The UI has already been released, so a platform stop failure is safe.
  }
}
