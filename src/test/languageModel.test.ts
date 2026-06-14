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
  ngramSize: 1,
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
  "Models use N-gram size of %i correctly",
  async (ngramSize: number) => {
    const params: LanguageModelProps = {
      ...defaultParams,
      ngramSize: ngramSize,
    };

    const model = await createModel(params);

    const ngrams = Object.keys(model.model).map((s) => s.split(" "));

    ngrams.forEach((ngram) => expect(ngram).toBeArrayOfSize(ngramSize));
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
  const predictions = model.getNextWordProbabilities("test");
  const nPredicts = Object.keys(predictions).length;

  expect(nPredicts, `Expected to get ${topk} predictions but got ${nPredicts}`);
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
    const probabilities = model.getNextWordProbabilities("test");

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
      ngramSize: 3,
    };

    const model = await createModel(params);

    const singleWordProbs = model.getNextWordProbabilities("This");
    expect(Object.keys(singleWordProbs)).toBeEmpty();
  });

  test("Back-off", async () => {
    const params: LanguageModelProps = {
      ...defaultParams,
      smoothing: "backoff",
      ngramSize: 3,
    };

    const model = await createModel(params);

    const singleWordProbs = model.getNextWordProbabilities("very");
    expect(Object.keys(singleWordProbs)).toBeArrayOfSize(3);

    const firstMatchingProbs = model.getNextWordProbabilities("there is very");
    expect(Object.keys(firstMatchingProbs)).toBeArrayOfSize(1);
    expect(firstMatchingProbs).toContainKey("little");
  });

  test("Interpolated", async () => {
    const params: LanguageModelProps = {
      ...defaultParams,
      smoothing: "interpolated",
      ngramSize: 3,
    };

    const interpolatedModel = await createModel(params);
    const separateModels = await Promise.all(
      range(4, 1).map((ngramSize) =>
        createModel({ ...params, smoothing: "none", ngramSize }),
      ),
    );

    const singleWordProbs = interpolatedModel.getNextWordProbabilities("very");
    const singleWordProbsValues = Object.values(singleWordProbs);
    expect(Object.keys(singleWordProbs)).toBeArrayOfSize(3);
    expect(singleWordProbs).toContainAllKeys(["short", "little", "long"]);
    expect(
      singleWordProbsValues.every((v) => v === singleWordProbsValues[0]),
      `Expected all values in ${singleWordProbs} to be equal`,
    ).toBe(true);

    const interpolatedProbs =
      interpolatedModel.getNextWordProbabilities("that is very");
    expect(Object.keys(interpolatedProbs)).toBeArrayOfSize(3);
    expect(interpolatedProbs).toContainAllKeys(["short", "little", "long"]);

    const individualProbs = separateModels.map((model) =>
      normalizeRecordValues(model.getNextWordProbabilities("that is very")),
    );

    const averageIndivProbs = sumRecordValues(individualProbs);

    const normalizedInterpolatedProbs =
      normalizeRecordValues(interpolatedProbs);

    expect(normalizedInterpolatedProbs).toEqual(
      normalizeRecordValues(averageIndivProbs),
    );
  });
});
