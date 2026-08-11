import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

const AUDIO_FILES = [
  { id: "b", filename: "b.mp3", path: "/audio/phonics/phonemes/b.mp3" },
  { id: "m", filename: "m.mp3", path: "/audio/phonics/phonemes/m.mp3" },
  { id: "s", filename: "s.mp3", path: "/audio/phonics/phonemes/s.mp3" },
] as const;

type AudioFile = (typeof AUDIO_FILES)[number];

interface AudioDiagnosticState {
  resolvedUrl: string;
  httpStatus: string;
  loadStatus: string;
  duration: string;
  playStatus: string;
  error: string | null;
  logs: string[];
}

function initialState(path: string): AudioDiagnosticState {
  return {
    resolvedUrl: new URL(path, window.location.origin).href,
    httpStatus: "Checking…",
    loadStatus: "Waiting for media events…",
    duration: "Unavailable",
    playStatus: "Not started",
    error: null,
    logs: [],
  };
}

function formatError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  return String(error);
}

function formatDuration(duration: number): string {
  return Number.isFinite(duration) ? `${duration.toFixed(3)} seconds` : "Unavailable";
}

export function AudioDiagnosticScreen() {
  const navigate = useNavigate();
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const [states, setStates] = useState<Record<string, AudioDiagnosticState>>(() =>
    Object.fromEntries(AUDIO_FILES.map((file) => [file.id, initialState(file.path)])),
  );

  const updateState = useCallback((id: string, updater: (state: AudioDiagnosticState) => AudioDiagnosticState) => {
    setStates((current) => ({ ...current, [id]: updater(current[id]) }));
  }, []);

  const addLog = useCallback((id: string, message: string) => {
    updateState(id, (state) => ({
      ...state,
      logs: [...state.logs, `${new Date().toISOString()} — ${message}`],
    }));
  }, [updateState]);

  const createAudio = useCallback((file: AudioFile) => {
    const resolvedUrl = new URL(file.path, window.location.origin).href;
    const previousAudio = audioRefs.current[file.id];
    if (previousAudio) {
      previousAudio.pause();
      previousAudio.src = "";
      previousAudio.load();
    }

    const audio = new Audio();
    audio.preload = "metadata";
    audioRefs.current[file.id] = audio;

    updateState(file.id, (state) => ({
      ...state,
      resolvedUrl,
      loadStatus: "Audio object created",
      error: null,
    }));
    addLog(file.id, "Audio object created");
    addLog(file.id, `URL: ${resolvedUrl}`);

    audio.addEventListener("loadedmetadata", () => {
      const duration = formatDuration(audio.duration);
      updateState(file.id, (state) => ({ ...state, loadStatus: "loadedmetadata event", duration }));
      addLog(file.id, `duration: ${duration}`);
    });
    audio.addEventListener("load", () => {
      updateState(file.id, (state) => ({ ...state, loadStatus: "load event" }));
      addLog(file.id, "load event");
    });
    audio.addEventListener("canplay", () => {
      updateState(file.id, (state) => ({ ...state, loadStatus: "canplay event" }));
      addLog(file.id, "canplay event");
    });
    audio.addEventListener("error", () => {
      const mediaError = audio.error;
      const detail = mediaError ? `MediaError code ${mediaError.code}` : "Unknown media error";
      updateState(file.id, (state) => ({ ...state, loadStatus: "error event", error: detail }));
      addLog(file.id, `error event: ${detail}`);
    });
    audio.addEventListener("ended", () => {
      updateState(file.id, (state) => ({ ...state, playStatus: "Playback ended" }));
      addLog(file.id, "ended event");
    });

    audio.src = resolvedUrl;
    audio.load();
    return audio;
  }, [addLog, updateState]);

  const inspectFile = useCallback(async (file: AudioFile) => {
    const resolvedUrl = new URL(file.path, window.location.origin).href;
    updateState(file.id, (state) => ({ ...initialState(file.path), resolvedUrl, logs: state.logs }));
    addLog(file.id, `Direct HTTP request started: ${resolvedUrl}`);

    try {
      const response = await fetch(resolvedUrl, { method: "GET", cache: "no-store" });
      const contentType = response.headers.get("content-type") ?? "Content-Type missing";
      const httpStatus = `${response.status} ${response.statusText} · ${contentType}`.trim();
      updateState(file.id, (state) => ({ ...state, httpStatus }));
      addLog(file.id, `Direct HTTP request completed: ${httpStatus}`);
    } catch (error) {
      const detail = formatError(error);
      updateState(file.id, (state) => ({ ...state, httpStatus: "Request failed", error: detail }));
      addLog(file.id, `Direct HTTP request failed: ${detail}`);
    }

    createAudio(file);
  }, [addLog, createAudio, updateState]);

  const playFile = useCallback(async (file: AudioFile) => {
    const audio = audioRefs.current[file.id] ?? createAudio(file);
    updateState(file.id, (state) => ({ ...state, playStatus: "play() called", error: null }));
    addLog(file.id, "play() called");

    try {
      await audio.play();
      updateState(file.id, (state) => ({ ...state, playStatus: "play() resolved" }));
      addLog(file.id, "play() resolved");
    } catch (error) {
      const detail = formatError(error);
      updateState(file.id, (state) => ({ ...state, playStatus: "play() rejected", error: detail }));
      addLog(file.id, `play() rejected: ${detail}`);
    }
  }, [addLog, createAudio, updateState]);

  const stopFile = useCallback((file: AudioFile) => {
    const audio = audioRefs.current[file.id];
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    updateState(file.id, (state) => ({ ...state, playStatus: "Stopped and reset" }));
    addLog(file.id, "stop() completed");
  }, [addLog, updateState]);

  useEffect(() => {
    void Promise.all(AUDIO_FILES.map((file) => inspectFile(file)));
    return () => {
      for (const audio of Object.values(audioRefs.current)) {
        audio.pause();
        audio.src = "";
        audio.load();
      }
    };
  }, [inspectFile]);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 font-mono text-slate-100 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">Development only</p>
            <h1 className="mt-1 text-3xl font-bold">Audio Diagnostic</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              This screen uses direct HTTP requests and native HTMLAudioElement only. It does not use LearnFun audio services, Web Audio, or third-party libraries.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => void Promise.all(AUDIO_FILES.map((file) => inspectFile(file)))} className="rounded bg-amber-300 px-4 py-2 font-bold text-slate-950">
              Recheck all
            </button>
            <button onClick={() => navigate("/")} className="rounded border border-slate-500 px-4 py-2 font-bold text-slate-100">
              Home
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          {AUDIO_FILES.map((file) => {
            const state = states[file.id];
            return (
              <section key={file.id} className="rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-lg">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-amber-300">{file.filename}</h2>
                    <p className="mt-1 break-all text-xs text-slate-400">{state.resolvedUrl}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => void playFile(file)} className="rounded bg-emerald-400 px-4 py-2 font-bold text-slate-950">Play</button>
                    <button onClick={() => stopFile(file)} className="rounded bg-rose-400 px-4 py-2 font-bold text-slate-950">Stop</button>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-slate-400">HTTP/load status</dt><dd className="mt-1 font-bold">{state.httpStatus} · {state.loadStatus}</dd></div>
                  <div><dt className="text-slate-400">Duration</dt><dd className="mt-1 font-bold">{state.duration}</dd></div>
                  <div><dt className="text-slate-400">Playback</dt><dd className="mt-1 font-bold">{state.playStatus}</dd></div>
                  <div><dt className="text-slate-400">Exact error</dt><dd className="mt-1 break-words font-bold text-rose-300">{state.error ?? "None"}</dd></div>
                </dl>

                <pre className="mt-4 max-h-64 overflow-auto rounded bg-black p-3 text-xs leading-5 text-emerald-300">
                  {state.logs.length > 0 ? state.logs.join("\n") : "Waiting for diagnostic events…"}
                </pre>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
