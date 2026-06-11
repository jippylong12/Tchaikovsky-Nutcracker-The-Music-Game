import nutChooserFrameUrl from "./assets/nutcracker-source/nutchooser-frame-source.png";
import chooserDoorUrl from "./assets/nutcracker-source/chooser-door.png";
import chooserHallwayFillUrl from "./assets/nutcracker-source/chooser-hallway-fill.png";
import chooserHallwayPortalCxformUrl from "./assets/nutcracker-source/chooser-hallway-portal-cxform.png";
import chooserHallwayTintCxformUrl from "./assets/nutcracker-source/chooser-hallway-tint-cxform.png";
import chooserHallwayVectorUrl from "./assets/nutcracker-source/chooser-hallway-vector.png";
import chooserHelpButtonArtUrl from "./assets/nutcracker-source/chooser-help-button-art.png";
import chooserHelpframeTalkerUrl from "./assets/nutcracker-source/chooser-helpframe-talker.png";
import chooserInstrumentsCxformUrl from "./assets/nutcracker-source/chooser-instruments-cxform.png";
import chooserExitLabelUrl from "./assets/nutcracker-source/chooser-exit-label.png";
import chooserWarningNoLabelUrl from "./assets/nutcracker-source/chooser-warning-no-label.png";
import chooserWarningYesLabelUrl from "./assets/nutcracker-source/chooser-warning-yes-label.png";
import chooserWarningframeTalkerUrl from "./assets/nutcracker-source/chooser-warningframe-talker.png";
import nutcrackerSongFrameUrl from "./assets/nutcracker-source/song-game-render.png";
import song2SceneryUrl from "./assets/nutcracker-source/song2-scenery.png";
import song3SceneryPrimaryUrl from "./assets/nutcracker-source/song3-scenery-primary.png";
import song4SceneryUrl from "./assets/nutcracker-source/song4-scenery.png";
import song5SceneryUrl from "./assets/nutcracker-source/song5-scenery.png";
import song6SceneryUrl from "./assets/nutcracker-source/song6-scenery.png";
import song7SceneryUrl from "./assets/nutcracker-source/song7-scenery.png";
import song8SceneryUrl from "./assets/nutcracker-source/song8-scenery.png";
import songChangeSongLabelUrl from "./assets/nutcracker-source/song-change-song-label.png";
import songCurtainScallopUrl from "./assets/nutcracker-source/song-curtain-scallop.png";
import songExitLabelUrl from "./assets/nutcracker-source/song-exit-label.png";
import songHelpArtUrl from "./assets/nutcracker-source/song-help-art.png";
import songHelpframeTalkerUrl from "./assets/nutcracker-source/song-helpframe-talker.png";
import songHintLabelUrl from "./assets/nutcracker-source/song-hint-label.png";
import songListenLabelUrl from "./assets/nutcracker-source/song-listen-label.png";
import songNoLabelUrl from "./assets/nutcracker-source/song-no-label.png";
import songPlayAgainLabelUrl from "./assets/nutcracker-source/song-play-again-label.png";
import songStopLabelUrl from "./assets/nutcracker-source/song-stop-label-blue.png";
import songWarningNoLabelUrl from "./assets/nutcracker-source/song-warning-no-label.png";
import songWarningYesLabelUrl from "./assets/nutcracker-source/song-warning-yes-label.png";
import songWarningframeTalkerUrl from "./assets/nutcracker-source/song-warningframe-talker.png";
import songYesLabelUrl from "./assets/nutcracker-source/song-yes-label.png";
import stageMarkUrl from "./assets/stage-mark.svg";
import { createAudioService, type AudioService } from "./audio/audioService";
import {
  dictionaryFamilies,
  dictionaryInstruments,
  getDictionaryInstrument,
  getReadingActivity,
  getSuiteTrack,
  isReadingRouteId,
  readingActivities,
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
import { getRouteById, isRouteId, mainMenuRoutes, routeGroups, routes, type RouteDefinition, type RouteId } from "./routes";
import { createProgressStore, type DoorKey, type GameKey, type ProgressStoreController } from "./state/progressStore";

type ShellState = {
  routeId: RouteId;
  routeStack: RouteId[];
  helpOpen: boolean;
  nutcrackerChooserWarningOpen: boolean;
  activeAudioId: string | null;
  pendingNutcrackerSongChange: NutcrackerSongId | null;
  pendingNutcrackerSongExit: NutcrackerSongId | null;
  readingPages: Record<ReadingRouteId, number>;
  activeDictionaryInstrumentId: string;
  activeSuiteTrackId: string | null;
  nutcrackerSelections: Record<NutcrackerSongId, NutcrackerTrackNumber[]>;
  nutcrackerFeedback: Record<NutcrackerSongId, string | null>;
};

export type AppShellOptions = {
  progress?: ProgressStoreController;
  audio?: AudioService;
  previewAudioPath?: string;
};

const defaultPreviewAudioPath = suiteTracks[0].audioPath;

export function createAppShell(mount: HTMLElement, options: AppShellOptions = {}): void {
  const progress = options.progress ?? createProgressStore();
  const audio = options.audio ?? createAudioService();
  const previewAudioPath = options.previewAudioPath ?? defaultPreviewAudioPath;
  const shellState: ShellState = {
    routeId: "overture",
    routeStack: [],
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
    activeSuiteTrackId: null,
    nutcrackerSelections: createNutcrackerSelectionState(),
    nutcrackerFeedback: createNutcrackerFeedbackState(),
  };

  const render = () => {
    const route = getRouteById(shellState.routeId);
    const progressSnapshot = progress.getSnapshot();
    const audioState = audio.getState();
    const sourceFrameRoute = isNutcrackerSourceFrameRoute(route.id);
    const sourceSceneActions = sourceFrameRoute ? renderSourceSceneActions(route) : "";
    mount.innerHTML = `
      <section class="app-shell" aria-label="Desktop app shell">
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
            ${renderScene(route, progressSnapshot, shellState)}
            ${
              sourceFrameRoute
                ? sourceSceneActions
                  ? `<div class="source-scene-actions" aria-label="Scene controls">${sourceSceneActions}</div>`
                  : ""
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
          <nav class="route-panel" aria-label="Recovered game routes">
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
          </nav>
        </div>
      </section>
    `;

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
      button.addEventListener("click", () => {
        const routeId = button.dataset.readingRoute;
        const pageIndex = Number(button.dataset.readingPage);
        if (routeId && isRouteId(routeId) && isReadingRouteId(routeId) && Number.isInteger(pageIndex)) {
          const activity = getReadingActivity(routeId);
          shellState.readingPages[routeId] = Math.min(Math.max(pageIndex, 0), activity.pages.length - 1);
          render();
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-dictionary-entry]").forEach((button) => {
      button.addEventListener("click", () => {
        const instrumentId = button.dataset.dictionaryEntry;
        if (instrumentId) {
          shellState.activeDictionaryInstrumentId = getDictionaryInstrument(instrumentId).id;
          render();
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-dictionary-audio]").forEach((button) => {
      button.addEventListener("click", () => {
        const audioPath = button.dataset.dictionaryAudio;
        if (audioPath) {
          playSceneAudio(audioPath, false);
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-suite-track]").forEach((button) => {
      button.addEventListener("click", () => {
        const trackId = button.dataset.suiteTrack;
        if (trackId) {
          const track = getSuiteTrack(trackId);
          shellState.activeSuiteTrackId = track.id;
          playSceneAudio(track.audioPath, true);
        }
      });
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
            const track = getSuiteTrack(song.suiteTrackId);
            shellState.activeSuiteTrackId = track.id;
            playSceneAudio(track.audioPath, true);
          }
        }
      });
    });

    mount.querySelectorAll<HTMLButtonElement>("[data-song-track]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const songId = Number(button.dataset.songId);
        const trackNumber = Number(button.dataset.songTrack);
        if (isNutcrackerSongId(songId) && isNutcrackerTrackNumber(trackNumber)) {
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
          handleSongAction(songId, button.dataset.songAction);
        }
      });
    });
  };

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
    const sourceX = event ? event.clientX - viewportRect.left : sourceRect.left + sourceRect.width / 2 - viewportRect.left;
    const sourceY = event ? event.clientY - viewportRect.top : sourceRect.top - viewportRect.top;
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
    if (routeId !== shellState.routeId) {
      shellState.routeStack.push(shellState.routeId);
    }
    shellState.routeId = routeId;
    shellState.helpOpen = false;
    shellState.nutcrackerChooserWarningOpen = false;
    shellState.pendingNutcrackerSongChange = null;
    shellState.pendingNutcrackerSongExit = null;
    audio.stopSceneAudio();
    shellState.activeAudioId = null;
    shellState.activeSuiteTrackId = null;
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

  const playSceneAudio = (audioPath: string, loop: boolean, startTimeSeconds = 0) => {
    audio.stopSceneAudio();
    shellState.activeAudioId = loop ? audio.playTrack(audioPath, startTimeSeconds).id : audio.playOneShot(audioPath).id;
    render();
  };

  const handleAction = (action: string | undefined) => {
    if (action === "start") {
      navigate("main-menu");
      return;
    }

    if (action === "back") {
      shellState.routeId = shellState.routeStack.pop() ?? "main-menu";
      shellState.helpOpen = false;
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
      shellState.nutcrackerChooserWarningOpen = false;
      shellState.pendingNutcrackerSongExit = null;
      shellState.helpOpen = !shellState.helpOpen;
      render();
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
      navigate("main-menu");
      return;
    }

    if (action === "reset-progress") {
      progress.resetAll();
      render();
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
      playSceneAudio(track.audioPath, true);
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
      const track = getSuiteTrack(song.suiteTrackId);
      shellState.activeSuiteTrackId = track.id;
      playSceneAudio(track.audioPath, true);
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
      render();
      return;
    }

    if (action === "cancel-change-song") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      render();
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
      render();
      return;
    }

    if (action === "cancel-exit-song") {
      shellState.pendingNutcrackerSongExit = null;
      render();
      return;
    }

    if (action === "accept-exit-song") {
      shellState.pendingNutcrackerSongExit = null;
      navigate("nutcracker-chooser");
      return;
    }

    if (action === "hint-song") {
      shellState.pendingNutcrackerSongChange = null;
      shellState.pendingNutcrackerSongExit = null;
      showNutcrackerHint(song, shellState, progress);
      render();
      return;
    }

    if (action === "submit-song") {
      submitNutcrackerSong(song, shellState, progress);
      render();
    }
  };

  render();
}

function renderScene(route: RouteDefinition, progress: ReturnType<ProgressStoreController["getSnapshot"]>, shellState: ShellState): string {
  if (route.id === "main-menu") {
    return `
      <div class="scene-body menu-scene">
        ${routeGroups
          .map(
            (group) => `
              <section class="menu-group" aria-label="${group.title}">
                <h1>${group.title}</h1>
                <div class="menu-grid">
                  ${mainMenuRoutes
                    .filter((item) => item.group === group.id)
                    .map(renderMenuCard)
                    .join("")}
                </div>
              </section>
            `,
          )
          .join("")}
      </div>
    `;
  }

  if (isReadingRouteId(route.id)) {
    return renderReadingActivity(route.id, shellState.readingPages[route.id]);
  }

  if (route.id === "music-dictionary") {
    return renderMusicDictionary(getDictionaryInstrument(shellState.activeDictionaryInstrumentId));
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
      shellState.activeAudioId !== null,
      shellState.pendingNutcrackerSongChange === song.id,
      shellState.pendingNutcrackerSongExit === song.id,
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

function renderReadingActivity(routeId: ReadingRouteId, pageIndex: number): string {
  const activity = getReadingActivity(routeId);
  const safePageIndex = Math.min(Math.max(pageIndex, 0), activity.pages.length - 1);
  const page = activity.pages[safePageIndex];
  const previousPage = Math.max(safePageIndex - 1, 0);
  const nextPage = Math.min(safePageIndex + 1, activity.pages.length - 1);

  return `
    <div class="scene-body reference-reader">
      <section class="reference-art" aria-label="Recovered activity artwork">
        <img src="${page.imagePath}" alt="" aria-hidden="true" />
        <p>${escapeHtml(activity.pageCountLabel)}</p>
      </section>
      <section class="reference-copy" aria-label="${escapeHtml(activity.title)}">
        <div class="activity-tabs" aria-label="Reference activities">
          ${readingActivities
            .map(
              (item) => `
                <button
                  class="tab-button"
                  type="button"
                  data-scene-route="${item.routeId}"
                  aria-pressed="${item.routeId === routeId}"
                >
                  ${escapeHtml(item.title.replace("The Nutcracker ", "").replace("Nutcracker ", ""))}
                </button>
              `,
            )
            .join("")}
        </div>
        <p class="level-label">Reference ${safePageIndex + 1}/${activity.pages.length}</p>
        <h1>${escapeHtml(page.title)}</h1>
        <p class="reading-text">${formatMultilineText(page.body)}</p>
        <div class="page-controls" aria-label="Page controls">
          <button
            class="page-button"
            type="button"
            data-reading-route="${routeId}"
            data-reading-page="${previousPage}"
            ${safePageIndex === 0 ? "disabled" : ""}
          >
            Prev
          </button>
          ${activity.pages
            .map(
              (_page, index) => `
                <button
                  class="page-button number"
                  type="button"
                  data-reading-route="${routeId}"
                  data-reading-page="${index}"
                  aria-current="${index === safePageIndex ? "page" : "false"}"
                >
                  ${index + 1}
                </button>
              `,
            )
            .join("")}
          <button
            class="page-button"
            type="button"
            data-reading-route="${routeId}"
            data-reading-page="${nextPage}"
            ${safePageIndex === activity.pages.length - 1 ? "disabled" : ""}
          >
            Next
          </button>
          ${
            activity.audioPath
              ? `<button class="media-button icon-media-button" type="button" data-reading-audio="${activity.audioPath}" aria-label="Play original audio" title="Play original audio"></button>`
              : ""
          }
        </div>
        <p class="asset-note">Source: ${escapeHtml(activity.sourceSwfPath)}. ${activity.frameCount} recovered frames.</p>
      </section>
    </div>
  `;
}

function renderMusicDictionary(activeInstrument: DictionaryInstrument): string {
  return `
    <div class="scene-body dictionary-scene">
      <section class="dictionary-browser" aria-label="Instrument list">
        <h1>Instrument encyclopedia</h1>
        <div class="dictionary-list">
          ${dictionaryFamilies
            .map((family) => {
              const familyEntries = dictionaryInstruments.filter((instrument) => instrument.family === family);
              return `
                <div class="instrument-family">
                  <p>${family}</p>
                  ${familyEntries.map((instrument) => renderDictionaryButton(instrument, activeInstrument.id)).join("")}
                </div>
              `;
            })
            .join("")}
        </div>
      </section>
      <section class="dictionary-detail" aria-label="${escapeHtml(activeInstrument.name)} details">
        <img src="/local-media/visual/activities/originals/gramophone/108.png" alt="" aria-hidden="true" />
        <p class="level-label">${escapeHtml(activeInstrument.family)}</p>
        <h2>${escapeHtml(activeInstrument.name)}</h2>
        <p>${escapeHtml(activeInstrument.summary)}</p>
        <button class="media-button" type="button" data-dictionary-audio="${activeInstrument.audioPath}">
          Play instrument
        </button>
        <p class="asset-note">Musictionary source asset ${activeInstrument.sourceAssetId} from activities/musictionary/musictionary.swf.</p>
      </section>
    </div>
  `;
}

function renderDictionaryButton(instrument: DictionaryInstrument, activeInstrumentId: string): string {
  return `
    <button
      class="dictionary-entry"
      type="button"
      data-dictionary-entry="${instrument.id}"
      aria-pressed="${instrument.id === activeInstrumentId}"
    >
      ${escapeHtml(instrument.name)}
    </button>
  `;
}

function renderSuitePlayer(activeTrackId: string | null, isPlaying: boolean): string {
  const activeTrack = activeTrackId ? getSuiteTrack(activeTrackId) : suiteTracks[0];
  const playbackLabel = activeTrackId ? (isPlaying ? "Now playing" : "Paused") : "Select a recovered gramophone track";

  return `
    <div class="scene-body suite-scene">
      <section class="gramophone-panel" aria-label="Nutcracker Suite Listening player">
        <img src="/local-media/visual/activities/originals/gramophone/108.png" alt="" aria-hidden="true" />
        <div class="suite-copy">
          <p class="level-label">Listening player</p>
          <h1>Nutcracker Suite Listening</h1>
          <div class="suite-now-playing">
            <p>${playbackLabel}: ${escapeHtml(activeTrack.title)}</p>
            ${
              activeTrackId
                ? `<button
                    class="media-button ${isPlaying ? "suite-stop-button" : "suite-play-button"}"
                    type="button"
                    data-action="${isPlaying ? "suite-stop" : "suite-play"}"
                    aria-label="${isPlaying ? "Stop track" : "Play selected track"}"
                    title="${isPlaying ? "Stop track" : "Play selected track"}"
                  ></button>`
                : ""
            }
          </div>
        </div>
      </section>
      <section class="suite-track-list" aria-label="Suite tracks">
        ${suiteTracks.map((track) => renderSuiteTrackButton(track, activeTrack.id)).join("")}
      </section>
    </div>
  `;
}

function renderSuiteTrackButton(track: SuiteTrack, activeTrackId: string): string {
  return `
    <button
      class="suite-track-button"
      type="button"
      data-suite-track="${track.id}"
      aria-pressed="${track.id === activeTrackId}"
    >
      <span>${track.number}. ${escapeHtml(track.title)}</span>
      <small>${formatDuration(track.durationSeconds)}</small>
    </button>
  `;
}

function renderNutcrackerChooser(progress: ReturnType<ProgressStoreController["getSnapshot"]>): string {
  return `
    <div class="scene-body chooser-scene nutcracker-chooser source-flash-scene">
      <img
        class="nutcracker-chooser-hallway-fill"
        src="${chooserHallwayFillUrl}"
        alt=""
        aria-hidden="true"
        data-source-placement="nutchooser.swf sprite id 0021 places shape id 0016 at depth 0001 with root scale 0.743 x 87.85 y 46.15; shape bbox [-5.25,30.05,612.45,387.00]"
        data-source-image="shape id 0016 rendered with swfrender and trimmed by npm run assets:nutcracker-ui"
      />
      <img
        class="nutcracker-chooser-hallway-portal"
        src="${chooserHallwayPortalCxformUrl}"
        alt=""
        aria-hidden="true"
        data-source-placement="nutchooser.swf sprite id 0021 places shape id 0017 at depth 0007 matrix x 273.35 y 137.75 with root scale 0.743 x 87.85 y 46.15"
        data-source-image="shape id 0017 rendered with swfrender, trimmed, then CXForm add 143 60 -10 0 applied by npm run assets:nutcracker-ui"
      />
      <img
        class="nutcracker-chooser-hallway-vector"
        src="${chooserHallwayVectorUrl}"
        alt=""
        aria-hidden="true"
        data-source-placement="nutchooser.swf sprite id 0021 contains shape id 0018 at depth 0011; root scale 0.743 x 87.85 y 46.15; shape bbox [-19.65,-67.05,637.70,414.95]"
        data-source-image="shape id 0018 rendered with swfrender and trimmed by npm run assets:nutcracker-ui; full sprite id 0021 still blocked by local JPEG3 renderer support"
      />
      <img
        class="nutcracker-chooser-hallway-tint"
        src="${chooserHallwayTintCxformUrl}"
        alt=""
        aria-hidden="true"
        data-source-placement="nutchooser.swf sprite id 0021 places shape id 0020 at depth 0012 with root scale 0.743 x 87.85 y 46.15; shape bbox [0.00,0.00,615.20,404.95]"
        data-source-image="shape id 0020 uses bitmap id 0019 fill; alpha from repaired JPEG3 id 0019 resized to shape bbox, then CXForm mul 0 0 0 1 add 255 51 153 0 applied by npm run assets:nutcracker-ui"
      />
      <img
        class="nutcracker-frame-art"
        src="${nutChooserFrameUrl}"
        alt=""
        aria-hidden="true"
        data-source-placement="nutchooser.swf id 0034 depth 0055 matrix scale 1.055 x 5.55 y -3.85 ratio 5"
      />
      <img
        class="nutcracker-chooser-instruments"
        src="${chooserInstrumentsCxformUrl}"
        alt=""
        aria-hidden="true"
        data-source-placement="nutchooser.swf id 0068 depth 0069 matrix scale 1.000 x 46.55 y 285.85 ratio 5 cxform add -209 -153 134 -223"
        data-source-image="sprite id 0068 rendered and trimmed, then root depth 0069 CXForm add -209 -153 134 -223 applied by npm run assets:nutcracker-ui"
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
                    src="${chooserDoorUrl}"
                    alt=""
                    aria-hidden="true"
                    data-source-image="trimmed render of nutchooser.swf movie clip id 0080; no modern hover glow, drop shadow, status label, or disabled opacity"
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
      ${renderNutcrackerFlyingHelp("chooser")}
    </div>
  `;
}

function renderNutcrackerSongGame(
  song: NutcrackerSongGame,
  completed: boolean,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
  isPlaying: boolean,
  changePromptOpen: boolean,
  exitWarningOpen: boolean,
): string {
  const selectedTrackCount = selectedTrackNumbers.length;
  const correctRequiredCount = getCorrectNutcrackerTrackNumbers(song).length;
  const correctSelectionCount = feedback ? countCorrectSelections(song, selectedTrackNumbers) : 0;
  const incorrectSelectionCount = feedback ? Math.max(0, selectedTrackCount - correctSelectionCount) : 0;
  const hintOnly = feedback === "hint";
  const selectionCorrect = isCorrectNutcrackerSelection(song, selectedTrackNumbers);
  const sourceMessage = feedback && !hintOnly
    ? selectionCorrect
      ? null
      : `you have ${correctSelectionCount} correct instruments and ${incorrectSelectionCount} incorrect instruments`
    : hintOnly || (selectedTrackCount > 0 && selectedTrackCount < correctRequiredCount)
      ? "All songs are played by 4 instruments!"
    : "Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.";

  return `
    <div class="scene-body nutcracker-song-scene source-flash-scene">
      <img class="song-source-frame" src="${nutcrackerSongFrameUrl}" alt="" aria-hidden="true" />
      ${renderNutcrackerSongScenery(song.id)}
      <section class="song-stage-overlay" aria-label="${escapeHtml(song.title)} track choices" data-song-drop-stage="${song.id}">
        <h1 class="sr-only">${escapeHtml(song.title)}</h1>
        <p class="song-source-message sr-only" aria-live="polite">${escapeHtml(sourceMessage ?? "")}</p>
        ${renderSelectedNutcrackerActors(song, selectedTrackNumbers, feedback)}
        ${song.tracks.map((track) => renderNutcrackerTrackButton(song.id, track, selectedTrackNumbers, feedback)).join("")}
        ${renderNutcrackerFlyingHelp()}
        <div class="song-actions source-song-actions" aria-label="Source song controls">
          <button class="media-button source-label-button source-listen-button" type="button" data-source-control="songChooser" data-source-help="${isPlaying ? "Stop the Music" : "Listen to the Original Music"}" data-source-help-frame="4" data-source-help-bounds="frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-song-action="play-theme" data-song-id="${song.id}">
            <img src="${isPlaying ? songStopLabelUrl : songListenLabelUrl}" alt="" aria-hidden="true" />
            <span class="sr-only">${isPlaying ? "STOP" : "LISTEN"}</span>
          </button>
          <button class="scene-button source-label-button source-hint-button" type="button" data-source-control="helpButton" data-source-help="Hint" data-source-help-frame="4" data-source-help-bounds="frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-song-action="hint-song" data-song-id="${song.id}">
            <img src="${songHintLabelUrl}" alt="" aria-hidden="true" />
            <span class="sr-only">HINT</span>
          </button>
          <button class="scene-button source-label-button source-change-song-button" type="button" data-source-control="hintButton" data-source-help="Select a&#10;different&#10;song" data-source-help-frame="4" data-source-help-bounds="frame 4 places sprite id 0240 at x 80.00 y 37.20 ratio 3" data-song-action="confirm-change-song" data-song-id="${song.id}">
            <img src="${songChangeSongLabelUrl}" alt="" aria-hidden="true" />
            <span class="sr-only">CHANGE SONG</span>
          </button>
          <button class="scene-button source-label-button source-exit-button" type="button" data-source-control="listenSong" data-source-help="Quit the Game" data-source-help-frame="3" data-source-help-bounds="frame 3 edit ids 0234-0236 bbox approx 276x22 after 1.2 scale" data-source-action="sets _root.theNextFrame to warningFrame; drives _root.usmus to warningFrame/showUp" data-song-action="confirm-exit-song" data-song-id="${song.id}">
            <img src="${songExitLabelUrl}" alt="" aria-hidden="true" />
            <span class="sr-only">EXIT</span>
          </button>
          ${
            feedback
              ? `<button
                  class="page-button source-label-button source-play-again-button"
                  type="button"
                  data-source-control="gameController"
                  data-source-placement="song1/song.swf gameController id 0115 depth 0116 matrix scale 1.140 x 322.20 y 317.70; buttonAgain frame places id 0114 at x -0.90 y 1.75 ratio 3"
                  data-song-action="reset-song"
                  data-song-id="${song.id}"
                >
                  <img src="${songPlayAgainLabelUrl}" alt="" aria-hidden="true" />
                  <span class="sr-only">PLAY AGAIN</span>
                </button>`
              : ""
          }
        </div>
        ${sourceMessage ? renderNutcrackerHintCurtain(sourceMessage) : ""}
        ${changePromptOpen ? renderNutcrackerChangeSongPrompt(song.id) : ""}
        ${exitWarningOpen ? renderNutcrackerSongExitWarning(song.id) : ""}
        <p class="sr-only">${completed ? "Door cleared." : "Door ready."} Source: ${escapeHtml(song.sourcePath)}. Track streams extracted from recovered SWFs.</p>
      </section>
    </div>
  `;
}

function renderNutcrackerHintCurtain(message: string): string {
  return `
    <aside
      class="source-alert source-hint-alert"
      aria-label="Song hint"
      data-source-frame="song1/song.swf courtain giveHint"
      data-source-placement="courtain root id 0063 depth 0082 x 319.85 y 4.90; _root.message edit id 0058 depth 0007 matrix scale 0.953/0.843 x 132.90 y 96.80 ratio 14"
    >
      ${renderNutcrackerCurtainArt()}
      <p>${escapeHtml(message)}</p>
    </aside>
  `;
}

function renderNutcrackerChangeSongPrompt(songId: NutcrackerSongId): string {
  return `
    <aside
      class="source-alert source-change-alert"
      aria-label="Change song confirmation"
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
        data-source-action="_level0.gotoAndPlay('comeAgain')"
      >
        <img src="${songWarningYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button
        class="source-song-warning-choice source-song-warning-no"
        type="button"
        data-song-action="cancel-exit-song"
        data-song-id="${songId}"
        data-source-button="song1/song.swf warningFrame NO button id 0351"
        data-source-action="stopPreview; resumeInst; instFrameShow; restore speakers/focus/quiter buttonON"
      >
        <img src="${songWarningNoLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">NO</span>
      </button>
    </aside>
  `;
}

function renderNutcrackerCurtainArt(): string {
  return `
    <img
      class="source-alert-curtain-art"
      src="${songCurtainScallopUrl}"
      alt=""
      aria-hidden="true"
      data-source-image="song1/song.swf lossless bitmap id 0039; courtain base sprite id 0042"
    />
  `;
}

function renderNutcrackerSongScenery(songId: NutcrackerSongId): string {
  const scenery: Partial<Record<NutcrackerSongId, readonly string[]>> = {
    2: [song2SceneryUrl],
    3: [song3SceneryPrimaryUrl],
    4: [song4SceneryUrl],
    5: [song5SceneryUrl],
    6: [song6SceneryUrl],
    7: [song7SceneryUrl],
    8: [song8SceneryUrl],
  };
  return (scenery[songId] ?? [])
    .map(
      (sourceUrl, index) =>
        `<img class="song-source-scenery song-source-scenery-${songId}-${index + 1}" src="${sourceUrl}" alt="" aria-hidden="true" />`,
    )
    .join("");
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
          data-source-animation="games/nutcrackergame/song${song.id}/characters/anim${track.number}.swf"
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
    1: { left: 40, top: 231, width: 124, height: 140 },
    2: { left: 383, top: 226, width: 124, height: 140 },
    3: { left: 148, top: 219, width: 92, height: 112 },
    4: { left: 349, top: 221, width: 96, height: 112 },
    5: { left: 215, top: 208, width: 70, height: 96 },
    6: { left: 333, top: 210, width: 74, height: 96 },
    7: { left: 254, top: 206, width: 54, height: 78 },
    8: { left: 327, top: 203, width: 54, height: 78 },
  };
  const position = positions[songId];
  return `left:${position.left}px;top:${position.top}px;width:${position.width}px;height:${position.height}px`;
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

function isNutcrackerSourceFrameRoute(routeId: RouteId): boolean {
  return routeId === "nutcracker-chooser" || getNutcrackerSongGameByRoute(routeId) !== undefined;
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

function renderMenuCard(route: RouteDefinition): string {
  return `
    <button class="menu-card" type="button" data-scene-route="${route.id}">
      <span>${route.title}</span>
      <small>${route.levelTarget}</small>
    </button>
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

function renderSourceSceneActions(route: RouteDefinition): string {
  if (route.id === "nutcracker-chooser") {
    return "";
  }

  if (getNutcrackerSongGameByRoute(route.id)) {
    return "";
  }

  return renderPrimaryActions(route);
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
        data-source-image="normal visible Help control uses buttonON shape id 0201; older shape id 0198 render is buttonOFF only"
        data-source-help="Help"
        data-source-help-frame="4"
        data-source-help-bounds="nutchooser.swf button id 0200 action pushes string Help, frame 4, and calls _root.helpme; rollout calls _root.nohelp"
      >
        <img src="${chooserHelpButtonArtUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">Help</span>
      </button>
      <button
        class="scene-button source-label-button chooser-source-exit-button primary"
        type="button"
        data-action="chooser-warning"
        data-source-control="quiter"
        data-source-placement="nutchooser.swf quiter root placement sprite id 0207 at depth 0173 matrix scale 0.900 x 585.90 y 472.45 ratio 5"
        data-source-state="sprite id 0207 buttonON places button id 0206 depth 0001; source sibling text id 0204 renders the normal peach EXIT label; buttonOFF places blue text id 0203 depth 0001 matrix scale 1.722 x -114.95 y -12.70 with CXForm add 102 102 204 0"
        data-source-image="normal visible EXIT label uses buttonON text id 0204; text id 0203 is the blue buttonOFF label"
        data-source-action="sets _root.theNextFrame to warningFrame; warningFrame YES button id 0183 calls _level0.gotoAndPlay('comeAgain')"
        data-source-help="Quit the Game"
        data-source-help-frame="3"
        data-source-help-bounds="nutchooser.swf button id 0206 action pushes string Quit the Game, frame 3, and calls _root.helpme; rollout calls _root.nohelp"
      >
        <img src="${chooserExitLabelUrl}" alt="" aria-hidden="true" />
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
        data-source-action="_level0.gotoAndPlay('comeAgain')"
      >
        <img src="${chooserWarningYesLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">YES</span>
      </button>
      <button
        class="source-warning-choice source-warning-no"
        type="button"
        data-action="cancel-chooser-warning"
        data-source-button="nutchooser.swf warningFrame NO button id 0188"
        data-source-action="restores chooser controls and sends quiter to buttonON"
      >
        <img src="${chooserWarningNoLabelUrl}" alt="" aria-hidden="true" />
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
