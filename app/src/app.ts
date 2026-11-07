import nutChooserFrameUrl from "./assets/nutcracker-source/nutchooser-frame-source.png";
import nutChooserSourceNormalUrl from "./assets/nutcracker-source/nutchooser-source-normal.png";
import chooserOpenDoorUrl from "./assets/nutcracker-source/chooser-open-door.png";
import chooserHelpframeTalkerUrl from "./assets/nutcracker-source/chooser-helpframe-talker.png";
import chooserMagicKeyUrl from "./assets/nutcracker-source/chooser-magic-key.png";
import chooserWarningNoBodyUrl from "./assets/nutcracker-source/chooser-warning-no-body.png";
import chooserWarningNoLabelUrl from "./assets/nutcracker-source/chooser-warning-no-label.png";
import chooserWarningYesBodyUrl from "./assets/nutcracker-source/chooser-warning-yes-body.png";
import chooserWarningYesLabelUrl from "./assets/nutcracker-source/chooser-warning-yes-label.png";
import chooserWarningframeTalkerUrl from "./assets/nutcracker-source/chooser-warningframe-talker.png";
import song1SourceInteractiveUrl from "./assets/nutcracker-source/song1-source-interactive.png";
import song2SourceInteractiveUrl from "./assets/nutcracker-source/song2-source-interactive.png";
import song3SourceInteractiveUrl from "./assets/nutcracker-source/song3-source-interactive.png";
import song4SourceInteractiveUrl from "./assets/nutcracker-source/song4-source-interactive.png";
import song5SourceInteractiveUrl from "./assets/nutcracker-source/song5-source-interactive.png";
import song6SourceInteractiveUrl from "./assets/nutcracker-source/song6-source-interactive.png";
import song7SourceInteractiveUrl from "./assets/nutcracker-source/song7-source-interactive.png";
import song8SourceInteractiveUrl from "./assets/nutcracker-source/song8-source-interactive.png";
import songControlButtonBodyUrl from "./assets/nutcracker-source/song-control-button-body.png";
import songCurtainCurveCxformUrl from "./assets/nutcracker-source/song-curtain-curve-cxform.png";
import songCurtainFillUrl from "./assets/nutcracker-source/song-curtain-fill.png";
import songCurtainStarsUrl from "./assets/nutcracker-source/song-curtain-stars.png";
import songHelpArtUrl from "./assets/nutcracker-source/song-help-art.png";
import songHelpframeTalkerUrl from "./assets/nutcracker-source/song-helpframe-talker.png";
import songKeyFrameTalkerUrl from "./assets/nutcracker-source/song-keyframe-talker.png";
import nutcrackerClubCertificateUrl from "./assets/nutcracker-source/nutcracker-club-certificate.png";
import songNoLabelUrl from "./assets/nutcracker-source/song-no-label.png";
import songPlayAgainButtonBodyUrl from "./assets/nutcracker-source/song-play-again-button-body.png";
import songPlayAgainLabelUrl from "./assets/nutcracker-source/song-play-again-label.png";
import songStopLabelUrl from "./assets/nutcracker-source/song-stop-label-blue.png";
import songWarningNoBodyUrl from "./assets/nutcracker-source/song-warning-no-body.png";
import songWarningNoLabelUrl from "./assets/nutcracker-source/song-warning-no-label.png";
import songWarningYesBodyUrl from "./assets/nutcracker-source/song-warning-yes-body.png";
import songWarningYesLabelUrl from "./assets/nutcracker-source/song-warning-yes-label.png";
import songWarningframeTalkerUrl from "./assets/nutcracker-source/song-warningframe-talker.png";
import songYesLabelUrl from "./assets/nutcracker-source/song-yes-label.png";
import fluteIntroGardenUrl from "./assets/source-scenes/flute-intro-garden.jpg";
import fluteIntroSwfUrl from "./assets/source-scenes/flute-intro.swf?url";
import projectorAlicePreviewSwfUrl from "./assets/source-scenes/projector-alice-preview.swf?url";
import projectorNutcracker2SwfUrl from "./assets/source-scenes/projector-nutcracker2.swf?url";
import listeningRoomSourceUrl from "./assets/source-scenes/listening-room-source.png";
import mainPlayRoomCompositeUrl from "./assets/source-scenes/main-playroom-source-composite.png";
import musictionaryHelpFishUrl from "./assets/source-scenes/musictionary-help-fish.png";
import musictionaryHelpUrl from "./assets/source-scenes/musictionary-help.png";
import projectorChooseSourceUrl from "./assets/source-scenes/projector-choose-source.png";
import readerControlExitHoverBalletUrl from "./assets/source-scenes/reader-control-exit-hover-ballet.png";
import readerControlExitHoverUrl from "./assets/source-scenes/reader-control-exit-hover.png";
import readerControlNextHoverUrl from "./assets/source-scenes/reader-control-next-hover.png";
import readerControlPrevHoverUrl from "./assets/source-scenes/reader-control-prev-hover.png";
import stageMarkUrl from "./assets/stage-mark.svg";
import { createAudioService, type AudioService } from "./audio/audioService";
import { createSourceSwfLayer, type SourceSwfLayer } from "./flash/sourceSwfLayer";
import {
  buildChildrensDoorsVariables,
  buildGameKeysVariables,
  buildNutDoorsVariables,
  buildNutHouseRoomsVariables,
  buildProjectorReturnStubSwf,
  connectProjectorBoundary,
  gramophoneInstallPath,
  notFoundResponse,
  patchGramophoneSoundDuration,
  patchProjectorStartFrame,
  parseProjectorExec,
  parseProjectorInstallIndex,
  patchProjectorWebsiteTarget,
  projectorBaseUrl,
  projectorInstallFileUrl,
  projectorInstallRoot,
  type ProjectorInstallIndex,
  projectorReturnPath,
  projectorStartFrames,
  swfResponse,
  variablesResponse,
} from "./flash/projectorBridge";
import {
  dictionaryInstruments,
  getDictionaryInstrument,
  getReadingActivity,
  getSuiteTrack,
  isReadingRouteId,
  suiteTracks,
  type DictionaryInstrument,
  type ReadingRouteId,
  type SuiteTrack,
} from "./data/referenceContent";
import {
  getCorrectNutcrackerTrackNumbers,
  getNutcrackerSongGameByRoute,
  getNutcrackerTrackStartSeconds,
  isCorrectNutcrackerSelection,
  isNutcrackerSongId,
  isNutcrackerTrackNumber,
  nutcrackerSongGames,
  type NutcrackerSongGame,
  type NutcrackerSongId,
  type NutcrackerTrack,
  type NutcrackerTrackNumber,
} from "./data/nutcrackerSongGames";
import { getRouteById, isRouteId, routes, type RouteDefinition, type RouteId } from "./routes";
import { createProgressStore, type DoorKey, type GameKey, type ProgressStoreController } from "./state/progressStore";

const nutcrackerSongSourceFrameUrls: Readonly<Record<NutcrackerSongId, string>> = {
  1: song1SourceInteractiveUrl,
  2: song2SourceInteractiveUrl,
  3: song3SourceInteractiveUrl,
  4: song4SourceInteractiveUrl,
  5: song5SourceInteractiveUrl,
  6: song6SourceInteractiveUrl,
  7: song7SourceInteractiveUrl,
  8: song8SourceInteractiveUrl,
};

type ShellState = {
  routeId: RouteId;
  routeStack: RouteId[];
  overturePhase: "intro" | "launcher" | "alice-preview";
  helpOpen: boolean;
  nutcrackerChooserWarningOpen: boolean;
  activeAudioId: string | null;
  pendingNutcrackerSongChange: NutcrackerSongId | null;
  pendingNutcrackerSongExit: NutcrackerSongId | null;
  readingPages: Record<ReadingRouteId, number>;
  activeDictionaryInstrumentId: string;
  musictionaryHelpOpen: boolean;
  musictionaryHelpFishVisible: boolean;
  activeSuiteTrackId: string | null;
  nutcrackerSelections: Record<NutcrackerSongId, NutcrackerTrackNumber[]>;
  nutcrackerFeedback: Record<NutcrackerSongId, string | null>;
};

type MainRoomHotspot = {
  readonly sourceButtonId: number;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly label: string;
  readonly sourcePath: string;
  readonly routeId?: RouteId;
};

type SuiteRecordPlacement = {
  readonly trackNumber: number;
  readonly sourceSpriteId: number;
  readonly sourceInstance: string;
  readonly depth: number;
  readonly x: number;
  readonly y: number;
  readonly matrix: readonly [number, number, number, number];
  readonly hitX?: number;
  readonly hitY?: number;
  readonly hitWidth?: number;
};

const mainRoomHotspots: readonly MainRoomHotspot[] = [
  { sourceButtonId: 625, depth: 5, x: 604.6, y: 131.8, label: "The NutHouse", sourcePath: "games/nuthouse/room11.swf" },
  { sourceButtonId: 631, depth: 7, x: 214.55, y: 293.15, label: "Children's Album Game", sourcePath: "games/childrensalbum/childrensalbum.swf" },
  { sourceButtonId: 632, depth: 12, x: 332.85, y: 377.05, label: "MusiCards", sourcePath: "games/memorygame/memory.swf" },
  { sourceButtonId: 634, depth: 19, x: 357.9, y: 429.25, label: "Flying Instruments", sourcePath: "games/flyinginstruments/flyinginstruments.swf" },
  { sourceButtonId: 635, depth: 23, x: 203.55, y: 427.85, label: "Musical Encyclopedia", sourcePath: "activities/musictionary/musictionary.swf", routeId: "music-dictionary" },
  { sourceButtonId: 636, depth: 29, x: 446.55, y: 347.8, label: "Music Trivia", sourcePath: "games/trivia/trivia.swf" },
  { sourceButtonId: 638, depth: 35, x: 562.5, y: 361.55, label: "The Funky Monkey Game", sourcePath: "games/melody/melody.swf" },
  { sourceButtonId: 639, depth: 39, x: 59.85, y: 435.45, label: "The Listening Room", sourcePath: "activities/originals/gramophone.swf", routeId: "suite" },
  { sourceButtonId: 640, depth: 50, x: 99.25, y: 143.85, label: "The Nutcracker Story", sourcePath: "activities/story/story.swf", routeId: "story" },
  { sourceButtonId: 642, depth: 58, x: 493.45, y: 169.45, label: "Find Me On The Tree", sourcePath: "games/tree/tree.swf" },
  { sourceButtonId: 643, depth: 65, x: 441.3, y: 246.65, label: "The Orchestra Game", sourcePath: "games/orchestragame/orchestra.swf" },
  { sourceButtonId: 644, depth: 87, x: 187.5, y: 130.25, label: "The Nutcracker Ballet", sourcePath: "activities/ballet/ballet.swf", routeId: "ballet-history" },
  { sourceButtonId: 646, depth: 93, x: 474.95, y: 105.7, label: "Tchaikovsky's Biography", sourcePath: "activities/biography/biography.swf", routeId: "composer-biography" },
];

/**
 * Movies the live projector loads into `_level1` through `_root.loadGame`, mapped to the reconstructed
 * routes. `games/nutcrackergame/nutchooser.swf` is the nine-key `nutButton` (button 0670).
 */
export const projectorGameRoutes: ReadonlyMap<string, RouteId> = new Map<string, RouteId>([
  ...mainRoomHotspots.flatMap((hotspot): [string, RouteId][] =>
    hotspot.routeId ? [[hotspot.sourcePath.toLowerCase(), hotspot.routeId]] : [],
  ),
  ["games/nutcrackergame/nutchooser.swf", "nutcracker-chooser"],
]);

/**
 * Room games that only the original CD provides (their hand-made routes were removed on 2026-11-06). If the
 * mirrored install lacks one, the projector gets the stand-in movie and goes straight back to the room.
 */
export const projectorInstallOnlyGames: ReadonlySet<string> = new Set(
  mainRoomHotspots.flatMap((hotspot) => (hotspot.routeId ? [] : [hotspot.sourcePath.toLowerCase()])),
);

/** `FSCommand:exec reset*` helpers (holdToReset prompt), mapped to the progress store. */
const projectorResetCommands = {
  gameKeys: "resetGameKeys",
  childrensDoors: "resetChildrensDoors",
  nutHouseRooms: "resetNutHouseRooms",
  nutDoors: "resetNutDoors",
} as const;

let projectorInstallIndexPromise: Promise<ProjectorInstallIndex> | null = null;

/** The recovered CD's file index; empty when the install was not mirrored (then the remaining hand-made routes run). */
function loadProjectorInstallIndex(): Promise<ProjectorInstallIndex> {
  if (!projectorInstallIndexPromise) {
    projectorInstallIndexPromise = window
      .fetch(`${projectorInstallRoot}index.json`)
      .then((response) => (response.ok ? response.json() : null))
      .then((json: unknown) => parseProjectorInstallIndex(json))
      .catch(() => {
        projectorInstallIndexPromise = null;
        return parseProjectorInstallIndex(null);
      });
  }
  return projectorInstallIndexPromise;
}

/** Test hook: forget the cached install index. */
export function resetProjectorInstallIndexForTests(): void {
  projectorInstallIndexPromise = null;
}

let projectorMoviePromise: Promise<Uint8Array> | null = null;

/**
 * The projector, fetched once, with its website getURL retargeted to `_blank`; a start frame other than
 * `choose` is patched into a further copy.
 */
function loadProjectorMovie(startFrame: number): Promise<Uint8Array> {
  if (!projectorMoviePromise) {
    projectorMoviePromise = window.fetch(projectorNutcracker2SwfUrl)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load ${projectorNutcracker2SwfUrl}: HTTP ${response.status}`);
        return response.arrayBuffer();
      })
      // The website YES must reach window.open (see patchProjectorWebsiteTarget).
      .then((buffer) => patchProjectorWebsiteTarget(new Uint8Array(buffer)))
      .catch((error: unknown) => {
        projectorMoviePromise = null;
        throw error;
      });
  }
  return projectorMoviePromise.then((movie) =>
    startFrame === projectorStartFrames.choose ? movie : patchProjectorStartFrame(movie, startFrame),
  );
}

const suiteRecordPlacements: readonly SuiteRecordPlacement[] = [
  { trackNumber: 1, sourceSpriteId: 63, sourceInstance: "lp1", depth: 43, x: 450.55, y: 384.2, matrix: [1.243, 0, 0, 0.562] },
  { trackNumber: 2, sourceSpriteId: 70, sourceInstance: "lp2", depth: 61, x: 559.65, y: 439.85, matrix: [1.243, 0.012, 0, 0.562] },
  { trackNumber: 3, sourceSpriteId: 72, sourceInstance: "lp3", depth: 79, x: 548.9, y: 393.1, matrix: [1.347, 0, 0, 0.272] },
  { trackNumber: 4, sourceSpriteId: 66, sourceInstance: "lp4", depth: 52, x: 327.75, y: 445.45, matrix: [1.134, 0, 0, 0.5] },
  { trackNumber: 5, sourceSpriteId: 59, sourceInstance: "lp5", depth: 32, x: 548.9, y: 333.25, matrix: [1.254, 0, 0, 0.575] },
  { trackNumber: 6, sourceSpriteId: 70, sourceInstance: "lp6", depth: 88, x: 349.3, y: 389.25, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 7, sourceSpriteId: 72, sourceInstance: "lp7", depth: 70, x: 444.95, y: 449.9, matrix: [1.41, 0, 0, 0.262] },
  { trackNumber: 8, sourceSpriteId: 70, sourceInstance: "lp8", depth: 97, x: 453.65, y: 335.85, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 9, sourceSpriteId: 76, sourceInstance: "lp9", depth: 106, x: 453.65, y: 132.85, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 10, sourceSpriteId: 76, sourceInstance: "lp10", depth: 115, x: 557.6, y: 133.25, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 11, sourceSpriteId: 76, sourceInstance: "lp11", depth: 124, x: 453.65, y: 175.65, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 12, sourceSpriteId: 76, sourceInstance: "lp12", depth: 133, x: 557.6, y: 226.05, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 13, sourceSpriteId: 76, sourceInstance: "lp13", depth: 142, x: 557.6, y: 179.45, matrix: [1.005, 0, 0, 0.478], hitX: 532, hitY: 179.45, hitWidth: 34 },
  { trackNumber: 14, sourceSpriteId: 76, sourceInstance: "lp14", depth: 151, x: 453.65, y: 225.85, matrix: [1.005, 0, 0, 0.478] },
  { trackNumber: 15, sourceSpriteId: 38, sourceInstance: "lp15", depth: 1, x: 547.15, y: 173.25, matrix: [1.005, 0, 0, 0.478], hitX: 575, hitY: 179.45, hitWidth: 34 },
  { trackNumber: 16, sourceSpriteId: 76, sourceInstance: "lp16", depth: 160, x: 557.6, y: 277.65, matrix: [1.005, 0, 0, 0.478] },
];

export type AppShellOptions = {
  progress?: ProgressStoreController;
  audio?: AudioService;
  previewAudioPath?: string;
  printCertificate?: () => void;
  showDeveloperPanel?: boolean;
  openExternal?: (url: string) => void;
  exitApp?: () => void;
  sourceSwfLayer?: SourceSwfLayer;
};

// Projector root frame 2 (MFIntro, reached from MFBtn) loads flute_intro.swf into `bigloader`; the root timeline removes it and
// reaches `choose` at frame 1268, i.e. 1266 frames of intro at 15 fps (84.4 s).
export const fluteIntroHandoffMs = Math.round((1266 / 15) * 1000);
// flute_intro.swf text id 0004 "skip" at x 770.95, y 572.50 (12 px font) on the 800 x 600 movie.
const fluteIntroSkipTarget = { left: 764 / 800, top: 566 / 600, width: 36 / 800, height: 30 / 600 } as const;
// Launcher aliceBTN -> root label aliceIntro (frame 1535); frame 2142 aliceJump returns to choose: 607 frames.
export const alicePreviewHandoffMs = Math.round((607 / 15) * 1000);
// Trailer skipBTN (button 0308, EXIT text ids 0033-0037) at x 563.50, y 25.45 on the 640 x 480 projector.
const alicePreviewSkipTarget = { left: 562 / 640, top: 14 / 480, width: 60 / 640, height: 28 / 480 } as const;

const defaultPreviewAudioPath = suiteTracks.find((track) => track.audioPath)?.audioPath ?? "";
const sourceReaderPreviousButtonIds: Record<ReadingRouteId, readonly (number | null)[]> = {
  story: [null, 34, 39, 44],
  "composer-biography": [null, 35, 43, 50],
  "ballet-history": [null, 36, 42, 47, 53],
};
const sourceReaderNextButtonIds: Record<ReadingRouteId, readonly (number | null)[]> = {
  story: [14, 14, 14, null],
  "composer-biography": [14, 14, 14, null],
  "ballet-history": [14, 14, 14, 48, null],
};
const sourceReaderExitButtonIds: Record<ReadingRouteId, number> = {
  story: 28,
  "composer-biography": 31,
  "ballet-history": 32,
};

function isDeveloperPanelRequested(): boolean {
  if (import.meta.env.VITE_DEV_PANEL === "1") return true;
  try {
    return new URLSearchParams(window.location.search).get("devpanel") === "1";
  } catch {
    return false;
  }
}

/** Height of the band reserved under the stage for the external certificate action, so it never overlaps the 640 x 480 source viewport. */
const releaseCertificateBandHeight = 56;

function fitStageToWindow(mount: HTMLElement): () => void {
  const apply = () => {
    const reservedHeight = mount.querySelector(".release-certificate-actions") ? releaseCertificateBandHeight : 0;
    const scale = Math.min(window.innerWidth / 640, (window.innerHeight - reservedHeight) / 480);
    mount.style.setProperty("--stage-scale", String(Math.max(scale, 0.25)));
  };
  apply();
  window.addEventListener("resize", apply);
  return apply;
}

export function createAppShell(mount: HTMLElement, options: AppShellOptions = {}): void {
  const progress = options.progress ?? createProgressStore();
  const audio = options.audio ?? createAudioService();
  const previewAudioPath = options.previewAudioPath ?? defaultPreviewAudioPath;
  const printCertificate = options.printCertificate ?? (() => window.print());
  const showDeveloperPanel = options.showDeveloperPanel ?? isDeveloperPanelRequested();
  const openExternal = options.openExternal ?? ((url: string) => {
    if ("__TAURI_INTERNALS__" in window) {
      void import("@tauri-apps/plugin-opener").then(({ openUrl }) => openUrl(url));
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  });
  const exitApp = options.exitApp ?? (() => {
    if ("__TAURI_INTERNALS__" in window) {
      void import("@tauri-apps/api/window").then(({ getCurrentWindow }) => getCurrentWindow().close());
      return;
    }
    window.close();
  });
  const sourceSwfLayer = options.sourceSwfLayer ?? createSourceSwfLayer();
  let overtureSourceSwfFailed = false;
  // The launcher and the music room are the live projector (projector-nutcracker2.swf) in Ruffle.
  // `projectorPosition` tracks where its root timeline is: on `choose`, in the room, or parked at
  // root frame 2383 with a game "loaded" in _level1 while the shell shows that game's route.
  let projectorFailed = false;
  let projectorPosition: "launcher" | "room" | "away" = "launcher";
  let projectorReturnRequested = false;
  let pendingProjectorReturn: ((response: Response) => void) | null = null;
  const projectorSessionPrefix = "projector@";
  const shellState: ShellState = {
    routeId: "overture",
    routeStack: [],
    // Projector root frame 1: GotoFrame 1267 (label choose). The original opens on the launcher; the
    // flute intro is the Musical Friends preview (frame 2, MFIntro), reached only from MFBtn.
    overturePhase: "launcher",
    helpOpen: false,
    nutcrackerChooserWarningOpen: false,
    activeAudioId: null,
    pendingNutcrackerSongChange: null,
    pendingNutcrackerSongExit: null,
    readingPages: {
      story: 0,
      "composer-biography": 0,
      "ballet-history": 0,
    },
    activeDictionaryInstrumentId: dictionaryInstruments[0].id,
    musictionaryHelpOpen: false,
    musictionaryHelpFishVisible: false,
    activeSuiteTrackId: null,
    nutcrackerSelections: createNutcrackerSelectionState(),
    nutcrackerFeedback: createNutcrackerFeedbackState(),
  };
  let readerExitTimerId: number | null = null;

  let refitStage: (() => void) | null = null;

  const render = (focusSelector?: string, fallbackFocusSelector?: string) => {
    const route = getRouteById(shellState.routeId);
    const progressSnapshot = progress.getSnapshot();
    const audioState = audio.getState();
    const sourceFrameRoute = isSourceFrameRoute(route.id);
    mount.innerHTML = `
      <section class="app-shell${showDeveloperPanel ? "" : " release-shell"}" aria-label="Desktop app shell">
        <div class="desktop-frame">
          <section class="game-viewport${sourceFrameRoute ? " source-frame-viewport" : ""}" aria-label="Fixed 640 by 480 game viewport">
            ${
              sourceFrameRoute
                ? ""
                : `<header class="scene-header">
                    <div>
                      <p class="kicker">Private local remake</p>
                      <p class="scene-title">${route.title}</p>
                    </div>
                    <p class="status-label">${progressSnapshot.completedGameCount} of 9 keys</p>
                  </header>`
            }
            ${renderScene(route, progressSnapshot, shellState, !overtureSourceSwfFailed, !projectorFailed)}
            ${
              sourceFrameRoute
                ? ""
                : `<footer class="scene-footer">
                  <div class="scene-actions">
                    ${renderPrimaryActions(route)}
                  </div>
                  <p class="status-label">640 x 480</p>
                </footer>`
            }
            ${shellState.helpOpen ? renderHelp(route) : ""}
            ${shellState.nutcrackerChooserWarningOpen && route.id === "nutcracker-chooser" ? renderChooserWarningFrame() : ""}
          </section>
          ${
            showDeveloperPanel
              ? `<nav class="route-panel" aria-label="Recovered game routes">
            <h2>Route Map</h2>
            <ol class="route-list">
              ${routes
                .map(
                  (item) => `
                    <li>
                      <button
                        class="route-button"
                        type="button"
                        data-route="${item.id}"
                        aria-current="${item.id === shellState.routeId ? "page" : "false"}"
                      >
                        ${item.title}
                      </button>
                    </li>
                  `,
                )
                .join("")}
            </ol>
            <section class="progress-panel" aria-label="Progress debug controls">
              <h2>Progress</h2>
              <div class="meter-row"><span>Game keys</span><strong>${progressSnapshot.completedGameCount}/9</strong></div>
              <div class="meter-row"><span>Song doors</span><strong>${progressSnapshot.openedNutDoorCount}/8</strong></div>
              <div class="meter-row"><span>Album doors</span><strong>${progressSnapshot.openedChildrensDoorCount}/8</strong></div>
              <div class="meter-row"><span>Nut House</span><strong>${progressSnapshot.nutHouse.openDoor}</strong></div>
              <div class="debug-grid">
                <button class="panel-button" type="button" data-progress="key" data-key="1">Key 1</button>
                <button class="panel-button" type="button" data-progress="nut-door" data-door="1">Door 1</button>
                <button class="panel-button" type="button" data-progress="children-door" data-door="1">Album 1</button>
                <button class="panel-button" type="button" data-progress="nut-house" data-door="1">Room 1</button>
              </div>
              ${
                progressSnapshot.gameKeys[1]
                  ? renderNutcrackerCertificatePrintAction("panel-button certificate-print-button")
                  : ""
              }
              <button class="panel-button danger" type="button" data-action="reset-progress">Reset progress</button>
            </section>
            <section class="progress-panel" aria-label="Audio controls">
              <h2>Audio</h2>
              <div class="meter-row"><span>Active</span><strong>${audioState.activeTrackCount}</strong></div>
              <label class="volume-control">
                <span>Volume</span>
                <input type="range" min="0" max="100" value="${Math.round(audioState.volume * 100)}" data-action="volume" />
              </label>
              <div class="debug-grid two-up">
                <button class="panel-button" type="button" data-action="audio-preview">${shellState.activeAudioId ? "Restart" : "Preview"}</button>
                <button class="panel-button" type="button" data-action="audio-stop">Stop</button>
                <button class="panel-button" type="button" data-action="mute">${audioState.muted ? "Unmute" : "Mute"}</button>
              </div>
              <p class="diagnostic">${audioState.diagnostics.slice(-1)[0]?.message ?? "Audio diagnostics will appear here."}</p>
            </section>
            <p class="build-note">Local desktop package only. Recovered media stays bundled locally under the app shell.</p>
          </nav>`
              : ""
          }
        </div>
        ${
          !showDeveloperPanel && progressSnapshot.gameKeys[1]
            ? `<section class="release-certificate-actions" aria-label="Nutcracker certificate action">
                ${renderNutcrackerCertificatePrintAction("certificate-print-button")}
              </section>`
            : ""
        }
        ${progressSnapshot.gameKeys[1] ? renderNutcrackerCertificatePrintSurface() : ""}
      </section>
    `;
    refitStage?.();

    mount.querySelectorAll<HTMLButtonElement>("[data-route]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRoute = button.dataset.route;
        if (nextRoute && isRouteId(nextRoute)) {
          navigate(nextRoute);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-scene-route]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextRoute = button.dataset.sceneRoute;
        if (nextRoute && isRouteId(nextRoute)) {
          navigate(nextRoute);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-progress]").forEach((button) => {
      button.addEventListener("click", () => {
        updateProgress(button, progress);
        render();
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const activeSong = getNutcrackerSongGameByRoute(shellState.routeId);
        if (
          activeSong &&
          isNutcrackerSongInteractionBlocked(activeSong.id) &&
          button.dataset.modalDismiss !== "true"
        ) {
          return;
        }
        handleAction(button.dataset.action);
      });
    });

    mount.querySelector<HTMLInputElement>('[data-action="volume"]')?.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      audio.setVolume(Number(target.value) / 100);
      render();
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-reading-audio]").forEach((button) => {
      button.addEventListener("click", () => {
        const audioPath = button.dataset.readingAudio;
        if (audioPath) {
          playSceneAudio(audioPath, false);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-reading-page]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const routeId = button.dataset.readingRoute;
        const pageIndex = Number(button.dataset.readingPage);
        if (routeId && isRouteId(routeId) && isReadingRouteId(routeId) && Number.isInteger(pageIndex)) {
          const activity = getReadingActivity(routeId);
          shellState.readingPages[routeId] = Math.min(Math.max(pageIndex, 0), activity.pages.length - 1);
          if (event.detail === 0) {
            render(
              `[data-reading-direction="${button.dataset.readingDirection ?? "next"}"]`,
              "[data-source-reader-heading]",
            );
          } else {
            render();
          }
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-dictionary-entry]").forEach((button) => {
      button.addEventListener("click", () => {
        const instrumentId = button.dataset.dictionaryEntry;
        if (instrumentId) {
          const instrument = getDictionaryInstrument(instrumentId);
          shellState.activeDictionaryInstrumentId = instrument.id;
          audio.stopSceneAudio();
          shellState.activeAudioId = audio.playOneShot(instrument.audioPath).id;
          render();
        }
      });
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-next]")?.addEventListener("click", (event) => {
      const activeIndex = dictionaryInstruments.findIndex((instrument) => instrument.id === shellState.activeDictionaryInstrumentId);
      const nextIndex = (Math.max(activeIndex, 0) + 1) % dictionaryInstruments.length;
      const nextInstrument = dictionaryInstruments[nextIndex];
      shellState.activeDictionaryInstrumentId = nextInstrument.id;
      audio.stopSceneAudio();
      shellState.activeAudioId = audio.playOneShot(nextInstrument.audioPath).id;
      if (event.detail === 0) {
        render("[data-dictionary-next]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help]")?.addEventListener("click", (event) => {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.musictionaryHelpOpen = true;
      shellState.musictionaryHelpFishVisible = false;
      if (event.detail === 0) {
        render("[data-dictionary-help-fish]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help-fish]")?.addEventListener("click", (event) => {
      shellState.musictionaryHelpFishVisible = !shellState.musictionaryHelpFishVisible;
      if (event.detail === 0) {
        render("[data-dictionary-help-fish]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelector<HTMLButtonElement>("[data-dictionary-help-close]")?.addEventListener("click", (event) => {
      shellState.musictionaryHelpOpen = false;
      shellState.musictionaryHelpFishVisible = false;
      if (event.detail === 0) {
        render("[data-dictionary-help]", "[data-source-musictionary-heading]");
      } else {
        render();
      }
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-suite-track]").forEach((button) => {
      button.addEventListener("click", () => {
        const trackId = button.dataset.suiteTrack;
        if (trackId) {
          selectSuiteTrack(trackId);
        }
      });
      button.addEventListener("dragstart", (event) => {
        const trackId = button.dataset.suiteTrack;
        if (trackId) {
          event.dataTransfer?.setData("text/plain", trackId);
          event.dataTransfer?.setData("application/x-listening-room-record", trackId);
          event.dataTransfer?.setDragImage(button, 12, 12);
        }
      });
    });

    mount.querySelector<HTMLElement>("[data-suite-drop]")?.addEventListener("dragover", (event) => {
      event.preventDefault();
    });

    mount.querySelector<HTMLElement>("[data-suite-drop]")?.addEventListener("drop", (event) => {
      event.preventDefault();
      const trackId =
        event.dataTransfer?.getData("application/x-listening-room-record") ||
        event.dataTransfer?.getData("text/plain") ||
        "";
      if (suiteTracks.some((track) => track.id === trackId)) {
        selectSuiteTrack(trackId);
      }
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-nutcracker-door]").forEach((button) => {
      button.addEventListener("click", () => {
        const songId = Number(button.dataset.nutcrackerDoor);
        if (isNutcrackerSongId(songId)) {
          navigate(`song-${songId}`);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-nutcracker-preview]").forEach((button) => {
      button.addEventListener("click", () => {
        const songId = Number(button.dataset.nutcrackerPreview);
        if (isNutcrackerSongId(songId)) {
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          if (song) {
            playNutcrackerSongPreview(song);
          }
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-song-track]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          if (isNutcrackerSongInteractionBlocked(songId)) {
            return;
          }
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          const track = song?.tracks.find((item) => item.number === trackNumber);
          if (!song || !track) {
            return;
          }
          if (event.detail === 0) {
            toggleNutcrackerTrack(shellState, songId, trackNumber);
            checkNutcrackerSelectionIfReady(song, shellState, progress);
            render();
            return;
          }
          playNutcrackerTrackPreview(track);
        }
      });
      button.addEventListener("dblclick", () => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          if (isNutcrackerSongInteractionBlocked(songId)) {
            return;
          }
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          if (!song) {
            return;
          }
          toggleNutcrackerTrack(shellState, songId, trackNumber);
          checkNutcrackerSelectionIfReady(song, shellState, progress);
          render();
        }
      });
      button.addEventListener("dragstart", (event) => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          event.dataTransfer?.setData("text/plain", `${songId}:${trackNumber}`);
          event.dataTransfer?.setData("application/x-nutcracker-track", `${songId}:${trackNumber}`);
          event.dataTransfer?.setDragImage(button, 12, 12);
        }
      });
    });

    mount.querySelectorAll<HTMLElement>("[data-source-help]").forEach((sourceHelpElement) => {
      const helpTarget = sourceHelpElement.matches("button")
        ? sourceHelpElement
        : sourceHelpElement.querySelector<HTMLButtonElement>("button");
      if (!helpTarget) {
        return;
      }
      helpTarget.addEventListener("pointerenter", (event) => {
        showSourceFlyingHelp(sourceHelpElement, event);
      });
      helpTarget.addEventListener("pointermove", (event) => {
        showSourceFlyingHelp(sourceHelpElement, event);
      });
      helpTarget.addEventListener("pointerleave", () => {
        hideSourceFlyingHelp();
      });
      helpTarget.addEventListener("focus", () => {
        showSourceFlyingHelp(sourceHelpElement);
      });
      helpTarget.addEventListener("blur", () => {
        hideSourceFlyingHelp();
      });
    });

    mount.querySelectorAll<HTMLElement>("[data-song-drop-stage]").forEach((stage) => {
      stage.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      stage.addEventListener("drop", (event) => {
        event.preventDefault();
        const payload =
          event.dataTransfer?.getData("application/x-nutcracker-track") || event.dataTransfer?.getData("text/plain") || "";
        const [songIdRaw, trackNumberRaw] = payload.split(":");
        const songId = Number(songIdRaw);
        const trackNumber = Number(trackNumberRaw);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
          if (isNutcrackerSongInteractionBlocked(songId)) {
            return;
          }
          const song = nutcrackerSongGames.find((item) => item.id === songId);
          if (!song || song.routeId !== shellState.routeId) {
            return;
          }
          addNutcrackerTrack(shellState, songId, trackNumber);
          checkNutcrackerSelectionIfReady(song, shellState, progress);
          render();
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-song-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const songId = Number(button.dataset.songId);
        if (isNutcrackerSongId(songId)) {
          const songAction = button.dataset.songAction;
          if (isNutcrackerSongInteractionBlocked(songId) && !isNutcrackerSongModalAction(songAction)) {
            return;
          }
          handleSongAction(songId, songAction);
        }
      });
    });

    if (focusSelector) {
      const requestedTarget = mount.querySelector<HTMLElement>(focusSelector);
      const usableTarget =
        requestedTarget instanceof HTMLButtonElement && requestedTarget.disabled ? null : requestedTarget;
      const fallbackTarget = fallbackFocusSelector
        ? mount.querySelector<HTMLElement>(fallbackFocusSelector)
        : null;
      (usableTarget ?? fallbackTarget)?.focus();
    }
    syncSourceSwf();
  };

  const isProjectorSession = () => sourceSwfLayer.activeSession()?.startsWith(projectorSessionPrefix) === true;

  const settlePendingProjectorReturn = (response: Response) => {
    const resolve = pendingProjectorReturn;
    pendingProjectorReturn = null;
    resolve?.(response);
  };

  const projectorReturnVariables = () => `ret=1${buildGameKeysVariables(progress.getSnapshot().gameKeys)}`;

  // The stand-in movie in _level1 copies these keys into _level0 and runs _level0.gotoAndPlay("comeAgain").
  const returnProjectorToRoom = () => {
    projectorPosition = "room";
    if (pendingProjectorReturn) settlePendingProjectorReturn(variablesResponse(projectorReturnVariables()));
    else projectorReturnRequested = true;
  };

  const handleProjectorFsCommand = (command: string, args: string) => {
    const name = command.trim().toLowerCase();
    if (name === "quit") {
      exitApp();
      return;
    }
    if (name === "exec") {
      // The CD's helper programs wrote games/data/*.txt; the remake writes the progress store instead.
      const helper = parseProjectorExec(args);
      if (helper.kind === "gameKey") progress.markGameKey(helper.key);
      else if (helper.kind === "nutDoor") progress.markNutDoor(helper.door);
      else if (helper.kind === "childrensDoor") progress.markChildrensDoor(helper.door);
      else if (helper.kind === "reset") progress[projectorResetCommands[helper.target]]();
      else console.info(`Projector FSCommand exec ${args} has no desktop equivalent`);
      return;
    }
    // fullscreen, allowscale, and showmenu: the desktop window already holds the scaled stage.
  };

  const startProjector = (stage: HTMLElement, startFrame: number) => {
    sourceSwfLayer.stop();
    settlePendingProjectorReturn(notFoundResponse());
    projectorReturnRequested = false;
    projectorPosition = startFrame === projectorStartFrames.choose ? "launcher" : "room";
    sourceSwfLayer.play(stage, {
      swfUrl: projectorNutcracker2SwfUrl,
      sessionKey: `${projectorSessionPrefix}${startFrame}`,
      loadData: () => loadProjectorMovie(startFrame),
      interactive: true,
      base: projectorBaseUrl(),
      quality: "medium",
      onFSCommand: handleProjectorFsCommand,
      onError: (error) => {
        console.warn("The projector could not start through Ruffle; keeping the static source launcher and room", error);
        projectorFailed = true;
        render();
      },
    });
  };

  // Every relative URL the projector requests arrives here instead of the network.
  connectProjectorBoundary({
    request: async (path) => {
      if (path === "games/data/gamekeys.txt") {
        // nutIni: the featured game was chosen; the room animates in on the projector's own timeline.
        projectorPosition = "room";
        if (shellState.routeId === "overture") {
          window.setTimeout(() => {
            if (projectorPosition !== "launcher" && shellState.routeId === "overture") navigate("main-menu");
          }, 0);
        }
        return variablesResponse(buildGameKeysVariables(progress.getSnapshot().gameKeys));
      }
      if (path === "games/data/nutdoors.txt") {
        return variablesResponse(buildNutDoorsVariables(progress.getSnapshot().nutDoors));
      }
      if (path === "games/data/childrensdoors.txt") {
        return variablesResponse(buildChildrensDoorsVariables(progress.getSnapshot().childrensDoors));
      }
      if (path === "games/data/nuthouserooms.txt") {
        return variablesResponse(buildNutHouseRoomsVariables(progress.getSnapshot().nutHouse.openDoor));
      }
      if (path === projectorReturnPath) {
        if (projectorReturnRequested) {
          projectorReturnRequested = false;
          return variablesResponse(projectorReturnVariables());
        }
        settlePendingProjectorReturn(notFoundResponse());
        return new Promise<Response>((resolve) => {
          pendingProjectorReturn = resolve;
        });
      }
      if (path === "flute_intro.swf") {
        // MFBtn -> MFintro loads the intro into bigloader. Play it fitted to the stage (Stage 1) instead.
        window.setTimeout(() => handleAction("preview-musical-friends"), 0);
        return notFoundResponse();
      }
      // The original games, activities, and everything they load, straight from the recovered CD. A game
      // runs in the projector's _level1 and returns through comeAgain on its own, as on the CD.
      const realPath = (await loadProjectorInstallIndex()).get(path);
      if (realPath) {
        const response = await window.fetch(projectorInstallFileUrl(realPath));
        if (response.ok && realPath === gramophoneInstallPath) {
          // The Listening Room needs the projector's synchronous loadSound (patchGramophoneSoundDuration).
          return swfResponse(patchGramophoneSoundDuration(new Uint8Array(await response.arrayBuffer())));
        }
        if (response.ok) return response;
        console.warn(`The projector install file ${realPath} could not be served: HTTP ${response.status}`);
      }
      // Without the mirrored install, open the hand-made route behind a stand-in movie instead.
      const routeId = projectorGameRoutes.get(path);
      if (routeId) {
        projectorPosition = "away";
        window.setTimeout(() => navigate(routeId), 0);
        return swfResponse(buildProjectorReturnStubSwf());
      }
      // A room game with no hand-made route: the stand-in movie returns the projector to the room at once.
      if (projectorInstallOnlyGames.has(path)) {
        console.warn(`The projector install file for ${path} is missing; returning to the room`);
        returnProjectorToRoom();
        return swfResponse(buildProjectorReturnStubSwf());
      }
      console.info(`The projector requested ${path}, which the recovered install does not provide`);
      return notFoundResponse();
    },
    openUrl: (url) => openExternal(url),
  });

  // The launcher and the room are the live projector. The intro and the fallback Alice preview play the
  // original movies through the same Ruffle layer. Static source scenes stay underneath as fallbacks.
  const syncSourceSwf = () => {
    const projectorStage = mount.querySelector<HTMLElement>(".source-projector-launcher, .source-playroom-scene");
    if (projectorStage && !projectorFailed) {
      const wantLauncher = shellState.routeId === "overture";
      const restart =
        !isProjectorSession() ||
        (wantLauncher && projectorPosition !== "launcher") ||
        (!wantLauncher && projectorPosition === "launcher");
      if (restart) {
        startProjector(projectorStage, wantLauncher ? projectorStartFrames.choose : projectorStartFrames.nutIni);
        return;
      }
      sourceSwfLayer.resume(projectorStage);
      if (!wantLauncher && projectorPosition === "away") returnProjectorToRoom();
      return;
    }
    const alicePreviewStage = mount.querySelector<HTMLElement>(".source-alice-preview-scene");
    if (alicePreviewStage) {
      sourceSwfLayer.play(alicePreviewStage, {
        swfUrl: projectorAlicePreviewSwfUrl,
        handoffAfterMs: alicePreviewHandoffMs,
        quality: "medium",
        // aliceSkip (button 0307) is a full-stage hit area, so Flash shows its hand cursor everywhere.
        cursor: "pointer",
        skipTarget: alicePreviewSkipTarget,
        skipLabel: "EXIT",
        skipSourceControl: "skipBTN button 0308 (EXIT text ids 0033-0037) at x 563.50 y 25.45; onRelease unloadMovieNum 1 and gotoAndStop choose",
        onSkip: () => handleAction("start"),
        onEnd: () => handleAction("start"),
        onError: (error) => {
          console.warn("The projector Alice preview could not start through Ruffle; returning to the launcher", error);
          handleAction("start");
        },
      });
      return;
    }
    const introStage = mount.querySelector<HTMLElement>(".source-intro-scene");
    if (!introStage || overtureSourceSwfFailed) {
      // A game route opened from the room: keep the projector paused behind it, as the original kept
      // _level0 loaded (and hidden) under the game in _level1.
      if (!introStage && isProjectorSession() && projectorPosition !== "launcher") sourceSwfLayer.suspend();
      else sourceSwfLayer.stop();
      return;
    }
    sourceSwfLayer.play(introStage, {
      swfUrl: fluteIntroSwfUrl,
      handoffAfterMs: fluteIntroHandoffMs,
      quality: "medium",
      skipTarget: fluteIntroSkipTarget,
      onSkip: () => handleAction("start"),
      onEnd: () => handleAction("start"),
      onError: (error) => {
        console.warn("flute_intro.swf could not start through Ruffle; keeping the static source scene", error);
        overtureSourceSwfFailed = true;
        render();
      },
    });
  };

  const isNutcrackerSongInteractionBlocked = (songId: NutcrackerSongId): boolean =>
    getNutcrackerSongGameByRoute(shellState.routeId)?.id === songId &&
    (shellState.helpOpen ||
      shellState.nutcrackerFeedback[songId] === "hint" ||
      shellState.pendingNutcrackerSongChange === songId ||
      shellState.pendingNutcrackerSongExit === songId);

  const isNutcrackerSongModalAction = (action: string | undefined): boolean =>
    action === "dismiss-hint" ||
    action === "accept-change-song" ||
    action === "cancel-change-song" ||
    action === "accept-exit-song" ||
    action === "cancel-exit-song";

  const showSourceFlyingHelp = (sourceHelpElement: HTMLElement, event?: PointerEvent) => {
    const label = sourceHelpElement.dataset.sourceHelp;
    const flyingHelp = mount.querySelector<HTMLElement>(".source-flying-help");
    const viewport = mount.querySelector<HTMLElement>(".game-viewport");
    if (!label || !flyingHelp || !viewport) {
      return;
    }

    flyingHelp.querySelectorAll<HTMLElement>(".source-flying-help-text").forEach((layer) => {
      layer.textContent = label;
    });
    flyingHelp.dataset.sourceFrame = sourceHelpElement.dataset.sourceHelpFrame ?? "2";
    flyingHelp.dataset.sourceBounds = sourceHelpElement.dataset.sourceHelpBounds ?? "frame 2 edit ids 0231-0233 bbox approx 276x22 after 1.2 scale";
    flyingHelp.dataset.visible = "true";

    const viewportRect = viewport.getBoundingClientRect();
    const sourceRect = sourceHelpElement.getBoundingClientRect();
    // The release shell scales the 640-wide stage with a CSS transform; pointer coordinates are in
    // screen pixels, while style.left/top are in unscaled stage pixels, so divide out the scale.
    const renderedScale = viewportRect.width > 0 ? viewportRect.width / 640 : 1;
    const sourceX = (event ? event.clientX - viewportRect.left : sourceRect.left + sourceRect.width / 2 - viewportRect.left) / renderedScale;
    const sourceY = (event ? event.clientY - viewportRect.top : sourceRect.top - viewportRect.top) / renderedScale;
    const left = Math.min(Math.max(sourceX + 14, 8), 488);
    const top = Math.min(Math.max(sourceY - 34, 8), 438);
    flyingHelp.style.left = `${left}px`;
    flyingHelp.style.top = `${top}px`;
  };

  const hideSourceFlyingHelp = () => {
    const flyingHelp = mount.querySelector<HTMLElement>(".source-flying-help");
    if (!flyingHelp) {
      return;
    }
    flyingHelp.querySelectorAll<HTMLElement>(".source-flying-help-text").forEach((layer) => {
      layer.textContent = "";
    });
    delete flyingHelp.dataset.visible;
    flyingHelp.style.left = "10000px";
  };

  const navigate = (routeId: RouteId) => {
    if (readerExitTimerId !== null) {
      window.clearTimeout(readerExitTimerId);
      readerExitTimerId = null;
    }
    const routeChanged = routeId !== shellState.routeId;
    if (routeChanged) {
      shellState.routeStack.push(shellState.routeId);
    }
    if (routeChanged && routeId === "overture") {
      shellState.overturePhase = "launcher";
    }
    if (routeChanged && isReadingRouteId(routeId)) {
      shellState.readingPages[routeId] = 0;
    }
    if (routeChanged && routeId === "music-dictionary") {
      shellState.activeDictionaryInstrumentId = dictionaryInstruments[0].id;
    }
    shellState.routeId = routeId;
    shellState.helpOpen = false;
    shellState.musictionaryHelpOpen = false;
    shellState.musictionaryHelpFishVisible = false;
    shellState.nutcrackerChooserWarningOpen = false;
    shellState.pendingNutcrackerSongChange = null;
    shellState.pendingNutcrackerSongExit = null;
    audio.stopSceneAudio();
    shellState.activeAudioId = null;
    shellState.activeSuiteTrackId = null;
    if (isReadingRouteId(routeId)) {
      const narrationPath = getReadingActivity(routeId).audioPath;
      if (narrationPath) {
        shellState.activeAudioId = audio.playOneShot(narrationPath).id;
      }
    }
    if (routeId === "music-dictionary") {
      shellState.activeAudioId = audio.playOneShot(getDictionaryInstrument(shellState.activeDictionaryInstrumentId).audioPath).id;
    }
    render();
  };

  const stopSceneAudio = () => {
    audio.stopSceneAudio();
    shellState.activeAudioId = null;
    shellState.activeSuiteTrackId = null;
    render();
  };

  const playNutcrackerTrackPreview = (track: NutcrackerTrack) => {
    audio.stopSceneAudio();
    shellState.activeSuiteTrackId = null;
    shellState.activeAudioId = audio.playTrack(track.audioPath, getNutcrackerTrackStartSeconds(track)).id;
  };

  const playNutcrackerSongPreview = (song: NutcrackerSongGame) => {
    audio.stopSceneAudio();
    shellState.activeSuiteTrackId = null;
    const handles = song.tracks.filter((track) => track.valid).map((track) => audio.playOneShot(track.audioPath));
    shellState.activeAudioId = handles[0]?.id ?? null;
    render();
  };

  const playSceneAudio = (audioPath: string, loop: boolean, startTimeSeconds = 0) => {
    audio.stopSceneAudio();
    shellState.activeAudioId = loop ? audio.playTrack(audioPath, startTimeSeconds).id : audio.playOneShot(audioPath).id;
    render();
  };

  const selectSuiteTrack = (trackId: string) => {
    const track = getSuiteTrack(trackId);
    audio.stopSceneAudio();
    shellState.activeSuiteTrackId = track.id;
    shellState.activeAudioId = track.audioPath ? audio.playOneShot(track.audioPath).id : null;
    render();
  };

  const handleAction = (action: string | undefined) => {
    if (action === "start") {
      shellState.overturePhase = "launcher";
      render(".source-projector-launcher");
      return;
    }

    if (action === "play-featured-game") {
      navigate("main-menu");
      return;
    }

    if (action === "preview-musical-friends") {
      shellState.overturePhase = "intro";
      render(".source-intro-scene");
      return;
    }

    if (action === "preview-alice") {
      shellState.overturePhase = "alice-preview";
      render();
      return;
    }

    if (action === "open-kids-music-stage") {
      openExternal("http://www.kidsmusicstage.com");
      return;
    }

    if (action === "exit-projector") {
      exitApp();
      return;
    }

    if (action === "back") {
      shellState.routeId = shellState.routeStack.pop() ?? "main-menu";
      shellState.helpOpen = false;
      shellState.musictionaryHelpOpen = false;
      shellState.musictionaryHelpFishVisible = false;
      shellState.nutcrackerChooserWarningOpen = false;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      render();
      return;
    }

    if (action === "help") {
      const songRoute = getNutcrackerSongGameByRoute(shellState.routeId);
      const closingSongHelp = Boolean(songRoute && shellState.helpOpen);
      shellState.nutcrackerChooserWarningOpen = false;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      if (songRoute) {
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        shellState.activeSuiteTrackId = null;
      }
      shellState.helpOpen = !shellState.helpOpen;
      if (songRoute) {
        render(
          closingSongHelp ? '[data-source-control="helpButton"]' : '[data-modal-dismiss="true"]',
          ".nutcracker-song-scene",
        );
      } else {
        render();
      }
      return;
    }

    if (action === "chooser-warning") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.helpOpen = false;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      shellState.nutcrackerChooserWarningOpen = true;
      render();
      return;
    }

    if (action === "cancel-chooser-warning") {
      shellState.nutcrackerChooserWarningOpen = false;
      render();
      return;
    }

    if (action === "accept-chooser-warning") {
      shellState.nutcrackerChooserWarningOpen = false;
      navigate("main-menu");
      return;
    }

    if (action === "exit") {
      if (isReadingRouteId(shellState.routeId)) {
        const readerScene = mount.querySelector<HTMLElement>(".source-reader-scene");
        if (!readerScene || readerScene.dataset.exiting === "true") {
          return;
        }
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        readerScene.dataset.exiting = "true";
        readerExitTimerId = window.setTimeout(() => {
          readerExitTimerId = null;
          navigate("main-menu");
        }, 400);
        return;
      }
      navigate("main-menu");
      return;
    }

    if (action === "reset-progress") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      progress.resetAll();
      render();
      return;
    }

    if (action === "print-certificate") {
      if (progress.getSnapshot().gameKeys[1]) {
        printCertificate();
      }
      return;
    }

    if (action === "audio-preview") {
      audio.stopSceneAudio();
      shellState.activeAudioId = audio.playTrack(previewAudioPath).id;
      render();
      return;
    }

    if (action === "audio-stop") {
      stopSceneAudio();
      return;
    }

    if (action === "suite-stop") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      render();
      return;
    }

    if (action === "suite-play") {
      const track = getSuiteTrack(shellState.activeSuiteTrackId ?? suiteTracks[0].id);
      shellState.activeSuiteTrackId = track.id;
      if (track.audioPath) {
        playSceneAudio(track.audioPath, false);
      } else {
        audio.stopSceneAudio();
        shellState.activeAudioId = null;
        render();
      }
      return;
    }

    if (action === "mute") {
      audio.setMuted(!audio.getState().muted);
      render();
    }
  };

  const handleSongAction = (songId: NutcrackerSongId, action: string | undefined) => {
    const song = nutcrackerSongGames.find((item) => item.id === songId);
    if (!song) {
      return;
    }

    if (action === "play-theme") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      if (shellState.activeAudioId) {
        stopSceneAudio();
        return;
      }
      playNutcrackerSongPreview(song);
      return;
    }

    if (action === "reset-song") {
      shellState.nutcrackerSelections[songId] = [];
      shellState.nutcrackerFeedback[songId] = null;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      render();
      return;
    }

    if (action === "confirm-change-song") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.pendingNutcrackerSongChange = songId;
      shellState.pendingNutcrackerSongExit = null;
      render('[data-song-action="cancel-change-song"]', ".source-change-alert");
      return;
    }

    if (action === "cancel-change-song") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      render('[data-source-control="songChooser"]', ".nutcracker-song-scene");
      return;
    }

    if (action === "accept-change-song") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      navigate("nutcracker-chooser");
      return;
    }

    if (action === "confirm-exit-song") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = songId;
      render('[data-song-action="cancel-exit-song"]', ".source-song-warning-modal");
      return;
    }

    if (action === "cancel-exit-song") {
      shellState.pendingNutcrackerSongExit = null;
      render('[data-source-control="quiter"]', ".nutcracker-song-scene");
      return;
    }

    if (action === "accept-exit-song") {
      shellState.pendingNutcrackerSongExit = null;
      navigate("nutcracker-chooser");
      return;
    }

    if (action === "hint-song") {
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      showNutcrackerHint(song, shellState, progress);
      render('[data-song-action="dismiss-hint"]', ".source-hint-alert");
      return;
    }

    if (action === "dismiss-hint") {
      if (shellState.nutcrackerFeedback[songId] === "hint") {
        shellState.nutcrackerFeedback[songId] = null;
      }
      render('[data-source-control="hintButton"]', ".nutcracker-song-scene");
      return;
    }

    if (action === "submit-song") {
      submitNutcrackerSong(song, shellState, progress);
      render();
    }
  };

  let audioIdleUpdateScheduled = false;
  audio.subscribe((audioState) => {
    if (audioState.activeTrackCount !== 0 || shellState.activeAudioId === null || audioIdleUpdateScheduled) {
      return;
    }
    audioIdleUpdateScheduled = true;
    queueMicrotask(() => {
      audioIdleUpdateScheduled = false;
      if (audio.getState().activeTrackCount === 0 && shellState.activeAudioId !== null) {
        shellState.activeAudioId = null;
        render();
      }
    });
  });

  render();
  if (!showDeveloperPanel) {
    refitStage = fitStageToWindow(mount);
    // The first render measured the stage before the window scale applied; re-pin the SWF layer.
    syncSourceSwf();
  }
}

function renderScene(
  route: RouteDefinition,
  progress: ReturnType<ProgressStoreController["getSnapshot"]>,
  shellState: ShellState,
  sourceSwfActive: boolean,
  projectorLive: boolean,
): string {
  if (route.id === "overture") {
    return renderSourceOverture(shellState.overturePhase, sourceSwfActive, projectorLive);
  }

  if (route.id === "main-menu") {
    return renderMainPlayRoom(progress, projectorLive);
  }

  if (isReadingRouteId(route.id)) {
    return renderReadingActivity(route.id, shellState.readingPages[route.id]);
  }

  if (route.id === "music-dictionary") {
    return renderMusicDictionary(
      getDictionaryInstrument(shellState.activeDictionaryInstrumentId),
      shellState.musictionaryHelpOpen,
      shellState.musictionaryHelpFishVisible,
    );
  }

  if (route.id === "suite") {
    return renderSuitePlayer(shellState.activeSuiteTrackId, shellState.activeAudioId !== null);
  }

  if (route.id === "nutcracker-chooser") {
    return renderNutcrackerChooser(progress);
  }

  const song = getNutcrackerSongGameByRoute(route.id);
  if (song) {
    return renderNutcrackerSongGame(
      song,
      progress.nutDoors[song.id],
      shellState.nutcrackerSelections[song.id],
      shellState.nutcrackerFeedback[song.id],
      progress.openedNutDoorCount === nutcrackerSongGames.length,
      shellState.activeAudioId !== null,
      shellState.pendingNutcrackerSongChange === song.id,
      shellState.pendingNutcrackerSongExit === song.id,
      shellState.helpOpen,
    );
  }

  return `
    <div class="scene-body">
      <img class="stage-mark" src="${stageMarkUrl}" alt="" aria-hidden="true" />
      <div class="scene-copy">
        <p class="level-label">${route.levelTarget}</p>
        <h1>${route.heading}</h1>
        <p>${route.summary}</p>
      </div>
    </div>
  `;
}

/** Under the live projector, the source-placed DOM targets stay for the static fallback only. */
const liveProjectorInertTarget = 'tabindex="-1" aria-hidden="true"';

function renderSourceOverture(
  phase: ShellState["overturePhase"],
  sourceSwfActive: boolean,
  projectorLive: boolean,
): string {
  const inert = projectorLive ? liveProjectorInertTarget : "";
  if (phase === "alice-preview") {
    return `
      <div
        class="scene-body source-alice-preview-scene"
        data-source-projector="analysis/setup/app/Nutcracker2.exe embedded FWS at byte 864256"
        data-source-frame="root frames 1535 label aliceIntro through 2141; frame 2142 aliceJump returns to choose"
        data-source-runtime="projector-alice-preview.swf (root frame-1 GotoFrame retargeted from choose to aliceIntro) through bundled Ruffle v0.5.0"
        data-source-control="aliceSkip button 0307 full-stage hit area to aliceJump; skipBTN button 0308 EXIT text to choose"
      >
        <h1 class="sr-only">Alice's Adventures in Musicland preview</h1>
      </div>
    `;
  }

  if (phase === "launcher") {
    return `
      <div
        class="scene-body source-projector-launcher"
        tabindex="-1"
        data-source-projector="analysis/setup/app/Nutcracker2.exe embedded FWS at byte 864256"
        data-source-frame="root frame 1268 label choose"
        data-source-capture="official Ruffle v0.5.0 lossless 1280 x 960 DPR-2 source-runtime capture downsampled to the native 640 x 480 stage"
        data-source-fallback="static source capture preserves the normal launcher frame; isolated button ids 0028, 0038, 0043, 0047, and 0051 extract but swfrender reports the button ids unknown, so exact rollover/down timeline playback remains pending"
        data-source-action-map="nut to nutIni; MFBtn to MFintro; aliceBTN to aliceIntro; webBTN to warningMSG_mc show; button 0038 to root frame 2388"
        data-source-runtime="${projectorLive ? "live projector-nutcracker2.swf through bundled Ruffle v0.5.0; the projector's own buttons, warningMSG_mc prompt, Alice trailer, and exit outro run unchanged" : "static fallback"}"
      >
        <img class="source-projector-choose" src="${projectorChooseSourceUrl}" alt="" aria-hidden="true" />
        <h1 class="sr-only">Choose a Kids Music Stage game</h1>
        <button
          class="source-projector-launcher-button source-projector-play"
          type="button"
          data-action="play-featured-game"
          ${inert}
          aria-label="Play Featured Game"
          data-source-placement="button id 0028 instance nut at depth 0002 x 364.15 y 90.95 ratio 1267"
          data-source-hit-rect="x 216-424 y 44-246"
          data-source-action="root gotoAndPlay nutIni"
        ><span class="sr-only">Play Featured Game</span></button>
        <button
          class="source-projector-launcher-button source-projector-preview-mf"
          type="button"
          data-action="preview-musical-friends"
          ${inert}
          aria-label="Preview Musical Friends"
          data-source-placement="button id 0043 instance MFBtn at depth 0012 x 146.25 y 355.55 ratio 1267"
          data-source-hit-rect="x 54-188 y 326-460"
          data-source-action="root gotoAndPlay MFintro"
        ><span class="sr-only">Preview Musical Friends</span></button>
        <button
          class="source-projector-launcher-button source-projector-preview-alice"
          type="button"
          data-action="preview-alice"
          ${inert}
          aria-label="Preview Alice's Adventures in Musicland"
          data-source-placement="button id 0047 instance aliceBTN at depth 0020 x 291.80 y 355.55 ratio 1267"
          data-source-hit-rect="x 196-332 y 326-460"
          data-source-action="root gotoAndPlay aliceIntro"
        ><span class="sr-only">Preview Alice's Adventures in Musicland</span></button>
        <button
          class="source-projector-launcher-button source-projector-web"
          type="button"
          data-action="open-kids-music-stage"
          ${inert}
          aria-label="Go to KidsMusicStage.com"
          data-source-placement="button id 0051 instance webBTN at depth 0029 x 527.70 y 355.65 ratio 1267"
          data-source-hit-rect="x 432-576 y 320-464"
          data-source-action="warningMSG_mc gotoAndStop show; YES opens http://www.kidsmusicstage.com"
        ><span class="sr-only">Go to KidsMusicStage.com</span></button>
        <button
          class="source-projector-launcher-button source-projector-exit"
          type="button"
          data-action="exit-projector"
          ${inert}
          aria-label="Exit"
          data-source-placement="button id 0038 at depth 0009 x 563.50 y 25.45 ratio 1267"
          data-source-hit-rect="x 572-640 y 8-58"
          data-source-action="GotoFrame 2388 then FSCommand quit"
        ><span class="sr-only">Exit</span></button>
      </div>
    `;
  }

  return `
    <div
      class="scene-body source-intro-scene"
      data-source-swf="analysis/setup/app/flute_intro.swf"
      data-source-frame="root frame 1 through 1277 at 15 fps"
      data-source-image="DEFINEBITSJPEG id 0371 promoted as the recovered garden layer"
      data-source-control="source text skip at the lower-right edge; root gotoAndStop choose"
      data-source-runtime="${sourceSwfActive ? "flute_intro.swf plays through bundled Ruffle v0.5.0 in the source-swf layer; full 800 x 600 movie fitted to the 640 x 480 stage" : "static fallback"}"
      data-source-fallback="if Ruffle cannot start, the runtime holds the promoted DEFINEBITSJPEG id 0371 garden layer; SWFTools renders every root frame blank or crashes"
    >
      <img class="source-intro-garden" src="${fluteIntroGardenUrl}" alt="" aria-hidden="true" />
      <h1 class="sr-only">Recovered projector introduction</h1>
      <button
        class="source-intro-skip"
        type="button"
        data-action="start"
        ${sourceSwfActive ? 'tabindex="-1" aria-hidden="true"' : ""}
      >skip</button>
    </div>
  `;
}

function renderMainPlayRoom(progress: ReturnType<ProgressStoreController["getSnapshot"]>, projectorLive: boolean): string {
  const nutcrackerUnlocked = progress.completedGameCount === 9;
  const inert = projectorLive ? liveProjectorInertTarget : "";
  return `
    <div
      class="scene-body source-playroom-scene"
      data-source-projector="analysis/setup/app/Nutcracker2.exe embedded FWS at byte 864256"
      data-source-frame="root frame 2378 label playRoom"
      data-source-background="DEFINEBITSJPEG id 0518; shape id 0519 at depth 0003 centered x 320 y 240"
      data-source-capture="official Ruffle v0.5.0 render of extracted root frame 2378 source layers"
      data-source-fallback="swfextract -f 2378 omits JPEG id 0518 with the installed SWFTools build; the deterministic asset gate chroma-keys the source-runtime foreground capture over the exact promoted source JPEG and retains source-coordinate hotspots"
      data-source-runtime="${projectorLive ? "live projector-nutcracker2.swf through bundled Ruffle v0.5.0; loadGame movies open the matching routes at the shell boundary" : "static fallback"}"
    >
      <img class="source-playroom-background" src="${mainPlayRoomCompositeUrl}" alt="" aria-hidden="true" />
      <div class="source-playroom-hotspots" role="group" aria-label="Music room activities">
        ${mainRoomHotspots.map((hotspot) => renderMainRoomHotspot(hotspot, inert)).join("")}
        ${
          nutcrackerUnlocked
            ? `<button
                class="source-playroom-hotspot source-playroom-nutcracker"
                type="button"
                data-scene-route="nutcracker-chooser"
                ${inert}
                style="left: 300.95px; top: 192.4px"
                title="The Nutcracker Game"
                aria-label="The Nutcracker Game"
                data-source-placement="button sprite id 0671 nutButton at depth 0187 x 300.95 y 192.40 ratio 2377"
                data-source-action="button id 0670 loads games/nutcrackergame/nutchooser.swf; on-load gate shows nutButton only when collectedKeys equals 9"
              ><span class="sr-only">The Nutcracker Game</span></button>`
            : ""
        }
      </div>
    </div>
  `;
}

function renderMainRoomHotspot(hotspot: MainRoomHotspot, inert: string): string {
  const routeAttribute = hotspot.routeId ? `data-scene-route="${hotspot.routeId}"` : "disabled";
  const gapDescription = hotspot.routeId ? "" : " (plays in the live projector only)";
  return `
    <button
      class="source-playroom-hotspot"
      type="button"
      ${routeAttribute}
      ${inert}
      style="left: ${hotspot.x}px; top: ${hotspot.y}px"
      title="${escapeHtml(hotspot.label)}${gapDescription}"
      aria-label="${escapeHtml(hotspot.label)}${gapDescription}"
      data-source-placement="button id ${String(hotspot.sourceButtonId).padStart(4, "0")} at depth ${String(hotspot.depth).padStart(4, "0")} x ${hotspot.x.toFixed(2)} y ${hotspot.y.toFixed(2)} ratio 2377"
      data-source-action="loadGame ${escapeHtml(hotspot.sourcePath)}"
      ${hotspot.routeId ? "" : "data-source-route-gap=true"}
    ><span class="sr-only">${escapeHtml(hotspot.label)}</span></button>
  `;
}

function renderReadingActivity(routeId: ReadingRouteId, pageIndex: number): string {
  const activity = getReadingActivity(routeId);
  const safePageIndex = Math.min(Math.max(pageIndex, 0), activity.pages.length - 1);
  const page = activity.pages[safePageIndex];
  const previousPage = safePageIndex - 1;
  const nextPage = safePageIndex + 1;
  const sourceTextIds = page.columns.flatMap((column) => column.sourceTextIds);
  const sourceImageIds = [activity.sourceBookImageId, ...page.columns.flatMap((column) => column.sourceImageIds)];
  const previousButtonId = sourceReaderPreviousButtonIds[routeId][safePageIndex];
  const nextButtonId = sourceReaderNextButtonIds[routeId][safePageIndex];
  const exitHoverPath = routeId === "ballet-history" ? readerControlExitHoverBalletUrl : readerControlExitHoverUrl;
  return `
    <div
      class="scene-body source-reader-scene"
      data-source-swf="analysis/setup/app/${escapeHtml(activity.sourceSwfPath)}"
      data-source-frame-label="${page.sourceFrameLabel}"
      data-source-text-ids="${sourceTextIds.join(",") || "none"}"
      data-source-image-ids="${sourceImageIds.join(",")}"
      data-source-controls="NEXT >, < PREV, EXIT"
      data-source-classification="original asset"
      data-source-capture="official Ruffle v0.5.0 neutral source-runtime capture"
      data-source-fallback="static source-runtime frame captures preserve the complete display; live narration, page navigation, source hit regions, hover art, and exit fade are reconstructed while the pre-page book fade and transient loading sprite remain a documented timeline gap"
    >
      <article class="source-reader-book" aria-label="${escapeHtml(activity.title)}">
        <img
          class="source-reader-scene-frame"
          src="${page.sceneImagePath}"
          alt=""
          aria-hidden="true"
          data-source-image="official Ruffle v0.5.0 root frame label ${page.sourceFrameLabel} capture"
        />
        <img
          class="source-reader-exit-book-frame"
          src="${activity.bookImagePath}"
          alt=""
          aria-hidden="true"
          data-source-image="DEFINEBITSJPEG3 id ${String(activity.sourceBookImageId).padStart(4, "0")} exit fade layer"
        />
        <h1 class="sr-only" tabindex="-1" data-source-reader-heading>${escapeHtml(activity.title)} · ${escapeHtml(page.title)}</h1>
        <p class="sr-only" role="status" aria-live="polite">${escapeHtml(page.title)} of ${escapeHtml(activity.pageCountLabel)}</p>
        <div class="sr-only" data-source-reader-accessible-copy>
          ${page.columns
            .map(
              (column, index) => `<section data-source-side="${index === 0 ? "left" : "right"}" data-source-text-ids="${column.sourceTextIds.join(",") || "none"}" data-source-image-ids="${column.sourceImageIds.join(",") || "none"}">
                ${column.heading ? `<h2>${escapeHtml(column.heading)}</h2>` : ""}
                ${column.subheading ? `<p>${escapeHtml(column.subheading)}</p>` : ""}
                ${column.body ? `<p>${formatMultilineText(column.body)}</p>` : ""}
              </section>`,
            )
            .join("")}
        </div>
        <nav class="source-reader-controls" aria-label="Source reader controls">
          <button
            class="source-reader-control source-reader-control-exit"
            type="button"
            data-action="exit"
            data-source-button-id="${sourceReaderExitButtonIds[routeId]}"
            data-source-action="goto bye timeline, play, then unloadMovie"
            aria-label="Exit reader"
          ><img src="${exitHoverPath}" alt="" aria-hidden="true" /><span class="sr-only">EXIT</span></button>
          ${
            previousButtonId === null
              ? ""
              : `<button
                  class="source-reader-control source-reader-control-prev"
                  type="button"
                  data-reading-route="${routeId}"
                  data-reading-page="${previousPage}"
                  data-reading-direction="previous"
                  data-source-button-id="${previousButtonId}"
                  data-source-hit-bounds="x 20.00-309.00 y 35.00-434.95"
                  aria-label="Previous spread"
                ><img src="${readerControlPrevHoverUrl}" alt="" aria-hidden="true" /><span class="sr-only">&lt; PREV</span></button>`
          }
          ${
            nextButtonId === null
              ? ""
              : `<button
                  class="source-reader-control source-reader-control-next"
                  type="button"
                  data-reading-route="${routeId}"
                  data-reading-page="${nextPage}"
                  data-reading-direction="next"
                  data-source-button-id="${nextButtonId}"
                  data-source-hit-bounds="x 327.00-624.95 y 35.00-436.95"
                  aria-label="Next spread"
                ><img src="${readerControlNextHoverUrl}" alt="" aria-hidden="true" /><span class="sr-only">NEXT &gt;</span></button>`
          }
        </nav>
      </article>
    </div>
  `;
}

function renderMusicDictionary(
  activeInstrument: DictionaryInstrument,
  helpOpen: boolean,
  helpFishVisible: boolean,
): string {
  if (helpOpen) {
    return `
      <div
        class="scene-body source-musictionary-scene source-musictionary-help-scene"
        data-source-swf="analysis/setup/app/activities/musictionary/musictionary.swf"
        data-source-state="shared help hallway${helpFishVisible ? "; question mascot visible" : ""}"
        data-source-capture="official Ruffle v0.5.0 source-runtime capture through the recovered Nutcracker2 projector"
      >
        <img class="source-musictionary-frame" src="${helpFishVisible ? musictionaryHelpFishUrl : musictionaryHelpUrl}" alt="" aria-hidden="true" />
        <h1 class="sr-only" tabindex="-1" data-source-musictionary-heading>Musictionary help</h1>
        <button
          class="source-musictionary-hit source-musictionary-help-question"
          type="button"
          data-dictionary-help-fish
          aria-label="${helpFishVisible ? "Hide" : "Show"} the Musictionary help character"
          data-source-hit-bounds="x 537-583 y 140-184"
        ></button>
        <button
          class="source-musictionary-hit source-musictionary-help-exit"
          type="button"
          data-dictionary-help-close
          aria-label="Exit Musictionary help"
          data-source-hit-bounds="x 566-640 y 450-480"
        ></button>
      </div>
    `;
  }

  return `
    <div
      class="scene-body source-musictionary-scene"
      data-source-swf="analysis/setup/app/activities/musictionary/musictionary.swf"
      data-source-player="instPlayer sprite id ${activeInstrument.sourceAssetId}"
      data-source-text-id="${activeInstrument.sourceTextId}"
      data-source-controls="EXIT text ids 0073-0075; NEXT text id 0086"
      data-source-capture="official Ruffle v0.5.0 stable fact-state source-runtime capture through the recovered Nutcracker2 projector"
      data-source-retained-gap="the source entry-preview, rhyme reveal, and character/instrument timeline motion are not reconstructed; the complete stable fact state and embedded narration are preserved"
    >
      <img class="source-musictionary-frame" src="${activeInstrument.sceneImagePath}" alt="" aria-hidden="true" />
      <h1 class="sr-only" tabindex="-1" data-source-musictionary-heading>${escapeHtml(activeInstrument.name)}</h1>
      <p class="sr-only">${escapeHtml(activeInstrument.family)}. ${escapeHtml(activeInstrument.summary)}</p>
      <button
        class="source-musictionary-hit source-musictionary-help"
        type="button"
        data-dictionary-help
        aria-label="Open Musictionary help"
        data-source-hit-bounds="x 0-72 y 0-73"
      ></button>
      <button
        class="source-musictionary-hit source-musictionary-exit"
        type="button"
        data-action="exit"
        aria-label="Exit Musictionary"
        data-source-hit-bounds="x 568-640 y 0-75"
      ></button>
      <button
        class="source-musictionary-hit source-musictionary-next"
        type="button"
        data-dictionary-next
        aria-label="Next instrument after ${escapeHtml(activeInstrument.name)}"
        data-source-hit-bounds="x 267-375 y 315-390"
      ></button>
    </div>
  `;
}

function renderSuitePlayer(activeTrackId: string | null, isPlaying: boolean): string {
  const activeTrack = activeTrackId ? getSuiteTrack(activeTrackId) : null;
  const playbackLabel = activeTrack
    ? activeTrack.audioPath
      ? `${activeTrack.collectionTitle}: ${activeTrack.title}. ${isPlaying ? "Playing" : "Paused"}.`
      : `${activeTrack.collectionTitle}: ${activeTrack.title}. Recovered source audio theme${activeTrack.number}.mp3 is missing.`
    : "Choose one of the sixteen source records.";
  const platterAction = activeTrack?.audioPath ? (isPlaying ? "suite-stop" : "suite-play") : "";
  const platterLabel = activeTrack?.audioPath
    ? isPlaying
      ? `Pause ${activeTrack.title}`
      : `Play ${activeTrack.title}`
    : "Drop a record on the gramophone";

  return `
    <div
      class="scene-body source-listening-room"
      data-source-swf="analysis/setup/app/activities/originals/gramophone.swf"
      data-source-frame="official Ruffle v0.5.0 neutral root-state source-runtime capture"
      data-source-action="16 draggable lp instances load activities/originals/theme{iam}.mp3; player states are pauseLP and playLP; dynamic labels are discTitle and discName"
      data-source-missing-audio="the recovered source tree contains theme1.mp3 through theme8.mp3 only; theme9.mp3 through theme16.mp3 remain selectable but cannot play"
      data-source-retained-gap="record movement and tonearm animation are not reconstructed over the exact neutral source capture"
    >
      <img class="source-listening-frame" src="${listeningRoomSourceUrl}" alt="" aria-hidden="true" />
      <h1 class="sr-only">The Listening Room</h1>
      <p class="sr-only" aria-live="polite" data-suite-status>${escapeHtml(playbackLabel)}</p>
      <section class="source-record-shelf" aria-label="Sixteen source records">
        ${suiteTracks.map((track) => renderSuiteTrackButton(track, activeTrack?.id ?? null)).join("")}
      </section>
      <button
        class="source-listening-platter ${isPlaying ? "suite-stop-button" : "suite-play-button"}"
        type="button"
        data-suite-drop
        ${platterAction ? `data-action="${platterAction}"` : ""}
        aria-label="${escapeHtml(platterLabel)}"
        data-source-instance="hole sprite id 0050 at x 151.20 y 334.30 scale 1.525"
      ></button>
      <button class="source-listening-exit" type="button" data-action="exit" aria-label="Exit the Listening Room"><span class="sr-only">EXIT</span></button>
    </div>
  `;
}

function renderSuiteTrackButton(track: SuiteTrack, activeTrackId: string | null): string {
  const placement = suiteRecordPlacements.find((candidate) => candidate.trackNumber === track.number);
  if (!placement) {
    throw new Error(`Missing source placement for suite track ${track.number}`);
  }
  const [scaleX, skewY, skewX, scaleY] = placement.matrix;
  const hitX = placement.hitX ?? placement.x;
  const hitY = placement.hitY ?? placement.y;
  const hitWidth = placement.hitWidth ?? 86;
  return `
    <button
      class="source-record"
      type="button"
      draggable="true"
      data-suite-track="${track.id}"
      aria-pressed="${track.id === activeTrackId}"
      aria-label="${track.number}. ${escapeHtml(track.collectionTitle)}, ${escapeHtml(track.title)}${track.audioPath ? "" : "; recovered source audio is missing"}"
      style="left: ${hitX}px; top: ${hitY}px; --source-hit-width: ${hitWidth}px"
      data-source-placement="${placement.sourceInstance} sprite id ${String(placement.sourceSpriteId).padStart(4, "0")} at depth ${String(placement.depth).padStart(4, "0")} matrix ${scaleX} ${skewX} ${skewY} ${scaleY} x ${placement.x.toFixed(2)} y ${placement.y.toFixed(2)}"
      data-source-action="loads activities/originals/theme${track.number}.mp3 and updates discTitle/discName"
      data-source-audio="${track.audioPath ? "recovered" : "missing"}"
    >
      <span class="sr-only">${track.number}. ${escapeHtml(track.collectionTitle)}, ${escapeHtml(track.title)}${track.audioPath ? `, ${formatDuration(track.durationSeconds)}` : ", source audio missing"}</span>
    </button>
  `;
}

function renderNutcrackerChooser(progress: ReturnType<ProgressStoreController["getSnapshot"]>): string {
  return `
    <div class="scene-body chooser-scene nutcracker-chooser source-flash-scene">
      <img
        class="nutcracker-chooser-source-frame"
        src="${nutChooserSourceNormalUrl}"
        alt=""
        aria-hidden="true"
        data-source-classification="SWF-derived recreation"
        data-source-method="source-runtime capture"
        data-source-swf="analysis/setup/app/games/nutcrackergame/nutchooser.swf"
        data-source-frame="normal chooser state after the source intro mascot clears; dynamic opened-door and magic-key layers excluded"
        data-source-capture="official Ruffle v0.5.0 lossless 1280 x 960 DPR-2 source-runtime capture downsampled to the native 640 x 480 stage and stripped of PNG metadata"
        data-source-image="complete source frame preserves the hallway, source color transforms, ornamental frame, instrument bed, Help control, and EXIT control that the earlier child-layer composition did not flatten exactly"
      />
      <p class="sr-only">Nutcracker song doors</p>
      <div class="nutcracker-door-grid" aria-label="Nutcracker song doors">
        ${nutcrackerSongGames
          .map((song) => {
            const door = song.id as DoorKey;
            const completed = progress.nutDoors[door];
            const unlocked = isNutcrackerDoorUnlocked(progress, song.id);
            const status = completed ? "Cleared" : unlocked ? "Ready" : "Locked";
            const state = completed ? "cleared" : unlocked ? "ready" : "locked";
            return `
              <article
                class="nutcracker-door-card"
                style="${getNutcrackerDoorStyle(song.id)}"
                aria-label="Door ${door} ${escapeHtml(song.title)}"
                data-source-placement="${escapeHtml(getNutcrackerDoorSourcePlacement(song.id))}"
                data-source-action="on load derives iam from instance name m# and sets this._visible from _root.door# loaded from games/data/nutdoors.txt"
              >
                <button
                  class="door-button nutcracker-door-button"
                  type="button"
                  data-nutcracker-door="${song.id}"
                  data-door-state="${state}"
                  aria-label="Door ${door}: ${escapeHtml(song.title)}. ${status}."
                  ${unlocked ? "" : "disabled"}
                >
                  <img
                    class="chooser-door-art"
                    src="${chooserOpenDoorUrl}"
                    style="${getNutcrackerDoorArtStyle(song.id)}"
                    alt=""
                    aria-hidden="true"
                    data-source-classification="swf-derived recreation"
                    data-source-crop="100 x 190 source-local crop at x 130 y 105 from the 512 x 512 sprite id 0080 render"
                    data-source-image="source-local crop of nutchooser.swf movie clip id 0080 transformed by the recovered m# root matrix; visible only when the recovered door# completion flag equals 1; no modern hover glow, drop shadow, status label, disabled opacity, or disabled background"
                    ${completed ? "" : "hidden"}
                  />
                </button>
                <button
                  class="media-button door-preview-button sr-only"
                  type="button"
                  data-nutcracker-preview="${song.id}"
                  ${unlocked ? "" : "disabled"}
                >
                  Preview
                </button>
              </article>
            `;
          })
          .join("")}
      </div>
      ${renderChooserSourceControls()}
      ${renderChooserMagicKey(progress)}
      ${renderNutcrackerFlyingHelp("chooser")}
    </div>
  `;
}

function renderChooserMagicKey(progress: ReturnType<ProgressStoreController["getSnapshot"]>): string {
  const visible = progress.openedNutDoorCount === nutcrackerSongGames.length;
  return `
    <img
      class="nutcracker-chooser-magic-key"
      src="${chooserMagicKeyUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-instance="magicKey"
      data-source-visible="${visible ? "true" : "false"}"
      data-source-placement="nutchooser.swf places magicKey sprite id 0213 at depth 0175 matrix scale 0.642 x 316.05 y 175.80 ratio 5"
      data-source-action="on load reads _level0.nutDoorsVisited; sets this._visible to 1 only when nutDoorsVisited equals 8, otherwise 0"
      data-source-image="sprite id 0213 rendered in swfcombine wrapper -X 180 -Y 180 -x 80 -y 90 to avoid negative-coordinate clipping; trimmed output promoted by npm run assets:nutcracker-ui"
      ${visible ? "" : "hidden"}
    />
  `;
}

function renderNutcrackerSongGame(
  song: NutcrackerSongGame,
  completed: boolean,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
  allNutcrackerDoorsComplete: boolean,
  isPlaying: boolean,
  changePromptOpen: boolean,
  exitWarningOpen: boolean,
  helpOpen: boolean,
): string {
  const selectedTrackCount = selectedTrackNumbers.length;
  const correctRequiredCount = getCorrectNutcrackerTrackNumbers(song).length;
  const correctSelectionCount = feedback ? countCorrectSelections(song, selectedTrackNumbers) : 0;
  const incorrectSelectionCount = feedback ? Math.max(0, selectedTrackCount - correctSelectionCount) : 0;
  const hintOnly = feedback === "hint";
  const selectionCorrect = isCorrectNutcrackerSelection(song, selectedTrackNumbers);
  const showFinalKeyFrame = feedback === "ok" && allNutcrackerDoorsComplete;
  const sourceControlsBlocked = helpOpen || hintOnly || changePromptOpen || exitWarningOpen;
  const disabledSourceControl = sourceControlsBlocked ? " disabled" : "";
  const sourceMessage = feedback && !hintOnly
    ? selectionCorrect
      ? null
      : `you have ${correctSelectionCount} correct instruments and ${incorrectSelectionCount} incorrect instruments`
    : hintOnly || (selectedTrackCount > 0 && selectedTrackCount < correctRequiredCount)
      ? "All songs are played by 4 instruments!"
    : "Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.";

  return `
    <div class="scene-body nutcracker-song-scene source-flash-scene">
      <img
        class="song-source-frame"
        src="${nutcrackerSongSourceFrameUrls[song.id]}"
        alt=""
        aria-hidden="true"
        data-source-classification="original source-runtime capture"
        data-source-image="song${song.id}/song.swf normal interactive state captured through official Ruffle v0.5.0 at DPR 2 with external character animation SWFs withheld, downsampled to 640 x 480, and metadata-stripped"
      />
      <section class="song-stage-overlay" aria-label="${escapeHtml(song.title)} track choices">
        <h1 class="sr-only">${escapeHtml(song.title)}</h1>
        <p class="song-source-message sr-only" aria-live="polite">${escapeHtml(sourceMessage ?? "")}</p>
        <div class="song-interaction-surface${sourceControlsBlocked ? " song-interaction-surface-blocked" : ""}" data-song-drop-stage="${song.id}"${sourceControlsBlocked ? ' inert aria-hidden="true"' : ""}>
        ${renderSelectedNutcrackerActors(song, selectedTrackNumbers, feedback)}
        ${song.tracks.map((track) => renderNutcrackerTrackButton(song.id, track, selectedTrackNumbers, feedback, sourceControlsBlocked)).join("")}
        ${renderNutcrackerFlyingHelp()}
        ${showFinalKeyFrame ? renderNutcrackerSongKeyFrame() : ""}
        <div class="song-actions source-song-actions${sourceControlsBlocked ? " source-song-actions-blocked" : ""}" aria-label="Source song controls">
          <button class="scene-button source-label-button source-song-help-button" type="button"${disabledSourceControl} data-action="help" data-source-control="helpButton" data-source-placement="song1/song.swf helpButton sprite id 0120 at root depth 0122 matrix scale 1.350 x 556.50 y 165.30" data-source-state="buttonON places button id 0118 depth 0001 and shape id 0119 depth 0004; normal art is baked into the complete source-runtime capture" data-source-hit-rect="532.13,141.95,51.98,38.48" data-source-help="Help" data-source-help-frame="4" data-source-help-bounds="button id 0118 pushes Help and calls _root.helpme; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="sets _root.theNextFrame to helpFrame and drives _root.usmus to helpFrame/showUp">
            <span class="sr-only">HELP</span>
          </button>
          <button class="scene-button source-label-button source-song-hint-button" type="button"${disabledSourceControl} data-source-control="hintButton" data-source-placement="song1/song.swf hintButton sprite id 0127 at root depth 0127 matrix scale 1.350 x 556.35 y 267.95" data-source-state="buttonON places button id 0125 depth 0001 and shape id 0126 depth 0005; normal art is baked into the complete source-runtime capture" data-source-hit-rect="532.76,240.75,51.96,38.21" data-source-help="Hint" data-source-help-frame="4" data-source-help-bounds="button id 0125 pushes Hint and calls _root.helpme; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="calls showHint and drives _root.courtain to giveHint" data-song-action="hint-song" data-song-id="${song.id}">
            <span class="sr-only">HINT</span>
          </button>
          <button class="scene-button source-label-button source-song-change-button" type="button"${disabledSourceControl} data-source-control="songChooser" data-source-placement="song1/song.swf songChooser sprite id 0133 at root depth 0133 matrix scale 1.598 x 84.10 y 163.70" data-source-state="buttonON places button id 0132 depth 0001 and shape id 0126 depth 0004; normal art is baked into the complete source-runtime capture" data-source-hit-rect="57.82,136.05,56.73,43.23" data-source-help="Select a&#10;different&#10;song" data-source-help-frame="4" data-source-help-bounds="button id 0132 pushes Select a different song and calls _root.helpme; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="sets the recovered change-song message and drives _root.courtain to alert" data-song-action="confirm-change-song" data-song-id="${song.id}">
            <span class="sr-only">CHANGE SONG</span>
          </button>
          <button class="media-button source-label-button source-song-listen-button" type="button"${disabledSourceControl} data-source-control="listenSong" data-source-placement="song1/song.swf listenSong sprite id 0144 at root depth 0138 matrix scale 1.524 x 81.75 y 266.30" data-source-state="buttonON places button id 0137 depth 0001 and shape id 0126 depth 0006; songStop places button id 0143 depth 0003" data-source-hit-rect="52.18,235.59,64.39,43.13" data-source-help="${isPlaying ? "Stop the Music" : "Listen to the Original Music"}" data-source-help-frame="4" data-source-help-bounds="button id 0137 pushes Listen to the Original Music; button id 0143 pushes Stop the Music; flyinghelp frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-source-action="calls previewSong; the songStop state calls stopPreview/resumeInst/instFrameShow" data-song-action="play-theme" data-song-id="${song.id}">
            ${
              isPlaying
                ? `<img class="source-button-body" src="${songControlButtonBodyUrl}" alt="" aria-hidden="true" /><img class="source-button-label" src="${songStopLabelUrl}" alt="" aria-hidden="true" />`
                : ""
            }
            <span class="sr-only">${isPlaying ? "STOP" : "LISTEN"}</span>
          </button>
          <button class="scene-button source-label-button source-song-exit-button" type="button"${disabledSourceControl} data-source-control="quiter" data-source-placement="song1/song.swf quiter sprite id 0150 at root depth 0145 matrix scale 0.900 x 585.90 y 472.45" data-source-state="buttonON places button id 0148 depth 0001; normal EXIT art is baked into the complete source-runtime capture" data-source-hit-rect="549.72,449.05,72.36,46.89" data-source-help="Quit the Game" data-source-help-frame="3" data-source-help-bounds="button id 0148 hover action pushes Quit the Game, frame 3, and calls _root.helpme" data-source-action="sets _root.theNextFrame to warningFrame; drives _root.usmus to warningFrame/showUp" data-song-action="confirm-exit-song" data-song-id="${song.id}">
            <span class="sr-only">EXIT</span>
          </button>
          ${
            feedback && !hintOnly
              ? `<button
                  class="page-button source-label-button source-play-again-button"
                  type="button"
                  data-source-control="gameController"
                  data-source-placement="song1/song.swf gameController id 0115 depth 0116 matrix scale 1.140 x 322.20 y 317.70; buttonAgain frame places id 0114 at x -0.90 y 1.75 ratio 3"
                  data-source-body="song1/song.swf gameController buttonAgain uses button id 0114 with source shape id 0113"
                  data-song-action="reset-song"
                  data-song-id="${song.id}"
                >
                  <img class="source-button-body" src="${songPlayAgainButtonBodyUrl}" alt="" aria-hidden="true" />
                  <img class="source-button-label" src="${songPlayAgainLabelUrl}" alt="" aria-hidden="true" />
                  <span class="sr-only">PLAY AGAIN</span>
                </button>`
              : ""
          }
        </div>
        </div>
        ${sourceMessage && feedback && !sourceControlsBlocked ? renderNutcrackerHintCurtain(sourceMessage) : ""}
        ${sourceMessage && hintOnly && !helpOpen && !changePromptOpen && !exitWarningOpen ? renderNutcrackerHintCurtain(sourceMessage, song.id) : ""}
        ${changePromptOpen ? renderNutcrackerChangeSongPrompt(song.id) : ""}
        ${exitWarningOpen ? renderNutcrackerSongExitWarning(song.id) : ""}
        <p class="sr-only">${completed ? "Door cleared." : "Door ready."} Source: ${escapeHtml(song.sourcePath)}. Track streams extracted from recovered SWFs.</p>
      </section>
    </div>
  `;
}

function renderNutcrackerSongKeyFrame(): string {
  return `
    <aside
      class="source-song-keyframe"
      aria-label="Nutcracker completion key"
      data-source-frame="song1/song.swf keyFrame"
      data-source-placement="keyFrame places sprite id 0355 depth 0001 matrix scale 1.051 x -15.05 y 53.20 ratio 30; noAction id 0356 depth 0003"
      data-source-action="winner timeline calls saveNutDoor; when _level0.nutDoorsVisited equals 7 it calls saveKey1.exe, sets gameKey1, sets _root.theNextFrame to keyFrame, and drives _root.usmus to showUp"
    >
      <img
        src="${songKeyFrameTalkerUrl}"
        alt=""
        aria-hidden="true"
        data-source-image="song1/song.swf keyFrame sprite id 0355 rendered in swfcombine translated wrapper -X 700 -Y 260 -x 260 -y 120; direct render clips negative-coordinate source art"
      />
      <p class="sr-only">Nutcracker song key earned.</p>
    </aside>
  `;
}

function renderNutcrackerHintCurtain(message: string, songId?: NutcrackerSongId): string {
  return `
    <aside
      class="source-alert source-hint-alert"
      aria-label="Song hint"
      ${songId ? 'role="dialog" aria-modal="true"' : 'role="status"'}
      data-source-classification="swf-derived recreation"
      data-source-frame="song1/song.swf courtain giveHint"
      data-source-placement="courtain root id 0063 depth 0082 x 319.85 y 4.90; giveHint places source dismiss button id 0057 depth 0005, _root.message edit id 0058 depth 0007 matrix scale 0.953/0.843 x 132.90 y 96.80 ratio 14, and noAction clip id 0059 depth 0008"
    >
      ${renderNutcrackerCurtainArt()}
      <p>${escapeHtml(message)}</p>
      ${
        songId
          ? `<button
              class="source-hint-dismiss"
              type="button"
              data-song-action="dismiss-hint"
              data-song-id="${songId}"
              data-source-button="song1/song.swf courtain giveHint button id 0057 depth 0005"
              data-source-action="stopPreview; instFrameShow; restore speakers/focus/quiter buttonON; gotoAndPlay courtain bye"
              aria-label="Dismiss hint"
            ></button>`
          : ""
      }
    </aside>
  `;
}

function renderNutcrackerChangeSongPrompt(songId: NutcrackerSongId): string {
  return `
    <aside
      class="source-alert source-change-alert"
      aria-label="Change song confirmation"
      role="dialog"
      aria-modal="true"
      data-source-classification="swf-derived recreation"
      data-source-frame="song1/song.swf courtain alert"
      data-source-placement="courtain root id 0063 depth 0082 x 319.85 y 4.90; _root.message edit id 0054 depth 0012 matrix x 155.90 y 97.10 ratio 4"
    >
      ${renderNutcrackerCurtainArt()}
      <p>press "Yes" to change this song or "No" to cancel</p>
      <button class="source-alert-choice source-alert-yes" type="button" data-song-action="accept-change-song" data-song-id="${songId}">
        <img src="${songYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button class="source-alert-choice source-alert-no" type="button" data-song-action="cancel-change-song" data-song-id="${songId}">
        <img src="${songNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
    </aside>
  `;
}

function renderNutcrackerSongExitWarning(songId: NutcrackerSongId): string {
  return `
    <aside
      class="source-song-warning-modal"
      aria-label="Exit song confirmation"
      role="dialog"
      aria-modal="true"
      data-source-classification="swf-derived recreation"
      data-source-frame="song1/song.swf warningFrame"
      data-source-placement="warningFrame places sprite id 0340 depth 0001 matrix scale 1.051 x -15.45 y 52.40 ratio 29; noAction id 0341 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 29; YES button id 0346 depth 0005 x -66.15 y -43.55; NO button id 0351 depth 0008 x 27.30 y -43.55; close sprite id 0352 depth 0011 x 96.30 y -143.70"
    >
      <img
        class="source-song-warningframe-talker"
        src="${songWarningframeTalkerUrl}"
        alt=""
        aria-hidden="true"
        data-source-image="song1/song.swf warningFrame sprite id 0340 rendered in swfcombine translated wrapper x 140 y 80; direct swfrender clips negative-coordinate source art"
      />
      <button
        class="source-song-warning-choice source-song-warning-yes"
        type="button"
        data-song-action="accept-exit-song"
        data-song-id="${songId}"
        data-source-button="song1/song.swf warningFrame YES button id 0346"
        data-source-body="song1/song.swf warningFrame YES visible body shape id 0344"
        data-source-action="_level0.gotoAndPlay('comeAgain')"
      >
        <img class="source-warning-button-body" src="${songWarningYesBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${songWarningYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button
        class="source-song-warning-choice source-song-warning-no"
        type="button"
        data-song-action="cancel-exit-song"
        data-song-id="${songId}"
        data-source-button="song1/song.swf warningFrame NO button id 0351"
        data-source-body="song1/song.swf warningFrame NO visible body shape id 0349"
        data-source-action="stopPreview; resumeInst; instFrameShow; restore speakers/focus/quiter buttonON"
      >
        <img class="source-warning-button-body" src="${songWarningNoBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${songWarningNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
    </aside>
  `;
}

function renderNutcrackerCurtainArt(): string {
  return `
    <img
      class="source-alert-curtain-layer source-alert-curtain-fill"
      src="${songCurtainFillUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-image="song1/song.swf courtain base sprite id 0042 child shape id 0038 depth 0001"
    />
    <img
      class="source-alert-curtain-layer source-alert-curtain-curve"
      src="${songCurtainCurveCxformUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-image="song1/song.swf courtain base sprite id 0042 child shape id 0040 depth 0002 matrix x 2.80 y -56.45 with CXForm add 0 102 255 0"
    />
    <img
      class="source-alert-curtain-layer source-alert-curtain-stars"
      src="${songCurtainStarsUrl}"
      alt=""
      aria-hidden="true"
      data-source-classification="swf-derived recreation"
      data-source-image="song1/song.swf courtain base sprite id 0042 child shape id 0041 depth 0003"
    />
  `;
}

function renderSelectedNutcrackerActors(
  song: NutcrackerSongGame,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
): string {
  return selectedTrackNumbers
    .map((trackNumber) => song.tracks.find((track) => track.number === trackNumber))
    .filter((track): track is NutcrackerTrack => track !== undefined)
    .map((track) => {
      const correctnessClass = feedback ? (track.valid ? " valid" : " invalid") : "";
      return `
        <img
          class="source-selected-actor source-selected-actor-song-${song.id} source-selected-actor-${track.number}${correctnessClass}"
          data-source-animation="${track.actorSourcePath}"
          data-source-classification="documented fallback"
          data-source-playback="${track.actorPlayback}"
          data-source-fallback="${track.actorFallbackReason}"
          src="${track.imagePath}"
          alt=""
          aria-hidden="true"
        />
      `;
    })
    .join("");
}

function renderNutcrackerTrackButton(
  songId: NutcrackerSongId,
  track: NutcrackerTrack,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
  interactionBlocked: boolean,
): string {
  const selected = selectedTrackNumbers.includes(track.number);
  const feedbackClass = feedback ? (track.valid ? " valid" : selected ? " invalid" : "") : "";
  const hotspot = getTrackHotspotEvidence(track.number);

  return `
    <article
      class="track-card source-track-hotspot source-track-hotspot-${track.number}${selected ? " selected" : ""}${feedbackClass}"
      style="${formatTrackHotspotStyle(hotspot.hitRect)}"
      data-source-help="${escapeHtml(getNutcrackerSourceHelpLabel(songId, track))}"
      data-source-help-frame="${getNutcrackerSourceHelpFrame(songId, track)}"
      data-source-help-bounds="${escapeHtml(getNutcrackerSourceHelpBounds(songId, track))}"
      data-source-placement="${escapeHtml(hotspot.placement)}"
      data-source-vector-bounds="${escapeHtml(hotspot.vectorBounds)}"
      data-source-hit-rect="${escapeHtml(formatSourceRect(hotspot.hitRect))}"
    >
      <button
        class="track-select-button"
        type="button"
        ${interactionBlocked ? "disabled" : ""}
        data-song-id="${songId}"
        data-song-track="${track.number}"
        draggable="true"
        aria-pressed="${selected}"
        aria-label="Track ${track.number}: ${escapeHtml(track.instrument)}. Click to preview; double click or drag onto the stage to select. ${formatTrackStart(track)}."
      >
        <span class="sr-only">Track ${track.number}</span>
        <strong class="sr-only">${escapeHtml(track.instrument)}</strong>
        <small class="sr-only">${formatTrackStart(track)}${track.character ? ` / ${escapeHtml(track.character)}` : ""}</small>
      </button>
    </article>
  `;
}

function renderNutcrackerFlyingHelp(source: "song" | "chooser" = "song"): string {
  const sourcePlacement = source === "song"
    ? "song1/song.swf flyinghelp id 0257 depth 0306 initial matrix x 1143.85 y 195.55; helpme(a,b) sets _root.helpmessage, gotoAndStop(a), startDrag(this), _visible=1; nohelp() clears message, _visible=0, _x=10000"
    : "nutchooser.swf button ids 0200 and 0206 call _root.helpme(frame,label) and _root.nohelp(); current dumps expose the button actions but not an independent chooser flyinghelp placement, so this DOM layer is a documented helpme fallback";
  const sourceLayerModel = source === "song"
    ? "frame 2 places edit ids 0231/0232/0233 at normalized layer offsets from source matrices; frame 3 places edit ids 0234/0235/0236 at normalized offsets from negative source matrices; frame 4 places sprite id 0240, which fades nested sprite id 0239 containing edit ids 0237/0238"
    : "chooser control actions call helpme with frame 4 for Help and frame 3 for Quit the Game; no separate chooser flyinghelp display-list placement is recovered in the current dumps, so the DOM reuses the recovered song flyinghelp frame-layer fallback";
  const sourceBounds = source === "song"
    ? "frame 1 helpoff; frames 2/3 use edit text shadow stacks, frame 4 places sprite id 0240, frames 5-8 use shape ids 0241/0244/0246/0251/0252"
    : "button id 0200 calls helpme(4, Help); button id 0206 calls helpme(3, Quit the Game); rollouts call nohelp";
  return `
    <aside
      class="source-flying-help"
      aria-hidden="true"
      data-source-classification="documented fallback"
      data-source-fallback="dynamic edit text and frame-specific fading cannot be flattened by the local SWF renderer; the DOM recreates recovered edit-text layers and source frame bounds"
      data-source-control="${source === "song" ? "flyinghelp" : "chooser-helpme-fallback"}"
      data-source-placement="${sourcePlacement}"
      data-source-layer-model="${sourceLayerModel}"
      data-source-frame="1"
      data-source-bounds="${sourceBounds}"
    >
      <span class="source-flying-help-frame source-flying-help-frame-2" aria-hidden="true">
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-231"></span>
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-232"></span>
        <span class="source-flying-help-text source-flying-help-text-fill source-flying-help-text-233"></span>
      </span>
      <span class="source-flying-help-frame source-flying-help-frame-3" aria-hidden="true">
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-234"></span>
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-235"></span>
        <span class="source-flying-help-text source-flying-help-text-fill source-flying-help-text-236"></span>
      </span>
      <span class="source-flying-help-frame source-flying-help-frame-4" aria-hidden="true">
        <span class="source-flying-help-text source-flying-help-text-shadow source-flying-help-text-237"></span>
        <span class="source-flying-help-text source-flying-help-text-fill source-flying-help-text-238"></span>
      </span>
    </aside>
  `;
}

function getNutcrackerDoorStyle(songId: NutcrackerSongId): string {
  const positions: Record<NutcrackerSongId, { left: number; top: number; width: number; height: number }> = {
    1: { left: 105.02, top: 107.96, width: 77.97, height: 191.10 },
    2: { left: 447.07, top: 102.91, width: 77.97, height: 191.10 },
    3: { left: 187.93, top: 134.17, width: 47.76, height: 131.81 },
    4: { left: 393.59, top: 130.74, width: 53.21, height: 140.31 },
    5: { left: 239.34, top: 145.03, width: 28.84, height: 98.02 },
    6: { left: 361.66, top: 152.45, width: 33.93, height: 89.63 },
    7: { left: 270.60, top: 157.47, width: 20.55, height: 75.64 },
    8: { left: 341.66, top: 150.00, width: 17.03, height: 81.02 },
  };
  const position = positions[songId];
  return `left:${position.left.toFixed(2)}px;top:${position.top.toFixed(2)}px;width:${position.width.toFixed(2)}px;height:${position.height.toFixed(2)}px`;
}

function getNutcrackerDoorArtStyle(songId: NutcrackerSongId): string {
  const positions: Record<NutcrackerSongId, { left: number; top: number; width: number; height: number; mirrored: boolean }> = {
    1: { left: 14.74, top: -0.42, width: 107.70, height: 204.63, mirrored: false },
    2: { left: -36.13, top: 3.78, width: 107.70, height: 204.63, mirrored: true },
    3: { left: 3.89, top: 7.55, width: 67.40, height: 128.06, mirrored: false },
    4: { left: -15.53, top: 10.88, width: 67.30, height: 127.87, mirrored: true },
    5: { left: 2.37, top: 14.90, width: 43.70, height: 83.03, mirrored: false },
    6: { left: -15.39, top: 6.28, width: 43.60, height: 82.84, mirrored: true },
    7: { left: 5.04, top: 8.90, width: 29.30, height: 55.67, mirrored: false },
    8: { left: -11.15, top: 17.46, width: 29.30, height: 55.67, mirrored: true },
  };
  const position = positions[songId];
  return `left:${position.left.toFixed(2)}px;top:${position.top.toFixed(2)}px;width:${position.width.toFixed(2)}px;height:${position.height.toFixed(2)}px;transform:${position.mirrored ? "scaleX(-1)" : "none"}`;
}

function getNutcrackerDoorSourcePlacement(songId: NutcrackerSongId): string {
  const placements: Record<NutcrackerSongId, string> = {
    1: 'nutchooser.swf m1 id 0080 depth 0015 matrix scale 1.077 x -20.25 y -5.55 ratio 5',
    2: 'nutchooser.swf m2 id 0080 depth 0033 matrix scale -1.077 x 658.65 y -6.40 ratio 5',
    3: 'nutchooser.swf m3 id 0080 depth 0018 matrix scale 0.674 x 104.20 y 70.95 ratio 5',
    4: 'nutchooser.swf m4 id 0080 depth 0021 matrix scale -0.673 x 532.85 y 70.95 ratio 5',
    5: 'nutchooser.swf m5 id 0080 depth 0024 matrix scale 0.437 x 184.90 y 114.05 ratio 5',
    6: 'nutchooser.swf m6 id 0080 depth 0027 matrix scale -0.436 x 446.55 y 112.95 ratio 5',
    7: 'nutchooser.swf m7 id 0080 depth 0030 matrix scale 0.293 x 237.55 y 135.60 ratio 5',
    8: 'nutchooser.swf m8 id 0080 depth 0036 matrix scale -0.293 x 397.90 y 136.70 ratio 5',
  };
  return placements[songId];
}

type SourceRect = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};

type TrackHotspotEvidence = {
  readonly placement: string;
  readonly vectorBounds: string;
  readonly hitRect: SourceRect;
};

const nutcrackerTrackHotspotEvidence: Record<NutcrackerTrackNumber, TrackHotspotEvidence> = {
  1: {
    placement: 'song1/song.swf instIMG1 id 0171 depth 0153 matrix scale 1.055 x 153.20 y 405.50',
    vectorBounds: 'shape id 0172 bbox [-62.50,-29.15,62.45,29.20] -> approx rect 87.26,374.74,131.82,61.55',
    hitRect: { left: 70, top: 330, width: 178, height: 102 },
  },
  2: {
    placement: 'song1/song.swf instIMG2 id 0213 depth 0253 matrix scale 1.055 x 103.10 y 355.75',
    vectorBounds: 'shape id 0214 bbox [-56.65,-24.15,56.65,24.10] -> approx rect 43.33,330.27,119.53,50.90',
    hitRect: { left: 45, top: 296, width: 160, height: 70 },
  },
  3: {
    placement: 'song1/song.swf instIMG3 id 0221 depth 0282 matrix scale 1.055 x 141.15 y 317.25',
    vectorBounds: 'shape id 0222 bbox [-66.65,-5.15,66.65,5.20] -> approx rect 70.84,311.82,140.63,10.92',
    hitRect: { left: 66, top: 260, width: 182, height: 60 },
  },
  4: {
    placement: 'song1/song.swf instIMG4 id 0229 depth 0294 matrix scale 1.055 x 317.45 y 352.35',
    vectorBounds:
      'sprite id 0229 nests frame-labeled button states; face1 uses shape id 0091 bbox [-66.65,-5.15,66.65,5.20] via id 0092, approx rect 248.14,348.82,140.63,10.92',
    hitRect: { left: 246, top: 334, width: 154, height: 44 },
  },
  5: {
    placement: 'song1/song.swf instIMG5 id 0179 depth 0169 matrix scale 1.055 x 307.70 y 402.20',
    vectorBounds: 'shape id 0180 bbox [-45.50,-51.25,45.60,51.30] -> approx rect 259.70,348.13,96.11,108.20',
    hitRect: { left: 242, top: 342, width: 180, height: 86 },
  },
  6: {
    placement: 'song1/song.swf instIMG6 id 0187 depth 0201 matrix scale 1.055 x 444.65 y 366.70',
    vectorBounds: 'shape id 0188 bbox [-24.90,-36.65,24.90,36.65] -> approx rect 418.38,328.04,52.54,77.33',
    hitRect: { left: 386, top: 326, width: 132, height: 78 },
  },
  7: {
    placement: 'song1/song.swf instIMG7 id 0195 depth 0229 matrix scale 1.055 x 522.90 y 408.05',
    vectorBounds: 'shape id 0196 bbox [-34.90,-51.45,34.95,51.45] -> approx rect 486.08,353.76,73.70,108.56',
    hitRect: { left: 525, top: 369, width: 88, height: 72 },
  },
  8: {
    placement: 'song1/song.swf instIMG8 id 0203 depth 0241 matrix scale 1.055 x 556.35 y 339.60',
    vectorBounds: 'shape id 0204 bbox [-54.00,-20.40,53.50,20.35] -> approx rect 499.38,318.08,113.41,42.99',
    hitRect: { left: 520, top: 252, width: 94, height: 82 },
  },
};

function getTrackHotspotEvidence(trackNumber: NutcrackerTrackNumber): TrackHotspotEvidence {
  return nutcrackerTrackHotspotEvidence[trackNumber];
}

function formatTrackHotspotStyle(position: SourceRect): string {
  return `left:${position.left}px;top:${position.top}px;width:${position.width}px;height:${position.height}px`;
}

function formatSourceRect(position: SourceRect): string {
  return `${position.left},${position.top},${position.width},${position.height}`;
}

function getNutcrackerSourceHelpLabel(songId: NutcrackerSongId, track: NutcrackerTrack): string {
  if (songId === 7 && track.number === 2) {
    return "VIOLIN (PIZZICATO)";
  }

  if (track.instrument === "Drums") {
    return "DRUM";
  }

  return track.instrument.toUpperCase();
}

function getNutcrackerSourceHelpFrame(songId: NutcrackerSongId, track: NutcrackerTrack): number {
  const label = getNutcrackerSourceHelpLabel(songId, track);
  return label === "SAXOPHONE" ? 3 : 2;
}

function getNutcrackerSourceHelpBounds(songId: NutcrackerSongId, track: NutcrackerTrack): string {
  const frame = getNutcrackerSourceHelpFrame(songId, track);
  if (frame === 3) {
    return "frame 3 edit ids 0234-0236 bbox approx 276x22 after 1.2 scale";
  }

  return "frame 2 edit ids 0231-0233 bbox approx 276x22 after 1.2 scale";
}

function countCorrectSelections(song: NutcrackerSongGame, selectedTrackNumbers: readonly NutcrackerTrackNumber[]): number {
  return song.tracks.filter((track) => track.valid && selectedTrackNumbers.includes(track.number)).length;
}

function formatDuration(durationSeconds: number | null): string {
  if (!durationSeconds) {
    return "--:--";
  }
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = Math.round(durationSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatTrackStart(track: NutcrackerTrack): string {
  const startSeconds = getNutcrackerTrackStartSeconds(track);
  return startSeconds > 0 ? `Start ${startSeconds.toFixed(1)}s` : "Start 0.0s";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMultilineText(value: string): string {
  return escapeHtml(value).replace(/\n/g, "<br />");
}

function createNutcrackerSelectionState(): Record<NutcrackerSongId, NutcrackerTrackNumber[]> {
  return Object.fromEntries(nutcrackerSongGames.map((song) => [song.id, []])) as unknown as Record<
    NutcrackerSongId,
    NutcrackerTrackNumber[]
  >;
}

function createNutcrackerFeedbackState(): Record<NutcrackerSongId, string | null> {
  return Object.fromEntries(nutcrackerSongGames.map((song) => [song.id, null])) as unknown as Record<NutcrackerSongId, string | null>;
}

function isNutcrackerDoorUnlocked(
  progress: ReturnType<ProgressStoreController["getSnapshot"]>,
  songId: NutcrackerSongId,
): boolean {
  if (songId === 1) {
    return true;
  }

  return progress.nutDoors[(songId - 1) as DoorKey];
}

function isSourceFrameRoute(routeId: RouteId): boolean {
  return (
    routeId === "overture" ||
    routeId === "main-menu" ||
    isReadingRouteId(routeId) ||
    routeId === "music-dictionary" ||
    routeId === "suite" ||
    routeId === "nutcracker-chooser" ||
    getNutcrackerSongGameByRoute(routeId) !== undefined
  );
}

function toggleNutcrackerTrack(
  shellState: ShellState,
  songId: NutcrackerSongId,
  trackNumber: NutcrackerTrackNumber,
): void {
  const song = nutcrackerSongGames.find((item) => item.id === songId);
  const maxSelections = song ? getCorrectNutcrackerTrackNumbers(song).length : 4;
  const selected = new Set(shellState.nutcrackerSelections[songId]);
  if (selected.has(trackNumber)) {
    selected.delete(trackNumber);
  } else {
    if (selected.size >= maxSelections) {
      shellState.nutcrackerFeedback[songId] = "try again";
      return;
    }
    selected.add(trackNumber);
  }

  shellState.nutcrackerSelections[songId] = [...selected].sort((a, b) => a - b);
  shellState.nutcrackerFeedback[songId] = null;
}

function addNutcrackerTrack(
  shellState: ShellState,
  songId: NutcrackerSongId,
  trackNumber: NutcrackerTrackNumber,
): void {
  const song = nutcrackerSongGames.find((item) => item.id === songId);
  const maxSelections = song ? getCorrectNutcrackerTrackNumbers(song).length : 4;
  const selected = new Set(shellState.nutcrackerSelections[songId]);
  if (selected.has(trackNumber)) {
    shellState.nutcrackerFeedback[songId] = null;
    return;
  }
  if (selected.size >= maxSelections) {
    shellState.nutcrackerFeedback[songId] = "try again";
    return;
  }
  selected.add(trackNumber);
  shellState.nutcrackerSelections[songId] = [...selected].sort((a, b) => a - b);
  shellState.nutcrackerFeedback[songId] = null;
}

function checkNutcrackerSelectionIfReady(
  song: NutcrackerSongGame,
  shellState: ShellState,
  progress: ProgressStoreController,
): void {
  if (shellState.nutcrackerSelections[song.id].length === getCorrectNutcrackerTrackNumbers(song).length) {
    submitNutcrackerSong(song, shellState, progress);
  }
}

function submitNutcrackerSong(
  song: NutcrackerSongGame,
  shellState: ShellState,
  progress: ProgressStoreController,
): void {
  if (isCorrectNutcrackerSelection(song, shellState.nutcrackerSelections[song.id])) {
    const snapshot = progress.markNutDoor(song.id);
    if (snapshot.openedNutDoorCount === nutcrackerSongGames.length) {
      progress.markGameKey(1);
    }
    shellState.nutcrackerFeedback[song.id] = "ok";
    return;
  }

  shellState.nutcrackerFeedback[song.id] = "try again";
}

function showNutcrackerHint(
  song: NutcrackerSongGame,
  shellState: ShellState,
  progress: ProgressStoreController,
): void {
  if (shellState.nutcrackerSelections[song.id].length < getCorrectNutcrackerTrackNumbers(song).length) {
    shellState.nutcrackerFeedback[song.id] = "hint";
    return;
  }

  submitNutcrackerSong(song, shellState, progress);
}

function renderNutcrackerCertificatePrintSurface(): string {
  return `
    <section
      class="certificate-print-surface"
      aria-label="Nutcracker Club membership award certificate"
      data-source-projector="analysis/setup/app/fscommand/nc_certificate.exe embedded CWS at byte 860160"
      data-source-sprite="nc_certificate embedded SWF sprite id 0018; 550 by 354 source background; promoted from the intact inner render"
      data-source-action="frame 1 GetUrl print:#bmax targets nc_certificate; frame 5 FSCommand quit"
      data-source-fallback="the webview cannot execute legacy Flash print:#bmax or projector quit; window.print opens the host print dialog, whose Save PDF option replaces the legacy printer-only flow"
    >
      <img src="${nutcrackerClubCertificateUrl}" alt="The Nutcracker Club membership award certificate" />
    </section>
  `;
}

function renderNutcrackerCertificatePrintAction(className: string): string {
  return `
    <button
      class="${className}"
      type="button"
      data-action="print-certificate"
      data-source-reward="gameKey1"
      data-source-action="all eight Nutcracker doors grant gameKey1; legacy nc_certificate.exe prints target nc_certificate with print:#bmax"
    >Print / Save PDF</button>
  `;
}

function renderPrimaryActions(route: RouteDefinition): string {
  if (route.id === "overture") {
    return `
      <button class="scene-button primary" type="button" data-action="start">Start</button>
      <button class="scene-button" type="button" data-action="help">Help</button>
    `;
  }

  return `
    <button class="scene-button" type="button" data-action="back">Back</button>
    <button class="scene-button primary" type="button" data-action="help">Help</button>
    <button class="scene-button" type="button" data-action="exit">Menu</button>
  `;
}

function renderChooserSourceControls(): string {
  return `
    <div class="chooser-source-controls" aria-label="Source chooser controls">
      <button
        class="scene-button source-label-button chooser-source-help-button"
        type="button"
        data-action="help"
        data-source-control="helpButton"
        data-source-placement="nutchooser.swf helpButton root placement sprite id 0202 at depth 0168 matrix scale 1.350 x 556.50 y 165.30 ratio 5"
        data-source-state="sprite id 0202 buttonON places button id 0200 depth 0001 and shape id 0201 depth 0004; buttonOFF places shape id 0198 depth 0002 with alpha mul 0.4"
        data-source-image="normal Help art is preserved in the complete official-Ruffle source-runtime capture; this transparent source-bounded button supplies modern pointer and keyboard input"
        data-source-help="Help"
        data-source-help-frame="4"
        data-source-help-bounds="nutchooser.swf button id 0200 action pushes string Help, frame 4, and calls _root.helpme; rollout calls _root.nohelp"
      >
        <span class="sr-only">Help</span>
      </button>
      <button
        class="scene-button source-label-button chooser-source-exit-button primary"
        type="button"
        data-action="chooser-warning"
        data-source-control="quiter"
        data-source-placement="nutchooser.swf quiter root placement sprite id 0207 at depth 0173 matrix scale 0.900 x 585.90 y 472.45 ratio 5"
        data-source-state="sprite id 0207 buttonON places button id 0206 depth 0001; button id 0206 source art is recovered as shape id 0205 plus source sibling text id 0204 normal peach EXIT label; buttonOFF places blue text id 0203 depth 0001 matrix scale 1.722 x -114.95 y -12.70 with CXForm add 102 102 204 0"
        data-source-image="normal EXIT art is preserved in the complete official-Ruffle source-runtime capture; this transparent source-bounded button supplies modern pointer and keyboard input; text id 0203 is the blue buttonOFF label"
        data-source-action="sets _root.theNextFrame to warningFrame; warningFrame YES button id 0183 calls _level0.gotoAndPlay('comeAgain')"
        data-source-help="Quit the Game"
        data-source-help-frame="3"
        data-source-help-bounds="nutchooser.swf button id 0206 action pushes string Quit the Game, frame 3, and calls _root.helpme; rollout calls _root.nohelp"
      >
        <span class="sr-only">EXIT</span>
      </button>
    </div>
  `;
}

function renderChooserWarningFrame(): string {
  return `
    <aside
      class="help-modal source-help-modal source-chooser-warning-modal"
      aria-label="Quit warning"
      data-source-classification="swf-derived recreation"
      data-source-frame="nutchooser.swf warningFrame"
      data-source-placement="warningFrame places sprite id 0177 depth 0001 matrix scale 1.051 x -10.05 y 18.50 ratio 24; noAction id 0178 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 24; YES button id 0183 depth 0005 x -58.15 y -76.55; NO button id 0188 depth 0008 x 35.30 y -76.55; close sprite id 0189 depth 0011 x 96.30 y -143.70"
    >
      <img src="${nutChooserFrameUrl}" alt="" aria-hidden="true" />
      <img
        class="source-chooser-warningframe-talker"
        src="${chooserWarningframeTalkerUrl}"
        alt=""
        aria-hidden="true"
        data-source-image="nutchooser.swf warningFrame sprite id 0177 rendered in swfcombine translated wrapper x 130 y 90; direct swfrender clips negative-coordinate source art"
      />
      <button
        class="source-warning-choice source-warning-yes"
        type="button"
        data-action="accept-chooser-warning"
        data-source-button="nutchooser.swf warningFrame YES button id 0183"
        data-source-body="nutchooser.swf warningFrame YES normal body shape id 0179"
        data-source-action="_level0.gotoAndPlay('comeAgain')"
      >
        <img class="source-warning-button-body" src="${chooserWarningYesBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${chooserWarningYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button
        class="source-warning-choice source-warning-no"
        type="button"
        data-action="cancel-chooser-warning"
        data-source-button="nutchooser.swf warningFrame NO button id 0188"
        data-source-body="nutchooser.swf warningFrame NO normal body shape id 0184"
        data-source-action="restores chooser controls and sends quiter to buttonON"
      >
        <img class="source-warning-button-body" src="${chooserWarningNoBodyUrl}" alt="" aria-hidden="true" />
        <img class="source-warning-button-label" src="${chooserWarningNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
      <p class="sr-only">Quit the game?</p>
    </aside>
  `;
}

function renderHelp(route: RouteDefinition): string {
  if (route.id === "nutcracker-chooser") {
    return `
      <aside
        class="help-modal source-help-modal source-chooser-help-modal"
        aria-label="Scene help"
        data-source-classification="swf-derived recreation"
        data-source-frame="nutchooser.swf helpframe"
        data-source-placement="helpframe places sprite id 0170 depth 0001 matrix scale 1.051 x -0.90 y 39.65 ratio 22; noAction id 0171 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 22"
      >
        <img src="${nutChooserFrameUrl}" alt="" aria-hidden="true" />
        <img
          class="source-chooser-helpframe-talker"
          src="${chooserHelpframeTalkerUrl}"
          alt=""
          aria-hidden="true"
          data-source-image="nutchooser.swf nested talker sprite id 0169 rendered in swfcombine translated wrapper x 150 y 120; animated by helpframe sprite id 0170"
        />
        <p class="sr-only">${escapeHtml(getHelpText(route))}</p>
      </aside>
    `;
  }

  if (getNutcrackerSongGameByRoute(route.id)) {
    return `
      <aside
        class="help-modal source-help-modal source-song-help-modal"
        aria-label="Scene help"
        role="dialog"
        aria-modal="true"
        data-source-classification="swf-derived recreation"
        data-source-frame="song1/song.swf helpframe"
        data-source-placement="helpframe places sprite id 0333 depth 0001 matrix scale 1.051 x -5.00 y 74.95 ratio 27; noAction id 0334 depth 0003 matrix scale 12.497 x -319.25 y -234.35 ratio 27"
        data-source-action="helpButton release sets _root.theNextFrame to helpFrame; drives _root.usmus to helpFrame/showUp; stops previews and disables quiter/focus"
      >
        <img
          class="source-song-help-art"
          src="${songHelpArtUrl}"
          alt=""
          aria-hidden="true"
          data-source-image="song1/song.swf lossless bitmap id 0073; frame-surface asset used as source-backed help surface while full helpframe display-list playback remains pending"
        />
        <img
          class="source-song-helpframe-talker"
          src="${songHelpframeTalkerUrl}"
          alt=""
          aria-hidden="true"
          data-source-image="song1/song.swf helpframe sprite id 0333 rendered in swfcombine translated wrapper x 140 y 60; direct swfrender clips negative-coordinate source art"
        />
        <p class="sr-only">${escapeHtml(getHelpText(route))}</p>
        <button
          class="source-song-help-dismiss"
          type="button"
          data-action="help"
          data-modal-dismiss="true"
          data-source-fallback="the recovered helpframe sprite auto-exits only after its streamed timeline; the static DOM frame uses one full-frame dismiss surface while exact timed source playback remains unrecovered"
          aria-label="Close song help"
        ></button>
      </aside>
    `;
  }

  return `
    <aside class="help-modal" aria-label="Scene help">
      <h2>${route.title}</h2>
      <p>${escapeHtml(getHelpText(route))}</p>
    </aside>
  `;
}

function getHelpText(route: RouteDefinition): string {
  if (route.id === "nutcracker-chooser") {
    return "Choose a song door.";
  }

  if (getNutcrackerSongGameByRoute(route.id)) {
    return "All songs are played by 4 instruments! Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.";
  }

  return "Route changes stop active scene audio and preserve saved progress locally.";
}

function updateProgress(button: HTMLButtonElement, progress: ProgressStoreController): void {
  const progressAction = button.dataset.progress;
  const key = Number(button.dataset.key);
  const door = Number(button.dataset.door);

  if (progressAction === "key" && isGameKey(key)) {
    progress.markGameKey(key);
  }

  if (progressAction === "nut-door" && isDoorKey(door)) {
    progress.markNutDoor(door);
  }

  if (progressAction === "children-door" && isDoorKey(door)) {
    progress.markChildrensDoor(door);
  }

  if (progressAction === "nut-house") {
    progress.setNutHouseOpenDoor(door);
  }
}

function isGameKey(key: number): key is GameKey {
  return Number.isInteger(key) && key >= 1 && key <= 9;
}

function isDoorKey(door: number): door is DoorKey {
  return Number.isInteger(door) && door >= 1 && door <= 8;
}
