import { useLanguageModel } from "@/lib/languageModel/languageModel";
import { dataPresets, type DataPreset } from "@/lib/modelPresets";
import type { ModelSmoothingType } from "@/lib/types";
import { cssvar, normalizePercentage, softmax, topKSelect } from "@/lib/utils";
import type { ChartData, ChartOptions } from "chart.js";
import { useEffect, useState } from "react";

export const useController = (defaultExampleIndex?: number) => {
  const defaultExample =
    defaultExampleIndex != undefined
      ? dataPresets[defaultExampleIndex]
      : { examples: [], inputData: "" };

  const {
    modelParams,
    addExample,
    compileModel,
    setNgramSize,
    setTemperature,
    setTopK,
    removeExample,
    removeAllExamples,
    setSmoothing,
    model,
    isTraining,
    setExamples,
  } = useLanguageModel(defaultExample.examples);

  const [modelInput, setModelInput] = useState(defaultExample.inputData);
  const [isAdvancedModeEnabled, setIsAdvancedModeEnabled] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const handleTrainingExampleSubmit = (data: FormData) => {
    const trainingExample = data.get("trainingExample");

    if (trainingExample && typeof trainingExample === "string") {
      addExample(trainingExample);
    }
  };

  const handleGenerateNextWord = () => {
    if (!model) return;

    setModelInput(
      (previous) =>
        previous.trim() + " " + model.generateNextWord(previous.toLowerCase()),
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

  const handleSmoothingChange = (smoothing: ModelSmoothingType) => {
    setSmoothing(smoothing);
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

  const handleSelectedPresetChange = (value: string) => {
    setSelectedPreset(Number(value));
  };

  const handleLoadPreset = () => {
    if (selectedPreset !== null) {
      const preset = dataPresets[selectedPreset];
      setModelInput(preset.inputData);
      setExamples(preset.examples);
    }
  };

  useEffect(() => {
    if (defaultExampleIndex !== undefined) {
      handleCompileModel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultExampleIndex]);

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

  const nextWordChartOptions: ChartOptions<"bar"> = {
    maintainAspectRatio: false,
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
        backgroundColor: cssvar("--chart-1"),
        barPercentage: 0.8,
      },
    ],
  };

  const nextWordStats =
    model?.getNextWordProbabilities(modelInput.toLowerCase()) || {};

  const nextWordBarData: ChartData<"bar"> = {
    labels: Object.keys(nextWordStats),
    datasets: [
      {
        data: normalizePercentage(Object.values(nextWordStats)),
        backgroundColor: cssvar("--chart-1"),
        barPercentage: 0.8,
      },
    ],
  };

  const nextWordPieData: ChartData<"pie"> = {
    labels: Object.keys(nextWordStats),
    datasets: [
      {
        data: normalizePercentage(Object.values(nextWordStats)),
        backgroundColor: [
          cssvar("--chart-1"),
          cssvar("--chart-2"),
          cssvar("--chart-3"),
          cssvar("--chart-4"),
          cssvar("--chart-5"),
        ],
      },
    ],
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
      nextWordChartOptions,
      nextWordPieData,
      isGenerateNextWordDisabled:
        !model ||
        !modelInput ||
        !Object.keys(nextWordStats).length ||
        (modelInput.trim().split(" ").length < modelParams.ngramSize &&
          modelParams.smoothing == "none"),
      isTrainingButtonDisabled: isTraining || !modelParams.examples.length,
      isTraining,
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
      handleSmoothingChange,
      handleCompileModel,
      handleSelectedPresetChange,
      handleLoadPreset,
    },
  };
};
