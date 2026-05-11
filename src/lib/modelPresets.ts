import type { LanguageModelProps } from "./types";

interface ModelExamplePreset {
  inputData: string;
  modelParams: LanguageModelProps;
}

interface DataPreset {
  title: string;
  inputData: string;
  examples: string[];
}

export const faceDescriptionPreset: ModelExamplePreset = {
  inputData: "",
  modelParams: {
    smoothing: "none",
    examples: ["El cielo es azul.", "Mi perro es negro."],
    ngramSize: 3,
    temperature: 0.3,
    topK: 10,
  },
};

export const dataPresets: DataPreset[] = [
  {
    title: "Hablando del tiempo",
    inputData: "Hoy el día está",
    examples: [
      "Parece que el día está soleado.",
      "Hoy el día está soleado. Es perfecto para salir a jugar.",
      "Voy a sacar a pasear a mi perro, ahora que el día está soleado.",
      "Hoy va a llover.",
      "Creo que mañana estará nublado.",
    ],
  },
  {
    title: "Los modelos de lenguaje no saben contar...",
    inputData: "La palabra ejemplo tiene",
    examples: [
      "La palabra fresa tiene 2 vocales.",
      "La palabra hiena tiene 3 vocales.",
      "La palabra ordenador tiene 4 vocales.",
      "La palabra botella tiene 3 vocales.",
      "La palabra auténtico tiene 5 vocales.",
    ],
  },
];
