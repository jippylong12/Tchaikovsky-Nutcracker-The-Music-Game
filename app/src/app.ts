import nutChooserFrameUrl from "./assets/nutcracker-source/nutchooser-frame-source.png";
import chooserDoorUrl from "./assets/nutcracker-source/chooser-door.png";
import chooserHallwayUrl from "./assets/nutcracker-source/chooser-hallway.png";
import chooserInstrumentsUrl from "./assets/nutcracker-source/chooser-instruments.png";
import nutcrackerSongFrameUrl from "./assets/nutcracker-source/song-game-render.png";
import song2SceneryUrl from "./assets/nutcracker-source/song2-scenery.png";
import song3SceneryPrimaryUrl from "./assets/nutcracker-source/song3-scenery-primary.png";
import song4SceneryUrl from "./assets/nutcracker-source/song4-scenery.png";
import song5SceneryUrl from "./assets/nutcracker-source/song5-scenery.png";
import song6SceneryUrl from "./assets/nutcracker-source/song6-scenery.png";
import song7SceneryUrl from "./assets/nutcracker-source/song7-scenery.png";
import song8SceneryUrl from "./assets/nutcracker-source/song8-scenery.png";
import songExitLabelUrl from "./assets/nutcracker-source/song-exit-label.png";
import songHintLabelUrl from "./assets/nutcracker-source/song-hint-label.png";
import songListenLabelUrl from "./assets/nutcracker-source/song-listen-label.png";
import songPlayAgainLabelUrl from "./assets/nutcracker-source/song-play-again-label.png";
import songStopLabelUrl from "./assets/nutcracker-source/song-stop-label-blue.png";
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
  activeAudioId: string | null;
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
    activeAudioId: null,
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
                ? `<div class="source-scene-actions" aria-label="Scene controls">${renderSourceSceneActions(route)}</div>`
                : `<footer class="scene-footer">
                    <div class="scene-actions">
                      ${renderPrimaryActions(route)}
                    </div>
                    <p class="status-label">640 x 480</p>
                  </footer>`
            }
            ${shellState.helpOpen ? renderHelp(route) : ""}
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

  const navigate = (routeId: RouteId) => {
    if (routeId !== shellState.routeId) {
      shellState.routeStack.push(shellState.routeId);
    }
    shellState.routeId = routeId;
    shellState.helpOpen = false;
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
      audio.stopSceneAudio();
      shellState.activeAudioId = null;
      shellState.activeSuiteTrackId = null;
      render();
      return;
    }

    if (action === "help") {
      shellState.helpOpen = !shellState.helpOpen;
      render();
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
      <img class="nutcracker-chooser-hallway" src="${chooserHallwayUrl}" alt="" aria-hidden="true" />
      <img class="nutcracker-frame-art" src="${nutChooserFrameUrl}" alt="" aria-hidden="true" />
      <img class="nutcracker-chooser-instruments" src="${chooserInstrumentsUrl}" alt="" aria-hidden="true" />
      <p class="sr-only">Nutcracker song doors</p>
      <div class="nutcracker-door-grid" aria-label="Nutcracker song doors">
        ${nutcrackerSongGames
          .map((song) => {
            const door = song.id as DoorKey;
            const completed = progress.nutDoors[door];
            const unlocked = isNutcrackerDoorUnlocked(progress, song.id);
            const status = completed ? "Cleared" : unlocked ? "Ready" : "Locked";
            return `
              <article class="nutcracker-door-card" style="${getNutcrackerDoorStyle(song.id)}" aria-label="Door ${door} ${escapeHtml(song.title)}">
                <button
                  class="door-button nutcracker-door-button"
                  type="button"
                  data-nutcracker-door="${song.id}"
                  ${unlocked ? "" : "disabled"}
                >
                  <img class="chooser-door-art" src="${chooserDoorUrl}" alt="" aria-hidden="true" />
                  <span>${song.id}</span>
                  <strong>${status}</strong>
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
    </div>
  `;
}

function renderNutcrackerSongGame(
  song: NutcrackerSongGame,
  completed: boolean,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
  feedback: string | null,
  isPlaying: boolean,
): string {
  const selectedTrackCount = selectedTrackNumbers.length;
  const correctRequiredCount = getCorrectNutcrackerTrackNumbers(song).length;
  const correctSelectionCount = feedback ? countCorrectSelections(song, selectedTrackNumbers) : 0;
  const incorrectSelectionCount = feedback ? Math.max(0, selectedTrackCount - correctSelectionCount) : 0;
  const message = feedback
    ? isCorrectNutcrackerSelection(song, selectedTrackNumbers)
      ? "ok"
      : `you have ${correctSelectionCount} correct instruments and ${incorrectSelectionCount} incorrect instruments`
    : selectedTrackCount > 0 && selectedTrackCount < correctRequiredCount
      ? "All songs are played by 4 instruments!"
      : "Listen to the original song and find  4 correct instruments. Double click on the instruments or drag them onto the stage.";

  return `
    <div class="scene-body nutcracker-song-scene source-flash-scene">
      <img class="song-source-frame" src="${nutcrackerSongFrameUrl}" alt="" aria-hidden="true" />
      ${renderNutcrackerSongScenery(song.id)}
      <section class="song-stage-overlay" aria-label="${escapeHtml(song.title)} track choices" data-song-drop-stage="${song.id}">
        <h1 class="sr-only">${escapeHtml(song.title)}</h1>
        <p class="song-source-message" aria-live="polite">${escapeHtml(message)}</p>
        ${renderSelectedNutcrackerActors(song, selectedTrackNumbers, feedback)}
        ${song.tracks.map((track) => renderNutcrackerTrackButton(song.id, track, selectedTrackNumbers, feedback)).join("")}
        <div class="song-actions source-song-actions">
          <button class="media-button source-label-button source-listen-button" type="button" data-song-action="play-theme" data-song-id="${song.id}">
            <img src="${isPlaying ? songStopLabelUrl : songListenLabelUrl}" alt="" aria-hidden="true" />
            <span class="sr-only">${isPlaying ? "STOP" : "LISTEN"}</span>
          </button>
          ${
            feedback
              ? `<button class="page-button source-label-button source-play-again-button" type="button" data-song-action="reset-song" data-song-id="${song.id}">
                  <img src="${songPlayAgainLabelUrl}" alt="" aria-hidden="true" />
                  <span class="sr-only">PLAY AGAIN</span>
                </button>`
              : ""
          }
        </div>
        <p class="sr-only">${completed ? "Door cleared." : "Door ready."} Source: ${escapeHtml(song.sourcePath)}. Track streams extracted from recovered SWFs.</p>
      </section>
    </div>
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
          class="source-selected-actor source-selected-actor-${track.number}${correctnessClass}"
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

  return `
    <article class="track-card source-track-hotspot${selected ? " selected" : ""}${feedbackClass}" style="${getTrackHotspotStyle(track.number)}">
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

function getTrackHotspotStyle(trackNumber: NutcrackerTrackNumber): string {
  const positions: Record<NutcrackerTrackNumber, { left: number; top: number; width: number; height: number }> = {
    1: { left: 70, top: 330, width: 178, height: 102 },
    2: { left: 45, top: 296, width: 160, height: 70 },
    3: { left: 66, top: 260, width: 182, height: 60 },
    4: { left: 478, top: 286, width: 122, height: 92 },
    5: { left: 242, top: 342, width: 180, height: 86 },
    6: { left: 386, top: 326, width: 132, height: 78 },
    7: { left: 525, top: 369, width: 88, height: 72 },
    8: { left: 520, top: 252, width: 94, height: 82 },
  };
  const position = positions[trackNumber];
  return `left:${position.left}px;top:${position.top}px;width:${position.width}px;height:${position.height}px`;
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
    return `
      <button class="scene-button source-label-button source-exit-button primary" type="button" data-action="exit">
        <img src="${songExitLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">EXIT</span>
      </button>
    `;
  }

  if (getNutcrackerSongGameByRoute(route.id)) {
    return `
      <button class="scene-button source-label-button source-hint-button" type="button" data-action="help">
        <img src="${songHintLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">HINT</span>
      </button>
      <button class="scene-button source-label-button source-exit-button primary" type="button" data-scene-route="nutcracker-chooser">
        <img src="${songExitLabelUrl}" alt="" aria-hidden="true" />
        <span class="sr-only">EXIT</span>
      </button>
    `;
  }

  return renderPrimaryActions(route);
}

function renderHelp(route: RouteDefinition): string {
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
