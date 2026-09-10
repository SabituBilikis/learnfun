import { speak, cancelSpeech } from "./speech";
import { useSettings } from "../hooks/useSettings";

export interface PhonicsAudioOptions {
  rate?: number;
  pitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
}

export class PhonicsAudioService {
  private activeAudio: HTMLAudioElement | null = null;
  private finishActiveAudio: ((completed: boolean) => void) | null = null;
  private lastAction: (() => Promise<boolean>) | null = null;
  private playbackGeneration = 0;

  /**
   * Stops any currently playing audio element smoothly to prevent DAC speaker thuds/clicks.
   */
  async stop(): Promise<void> {
    this.playbackGeneration += 1;
    if (this.activeAudio) {
      try {
        const audio = this.activeAudio;
        this.activeAudio = null;
        this.finishActiveAudio?.(false);
        this.finishActiveAudio = null;

        // Smoothly zero volume before pausing to prevent digital step-discontinuity (speaker thumps/pops)
        audio.volume = 0;
        audio.pause();
        audio.currentTime = 0;
      } catch {
        // Safe catch for media cleanup failures
      }
    }
    await cancelSpeech();
  }

  /**
   * Replays the most recent audio action if available.
   */
  async replay(): Promise<boolean> {
    if (this.lastAction) {
      return this.lastAction();
    }
    return false;
  }

  /**
   * Plays a phoneme audio asset with TTS fallback.
   */
  async playPhoneme(
    audioUrl?: string,
    fallbackText: string = "",
    options: PhonicsAudioOptions = {}
  ): Promise<boolean> {
    this.lastAction = () => this.playPhoneme(audioUrl, fallbackText, options);
    return this.playAudioOrFallback(audioUrl, fallbackText, {
      rate: 0.65,
      pitch: 1.3,
      ...options,
    });
  }

  /**
   * Plays a word audio asset with graceful TTS fallback.
   */
  async playWord(
    audioUrl?: string,
    fallbackText: string = "",
    options: PhonicsAudioOptions = {}
  ): Promise<boolean> {
    this.lastAction = () => this.playWord(audioUrl, fallbackText, options);
    return this.playAudioOrFallback(audioUrl, fallbackText, {
      rate: 0.7,
      pitch: 1.25,
      ...options,
    });
  }

  /**
   * Core execution method: attempts HTMLAudioElement playback; falls back to TTS speech.
   */
  private async playAudioOrFallback(
    audioUrl: string | undefined,
    fallbackText: string,
    options: PhonicsAudioOptions
  ): Promise<boolean> {
    if (!useSettings.getState().soundEnabled) return false;

    // Prevent overlapping sounds by stopping current audio smoothly
    await this.stop();
    const requestGeneration = this.playbackGeneration;
    options.onStart?.();

    if (audioUrl) {
      const success = await this.tryPlayAudioFile(audioUrl, options);
      if (success) return true;
      if (typeof window !== "undefined" && import.meta.env?.DEV) {
        console.warn(`[PhonicsAudio] Educational audio asset missing: ${audioUrl}`);
      }
      if (requestGeneration !== this.playbackGeneration) return false;
      options.onError?.(new Error(`Educational audio asset missing: ${audioUrl}`));
      return false;
    }

    if (fallbackText && fallbackText.trim().length > 0) {
      try {
        const spoken = await speak(fallbackText, {
          rate: options.rate,
          pitch: options.pitch,
          onEnd: options.onEnd,
        });
        if (requestGeneration !== this.playbackGeneration) return false;
        if (!spoken) options.onError?.(new Error("Speech playback was unavailable."));
        return spoken;
      } catch (err) {
        options.onError?.(err);
        options.onEnd?.();
        return false;
      }
    }

    options.onEnd?.();
    return false;
  }

  /**
   * Helper to attempt playing HTML5 Audio element safely with cache-busting and full volume restoration.
   */
  private tryPlayAudioFile(
    url: string,
    options: PhonicsAudioOptions
  ): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const audio = new Audio(url);
        let settled = false;
        const finish = (completed: boolean) => {
          if (settled) return;
          settled = true;
          if (this.activeAudio === audio) this.activeAudio = null;
          if (this.finishActiveAudio === finish) this.finishActiveAudio = null;
          if (completed) options.onEnd?.();
          resolve(completed);
        };

        audio.volume = 1.0;
        this.activeAudio = audio;
        this.finishActiveAudio = finish;

        audio.onended = () => {
          finish(true);
        };

        audio.onerror = () => {
          finish(false);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            void err;
            finish(false);
          });
        }
      } catch (err) {
        void err;
        resolve(false);
      }
    });
  }
}

export const phonicsAudioService = new PhonicsAudioService();
