import { describe, expect, it } from "vitest";
import {
  createMemoryDeck,
  createTreeRounds,
  flyingFamilies,
  flyingInstruments,
  getMelodySequences,
  getTriviaQuestion,
  melodyInputIsCorrect,
  memoryErrorsForPairs,
  memoryPairsForLevel,
  triviaQuestions,
} from "../data/m07Games";

describe("M07 recovered mini-game data", () => {
  it("parses all 106 source trivia questions", () => {
    expect(triviaQuestions).toHaveLength(106);
    expect(getTriviaQuestion(0)).toMatchObject({
      prompt: "What is the Nutcracker?",
      options: ["a. Symphony", "b. Opera", "c. Song", "d. Ballet"],
      correctOption: 4,
    });
  });

  it("parses every source melody difficulty and verifies the first beginner phrase", () => {
    expect(getMelodySequences("beg")).toHaveLength(8);
    expect(getMelodySequences("easy")).toHaveLength(8);
    expect(getMelodySequences("inter")).toHaveLength(10);
    expect(getMelodySequences("adv")).toHaveLength(10);
    const first = getMelodySequences("beg")[0];
    expect(first.tokens.map((token) => token.note)).toEqual([5, 8, 10]);
    expect(melodyInputIsCorrect(first, [5, 8, 10])).toBe(true);
    expect(melodyInputIsCorrect(first, [5, 10, 8])).toBe(false);
  });

  it("matches the source memory level, pair, and error rules", () => {
    expect(memoryPairsForLevel(1)).toBe(5);
    expect(memoryPairsForLevel(14)).toBe(18);
    expect(memoryErrorsForPairs(5)).toBe(10);
    expect(createMemoryDeck(5).map((card) => card.pairId)).toEqual([1, 5, 2, 4, 3, 3, 4, 2, 5, 1]);
  });

  it("builds three source tree rounds for each recovered sound variant", () => {
    const rounds = createTreeRounds(2);
    expect(rounds.map((round) => round.correctOption)).toEqual([2, 4, 1]);
    expect(rounds[0].promptAudioUrl).toContain("c_1.mp3");
    expect(rounds[2].optionAudioUrls).toEqual([
      expect.stringContaining("c_3.mp3"),
      expect.stringContaining("i_3_1.mp3"),
      expect.stringContaining("i_3_2.mp3"),
      expect.stringContaining("i_3_3.mp3"),
    ]);
  });

  it("maps all 16 promoted flying instruments to the four source game families", () => {
    expect(flyingInstruments).toHaveLength(16);
    expect(new Set(flyingInstruments.map((instrument) => instrument.family))).toEqual(new Set(flyingFamilies));
    expect(flyingInstruments[0]).toMatchObject({ name: "Flute", family: "woodwinds" });
    expect(flyingInstruments[flyingInstruments.length - 1]).toMatchObject({ name: "Cymbals", family: "percussion" });
  });
});
