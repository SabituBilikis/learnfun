// Single home for Web Speech narration. All lesson/game audio goes through
// speak() so voice settings stay consistent and navigation can cancel cleanly.

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  /** Cancel any in-flight utterance before speaking. Defaults to true so
   *  rapid taps never queue overlapping narration. */
  cancelPrevious?: boolean;
  onEnd?: () => void;
}

import { useSettings } from "../hooks/useSettings";

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Speak `text` aloud. Returns false when the Web Speech API is unavailable
 *  or sound is globally disabled. */
export function speak(text: string, options: SpeakOptions = {}): boolean {
  if (!useSettings.getState().soundEnabled) return false;
  if (!isSpeechSupported()) return false;
  const { rate = 0.7, pitch = 1.3, volume = 1, cancelPrevious = true, onEnd } = options;
  if (cancelPrevious) window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function cancelSpeech(): void {
  if (isSpeechSupported()) window.speechSynthesis.cancel();
}
