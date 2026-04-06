import { useLanguageModel } from "@/lib/languageModel";
import {
  normalize,
  normalizePercentage,
  softmax,
  topKSelect,
} from "@/lib/utils";
import type { ChartData, ChartOptions } from "chart.js";
import { useRef, useState, useTransition, type ChangeEvent } from "react";

export const useController = () => {
  const {
    modelParams,
    addExample,
    compileModel,
    setNgramSize,
    setTemperature,
    setTopK,
    removeExample,
    removeAllExamples,
    model,
  } = useLanguageModel();

  const [modelInput, setModelInput] = useState("");
  const [isAdvancedModeEnabled, setIsAdvancedModeEnabled] = useState(false);

  const handleTrainingExampleSubmit = (data: FormData) => {
    const trainingExample = data.get("trainingExample");

    if (trainingExample && typeof trainingExample === "string") {
      addExample(trainingExample);
    }
  };

  const handleGenerateNextWord = () => {
    if (!model) return;

    setModelInput(
      (previous) => previous + " " + model.generateNextWord(previous),
    );
  };

  const handleModelInputChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setModelInput(event.target.value);
  };

  const handleNgramSizeChange = ([ngramSize]: [number]) => {
    setNgramSize(ngramSize);
  };

  const handleTemperatureChange = ([temperature]: [number]) => {
    setTemperature(temperature);
  };

  const handleTopKChange = ([topP]: [number]) => {
    setTopK(topP);
  };

  const handleUploadedFiles = (contents: string[]) => {
    contents.forEach((text) => {
      addExample(text);
    });
  };

  const handleDeleteAllExamples = (event: React.MouseEvent) => {
    event.preventDefault();
    removeAllExamples();
  };

  const handleCompileModel = async () => {
    compileModel();
  };

  const exampleChartOptions: ChartOptions<"bar"> = {
    indexAxis: "y",
    layout: {
      padding: 0,
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false } },
    },
  };

  const exampleDataArray = [9, 7, 5, 4, 4, 4, 3, 2, 1, 0];

  const exampleData: ChartData<"bar"> = {
    labels: [
      "azul",
      "nublado",
      "despejado",
      "bonito",
      "del",
      "gris",
      "claro",
      "oscuro",
      "lluvioso",
      "en",
    ],
    datasets: [
      {
        data: normalizePercentage(
          softmax(
            topKSelect(exampleDataArray, modelParams.topK),
            modelParams.temperature,
          ),
        ),
        backgroundColor: "#0060f0",
        barPercentage: 0.8,
      },
    ],
  };

  const nextWordStats = model?.getNextWordProbabilities(modelInput) || {};

  const nextWordBarData: ChartData<"bar"> = {
    labels: Object.keys(nextWordStats),
    datasets: [
      {
        data: normalizePercentage(Object.values(nextWordStats)),
        backgroundColor: "#0060f0",
        barPercentage: 0.8,
      },
    ],
  };

  const nextWordPieData: ChartData<"pie"> = {
    labels: Object.keys(nextWordStats),
    datasets: [{ data: normalizePercentage(Object.values(nextWordStats)) }],
  };

  return {
    data: {
      model,
      modelParams,
      modelInput,
      isAdvancedModeEnabled,
      exampleData,
      exampleChartOptions,
      nextWordBarData,
      nextWordPieData,
      isGenerateNextWordDisabled:
        !model ||
        !modelInput ||
        modelInput.trim().split(" ").length < modelParams.ngramSize,
    },
    actions: {
      removeExample,
      handleTrainingExampleSubmit,
      modelInput,
      setModelInput,
      handleGenerateNextWord,
      handleModelInputChange,
      setIsAdvancedModeEnabled,
      handleNgramSizeChange,
      handleDeleteAllExamples,
      handleUploadedFiles,
      handleTemperatureChange,
      handleTopKChange,
      handleCompileModel,
    },
  };
};
