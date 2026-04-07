import {
  getTrailingWordsAsString,
  tokenizeWords,
  weightedChoice,
} from "./utils";

export class LanguageModel {
  ngramSize: number;
  temperature: number;
  topK: number;

  model!: Record<string, Record<string, number>>;

  private constructor(ngramSize: number, temperature: number, topK: number) {
    this.ngramSize = ngramSize;
    this.temperature = temperature;
    this.topK = topK;
  }

  static async compileModel(
    ngramSize: number,
    temperature: number,
    topK: number,
    examples: string[],
  ): Promise<LanguageModel> {
    const newModel = new LanguageModel(ngramSize, temperature, topK);

    const tokens = tokenizeWords(examples.join(" "));
    if (!tokens) throw new Error("Invalid tokens received");

    return new Promise((resolve) => {
      const counter: Record<string, Record<string, number>> = {};

      for (let index = 0; index < tokens.length - ngramSize; index++) {
        const ngram = tokens.slice(index, index + ngramSize).join(" ");
        const targetWord = tokens[index + ngramSize];

        if (counter[ngram] == undefined) counter[ngram] = {};

        counter[ngram][targetWord] = (counter[ngram][targetWord] || 0) + 1;
      }

      for (const ngram of Object.keys(counter)) {
        for (const targetWord of Object.keys(counter[ngram])) {
          const value = counter[ngram][targetWord];
          counter[ngram][targetWord] = Math.pow(value, 1 / temperature);
        }
      }

      newModel.model = counter;

      resolve(newModel);
    });
  }

  getNextWordProbabilities = (input: string) => {
    const truncatedInput = getTrailingWordsAsString(input, this.ngramSize);
    if (!truncatedInput) return {};

    const possibilities = this.model[truncatedInput];
    if (!possibilities) return {};

    const entries = Object.entries(possibilities)
      .sort(([, a], [, b]) => a - b)
      .reverse()
      .slice(0, this.topK);

    return Object.fromEntries(entries);
  };

  generateNextWord = (input: string) => {
    const possibilities = this.getNextWordProbabilities(input);

    // TODO: Handle non-matching words in a more appropiate manner
    if (!Object.keys(possibilities).length) {
      return "NADA";
    }

    const chosenPosition = weightedChoice(possibilities);

    return Object.keys(possibilities)[chosenPosition];
  };
}
