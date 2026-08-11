import { afterEach, describe, expect, it, vi } from "vitest";
import { useSettings } from "@/hooks/useSettings";

const { cancelSpeech, speak } = vi.hoisted(() => ({
  cancelSpeech: vi.fn(() => Promise.resolve()),
  speak: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("./speech", () => ({ cancelSpeech, speak }));

import { PhonicsAudioService } from "./phonicsAudioService";

class MockAudio {
  static instances: MockAudio[] = [];
  readonly src: string;
  volume = 1;
  currentTime = 0;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();

  constructor(src: string) {
    this.src = src;
    MockAudio.instances.push(this);
  }
}

afterEach(() => {
  MockAudio.instances = [];
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  useSettings.setState({ soundEnabled: true });
});

describe("PhonicsAudioService", () => {
  it("uses speech when no recording is provided", async () => {
    await expect(new PhonicsAudioService().playPhoneme(undefined, "ah")).resolves.toBe(true);

    expect(speak).toHaveBeenCalledWith("ah", expect.objectContaining({ rate: 0.65, pitch: 1.3 }));
  });

  it("does not replace a recording with TTS if the recording cannot play", async () => {
    vi.stubGlobal("Audio", class extends MockAudio {
      play = vi.fn(() => Promise.reject(new Error("missing")));
    });
    const onError = vi.fn();

    await expect(new PhonicsAudioService().playWord("/missing.mp3", "Apple", { onError })).resolves.toBe(false);

    expect(speak).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledOnce();
  });

  it("stops an active recording without leaving its promise pending", async () => {
    vi.stubGlobal("Audio", MockAudio);
    const service = new PhonicsAudioService();
    const playing = service.playPhoneme("/sound.mp3", "buh");

    await vi.waitFor(() => expect(MockAudio.instances).toHaveLength(1));
    await service.stop();

    await expect(playing).resolves.toBe(false);
    expect(MockAudio.instances[0].pause).toHaveBeenCalledOnce();
  });

  it("does not attempt audio when sound is disabled", async () => {
    useSettings.setState({ soundEnabled: false });
    vi.stubGlobal("Audio", MockAudio);

    await expect(new PhonicsAudioService().playPhoneme("/sound.mp3", "buh")).resolves.toBe(false);

    expect(MockAudio.instances).toHaveLength(0);
    expect(speak).not.toHaveBeenCalled();
  });
});
