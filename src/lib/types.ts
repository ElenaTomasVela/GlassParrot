export type SmoothOptions = "Laplace";

export interface LanguageModelProps {
  examples: string[];
  ngramSize: number;
  topP: number;
  temperature: number;
  smoothing?: SmoothOptions;
}
