import { useSettings } from "@/hooks/useSettings";

/**
 * Plays an instant audio chime/feedback sound using Web Audio API.
 * Requires no external audio assets and works offline across all devices.
 */
export function playChimeSound(success = true) {
  if (!useSettings.getState().soundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (success) {
      // Pleasant high-pitched two-tone chime (E5 -> G5)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc2.type = "sine";

      osc1.frequency.setValueAtTime(659.25, now);       // E5
      osc2.frequency.setValueAtTime(783.99, now + 0.08); // G5

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.1);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } else {
      // Gentle low wobble for wrong/try again
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch {
    // Ignore web audio context initialization errors
  }
}
