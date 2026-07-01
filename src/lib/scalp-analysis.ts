import { Gender } from "@/types/quiz";

const MODEL_VERSION = "scalp-classifier-v1.2.0";
const CONFIDENCE_THRESHOLD = 0.7;

export interface ScalpAnalysisInput {
  frontImage: string;
  topImage: string;
  gender: Gender;
  selfReportedStage: string;
}

export interface ScalpAnalysisOutput {
  predictedStage: string;
  confidence: number;
  modelVersion: string;
  scale: "norwood" | "ludwig";
  mismatchWithSelfReport: boolean;
  lowConfidence: boolean;
}

function estimateStageFromImageData(imageData: string, gender: Gender): { stage: number; confidence: number } {
  // Mock CNN inference: derive pseudo-random but deterministic stage from image hash
  let hash = 0;
  const sample = imageData.slice(100, 500);
  for (let i = 0; i < sample.length; i++) {
    hash = ((hash << 5) - hash + sample.charCodeAt(i)) | 0;
  }
  const normalized = Math.abs(hash % 100) / 100;

  if (gender === "male") {
    const stage = Math.min(7, Math.max(1, Math.floor(normalized * 7) + 1));
    const confidence = 0.55 + normalized * 0.4;
    return { stage, confidence };
  }

  const stage = Math.min(3, Math.max(1, Math.floor(normalized * 3) + 1));
  const confidence = 0.55 + normalized * 0.4;
  return { stage, confidence };
}

function ludwigLabel(n: number): string {
  return ["I", "II", "III"][n - 1] || "II";
}

export async function analyzeScalpImages(input: ScalpAnalysisInput): Promise<ScalpAnalysisOutput> {
  await new Promise((r) => setTimeout(r, 800));

  const front = estimateStageFromImageData(input.frontImage, input.gender);
  const top = estimateStageFromImageData(input.topImage, input.gender);
  const avgStage = Math.round((front.stage + top.stage) / 2);
  const avgConfidence = (front.confidence + top.confidence) / 2;

  const predictedStage =
    input.gender === "male" ? String(avgStage) : ludwigLabel(avgStage);

  const selfNum =
    input.gender === "male"
      ? parseInt(input.selfReportedStage, 10)
      : femalePatternToNum(input.selfReportedStage);

  const mismatch = Math.abs(avgStage - selfNum) >= 2;

  return {
    predictedStage,
    confidence: Math.round(avgConfidence * 100) / 100,
    modelVersion: MODEL_VERSION,
    scale: input.gender === "male" ? "norwood" : "ludwig",
    mismatchWithSelfReport: mismatch,
    lowConfidence: avgConfidence < CONFIDENCE_THRESHOLD,
  };
}

function femalePatternToNum(pattern: string): number {
  const map: Record<string, number> = {
    volume_reduced: 1,
    side_thinning: 2,
    widening_partition: 2,
    coin_patch: 3,
  };
  return map[pattern] || 2;
}
