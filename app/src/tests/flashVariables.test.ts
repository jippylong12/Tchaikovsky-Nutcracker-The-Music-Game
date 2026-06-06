import { describe, expect, it } from "vitest";
import { parseFlashVariables, parseMelodySequences, parseProgressFlags, parseTriviaQuestions } from "../data/flashVariables";

describe("Flash variable parsing", () => {
  it("parses ampersand-delimited Flash variables and preserves final repeated values", () => {
    const variables = parseFlashVariables("&gameKey1=0&gameKey2=1&foo=old\r\n&foo=new&EOF=1");

    expect(variables.gameKey1).toBe("0");
    expect(variables.gameKey2).toBe("1");
    expect(variables.foo).toBe("new");
    expect(variables.EOF).toBe("1");
  });

  it("normalizes progress flag groups", () => {
    expect(parseProgressFlags("&door1=1&door2=0&door3=1&EOF=1", "door", 3)).toEqual([true, false, true]);
  });

  it("builds typed trivia question fixtures", () => {
    const questions = parseTriviaQuestions(
      "&q1=What is the Nutcracker?&op11=a. Symphony&op21=b. Opera&op31=c. Song&op41=d. Ballet&correct1=4&good1=Correct&bad1=Try again",
    );

    expect(questions).toEqual([
      {
        id: 1,
        prompt: "What is the Nutcracker?",
        options: ["a. Symphony", "b. Opera", "c. Song", "d. Ballet"],
        correctOption: 4,
        successText: "Correct",
        failureText: "Try again",
      },
    ]);
  });

  it("builds melody sequence tokens by difficulty and index", () => {
    const sequences = parseMelodySequences("&m_beg_1=5m, 935, 8m, 983, 10L, 1000&m_adv_2=11m, 700, 7L, 1000&");

    expect(sequences).toEqual([
      {
        id: "m_adv_2",
        difficulty: "adv",
        index: 2,
        tokens: [
          { note: 11, length: "m", delayMs: 700 },
          { note: 7, length: "L", delayMs: 1000 },
        ],
      },
      {
        id: "m_beg_1",
        difficulty: "beg",
        index: 1,
        tokens: [
          { note: 5, length: "m", delayMs: 935 },
          { note: 8, length: "m", delayMs: 983 },
          { note: 10, length: "L", delayMs: 1000 },
        ],
      },
    ]);
  });
});
