declare const self: Worker;

import type { ModelSmoothingType } from "../types";

export interface TrainingWorkerParams {
  tokens: RegExpMatchArray;
  smoothing: ModelSmoothingType;
  ngramSize: number;
  temperature: number;
}

function buildRecord(
  tokens: string[],
  smoothing: ModelSmoothingType,
  ngramSize: number,
  temperature: number,
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

  for (const ngram of Object.keys(counter)) {
    for (const targetWord of Object.keys(counter[ngram])) {
      const value = counter[ngram][targetWord];
      counter[ngram][targetWord] = Math.pow(value, 1 / temperature);
    }
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

    if (counter[ngram] == undefined) counter[ngram] = {};

    counter[ngram][targetWord] = (counter[ngram][targetWord] || 0) + 1;
  }
}

self.onmessage = (e: MessageEvent<TrainingWorkerParams>) => {
  console.log("Starting training!");
  const { ngramSize, smoothing, temperature, tokens } = e.data;
  const counter = buildRecord(tokens, smoothing, ngramSize, temperature);

  self.postMessage(counter);
  console.log("Finished training!");
};
