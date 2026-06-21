import type { Example } from "./types";

export interface DataPreset {
  title: string;
  inputData: string;
  examples: Example[];
}

export const dataPresets: DataPreset[] = [
  {
    title: "Hablando del tiempo",
    inputData: "Hoy el día está",
    examples: [
      { id: "0", example: "Parece que el día está soleado." },
      {
        id: "1",
        example: "Hoy el día está soleado. Es perfecto para salir a jugar.",
      },
      {
        id: "2",
        example:
          "Voy a sacar a pasear a mi perro, ahora que el día está soleado.",
      },
      { id: "3", example: "Hoy va a llover." },
      { id: "4", example: "Creo que mañana estará nublado." },
    ],
  },
  {
    title: "Los modelos de lenguaje no saben contar...",
    inputData: "La palabra ejemplo tiene",
    examples: [
      { id: "0", example: "La palabra fresa tiene 2 vocales." },
      { id: "1", example: "La palabra hiena tiene 3 vocales." },
      { id: "2", example: "La palabra ordenador tiene 4 vocales." },
      { id: "3", example: "La palabra botella tiene 3 vocales." },
      { id: "4", example: "La palabra auténtico tiene 5 vocales." },
    ],
  },
  {
    title: "Profesiones sesgadas de padres/madres",
    inputData: "Mi madre es",
    examples: [
      { id: "0", example: "Mi madre es enfermera." },
      { id: "1", example: "Mi padre es doctor." },
      { id: "2", example: "Mi padre es arquitecto." },
      { id: "3", example: "Su padre es albañil" },
      { id: "4", example: "Su padre es ingeniero" },
      { id: "5", example: "Su padre es mecánico" },
      { id: "6", example: "Su padre es bombero" },
      { id: "7", example: "Su padre es carpintero" },
      { id: "8", example: "Tu padre es electricista" },
      { id: "9", example: "Tu padre es deportista" },
      { id: "10", example: "Tu padre es granjero" },
      { id: "11", example: "Tu padre es pescador" },
      { id: "12", example: "Tu padre es camionero" },
      { id: "13", example: "Su padre es pintor" },
      { id: "14", example: "Su padre es piloto" },
      { id: "15", example: "Mi madre es azafata" },
      { id: "16", example: "Mi madre es limpiadora" },
      { id: "17", example: "Mi madre es dentista" },
      { id: "18", example: "Mi madre es psicóloga" },
      { id: "19", example: "Su madre es cocinera" },
      { id: "20", example: "Su madre es ama de casa" },
      { id: "21", example: "Su madre es secretaria" },
      { id: "22", example: "Su madre es profesora" },
    ],
  },
];
