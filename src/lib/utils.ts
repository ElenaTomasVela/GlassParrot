import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cssvar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

export function normalize(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min == max) {
    return values.map(() => 0.5);
  }

  return values.map((v) => (v - min) / (max - min));
}

export function normalizeRecordValues(
  record: Record<string, number>,
): Record<string, number> {
  const values = Object.values(record);

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min == max) {
    return Object.fromEntries(Object.entries(record).map(([k]) => [k, 0.5]));
  }

  return Object.fromEntries(
    Object.entries(record).map(([k, v]) => [k, (v - min) / (max - min)]),
  );
}

function aggregateRecords(records: Record<string, number>[]) {
  const unifiedRecords: Record<string, number[]> = {};
  records.forEach((record) => {
    Object.entries(record).forEach(([k, v]) => {
      unifiedRecords[k] ||= [];
      unifiedRecords[k].push(v);
    });
  });

  return unifiedRecords;
}

export function sumRecordValues(records: Record<string, number>[]) {
  const unifiedRecords = aggregateRecords(records);

  return Object.fromEntries(
    Object.entries(unifiedRecords).map(([k, v]) => [k, sum(v)]),
  );
}

export function range(stop: number, start: number = 0) {
  return Array.from({ length: stop - start }, (_, k) => k + start);
}

function sum(numbers: number[]) {
  return numbers.reduce((a, b) => a + b, 0);
}

function mean(numbers: number[]) {
  return sum(numbers) / numbers.length;
}

export function stdDeviation(numbers: number[]) {
  const n = numbers.length;
  const mean = sum(numbers) / n;
  return Math.sqrt(sum(numbers.map((x) => Math.pow(x - mean, 2))));
}

export function coefVariation(numbers: number[]) {
  const mn = mean(numbers);
  const stddev = stdDeviation(numbers);
  return stddev / mn;
}

export function getTrailingWordsAsString(input: string, number: number) {
  const words = input.trim().split(/ +/);

  return words.slice(-number).join(" ");
}

export function getBeginningWordsAsString(input: string, number: number) {
  const words = input.trim().split(/ +/);

  return words.slice(0, -number - 1).join(" ");
}

export function tokenizeWords(input: string) {
  return input.toLowerCase().match(/[a-zA-ZÀ-ÿ0-9]+/g);
}

function binarySearchThreshold(sortedArray: number[], target: number) {
  let start = 0;
  let end = sortedArray.length - 1;
  let result = -1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);

    if (sortedArray[mid] < target) {
      start = mid + 1;
    } else {
      end = mid - 1;
      result = mid;
    }
  }

  return result;
}

export function weightedChoice(weightRecord: Record<string, number>) {
  const weights = Object.values(weightRecord);
  const weightSum = weights.reduce((prev, next) => prev + next, 0);

  const choice = Math.random() * weightSum;

  let sum = 0;
  const cumulSums = weights.map((n) => (sum += n));

  const chosenPosition = binarySearchThreshold(cumulSums, choice);

  return chosenPosition;
}

// Functions used for calculating graphics

export function normalizePercentage(values: number[]) {
  const sum = values.reduce((prev, current) => prev + current, 0);

  return values.map((v) => (v / sum) * 100);
}

// Functions used for example graphics only

export function softmax(values: number[], temperature: number) {
  const beta = 1 / temperature;

  return values.map((v) => Math.pow(v, beta));
}

export function topKSelect(values: number[], topP: number) {
  return values.map((v, i) => (i < topP ? v : 0));
}
