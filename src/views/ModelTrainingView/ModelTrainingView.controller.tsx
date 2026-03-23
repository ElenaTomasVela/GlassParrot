import { useLanguageModel } from "@/lib/languageModel";
import {
  normalize,
  normalizePercentage,
  softmax,
  topPSelect,
} from "@/lib/utils";
import type { ChartData, ChartOptions } from "chart.js";
import { useRef, useState, type ChangeEvent } from "react";

export const useController = () => {
  const {
    modelParams,
    addExample,
    generateNextWord,
    getNextWordProbabilities,
    isModelAvailable,
    compileModel,
    setNgramSize,
    setTemperature,
    setTopP,
    removeExample,
    removeAllExamples,
  } = useLanguageModel();

  const [modelInput, setModelInput] = useState("");
  const [isAdvancedModeEnabled, setIsAdvancedModeEnabled] = useState(false);

  const handleTrainingExampleSubmit = (data: FormData) => {
    const trainingExample = data.get("trainingExample");

    if (trainingExample && typeof trainingExample === "string") {
      addExample(trainingExample);
    }
  };

  const handleTrainModel = () => {
    compileModel(modelParams.examples);
  };

  const handleGenerateNextWord = () => {
    setModelInput((previous) => previous + " " + generateNextWord(previous));
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

  const handleTopPChange = ([topP]: [number]) => {
    setTopP(topP);
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
            topPSelect(exampleDataArray, modelParams.topP),
            modelParams.temperature,
          ),
        ),
        // data: softmax(
        //   topPSelect(exampleDataArray, modelParams.topP),
        //   modelParams.temperature,
        // ),
        backgroundColor: "#0060f0",
        barPercentage: 0.8,
      },
    ],
  };

  const nextWordStats = getNextWordProbabilities(modelInput);

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

  const nextWordPieOptions: ChartOptions<"pie"> = {
    plugins: {
      // colors: {
      //   enabled: true,
      // },
    },
  };

  const nextWordPieData: ChartData<"pie"> = {
    labels: Object.keys(nextWordStats),
    datasets: [{ data: normalizePercentage(Object.values(nextWordStats)) }],
  };

  return {
    data: {
      modelParams,
      modelInput,
      isAdvancedModeEnabled,
      exampleData,
      exampleChartOptions,
      nextWordBarData,
      nextWordPieData,
      nextWordPieOptions,
      isGenerateNextWordDisabled:
        !isModelAvailable ||
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
      handleTopPChange,
      handleTrainModel,
    },
  };
};
