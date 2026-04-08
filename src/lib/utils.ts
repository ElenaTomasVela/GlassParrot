import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cssvar(name: string) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}


export function softmax(values: number[], temperature: number) {
  const beta = 1 / temperature;

  return values.map((v) => Math.pow(v, beta));
}

export function topKSelect(values: number[], topP: number) {
  return values.map((v, i) => (i < topP ? v : 0));
}

export function normalize(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min == max) {
    return values.map((v) => 0.5);
  }

  return values.map((v) => (v - min) / (max - min));
}

export function normalizePercentage(values: number[]) {
  const sum = values.reduce((prev, current) => prev + current, 0);

  return values.map((v) => (v / sum) * 100);
}

export function getTrailingWordsAsString(input: string, number: number) {
  const words = input.trim().split(" ");

  return words.slice(-number).join(" ");
}

export function tokenizeWords(input: string) {
  return input.toLowerCase().match(/\w+/g);
}

export function weightedChoice(weightRecord: Record<string, number>) {
  const weights = Object.values(weightRecord);
  const weightSum = weights.reduce((prev, next) => prev + next, 0);

  const choice = Math.random() * weightSum;

  let sum = 0;
  const cumulSums = weights.map((n) => (sum += n));

  // TODO: Add binary search
  const chosenPosition = cumulSums.findIndex((n) => n >= choice);

  return chosenPosition;
}
