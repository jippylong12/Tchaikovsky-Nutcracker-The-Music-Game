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
import { getRouteById, isRouteId, mainMenuRoutes, routeGroups, routes, songRoutes, type RouteDefinition, type RouteId } from "./routes";
import { createProgressStore, type DoorKey, type GameKey, type ProgressStoreController } from "./state/progressStore";

type ShellState = {
  routeId: RouteId;
  routeStack: RouteId[];
  helpOpen: boolean;
  activeAudioId: string | null;
  readingPages: Record<ReadingRouteId, number>;
  activeDictionaryInstrumentId: string;
  activeSuiteTrackId: string | null;
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
  };

  const render = () => {
    const route = getRouteById(shellState.routeId);
    const progressSnapshot = progress.getSnapshot();
    const audioState = audio.getState();
    mount.innerHTML = `
      <section class="app-shell" aria-label="Desktop app shell">
        <div class="desktop-frame">
          <section class="game-viewport" aria-label="Fixed 640 by 480 game viewport">
            <header class="scene-header">
              <div>
                <p class="kicker">Private local remake</p>
                <p class="scene-title">${route.title}</p>
              </div>
              <p class="status-label">${progressSnapshot.completedGameCount} of 9 keys</p>
            </header>
            ${renderScene(route, progressSnapshot, shellState)}
            <footer class="scene-footer">
              <div class="scene-actions">
                ${renderPrimaryActions(route)}
              </div>
              <p class="status-label">640 x 480</p>
            </footer>
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

  const playSceneAudio = (audioPath: string, loop: boolean) => {
    audio.stopSceneAudio();
    shellState.activeAudioId = loop ? audio.playTrack(audioPath).id : audio.playOneShot(audioPath).id;
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
    return `
      <div class="scene-body chooser-scene">
        <div class="scene-copy">
          <h1>${route.heading}</h1>
          <p>${route.summary}</p>
        </div>
        <div class="door-grid" aria-label="Nutcracker song doors">
          ${songRoutes
            .map((songRoute, index) => {
              const door = (index + 1) as DoorKey;
              return `
                <button class="door-button" type="button" data-scene-route="${songRoute.id}">
                  <span>${door}</span>
                  <strong>${progress.nutDoors[door] ? "Open" : "Closed"}</strong>
                </button>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
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

function renderHelp(route: RouteDefinition): string {
  return `
    <aside class="help-modal" aria-label="Scene help">
      <h2>${route.title}</h2>
      <p>Scene route: ${route.id}. Flash target: ${route.levelTarget}. Route changes stop active scene audio and preserve saved progress locally.</p>
    </aside>
  `;
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
