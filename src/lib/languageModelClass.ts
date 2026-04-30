import type { ModelSmoothingType } from "./types";
import {
  getTrailingWordsAsString,
  tokenizeWords,
  weightedChoice,
} from "./utils";
import type { TrainingWorkerParams } from "./modelTrainingWorker";

export class LanguageModel {
  ngramSize: number;
  temperature: number;
  topK: number;
  smoothing: ModelSmoothingType;

  model!: Record<string, Record<string, number>>;

  private constructor(
    ngramSize: number,
    temperature: number,
    topK: number,
    smoothing: ModelSmoothingType,
  ) {
    this.ngramSize = ngramSize;
    this.temperature = temperature;
    this.topK = topK;
    this.smoothing = smoothing;
  }

  static async compileModel(
    ngramSize: number,
    temperature: number,
    topK: number,
    smoothing: ModelSmoothingType,
    examples: string[],
    trainingWorker: Worker,
  ): Promise<LanguageModel> {
    const newModel = new LanguageModel(ngramSize, temperature, topK, smoothing);

    const tokens = tokenizeWords(examples.join(" "));
    if (!tokens) throw new Error("Invalid tokens received");

    const trainingParams: TrainingWorkerParams = {
      ngramSize,
      smoothing,
      temperature,
      tokens,
    };

    return new Promise((resolve) => {
      trainingWorker.addEventListener("message", (e) => {
        const counter: Record<string, Record<string, number>> = e.data;

        newModel.model = counter;
        resolve(newModel);
        trainingWorker.terminate();
      });

      trainingWorker.postMessage(trainingParams);
    });
  }

  getNextWordProbabilities = (input: string) => {
    const truncatedInput = getTrailingWordsAsString(input, this.ngramSize);
    if (!truncatedInput) return {};

    const possibilities = this.calculateSmoothedProbabilities(input);

    if (!possibilities) return {};

    const entries = Object.entries(possibilities)
      .sort(([, a], [, b]) => a - b)
      .reverse()
      .slice(0, this.topK);

    return Object.fromEntries(entries);
  };

  calculateSmoothedProbabilities(input: string) {
    if (this.smoothing == "none") {
      const selectedNgram = getTrailingWordsAsString(input, this.ngramSize);
      return this.model[selectedNgram];
    }

    let possibilities: Record<string, number> = {};

    for (let i = this.ngramSize; i >= 1; i--) {
      const selectedNgram = getTrailingWordsAsString(input, i);
      const currentRecord = this.model[selectedNgram] || {};

      if (this.smoothing == "backoff") {
        if (Object.keys(currentRecord).length !== 0) {
          possibilities = currentRecord;
          break;
        }
      } else if (this.smoothing == "interpolated") {
        for (const word of Object.keys(currentRecord)) {
          possibilities[word] ||= 0;
          possibilities[word] += currentRecord[word] || 0;
        }
      }
    }

    return possibilities;
  }

  generateNextWord = (input: string) => {
    const possibilities = this.getNextWordProbabilities(input);

    const chosenPosition = weightedChoice(possibilities);

    return Object.keys(possibilities)[chosenPosition];
  };
}
