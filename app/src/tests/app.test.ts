import { describe, expect, it } from "vitest";
import { createAppShell } from "../app";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import { getCorrectNutcrackerTrackNumbers, nutcrackerSongGames } from "../data/nutcrackerSongGames";
import { dictionaryInstruments, readingActivities } from "../data/referenceContent";
import { createProgressStore, progressStorageKey, type ProgressPersistence } from "../state/progressStore";
import { statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

class FakeAudioElement implements AudioElementLike {
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

function createTestShell(mount: HTMLElement): void {
  createAppShell(mount, {
    progress: createProgressStore(createMemoryPersistence()),
    audio: createAudioService({
      createAudioElement: () => new FakeAudioElement(),
    }),
    previewAudioPath: "/local-media/audio/activities/originals/theme1.mp3",
  });
}

function publicAssetSize(publicPath: string): number {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  return statSync(join(currentDir, "../../public", publicPath)).size;
}

describe("desktop app shell", () => {
  it("renders the fixed game viewport and recovered route map", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    expect(mount.querySelector(".game-viewport")).not.toBeNull();
    expect(mount.textContent).toContain("Tchaikovsky's Nutcracker");
    expect(mount.textContent).toContain("Story");
    expect(mount.textContent).toContain("Tree Game");
    expect(mount.textContent).toContain("Local desktop package only");
  });

  it("switches route content without leaving the shell", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount
      .querySelector<HTMLButtonElement>('[data-route="suite"]')
      ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Listening player");
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
  });

  it("launches main menu cards inside the fixed shell", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-action="start"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-scene-route="trivia"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Trivia challenge");
    expect(mount.querySelector(".game-viewport")).not.toBeNull();
  });

  it("updates progress and audio controls from the side panel", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-progress="key"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-action="audio-preview"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Game keys1/9");
    expect(mount.textContent).toContain("Active");
    expect(window.localStorage.getItem(progressStorageKey)).toBeNull();
  });

  it("renders original story spreads with recovered local artwork", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="story"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-reading-page="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Pages 3-4");
    expect(mount.textContent).toContain("Clara's godfather gave her an awesome Nutcracker doll");
    expect(mount.textContent).toContain("Source: activities/story/story.swf");
    expect(mount.textContent).toContain("4 click-through spreads");
    expect(mount.textContent).not.toContain("Play original audio");
    expect(mount.querySelector<HTMLButtonElement>('[aria-label="Play original audio"]')).not.toBeNull();
    expect(mount.querySelector<HTMLImageElement>(".reference-art img")?.src).toContain("/local-media/visual/activities/story/5-alpha.png");
  });

  it("selects music dictionary instruments and plays their recovered clips", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="music-dictionary"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-dictionary-entry="timpani"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>("[data-dictionary-audio]")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Instrument encyclopedia");
    expect(mount.textContent).toContain("Large tuned drums");
    expect(mount.textContent).toContain("Musictionary source asset 527");
  });

  it("plays and stops Nutcracker Suite gramophone tracks", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="suite"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Trepak");
    expect(mount.textContent).toContain("Now playing");
    expect(mount.querySelector<HTMLButtonElement>(".suite-stop-button")?.getAttribute("aria-label")).toBe("Stop track");

    mount.querySelector<HTMLButtonElement>('[data-action="suite-stop"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Paused: Trepak");
    expect(mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.getAttribute("aria-pressed")).toBe("true");
    expect(mount.querySelector<HTMLButtonElement>(".suite-play-button")?.getAttribute("aria-label")).toBe("Play selected track");

    mount.querySelector<HTMLButtonElement>('[data-action="suite-play"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Now playing: Trepak");
    expect(mount.querySelector<HTMLButtonElement>('[data-suite-track="theme-4"]')?.getAttribute("aria-pressed")).toBe("true");
  });

  it("renders route map as a full desktop control panel", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    expect(mount.querySelectorAll(".route-list .route-button").length).toBeGreaterThan(18);
    expect(mount.querySelector(".route-panel .progress-panel")).not.toBeNull();
  });

  it("opens Nutcracker song doors from the chooser and previews recovered tracks", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.disabled).toBe(false);
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.disabled).toBe(true);
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.dataset.doorState).toBe("ready");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.dataset.doorState).toBe("locked");
    expect(mount.querySelector<HTMLElement>(".nutcracker-door-card")?.dataset.sourcePlacement).toContain("nutchooser.swf m1");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.textContent?.trim()).toBe("");

    mount.querySelector<HTMLButtonElement>('[data-nutcracker-preview="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.textContent).toContain("Dance of the Sugar Plum Fairy");
    expect(mount.textContent).toContain("Track 1");
    expect(mount.textContent).toContain("Start 10.9s");
    expect(mount.textContent).toContain("Listen to the original song and find  4 correct instruments.");
    expect(mount.querySelector<HTMLImageElement>(".song-source-frame")?.src).toContain("song-game-render");
    expect(mount.textContent).toContain("HINT");
    expect(mount.textContent).toContain("LISTEN");
    expect(mount.textContent).toContain("EXIT");
    const hintButton = mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]');
    expect(hintButton?.dataset.songAction).toBe("hint-song");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.textContent).toContain("CHANGE");
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="hintButton"] img')?.src).toContain(
      "song-change-song-label",
    );
    mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain('press "Yes" to change this song or "No" to cancel');
    expect(mount.querySelector<HTMLImageElement>(".source-alert-yes img")?.src).toContain("song-yes-label");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-no img")?.src).toContain("song-no-label");
    mount.querySelector<HTMLButtonElement>(".source-alert-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).not.toContain('press "Yes" to change this song or "No" to cancel');
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')).not.toBeNull();
    expect(mount.querySelector('[data-source-control="helpButton"] .source-control-help')?.textContent).toBe("HINT");
    expect(mount.querySelector('[data-source-control="hintButton"] .source-control-help')?.textContent).toBe(
      "SELECT A DIFFERENT SONG",
    );
    expect(mount.querySelector('[data-source-control="listenSong"] .source-control-help')?.textContent).toBe("QUIT THE GAME");
    hintButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain("All songs are played by 4 instruments!");
    expect(mount.textContent).not.toContain("Test");
    expect(mount.textContent).not.toContain("Correct arrangement");
    expect(mount.textContent).toContain("Song doors");
  });

  it("renders recovered JPEG3 scenery on source-backed Nutcracker song scenes", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway")?.src).toContain("chooser-hallway");

    mount.querySelector<HTMLButtonElement>('[data-route="song-2"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".song-source-scenery-2-1")?.src).toContain("song2-scenery");
    expect(mount.textContent).not.toContain("Test");
  });

  it("shows selected Nutcracker instruments as source-extracted stage actors", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="song-1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const instrumentButton = mount.querySelector<HTMLButtonElement>('[data-song-id="1"][data-song-track="1"]');

    expect(instrumentButton?.getAttribute("draggable")).toBe("true");
    expect(instrumentButton?.getAttribute("aria-label")).toContain("double click or drag onto the stage");

    instrumentButton?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.src).toContain("song1-track1-actor");
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-1")?.dataset.sourceAnimation).toBe(
      "games/nutcrackergame/song1/characters/anim1.swf",
    );
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceHelp).toBe("BASS");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourcePlacement).toContain("instIMG1");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceVectorBounds).toContain("shape id 0172");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-4")?.dataset.sourcePlacement).toContain("instIMG4");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-4")?.dataset.sourceHitRect).toBe("246,334,154,44");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-7 .source-track-help")?.textContent).toBe("DRUM");

    mount.querySelector<HTMLButtonElement>('[data-route="song-5"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount
      .querySelector<HTMLButtonElement>('[data-song-id="5"][data-song-track="7"]')
      ?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-song-5.source-selected-actor-7")?.src).toContain(
      "song5-track7-actor",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-selected-actor-song-5.source-selected-actor-7")?.dataset.sourceAnimation).toBe(
      "games/nutcrackergame/song5/characters/anim7.swf",
    );
  });

  it("checks each Nutcracker song game and unlocks the first progress key after all doors", () => {
    const mount = document.createElement("main");

    createTestShell(mount);

    nutcrackerSongGames.forEach((song) => {
      mount.querySelector<HTMLButtonElement>(`[data-route="${song.routeId}"]`)?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      getCorrectNutcrackerTrackNumbers(song).forEach((trackNumber) => {
        mount
          .querySelector<HTMLButtonElement>(`[data-song-id="${song.id}"][data-song-track="${trackNumber}"]`)
          ?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
      });

      expect(mount.textContent).toContain("ok");
      expect(mount.textContent).toContain("PLAY AGAIN");
    });

    expect(mount.textContent).toContain("Game keys1/9");
    expect(mount.textContent).toContain("Song doors");
    expect(mount.textContent).toContain("8/8");
  });

  it("marks the next Nutcracker door ready after clearing a song", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="song-1"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    getCorrectNutcrackerTrackNumbers(nutcrackerSongGames[0]).forEach((trackNumber) => {
      mount
        .querySelector<HTMLButtonElement>(`[data-song-id="1"][data-song-track="${trackNumber}"]`)
        ?.dispatchEvent(new MouseEvent("dblclick", { bubbles: true }));
    });
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.dataset.doorState).toBe("cleared");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.dataset.doorState).toBe("ready");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="2"]')?.disabled).toBe(false);
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="3"]')?.disabled).toBe(true);
  });

  it("uses real local image assets for reading activities", () => {
    const pages = readingActivities.flatMap((activity) => activity.pages);

    pages.forEach((page) => {
      expect(publicAssetSize(page.imagePath)).toBeGreaterThan(1000);
    });
  });

  it("uses the SWF frame-derived Musictionary sound mapping", () => {
    const expectedSourceAssetIds = new Map([
      ["flute", 149],
      ["oboe", 267],
      ["clarinet", 305],
      ["bassoon", 342],
      ["saxophone", 390],
      ["harp", 422],
      ["piano", 454],
      ["vibraphone", 490],
      ["timpani", 527],
      ["cymbals", 551],
      ["double-bass", 601],
      ["cello", 631],
      ["violin", 677],
      ["viola", 705],
      ["trumpet", 741],
      ["trombone", 781],
      ["french-horn", 813],
      ["tuba", 854],
    ]);

    dictionaryInstruments.forEach((instrument) => {
      const expectedAssetId = expectedSourceAssetIds.get(instrument.id);
      expect(instrument.sourceAssetId).toBe(expectedAssetId);
      expect(instrument.audioPath).toBe(`/local-media/audio/activities/musictionary/${expectedAssetId}.mp3`);
    });
  });
});
