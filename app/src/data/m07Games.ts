import melodySource from "../assets/m07-source/audio/melody/Melody.txt?raw";
import triviaSource from "../assets/m07-source/data/trivia/trivia.txt?raw";
import { parseMelodySequences, parseTriviaQuestions, type MelodySequence, type TriviaQuestion } from "./flashVariables";

const m07AssetModules = import.meta.glob<string>("../assets/m07-source/**/*.{mp3,png}", {
  eager: true,
  import: "default",
  query: "?url",
});

export const triviaQuestions = parseTriviaQuestions(triviaSource);
export const melodySequences = parseMelodySequences(melodySource);

export type MelodyDifficulty = MelodySequence["difficulty"];
export type MemoryCard = {
  readonly id: number;
  readonly pairId: number;
  readonly faceUrl: string;
  readonly soundUrl: string;
};

export type TreeRound = {
  readonly round: 1 | 2 | 3;
  readonly correctOption: 1 | 2 | 3 | 4;
  readonly promptAudioUrl: string;
  readonly promptDurationMs: number;
  readonly optionAudioUrls: readonly [string, string, string, string];
  readonly optionDurationMs: readonly [number, number, number, number];
};

export type FlyingFamily = "woodwinds" | "strings" | "brass" | "percussion";
export type FlyingInstrument = {
  readonly id: number;
  readonly name: string;
  readonly family: FlyingFamily;
  readonly imageUrl: string;
  readonly soundUrl: string;
};

export function getM07Asset(pathSuffix: string): string {
  const entry = Object.entries(m07AssetModules).find(([path]) => path.endsWith(pathSuffix));
  if (!entry) throw new Error(`Missing promoted M07 asset: ${pathSuffix}`);
  return entry[1];
}

export function getTriviaQuestion(index: number): TriviaQuestion {
  if (triviaQuestions.length === 0) throw new Error("Recovered trivia source contains no questions");
  return triviaQuestions[((index % triviaQuestions.length) + triviaQuestions.length) % triviaQuestions.length];
}

export function getMelodySequences(difficulty: MelodyDifficulty): readonly MelodySequence[] {
  return melodySequences.filter((sequence) => sequence.difficulty === difficulty);
}

export function melodyInputIsCorrect(sequence: MelodySequence, notes: readonly number[]): boolean {
  return notes.length === sequence.tokens.length && notes.every((note, index) => note === sequence.tokens[index].note);
}

export function getMelodyNoteAudio(note: number, length: "s" | "m" | "L"): string {
  const suffix = length === "s" ? "Short" : length === "m" ? "Med" : "Long";
  const candidate = `${note}-${suffix}.mp3`;
  const caseInsensitiveEntry = Object.entries(m07AssetModules).find(
    ([path]) => path.toLowerCase().endsWith(`/audio/melody/${candidate.toLowerCase()}`),
  );
  if (!caseInsensitiveEntry) throw new Error(`Missing recovered melody note ${candidate}`);
  return caseInsensitiveEntry[1];
}

export function createMemoryDeck(pairCount: number, random: () => number = Math.random): readonly MemoryCard[] {
  const safePairCount = Math.min(Math.max(Math.trunc(pairCount), 1), 18);
  const orderedPairIds = Array.from({ length: safePairCount }, (_item, index) => index + 1).flatMap((pairId) => [
    pairId,
    pairId,
  ]);
  for (let index = orderedPairIds.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.min(Math.max(Math.floor(random() * (index + 1)), 0), index);
    [orderedPairIds[index], orderedPairIds[swapIndex]] = [orderedPairIds[swapIndex], orderedPairIds[index]];
  }
  return orderedPairIds.map((pairId, index) => ({
    id: index + 1,
    pairId,
    faceUrl: getM07Asset(`/memory-card-face-${String(pairId).padStart(2, "0")}.png`),
    soundUrl: getM07Asset(`/audio/memory/${pairId}.mp3`),
  }));
}

export function memoryPairsForLevel(level: number): number {
  return Math.min(Math.max(Math.trunc(level), 1) + 4, 18);
}

export function memoryErrorsForPairs(pairCount: number): number {
  const safePairCount = Math.min(Math.max(Math.trunc(pairCount), 1), 18);
  return safePairCount + Math.floor(safePairCount / 2);
}

export function createTreeRounds(variant: 1 | 2 | 3): readonly TreeRound[] {
  const correctOptions = [2, 4, 1] as const;
  const promptDurationMs = {
    1: [4023, 4833, 6844],
    2: [4833, 5042, 13924],
    3: [6009, 8255, 5382],
  } as const;
  const incorrectDurationMs = {
    1: [[4023, 2116, 3893], [3971, 3893, 9640], [6714, 6792, 6740]],
    2: [[4833, 4285, 4859], [5042, 5382, 4990], [13819, 6975, 13924]],
    3: [[5904, 6035, 4833], [8020, 7707, 8490], [5251, 5303, 5329]],
  } as const;
  return correctOptions.map((correctOption, index) => {
    const round = (index + 1) as 1 | 2 | 3;
    const promptAudioUrl = getM07Asset(`/audio/tree/Snd_${variant}/c_${round}.mp3`);
    const incorrectAudioUrls = [1, 2, 3].map((option) =>
      getM07Asset(`/audio/tree/Snd_${variant}/i_${round}_${option}.mp3`),
    );
    let incorrectIndex = 0;
    const optionAudioUrls = [1, 2, 3, 4].map((option) => {
      if (option === correctOption) return promptAudioUrl;
      const audioUrl = incorrectAudioUrls[incorrectIndex];
      incorrectIndex += 1;
      return audioUrl;
    }) as [string, string, string, string];
    incorrectIndex = 0;
    const optionDurationMs = [1, 2, 3, 4].map((option) => {
      if (option === correctOption) return promptDurationMs[variant][index];
      const duration = incorrectDurationMs[variant][index][incorrectIndex];
      incorrectIndex += 1;
      return duration;
    }) as [number, number, number, number];
    return {
      round,
      correctOption,
      promptAudioUrl,
      promptDurationMs: promptDurationMs[variant][index],
      optionAudioUrls,
      optionDurationMs,
    };
  });
}

const flyingInstrumentDefinitions: readonly [string, FlyingFamily, string, number][] = [
  ["Flute", "woodwinds", "flying-flute.png", 1],
  ["Clarinet", "woodwinds", "flying-clarinet.png", 2],
  ["Oboe", "woodwinds", "flying-oboe.png", 3],
  ["Bassoon", "woodwinds", "flying-bassoon.png", 4],
  ["Harp", "strings", "flying-harp.png", 5],
  ["Piano", "percussion", "flying-grand-piano-blue.png", 6],
  ["Harpsichord", "percussion", "flying-grand-piano-brown.png", 7],
  ["Timpani", "percussion", "flying-drum.png", 8],
  ["Cymbals", "percussion", "flying-cymbals.png", 9],
  ["Double bass", "strings", "flying-double-bass.png", 10],
  ["Cello", "strings", "flying-cello.png", 11],
  ["Violin", "strings", "flying-violin.png", 12],
  ["Viola", "strings", "flying-viola.png", 13],
  ["Trumpet", "brass", "flying-trumpet.png", 14],
  ["Trombone", "brass", "flying-trombone.png", 15],
  ["French horn", "brass", "flying-french-horn.png", 16],
  ["Tuba", "brass", "flying-tuba.png", 17],
];

export const flyingInstruments: readonly FlyingInstrument[] = flyingInstrumentDefinitions.map(
  ([name, family, imageName, id]) => ({
    id,
    name,
    family,
    imageUrl: getM07Asset(`/${imageName}`),
    soundUrl: getM07Asset(`/audio/flying/sound${id}.mp3`),
  }),
);

export const flyingFamilies: readonly FlyingFamily[] = ["woodwinds", "strings", "brass", "percussion"];

const flyingInstrumentIdsByLevel: Readonly<Record<1 | 2 | 3, readonly number[]>> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  2: [17, 6, 8, 12, 14, 16, 7, 5],
  3: [17, 6, 8, 1, 12, 16, 7, 5],
};

export function getFlyingInstrumentSequence(level: 1 | 2 | 3): readonly FlyingInstrument[] {
  return flyingInstrumentIdsByLevel[level].map((id) => {
    const instrument = flyingInstruments.find((candidate) => candidate.id === id);
    if (!instrument) throw new Error(`Missing recovered flying instrument ${id}`);
    return instrument;
  });
}

export function isMelodyDifficulty(value: string): value is MelodyDifficulty {
  return value === "beg" || value === "easy" || value === "inter" || value === "adv";
}

export function isFlyingFamily(value: string): value is FlyingFamily {
  return flyingFamilies.includes(value as FlyingFamily);
}
