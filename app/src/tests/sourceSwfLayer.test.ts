import { afterEach, describe, expect, it, vi } from "vitest";
import { alicePreviewHandoffMs, createAppShell, fluteIntroHandoffMs } from "../app";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import {
  buildRuffleLoadOptions,
  createSourceSwfLayer,
  sourceSwfStartTimeoutMs,
  type RuffleLoader,
  type RufflePlayerElement,
  type SourceSwfPlayback,
} from "../flash/sourceSwfLayer";
import { createProgressStore, type ProgressPersistence } from "../state/progressStore";

class SilentAudio implements AudioElementLike {
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

type FakeRuffle = { loader: RuffleLoader; players: RufflePlayerElement[]; loads: Record<string, unknown>[] };

function createFakeRuffle(): FakeRuffle {
  const players: RufflePlayerElement[] = [];
  const loads: Record<string, unknown>[] = [];
  const loader: RuffleLoader = () =>
    Promise.resolve({
      createPlayer: () => {
        const element = document.createElement("ruffle-fake") as unknown as RufflePlayerElement;
        element.ruffle = () => ({
          load: (options) => {
            loads.push(options);
            return Promise.resolve();
          },
        });
        players.push(element);
        return element;
      },
    });
  return { loader, players, loads };
}

function playback(overrides: Partial<SourceSwfPlayback> = {}): SourceSwfPlayback {
  return {
    swfUrl: "/assets/flute-intro.swf",
    handoffAfterMs: 84400,
    quality: "medium",
    skipTarget: { left: 0.955, top: 0.9433, width: 0.045, height: 0.05 },
    onSkip: vi.fn(),
    onEnd: vi.fn(),
    onError: vi.fn(),
    ...overrides,
  };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  vi.useRealTimers();
  document.querySelectorAll(".source-swf-layer").forEach((layer) => layer.remove());
});

describe("source SWF layer (Ruffle)", () => {
  it("loads the movie with no Ruffle chrome: autoplay, no splash, no unmute badge, no menu, no network", () => {
    expect(buildRuffleLoadOptions({ swfUrl: "/x.swf", quality: "medium" })).toMatchObject({
      url: "/x.swf",
      publicPath: "/ruffle/",
      autoplay: "on",
      unmuteOverlay: "hidden",
      splashScreen: false,
      contextMenu: "off",
      menu: false,
      scale: "showAll",
      quality: "medium",
      allowNetworking: "none",
      openUrlMode: "deny",
    });
  });

  it("Given a stage, when the intro plays, then a player is mounted outside the stage and survives re-pinning", async () => {
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const stage = document.createElement("div");
    document.body.append(stage);

    layer.play(stage, playback());
    await flush();
    layer.play(stage, playback());
    await flush();

    expect(fake.players).toHaveLength(1);
    expect(fake.loads).toHaveLength(1);
    const host = document.querySelector(".source-swf-layer");
    expect(host?.contains(fake.players[0])).toBe(true);
    expect(stage.contains(fake.players[0])).toBe(false);
    stage.remove();
  });

  it("Given the movie started, when the source hand-off time passes, then onEnd fires once", async () => {
    vi.useFakeTimers();
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = playback();
    layer.play(document.createElement("div"), config);
    await vi.advanceTimersByTimeAsync(0);
    fake.players[0].dispatchEvent(new Event("loadedmetadata"));

    await vi.advanceTimersByTimeAsync(84399);
    expect(config.onEnd).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(config.onEnd).toHaveBeenCalledTimes(1);
  });

  it("Given the movie is playing, when the mouse is released anywhere or skip is pressed, then onSkip fires once", async () => {
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = playback();
    layer.play(document.createElement("div"), config);
    await flush();

    const host = document.querySelector<HTMLElement>(".source-swf-layer");
    host?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));
    host?.querySelector<HTMLButtonElement>(".source-swf-skip-target")?.click();

    expect(config.onSkip).toHaveBeenCalledTimes(1);
  });

  it("Given the SWF never starts (404 or corrupt), when the watchdog expires, then the layer is removed and onError fires", async () => {
    vi.useFakeTimers();
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = playback();
    layer.play(document.createElement("div"), config);
    await vi.advanceTimersByTimeAsync(sourceSwfStartTimeoutMs);

    expect(config.onError).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".source-swf-layer")).toBeNull();
    expect(config.onEnd).not.toHaveBeenCalled();
  });

  it("Given the movie started, then the start watchdog no longer fires", async () => {
    vi.useFakeTimers();
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = playback();
    layer.play(document.createElement("div"), config);
    await vi.advanceTimersByTimeAsync(0);
    fake.players[0].dispatchEvent(new Event("loadedmetadata"));
    await vi.advanceTimersByTimeAsync(sourceSwfStartTimeoutMs);

    expect(config.onError).not.toHaveBeenCalled();
  });

  it("Given the movie is playing, when the mouse is released on the letterbox outside the stage, then onSkip fires", async () => {
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = playback();
    layer.play(document.createElement("div"), config);
    await flush();

    document.body.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));

    expect(config.onSkip).toHaveBeenCalledTimes(1);
    layer.stop();
  });

  it("Given the page scrolls, then the layer follows the stage rect", async () => {
    const fake = createFakeRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const stage = document.createElement("div");
    let top = 10;
    stage.getBoundingClientRect = () => ({ left: 5, top, width: 640, height: 480, right: 645, bottom: top + 480, x: 5, y: top, toJSON: () => ({}) });
    layer.play(stage, playback());
    await flush();
    top = -200;
    window.dispatchEvent(new Event("scroll"));

    expect(document.querySelector<HTMLElement>(".source-swf-layer")?.style.top).toBe("-200px");
    layer.stop();
  });

  it("Given Ruffle cannot load, then the layer is removed and onError fires", async () => {
    const layer = createSourceSwfLayer(() => Promise.reject(new Error("no wasm")));
    const config = playback();
    layer.play(document.createElement("div"), config);
    await flush();

    expect(config.onError).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".source-swf-layer")).toBeNull();
    expect(layer.isPlaying()).toBe(false);
  });
});

describe("source SWF layer: interactive projector session", () => {
  function createInteractiveRuffle() {
    const calls: string[] = [];
    const loads: Record<string, unknown>[] = [];
    const fsHandlers: ((command: string, args: string) => void)[] = [];
    const players: RufflePlayerElement[] = [];
    const loader: RuffleLoader = () =>
      Promise.resolve({
        createPlayer: () => {
          const element = document.createElement("ruffle-fake") as unknown as RufflePlayerElement;
          const api = {
            load: (options: Record<string, unknown>) => {
              loads.push(options);
              return Promise.resolve();
            },
            addFSCommandHandler: (handler: (command: string, args: string) => void) => fsHandlers.push(handler),
            pause: () => calls.push("pause"),
            resume: () => calls.push("resume"),
          };
          element.ruffle = () => api;
          players.push(element);
          return element;
        },
      });
    return { loader, calls, loads, fsHandlers, players };
  }

  const projector = (overrides: Partial<SourceSwfPlayback> = {}): SourceSwfPlayback => ({
    swfUrl: "/assets/projector-nutcracker2.swf",
    sessionKey: "projector@1267",
    loadData: () => Promise.resolve(new Uint8Array([0x46, 0x57, 0x53])),
    interactive: true,
    base: "http://localhost/__projector/",
    quality: "medium",
    onFSCommand: vi.fn(),
    onError: vi.fn(),
    ...overrides,
  });

  it("Given the live projector, then Ruffle gets its bytes, its base, networking, and URL opening for the shell boundary", async () => {
    const fake = createInteractiveRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    layer.play(document.createElement("div"), projector());
    await flush();

    expect(fake.loads[0]).toMatchObject({ base: "http://localhost/__projector/", allowNetworking: "all", openUrlMode: "allow" });
    expect(fake.loads[0]?.data).toBeInstanceOf(Uint8Array);
    expect(fake.loads[0]).not.toHaveProperty("url");
    layer.stop();
  });

  it("Given the live projector, then it takes its own pointer input: no skip target and no release-anywhere hand-off", async () => {
    const fake = createInteractiveRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = projector({ onSkip: vi.fn() });
    layer.play(document.createElement("div"), config);
    await flush();
    fake.players[0].dispatchEvent(new Event("loadedmetadata"));

    window.dispatchEvent(new PointerEvent("pointerup", { button: 0 }));

    expect(document.querySelector(".source-swf-skip-target")).toBeNull();
    expect(document.querySelector<HTMLElement>(".source-swf-layer")?.dataset.interactive).toBe("true");
    expect(config.onSkip).not.toHaveBeenCalled();
    layer.stop();
  });

  it("Given the projector sends an fscommand, then the shell receives it until the session ends", async () => {
    const fake = createInteractiveRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = projector();
    layer.play(document.createElement("div"), config);
    await flush();

    fake.fsHandlers[0]?.("quit", "");
    expect(config.onFSCommand).toHaveBeenCalledWith("quit", "");
    layer.stop();
    fake.fsHandlers[0]?.("quit", "");
    expect(config.onFSCommand).toHaveBeenCalledTimes(1);
  });

  it("Given a game route opens, when the projector is suspended and resumed, then the same player pauses, hides, and resumes", async () => {
    const fake = createInteractiveRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const stage = document.createElement("div");
    layer.play(stage, projector());
    await flush();

    layer.suspend();
    expect(document.querySelector<HTMLElement>(".source-swf-layer")?.dataset.suspended).toBe("true");
    expect(layer.isSuspended()).toBe(true);
    layer.play(stage, projector());

    expect(layer.isSuspended()).toBe(false);
    expect(fake.calls).toEqual(["pause", "resume"]);
    expect(fake.players).toHaveLength(1);
    expect(layer.activeSession()).toBe("projector@1267");
    layer.stop();
  });

  it("Given the movie bytes cannot load, then onError fires and the layer is removed", async () => {
    const fake = createInteractiveRuffle();
    const layer = createSourceSwfLayer(fake.loader);
    const config = projector({ loadData: () => Promise.reject(new Error("HTTP 404")) });
    layer.play(document.createElement("div"), config);
    await flush();

    expect(config.onError).toHaveBeenCalledTimes(1);
    expect(document.querySelector(".source-swf-layer")).toBeNull();
  });
});

describe("overture plays flute_intro.swf through Ruffle", () => {
  function launchShell(loader: RuffleLoader) {
    const mount = document.createElement("main");
    document.body.append(mount);
    createAppShell(mount, {
      progress: createProgressStore(createMemoryPersistence()),
      audio: createAudioService({ createAudioElement: () => new SilentAudio() }),
      showDeveloperPanel: false,
      sourceSwfLayer: createSourceSwfLayer(loader),
    });
    return mount;
  }

  // The intro is the launcher's Musical Friends preview (MFBtn -> root frame 2 MFIntro).
  function createShell(loader: RuffleLoader) {
    const mount = launchShell(loader);
    mount.querySelector<HTMLButtonElement>('[data-action="preview-musical-friends"]')?.click();
    return mount;
  }

  const layerSession = () => document.querySelector<HTMLElement>(".source-swf-layer")?.dataset.sourceSession ?? null;

  it("Given app launch, then the live projector starts on the launcher (frame 1 jumps to choose), with no intro", async () => {
    const fake = createFakeRuffle();
    const mount = launchShell(fake.loader);
    await flush();

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    expect(mount.querySelector(".source-intro-scene")).toBeNull();
    expect(layerSession()).toBe("projector@1267");
    expect(fake.loads.some((options) => String(options.url).includes("flute-intro"))).toBe(false);
    mount.remove();
  });

  it("hands off after the projector's 1266 intro frames at 15 fps", () => {
    expect(fluteIntroHandoffMs).toBe(84400);
  });

  it("Given the overture route is re-entered from the route map, then it lands on the launcher without replaying the intro", async () => {
    const fake = createFakeRuffle();
    const mount = document.createElement("main");
    document.body.append(mount);
    createAppShell(mount, {
      progress: createProgressStore(createMemoryPersistence()),
      audio: createAudioService({ createAudioElement: () => new SilentAudio() }),
      showDeveloperPanel: true,
      sourceSwfLayer: createSourceSwfLayer(fake.loader),
    });
    mount.querySelector<HTMLButtonElement>('[data-action="play-featured-game"]')?.click();
    expect(mount.querySelector(".source-projector-launcher")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-route="overture"]')?.click();
    await flush();

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    expect(mount.querySelector(".source-intro-scene")).toBeNull();
    expect(fake.loads).toHaveLength(0);
    mount.remove();
  });

  it("Given the Musical Friends preview, then the source intro movie loads and the fallback skip leaves the tab order", async () => {
    const fake = createFakeRuffle();
    const mount = createShell(fake.loader);
    await flush();

    expect(String(fake.loads[0]?.url)).toContain("flute-intro");
    expect(mount.querySelector(".source-intro-skip")?.getAttribute("tabindex")).toBe("-1");
    expect(document.querySelector(".source-swf-skip-target")?.getAttribute("aria-label")).toBe("skip");
    mount.remove();
  });

  it("Given the intro is playing, when the player releases the mouse, then the launcher shows and the movie stops", async () => {
    const fake = createFakeRuffle();
    const mount = createShell(fake.loader);
    await flush();

    document.querySelector(".source-swf-layer")?.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    expect(fake.players[0].isConnected).toBe(false);
    expect(layerSession()).toBe("projector@1267");
    mount.remove();
  });

  it("Given the intro runs to its hand-off frame, then the launcher shows", async () => {
    vi.useFakeTimers();
    const fake = createFakeRuffle();
    const mount = createShell(fake.loader);
    await vi.advanceTimersByTimeAsync(0);
    fake.players[0].dispatchEvent(new Event("loadedmetadata"));
    await vi.advanceTimersByTimeAsync(fluteIntroHandoffMs);

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    mount.remove();
  });

  it("Given the launcher, when Musical Friends preview is chosen, then the intro movie plays again from the start", async () => {
    const fake = createFakeRuffle();
    const mount = createShell(fake.loader);
    await flush();
    document.querySelector<HTMLButtonElement>(".source-swf-skip-target")?.click();
    mount.querySelector<HTMLButtonElement>('[data-action="preview-musical-friends"]')?.click();
    await flush();

    expect(fake.players).toHaveLength(2);
    expect(fake.players[1].isConnected).toBe(true);
    mount.remove();
  });

  it("hands the Alice preview back at aliceJump, 607 projector frames after aliceIntro", () => {
    expect(alicePreviewHandoffMs).toBe(40467);
  });

  async function openAlicePreview(fake: FakeRuffle) {
    const mount = createShell(fake.loader);
    await flush();
    document.querySelector<HTMLButtonElement>(".source-swf-skip-target")?.click();
    mount.querySelector<HTMLButtonElement>('[data-action="preview-alice"]')?.click();
    await flush();
    return mount;
  }

  it("Given the launcher, when the Alice preview is chosen, then the projector trailer plays instead of the Alice game", async () => {
    const fake = createFakeRuffle();
    const mount = await openAlicePreview(fake);

    expect(mount.querySelector(".source-alice-preview-scene")).not.toBeNull();
    expect(mount.querySelector(".m08-alice-scene")).toBeNull();
    expect(String(fake.loads[fake.loads.length - 1]?.url)).toContain("projector-alice-preview");
    expect(document.querySelector<HTMLElement>(".source-swf-layer")?.style.cursor).toBe("pointer");
    expect(document.querySelector(".source-swf-skip-target")?.getAttribute("aria-label")).toBe("EXIT");
    mount.remove();
  });

  it("Given the Alice trailer is playing, when the player clicks anywhere, then the launcher returns", async () => {
    const fake = createFakeRuffle();
    const mount = await openAlicePreview(fake);

    document.body.dispatchEvent(new PointerEvent("pointerup", { bubbles: true, button: 0 }));

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    expect(layerSession()).toBe("projector@1267");
    mount.remove();
  });

  it("Given the Alice trailer runs to aliceJump, then the launcher returns", async () => {
    vi.useFakeTimers();
    const fake = createFakeRuffle();
    const mount = createShell(fake.loader);
    await vi.advanceTimersByTimeAsync(0);
    document.querySelector<HTMLButtonElement>(".source-swf-skip-target")?.click();
    mount.querySelector<HTMLButtonElement>('[data-action="preview-alice"]')?.click();
    await vi.advanceTimersByTimeAsync(0);
    fake.players[fake.players.length - 1]?.dispatchEvent(new Event("loadedmetadata"));
    await vi.advanceTimersByTimeAsync(alicePreviewHandoffMs);

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    mount.remove();
  });

  it("Given Ruffle cannot start the Alice trailer, then the launcher returns instead of a dead end", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    let rejectLoads = false;
    const fake = createFakeRuffle();
    const loader: RuffleLoader = () => (rejectLoads ? Promise.reject(new Error("no wasm")) : fake.loader());
    const mount = createShell(loader);
    await flush();
    document.querySelector<HTMLButtonElement>(".source-swf-skip-target")?.click();
    rejectLoads = true;
    mount.querySelector<HTMLButtonElement>('[data-action="preview-alice"]')?.click();
    await flush();

    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    warn.mockRestore();
    mount.remove();
  });

  it("Given Ruffle fails, then the static source scene keeps a working, tabbable skip", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const mount = createShell(() => Promise.reject(new Error("no wasm")));
    await flush();

    const skip = mount.querySelector<HTMLButtonElement>(".source-intro-skip");
    expect(skip?.hasAttribute("tabindex")).toBe(false);
    skip?.click();
    expect(mount.querySelector(".source-projector-launcher")).not.toBeNull();
    warn.mockRestore();
    mount.remove();
  });
});
