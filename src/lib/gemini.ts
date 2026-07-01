import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { Gender } from "@/types/quiz";

export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
export const GEMINI_MODEL_VERSION = `gemini:${GEMINI_MODEL}`;
export const CONFIDENCE_THRESHOLD = 0.7;

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to .env.local (see .env.example)."
    );
  }
  return key;
}

export function getGeminiModel(options?: { json?: boolean }): GenerativeModel {
  const genAI = new GoogleGenerativeAI(getGeminiApiKey());
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: {
      temperature: 0.2,
      ...(options?.json ? { responseMimeType: "application/json" } : {}),
    },
  });
}

export interface ParsedImage {
  mimeType: string;
  data: string;
}

export function parseDataUrl(dataUrl: string): ParsedImage {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid image data URL");
  }
  return { mimeType: match[1], data: match[2] };
}

export function femalePatternToNum(pattern: string): number {
  const map: Record<string, number> = {
    volume_reduced: 1,
    side_thinning: 2,
    widening_partition: 2,
    coin_patch: 3,
  };
  return map[pattern] || 2;
}

export function ludwigToNumber(stage: string): number {
  const map: Record<string, number> = { I: 1, II: 2, III: 3 };
  return map[stage.toUpperCase()] || 2;
}

export function computeMismatch(
  predictedStage: string,
  selfReportedStage: string,
  gender: Gender
): boolean {
  const aiNum =
    gender === "male" ? parseInt(predictedStage, 10) : ludwigToNumber(predictedStage);
  const selfNum =
    gender === "male"
      ? parseInt(selfReportedStage, 10)
      : femalePatternToNum(selfReportedStage);
  if (Number.isNaN(aiNum) || Number.isNaN(selfNum)) return false;
  return Math.abs(aiNum - selfNum) >= 2;
}

export async function extractJson<T>(text: string): Promise<T> {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed) as T;
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return valid JSON");
    return JSON.parse(match[0]) as T;
  }
}
