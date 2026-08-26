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
  readonly optionAudioUrls: readonly [string, string, string, string];
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

export function createMemoryDeck(pairCount: number): readonly MemoryCard[] {
  const safePairCount = Math.min(Math.max(Math.trunc(pairCount), 1), 18);
  const pairs = Array.from({ length: safePairCount }, (_item, index) => index + 1);
  const orderedPairIds = pairs.flatMap((pairId, index) => [pairId, pairs[pairs.length - index - 1] ?? pairId]);
  return orderedPairIds.map((pairId, index) => ({
    id: index + 1,
    pairId,
    faceUrl: getM07Asset(`/memory-card-face-${String(((pairId - 1) % 16) + 1).padStart(2, "0")}.png`),
    soundUrl: getM07Asset(`/audio/memory/${pairId}.mp3`),
  }));
}

export function memoryPairsForLevel(level: number): number {
  return Math.min(Math.max(Math.trunc(level), 1) + 4, 18);
}

export function memoryErrorsForPairs(pairCount: number): number {
  return pairCount * 2;
}

export function createTreeRounds(variant: 1 | 2 | 3): readonly TreeRound[] {
  const correctOptions = [2, 4, 1] as const;
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
    return {
      round,
      correctOption,
      promptAudioUrl,
      optionAudioUrls,
    };
  });
}

const flyingInstrumentDefinitions: readonly [string, FlyingFamily, string, number][] = [
  ["Flute", "woodwinds", "flying-flute.png", 1],
  ["Oboe", "woodwinds", "flying-oboe.png", 2],
  ["Clarinet", "woodwinds", "flying-clarinet.png", 3],
  ["Bassoon", "woodwinds", "flying-bassoon.png", 4],
  ["Harp", "strings", "flying-harp.png", 5],
  ["Double bass", "strings", "flying-double-bass.png", 6],
  ["Cello", "strings", "flying-cello.png", 7],
  ["Violin", "strings", "flying-violin.png", 8],
  ["Trumpet", "brass", "flying-trumpet.png", 9],
  ["Trombone", "brass", "flying-trombone.png", 10],
  ["French horn", "brass", "flying-french-horn.png", 11],
  ["Tuba", "brass", "flying-tuba.png", 12],
  ["Grand piano", "percussion", "flying-grand-piano-blue.png", 13],
  ["Piano", "percussion", "flying-grand-piano-brown.png", 14],
  ["Drum", "percussion", "flying-drum.png", 15],
  ["Cymbals", "percussion", "flying-cymbals.png", 16],
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

export function isMelodyDifficulty(value: string): value is MelodyDifficulty {
  return value === "beg" || value === "easy" || value === "inter" || value === "adv";
}

export function isFlyingFamily(value: string): value is FlyingFamily {
  return flyingFamilies.includes(value as FlyingFamily);
}
