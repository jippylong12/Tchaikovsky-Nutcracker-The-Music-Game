export type FlashVariableMap = Record<string, string>;

export type TriviaQuestion = {
  id: number;
  prompt: string;
  options: readonly [string, string, string, string];
  correctOption: 1 | 2 | 3 | 4;
  successText?: string;
  failureText?: string;
};

export type MelodyToken = {
  note: number;
  length: "s" | "m" | "L";
  delayMs: number;
};

export type MelodySequence = {
  id: string;
  difficulty: "beg" | "easy" | "inter" | "adv";
  index: number;
  tokens: readonly MelodyToken[];
};

export function parseFlashVariables(source: string): FlashVariableMap {
  const variables: FlashVariableMap = {};

  source
    .replace(/\r/g, "")
    .split("&")
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      const separator = part.indexOf("=");
      if (separator === -1) return;
      const key = part.slice(0, separator).trim();
      const value = part.slice(separator + 1).trim();
      if (key) {
        variables[key] = decodeFlashValue(value);
      }
    });

  return variables;
}

export function parseProgressFlags(source: string, prefix: string, count: number): readonly boolean[] {
  const variables = parseFlashVariables(source);
  return Array.from({ length: count }, (_, index) => variables[`${prefix}${index + 1}`] === "1");
}

export function parseTriviaQuestions(source: string): readonly TriviaQuestion[] {
  const variables = parseFlashVariables(source);
  const questions: TriviaQuestion[] = [];

  Object.keys(variables)
    .map((key) => key.match(/^q(\d+)$/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number)
    .sort((a, b) => a - b)
    .forEach((id) => {
      const options = [1, 2, 3, 4].map((option) => variables[`op${option}${id}`] ?? "") as [string, string, string, string];
      const correctOption = Number(variables[`correct${id}`]);
      if (!isTriviaOption(correctOption)) return;

      questions.push({
        id,
        prompt: variables[`q${id}`] ?? "",
        options,
        correctOption,
        successText: variables[`good${id}`],
        failureText: variables[`bad${id}`],
      });
    });

  return questions;
}

export function parseMelodySequences(source: string): readonly MelodySequence[] {
  const variables = parseFlashVariables(source);
  return Object.entries(variables)
    .map(([key, value]) => {
      const match = key.match(/^m_(beg|easy|inter|adv)_(\d+)$/);
      if (!match) return null;

      return {
        id: key,
        difficulty: match[1] as MelodySequence["difficulty"],
        index: Number(match[2]),
        tokens: parseMelodyTokens(value),
      };
    })
    .filter((sequence): sequence is MelodySequence => sequence !== null)
    .sort((a, b) => a.difficulty.localeCompare(b.difficulty) || a.index - b.index);
}

function parseMelodyTokens(value: string): readonly MelodyToken[] {
  const parts = value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const tokens: MelodyToken[] = [];

  for (let index = 0; index < parts.length - 1; index += 2) {
    const noteMatch = parts[index].match(/^(\d+)(s|m|L)$/);
    const delayMs = Number(parts[index + 1]);
    if (!noteMatch || !Number.isFinite(delayMs)) continue;
    tokens.push({
      note: Number(noteMatch[1]),
      length: noteMatch[2] as MelodyToken["length"],
      delayMs,
    });
  }

  return tokens;
}

function decodeFlashValue(value: string): string {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function isTriviaOption(value: number): value is 1 | 2 | 3 | 4 {
  return value === 1 || value === 2 || value === 3 || value === 4;
}
