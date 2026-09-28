declare const self: Worker;

import type { ModelSmoothingType } from "../types";

export interface TrainingWorkerParams {
  tokens: RegExpMatchArray;
  smoothing: ModelSmoothingType;
  ngramSize: number;
}

function buildRecord(
  tokens: string[],
  smoothing: ModelSmoothingType,
  ngramSize: number,
) {
  const counter: Record<string, Record<string, number>> = {};

  const ngramIterTarget =
    smoothing === "backoff" || smoothing === "interpolated" ? 1 : ngramSize;

  for (
    let currentNgramSize = ngramSize;
    currentNgramSize >= ngramIterTarget;
    currentNgramSize--
  ) {
    addNgramCounts(tokens, currentNgramSize, counter);
  }

  return counter;
}

function addNgramCounts(
  tokens: string[],
  ngramSize: number,
  counter: Record<string, Record<string, number>>,
) {
  for (let index = 0; index < tokens.length - ngramSize; index++) {
    const ngram = tokens.slice(index, index + ngramSize).join(" ");
    const targetWord = tokens[index + ngramSize];

    counter[ngram] ??= {};

    counter[ngram][targetWord] = (counter[ngram][targetWord] || 0) + 1;
  }
}

self.onmessage = (e: MessageEvent<TrainingWorkerParams>) => {
  const { ngramSize, smoothing, tokens } = e.data;
  const counter = buildRecord(tokens, smoothing, ngramSize);

  self.postMessage(counter);
};
