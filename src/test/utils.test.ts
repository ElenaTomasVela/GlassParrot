import {
  getBeginningWordsAsString,
  getTrailingWordsAsString,
  tokenizeWords,
  weightedChoice,
} from "@/lib/utils";
import { expect, test } from "bun:test";

expect.extend({
  toBeApprox(actual, expected, epsilon) {
    if (
      typeof actual !== "number" ||
      typeof expected !== "number" ||
      typeof epsilon !== "number"
    )
      throw new Error("Invalid usage");

    const pass = Math.abs(actual - expected) < epsilon;

    return {
      pass: pass,
      message: () =>
        `expected ${this.utils.printReceived(actual)} to approximately equal ${this.utils.printExpected(expected)} with tolerance ${epsilon}`,
    };
  },
});

test("Trailing words are obtained correctly", () => {
  const result = getTrailingWordsAsString("This is a test with 7 words", 3);

  expect(result).toBe("with 7 words");
});

test("Beginning words are obtained correctly", () => {
  const result = getBeginningWordsAsString("This is a test with 7 words", 3);

  expect(result).toBe("This is a");
});

test.each([
  ["Simple words example", ["simple", "words", "example"]],
  ["   Trying   with    spaces      ", ["trying", "with", "spaces"]],
  ["Should exclude punctuation...", ["should", "exclude", "punctuation"]],
  ["Punctuation, in the middle", ["punctuation", "in", "the", "middle"]],
  [
    "Should not exclude special chäráctèrsñ",
    ["should", "not", "exclude", "special", "chäráctèrsñ"],
  ],
])("Words are correctly tokenized: %s", (input, expected: string[]) => {
  const result = tokenizeWords(input);

  expect(result).not.toBeNull();

  expect(Array.from(result!)).toEqual(expected);
});

test("Weighted choice works", () => {
  const param = {
    firstChoice: 1,
    secondChoice: 4,
  };

  const records = Array.from({ length: 1000 }, () => weightedChoice(param));

  expect(records.filter((v) => v == 0).length).toBeApprox(200, 50);
  expect(records.filter((v) => v == 1).length).toBeApprox(800, 50);
});
