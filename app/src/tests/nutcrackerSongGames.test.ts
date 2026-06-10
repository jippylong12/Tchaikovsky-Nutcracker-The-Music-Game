import { describe, expect, it } from "vitest";
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

describe("Nutcracker song game data", () => {
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

  it("converts recovered first frames into preview start offsets", () => {
    const sugarPlum = nutcrackerSongGames[0];
    const vibraphone = sugarPlum.tracks.find((track) => track.number === 5);
    const saxophone = sugarPlum.tracks.find((track) => track.number === 8);

    expect(vibraphone ? getNutcrackerTrackStartSeconds(vibraphone) : null).toBeCloseTo(10.2, 1);
    expect(saxophone ? getNutcrackerTrackStartSeconds(saxophone) : null).toBeCloseTo(18.5, 1);
  });
});
