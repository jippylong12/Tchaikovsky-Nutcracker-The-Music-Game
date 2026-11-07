import { readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createAppShell, projectorGameRoutes, resetProjectorInstallIndexForTests } from "../app";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import {
  buildChildrensDoorsVariables,
  buildGameKeysVariables,
  buildNutDoorsVariables,
  buildProjectorReturnStubSwf,
  normalizeProjectorPath,
  parseProjectorExec,
  parseProjectorInstallIndex,
  projectorInstallFileUrl,
  patchProjectorStartFrame,
  patchProjectorWebsiteTarget,
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
  restoreFetch?.();
  restoreFetch = null;
  resetProjectorInstallIndexForTests();
});

let restoreFetch: (() => void) | null = null;

/** Serves a mirrored recovered install (public/projector-install/) with the given files. */
function mirrorInstall(files: Record<string, string>) {
  resetProjectorInstallIndexForTests();
  const previous = window.fetch;
  const served: string[] = [];
  restoreFetch = () => {
    window.fetch = previous;
  };
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.endsWith("/projector-install/index.json")) {
      const index = Object.fromEntries(Object.keys(files).map((real) => [real.toLowerCase(), real]));
      return Promise.resolve(new Response(JSON.stringify({ files: index }), { status: 200 }));
    }
    const match = Object.keys(files).find((real) => url.endsWith(projectorInstallFileUrl(real)));
    if (match) {
      served.push(match);
      return Promise.resolve(new Response(files[match], { status: 200 }));
    }
    return previous(input, init);
  };
  return served;
}

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

  it("Given the website prompt's getURL, then the runtime copy targets _blank so Ruffle calls window.open", () => {
    const patched = patchProjectorWebsiteTarget(projectorMovie);
    const view = new DataView(patched.buffer, patched.byteOffset, patched.byteLength);
    const text = new TextDecoder("latin1").decode(patched.subarray(392726, 392726 + 40));

    expect(patched.length).toBe(projectorMovie.length + 6);
    expect(view.getUint32(4, true)).toBe(patched.length);
    expect(text).toContain("http://www.kidsmusicstage.com\u0000_blank\u0000");
    expect(view.getUint16(392727, true)).toBe(37);
    expect(view.getUint32(392722, true)).toBe(41);
    expect(view.getUint32(392328, true)).toBe(490);
    // Bytes after the insertion are the original bytes, shifted by 6.
    expect([...patched.subarray(392766, 392866)]).toEqual([...projectorMovie.subarray(392760, 392860)]);
    // The start-frame patch still applies to the retargeted copy.
    expect(() => patchProjectorStartFrame(patched, projectorStartFrames.nutIni)).not.toThrow();
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

describe("original games from the recovered CD", () => {
  it("refreshes the mirrored install before both dev and release builds, so they serve the same games", () => {
    const scripts = (JSON.parse(readFileSync(path.join(process.cwd(), "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    }).scripts;
    expect(scripts["assets:projector-install"]).toBe("node scripts/prepare-projector-install.mjs");
    expect(scripts.predev).toContain("prepare-projector-install.mjs");
    expect(scripts.build).toMatch(/assets:projector-install.*vite build/);
  });

  it("maps every CD save helper to the progress it wrote, and leaves the printables unsupported", () => {
    expect(parseProjectorExec("saveKey9.exe")).toEqual({ kind: "gameKey", key: 9 });
    expect(parseProjectorExec("saveNutDoor3.exe")).toEqual({ kind: "nutDoor", door: 3 });
    expect(parseProjectorExec("saveCADoor8.exe")).toEqual({ kind: "childrensDoor", door: 8 });
    expect(parseProjectorExec("resetDoorsKeys.exe")).toEqual({ kind: "reset", target: "nutDoors" });
    expect(parseProjectorExec("fscommand\\saveKey1.exe")).toEqual({ kind: "gameKey", key: 1 });
    expect(parseProjectorExec("saveNutDoor9.exe")).toEqual({ kind: "unsupported", helper: "savenutdoor9.exe" });
    expect(parseProjectorExec("nc_certificate.exe").kind).toBe("unsupported");
  });

  it("serves the door files in the original install format", () => {
    const doors = { 1: false, 2: true, 3: false, 4: false, 5: false, 6: false, 7: false, 8: true } as const;
    expect(buildNutDoorsVariables(doors)).toBe("&door1=0&door2=1&door3=0&door4=0&door5=0&door6=0&door7=0&door8=1&EOF=1");
    expect(buildChildrensDoorsVariables(doors)).toContain("&cadoor2=1&cadoor3=0&");
  });

  it("indexes the mirrored install case-insensitively and keeps the real spelling in the URL", () => {
    const index = parseProjectorInstallIndex({ files: { "games/melody/snd/melody.txt": "games/melody/Snd/Melody.txt" } });
    expect(index.get("games/melody/snd/melody.txt")).toBe("games/melody/Snd/Melody.txt");
    expect(projectorInstallFileUrl("games/nutcrackergame/song1/track 1.swf")).toBe(
      "/projector-install/games/nutcrackergame/song1/track%201.swf",
    );
    expect(parseProjectorInstallIndex(null).size).toBe(0);
  });

  it("Given the install is mirrored, when a room hotspot loads a game, then the projector gets the original movie and stays in the room", async () => {
    const served = mirrorInstall({ "games/trivia/trivia.swf": "ORIGINAL-TRIVIA" });
    const { mount, layer, request } = launch();
    await request("games/data/gamekeys.txt");
    await tick();

    const response = await request("games/trivia/trivia.swf");
    await tick();

    expect(await response.text()).toBe("ORIGINAL-TRIVIA");
    expect(served).toEqual(["games/trivia/trivia.swf"]);
    expect(mount.querySelector(".source-playroom-scene")).not.toBeNull();
    expect(layer.suspended).toBe(false);
  });

  it("Given a game asks for a file in another case (Games/Melody/Snd/Melody.txt), then the CD's spelling is served", async () => {
    const served = mirrorInstall({ "games/melody/Snd/Melody.txt": "&seq1=1" });
    const { request } = launch();

    const response = await request("Games/Melody/Snd/Melody.txt");

    expect(await response.text()).toBe("&seq1=1");
    expect(served).toEqual(["games/melody/Snd/Melody.txt"]);
  });

  it("Given the games save through the CD helpers, then keys and doors reach progress and the data files the games read", async () => {
    mirrorInstall({});
    const { lastPlay, progress, request } = launch();

    lastPlay()?.onFSCommand?.("exec", "saveKey9.exe");
    lastPlay()?.onFSCommand?.("exec", "saveNutDoor3.exe");
    lastPlay()?.onFSCommand?.("exec", "saveCADoor2.exe");

    expect(progress.getSnapshot().gameKeys[9]).toBe(true);
    expect(progress.getSnapshot().nutDoors[3]).toBe(true);
    expect(progress.getSnapshot().childrensDoors[2]).toBe(true);
    expect(await (await request("games/data/nutdoors.txt")).text()).toContain("&door3=1&");
    expect(await (await request("games/data/childrensDoors.txt")).text()).toContain("&cadoor2=1&");
    expect(await (await request("games/data/nuthouserooms.txt")).text()).toBe("&openDoor=0&EOF=1");
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

  it("Given no mirrored install, when a room hotspot loads a movie, then the shell opens that route behind a stand-in movie, and returning sends the projector to comeAgain", async () => {
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
