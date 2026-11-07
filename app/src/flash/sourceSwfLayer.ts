// Plays an original source SWF through the bundled, self-hosted Ruffle v0.5.0 web build.
//
// Ruffle's <ruffle-player> destroys itself in disconnectedCallback, and the app shell re-renders by
// replacing mount.innerHTML. The player therefore lives in one persistent layer outside the mount,
// pinned with position: fixed over the stage rectangle the shell reports after each render. The layer
// is sized in real screen pixels (no CSS transform), so Ruffle renders sharp at any window scale.

export type RufflePlayerElement = HTMLElement & {
  ruffle(): { load(options: Record<string, unknown>): Promise<void> };
};

export type RuffleRuntime = {
  createPlayer(): RufflePlayerElement;
};

export type RuffleLoader = () => Promise<RuffleRuntime>;

export type SourceSwfPlayback = {
  /** Bundled URL of the source movie. */
  readonly swfUrl: string;
  /** Wall-clock time after the movie starts at which the source hands control back to the shell. */
  readonly handoffAfterMs: number;
  /** Source quality the projector set before loading the movie (`_quality`). */
  readonly quality: "low" | "medium" | "high";
  /** Accessible keyboard skip target over the movie's own skip pixels, as fractions of the movie. */
  readonly skipTarget: { readonly left: number; readonly top: number; readonly width: number; readonly height: number };
  /** Source mouse-up / skip path. */
  readonly onSkip: () => void;
  /** Source timeline reached its hand-off frame. */
  readonly onEnd: () => void;
  /** Ruffle failed to start; the shell keeps its static source fallback. */
  readonly onError: (error: unknown) => void;
};

export type SourceSwfLayer = {
  /** Starts playback unless the same movie is already playing, then pins the layer over `stage`. */
  play(stage: HTMLElement, playback: SourceSwfPlayback): void;
  /** Re-pins the layer over the stage after a re-render or resize. */
  position(stage: HTMLElement): void;
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

export function buildRuffleLoadOptions(playback: Pick<SourceSwfPlayback, "swfUrl" | "quality">): Record<string, unknown> {
  return {
    url: playback.swfUrl,
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
    openUrlMode: "deny",
    allowNetworking: "none",
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
  let activeSwfUrl: string | null = null;
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

  const stop = () => {
    session += 1;
    activeSwfUrl = null;
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
    pinnedStage = stage;
    if (activeSwfUrl === playback.swfUrl) {
      reposition();
      return;
    }
    stop();
    pinnedStage = stage;
    activeSwfUrl = playback.swfUrl;
    const thisSession = ++session;
    const host = ensureLayer();
    host.dataset.sourceSwf = playback.swfUrl;
    reposition();

    let finished = false;
    const finish = (callback: () => void) => {
      if (finished || thisSession !== session) return;
      finished = true;
      callback();
    };

    const skip = document.createElement("button");
    skip.type = "button";
    skip.className = "source-swf-skip-target";
    skip.setAttribute("aria-label", "skip");
    skip.dataset.sourceControl = "source skip pixels rendered by the movie; projector _root.onMouseUp to gotoAndStop choose";
    skip.style.left = `${playback.skipTarget.left * 100}%`;
    skip.style.top = `${playback.skipTarget.top * 100}%`;
    skip.style.width = `${playback.skipTarget.width * 100}%`;
    skip.style.height = `${playback.skipTarget.height * 100}%`;
    skip.addEventListener("click", () => finish(playback.onSkip));
    host.append(skip);
    // The fullscreen projector's _root.onMouseUp fired on a release anywhere, letterbox included.
    releaseListener = (event: PointerEvent) => {
      if (event.button === 0) finish(playback.onSkip);
    };
    window.addEventListener("pointerup", releaseListener, true);

    const fail = (error: unknown) => {
      if (thisSession !== session) return;
      stop();
      playback.onError(error);
    };

    void loadRuffle()
      .then((runtime) => {
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
            handoffTimer = window.setTimeout(() => finish(playback.onEnd), playback.handoffAfterMs);
          },
          { once: true },
        );
        startWatchdog = window.setTimeout(
          () => fail(new Error(`${playback.swfUrl} did not start within ${sourceSwfStartTimeoutMs} ms`)),
          sourceSwfStartTimeoutMs,
        );
        return element.ruffle().load(buildRuffleLoadOptions(playback));
      })
      .catch(fail);
  };

  return {
    play,
    position(stage) {
      pinnedStage = stage;
      reposition();
    },
    stop,
    isPlaying: () => activeSwfUrl !== null,
  };
}
