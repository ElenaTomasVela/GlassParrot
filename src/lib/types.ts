export type SmoothOptions = "Laplace";

export interface LanguageModelProps {
  examples: string[];
  ngramSize: number;
  topK: number;
  temperature: number;
  smoothing?: SmoothOptions;
}
