import { useRef, useState } from "react";
import type { Example, LanguageModelProps, ModelSmoothingType } from "../types";
import { LanguageModel } from "./languageModelClass";

export function useLanguageModel(defaultExamples: Example[] = []) {
  const [examples, setExamples] = useState<Example[]>(defaultExamples);
  const [ngramSize, setNgramSize] = useState(3);
  const [temperature, setTemperature] = useState(1);
  const [topK, setTopK] = useState(10);
  const [model, setModel] = useState<LanguageModel>();
  const [smoothing, setSmoothing] = useState<ModelSmoothingType>("backoff");
  const [isTraining, setIsTraining] = useState<boolean>(false);

  // Creating the worker in the hook allows cancelling
  const trainingWorkerRef = useRef<Worker>(null);

  const addExample = (example: string) => {
    setExamples((previous) => [
      ...previous,
      { id: crypto.randomUUID(), example },
    ]);
  };

  const removeExample = (id: string) => {
    const filteredExamples = examples.filter((e) => e.id !== id);
    setExamples(filteredExamples);
  };

  const removeAllExamples = () => {
    setExamples([]);
  };

  const compileModel = () => {
    trainingWorkerRef.current = new Worker(
      new URL("./modelTrainingWorker.ts", import.meta.url),
      {
        type: "module",
      },
    );

    setIsTraining(true);
    const props: LanguageModelProps = {
      ngramSize,
      temperature,
      topK,
      smoothing,
      examples: examples.map((e) => e.example),
    };
    LanguageModel.compileModel(props, trainingWorkerRef.current)
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
    },
    model,
    isTraining,
    addExample,
    setExamples,
    removeExample,
    removeAllExamples,
    setNgramSize,
    setTemperature,
    setTopK,
    setSmoothing,
    compileModel,
  };
}
