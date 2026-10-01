export interface LanguageModelProps {
  examples: string[];
  contextSize: number;
  topK: number;
  temperature: number;
  smoothing: ModelSmoothingType;
}
export type ModelSmoothingType = "none" | "backoff" | "interpolated";

export interface Example {
  id: string;
  example: string;
}
