import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppShell, projectorGameRoutes } from "../app";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import {
  buildGameKeysVariables,
  buildProjectorReturnStubSwf,
  normalizeProjectorPath,
  patchProjectorStartFrame,
  projectorBaseUrl,
  projectorStartFrames,
  projectorStartGotoOffset,
} from "../flash/projectorBridge";
import type { SourceSwfLayer, SourceSwfPlayback } from "../flash/sourceSwfLayer";
import { createProgressStore, type ProgressPersistence, type ProgressStoreController } from "../state/progressStore";

const projectorMovie = new Uint8Array(
  readFileSync(path.join(process.cwd(), "src/assets/source-scenes/projector-nutcracker2.swf")),
);

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

type FakeLayer = SourceSwfLayer & { plays: SourceSwfPlayback[]; stops: number; suspended: boolean };

/** Stands in for the Ruffle layer: records sessions the shell starts, suspends, and resumes. */
function createFakeLayer(): FakeLayer {
  let active: string | null = null;
  const fake: FakeLayer = {
    plays: [],
    stops: 0,
    suspended: false,
    play(_stage, playback) {
      const key = playback.sessionKey ?? playback.swfUrl;
      if (active === key) {
        fake.suspended = false;
        return;
      }
      fake.plays.push(playback);
      active = key;
      fake.suspended = false;
    },
    position: () => undefined,
    suspend() {
      if (active) fake.suspended = true;
    },
    resume() {
      fake.suspended = false;
    },
    isSuspended: () => fake.suspended,
    activeSession: () => active,
    stop() {
      fake.stops += 1;
      active = null;
      fake.suspended = false;
    },
    isPlaying: () => active !== null,
  };
  return fake;
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

function launch(options: { progress?: ProgressStoreController; showDeveloperPanel?: boolean } = {}) {
  const mount = document.createElement("main");
  document.body.append(mount);
  const layer = createFakeLayer();
  const progress = options.progress ?? createProgressStore(createMemoryPersistence());
  const openExternal = vi.fn();
  const exitApp = vi.fn();
  createAppShell(mount, {
    progress,
    audio: createAudioService({ createAudioElement: () => new SilentAudio() }),
    showDeveloperPanel: options.showDeveloperPanel ?? false,
    sourceSwfLayer: layer,
    openExternal,
    exitApp,
  });
  const lastPlay = () => layer.plays[layer.plays.length - 1];
  const request = (path: string) => window.fetch(`${projectorBaseUrl()}${path}`);
  return { mount, layer, progress, openExternal, exitApp, lastPlay, request };
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("projector movie start frame", () => {
  it("Given the promoted projector, then its frame-1 GotoFrame targets choose (1267) at the documented byte", () => {
    expect(String.fromCharCode(...projectorMovie.subarray(0, 3))).toBe("FWS");
    expect([...projectorMovie.subarray(projectorStartGotoOffset, projectorStartGotoOffset + 5)]).toEqual([0x81, 0x02, 0x00, 0xf3, 0x04]);
  });

  it("Given a nutIni start, then only the GotoFrame operand changes, in a copy", () => {
    const patched = patchProjectorStartFrame(projectorMovie, projectorStartFrames.nutIni);
    const operand = patched[projectorStartGotoOffset + 3] | (patched[projectorStartGotoOffset + 4] << 8);

    expect(operand).toBe(2143);
    expect(projectorMovie[projectorStartGotoOffset + 3]).toBe(0xf3);
    const differing = patched.reduce((count, byte, index) => count + (byte === projectorMovie[index] ? 0 : 1), 0);
    expect(differing).toBe(2);
  });

  it("Given bytes that are not the projector, then patching refuses", () => {
    expect(() => patchProjectorStartFrame(new Uint8Array(90000), 2143)).toThrow();
  });
});

describe("projector data and stand-in movie", () => {
  it("serves gamekeys.txt in the original install format", () => {
    expect(
      buildGameKeysVariables({ 1: false, 2: true, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: true }),
    ).toBe("&gameKey1=0&gameKey2=1&gameKey3=0&gameKey4=0&gameKey5=0&gameKey6=0&gameKey7=0&gameKey8=0&gameKey9=1&EOF=1");
  });

  it("builds a valid three-frame SWF 6 stand-in that returns with _level0 comeAgain", () => {
    const stub = buildProjectorReturnStubSwf();
    const view = new DataView(stub.buffer, stub.byteOffset, stub.byteLength);
    const text = new TextDecoder("latin1").decode(stub);

    expect(String.fromCharCode(...stub.subarray(0, 3))).toBe("FWS");
    expect(stub[3]).toBe(6);
    expect(view.getUint32(4, true)).toBe(stub.byteLength);
    expect(view.getUint16(17, true)).toBe(15 << 8);
    expect(view.getUint16(19, true)).toBe(3);
    expect(text).toContain("__shell/return.txt");
    expect(text).toContain("comeAgain");
    expect(text).toContain("gameKey9");
  });

  it("normalizes projector paths and ignores other URLs", () => {
    expect(normalizeProjectorPath(`${projectorBaseUrl()}Games/Trivia/trivia.swf?x=1`)).toBe("games/trivia/trivia.swf");
    expect(normalizeProjectorPath(`${projectorBaseUrl()}games%5Cdata%5Cgamekeys.txt`)).toBe("games/data/gamekeys.txt");
    expect(normalizeProjectorPath("http://example.com/games/trivia/trivia.swf")).toBeNull();
  });

  it("maps every room loadGame movie and the nine-key nutButton to a route", () => {
    expect(projectorGameRoutes.get("games/trivia/trivia.swf")).toBe("trivia");
    expect(projectorGameRoutes.get("games/nutcrackergame/nutchooser.swf")).toBe("nutcracker-chooser");
    expect(projectorGameRoutes.size).toBe(14);
  });
});

describe("live projector launcher and room", () => {
  it("Given app launch, then the unmodified projector plays interactively with the shell boundary as its base", async () => {
    const { mount, lastPlay } = launch();

    expect(lastPlay()?.sessionKey).toBe("projector@1267");
    expect(lastPlay()?.interactive).toBe(true);
    expect(lastPlay()?.base).toBe(projectorBaseUrl());
    expect(lastPlay()?.swfUrl).toContain("projector-nutcracker2");
    expect(typeof lastPlay()?.loadData).toBe("function");
    // The static launcher stays underneath, its targets out of the tab order.
    expect(mount.querySelector('[data-action="open-kids-music-stage"]')?.getAttribute("tabindex")).toBe("-1");
  });

  it("Given the featured game is chosen, then nutIni reads the saved keys and the room shows without restarting the movie", async () => {
    const progress = createProgressStore(createMemoryPersistence());
    progress.markGameKey(2);
    const { mount, layer, request } = launch({ progress });

    const response = await request("games/data/gamekeys.txt");
    await tick();

    expect(await response.text()).toContain("&gameKey2=1&");
    expect(mount.querySelector(".source-playroom-scene")).not.toBeNull();
    expect(layer.plays).toHaveLength(1);
    expect(layer.suspended).toBe(false);
  });

  it("Given a room hotspot loads a movie, then the shell opens that route behind a stand-in movie, and returning sends the projector to comeAgain", async () => {
    const progress = createProgressStore(createMemoryPersistence());
    const { mount, layer, request } = launch({ progress });
    await request("games/data/gamekeys.txt");
    await tick();

    const gameResponse = await request("activities/story/story.swf");
    await tick();
    const stub = new Uint8Array(await gameResponse.arrayBuffer());
    expect(String.fromCharCode(...stub.subarray(0, 3))).toBe("FWS");
    expect(mount.querySelector(".source-playroom-scene")).toBeNull();
    expect(layer.suspended).toBe(true);

    let returned = "";
    void request("__shell/return.txt").then(async (response) => {
      returned = await response.text();
    });
    await tick();
    expect(returned).toBe("");

    progress.markGameKey(9);
    // The story reader's source EXIT fades for 400 ms, then returns to the room.
    mount.querySelector<HTMLButtonElement>('[data-action="exit"]')?.click();
    await new Promise((resolve) => setTimeout(resolve, 450));

    expect(mount.querySelector(".source-playroom-scene")).not.toBeNull();
    expect(layer.suspended).toBe(false);
    expect(layer.plays).toHaveLength(1);
    expect(returned.startsWith("ret=1&")).toBe(true);
    expect(returned).toContain("&gameKey9=1&");
  });

  it("Given the room returns before the stand-in asks, then the stand-in's first request is answered at once", async () => {
    const { mount, request } = launch();
    await request("games/data/gamekeys.txt");
    await tick();
    await request("activities/story/story.swf");
    await tick();
    mount.querySelector<HTMLButtonElement>('[data-action="exit"]')?.click();
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 450));

    const response = await request("__shell/return.txt");
    expect((await response.text()).startsWith("ret=1&")).toBe(true);
  });

  it("Given nine keys, when the projector loads nutchooser.swf, then the Nutcracker chooser route opens", async () => {
    const { mount, request } = launch();
    await request("games/data/gamekeys.txt");
    await tick();
    await request("games/nutcrackergame/nutchooser.swf");
    await tick();

    expect(mount.querySelector(".source-playroom-scene")).toBeNull();
    expect(mount.innerHTML).toContain("nutchooser");
  });

  it("Given the website prompt's YES, then the URL goes to the desktop opener, never the webview", () => {
    const { openExternal } = launch();

    const result = window.open("http://www.kidsmusicstage.com", "");

    expect(result).toBeNull();
    expect(openExternal).toHaveBeenCalledWith("http://www.kidsmusicstage.com");
  });

  it("Given the projector's quit fscommand (EXIT outro, or after the website YES), then the app exits", () => {
    const { lastPlay, exitApp } = launch();

    lastPlay()?.onFSCommand?.("fullscreen", "true");
    expect(exitApp).not.toHaveBeenCalled();
    lastPlay()?.onFSCommand?.("quit", "");
    expect(exitApp).toHaveBeenCalledTimes(1);
  });

  it("Given the holdToReset prompt runs the reset helpers, then the matching saved progress resets", () => {
    const progress = createProgressStore(createMemoryPersistence());
    progress.markGameKey(1);
    progress.setNutHouseOpenDoor(3);
    const { lastPlay } = launch({ progress });

    lastPlay()?.onFSCommand?.("exec", "resetgameKeys.exe");
    lastPlay()?.onFSCommand?.("exec", "resetopenDoors.exe");

    expect(progress.getSnapshot().completedGameCount).toBe(0);
    expect(progress.getSnapshot().nutHouse.openDoor).toBe(0);
  });

  it("Given Musical Friends on the live launcher, then the fitted Stage 1 intro plays instead of loading into bigloader", async () => {
    const { mount, request } = launch();

    const response = await request("flute_intro.swf");
    await tick();

    expect(response.status).toBe(404);
    expect(mount.querySelector(".source-intro-scene")).not.toBeNull();
  });

  it("Given a file the recovered install lacks (keycontroller.swf), then the projector gets a 404", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    const { request } = launch();

    expect((await request("games/keycontroller.swf")).status).toBe(404);
    info.mockRestore();
  });

  it("Given the room is opened from the route map while the projector sits on the launcher, then it restarts at nutIni", () => {
    const { mount, lastPlay } = launch({ showDeveloperPanel: true });

    mount.querySelector<HTMLButtonElement>('[data-route="main-menu"]')?.click();

    expect(lastPlay()?.sessionKey).toBe("projector@2143");
  });

  it("Given Ruffle cannot start the projector, then the static launcher's targets return to the tab order", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { mount, lastPlay } = launch();

    lastPlay()?.onError(new Error("no wasm"));

    expect(mount.querySelector('[data-action="open-kids-music-stage"]')?.hasAttribute("tabindex")).toBe(false);
    warn.mockRestore();
  });
});
