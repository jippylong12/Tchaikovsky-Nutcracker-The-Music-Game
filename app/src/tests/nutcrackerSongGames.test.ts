import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getCorrectNutcrackerTrackNumbers,
  getNutcrackerTrackStartSeconds,
  nutcrackerSongGames,
  parseTrackInfoText,
  type NutcrackerSongId,
} from "../data/nutcrackerSongGames";

const currentDir = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(currentDir, "../../public");
const sourceAssetRoot = join(currentDir, "../assets/nutcracker-source");
const sourceStyles = readFileSync(join(currentDir, "../styles.css"), "utf8");

function cssDeclarations(selector: string): Record<string, string> {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const rule = sourceStyles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`));
  if (!rule) throw new Error(`Missing CSS rule for ${selector}`);

  return Object.fromEntries(
    [...rule[1].matchAll(/([\w-]+)\s*:\s*([^;]+);/g)].map((declaration) => [
      declaration[1],
      declaration[2].trim(),
    ]),
  );
}

describe("Nutcracker song game data", () => {
  it("locks every actor-free source-runtime song frame", () => {
    const expectedHashes = [
      "f3c9a7fd690b55c7933f7cb3b8ea0a4dbf959df77740106a60ea40af31b497c5",
      "898d8dc9516d1886bb0d60bc351963bee74b8a814f6b61da7c394a1c063a8a8b",
      "f63e4d256fc205adf0e94bbd2fb6269a4306d15b62d69cee70bb8c4f310c105a",
      "57a15ace6e384bb85fe8c0b12150ef3cf9ce0e25e43c75bc5091b02604066120",
      "19350ffb277cb9c969cf9dcebbce40d9aae614d153d00b27378b08d753be533b",
      "8a5e4bb6f79993b9dd322d5dc537ebf0784b907e7cdafd9ba23bd5fe462f528f",
      "5c190b0c90c03517e82613df1aeda24ed600bd98ba926de809aadddd89bd50d4",
      "a34af8caaf1fd8cbe0066b01cd615a7d9175863ce90f8081b487c6b0011c4145",
    ];

    expectedHashes.forEach((expectedHash, index) => {
      const songFrame = readFileSync(join(sourceAssetRoot, `song${index + 1}-source-interactive.png`));

      expect(createHash("sha256").update(songFrame).digest("hex")).toBe(expectedHash);
    });
  });

  it("keeps the five song controls on their recovered source hit rectangles", () => {
    expect(cssDeclarations(".source-song-actions .source-song-change-button")).toMatchObject({
      left: "57.82px",
      top: "136.05px",
      width: "56.73px",
      height: "43.23px",
    });
    expect(cssDeclarations(".source-song-actions .source-song-listen-button")).toMatchObject({
      left: "52.18px",
      top: "235.59px",
      width: "64.39px",
      height: "43.13px",
    });
    expect(cssDeclarations(".source-song-actions .source-song-help-button")).toMatchObject({
      left: "532.13px",
      top: "141.95px",
      width: "51.98px",
      height: "38.48px",
    });
    expect(cssDeclarations(".source-song-actions .source-song-hint-button")).toMatchObject({
      left: "532.76px",
      top: "240.75px",
      width: "51.96px",
      height: "38.21px",
    });
    expect(cssDeclarations(".source-song-actions .source-song-exit-button")).toMatchObject({
      left: "549.72px",
      top: "449.05px",
      width: "72.36px",
      height: "46.89px",
    });
  });

  it("locks the complete recovered normal chooser frame", () => {
    const chooserFrame = readFileSync(join(sourceAssetRoot, "nutchooser-source-normal.png"));

    expect(createHash("sha256").update(chooserFrame).digest("hex")).toBe(
      "969c1b97245244a589b5480f802a6bc9d732e23ba1bb0f97867f23c341e2c390",
    );
  });

  it("locks the source-local opened-door crop", () => {
    const openedDoor = readFileSync(join(sourceAssetRoot, "chooser-open-door.png"));

    expect(createHash("sha256").update(openedDoor).digest("hex")).toBe(
      "6145ebfc7db5002496463222057d950c77a6cabc6f7d0b04d72bf4e4eab293df",
    );
  });

  it("prevents generic button chrome from covering the recovered chooser", () => {
    expect(cssDeclarations(".nutcracker-chooser .nutcracker-door-button:disabled")).toMatchObject({
      border: "0",
      background: "transparent",
    });
    expect(cssDeclarations(".chooser-source-controls .chooser-source-exit-button")).toMatchObject({
      border: "0",
      background: "transparent",
      "box-shadow": "none",
    });
  });

  it("matches all recovered trackinfo.txt validity and first-frame data", () => {
    nutcrackerSongGames.forEach((song) => {
      const trackInfoPath = join(publicRoot, "local-media/text", song.sourcePath);
      const parsedTracks = parseTrackInfoText(readFileSync(trackInfoPath, "utf8"), song.id);

      expect(parsedTracks).toEqual(song.tracks);
      expect(song.tracks).toHaveLength(8);
    });
  });

  it("preserves the recovered correct track lists for all eight songs", () => {
    const expectedCorrectTracks = new Map<NutcrackerSongId, readonly number[]>([
      [1, [1, 2, 5, 8]],
      [2, [1, 2, 3, 6]],
      [3, [3, 4, 6, 8]],
      [4, [4, 6, 7, 8]],
      [5, [2, 4, 5, 7]],
      [6, [2, 4, 6, 7]],
      [7, [1, 4, 5, 6]],
      [8, [1, 2, 4, 6]],
    ]);

    nutcrackerSongGames.forEach((song) => {
      expect(getCorrectNutcrackerTrackNumbers(song)).toEqual(expectedCorrectTracks.get(song.id));
    });
  });

  it("points each track to an extracted local MP3 stream", () => {
    nutcrackerSongGames.forEach((song) => {
      song.tracks.forEach((track) => {
        expect(track.audioPath).toBe(`/local-media/audio/games/nutcrackergame/song${song.id}/track${track.number}.mp3`);
        expect(statSync(join(publicRoot, track.audioPath)).size).toBeGreaterThan(1000);
      });
    });
  });

  it("uses source-audio silence detection for preview start offsets", () => {
    const sugarPlum = nutcrackerSongGames[0];
    const vibraphone = sugarPlum.tracks.find((track) => track.number === 5);
    const saxophone = sugarPlum.tracks.find((track) => track.number === 8);
    const waltz = nutcrackerSongGames[7];
    const violin = waltz.tracks.find((track) => track.number === 2);

    expect(vibraphone ? getNutcrackerTrackStartSeconds(vibraphone) : null).toBeCloseTo(10.9, 1);
    expect(saxophone ? getNutcrackerTrackStartSeconds(saxophone) : null).toBeCloseTo(19.3, 1);
    expect(violin?.firstFrame).toBe(559);
    expect(violin ? getNutcrackerTrackStartSeconds(violin) : null).toBeCloseTo(0.6, 1);
  });

  it("keeps every selected actor tied to its per-song SWF and documented playback limit", () => {
    nutcrackerSongGames.forEach((song) => {
      song.tracks.forEach((track) => {
        expect(track.actorSourcePath).toBe(`games/nutcrackergame/song${song.id}/characters/anim${track.number}.swf`);
        expect(track.actorPlayback).toBe("documented source-derived fallback");
        expect(track.actorFallbackReason).toContain("no frame selector");
        expect(track.actorFallbackReason).toContain("extracted later frames can crash");
        expect(track.imagePath).toContain(`song${song.id}-track${track.number}-actor`);
      });
    });
  });
});
