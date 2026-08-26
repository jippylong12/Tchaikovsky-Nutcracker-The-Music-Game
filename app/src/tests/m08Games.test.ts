import { describe, expect, it } from "vitest";
import {
  alicePuzzleIsCorrect,
  childrensAlbumSongs,
  isChildrensAlbumSelectionCorrect,
  isLoopySelectionCorrect,
  loopyTunes,
  nutHouseCorrectMirror,
  orchestraInstruments,
  toySoldierCorrectNotes,
  toySoldiersAreCorrect,
} from "../data/m08Games";

describe("M08 recovered game rules", () => {
  it("parses all eight Children's Album source bit patterns", () => {
    expect(childrensAlbumSongs).toHaveLength(8);
    expect(childrensAlbumSongs.map((song) => song.pattern.filter(Boolean).length)).toEqual([4, 4, 4, 4, 4, 4, 4, 4]);
    expect(isChildrensAlbumSelectionCorrect(childrensAlbumSongs[0], [1, 3, 6, 7])).toBe(true);
    expect(isChildrensAlbumSelectionCorrect(childrensAlbumSongs[0], [1, 2, 3, 6])).toBe(false);
  });

  it("keeps the source Loopy Tunes eight-track and four-good-loop rule", () => {
    expect(loopyTunes).toHaveLength(8);
    expect(isLoopySelectionCorrect(loopyTunes[0], [1, 3, 5, 7])).toBe(true);
    expect(isLoopySelectionCorrect(loopyTunes[7], [2, 4, 6, 8])).toBe(false);
  });

  it("locks the orchestra, soldier, Alice, and Nut House source counts", () => {
    expect(orchestraInstruments).toHaveLength(18);
    expect(toySoldierCorrectNotes).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(toySoldiersAreCorrect([1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
    expect(alicePuzzleIsCorrect([1, 1, 1])).toBe(true);
    expect(alicePuzzleIsCorrect([1, 2, 1])).toBe(false);
    expect(Array.from({ length: 8 }, (_, index) => nutHouseCorrectMirror(index + 11))).toEqual([8, 3, 1, 7, 6, 4, 5, 2]);
  });
});
