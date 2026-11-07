import { describe, expect, it, vi } from "vitest";
import { createAppShell } from "../app";
import { routes } from "../routes";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import { getCorrectNutcrackerTrackNumbers, nutcrackerSongGames } from "../data/nutcrackerSongGames";
import { dictionaryInstruments, readingActivities, suiteTracks } from "../data/referenceContent";
import {
  createProgressStore,
  progressStorageKey,
  type GameKey,
  type ProgressPersistence,
  type ProgressStoreController,
} from "../state/progressStore";
import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

class FakeAudioElement implements AudioElementLike {
  static playCount = 0;
  static playedSources: string[] = [];
  static instances: FakeAudioElement[] = [];
  src = "";
  loop = false;
  muted = false;
  volume = 1;
  preload = "";
  currentTime = 0;
  paused = false;
  private readonly listeners = new Map<string, Set<() => void>>();
  constructor() {
    FakeAudioElement.instances.push(this);
  }
  play = () => {
    FakeAudioElement.playCount += 1;
    FakeAudioElement.playedSources.push(this.src);
    return Promise.resolve();
  };
  pause = () => {
    this.paused = true;
  };
  load = () => undefined;
  addEventListener = (type: string, listener: () => void) => {
    const listeners = this.listeners.get(type) ?? new Set<() => void>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  };
  finish = () => {
    this.listeners.get("ended")?.forEach((listener) => listener());
  };
}

function lastPlayedSource(): string | undefined {
  return FakeAudioElement.playedSources[FakeAudioElement.playedSources.length - 1];
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

function createTestShell(
  mount: HTMLElement,
  configureProgress?: (progress: ProgressStoreController) => void,
): ProgressStoreController {
  const progress = createProgressStore(createMemoryPersistence());
  configureProgress?.(progress);
  createAppShell(mount, {
    progress,
    audio: createAudioService({
      createAudioElement: () => new FakeAudioElement(),
    }),
    previewAudioPath: "/local-media/audio/activities/originals/theme1.mp3",
    showDeveloperPanel: true,
  });
  return progress;
}

function publicAssetSize(publicPath: string): number {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return statSync(join(currentDir, "../../public", publicPath)).size;
}

function openRecoveredMainMenu(mount: HTMLElement): void {
  mount.querySelector<HTMLButtonElement>('[data-action="start"]')?.click();
  mount.querySelector<HTMLButtonElement>('[data-action="play-featured-game"]')?.click();
}

describe("desktop app shell", () => {
  it("renders the fixed game viewport and recovered route map", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    expect(mount.querySelector(".game-viewport")).not.toBeNull();
    // Projector root frame 1 jumps straight to choose: the original opens on the launcher.
    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    expect(mount.querySelector(".source-intro-scene")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-action="preview-musical-friends"]')?.click();
    expect(mount.querySelector<HTMLElement>(".source-intro-scene")?.dataset.sourceSwf).toContain("flute_intro.swf");
    expect(mount.querySelector<HTMLImageElement>(".source-intro-garden")?.src).toContain("flute-intro-garden");
    expect(mount.textContent).toContain("skip");
    expect(mount.textContent).toContain("Story");
    expect(mount.textContent).toContain("Song Doors");
    expect(mount.textContent).toContain("Local desktop package only");
  });

  it("hides the developer route map by default and scales the stage to the window", () => {
    const mount = document.createElement("main");
    createAppShell(mount, {
      progress: createProgressStore(createMemoryPersistence()),
      audio: createAudioService({
        createAudioElement: () => new FakeAudioElement(),
      }),
    });

    expect(mount.querySelector(".route-panel")).toBeNull();
    expect(mount.querySelector(".release-shell")).not.toBeNull();
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
    expect(mount.style.getPropertyValue("--stage-scale")).not.toBe("");
  });

  it("shows the developer panel only for devpanel=1 or VITE_DEV_PANEL=1", () => {
    const makeMount = () => {
      const mount = document.createElement("main");
      createAppShell(mount, {
        progress: createProgressStore(createMemoryPersistence()),
        audio: createAudioService({
          createAudioElement: () => new FakeAudioElement(),
        }),
      });
      return mount;
    };

    window.history.replaceState({}, "", "/?devpanel=0");
    expect(makeMount().querySelector(".route-panel")).toBeNull();

    window.history.replaceState({}, "", "/?devpanel=1");
    const queryMount = makeMount();
    expect(queryMount.querySelector(".route-panel")).not.toBeNull();
    expect(queryMount.querySelector(".release-shell")).toBeNull();

    window.history.replaceState({}, "", "/");
    vi.stubEnv("VITE_DEV_PANEL", "1");
    try {
      expect(makeMount().querySelector(".route-panel")).not.toBeNull();
    } finally {
      vi.unstubAllEnvs();
    }
    expect(makeMount().querySelector(".route-panel")).toBeNull();
  });

  it("scales the stage to the window and reserves a band for the unlocked certificate action", () => {
    window.history.replaceState({}, "", "/");
    const progress = createProgressStore(createMemoryPersistence());
    const mount = document.createElement("main");
    createAppShell(mount, {
      progress,
      audio: createAudioService({
        createAudioElement: () => new FakeAudioElement(),
      }),
    });

    window.innerWidth = 1280;
    window.innerHeight = 960;
    window.dispatchEvent(new Event("resize"));
    expect(Number(mount.style.getPropertyValue("--stage-scale"))).toBeCloseTo(2, 5);

    window.innerWidth = 1920;
    window.innerHeight = 600;
    window.dispatchEvent(new Event("resize"));
    expect(Number(mount.style.getPropertyValue("--stage-scale"))).toBeCloseTo(600 / 480, 5);

    window.innerWidth = 1280;
    window.innerHeight = 960;
    progress.markGameKey(1);
    // Re-render through the source Musical Friends preview and back.
    mount.querySelector<HTMLButtonElement>('[data-action="preview-musical-friends"]')?.click();
    mount.querySelector<HTMLButtonElement>('[data-action="start"]')?.click();
    expect(mount.querySelector(".release-certificate-actions")).not.toBeNull();
    expect(Number(mount.style.getPropertyValue("--stage-scale"))).toBeCloseTo((960 - 56) / 480, 5);
  });

  it("places the flying help in stage coordinates when the release stage is scaled", () => {
    window.history.replaceState({}, "", "/");
    const mount = document.createElement("main");
    const progress = createProgressStore(createMemoryPersistence());
    ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const satisfies readonly GameKey[]).forEach((key) => progress.markGameKey(key));
    createAppShell(mount, {
      progress,
      audio: createAudioService({
        createAudioElement: () => new FakeAudioElement(),
      }),
    });
    mount.querySelector<HTMLButtonElement>('[data-action="start"]')?.click();
    mount.querySelector<HTMLButtonElement>('[data-action="play-featured-game"]')?.click();
    mount.querySelector<HTMLButtonElement>('[data-scene-route="nutcracker-chooser"]')?.click();

    const viewport = mount.querySelector<HTMLElement>(".game-viewport");
    expect(viewport).not.toBeNull();
    viewport!.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 1280, height: 960, right: 1280, bottom: 960, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    const helpButton = mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]');
    expect(helpButton).not.toBeNull();
    helpButton!.dispatchEvent(new PointerEvent("pointerenter", { clientX: 600, clientY: 320, bubbles: false }));

    const flyingHelp = mount.querySelector<HTMLElement>(".source-flying-help");
    // Screen (600, 320) at scale 2 is stage (300, 160); the help sits at +14 / -34 from there.
    // Without the scale correction it would land at (614, 286) and clamp to the stage corner.
    expect(flyingHelp?.style.left).toBe("314px");
    expect(flyingHelp?.style.top).toBe("126px");
  });

  it("follows the recovered projector launcher sequence and wires every visible launcher button", () => {
    const openExternal = vi.fn();
    const exitApp = vi.fn();
    const makeMount = () => {
      const mount = document.createElement("main");
      createAppShell(mount, {
        progress: createProgressStore(createMemoryPersistence()),
        audio: createAudioService({
          createAudioElement: () => new FakeAudioElement(),
        }),
        openExternal,
        exitApp,
        showDeveloperPanel: false,
      });
      mount.querySelector<HTMLButtonElement>('[data-action="start"]')?.click();
      return mount;
    };

    const playMount = makeMount();
    expect(playMount.querySelector<HTMLImageElement>(".source-projector-choose")?.src).toContain(
      "projector-choose-source",
    );
    expect(playMount.querySelectorAll(".source-projector-launcher-button")).toHaveLength(5);
    expect(
      [...playMount.querySelectorAll<HTMLElement>(".source-projector-launcher-button")].map(
        (button) => [button.dataset.action, button.dataset.sourceHitRect],
      ),
    ).toEqual([
      ["play-featured-game", "x 216-424 y 44-246"],
      ["preview-musical-friends", "x 54-188 y 326-460"],
      ["preview-alice", "x 196-332 y 326-460"],
      ["open-kids-music-stage", "x 432-576 y 320-464"],
      ["exit-projector", "x 572-640 y 8-58"],
    ]);
    playMount.querySelector<HTMLButtonElement>('[data-action="play-featured-game"]')?.click();
    expect(playMount.querySelector<HTMLImageElement>(".source-playroom-background")?.src).toContain(
      "main-playroom-source-composite",
    );

    const musicalFriendsMount = makeMount();
    musicalFriendsMount.querySelector<HTMLButtonElement>('[data-action="preview-musical-friends"]')?.click();
    expect(musicalFriendsMount.querySelector(".source-intro-garden")).not.toBeNull();

    const aliceMount = makeMount();
    aliceMount.querySelector<HTMLButtonElement>('[data-action="preview-alice"]')?.click();
    // Source aliceBTN plays the projector's own aliceIntro trailer, not the Alice game.
    expect(aliceMount.querySelector(".source-alice-preview-scene")).not.toBeNull();

    const webMount = makeMount();
    webMount.querySelector<HTMLButtonElement>('[data-action="open-kids-music-stage"]')?.click();
    expect(openExternal).toHaveBeenCalledWith("http://www.kidsmusicstage.com");

    const exitMount = makeMount();
    exitMount.querySelector<HTMLButtonElement>('[data-action="exit-projector"]')?.click();
    expect(exitApp).toHaveBeenCalledOnce();
  });

  it("removes development navigation and cheat controls from the release shell", () => {
    const mount = document.createElement("main");

    createAppShell(mount, {
      progress: createProgressStore(createMemoryPersistence()),
      audio: createAudioService({
        createAudioElement: () => new FakeAudioElement(),
      }),
      showDeveloperPanel: false,
    });

    expect(mount.querySelector(".release-shell")).not.toBeNull();
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
    expect(mount.querySelector(".route-panel")).toBeNull();
    expect(mount.querySelector("[data-progress]")).toBeNull();
    expect(mount.textContent).not.toContain("Progress debug controls");
    expect(mount.textContent).not.toContain("Audio diagnostics will appear here.");
  });

  it("keeps the unlocked certificate action available outside the release viewport", () => {
    const mount = document.createElement("main");
    const progress = createProgressStore(createMemoryPersistence());
    const printCertificate = vi.fn();
    progress.markGameKey(1);

    createAppShell(mount, {
      progress,
      audio: createAudioService({
        createAudioElement: () => new FakeAudioElement(),
      }),
      printCertificate,
      showDeveloperPanel: false,
    });

    expect(mount.querySelector(".route-panel")).toBeNull();
    expect(mount.querySelector('.game-viewport [data-action="print-certificate"]')).toBeNull();
    const printButton = mount.querySelector<HTMLButtonElement>(
      '.release-certificate-actions [data-action="print-certificate"]',
    );
    expect(printButton?.dataset.sourceReward).toBe("gameKey1");
    expect(mount.querySelector(".certificate-print-surface")).not.toBeNull();

    printButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(printCertificate).toHaveBeenCalledOnce();
  });

  it("switches route content without leaving the shell", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount
      .querySelector<HTMLButtonElement>('[data-route="suite"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("The Listening Room");
    expect(mount.querySelector<HTMLImageElement>(".source-listening-frame")?.src).toContain("listening-room-source");
    expect(mount.querySelectorAll("[data-suite-track]")).toHaveLength(16);
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
  });

  it("launches source-positioned main room hotspots inside the fixed shell", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    openRecoveredMainMenu(mount);
    expect(mount.querySelector<HTMLImageElement>(".source-playroom-background")?.src).toContain(
      "main-playroom-source-composite",
    );
    // Room games without a hand-made route play only from the original CD in the live projector.
    const triviaHotspot = mount.querySelector<HTMLButtonElement>('[data-source-action="loadGame games/trivia/trivia.swf"]');
    expect(triviaHotspot?.dataset.sourcePlacement).toContain("button id 0636");
    expect(triviaHotspot?.disabled).toBe(true);
    expect(triviaHotspot?.dataset.sceneRoute).toBeUndefined();
    expect(mount.querySelector<HTMLElement>('[data-scene-route="story"]')?.dataset.sourcePlacement).toContain(
      "button id 0640",
    );
    mount.querySelector<HTMLButtonElement>('[data-scene-route="story"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector(".source-reader-scene")).not.toBeNull();
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
  });

  it("shows the source nutButton only after all nine game keys", () => {
    const lockedMount = document.createElement("main");
    createTestShell(lockedMount);
    openRecoveredMainMenu(lockedMount);
    expect(lockedMount.querySelector(".source-playroom-nutcracker")).toBeNull();

    const unlockedMount = document.createElement("main");
    createTestShell(unlockedMount, (progress) => {
      ([1, 2, 3, 4, 5, 6, 7, 8, 9] as const satisfies readonly GameKey[]).forEach((key) => progress.markGameKey(key));
    });
    openRecoveredMainMenu(unlockedMount);

    expect(unlockedMount.querySelector<HTMLElement>(".source-playroom-nutcracker")?.dataset.sourcePlacement).toContain(
      "sprite id 0671",
    );
    expect(unlockedMount.querySelector<HTMLElement>(".source-playroom-nutcracker")?.dataset.sourceAction).toContain(
      "collectedKeys equals 9",
    );
  });

  it("updates progress and audio controls from the side panel", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-progress="key"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-action="audio-preview"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Game keys1/9");
    expect(mount.textContent).toContain("Active");
    expect(window.localStorage.getItem(progressStorageKey)).toBeNull();
  });

  it("renders original story spreads with recovered local artwork", () => {
    const mount = document.createElement("main");
    document.body.append(mount);

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="story"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-reading-page="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Pages 3-4");
    expect(mount.textContent).toContain("Clara's godfather gave her an awesome Nutcracker doll");
    expect(mount.querySelector<HTMLElement>(".source-reader-scene")?.dataset.sourceSwf).toContain("activities/story/story.swf");
    expect(mount.querySelector<HTMLElement>(".source-reader-scene")?.dataset.sourceTextIds).toBe("35,36");
    expect(mount.querySelector<HTMLElement>(".source-reader-scene")?.dataset.sourceClassification).toBe("original asset");
    expect(mount.textContent).toContain("8 pages");
    expect(mount.textContent).toContain("< PREV");
    expect(mount.textContent).toContain("NEXT >");
    expect(mount.querySelector('[aria-label="Play original audio"]')).toBeNull();
    expect(mount.querySelector<HTMLImageElement>(".source-reader-scene-frame")?.src).toContain("story-reader-frame-2");
    expect(mount.querySelector<HTMLImageElement>(".source-reader-exit-book-frame")?.src).toContain("story-reader-book");
    expect(mount.querySelector<HTMLElement>('[data-source-side="left"]')?.dataset.sourceTextIds).toBe("35");
    expect(mount.querySelector<HTMLElement>('[data-source-side="right"]')?.dataset.sourceTextIds).toBe("36");
    expect(mount.querySelector<HTMLElement>(".source-reader-control-prev")?.dataset.sourceHitBounds).toContain("20.00-309.00");
    expect(mount.querySelector<HTMLElement>(".source-reader-control-next")?.dataset.sourceHitBounds).toContain("327.00-624.95");
    expect(lastPlayedSource()).toContain("/local-media/audio/activities/story/31.mp3");
    expect(document.activeElement).toBe(mount.querySelector('[data-reading-direction="next"]'));
    mount.remove();
  });

  it("replays source narration from spread one and follows the source exit fade", () => {
    vi.useFakeTimers();
    const mount = document.createElement("main");
    document.body.append(mount);

    try {
      createTestShell(mount);
      mount.querySelector<HTMLButtonElement>('[data-route="story"]')?.click();
      expect(lastPlayedSource()).toContain("/local-media/audio/activities/story/31.mp3");
      mount.querySelector<HTMLButtonElement>('[data-reading-direction="next"]')?.click();
      expect(mount.querySelector<HTMLImageElement>(".source-reader-scene-frame")?.src).toContain("story-reader-frame-2");

      mount.querySelector<HTMLButtonElement>('[data-action="exit"]')?.click();
      expect(mount.querySelector<HTMLElement>(".source-reader-scene")?.dataset.exiting).toBe("true");
      vi.advanceTimersByTime(399);
      expect(mount.querySelector(".source-reader-scene")).not.toBeNull();
      vi.advanceTimersByTime(1);
      expect(mount.querySelector(".source-playroom-background")).not.toBeNull();

      mount.querySelector<HTMLButtonElement>('[data-scene-route="story"]')?.click();
      expect(mount.querySelector<HTMLImageElement>(".source-reader-scene-frame")?.src).toContain("story-reader-frame-1");
    } finally {
      mount.remove();
      vi.useRealTimers();
    }
  });

  it("cycles all 18 source-captured Musictionary facts, narration, help states, and source controls", () => {
    const mount = document.createElement("main");
    document.body.append(mount);

    FakeAudioElement.playedSources = [];
    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="music-dictionary"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(lastPlayedSource()).toContain("/local-media/audio/activities/musictionary/149.mp3");
    expect(mount.querySelector<HTMLImageElement>(".source-musictionary-frame")?.src).toContain("musictionary-frame-1");
    expect(mount.querySelector(".source-musictionary-card")).toBeNull();
    expect(mount.querySelector("[data-dictionary-audio]")).toBeNull();
    expect(mount.querySelectorAll(".source-musictionary-hit")).toHaveLength(3);

    const visitedFrames = new Set<string>();
    for (let index = 0; index < 18; index += 1) {
      const frameSource = mount.querySelector<HTMLImageElement>(".source-musictionary-frame")?.src;
      if (frameSource) visitedFrames.add(frameSource);
      if (index < 17) {
        mount
          .querySelector<HTMLButtonElement>("[data-dictionary-next]")
          ?.dispatchEvent(new MouseEvent("click", { bubbles: true, detail: 1 }));
      }
    }
    expect(visitedFrames.size).toBe(18);
    expect(mount.textContent).toContain("Tuba");
    expect(lastPlayedSource()).toContain("/local-media/audio/activities/musictionary/854.mp3");

    mount.querySelector<HTMLButtonElement>("[data-dictionary-next]")?.click();
    expect(document.activeElement).toBe(mount.querySelector("[data-dictionary-next]"));
    expect(mount.textContent).toContain("Flute");

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help]")?.click();
    expect(mount.querySelector<HTMLImageElement>(".source-musictionary-frame")?.src).toContain("musictionary-help.png");
    expect(mount.querySelectorAll(".source-musictionary-hit")).toHaveLength(2);
    mount.querySelector<HTMLButtonElement>("[data-dictionary-help-fish]")?.click();
    expect(mount.querySelector<HTMLImageElement>(".source-musictionary-frame")?.src).toContain("musictionary-help-fish");
    mount.querySelector<HTMLButtonElement>("[data-dictionary-help-close]")?.click();

    expect(mount.querySelector<HTMLImageElement>(".source-musictionary-frame")?.src).toContain("musictionary-frame-1");
    expect(mount.querySelector<HTMLElement>(".source-musictionary-scene")?.dataset.sourcePlayer).toContain("149");
    mount.remove();
  });

  it("uses the complete biography frame-three source capture with both source image ids", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount
      .querySelector<HTMLButtonElement>('[data-route="composer-biography"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount
      .querySelector<HTMLButtonElement>('[data-reading-page="1"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount
      .querySelector<HTMLButtonElement>('[data-reading-page="2"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const rightPage = mount.querySelector<HTMLElement>('[data-source-side="right"]');
    expect(rightPage?.dataset.sourceImageIds).toBe("45,46");
    expect(mount.querySelector<HTMLImageElement>(".source-reader-scene-frame")?.src).toContain("biography-reader-frame-3");
    expect(mount.querySelector(".source-reader-images")).toBeNull();
  });

  it("uses all 16 source gramophone records, exact titles, drag/drop, and explicit missing audio", async () => {
    const mount = document.createElement("main");

    FakeAudioElement.playedSources = [];
    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="suite"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(suiteTracks).toHaveLength(16);
    expect(suiteTracks.slice(0, 8).every((track) => track.audioPath !== null)).toBe(true);
    expect(suiteTracks.slice(8).every((track) => track.audioPath === null)).toBe(true);
    expect(mount.querySelectorAll("[data-suite-track]")).toHaveLength(16);
    expect(
      Array.from(mount.querySelectorAll<HTMLButtonElement>("[data-suite-track]")).every(
        (record) => record.getAttribute("draggable") === "true",
      ),
    ).toBe(true);
    expect(mount.textContent).not.toContain("CHOOSE A RECORD");
    mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Old French Song");
    expect(mount.textContent).toContain("Playing");
    expect(lastPlayedSource()).toContain("/local-media/audio/activities/originals/theme4.mp3");
    expect(mount.querySelector<HTMLElement>('[data-suite-track="theme-4"]')?.dataset.sourcePlacement).toContain(
      "lp4 sprite id 0066",
    );
    expect(mount.querySelector<HTMLButtonElement>(".suite-stop-button")?.getAttribute("aria-label")).toBe("Pause Old French Song");

    mount.querySelector<HTMLButtonElement>('[data-action="suite-stop"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Paused");
    expect(mount.textContent).toContain("Old French Song");
    expect(mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(mount.querySelector<HTMLButtonElement>(".suite-play-button")?.getAttribute("aria-label")).toBe("Play Old French Song");

    mount.querySelector<HTMLButtonElement>('[data-action="suite-play"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Playing");
    expect(mount.textContent).toContain("Old French Song");
    expect(mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.getAttribute("aria-pressed")).toBe("true");

    FakeAudioElement.instances[FakeAudioElement.instances.length - 1]?.finish();
    await Promise.resolve();
    expect(mount.textContent).toContain("Paused");
    expect(mount.querySelector<HTMLButtonElement>(".suite-play-button")?.getAttribute("aria-label")).toBe("Play Old French Song");

    const playCountBeforeMissingRecord = FakeAudioElement.playedSources.length;
    mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-9"]')?.click();
    expect(FakeAudioElement.playedSources).toHaveLength(playCountBeforeMissingRecord);
    expect(mount.textContent).toContain("Dance of the Sugar Plum Fairy");
    expect(mount.textContent).toContain("source audio theme9.mp3 is missing");
    expect(mount.querySelector('[data-suite-track="theme-9"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(mount.querySelector('[data-suite-track="theme-9"]')?.getAttribute("data-source-audio")).toBe("missing");

    const transferValues = new Map<string, string>();
    const transfer = {
      getData: (type: string) => transferValues.get(type) ?? "",
      setData: (type: string, value: string) => transferValues.set(type, value),
      setDragImage: () => undefined,
    };
    const dragStart = new Event("dragstart", { bubbles: true }) as DragEvent;
    Object.defineProperty(dragStart, "dataTransfer", { value: transfer });
    mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-2"]')?.dispatchEvent(dragStart);
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as DragEvent;
    Object.defineProperty(drop, "dataTransfer", { value: transfer });
    mount.querySelector<HTMLElement>("[data-suite-drop]")?.dispatchEvent(drop);
    expect(mount.textContent).toContain("The Children’s Album: Russian. Playing.");
    expect(lastPlayedSource()).toContain("/local-media/audio/activities/originals/theme2.mp3");
  });

  it("renders route map as a full desktop control panel", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    expect(mount.querySelectorAll(".route-list .route-button")).toHaveLength(routes.length);
    expect(mount.querySelector(".route-panel .progress-panel")).not.toBeNull();
  });

  it("opens Nutcracker song doors from the chooser and previews recovered tracks", () => {
    const mount = document.createElement("main");
    document.body.append(mount);

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.disabled).toBe(false);
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.disabled).toBe(true);
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.dataset.doorState).toBe("ready");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.dataset.doorState).toBe("locked");
    expect(mount.querySelector<HTMLElement>(".nutcracker-door-card")?.dataset.sourcePlacement).toContain("nutchooser.swf m1");
    expect(mount.querySelector<HTMLElement>(".nutcracker-door-card")?.dataset.sourceAction).toContain(
      "sets this._visible",
    );
    const chooserSourceFrame = mount.querySelector<HTMLImageElement>(".nutcracker-chooser-source-frame");
    expect(chooserSourceFrame?.src).toContain("nutchooser-source-normal");
    expect(chooserSourceFrame?.dataset.sourceClassification).toBe("SWF-derived recreation");
    expect(chooserSourceFrame?.dataset.sourceMethod).toBe("source-runtime capture");
    expect(chooserSourceFrame?.dataset.sourceFrame).toContain("normal chooser state");
    expect(chooserSourceFrame?.dataset.sourceCapture).toContain("1280 x 960 DPR-2");
    expect(chooserSourceFrame?.dataset.sourceCapture).toContain("640 x 480");
    expect(mount.querySelector(".source-scene-actions")).toBeNull();
    expect(mount.querySelector(".scene-footer")).toBeNull();
    expect(mount.querySelector(".source-control-help")).toBeNull();
    expect(mount.querySelector(".chooser-source-controls")).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourcePlacement).toContain(
      "nutchooser.swf helpButton",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceState).toContain(
      "buttonON places button id 0200",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceImage).toContain(
      "source-runtime capture",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.getAttribute("class")).toContain(
      "chooser-source-help-button",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceHelp).toBe("Help");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceHelpFrame).toBe(
      "4",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.closest(".nutcracker-chooser")).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourcePlacement).toContain(
      "nutchooser.swf quiter",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceState).toContain(
      "shape id 0205",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceImage).toContain(
      "source-runtime capture",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceImage).toContain(
      "text id 0203 is the blue buttonOFF label",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceHelp).toBe(
      "Quit the Game",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceHelpFrame).toBe("3");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.closest(".nutcracker-chooser")).not.toBeNull();
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceControl).toBe("chooser-helpme-fallback");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourcePlacement).toContain(
      "nutchooser.swf button ids 0200 and 0206",
    );
    expect(mount.querySelector(".chooser-source-controls img")).toBeNull();
    expect(mount.querySelector<HTMLImageElement>('[data-nutcracker-door="1"] .chooser-door-art')?.hidden).toBe(true);
    expect(mount.querySelector<HTMLImageElement>('[data-nutcracker-door="2"] .chooser-door-art')?.hidden).toBe(true);
    const firstDoorButton = mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]');
    const firstDoorArt = firstDoorButton?.querySelector<HTMLImageElement>(".chooser-door-art");
    expect(firstDoorButton?.closest<HTMLElement>(".nutcracker-door-card")?.getAttribute("style")).toBe(
      "left:105.02px;top:107.96px;width:77.97px;height:191.10px",
    );
    expect(firstDoorArt?.src).toContain("chooser-open-door");
    expect(firstDoorArt?.getAttribute("style")).toBe(
      "left:14.74px;top:-0.42px;width:107.70px;height:204.63px;transform:none",
    );
    expect(firstDoorArt?.dataset.sourceCrop).toContain("x 130 y 105");
    expect(firstDoorArt?.dataset.sourceImage).toContain(
      "only when the recovered door# completion flag equals 1",
    );
    const hiddenMagicKey = mount.querySelector<HTMLImageElement>(".nutcracker-chooser-magic-key");
    expect(hiddenMagicKey?.src).toContain("chooser-magic-key");
    expect(hiddenMagicKey?.hidden).toBe(true);
    expect(hiddenMagicKey?.dataset.sourceVisible).toBe("false");
    expect(hiddenMagicKey?.dataset.sourcePlacement).toContain("sprite id 0213 at depth 0175");
    expect(hiddenMagicKey?.dataset.sourceAction).toContain("nutDoorsVisited equals 8");
    expect(hiddenMagicKey?.dataset.sourceImage).toContain("swfcombine wrapper");
    mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-4 .source-flying-help-text-fill")?.textContent).toBe(
      "Help",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFrame).toBe("4");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.textContent?.trim()).toBe("");
    mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const chooserHelp = mount.querySelector<HTMLElement>(".source-chooser-help-modal");
    expect(chooserHelp).not.toBeNull();
    expect(chooserHelp?.dataset.sourceFrame).toBe("nutchooser.swf helpframe");
    expect(chooserHelp?.dataset.sourcePlacement).toContain("sprite id 0170");
    expect(chooserHelp?.dataset.sourcePlacement).toContain("noAction id 0171");
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-help-modal img")?.src).toContain(
      "nutchooser-frame-source",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-helpframe-talker")?.src).toContain(
      "chooser-helpframe-talker",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-helpframe-talker")?.dataset.sourceImage).toContain(
      "sprite id 0169",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-helpframe-talker")?.dataset.sourceImage).toContain(
      "translated wrapper x 150 y 120",
    );
    expect(mount.querySelector<HTMLParagraphElement>(".source-chooser-help-modal p")?.classList.contains("sr-only")).toBe(
      true,
    );
    expect(mount.querySelector(".source-chooser-help-modal h2")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const chooserWarning = mount.querySelector<HTMLElement>(".source-chooser-warning-modal");
    expect(chooserWarning).not.toBeNull();
    expect(chooserWarning?.dataset.sourceFrame).toBe("nutchooser.swf warningFrame");
    expect(chooserWarning?.dataset.sourcePlacement).toContain("sprite id 0177");
    expect(chooserWarning?.dataset.sourcePlacement).toContain("YES button id 0183");
    expect(chooserWarning?.dataset.sourcePlacement).toContain("NO button id 0188");
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-warningframe-talker")?.src).toContain(
      "chooser-warningframe-talker",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-warningframe-talker")?.dataset.sourceImage).toContain(
      "sprite id 0177",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-yes")?.dataset.sourceBody).toContain("shape id 0179");
    expect(mount.querySelector<HTMLImageElement>(".source-warning-yes .source-warning-button-body")?.src).toContain(
      "chooser-warning-yes-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-warning-yes .source-warning-button-label")?.src).toContain(
      "chooser-warning-yes-label",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-yes")?.dataset.sourceAction).toContain("comeAgain");
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-no")?.dataset.sourceBody).toContain("shape id 0184");
    expect(mount.querySelector<HTMLImageElement>(".source-warning-no .source-warning-button-body")?.src).toContain(
      "chooser-warning-no-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-warning-no .source-warning-button-label")?.src).toContain(
      "chooser-warning-no-label",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-no")?.dataset.sourceAction).toContain(
      "quiter to buttonON",
    );
    mount.querySelector<HTMLButtonElement>(".source-warning-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector(".source-chooser-warning-modal")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>(".source-warning-yes")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain("Main Menu");
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const playCountBeforeChooserPreview = FakeAudioElement.playedSources.length;
    mount.querySelector<HTMLButtonElement>('[data-nutcracker-preview="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(FakeAudioElement.playedSources.slice(playCountBeforeChooserPreview)).toEqual([
      "/local-media/audio/games/nutcrackergame/song1/track1.mp3",
      "/local-media/audio/games/nutcrackergame/song1/track2.mp3",
      "/local-media/audio/games/nutcrackergame/song1/track5.mp3",
      "/local-media/audio/games/nutcrackergame/song1/track8.mp3",
    ]);
    mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Dance of the Sugar Plum Fairy");
    expect(mount.textContent).toContain("Track 1");
    expect(mount.textContent).toContain("Start 10.9s");
    expect(mount.textContent).toContain("Listen to the original song and find  4 correct instruments.");
    const sourceFrame = mount.querySelector<HTMLImageElement>(".song-source-frame");
    expect(sourceFrame?.src).toContain("song1-source-interactive");
    expect(sourceFrame?.dataset.sourceClassification).toBe("original source-runtime capture");
    expect(sourceFrame?.dataset.sourceImage).toContain("external character animation SWFs withheld");
    expect(mount.querySelector(".song-source-scenery")).toBeNull();
    expect(mount.querySelector(".source-hint-alert")).toBeNull();
    expect(mount.textContent).toContain("HINT");
    expect(mount.textContent).toContain("LISTEN");
    expect(mount.textContent).toContain("EXIT");

    const listenButton = mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]');
    expect(listenButton?.dataset.songAction).toBe("play-theme");
    expect(listenButton?.dataset.sourcePlacement).toContain("sprite id 0144");
    expect(listenButton?.dataset.sourceHitRect).toBe("52.18,235.59,64.39,43.13");
    expect(listenButton?.dataset.sourceHelp).toBe("Listen to the Original Music");
    const playCountBeforeSongPreview = FakeAudioElement.playedSources.length;
    listenButton?.click();
    expect(FakeAudioElement.playedSources.slice(playCountBeforeSongPreview)).toEqual([
      "/local-media/audio/games/nutcrackergame/song1/track1.mp3",
      "/local-media/audio/games/nutcrackergame/song1/track2.mp3",
      "/local-media/audio/games/nutcrackergame/song1/track5.mp3",
      "/local-media/audio/games/nutcrackergame/song1/track8.mp3",
    ]);
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dataset.sourceHelp).toBe(
      "Stop the Music",
    );
    expect(
      mount.querySelector<HTMLImageElement>('[data-source-control="listenSong"] .source-button-label')?.src,
    ).toContain("song-stop-label-blue");

    const helpButton = mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]');
    expect(helpButton?.dataset.action).toBe("help");
    expect(helpButton?.dataset.sourcePlacement).toContain("sprite id 0120");
    expect(helpButton?.dataset.sourceHitRect).toBe("532.13,141.95,51.98,38.48");
    expect(helpButton?.dataset.sourceHelp).toBe("Help");
    helpButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector<HTMLElement>(".source-song-help-modal")?.dataset.sourceFrame).toBe(
      "song1/song.swf helpframe",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-helpframe-talker")?.src).toContain(
      "song-helpframe-talker",
    );
    expect(mount.querySelector(".song-interaction-surface")?.hasAttribute("inert")).toBe(true);
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.disabled).toBe(true);
    expect(document.activeElement).toBe(mount.querySelector('[data-modal-dismiss="true"]'));
    mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(mount.querySelector(".source-song-help-modal")).not.toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-modal-dismiss="true"]')?.click();
    expect(mount.querySelector(".source-song-help-modal")).toBeNull();
    expect(document.activeElement).toBe(mount.querySelector('[data-source-control="helpButton"]'));

    mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.click();
    const previewInstances = FakeAudioElement.instances.slice(-4);
    const hintButton = mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]');
    expect(hintButton?.dataset.songAction).toBe("hint-song");
    expect(hintButton?.dataset.sourcePlacement).toContain("sprite id 0127");
    expect(hintButton?.dataset.sourceHitRect).toBe("532.76,240.75,51.96,38.21");
    expect(hintButton?.dataset.sourceHelp).toBe("Hint");
    hintButton?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-4 .source-flying-help-text-fill")?.textContent).toBe(
      "Hint",
    );
    hintButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain("All songs are played by 4 instruments!");
    expect(mount.querySelector<HTMLElement>(".source-hint-alert")?.dataset.sourceFrame).toBe(
      "song1/song.swf courtain giveHint",
    );
    expect(mount.querySelector(".source-play-again-button")).toBeNull();
    expect(previewInstances.every((instance) => instance.paused)).toBe(true);
    expect(mount.querySelector(".song-interaction-surface")?.hasAttribute("inert")).toBe(true);
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')?.disabled).toBe(true);
    expect(document.activeElement).toBe(mount.querySelector('[data-song-action="dismiss-hint"]'));
    mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')?.dispatchEvent(
      new MouseEvent("click", { bubbles: true }),
    );
    expect(mount.querySelector(".source-hint-alert")).not.toBeNull();
    expect(mount.querySelector(".source-change-alert")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-song-action="dismiss-hint"]')?.click();
    expect(mount.querySelector(".source-hint-alert")).toBeNull();
    expect(document.activeElement).toBe(mount.querySelector('[data-source-control="hintButton"]'));

    const changeSongButton = mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]');
    expect(changeSongButton?.dataset.songAction).toBe("confirm-change-song");
    expect(changeSongButton?.dataset.sourcePlacement).toContain("sprite id 0133");
    expect(changeSongButton?.dataset.sourceHitRect).toBe("57.82,136.05,56.73,43.23");
    expect(changeSongButton?.dataset.sourceHelp).toBe("Select a\ndifferent\nsong");
    changeSongButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain('press "Yes" to change this song or "No" to cancel');
    expect(mount.querySelector(".source-hint-alert")).toBeNull();
    expect(mount.querySelector(".source-song-actions-blocked")).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.disabled).toBe(true);
    expect(document.activeElement).toBe(mount.querySelector('[data-song-action="cancel-change-song"]'));
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-fill")?.src).toContain("song-curtain-fill");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-fill")?.dataset.sourceImage).toContain(
      "shape id 0038",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-curve")?.src).toContain(
      "song-curtain-curve-cxform",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-curve")?.dataset.sourceImage).toContain(
      "shape id 0040",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-stars")?.src).toContain("song-curtain-stars");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-stars")?.dataset.sourceImage).toContain(
      "shape id 0041",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-yes img")?.src).toContain("song-yes-label");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-no img")?.src).toContain("song-no-label");
    mount.querySelector<HTMLButtonElement>(".source-alert-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).not.toContain('press "Yes" to change this song or "No" to cancel');
    expect(document.activeElement).toBe(mount.querySelector('[data-source-control="songChooser"]'));
    const exitButton = mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]');
    expect(exitButton?.dataset.sourcePlacement).toContain("sprite id 0150");
    expect(exitButton?.dataset.sourceHitRect).toBe("549.72,449.05,72.36,46.89");
    expect(exitButton?.dataset.sourceHelp).toBe("Quit the Game");
    expect(exitButton?.dataset.songAction).toBe(
      "confirm-exit-song",
    );
    expect(exitButton?.dataset.sourceAction).toContain(
      "warningFrame",
    );
    exitButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const songWarning = mount.querySelector<HTMLElement>(".source-song-warning-modal");
    expect(songWarning).not.toBeNull();
    expect(songWarning?.dataset.sourceFrame).toBe("song1/song.swf warningFrame");
    expect(songWarning?.dataset.sourceClassification).toBe("swf-derived recreation");
    expect(songWarning?.dataset.sourcePlacement).toContain("sprite id 0340");
    expect(songWarning?.dataset.sourcePlacement).toContain("YES button id 0346");
    expect(songWarning?.dataset.sourcePlacement).toContain("NO button id 0351");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.disabled).toBe(true);
    expect(document.activeElement).toBe(mount.querySelector('[data-song-action="cancel-exit-song"]'));
    expect(mount.querySelector<HTMLImageElement>(".source-song-warningframe-talker")?.src).toContain(
      "song-warningframe-talker",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-song-warning-yes")?.dataset.sourceBody).toContain(
      "shape id 0344",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-yes .source-warning-button-body")?.src).toContain(
      "song-warning-yes-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-yes .source-warning-button-label")?.src).toContain(
      "song-warning-yes-label",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-song-warning-no")?.dataset.sourceBody).toContain(
      "shape id 0349",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-no .source-warning-button-body")?.src).toContain(
      "song-warning-no-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-no .source-warning-button-label")?.src).toContain(
      "song-warning-no-label",
    );
    mount.querySelector<HTMLButtonElement>(".source-song-warning-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector(".source-song-warning-modal")).toBeNull();
    expect(document.activeElement).toBe(mount.querySelector('[data-source-control="quiter"]'));
    expect(mount.textContent).toContain("Dance of the Sugar Plum Fairy");
    const refreshedHintButton = mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]');
    refreshedHintButton?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-4 .source-flying-help-text-fill")?.textContent).toBe(
      "Hint",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFrame).toBe("4");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceBounds).toContain("sprite id 0240");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceLayerModel).toContain(
      "edit ids 0237/0238",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceClassification).toBe(
      "documented fallback",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFallback).toContain(
      "dynamic edit text",
    );
    refreshedHintButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain("All songs are played by 4 instruments!");
    expect(mount.querySelector<HTMLElement>(".source-hint-alert")?.dataset.sourceFrame).toBe(
      "song1/song.swf courtain giveHint",
    );
    expect(mount.querySelector<HTMLElement>(".source-hint-alert")?.dataset.sourcePlacement).toContain(
      "_root.message edit id 0058",
    );
    expect(mount.querySelector<HTMLElement>(".source-hint-alert")?.dataset.sourceClassification).toBe(
      "swf-derived recreation",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-song-action="dismiss-hint"]')?.dataset.sourceButton).toContain(
      "button id 0057",
    );
    mount.querySelector<HTMLButtonElement>('[data-song-action="dismiss-hint"]')?.click();
    mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>(".source-song-warning-yes")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')).not.toBeNull();
    expect(mount.textContent).not.toContain("Test");
    expect(mount.textContent).not.toContain("Correct arrangement");
    expect(mount.textContent).toContain("Song doors");
    mount.remove();
  });

  it("shows the source magic key only after all Nutcracker doors are complete", () => {
    const mount = document.createElement("main");

    createTestShell(mount, (progress) => {
      nutcrackerSongGames.forEach((song) => {
        progress.markNutDoor(song.id);
      });
    });
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const magicKey = mount.querySelector<HTMLImageElement>(".nutcracker-chooser-magic-key");
    expect(magicKey?.hidden).toBe(false);
    expect(magicKey?.dataset.sourceVisible).toBe("true");
    expect(magicKey?.src).toContain("chooser-magic-key");
    expect(
      [...mount.querySelectorAll<HTMLImageElement>(".chooser-door-art")].every((doorArt) => !doorArt.hidden),
    ).toBe(true);
    expect(
      mount.querySelector<HTMLImageElement>('[data-nutcracker-door="2"] .chooser-door-art')?.getAttribute("style"),
    ).toBe("left:-36.13px;top:3.78px;width:107.70px;height:204.63px;transform:scaleX(-1)");
  });

  it("maps Nutcracker songs to their matching gramophone records", () => {
    expect(nutcrackerSongGames.map((song) => song.suiteTrackId)).toEqual([
      "theme-9",
      "theme-14",
      "theme-16",
      "theme-11",
      "theme-12",
      "theme-13",
      "theme-15",
      "theme-10",
    ]);
  });

  it("renders each Nutcracker song as one complete source-runtime frame", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-source-frame")?.src).toContain(
      "nutchooser-source-normal",
    );

    nutcrackerSongGames.forEach((song) => {
      mount.querySelector<HTMLButtonElement>(`[data-route="song-${song.id}"]`)?.dispatchEvent(
        new MouseEvent("click", { bubbles: true }),
      );

      expect(mount.querySelector<HTMLImageElement>(".song-source-frame")?.src).toContain(
        `song${song.id}-source-interactive`,
      );
      expect(mount.querySelector<HTMLImageElement>(".song-source-frame")?.dataset.sourceClassification).toBe(
        "original source-runtime capture",
      );
      expect(mount.querySelector(".song-source-scenery")).toBeNull();
      expect(mount.querySelector(".source-hint-alert")).toBeNull();
    });
    expect(mount.textContent).not.toContain("Test");
  });

  it("shows selected Nutcracker instruments as source-extracted stage actors", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="song-1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const instrumentButton = mount.querySelector<HTMLButtonElement>('[data-song-id="1"][data-song-track="1"]');

    expect(instrumentButton?.getAttribute("draggable")).toBe("true");
    expect(instrumentButton?.getAttribute("aria-label")).toContain("double click or drag onto the stage");

    instrumentButton?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.src).toContain("song1-track1-actor");
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.dataset.sourceAnimation).toBe(
      "games/nutcrackergame/song1/characters/anim1.swf",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.dataset.sourceClassification).toBe(
      "documented fallback",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.dataset.sourceFallback).toContain(
      "no frame selector",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.dataset.sourceFallback).toContain(
      "extracted later frames can crash",
    );
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceHelp).toBe("BASS");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceHelpFrame).toBe("2");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourcePlacement).toContain("instIMG1");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceVectorBounds).toContain("shape id 0172");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-4")?.dataset.sourcePlacement).toContain("instIMG4");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-4")?.dataset.sourceHitRect).toBe("246,334,154,44");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceControl).toBe("flyinghelp");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourcePlacement).toContain("id 0257 depth 0306");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceBounds).toContain("frames 2/3");
    expect(mount.querySelectorAll(".source-flying-help-frame-2 .source-flying-help-text")).toHaveLength(3);
    expect(mount.querySelectorAll(".source-flying-help-frame-4 .source-flying-help-text")).toHaveLength(2);
    mount
      .querySelector<HTMLButtonElement>('[data-song-id="1"][data-song-track="7"]')
      ?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-2 .source-flying-help-text-fill")?.textContent).toBe(
      "DRUM",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFrame).toBe("2");

    mount.querySelector<HTMLButtonElement>('[data-route="song-5"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount
      .querySelector<HTMLButtonElement>('[data-song-id="5"][data-song-track="7"]')
      ?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-song-5.source-selected-actor-7")?.src).toContain(
      "song5-track7-actor",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-song-5.source-selected-actor-7")?.dataset.sourceAnimation).toBe(
      "games/nutcrackergame/song5/characters/anim7.swf",
    );
    expect(
      mount.querySelector<HTMLImageElement>(".source-selected-actor-song-5.source-selected-actor-7")?.dataset.sourceFallback,
    ).toContain("per-song source bitmap");
    expect(
      mount.querySelector<HTMLImageElement>(".source-selected-actor-song-5.source-selected-actor-7")?.dataset.sourcePlayback,
    ).toBe("documented source-derived fallback");
  });

  it("checks each Nutcracker song game and unlocks the first progress key after all doors", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    nutcrackerSongGames.forEach((song) => {
      mount.querySelector<HTMLButtonElement>(`[data-route="${song.routeId}"]`)?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      getCorrectNutcrackerTrackNumbers(song).forEach((trackNumber) => {
        mount
          .querySelector<HTMLButtonElement>(`[data-song-id="${song.id}"][data-song-track="${trackNumber}"]`)
          ?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      });

      expect(mount.textContent).toContain("Door cleared.");
      expect(mount.querySelector(".source-hint-alert")).toBeNull();
      expect(mount.textContent).toContain("PLAY AGAIN");
      expect(mount.querySelector<HTMLElement>(".source-play-again-button")?.dataset.sourceControl).toBe("gameController");
      expect(mount.querySelector<HTMLElement>(".source-play-again-button")?.dataset.sourcePlacement).toContain(
        "id 0115 depth 0116",
      );
      expect(mount.querySelector<HTMLElement>(".source-play-again-button")?.dataset.sourceBody).toContain("shape id 0113");
      expect(mount.querySelector<HTMLImageElement>(".source-play-again-button .source-button-body")?.src).toContain(
        "song-play-again-button-body",
      );
      expect(mount.querySelector<HTMLImageElement>(".source-play-again-button .source-button-label")?.src).toContain(
        "song-play-again-label",
      );
      if (song.id === nutcrackerSongGames.length) {
        expect(mount.querySelector<HTMLElement>(".source-song-keyframe")?.dataset.sourceFrame).toBe(
          "song1/song.swf keyFrame",
        );
        expect(mount.querySelector<HTMLElement>(".source-song-keyframe")?.dataset.sourceAction).toContain(
          "saveKey1.exe",
        );
        expect(mount.querySelector<HTMLImageElement>(".source-song-keyframe img")?.src).toContain(
          "song-keyframe-talker",
        );
      } else {
        expect(mount.querySelector(".source-song-keyframe")).toBeNull();
      }
    });

    expect(mount.textContent).toContain("Game keys1/9");
    expect(mount.textContent).toContain("Song doors");
    expect(mount.textContent).toContain("8/8");
  });

  it("unlocks the source-backed Nutcracker certificate print flow with game key 1", () => {
    const lockedMount = document.createElement("main");
    createTestShell(lockedMount);
    expect(lockedMount.querySelector('[data-action="print-certificate"]')).toBeNull();
    expect(lockedMount.querySelector(".certificate-print-surface")).toBeNull();

    const mount = document.createElement("main");
    const progress = createProgressStore(createMemoryPersistence());
    progress.markGameKey(1);
    const printCertificate = vi.fn();
    createAppShell(mount, {
      progress,
      audio: createAudioService({
        createAudioElement: () => new FakeAudioElement(),
      }),
      printCertificate,
    });

    const printButton = mount.querySelector<HTMLButtonElement>('[data-action="print-certificate"]');
    expect(printButton?.textContent).toContain("Print / Save PDF");
    expect(printButton?.dataset.sourceReward).toBe("gameKey1");
    expect(mount.querySelector<HTMLImageElement>(".certificate-print-surface img")?.src).toContain(
      "nutcracker-club-certificate",
    );
    expect(mount.querySelector<HTMLElement>(".certificate-print-surface")?.dataset.sourceAction).toContain(
      "print:#bmax",
    );
    expect(mount.querySelector<HTMLElement>(".certificate-print-surface")?.dataset.sourceFallback).toContain(
      "window.print",
    );

    printButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(printCertificate).toHaveBeenCalledOnce();
  });

  it("marks the next Nutcracker door ready after clearing a song", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="song-1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    getCorrectNutcrackerTrackNumbers(nutcrackerSongGames[0]).forEach((trackNumber) => {
      mount
        .querySelector<HTMLButtonElement>(`[data-song-id="1"][data-song-track="${trackNumber}"]`)
        ?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    });
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.dataset.doorState).toBe("cleared");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.dataset.doorState).toBe("ready");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.disabled).toBe(false);
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="3"]')?.disabled).toBe(true);
  });

  it("uses real local image assets for reading activities", () => {
    const imagePaths = readingActivities.flatMap((activity) =>
      activity.pages.flatMap((page) => page.columns.flatMap((column) => column.imagePaths ?? [])),
    );

    imagePaths.forEach((imagePath) => {
      expect(publicAssetSize(imagePath)).toBeGreaterThan(1000);
    });

    readingActivities.forEach((activity) => {
      activity.pages.forEach((page, index) => {
        expect(page.sceneImagePath).toContain(`${activity.sourceSwfPath.split("/")[1]}-reader-frame-${index + 1}`);
      });
    });
  });

  it("uses extracted local narration for every reading activity", () => {
    const expectedAudioIds = new Map([
      ["story", 31],
      ["composer-biography", 32],
      ["ballet-history", 33],
    ]);

    readingActivities.forEach((activity) => {
      const sourceDirectory = activity.sourceSwfPath.split("/")[1];
      expect(activity.audioPath).toBe(`/local-media/audio/activities/${sourceDirectory}/${expectedAudioIds.get(activity.routeId)}.mp3`);
      if (!activity.audioPath) throw new Error(`${activity.routeId} is missing its source narration path`);
      expect(publicAssetSize(activity.audioPath)).toBeGreaterThan(1000);
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
      expect(publicAssetSize(instrument.audioPath)).toBeGreaterThan(1000);
    });
  });
});
