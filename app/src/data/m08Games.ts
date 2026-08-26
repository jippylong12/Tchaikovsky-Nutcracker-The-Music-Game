import type { DoorKey } from "../state/progressStore";

export type ChildrensAlbumSong = {
  readonly id: DoorKey;
  readonly title: string;
  readonly pattern: readonly boolean[];
};

const childrensAlbumPatterns = [
  "10100110",
  "11001001",
  "10010110",
  "00101011",
  "11000101",
  "00111010",
  "11000110",
  "01011100",
] as const;

const childrensAlbumTitles = [
  "NEAPOLITAN SONG",
  "MAZURKA",
  "POLKA",
  "GERMAN SONG",
  "FRENCH SONG",
  "ITALIAN SONG",
  "RUSSIAN SONG",
  "WALTZ",
] as const;

export const childrensAlbumSongs: readonly ChildrensAlbumSong[] = childrensAlbumPatterns.map((pattern, index) => ({
  id: (index + 1) as DoorKey,
  title: childrensAlbumTitles[index],
  pattern: [...pattern].map((value) => value === "1"),
}));

export function isChildrensAlbumSelectionCorrect(song: ChildrensAlbumSong, selections: readonly number[]): boolean {
  const expected = song.pattern
    .map((selected, index) => (selected ? index + 1 : 0))
    .filter((index) => index > 0);
  return [...new Set(selections)].sort((left, right) => left - right).join(",") === expected.join(",");
}

export const childrensAlbumInstrumentLabels = [
  "CELLO",
  "VIOLIN",
  "TRUMPET",
  "FLUTE",
  "HARP",
  "PIANO",
  "OBOE",
  "DRUM",
] as const;

export type LoopyTune = {
  readonly id: DoorKey;
  readonly correctTracks: readonly number[];
};

export const loopyTunes: readonly LoopyTune[] = Array.from({ length: 8 }, (_, index) => ({
  id: (index + 1) as DoorKey,
  correctTracks: [1, 3, 5, 7],
}));

export function isLoopySelectionCorrect(tune: LoopyTune, selections: readonly number[]): boolean {
  return [...new Set(selections)].sort((left, right) => left - right).join(",") === tune.correctTracks.join(",");
}

export const orchestraInstruments = [
  "OBOE",
  "BASSOON",
  "SAXOPHONE",
  "HARP",
  "PIANO",
  "VIBRAPHONE",
  "CYMBALS",
  "TIMPANI",
  "BASS",
  "CELLO",
  "VIOLIN",
  "VIOLA",
  "TRUMPET",
  "TROMBONE",
  "TUBA",
  "FRENCH HORN",
  "CLARINET",
  "FLUTE",
] as const;

export const toySoldierCorrectNotes = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function toySoldiersAreCorrect(notes: readonly number[]): boolean {
  return toySoldierCorrectNotes.every((note, index) => notes[index] === note);
}

export const alicePuzzleIds = Array.from({ length: 12 }, (_, index) => index + 1);
export const alicePuzzleSolution = [1, 1, 1] as const;

export function alicePuzzleIsCorrect(values: readonly number[]): boolean {
  return alicePuzzleSolution.every((value, index) => values[index] === value);
}

export const nutHouseCorrectMirrors = [8, 3, 1, 7, 6, 4, 5, 2] as const;

export function nutHouseCorrectMirror(room: number): number {
  const roomIndex = Math.min(Math.max(room - 11, 0), nutHouseCorrectMirrors.length - 1);
  return nutHouseCorrectMirrors[roomIndex];
}
