import { useEffect } from "react";
import { cancelSpeech } from "../lib/speech";

/** Cancels any in-flight narration when the host component unmounts, so
 *  navigating away from a lesson stops its voice mid-sentence. */
export function useSpeechCleanup(): void {
  useEffect(() => cancelSpeech, []);
}
