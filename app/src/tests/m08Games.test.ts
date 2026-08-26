import { describe, expect, it } from "vitest";
import {
  alicePuzzleIsCorrect,
  chooseOrchestraPrompt,
  childrensAlbumSongs,
  isChildrensAlbumSelectionCorrect,
  isLoopySelectionCorrect,
  loopyTrackSoundId,
  loopyTunes,
  nutHouseMirrorSoundId,
  nutHouseCorrectMirror,
  nutHouseSoundMaps,
  orchestraBadSoundId,
  orchestraInstrumentSoundIds,
  orchestraWinSoundId,
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
    expect(Array.from({ length: 8 }, (_, index) => loopyTrackSoundId(index + 1))).toEqual([9, 8, 7, 6, 5, 4, 3, 2]);
  });

  it("locks the orchestra, soldier, Alice, and Nut House source counts", () => {
    expect(orchestraInstruments).toHaveLength(18);
    expect(orchestraInstrumentSoundIds).toEqual([17, 11, 14, 19, 8, 13, 9, 3, 15, 7, 16, 18, 1, 2, 5, 6, 12, 4]);
    expect(orchestraBadSoundId).toBe(10);
    expect(orchestraWinSoundId).toBe(838);
    expect(chooseOrchestraPrompt([], 0)).toBe(1);
    expect(chooseOrchestraPrompt([1, 2, 3], 0)).toBe(4);
    expect(chooseOrchestraPrompt([18], 0.999999)).toBe(1);
    expect(chooseOrchestraPrompt(Array.from({ length: 18 }, (_, index) => index + 1), 0.5)).toBeNull();
    expect(toySoldierCorrectNotes).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(toySoldiersAreCorrect([1, 2, 3, 4, 5, 6, 7, 8])).toBe(true);
    expect(toySoldiersAreCorrect([1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(false);
    expect(alicePuzzleIsCorrect([1, 1, 1])).toBe(true);
    expect(alicePuzzleIsCorrect([1, 2, 1])).toBe(false);
    expect(alicePuzzleIsCorrect([1, 1, 1, 1])).toBe(false);
    expect(Array.from({ length: 8 }, (_, index) => nutHouseCorrectMirror(index + 11))).toEqual([8, 3, 1, 7, 6, 4, 5, 2]);
    expect(nutHouseSoundMaps.map(({ badGuessSoundId }) => badGuessSoundId)).toEqual([10, 6, 6, 6, 6, 6, 6, 6]);
    expect(nutHouseSoundMaps.map(({ youWinSoundId }) => youWinSoundId)).toEqual([1, 3, 3, 3, 3, 3, 3, 3]);
    expect(Array.from({ length: 8 }, (_, index) => nutHouseMirrorSoundId(11, index + 1))).toEqual([9, 8, 7, 6, 5, 4, 3, 2]);
    expect(Array.from({ length: 8 }, (_, index) => nutHouseMirrorSoundId(12, index + 1))).toEqual([10, 9, 8, 7, 5, 2, 1, 4]);
  });
});
