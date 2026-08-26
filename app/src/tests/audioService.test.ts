import { describe, expect, it, vi } from "vitest";
import { createAudioService, type AudioElementLike } from "../audio/audioService";

class FakeAudioElement implements AudioElementLike {
  src = "";
  loop = false;
  muted = false;
  volume = 1;
  preload = "";
  currentTime = 0;
  play = vi.fn(() => Promise.resolve());
  pause = vi.fn();
  load = vi.fn();
  private listeners = new Map<string, () => void>();

  addEventListener(type: string, listener: () => void): void {
    this.listeners.set(type, listener);
  }

  dispatch(type: string): void {
    this.listeners.get(type)?.();
  }
}

describe("audio service", () => {
  it("plays multiple tracks and stops scene audio predictably", async () => {
    const elements: FakeAudioElement[] = [];
    const audio = createAudioService({
      createAudioElement: () => {
        const element = new FakeAudioElement();
        elements.push(element);
        return element;
      },
      logger: {
        error: vi.fn(),
        info: vi.fn(),
      },
    });

    const track = audio.playTrack("/local-media/audio/track.mp3");
    const loop = audio.playLoop("/local-media/audio/loop.wav");
    await Promise.resolve();

    expect(track.path).toBe("/local-media/audio/track.mp3");
    expect(loop.kind).toBe("loop");
    expect(audio.getState().activeTrackCount).toBe(2);
    expect(elements[0]?.loop).toBe(true);
    expect(elements[1]?.loop).toBe(true);

    audio.stopSceneAudio();

    expect(audio.getState().activeTrackCount).toBe(0);
    expect(elements[0]?.pause).toHaveBeenCalled();
    expect(elements[1]?.pause).toHaveBeenCalled();
    expect(elements[0]?.currentTime).toBe(0);
  });

  it("applies mute and volume to active audio", () => {
    const elements: FakeAudioElement[] = [];
    const audio = createAudioService({
      createAudioElement: () => {
        const element = new FakeAudioElement();
        elements.push(element);
        return element;
      },
    });

    audio.playOneShot("/local-media/audio/click.mp3");
    audio.setMuted(true);
    audio.setVolume(0.25);

    expect(audio.getState().muted).toBe(true);
    expect(audio.getState().volume).toBe(0.25);
    expect(elements[0]?.muted).toBe(true);
    expect(elements[0]?.volume).toBe(0.25);
  });

  it("removes completed one-shot audio from active playback state", () => {
    let element: FakeAudioElement | undefined;
    const audio = createAudioService({
      createAudioElement: () => {
        element = new FakeAudioElement();
        return element;
      },
    });

    audio.playOneShot("/local-media/audio/click.mp3");
    expect(audio.getState().activeTrackCount).toBe(1);

    element?.dispatch("ended");

    expect(audio.getState().activeTrackCount).toBe(0);
  });

  it("starts track playback from a supplied offset", () => {
    const elements: FakeAudioElement[] = [];
    const audio = createAudioService({
      createAudioElement: () => {
        const element = new FakeAudioElement();
        elements.push(element);
        return element;
      },
    });

    audio.playTrack("/local-media/audio/delayed-track.mp3", 10.2);

    expect(elements[0]?.currentTime).toBe(10.2);
    expect(elements[0]?.load).toHaveBeenCalled();

    elements[0]?.dispatch("loadedmetadata");

    expect(elements[0]?.currentTime).toBe(10.2);
  });

  it("records preload and missing-audio diagnostics", () => {
    const errors: string[] = [];
    let element: FakeAudioElement | undefined;
    const audio = createAudioService({
      createAudioElement: () => {
        element = new FakeAudioElement();
        return element;
      },
      logger: {
        error: (message) => errors.push(message),
        info: vi.fn(),
      },
    });

    audio.preload("/local-media/audio/missing.mp3");
    element?.dispatch("error");

    expect(element?.load).toHaveBeenCalled();
    expect(audio.getState().diagnostics.map((diagnostic) => diagnostic.message)).toContain(
      "Missing or unplayable audio: /local-media/audio/missing.mp3",
    );
    expect(errors).toContain("Missing or unplayable audio: /local-media/audio/missing.mp3");
  });
});
