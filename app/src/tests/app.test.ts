import { describe, expect, it } from "vitest";
import { createAppShell } from "../app";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import { dictionaryInstruments, readingActivities } from "../data/referenceContent";
import { createProgressStore, progressStorageKey, type ProgressPersistence } from "../state/progressStore";
import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

class FakeAudioElement implements AudioElementLike {
  src = "";
  loop = false;
  muted = false;
  volume = 1;
  preload = "";
  currentTime = 0;
  play = () => Promise.resolve();
  pause = () => undefined;
  load = () => undefined;
  addEventListener = () => undefined;
}

function createMemoryPersistence(): ProgressPersistence {
  const values = new Map<string, string>();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

function createTestShell(mount: HTMLElement): void {
  createAppShell(mount, {
    progress: createProgressStore(createMemoryPersistence()),
    audio: createAudioService({
      createAudioElement: () => new FakeAudioElement(),
    }),
    previewAudioPath: "/local-media/audio/activities/originals/theme1.mp3",
  });
}

function publicAssetSize(publicPath: string): number {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return statSync(join(currentDir, "../../public", publicPath)).size;
}

describe("desktop app shell", () => {
  it("renders the fixed game viewport and recovered route map", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    expect(mount.querySelector(".game-viewport")).not.toBeNull();
    expect(mount.textContent).toContain("Tchaikovsky's Nutcracker");
    expect(mount.textContent).toContain("Story");
    expect(mount.textContent).toContain("Tree Game");
    expect(mount.textContent).toContain("Local desktop package only");
  });

  it("switches route content without leaving the shell", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount
      .querySelector<HTMLButtonElement>('[data-route="suite"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Listening player");
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
  });

  it("launches main menu cards inside the fixed shell", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-action="start"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-scene-route="trivia"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Trivia challenge");
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
  });

  it("updates progress and audio controls from the side panel", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-progress="key"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-action="audio-preview"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("1 of 9 keys");
    expect(mount.textContent).toContain("Active");
    expect(window.localStorage.getItem(progressStorageKey)).toBeNull();
  });

  it("renders original story spreads with recovered local artwork", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="story"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-reading-page="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Pages 3-4");
    expect(mount.textContent).toContain("Clara's godfather gave her an awesome Nutcracker doll");
    expect(mount.textContent).toContain("Source: activities/story/story.swf");
    expect(mount.textContent).toContain("4 click-through spreads");
    expect(mount.textContent).not.toContain("Play original audio");
    expect(mount.querySelector<HTMLButtonElement>('[aria-label="Play original audio"]')).not.toBeNull();
    expect(mount.querySelector<HTMLImageElement>(".reference-art img")?.src).toContain("/local-media/visual/activities/story/5-alpha.png");
  });

  it("selects music dictionary instruments and plays their recovered clips", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="music-dictionary"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-dictionary-entry="timpani"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>("[data-dictionary-audio]")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Instrument encyclopedia");
    expect(mount.textContent).toContain("Large tuned drums");
    expect(mount.textContent).toContain("Musictionary source asset 527");
  });

  it("plays and stops Nutcracker Suite gramophone tracks", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="suite"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Trepak");
    expect(mount.textContent).toContain("Now playing");
    expect(mount.querySelector<HTMLButtonElement>(".suite-stop-button")?.getAttribute("aria-label")).toBe("Stop track");

    mount.querySelector<HTMLButtonElement>('[data-action="suite-stop"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Paused: Trepak");
    expect(mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(mount.querySelector<HTMLButtonElement>(".suite-play-button")?.getAttribute("aria-label")).toBe("Play selected track");

    mount.querySelector<HTMLButtonElement>('[data-action="suite-play"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Now playing: Trepak");
    expect(mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.getAttribute("aria-pressed")).toBe("true");
  });

  it("renders route map as a full desktop control panel", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    expect(mount.querySelectorAll(".route-list .route-button").length).toBeGreaterThan(18);
    expect(mount.querySelector(".route-panel .progress-panel")).not.toBeNull();
  });

  it("uses real local image assets for reading activities", () => {
    const pages = readingActivities.flatMap((activity) => activity.pages);

    pages.forEach((page) => {
      expect(publicAssetSize(page.imagePath)).toBeGreaterThan(1000);
    });
  });

  it("uses the SWF frame-derived Musictionary sound mapping", () => {
    const expectedSourceAssetIds = new Map([
      ["flute", 149],
      ["oboe", 267],
      ["clarinet", 305],
      ["bassoon", 342],
      ["saxophone", 390],
      ["harp", 422],
      ["piano", 454],
      ["vibraphone", 490],
      ["timpani", 527],
      ["cymbals", 551],
      ["double-bass", 601],
      ["cello", 631],
      ["violin", 677],
      ["viola", 705],
      ["trumpet", 741],
      ["trombone", 781],
      ["french-horn", 813],
      ["tuba", 854],
    ]);

    dictionaryInstruments.forEach((instrument) => {
      const expectedAssetId = expectedSourceAssetIds.get(instrument.id);
      expect(instrument.sourceAssetId).toBe(expectedAssetId);
      expect(instrument.audioPath).toBe(`/local-media/audio/activities/musictionary/${expectedAssetId}.mp3`);
    });
  });
});
