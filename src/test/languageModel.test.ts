import { LanguageModel } from "@/lib/languageModel/languageModelClass";
import type { LanguageModelProps } from "@/lib/types";
import {
  coefVariation,
  normalizeRecordValues,
  range,
  sumRecordValues,
} from "@/lib/utils";
import { test, expect, describe } from "bun:test";

const exampleText = [
  "This is an example sentence that is very long for testing language models",
  "There is very little to write here",
  "A very short sentence",
];
const defaultParams: LanguageModelProps = {
  contextSize: 1,
  examples: exampleText,
  temperature: 1,
  topK: 10,
  smoothing: "none",
};

const createModel = async (params: LanguageModelProps) => {
  const worker = new Worker("@/lib/languageModel/modelTrainingWorker.ts");
  return LanguageModel.compileModel(params, worker);
};

test.each(range(11, 1))(
  "Models use context size of %i correctly",
  async (contextSize: number) => {
    const params: LanguageModelProps = {
      ...defaultParams,
      contextSize: contextSize,
    };

    const model = await createModel(params);

    const ngrams = Object.keys(model.model).map((s) => s.split(" "));

    ngrams.forEach((ngram) => expect(ngram).toBeArrayOfSize(contextSize));
  },
);

test.each(range(11, 1))("Models use Top-K of %i correctly", async (topk) => {
  const examples = range(15).map((i) => `test ${i}`);

  const params: LanguageModelProps = {
    ...defaultParams,
    examples: examples,
    topK: topk,
  };

  const model = await createModel(params);
  const predictions = model.getNextWordWeights("test");
  const nPredicts = Object.keys(predictions).length;

  expect(
    nPredicts,
    `Expected to get ${topk} predictions but got ${nPredicts}`,
  ).toBe(topk);
});

describe("Temperature modifies predictions correctly", async () => {
  const examples = [1, 1, 1, 2, 2, 3].map((i) => `test ${i}`);
  const defaultWeights = { 1: 3, 2: 2, 3: 1 };
  const defaultVariation = coefVariation(Object.values(defaultWeights));

  const getResults = async (temperature: number) => {
    const params: LanguageModelProps = {
      ...defaultParams,
      temperature,
      examples,
    };
    const model = await createModel(params);
    const probabilities = model.getNextWordWeights("test");

    return coefVariation(Object.values(probabilities));
  };

  test("Low", async () => {
    const temperature = 0.5;

    const variation = await getResults(temperature);
    expect(variation).toBeGreaterThan(defaultVariation);
  });
  test("Default", async () => {
    const temperature = 1;

    const variation = await getResults(temperature);
    expect(variation).toBe(defaultVariation);
  });
  test("High", async () => {
    const temperature = 5;

    const variation = await getResults(temperature);
    expect(variation).toBeLessThan(defaultVariation);
  });
});

describe("Smoothing is applied correctly:", () => {
  test("None", async () => {
    const params: LanguageModelProps = {
      ...defaultParams,
      smoothing: "none",
      contextSize: 3,
    };

    const model = await createModel(params);

    const singleWordProbs = model.getNextWordWeights("This");
    expect(Object.keys(singleWordProbs)).toBeEmpty();
  });

  test("Back-off", async () => {
    const params: LanguageModelProps = {
      ...defaultParams,
      smoothing: "backoff",
      contextSize: 3,
    };

    const model = await createModel(params);

    const singleWordProbs = model.getNextWordWeights("very");
    expect(Object.keys(singleWordProbs)).toBeArrayOfSize(3);

    const firstMatchingProbs = model.getNextWordWeights("there is very");
    expect(Object.keys(firstMatchingProbs)).toBeArrayOfSize(1);
    expect(firstMatchingProbs).toContainKey("little");
  });

  test("Interpolated", async () => {
    const params: LanguageModelProps = {
      ...defaultParams,
      smoothing: "interpolated",
      contextSize: 3,
    };

    const interpolatedModel = await createModel(params);
    const separateModels = await Promise.all(
      range(4, 1).map((contextSize) =>
        createModel({ ...params, smoothing: "none", contextSize }),
      ),
    );

    const singleWordProbs = interpolatedModel.getNextWordWeights("very");
    const singleWordProbsValues = Object.values(singleWordProbs);
    expect(Object.keys(singleWordProbs)).toBeArrayOfSize(3);
    expect(singleWordProbs).toContainAllKeys(["short", "little", "long"]);
    expect(
      singleWordProbsValues.every((v) => v === singleWordProbsValues[0]),
      `Expected all values in ${Object.entries(singleWordProbs)} to be equal`,
    ).toBe(true);

    const interpolatedProbs =
      interpolatedModel.getNextWordWeights("that is very");
    expect(Object.keys(interpolatedProbs)).toBeArrayOfSize(3);
    expect(interpolatedProbs).toContainAllKeys(["short", "little", "long"]);

    const individualProbs = separateModels.map((model) =>
      normalizeRecordValues(model.getNextWordWeights("that is very")),
    );

    const averageIndivProbs = sumRecordValues(individualProbs);

    const normalizedInterpolatedProbs =
      normalizeRecordValues(interpolatedProbs);

    expect(normalizedInterpolatedProbs).toEqual(
      normalizeRecordValues(averageIndivProbs),
    );
  });
});
