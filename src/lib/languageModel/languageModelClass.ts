import type { LanguageModelProps, ModelSmoothingType } from "../types";
import {
  getTrailingWordsAsString,
  normalizeRecordValues,
  tokenizeWords,
  weightedChoice,
} from "../utils";
import type { TrainingWorkerParams } from "./modelTrainingWorker";

export class LanguageModel {
  contextSize: number;
  temperature: number;
  topK: number;
  smoothing: ModelSmoothingType;

  model!: Record<string, Record<string, number>>;

  private constructor(
    contextSize: number,
    temperature: number,
    topK: number,
    smoothing: ModelSmoothingType,
  ) {
    this.contextSize = contextSize;
    this.temperature = temperature;
    this.topK = topK;
    this.smoothing = smoothing;
  }

  static async compileModel(
    { contextSize, temperature, topK, smoothing, examples }: LanguageModelProps,
    trainingWorker: Worker,
  ): Promise<LanguageModel> {
    const newModel = new LanguageModel(contextSize, temperature, topK, smoothing);

    const tokens = tokenizeWords(examples.join(" "));
    if (!tokens) throw new Error("Invalid tokens received");

    const trainingParams: TrainingWorkerParams = {
      contextSize,
      smoothing,
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

  getNextWordWeights = (input: string) => {
    const truncatedInput = getTrailingWordsAsString(input, this.contextSize);
    if (!truncatedInput) return {};

    const possibilities = this.calculateSmoothedWeights(input);

    if (!possibilities) return {};

    const possibilitiesAfterTemp = this.applyTemperature(possibilities);

    const entries = Object.entries(possibilitiesAfterTemp)
      .sort(([, a], [, b]) => a - b)
      .reverse()
      .slice(0, this.topK);

    return Object.fromEntries(entries);
  };

  private applyTemperature(input: Record<string, number>) {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        Math.pow(value, 1 / this.temperature),
      ]),
    );
  }

  private calculateSmoothedWeights(input: string) {
    if (this.smoothing == "none") {
      const selectedNgram = getTrailingWordsAsString(input, this.contextSize);
      return this.model[selectedNgram];
    }

    let possibilities: Record<string, number> = {};

    for (let i = this.contextSize; i >= 1; i--) {
      const selectedNgram = getTrailingWordsAsString(input, i);
      const currentRecord = this.model[selectedNgram] || {};

      if (this.smoothing == "backoff") {
        if (Object.keys(currentRecord).length !== 0) {
          possibilities = currentRecord;
          break;
        }
      } else if (this.smoothing == "interpolated") {
        // Normalize so that all n-gram sizes hold same importance

        const normalizedValues = normalizeRecordValues(currentRecord);
        for (const word of Object.keys(currentRecord)) {
          possibilities[word] ||= 0;

          possibilities[word] += normalizedValues[word] || 0;
        }
      }
    }

    return possibilities;
  }

  generateNextWord = (input: string) => {
    const possibilities = this.getNextWordWeights(input);

    const chosenPosition = weightedChoice(possibilities);

    return Object.keys(possibilities)[chosenPosition];
  };
}
