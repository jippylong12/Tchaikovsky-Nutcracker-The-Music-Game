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

// Every loop SWF exports `all` as DefineSound 1, then loop8..loop0 as ids 2..10.
// Runtime track numbers are the source `myTrack1`..`myTrack8` names, so raw ids
// must be translated instead of treated as matching semantic track numbers.
export function loopyTrackSoundId(track: number): number {
  if (!Number.isInteger(track) || track < 1 || track > 8) {
    throw new RangeError(`Loopy track must be an integer from 1 through 8; received ${track}`);
  }
  return 10 - track;
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

// orchestra.swf attaches semantic sounds s1..s18 to inst1..inst18. The
// EXPORTASSETS table stores those sounds under this non-sequential id order.
export const orchestraInstrumentSoundIds = [17, 11, 14, 19, 8, 13, 9, 3, 15, 7, 16, 18, 1, 2, 5, 6, 12, 4] as const;
export const orchestraBadSoundId = 10;
export const orchestraWinSoundId = 838;

export function orchestraInstrumentSoundId(instrument: number): number {
  const soundId = orchestraInstrumentSoundIds[instrument - 1];
  if (!Number.isInteger(instrument) || soundId === undefined) {
    throw new RangeError(`Orchestra instrument must be an integer from 1 through 18; received ${instrument}`);
  }
  return soundId;
}

export function chooseOrchestraPrompt(
  completedInstrumentIds: readonly number[],
  randomValue: number,
): number | null {
  const completed = new Set(completedInstrumentIds);
  const normalizedRandom = Number.isFinite(randomValue)
    ? Math.min(Math.max(randomValue, 0), 1 - Number.EPSILON)
    : 0;
  const startingInstrument = Math.floor(normalizedRandom * orchestraInstruments.length) + 1;
  for (let offset = 0; offset < orchestraInstruments.length; offset += 1) {
    const candidate = ((startingInstrument - 1 + offset) % orchestraInstruments.length) + 1;
    if (!completed.has(candidate)) return candidate;
  }
  return null;
}

export const toySoldierCorrectNotes = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export function toySoldiersAreCorrect(notes: readonly number[]): boolean {
  return notes.length === toySoldierCorrectNotes.length
    && toySoldierCorrectNotes.every((note, index) => notes[index] === note);
}

export const alicePuzzleIds = Array.from({ length: 12 }, (_, index) => index + 1);
export const alicePuzzleSolution = [1, 1, 1] as const;

export function alicePuzzleIsCorrect(values: readonly number[]): boolean {
  return values.length === alicePuzzleSolution.length
    && alicePuzzleSolution.every((value, index) => values[index] === value);
}

export const nutHouseCorrectMirrors = [8, 3, 1, 7, 6, 4, 5, 2] as const;

export function nutHouseCorrectMirror(room: number): number {
  const roomIndex = Math.min(Math.max(room - 11, 0), nutHouseCorrectMirrors.length - 1);
  return nutHouseCorrectMirrors[roomIndex];
}

export type NutHouseSoundMap = {
  readonly room: number;
  readonly mirrorSoundIds: readonly number[];
  readonly badGuessSoundId: number;
  readonly youWinSoundId: number;
};

export const nutHouseSoundMaps: readonly NutHouseSoundMap[] = [
  { room: 11, mirrorSoundIds: [9, 8, 7, 6, 5, 4, 3, 2], badGuessSoundId: 10, youWinSoundId: 1 },
  { room: 12, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
  { room: 13, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
  { room: 14, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
  { room: 15, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
  { room: 16, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
  { room: 17, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
  { room: 18, mirrorSoundIds: [10, 9, 8, 7, 5, 2, 1, 4], badGuessSoundId: 6, youWinSoundId: 3 },
] as const;

export function getNutHouseSoundMap(room: number): NutHouseSoundMap {
  const soundMap = nutHouseSoundMaps.find((candidate) => candidate.room === room);
  if (!soundMap) throw new RangeError(`Nut House room must be 11 through 18; received ${room}`);
  return soundMap;
}

export function nutHouseMirrorSoundId(room: number, mirror: number): number {
  const soundId = getNutHouseSoundMap(room).mirrorSoundIds[mirror - 1];
  if (!Number.isInteger(mirror) || soundId === undefined) {
    throw new RangeError(`Nut House mirror must be an integer from 1 through 8; received ${mirror}`);
  }
  return soundId;
}
