import { useState } from "react";
import type { LanguageModelProps } from "./types";
import { getTrailingWordsAsString } from "./utils";

export function useLanguageModel() {
  const [examples, setExamples] = useState<string[]>([]);
  const [ngramSize, setNgramSize] = useState(3);
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(10);
  const [compiledModel, setCompiledModel] = useState<
    Record<string, Record<string, number>>
  >({});

  const addExample = (example: string) => {
    setExamples((previous) => [...previous, example]);
  };

  const removeExample = (index: number) => {
    const filteredExamples = examples.filter((_, i) => index !== i);
    setExamples(filteredExamples);
  };

  const removeAllExamples = () => {
    setExamples([]);
  };

  const getNextWordProbabilities = (input: string) => {
    const truncatedInput = getTrailingWordsAsString(input, 1);

    return compiledModel[truncatedInput] || {};
  };

  const generateNextWord = (input: string) => {
    // TODO: Add binary search and random choosing
    //
    const truncatedInput = getTrailingWordsAsString(input, 1);
    const possibilities = compiledModel[truncatedInput] || {};

    if (!Object.keys(possibilities).length) {
      return "palabra";
    }

    const chosenPosition = Math.floor(
      Math.random() * Object.keys(possibilities).length,
    );

    return Object.keys(possibilities)[chosenPosition];
  };

  const compileModel = (examples: string[]) => {
    setCompiledModel({
      palabra: {
        test: 48,
        prueba: 12,
      },
      test: {
        palabra: 5,
        prueba: 9,
      },
      prueba: {
        palabra: 10,
        test: 7,
      },
    });
  };

  return {
    modelParams: {
      examples,
      ngramSize,
      temperature,
      topP,
      // smoothing
    } as LanguageModelProps,
    isModelAvailable: !!Object.keys(compiledModel).length,
    addExample,
    removeExample,
    removeAllExamples,
    getNextWordProbabilities,
    generateNextWord,
    setNgramSize,
    setTemperature,
    setTopP,
    compileModel,
  };
}
