import { useState } from "react";
import type { LanguageModelProps } from "./types";
import { LanguageModel } from "./languageModelClass";

export function useLanguageModel() {
  const [examples, setExamples] = useState<string[]>([]);
  const [ngramSize, setNgramSize] = useState(3);
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState(10);
  const [model, setModel] = useState<LanguageModel>();

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

  const compileModel = async () => {
    // TODO: Add a web worker to prevent UI hanging
    const model = await LanguageModel.compileModel(
      ngramSize,
      temperature,
      topK,
      examples,
    );
    setModel(model);
  };

  return {
    modelParams: {
      examples,
      ngramSize,
      temperature,
      topK,
    } as LanguageModelProps,
    model,
    addExample,
    removeExample,
    removeAllExamples,
    setNgramSize,
    setTemperature,
    setTopK,
    compileModel,
  };
}
