export interface LanguageModelProps {
  examples: string[];
  ngramSize: number;
  topK: number;
  temperature: number;
  smoothing?: ModelSmoothingType;
}
export type ModelSmoothingType =
  | "none"
  | "laplace"
  | "backoff"
  | "interpolated";
