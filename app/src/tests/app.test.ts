import { describe, expect, it } from "vitest";
import { createAppShell } from "../app";
import { createAudioService, type AudioElementLike } from "../audio/audioService";
import { getCorrectNutcrackerTrackNumbers, nutcrackerSongGames } from "../data/nutcrackerSongGames";
import { dictionaryInstruments, readingActivities } from "../data/referenceContent";
import {
  createProgressStore,
  progressStorageKey,
  type ProgressPersistence,
  type ProgressStoreController,
} from "../state/progressStore";
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

function createTestShell(mount: HTMLElement, configureProgress?: (progress: ProgressStoreController) => void): void {
  const progress = createProgressStore(createMemoryPersistence());
  configureProgress?.(progress);
  createAppShell(mount, {
    progress,
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
    expect(mount.querySelector<HTMLElement>(".nutcracker-door-card")?.dataset.sourceAction).toContain(
      "sets this._visible",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-fill")?.src).toContain(
      "chooser-hallway-fill",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-fill")?.dataset.sourcePlacement).toContain(
      "shape id 0016",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-fill")?.dataset.sourceImage).toContain(
      "shape id 0016 rendered",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-vector")?.src).toContain(
      "chooser-hallway-vector",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-portal")?.src).toContain(
      "chooser-hallway-portal-cxform",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-portal")?.dataset.sourcePlacement).toContain(
      "shape id 0017",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-portal")?.dataset.sourceImage).toContain(
      "CXForm add 143 60 -10 0",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-vector")?.dataset.sourcePlacement).toContain(
      "shape id 0018",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-vector")?.dataset.sourceImage).toContain(
      "full sprite id 0021 still blocked",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-tint")?.src).toContain(
      "chooser-hallway-tint-cxform",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-tint")?.dataset.sourcePlacement).toContain(
      "shape id 0020",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-tint")?.dataset.sourceImage).toContain(
      "CXForm mul 0 0 0 1 add 255 51 153 0",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-frame-art")?.dataset.sourcePlacement).toContain(
      "id 0034 depth 0055",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-instruments")?.dataset.sourcePlacement).toContain(
      "id 0068 depth 0069",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-instruments")?.src).toContain(
      "chooser-instruments-cxform",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-instruments")?.dataset.sourceImage).toContain(
      "CXForm add -209 -153 134 -223",
    );
    expect(mount.querySelector(".source-scene-actions")).toBeNull();
    expect(mount.querySelector(".scene-footer")).toBeNull();
    expect(mount.querySelector(".source-control-help")).toBeNull();
    expect(mount.querySelector(".chooser-source-controls")).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourcePlacement).toContain(
      "nutchooser.swf helpButton",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceState).toContain(
      "buttonON places button id 0200",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceImage).toContain(
      "shape id 0201",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.getAttribute("class")).toContain(
      "chooser-source-help-button",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceHelp).toBe("Help");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dataset.sourceHelpFrame).toBe(
      "4",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.closest(".nutcracker-chooser")).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourcePlacement).toContain(
      "nutchooser.swf quiter",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceState).toContain(
      "shape id 0205",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceImage).toContain(
      "shape id 0205",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceImage).toContain(
      "text id 0204",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceImage).toContain(
      "text id 0203 is the blue buttonOFF label",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceHelp).toBe(
      "Quit the Game",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dataset.sourceHelpFrame).toBe("3");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.closest(".nutcracker-chooser")).not.toBeNull();
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceControl).toBe("chooser-helpme-fallback");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourcePlacement).toContain(
      "nutchooser.swf button ids 0200 and 0206",
    );
    expect(mount.querySelector<HTMLImageElement>(".chooser-door-art")?.dataset.sourceImage).toContain(
      "no modern hover glow",
    );
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="helpButton"] img')?.src).toContain(
      "chooser-help-button-art",
    );
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="quiter"] .chooser-exit-button-art')?.src).toContain(
      "chooser-exit-button-art",
    );
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="quiter"] .chooser-exit-label-art')?.src).toContain(
      "chooser-exit-label",
    );
    const hiddenMagicKey = mount.querySelector<HTMLImageElement>(".nutcracker-chooser-magic-key");
    expect(hiddenMagicKey?.src).toContain("chooser-magic-key");
    expect(hiddenMagicKey?.hidden).toBe(true);
    expect(hiddenMagicKey?.dataset.sourceVisible).toBe("false");
    expect(hiddenMagicKey?.dataset.sourcePlacement).toContain("sprite id 0213 at depth 0175");
    expect(hiddenMagicKey?.dataset.sourceAction).toContain("nutDoorsVisited equals 8");
    expect(hiddenMagicKey?.dataset.sourceImage).toContain("swfcombine wrapper");
    mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-4 .source-flying-help-text-fill")?.textContent).toBe(
      "Help",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFrame).toBe("4");
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')?.textContent?.trim()).toBe("");
    mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const chooserHelp = mount.querySelector<HTMLElement>(".source-chooser-help-modal");
    expect(chooserHelp).not.toBeNull();
    expect(chooserHelp?.dataset.sourceFrame).toBe("nutchooser.swf helpframe");
    expect(chooserHelp?.dataset.sourcePlacement).toContain("sprite id 0170");
    expect(chooserHelp?.dataset.sourcePlacement).toContain("noAction id 0171");
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-help-modal img")?.src).toContain(
      "nutchooser-frame-source",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-helpframe-talker")?.src).toContain(
      "chooser-helpframe-talker",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-helpframe-talker")?.dataset.sourceImage).toContain(
      "sprite id 0169",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-helpframe-talker")?.dataset.sourceImage).toContain(
      "translated wrapper x 150 y 120",
    );
    expect(mount.querySelector<HTMLParagraphElement>(".source-chooser-help-modal p")?.classList.contains("sr-only")).toBe(
      true,
    );
    expect(mount.querySelector(".source-chooser-help-modal h2")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const chooserWarning = mount.querySelector<HTMLElement>(".source-chooser-warning-modal");
    expect(chooserWarning).not.toBeNull();
    expect(chooserWarning?.dataset.sourceFrame).toBe("nutchooser.swf warningFrame");
    expect(chooserWarning?.dataset.sourcePlacement).toContain("sprite id 0177");
    expect(chooserWarning?.dataset.sourcePlacement).toContain("YES button id 0183");
    expect(chooserWarning?.dataset.sourcePlacement).toContain("NO button id 0188");
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-warningframe-talker")?.src).toContain(
      "chooser-warningframe-talker",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-chooser-warningframe-talker")?.dataset.sourceImage).toContain(
      "sprite id 0177",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-yes")?.dataset.sourceBody).toContain("shape id 0179");
    expect(mount.querySelector<HTMLImageElement>(".source-warning-yes .source-warning-button-body")?.src).toContain(
      "chooser-warning-yes-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-warning-yes .source-warning-button-label")?.src).toContain(
      "chooser-warning-yes-label",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-yes")?.dataset.sourceAction).toContain("comeAgain");
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-no")?.dataset.sourceBody).toContain("shape id 0184");
    expect(mount.querySelector<HTMLImageElement>(".source-warning-no .source-warning-button-body")?.src).toContain(
      "chooser-warning-no-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-warning-no .source-warning-button-label")?.src).toContain(
      "chooser-warning-no-label",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-warning-no")?.dataset.sourceAction).toContain(
      "quiter to buttonON",
    );
    mount.querySelector<HTMLButtonElement>(".source-warning-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector(".source-chooser-warning-modal")).toBeNull();
    mount.querySelector<HTMLButtonElement>('[data-source-control="quiter"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>(".source-warning-yes")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain("Main Menu");
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

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
    expect(hintButton?.dataset.sourceBody).toContain("shape id 0119");
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="helpButton"] .source-button-body')?.src).toContain(
      "song-control-help-body",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.textContent).toContain("CHANGE");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.dataset.sourceBody).toContain(
      "shape id 0126",
    );
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="hintButton"] .source-button-body')?.src).toContain(
      "song-control-button-body",
    );
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="hintButton"] .source-button-label')?.src).toContain(
      "song-change-song-label",
    );
    mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain('press "Yes" to change this song or "No" to cancel');
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-fill")?.src).toContain("song-curtain-fill");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-fill")?.dataset.sourceImage).toContain(
      "shape id 0038",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-curve")?.src).toContain(
      "song-curtain-curve-cxform",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-curve")?.dataset.sourceImage).toContain(
      "shape id 0040",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-stars")?.src).toContain("song-curtain-stars");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-curtain-stars")?.dataset.sourceImage).toContain(
      "shape id 0041",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-alert-yes img")?.src).toContain("song-yes-label");
    expect(mount.querySelector<HTMLImageElement>(".source-alert-no img")?.src).toContain("song-no-label");
    mount.querySelector<HTMLButtonElement>(".source-alert-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).not.toContain('press "Yes" to change this song or "No" to cancel');
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')).not.toBeNull();
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')?.dataset.sourceBody).toContain(
      "shape id 0126",
    );
    expect(mount.querySelector<HTMLImageElement>('[data-source-control="songChooser"] .source-button-body')?.src).toContain(
      "song-control-button-body",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="songChooser"]')?.dataset.sourceHelp).toBe(
      "Listen to the Original Music",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="hintButton"]')?.dataset.sourceHelp).toBe(
      "Select a\ndifferent\nsong",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dataset.sourceHelp).toBe("Quit the Game");
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dataset.sourceBody).toContain(
      "shape id 0126",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dataset.songAction).toBe(
      "confirm-exit-song",
    );
    expect(mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dataset.sourceAction).toContain(
      "warningFrame",
    );
    mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    const songWarning = mount.querySelector<HTMLElement>(".source-song-warning-modal");
    expect(songWarning).not.toBeNull();
    expect(songWarning?.dataset.sourceFrame).toBe("song1/song.swf warningFrame");
    expect(songWarning?.dataset.sourcePlacement).toContain("sprite id 0340");
    expect(songWarning?.dataset.sourcePlacement).toContain("YES button id 0346");
    expect(songWarning?.dataset.sourcePlacement).toContain("NO button id 0351");
    expect(mount.querySelector<HTMLImageElement>(".source-song-warningframe-talker")?.src).toContain(
      "song-warningframe-talker",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-song-warning-yes")?.dataset.sourceBody).toContain(
      "shape id 0344",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-yes .source-warning-button-body")?.src).toContain(
      "song-warning-yes-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-yes .source-warning-button-label")?.src).toContain(
      "song-warning-yes-label",
    );
    expect(mount.querySelector<HTMLButtonElement>(".source-song-warning-no")?.dataset.sourceBody).toContain(
      "shape id 0349",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-no .source-warning-button-body")?.src).toContain(
      "song-warning-no-body",
    );
    expect(mount.querySelector<HTMLImageElement>(".source-song-warning-no .source-warning-button-label")?.src).toContain(
      "song-warning-no-label",
    );
    mount.querySelector<HTMLButtonElement>(".source-song-warning-no")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector(".source-song-warning-modal")).toBeNull();
    expect(mount.textContent).toContain("Dance of the Sugar Plum Fairy");
    const refreshedHintButton = mount.querySelector<HTMLButtonElement>('[data-source-control="helpButton"]');
    refreshedHintButton?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-4 .source-flying-help-text-fill")?.textContent).toBe(
      "Hint",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFrame).toBe("4");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceBounds).toContain("sprite id 0240");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceLayerModel).toContain(
      "edit ids 0237/0238",
    );
    refreshedHintButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.textContent).toContain("All songs are played by 4 instruments!");
    expect(mount.querySelector<HTMLElement>(".source-hint-alert")?.dataset.sourceFrame).toBe(
      "song1/song.swf courtain giveHint",
    );
    expect(mount.querySelector<HTMLElement>(".source-hint-alert")?.dataset.sourcePlacement).toContain(
      "_root.message edit id 0058",
    );
    mount.querySelector<HTMLButtonElement>('[data-source-control="listenSong"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    mount.querySelector<HTMLButtonElement>(".source-song-warning-yes")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mount.querySelector<HTMLButtonElement>('[data-nutcracker-door="1"]')).not.toBeNull();
    expect(mount.textContent).not.toContain("Test");
    expect(mount.textContent).not.toContain("Correct arrangement");
    expect(mount.textContent).toContain("Song doors");
  });

  it("shows the source magic key only after all Nutcracker doors are complete", () => {
    const mount = document.createElement("main");

    createTestShell(mount, (progress) => {
      nutcrackerSongGames.forEach((song) => {
        progress.markNutDoor(song.id);
      });
    });
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    const magicKey = mount.querySelector<HTMLImageElement>(".nutcracker-chooser-magic-key");
    expect(magicKey?.hidden).toBe(false);
    expect(magicKey?.dataset.sourceVisible).toBe("true");
    expect(magicKey?.src).toContain("chooser-magic-key");
  });

  it("renders recovered JPEG3 scenery on source-backed Nutcracker song scenes", () => {
    const mount = document.createElement("main");

    createTestShell(mount);
    mount.querySelector<HTMLButtonElement>('[data-route="nutcracker-chooser"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-fill")?.src).toContain(
      "chooser-hallway-fill",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-vector")?.src).toContain(
      "chooser-hallway-vector",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-portal")?.src).toContain(
      "chooser-hallway-portal-cxform",
    );
    expect(mount.querySelector<HTMLImageElement>(".nutcracker-chooser-hallway-tint")?.src).toContain(
      "chooser-hallway-tint-cxform",
    );

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
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceHelpFrame).toBe("2");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourcePlacement).toContain("instIMG1");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-1")?.dataset.sourceVectorBounds).toContain("shape id 0172");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-4")?.dataset.sourcePlacement).toContain("instIMG4");
    expect(mount.querySelector<HTMLElement>(".source-track-hotspot-4")?.dataset.sourceHitRect).toBe("246,334,154,44");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceControl).toBe("flyinghelp");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourcePlacement).toContain("id 0257 depth 0306");
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceBounds).toContain("frames 2/3");
    expect(mount.querySelectorAll(".source-flying-help-frame-2 .source-flying-help-text")).toHaveLength(3);
    expect(mount.querySelectorAll(".source-flying-help-frame-4 .source-flying-help-text")).toHaveLength(2);
    mount
      .querySelector<HTMLButtonElement>('[data-song-id="1"][data-song-track="7"]')
      ?.dispatchEvent(new FocusEvent("focus", { bubbles: false }));
    expect(mount.querySelector<HTMLElement>(".source-flying-help-frame-2 .source-flying-help-text-fill")?.textContent).toBe(
      "DRUM",
    );
    expect(mount.querySelector<HTMLElement>(".source-flying-help")?.dataset.sourceFrame).toBe("2");

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

      expect(mount.textContent).toContain("Door cleared.");
      expect(mount.querySelector(".source-hint-alert")).toBeNull();
      expect(mount.textContent).toContain("PLAY AGAIN");
      expect(mount.querySelector<HTMLElement>(".source-play-again-button")?.dataset.sourceControl).toBe("gameController");
      expect(mount.querySelector<HTMLElement>(".source-play-again-button")?.dataset.sourcePlacement).toContain(
        "id 0115 depth 0116",
      );
      expect(mount.querySelector<HTMLElement>(".source-play-again-button")?.dataset.sourceBody).toContain("shape id 0113");
      expect(mount.querySelector<HTMLImageElement>(".source-play-again-button .source-button-body")?.src).toContain(
        "song-play-again-button-body",
      );
      expect(mount.querySelector<HTMLImageElement>(".source-play-again-button .source-button-label")?.src).toContain(
        "song-play-again-label",
      );
      if (song.id === nutcrackerSongGames.length) {
        expect(mount.querySelector<HTMLElement>(".source-song-keyframe")?.dataset.sourceFrame).toBe(
          "song1/song.swf keyFrame",
        );
        expect(mount.querySelector<HTMLElement>(".source-song-keyframe")?.dataset.sourceAction).toContain(
          "saveKey1.exe",
        );
        expect(mount.querySelector<HTMLImageElement>(".source-song-keyframe img")?.src).toContain(
          "song-keyframe-talker",
        );
      } else {
        expect(mount.querySelector(".source-song-keyframe")).toBeNull();
      }
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
