export type AudioService = {
  getState: () => AudioServiceState;
  subscribe: (listener: AudioStateListener) => () => void;
  preload: (path: string) => AudioHandle;
  playOneShot: (path: string) => AudioHandle;
  playLoop: (path: string) => AudioHandle;
  playTrack: (path: string, startTimeSeconds?: number) => AudioHandle;
  stop: (id: string) => void;
  stopSceneAudio: () => void;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
};

export type AudioPlaybackKind = "one-shot" | "loop" | "track" | "preload";

export type AudioDiagnostic = {
  readonly level: "info" | "error";
  readonly message: string;
  readonly path?: string;
};

export type AudioServiceState = {
  readonly muted: boolean;
  readonly volume: number;
  readonly activeTrackCount: number;
  readonly diagnostics: readonly AudioDiagnostic[];
};

export type AudioStateListener = (state: AudioServiceState) => void;

export type AudioHandle = {
  readonly id: string;
  readonly path: string;
  readonly kind: AudioPlaybackKind;
};

export type AudioElementLike = {
  src: string;
  loop: boolean;
  muted: boolean;
  volume: number;
  preload: string;
  currentTime: number;
  play: () => Promise<void>;
  pause: () => void;
  load: () => void;
  addEventListener: (type: string, listener: () => void) => void;
};

export type AudioServiceOptions = {
  createAudioElement?: () => AudioElementLike;
  logger?: Pick<Console, "error" | "info">;
};

type ActiveAudio = AudioHandle & {
  readonly element: AudioElementLike;
};

export function createAudioService(options: AudioServiceOptions = {}): AudioService {
  const createAudioElement = options.createAudioElement ?? (() => new Audio());
  const logger = options.logger ?? console;
  const active = new Map<string, ActiveAudio>();
  const listeners = new Set<AudioStateListener>();
  const diagnostics: AudioDiagnostic[] = [];
  let nextId = 1;
  let muted = false;
  let volume = 0.8;

  const getState = (): AudioServiceState => ({
    muted,
    volume,
    activeTrackCount: active.size,
    diagnostics: diagnostics.slice(-4),
  });

  const emit = () => {
    const state = getState();
    listeners.forEach((listener) => listener(state));
  };

  const addDiagnostic = (diagnostic: AudioDiagnostic) => {
    diagnostics.push(diagnostic);
    if (diagnostic.level === "error") {
      logger.error(diagnostic.message);
    } else {
      logger.info(diagnostic.message);
    }
    emit();
  };

  const createHandle = (path: string, kind: AudioPlaybackKind): ActiveAudio => {
    const element = createAudioElement();
    const handle: ActiveAudio = {
      id: `audio-${nextId}`,
      path,
      kind,
      element,
    };
    nextId += 1;

    element.src = path;
    element.preload = kind === "preload" ? "auto" : "metadata";
    element.loop = kind === "loop" || kind === "track";
    element.muted = muted;
    element.volume = volume;
    element.addEventListener("error", () => {
      addDiagnostic({
        level: "error",
        message: `Missing or unplayable audio: ${path}`,
        path,
      });
    });

    return handle;
  };

  const start = (path: string, kind: Exclude<AudioPlaybackKind, "preload">, startTimeSeconds = 0): AudioHandle => {
    const handle = createHandle(path, kind);
    handle.element.currentTime = Math.max(0, startTimeSeconds);
    active.set(handle.id, handle);
    handle.element
      .play()
      .then(() => {
        addDiagnostic({
          level: "info",
          message: `Audio started: ${path}`,
          path,
        });
      })
      .catch(() => {
        addDiagnostic({
          level: "error",
          message: `Audio could not start: ${path}`,
          path,
        });
      });
    emit();
    return handle;
  };

  return {
    getState,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    preload: (path) => {
      const handle = createHandle(path, "preload");
      handle.element.load();
      addDiagnostic({
        level: "info",
        message: `Audio preloaded: ${path}`,
        path,
      });
      return handle;
    },
    playOneShot: (path) => start(path, "one-shot"),
    playLoop: (path) => start(path, "loop"),
    playTrack: (path, startTimeSeconds) => start(path, "track", startTimeSeconds),
    stop: (id) => {
      const handle = active.get(id);
      if (!handle) {
        return;
      }

      handle.element.pause();
      handle.element.currentTime = 0;
      active.delete(id);
      emit();
    },
    stopSceneAudio: () => {
      active.forEach((handle) => {
        handle.element.pause();
        handle.element.currentTime = 0;
      });
      active.clear();
      emit();
    },
    setMuted: (nextMuted) => {
      muted = nextMuted;
      active.forEach((handle) => {
        handle.element.muted = muted;
      });
      emit();
    },
    setVolume: (nextVolume) => {
      volume = Math.min(Math.max(nextVolume, 0), 1);
      active.forEach((handle) => {
        handle.element.volume = volume;
      });
      emit();
    },
  };
}
