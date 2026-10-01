declare const self: Worker;

import type { ModelSmoothingType } from "../types";

export interface TrainingWorkerParams {
  tokens: RegExpMatchArray;
  smoothing: ModelSmoothingType;
  contextSize: number;
}

function buildRecord(
  tokens: string[],
  smoothing: ModelSmoothingType,
  contextSize: number,
) {
  const counter: Record<string, Record<string, number>> = {};

  const ngramIterTarget =
    smoothing === "backoff" || smoothing === "interpolated" ? 1 : contextSize;

  for (
    let currentContextSize = contextSize;
    currentContextSize >= ngramIterTarget;
    currentContextSize--
  ) {
    addNgramCounts(tokens, currentContextSize, counter);
  }

  return counter;
}

function addNgramCounts(
  tokens: string[],
  contextSize: number,
  counter: Record<string, Record<string, number>>,
) {
  for (let index = 0; index < tokens.length - contextSize; index++) {
    const context = tokens.slice(index, index + contextSize).join(" ");
    const targetWord = tokens[index + contextSize];

    counter[context] ??= {};

    counter[context][targetWord] = (counter[context][targetWord] || 0) + 1;
  }
}

self.onmessage = (e: MessageEvent<TrainingWorkerParams>) => {
  const { contextSize, smoothing, tokens } = e.data;
  const counter = buildRecord(tokens, smoothing, contextSize);

  self.postMessage(counter);
};
