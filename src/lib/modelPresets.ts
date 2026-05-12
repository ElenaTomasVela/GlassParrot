export interface DataPreset {
  title: string;
  inputData: string;
  examples: string[];
}

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
  {
    title: "Profesiones sesgadas de padres/madres",
    inputData: "Mi madre es",
    examples: [
      "Mi madre es enfermera.",
      "Mi padre es doctor.",
      "Mi padre es arquitecto.",
      "Su padre es albañil",
      "Su padre es ingeniero",
      "Su padre es mecánico",
      "Su padre es bombero",
      "Su padre es carpintero",
      "Tu padre es electricista",
      "Tu padre es deportista",
      "Tu padre es granjero",
      "Tu padre es pescador",
      "Tu padre es camionero",
      "Su padre es pintor",
      "Su padre es piloto",
      "Mi madre es azafata",
      "Mi madre es limpiadora",
      "Mi madre es dentista",
      "Mi madre es psicóloga",
      "Su madre es cocinera",
      "Su madre es ama de casa",
      "Su madre es secretaria",
      "Su madre es profesora",
    ],
  },
];
