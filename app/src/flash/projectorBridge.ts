// Boundary between the live Nutcracker2 projector (played through Ruffle) and the remake shell.
//
// The original projector loaded its games itself: a room hotspot ran `_root.loadGame(path, kind)`, the
// root timeline played `bye`, then `loadMovie(nextGame, "_level1")` with `_level0._visible = 0`. Each
// game set `_level0.gameKeyN = 1` and returned with `_level0.gotoAndPlay("comeAgain")`. The remake keeps
// that loop but answers every request the projector makes at this boundary:
//
// - Ruffle resolves the projector's relative URLs against `projectorBaseUrl()`; a `window.fetch` wrapper
//   hands those requests to the active shell handler instead of the network.
// - A game load is answered with a tiny generated stand-in movie (`buildProjectorReturnStubSwf`) while
//   the shell opens the matching reconstructed route. When the shell returns to the room, the stand-in
//   copies the current keys into `_level0` and runs `_level0.gotoAndPlay("comeAgain")`, as the games did.
// - `getURL("http://...")` reaches Ruffle's `window.open` call, which the wrapper sends to the shell.

import type { GameKey } from "../state/progressStore";

/** Virtual folder the projector's relative paths resolve against. Nothing is served from it. */
export const projectorBasePath = "/__projector/";
/** Long-poll the stand-in movie loads into `_level1`; it resolves when the shell returns to the room. */
export const projectorReturnPath = "__shell/return.txt";

export function projectorBaseUrl(): string {
  return new URL(projectorBasePath, window.location.href).href;
}

/**
 * Projector root frame-1 DOACTION (byte 79408, 113 bytes) runs `_quality = "MEDIUM"`, three fscommands,
 * `GotoFrame 1267` (zero-based: root frame 1268, label `choose`) and `Play`. The opcode, length, and
 * operand of that GotoFrame sit at bytes 79520-79524.
 */
export const projectorStartGotoOffset = 79520;
export const projectorStartFrames = {
  /** Root frame 1268, label `choose`: the launcher, where the original opens. */
  choose: 1267,
  /** Root frame 2144, label `nutIni`: what `nut.onRelease` plays; loads gamekeys.txt, then the room animates in. */
  nutIni: 2143,
} as const;

export function patchProjectorStartFrame(projector: Uint8Array, zeroBasedFrame: number): Uint8Array {
  const at = projectorStartGotoOffset;
  const expected = [0x81, 0x02, 0x00, 0xf3, 0x04];
  if (String.fromCharCode(projector[0], projector[1], projector[2]) !== "FWS") {
    throw new Error("Projector movie is not an uncompressed FWS SWF");
  }
  if (!expected.every((byte, index) => projector[at + index] === byte)) {
    throw new Error(`Projector frame-1 GotoFrame 1267 not found at byte ${at}`);
  }
  const patched = projector.slice();
  patched[at + 3] = zeroBasedFrame & 0xff;
  patched[at + 4] = (zeroBasedFrame >> 8) & 0xff;
  return patched;
}

/**
 * `warningMSG_mc` (sprite 0064, tag at byte 392326) frame 3 runs `getURL("http://www.kidsmusicstage.com", "")`
 * from a long-form DOACTION at byte 392720. In the standalone projector an empty target opened the default
 * browser. Ruffle 0.5.0 refuses an empty (current-tab) target without script access and would otherwise
 * call `location.assign`, which can't be intercepted. So the runtime copy uses the target `_blank`, which
 * Ruffle sends to `window.open`, where the boundary hands it to the desktop opener. Nothing else changes:
 * the action, DOACTION, DEFINESPRITE, and SWF header lengths each grow by 6 bytes.
 */
export const projectorWebsiteGetUrl = {
  spriteTag: 392326,
  doActionTag: 392720,
  action: 392726,
  url: "http://www.kidsmusicstage.com",
  target: "_blank",
} as const;

function readU32(bytes: Uint8Array, at: number): number {
  return (bytes[at] | (bytes[at + 1] << 8) | (bytes[at + 2] << 16) | (bytes[at + 3] << 24)) >>> 0;
}

function writeU32(bytes: Uint8Array, at: number, value: number): void {
  bytes.set(u32(value), at);
}

export function patchProjectorWebsiteTarget(projector: Uint8Array): Uint8Array {
  const { spriteTag, doActionTag, action, url, target } = projectorWebsiteGetUrl;
  const urlBytes = textEncoder.encode(url);
  const oldLength = urlBytes.length + 2;
  const expectedAction = [0x83, oldLength & 0xff, oldLength >> 8, ...urlBytes, 0x00, 0x00];
  const spriteHeader = projector[spriteTag] | (projector[spriteTag + 1] << 8);
  const actionHeader = projector[doActionTag] | (projector[doActionTag + 1] << 8);
  if (
    spriteHeader !== ((39 << 6) | 0x3f) ||
    (projector[spriteTag + 6] | (projector[spriteTag + 7] << 8)) !== 64 ||
    actionHeader !== ((12 << 6) | 0x3f) ||
    !expectedAction.every((byte, index) => projector[action + index] === byte)
  ) {
    throw new Error("Projector warningMSG_mc getURL not found where expected");
  }
  const added = textEncoder.encode(target);
  const insertAt = action + 3 + urlBytes.length + 1;
  const patched = new Uint8Array(projector.length + added.length);
  patched.set(projector.subarray(0, insertAt), 0);
  patched.set(added, insertAt);
  patched.set(projector.subarray(insertAt), insertAt + added.length);
  const newLength = oldLength + added.length;
  patched[action + 1] = newLength & 0xff;
  patched[action + 2] = newLength >> 8;
  writeU32(patched, doActionTag + 2, readU32(projector, doActionTag + 2) + added.length);
  writeU32(patched, spriteTag + 2, readU32(projector, spriteTag + 2) + added.length);
  writeU32(patched, 4, readU32(projector, 4) + added.length);
  return patched;
}

const gameKeyNumbers: readonly GameKey[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** `games/data/gamekeys.txt` in the original install format, from the remake's saved keys. */
export function buildGameKeysVariables(gameKeys: Readonly<Record<GameKey, boolean>>): string {
  return `${gameKeyNumbers.map((key) => `&gameKey${key}=${gameKeys[key] ? 1 : 0}`).join("")}&EOF=1`;
}

// ---- Stand-in movie -------------------------------------------------------------------------------------

const textEncoder = new TextEncoder();

function u16(value: number): number[] {
  return [value & 0xff, (value >> 8) & 0xff];
}

function u32(value: number): number[] {
  return [value & 0xff, (value >> 8) & 0xff, (value >> 16) & 0xff, (value >>> 24) & 0xff];
}

type PushItem = string | number;

function actionPush(...items: PushItem[]): number[] {
  const body: number[] = [];
  for (const item of items) {
    if (typeof item === "string") body.push(0x00, ...textEncoder.encode(item), 0x00);
    else body.push(0x07, ...u32(item));
  }
  return [0x96, ...u16(body.length), ...body];
}

const op = {
  getVariable: [0x1c],
  setMember: [0x4f],
  equals2: [0x49],
  not: [0x12],
  callMethod: [0x52],
  pop: [0x17],
  stop: [0x07],
  play: [0x06],
  end: [0x00],
} as const;

function actionIf(offset: number): number[] {
  return [0x9d, ...u16(2), ...u16(offset & 0xffff)];
}

function actionGotoFrame(zeroBasedFrame: number): number[] {
  return [0x81, ...u16(2), ...u16(zeroBasedFrame)];
}

/** `loadVariablesNum(url, level)`: the same `GetURL2` form the projector's nutIni frame uses. */
function actionLoadVariablesNum(url: string, level: number): number[] {
  return [...actionPush(url, `_level${level}`), 0x9a, ...u16(1), 0x80];
}

function tag(code: number, body: readonly number[]): number[] {
  if (body.length < 0x3f) return [...u16((code << 6) | body.length), ...body];
  return [...u16((code << 6) | 0x3f), ...u32(body.length), ...body];
}

function doAction(actions: readonly number[]): number[] {
  return tag(12, [...actions, ...op.end]);
}

const showFrame = tag(1, []);

/** RECT 0, 12800, 0, 9600 twips (640 x 480) with 15-bit fields. */
function stageRect(): number[] {
  const nbits = 15;
  const fields = [0, 640 * 20, 0, 480 * 20];
  let bits = nbits.toString(2).padStart(5, "0");
  for (const field of fields) bits += field.toString(2).padStart(nbits, "0");
  while (bits.length % 8 !== 0) bits += "0";
  const bytes: number[] = [];
  for (let index = 0; index < bits.length; index += 8) bytes.push(parseInt(bits.slice(index, index + 8), 2));
  return bytes;
}

/**
 * A three-frame SWF 6 movie the projector loads into `_level1` in place of a game:
 * frame 1 `loadVariablesNum("__shell/return.txt", 1)`; frame 2 waits for `ret == 1`, then copies
 * `gameKey1`..`gameKey9` into `_level0` and calls `_level0.gotoAndPlay("comeAgain")`, which is exactly how
 * the original games returned; frame 3 loops back to frame 2.
 */
export function buildProjectorReturnStubSwf(): Uint8Array {
  const copyKeys = gameKeyNumbers.flatMap((key) => [
    ...actionPush("_level0"),
    ...op.getVariable,
    ...actionPush(`gameKey${key}`, `gameKey${key}`),
    ...op.getVariable,
    ...op.setMember,
  ]);
  const returnToRoom = [
    ...copyKeys,
    ...actionPush("comeAgain", 1, "_level0"),
    ...op.getVariable,
    ...actionPush("gotoAndPlay"),
    ...op.callMethod,
    ...op.pop,
    ...op.stop,
  ];
  const waitForReturn = [
    ...actionPush("ret"),
    ...op.getVariable,
    ...actionPush(1),
    ...op.equals2,
    ...op.not,
    ...actionIf(returnToRoom.length),
    ...returnToRoom,
  ];
  const body = [
    ...doAction(actionLoadVariablesNum(projectorReturnPath, 1)),
    ...showFrame,
    ...doAction(waitForReturn),
    ...showFrame,
    ...doAction([...actionGotoFrame(1), ...op.play]),
    ...showFrame,
    ...tag(0, []),
  ];
  const header = [...stageRect(), ...u16(15 << 8), ...u16(3)];
  const length = 8 + header.length + body.length;
  return Uint8Array.from([0x46, 0x57, 0x53, 6, ...u32(length), ...header, ...body]);
}

// ---- Fetch and window.open boundary ---------------------------------------------------------------------

export type ProjectorBoundaryHandler = {
  /** A projector request under the base path, as a normalized lowercase relative path. */
  request(path: string): Promise<Response>;
  /** The projector called `getURL` with an http(s) URL. */
  openUrl(url: string): void;
};

let activeHandler: ProjectorBoundaryHandler | null = null;
let installedFetch: typeof window.fetch | null = null;
let installedOpen: typeof window.open | null = null;
let originalFetch: typeof window.fetch | null = null;
let originalOpen: typeof window.open | null = null;
let openUrlDepth = 0;

function requestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

export function normalizeProjectorPath(url: string): string | null {
  const base = projectorBaseUrl();
  if (!url.startsWith(base)) return null;
  let path = url.slice(base.length).split(/[?#]/)[0] ?? "";
  try {
    path = decodeURIComponent(path);
  } catch {
    // Keep the raw path; the handler answers unknown paths with 404.
  }
  return path.replace(/\\/g, "/").replace(/^(\.\/)+/, "").toLowerCase();
}

function installBoundary(): void {
  if (installedFetch && window.fetch === installedFetch && installedOpen && window.open === installedOpen) return;
  originalFetch = window.fetch.bind(window);
  originalOpen = window.open.bind(window);
  installedFetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const path = normalizeProjectorPath(requestUrl(input));
    if (path !== null) {
      if (!activeHandler) return Promise.resolve(new Response(null, { status: 404 }));
      return activeHandler.request(path);
    }
    return (originalFetch as typeof window.fetch)(input, init);
  };
  installedOpen = (url?: string | URL, target?: string, features?: string) => {
    const href = url === undefined ? "" : String(url);
    if (activeHandler && openUrlDepth === 0 && /^https?:\/\//i.test(href)) {
      openUrlDepth += 1;
      try {
        activeHandler.openUrl(href);
      } finally {
        openUrlDepth -= 1;
      }
      return null;
    }
    return (originalOpen as typeof window.open)(url, target, features);
  };
  window.fetch = installedFetch;
  window.open = installedOpen;
}

/** Routes projector requests to `handler` until the returned function is called. */
export function connectProjectorBoundary(handler: ProjectorBoundaryHandler): () => void {
  installBoundary();
  activeHandler = handler;
  return () => {
    if (activeHandler === handler) activeHandler = null;
  };
}

export function swfResponse(bytes: Uint8Array): Response {
  return new Response(bytes, { status: 200, headers: { "Content-Type": "application/x-shockwave-flash" } });
}

export function variablesResponse(text: string): Response {
  return new Response(text, { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export function notFoundResponse(): Response {
  return new Response(null, { status: 404 });
}
