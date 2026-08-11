import { useState, useEffect, useCallback, useRef } from "react";
import { phonicsAudioService } from "@/lib/phonicsAudioService";

export function usePhonicsAudio() {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const requestId = useRef(0);

  // Cleanup active audio on unmount or navigation
  useEffect(() => {
    return () => {
      void phonicsAudioService.stop();
    };
  }, []);

  const playPhoneme = useCallback(
    async (id: string, audioUrl?: string, fallbackText: string = "") => {
      const currentRequest = ++requestId.current;
      setPlayingAudioId(id);
      try {
        await phonicsAudioService.playPhoneme(audioUrl, fallbackText, {
          onEnd: () => {
            if (requestId.current === currentRequest) setPlayingAudioId(null);
          },
          onError: () => {
            if (requestId.current === currentRequest) setPlayingAudioId(null);
          },
        });
      } finally {
        if (requestId.current === currentRequest) setPlayingAudioId(null);
      }
    },
    []
  );

  const playWord = useCallback(
    async (id: string, audioUrl?: string, fallbackText: string = "") => {
      const currentRequest = ++requestId.current;
      setPlayingAudioId(id);
      try {
        await phonicsAudioService.playWord(audioUrl, fallbackText, {
          onEnd: () => {
            if (requestId.current === currentRequest) setPlayingAudioId(null);
          },
          onError: () => {
            if (requestId.current === currentRequest) setPlayingAudioId(null);
          },
        });
      } finally {
        if (requestId.current === currentRequest) setPlayingAudioId(null);
      }
    },
    []
  );

  const stop = useCallback(async () => {
    requestId.current += 1;
    setPlayingAudioId(null);
    await phonicsAudioService.stop();
  }, []);

  const replay = useCallback(async () => {
    await phonicsAudioService.replay();
  }, []);

  return {
    playingAudioId,
    playPhoneme,
    playWord,
    stop,
    replay,
  };
}
