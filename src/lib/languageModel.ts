import { useEffect, useRef, useState } from "react";
import type { LanguageModelProps } from "./types";
import { LanguageModel } from "./languageModelClass";
import { type ModelSmoothingType } from "./types";

export function useLanguageModel() {
  const [examples, setExamples] = useState<string[]>([]);
  const [ngramSize, setNgramSize] = useState(3);
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState(10);
  const [model, setModel] = useState<LanguageModel>();
  const [smoothing, setSmoothing] = useState<ModelSmoothingType>("backoff");
  const [isTraining, setIsTraining] = useState<boolean>(false);

  // Creating the worker in the hook allows cancelling
  const trainingWorkerRef = useRef<Worker>(null);

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

  const compileModel = () => {
    // TODO: Hook it up so it can be cancelled by the user
    trainingWorkerRef.current = new Worker(
      new URL("./modelTrainingWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    setIsTraining(true);
    const promise = LanguageModel.compileModel(
      ngramSize,
      temperature,
      topK,
      smoothing,
      examples,
      trainingWorkerRef.current,
    )
      .then((model) => {
        setModel(model);
        trainingWorkerRef.current = null;
        setIsTraining(false);
      })
      .catch(() => {
        trainingWorkerRef.current = null;
        setIsTraining(false);
      });
  };

  return {
    modelParams: {
      examples,
      ngramSize,
      temperature,
      topK,
      smoothing,
    } as LanguageModelProps,
    model,
    isTraining,
    addExample,
    removeExample,
    removeAllExamples,
    setNgramSize,
    setTemperature,
    setTopK,
    setSmoothing,
    compileModel,
  };
}
