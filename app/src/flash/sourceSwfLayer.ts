// Plays an original source SWF through the bundled, self-hosted Ruffle v0.5.0 web build.
//
// Ruffle's <ruffle-player> destroys itself in disconnectedCallback, and the app shell re-renders by
// replacing mount.innerHTML. The player therefore lives in one persistent layer outside the mount,
// pinned with position: fixed over the stage rectangle the shell reports after each render. The layer
// is sized in real screen pixels (no CSS transform), so Ruffle renders sharp at any window scale.

export type RuffleApi = {
  load(options: Record<string, unknown>): Promise<void>;
  addFSCommandHandler?(handler: (command: string, args: string) => void): void;
  /** Ruffle 0.5.0's v1 API pauses with `suspend()`; `pause()` is kept for other builds. */
  suspend?(): void;
  pause?(): void;
  resume?(): void;
  play?(): void;
};

export type RufflePlayerElement = HTMLElement & {
  ruffle(): RuffleApi;
};

export type RuffleRuntime = {
  createPlayer(): RufflePlayerElement;
};

export type RuffleLoader = () => Promise<RuffleRuntime>;

export type SourceSwfPlayback = {
  /** Bundled URL of the source movie. */
  readonly swfUrl: string;
  /** Identifies the session when one movie can start in several ways (default: `swfUrl`). */
  readonly sessionKey?: string;
  /** Supplies the movie bytes instead of letting Ruffle fetch `swfUrl` (for example a patched start frame). */
  readonly loadData?: () => Promise<Uint8Array>;
  /**
   * The movie takes its own pointer input (the live projector). There is then no skip target, no
   * release-anywhere listener, and no hand-off timer; the movie may load relative URLs against `base`.
   */
  readonly interactive?: boolean;
  /** Base URL for the movie's relative loads (interactive movies only). */
  readonly base?: string;
  /** Receives the movie's `FSCommand:` calls. */
  readonly onFSCommand?: (command: string, args: string) => void;
  /** Wall-clock time after the movie starts at which the source hands control back to the shell. */
  readonly handoffAfterMs?: number;
  /** Source quality the projector set before loading the movie (`_quality`). */
  readonly quality: "low" | "medium" | "high";
  /** Cursor over the movie: "pointer" where the source covers the stage with a button (Flash hand cursor). */
  readonly cursor?: "default" | "pointer";
  /** Accessible keyboard skip target over the movie's own skip pixels, as fractions of the movie. */
  readonly skipTarget?: { readonly left: number; readonly top: number; readonly width: number; readonly height: number };
  /** Accessible name of the keyboard skip target: the source control's own text (default "skip"). */
  readonly skipLabel?: string;
  /** Source provenance for the skip target. */
  readonly skipSourceControl?: string;
  /** Source mouse-up / skip path. */
  readonly onSkip?: () => void;
  /** Source timeline reached its hand-off frame. */
  readonly onEnd?: () => void;
  /** Ruffle failed to start; the shell keeps its static source fallback. */
  readonly onError: (error: unknown) => void;
};

export type SourceSwfLayer = {
  /** Starts playback unless the same movie is already playing, then pins the layer over `stage`. */
  play(stage: HTMLElement, playback: SourceSwfPlayback): void;
  /** Re-pins the layer over the stage after a re-render or resize. */
  position(stage: HTMLElement): void;
  /** Hides and pauses the current movie without destroying it (the shell shows a route of its own). */
  suspend(): void;
  /** Shows and resumes a suspended movie over `stage`. */
  resume(stage: HTMLElement): void;
  isSuspended(): boolean;
  /** Session key of the current movie, or null. */
  activeSession(): string | null;
  /** Destroys the player (stopping its audio) and hides the layer. */
  stop(): void;
  isPlaying(): boolean;
};

export const ruffleScriptPath = "/ruffle/ruffle.js";
/** Ruffle's load() resolves once streaming starts; a missing or corrupt SWF only shows Ruffle's panic panel. */
export const sourceSwfStartTimeoutMs = 10000;
export const rufflePublicPath = "/ruffle/";

type RuffleWindow = Window & {
  RufflePlayer?: { newest(): RuffleRuntime | null; config?: Record<string, unknown> };
};

let ruffleScriptPromise: Promise<RuffleRuntime> | null = null;

export const loadBundledRuffle: RuffleLoader = () => {
  if (ruffleScriptPromise) return ruffleScriptPromise;
  ruffleScriptPromise = new Promise<RuffleRuntime>((resolve, reject) => {
    const ruffleWindow = window as RuffleWindow;
    const resolveRuntime = () => {
      const runtime = ruffleWindow.RufflePlayer?.newest();
      if (runtime) resolve(runtime);
      else reject(new Error("Ruffle script loaded but RufflePlayer.newest() returned nothing"));
    };
    if (ruffleWindow.RufflePlayer?.newest) {
      resolveRuntime();
      return;
    }
    // Global config must exist before the script runs: no page polyfill scan, local runtime path.
    ruffleWindow.RufflePlayer = { ...(ruffleWindow.RufflePlayer ?? {}), config: { polyfills: false, publicPath: rufflePublicPath } } as RuffleWindow["RufflePlayer"];
    const script = document.createElement("script");
    script.src = ruffleScriptPath;
    script.async = true;
    script.addEventListener("load", resolveRuntime, { once: true });
    script.addEventListener("error", () => reject(new Error(`Could not load ${ruffleScriptPath}`)), { once: true });
    document.head.append(script);
  }).catch((error: unknown) => {
    ruffleScriptPromise = null;
    throw error;
  });
  return ruffleScriptPromise;
};

export function buildRuffleLoadOptions(
  playback: Pick<SourceSwfPlayback, "swfUrl" | "quality" | "interactive" | "base">,
  data?: Uint8Array,
): Record<string, unknown> {
  const source = data ? { data } : { url: playback.swfUrl };
  // The live projector loads games, data files, and the website through the shell boundary
  // (projectorBridge.ts); other movies get no network or URL access at all. Ruffle forwards
  // FSCommands (quit, exec helpers) to the page only with script access on and networking "all".
  // Script access is safe here: the projector's one empty-target getURL is retargeted to _blank.
  const access = playback.interactive
    ? {
        openUrlMode: "allow",
        allowNetworking: "all",
        allowScriptAccess: true,
        ...(playback.base ? { base: playback.base } : {}),
      }
    : { openUrlMode: "deny", allowNetworking: "none" };
  return {
    ...source,
    publicPath: rufflePublicPath,
    autoplay: "on",
    // The source projector shows no play button, splash, unmute badge, or context menu.
    unmuteOverlay: "hidden",
    // v0.5.0 folded the old `preloader` flag into splashScreen.
    splashScreen: false,
    contextMenu: "off",
    menu: false,
    letterbox: "on",
    scale: "showAll",
    backgroundColor: "#000000",
    quality: playback.quality,
    allowFullscreen: false,
    ...access,
    warnOnUnsupportedContent: false,
    showSwfDownload: false,
    polyfills: false,
    logLevel: "warn",
  };
}

export function createSourceSwfLayer(loadRuffle: RuffleLoader = loadBundledRuffle): SourceSwfLayer {
  let layer: HTMLDivElement | null = null;
  let player: RufflePlayerElement | null = null;
  let session = 0;
  let activeKey: string | null = null;
  let suspended = false;
  let handoffTimer: number | undefined;
  let startWatchdog: number | undefined;
  let releaseListener: ((event: PointerEvent) => void) | null = null;
  let pinnedStage: HTMLElement | null = null;

  const reposition = () => {
    if (!layer || !pinnedStage) return;
    const rect = pinnedStage.getBoundingClientRect();
    layer.style.left = `${rect.left}px`;
    layer.style.top = `${rect.top}px`;
    layer.style.width = `${rect.width}px`;
    layer.style.height = `${rect.height}px`;
  };
  // fitStageToWindow updates --stage-scale in its own resize listener; read the rect a frame later.
  const onResize = () => window.requestAnimationFrame(reposition);
  // With the developer panel the page can scroll; the fixed layer must follow the stage.
  const onScroll = () => reposition();

  const ensureLayer = () => {
    if (layer) return layer;
    layer = document.createElement("div");
    layer.className = "source-swf-layer";
    layer.dataset.sourceRuntime = "official Ruffle v0.5.0 self-hosted web build bundled under /ruffle/";
    document.body.append(layer);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return layer;
  };

  const callPlayer = (method: "pause" | "resume") => {
    try {
      const api = player?.ruffle();
      if (method === "pause") {
        if (api?.suspend) api.suspend();
        else api?.pause?.();
      }
      else if (api?.resume) api.resume();
      else api?.play?.();
    } catch (error) {
      console.warn(`Ruffle ${method} failed`, error);
    }
  };

  const stop = () => {
    session += 1;
    activeKey = null;
    suspended = false;
    pinnedStage = null;
    window.clearTimeout(handoffTimer);
    handoffTimer = undefined;
    window.clearTimeout(startWatchdog);
    startWatchdog = undefined;
    if (releaseListener) {
      window.removeEventListener("pointerup", releaseListener, true);
      releaseListener = null;
    }
    player?.remove();
    player = null;
    if (layer) {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      layer.remove();
      layer = null;
    }
  };

  const play = (stage: HTMLElement, playback: SourceSwfPlayback) => {
    const key = playback.sessionKey ?? playback.swfUrl;
    pinnedStage = stage;
    if (activeKey === key) {
      if (suspended) resume(stage);
      else reposition();
      return;
    }
    stop();
    pinnedStage = stage;
    activeKey = key;
    const thisSession = ++session;
    const host = ensureLayer();
    host.dataset.sourceSwf = playback.swfUrl;
    host.dataset.sourceSession = key;
    host.dataset.interactive = playback.interactive ? "true" : "false";
    // An interactive movie draws its own cursor (Flash hand cursor over its buttons).
    host.style.cursor = playback.interactive ? "" : (playback.cursor ?? "default");
    reposition();

    let finished = false;
    const finish = (callback: (() => void) | undefined) => {
      if (finished || thisSession !== session) return;
      finished = true;
      callback?.();
    };

    if (!playback.interactive) {
      const skip = document.createElement("button");
      skip.type = "button";
      skip.className = "source-swf-skip-target";
      skip.setAttribute("aria-label", playback.skipLabel ?? "skip");
      skip.dataset.sourceControl =
        playback.skipSourceControl ?? "source skip pixels rendered by the movie; projector _root.onMouseUp to gotoAndStop choose";
      const target = playback.skipTarget ?? { left: 0, top: 0, width: 0, height: 0 };
      skip.style.left = `${target.left * 100}%`;
      skip.style.top = `${target.top * 100}%`;
      skip.style.width = `${target.width * 100}%`;
      skip.style.height = `${target.height * 100}%`;
      skip.addEventListener("click", () => finish(playback.onSkip));
      host.append(skip);
      // The fullscreen projector's _root.onMouseUp fired on a release anywhere, letterbox included.
      releaseListener = (event: PointerEvent) => {
        if (event.button === 0) finish(playback.onSkip);
      };
      window.addEventListener("pointerup", releaseListener, true);
    }

    const fail = (error: unknown) => {
      if (thisSession !== session) return;
      stop();
      playback.onError(error);
    };

    void Promise.all([loadRuffle(), playback.loadData ? playback.loadData() : Promise.resolve(undefined)])
      .then(([runtime, data]) => {
        if (thisSession !== session) return;
        const element = runtime.createPlayer();
        element.classList.add("source-swf-player");
        player = element;
        host.prepend(element);
        element.addEventListener(
          "loadedmetadata",
          () => {
            if (thisSession !== session) return;
            window.clearTimeout(startWatchdog);
            startWatchdog = undefined;
            host.dataset.sourceSwfState = "playing";
            if (suspended) callPlayer("pause");
            if (playback.handoffAfterMs !== undefined) {
              handoffTimer = window.setTimeout(() => finish(playback.onEnd), playback.handoffAfterMs);
            }
          },
          { once: true },
        );
        startWatchdog = window.setTimeout(
          () => fail(new Error(`${playback.swfUrl} did not start within ${sourceSwfStartTimeoutMs} ms`)),
          sourceSwfStartTimeoutMs,
        );
        const api = element.ruffle();
        const onFSCommand = playback.onFSCommand;
        if (onFSCommand) {
          api.addFSCommandHandler?.((command, args) => {
            if (thisSession === session) onFSCommand(command, args);
          });
        }
        return api.load(buildRuffleLoadOptions(playback, data));
      })
      .catch(fail);
  };

  const suspend = () => {
    if (!layer || suspended) return;
    suspended = true;
    layer.dataset.suspended = "true";
    callPlayer("pause");
  };

  function resume(stage: HTMLElement) {
    pinnedStage = stage;
    if (!layer) return;
    if (suspended) {
      suspended = false;
      delete layer.dataset.suspended;
      callPlayer("resume");
    }
    reposition();
  }

  return {
    play,
    position(stage) {
      pinnedStage = stage;
      reposition();
    },
    suspend,
    resume,
    isSuspended: () => suspended,
    activeSession: () => activeKey,
    stop,
    isPlaying: () => activeKey !== null,
  };
}
