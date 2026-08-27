import cannonUrl from "../assets/nutcracker-source/track7-cannon.png";
import dancerUrl from "../assets/nutcracker-source/track5-dancer.png";
import elephantUrl from "../assets/nutcracker-source/track4-elephant.png";
import horsemanUrl from "../assets/nutcracker-source/track6-horseman.png";
import mouseUrl from "../assets/nutcracker-source/track2-mouse.png";
import nutcrackerUrl from "../assets/nutcracker-source/track1-nutcracker.png";
import roundDollUrl from "../assets/nutcracker-source/track8-round-doll.png";
import trainUrl from "../assets/nutcracker-source/track3-train.png";

export type NutcrackerSongId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type NutcrackerTrackNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type NutcrackerTrack = {
  readonly number: NutcrackerTrackNumber;
  readonly instrument: string;
  readonly valid: boolean;
  readonly firstFrame: number;
  readonly previewStartSeconds: number;
  readonly character?: string;
  readonly audioPath: string;
  readonly imagePath: string;
  readonly actorSourcePath: string;
  readonly actorPlayback: "documented source-derived fallback";
  readonly actorFallbackReason: string;
};

export type NutcrackerSongGame = {
  readonly id: NutcrackerSongId;
  readonly routeId: `song-${NutcrackerSongId}`;
  readonly title: string;
  readonly sourcePath: string;
  readonly suiteTrackId: string;
  readonly tracks: readonly NutcrackerTrack[];
};

const trackNumbers = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const flashControlCharacter = String.fromCharCode(16);
const actorFallbackReason =
  "Local swfrender has no frame selector; representative full animation SWFs render transparent at frame 1 and extracted later frames can crash, so the runtime uses the per-song source bitmap with restrained source-derived motion.";
const trackImagePaths = [
  nutcrackerUrl,
  mouseUrl,
  trainUrl,
  elephantUrl,
  dancerUrl,
  horsemanUrl,
  cannonUrl,
  roundDollUrl,
] as const;
const songActorImagePaths = import.meta.glob("../assets/nutcracker-source/song*-track*-actor.png", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const audioPreviewStartSeconds: Record<NutcrackerSongId, Record<NutcrackerTrackNumber, number>> = {
  1: { 1: 0.7, 2: 1.3, 3: 0.7, 4: 0.7, 5: 10.9, 6: 0.7, 7: 0.7, 8: 19.3 },
  2: { 1: 7.5, 2: 0.7, 3: 0.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6 },
  3: { 1: 0.6, 2: 0.6, 3: 2.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6 },
  4: { 1: 0.6, 2: 0.6, 3: 0.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6 },
  5: { 1: 0.6, 2: 0.6, 3: 0.6, 4: 7.5, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6 },
  6: { 1: 0.6, 2: 9.6, 3: 0.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6 },
  7: { 1: 0.6, 2: 0.7, 3: 0.6, 4: 0.6, 5: 1.7, 6: 0.6, 7: 0.6, 8: 0.6 },
  8: { 1: 0.6, 2: 0.6, 3: 3.0, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 3.1 },
};

export const nutcrackerSongGames = [
  buildSongGame(1, "Dance of the Sugar Plum Fairy", "theme-9", [
    ["Bass", true, 2, "Nutcracker"],
    ["Violin", true, 14, "Mouse"],
    ["Trumpet", false, 2, "Train"],
    ["Flute", false, 2, "Elephant"],
    ["Vibraphone", true, 155, "DancerGirl"],
    ["Piano", false, 2, "Horseman"],
    ["Drums", false, 2, "Cannion"],
    ["Saxophone", true, 280, "RoundDoll"],
  ]),
  buildSongGame(2, "March", "theme-14", [
    ["Bass", true, 105],
    ["Violin", true, 2],
    ["Trumpet", true, 2],
    ["Flute", false, 2],
    ["Marimba", false, 2],
    ["Piano", true, 2],
    ["Timpani", false, 2],
    ["Saxophone", false, 2],
  ]),
  buildSongGame(3, "Overture", "theme-16", [
    ["Bass", false, 2],
    ["Violin", false, 2],
    ["Trumpet", true, 136],
    ["English Horn", true, 2],
    ["Marimba", false, 2],
    ["Piano", true, 2],
    ["Drums", false, 2],
    ["Saxophone", true, 2],
  ]),
  buildSongGame(4, "Trepak", "theme-11", [
    ["Bass", false, 2],
    ["Violin", false, 2],
    ["Trumpet", false, 2],
    ["Flute", true, 2],
    ["Vibraphone", false, 2],
    ["Piano", true, 2],
    ["Drums", true, 2],
    ["Saxophone", true, 2],
  ]),
  buildSongGame(5, "Arabian Dance", "theme-12", [
    ["Bass", false, 2],
    ["Violin", true, 304],
    ["Trumpet", false, 2],
    ["Oboe", true, 114],
    ["Marimba", true, 2],
    ["Piano", false, 2],
    ["Drums", true, 2],
    ["Saxophone", false, 9],
  ]),
  buildSongGame(6, "Chinese Dance", "theme-13", [
    ["Bass", false, 2],
    ["Violin", true, 137],
    ["Trumpet", false, 2],
    ["Flute", true, 65],
    ["Marimba", false, 2],
    ["Piano", true, 2],
    ["Drums", true, 2],
    ["Saxophone", false, 2],
  ]),
  buildSongGame(7, "Dance of the Reed Flutes", "theme-15", [
    ["Bass", true, 2],
    ["Violin", false, 2],
    ["Trumpet", false, 2],
    ["Flute", true, 2],
    ["Vibraphone", true, 18],
    ["Piano", true, 2],
    ["Drums", false, 2],
    ["Saxophone", false, 2],
  ]),
  buildSongGame(8, "Waltz of the Flowers", "theme-10", [
    ["Bass", true, 4],
    ["Violin", true, 559],
    ["Trumpet", false, 66],
    ["Flute", true, 66],
    ["Vibraphone", false, 2],
    ["Piano", true, 2],
    ["Drums", false, 2],
    ["Saxophone", false, 67],
  ]),
] as const satisfies readonly NutcrackerSongGame[];

type TrackSeed = readonly [instrument: string, valid: boolean, firstFrame: number, character?: string];

function buildSongGame(
  id: NutcrackerSongId,
  title: string,
  suiteTrackId: string,
  tracks: readonly TrackSeed[],
): NutcrackerSongGame {
  return {
    id,
    routeId: `song-${id}`,
    title,
    sourcePath: `games/nutcrackergame/song${id}/trackinfo.txt`,
    suiteTrackId,
    tracks: tracks.map((track, index) => ({
      number: (index + 1) as NutcrackerTrackNumber,
      instrument: track[0],
      valid: track[1],
      firstFrame: track[2],
      previewStartSeconds: audioPreviewStartSeconds[id][(index + 1) as NutcrackerTrackNumber],
      character: track[3],
      audioPath: getNutcrackerTrackAudioPath(id, (index + 1) as NutcrackerTrackNumber),
      imagePath: getNutcrackerTrackActorImagePath(id, (index + 1) as NutcrackerTrackNumber),
      actorSourcePath: getNutcrackerTrackActorSourcePath(id, (index + 1) as NutcrackerTrackNumber),
      actorPlayback: "documented source-derived fallback",
      actorFallbackReason,
    })),
  };
}

export function getNutcrackerSongGame(songId: NutcrackerSongId): NutcrackerSongGame {
  return nutcrackerSongGames.find((song) => song.id === songId) ?? nutcrackerSongGames[0];
}

export function getNutcrackerSongGameByRoute(routeId: string): NutcrackerSongGame | undefined {
  return nutcrackerSongGames.find((song) => song.routeId === routeId);
}

export function isNutcrackerSongId(candidate: number): candidate is NutcrackerSongId {
  return Number.isInteger(candidate) && candidate >= 1 && candidate <= 8;
}

export function isNutcrackerTrackNumber(candidate: number): candidate is NutcrackerTrackNumber {
  return Number.isInteger(candidate) && candidate >= 1 && candidate <= 8;
}

export function getCorrectNutcrackerTrackNumbers(song: NutcrackerSongGame): readonly NutcrackerTrackNumber[] {
  return song.tracks.filter((track) => track.valid).map((track) => track.number);
}

export function isCorrectNutcrackerSelection(
  song: NutcrackerSongGame,
  selectedTrackNumbers: readonly NutcrackerTrackNumber[],
): boolean {
  const expected = getCorrectNutcrackerTrackNumbers(song);
  const selected = [...new Set(selectedTrackNumbers)].sort((a, b) => a - b);
  return expected.length === selected.length && expected.every((trackNumber, index) => trackNumber === selected[index]);
}

export function getNutcrackerTrackAudioPath(songId: NutcrackerSongId, trackNumber: NutcrackerTrackNumber): string {
  return `/local-media/audio/games/nutcrackergame/song${songId}/track${trackNumber}.mp3`;
}

export function getNutcrackerTrackStartSeconds(track: NutcrackerTrack): number {
  return track.previewStartSeconds;
}

export function parseTrackInfoText(content: string, songId: NutcrackerSongId): readonly NutcrackerTrack[] {
  const trackFlags = parseNumberVariables(content, "track");
  const firstFrames = parseNumberVariables(content, "firstFrame");
  const rows = parseTrackRows(content);

  return trackNumbers.map((trackNumber) => {
    const row = rows.get(trackNumber);
    return {
      number: trackNumber,
      instrument: normalizeInstrumentName(row?.instrument ?? `Track ${trackNumber}`),
      valid: trackFlags.get(trackNumber) === 1,
      firstFrame: firstFrames.get(trackNumber) ?? row?.firstFrame ?? 2,
      previewStartSeconds: audioPreviewStartSeconds[songId][trackNumber],
      character: row?.character,
      audioPath: getNutcrackerTrackAudioPath(songId, trackNumber),
      imagePath: getNutcrackerTrackActorImagePath(songId, trackNumber),
      actorSourcePath: getNutcrackerTrackActorSourcePath(songId, trackNumber),
      actorPlayback: "documented source-derived fallback",
      actorFallbackReason,
    };
  });
}

function getNutcrackerTrackActorImagePath(songId: NutcrackerSongId, trackNumber: NutcrackerTrackNumber): string {
  return songActorImagePaths[`../assets/nutcracker-source/song${songId}-track${trackNumber}-actor.png`] ?? trackImagePaths[trackNumber - 1];
}

function getNutcrackerTrackActorSourcePath(songId: NutcrackerSongId, trackNumber: NutcrackerTrackNumber): string {
  return `games/nutcrackergame/song${songId}/characters/anim${trackNumber}.swf`;
}

function parseNumberVariables(content: string, variableName: "track" | "firstFrame"): Map<NutcrackerTrackNumber, number> {
  const values = new Map<NutcrackerTrackNumber, number>();
  const pattern = new RegExp(`&${variableName}(\\d+)=(\\d+)`, "g");

  for (const match of content.matchAll(pattern)) {
    const trackNumber = Number(match[1]);
    const value = Number(match[2]);
    if (isNutcrackerTrackNumber(trackNumber)) {
      values.set(trackNumber, value);
    }
  }

  return values;
}

function parseTrackRows(content: string): Map<NutcrackerTrackNumber, { instrument: string; firstFrame: number; character?: string }> {
  const rows = new Map<NutcrackerTrackNumber, { instrument: string; firstFrame: number; character?: string }>();

  content
    .replace(/\r/g, "\n")
    .split("\n")
    .forEach((line) => {
      const match = line
        .split(flashControlCharacter)
        .join("")
        .trim()
        .match(/^Track\s+(\d+):\s+(.+?)\s+[01]\s+(?:\d+|-)\s+(\d+)(?:\s+(.+?))?$/);
      if (!match) {
        return;
      }

      const trackNumber = Number(match[1]);
      if (!isNutcrackerTrackNumber(trackNumber)) {
        return;
      }

      rows.set(trackNumber, {
        instrument: match[2].trim(),
        firstFrame: Number(match[3]),
        character: match[4]?.trim(),
      });
    });

  return rows;
}

function normalizeInstrumentName(instrument: string): string {
  const normalized = instrument.trim().toLowerCase();
  if (normalized === "tumpet") {
    return "Trumpet";
  }
  if (normalized === "sax") {
    return "Saxophone";
  }
  if (normalized === "vibraphone" || normalized === "vibraphone") {
    return "Vibraphone";
  }
  return instrument.trim();
}
