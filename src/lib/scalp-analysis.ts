import { Gender } from "@/types/quiz";
import {
  computeMismatch,
  CONFIDENCE_THRESHOLD,
  extractJson,
  femalePatternToNum,
  GEMINI_MODEL_VERSION,
  getGeminiModel,
  isGeminiConfigured,
  ludwigToNumber,
  parseDataUrl,
} from "@/lib/gemini";

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
  reasoning?: string;
}

interface GeminiScalpResponse {
  predictedStage: string;
  confidence: number;
  reasoning?: string;
}

function buildAnalysisPrompt(gender: Gender, selfReportedStage: string): string {
  if (gender === "male") {
    return `You are a trichology expert analyzing male pattern hair loss from two scalp photos: front/hairline view and top/crown view.

Classify using the Norwood-Hamilton scale (stages 1–7):
- Stage 1: No significant recession
- Stage 2: Slight temple recession
- Stage 3: Deep temple recession
- Stage 4: Crown thinning, frontal loss
- Stage 5–7: Progressive merging and extensive loss

The user self-reported Norwood stage: ${selfReportedStage} (use for reference only; base your answer on the images).

Respond with JSON only:
{
  "predictedStage": "1" to "7" as a string,
  "confidence": number between 0 and 1,
  "reasoning": "brief clinical observation (1-2 sentences)"
}`;
  }

  return `You are a trichology expert analyzing female hair loss from two scalp photos: front view and top/parting view.

Classify using the Ludwig scale:
- Stage I: Mild diffuse thinning on crown
- Stage II: Moderate thinning, wider part
- Stage III: Advanced diffuse thinning

The user self-reported hair pattern ID: ${selfReportedStage} (use for reference only; base your answer on the images).

Respond with JSON only:
{
  "predictedStage": "I", "II", or "III",
  "confidence": number between 0 and 1,
  "reasoning": "brief clinical observation (1-2 sentences)"
}`;
}

function normalizeStage(raw: string, gender: Gender): string {
  if (gender === "male") {
    const n = Math.min(7, Math.max(1, parseInt(raw, 10) || 2));
    return String(n);
  }
  const upper = raw.toUpperCase().replace(/STAGE\s*/i, "").trim();
  if (["I", "II", "III"].includes(upper)) return upper;
  const num = parseInt(upper, 10);
  if (num >= 1 && num <= 3) return ["I", "II", "III"][num - 1];
  return "II";
}

function clampConfidence(value: number): number {
  if (Number.isNaN(value)) return 0.5;
  return Math.round(Math.min(1, Math.max(0, value)) * 100) / 100;
}

async function analyzeWithGemini(input: ScalpAnalysisInput): Promise<ScalpAnalysisOutput> {
  const front = parseDataUrl(input.frontImage);
  const top = parseDataUrl(input.topImage);
  const model = getGeminiModel({ json: true });
  const prompt = buildAnalysisPrompt(input.gender, input.selfReportedStage);

  const result = await model.generateContent([
    { text: prompt },
    { text: "Image 1 — front / hairline view:" },
    { inlineData: { mimeType: front.mimeType, data: front.data } },
    { text: "Image 2 — top / crown view:" },
    { inlineData: { mimeType: top.mimeType, data: top.data } },
  ]);

  const raw = result.response.text();
  const parsed = await extractJson<GeminiScalpResponse>(raw);

  const predictedStage = normalizeStage(parsed.predictedStage, input.gender);
  const confidence = clampConfidence(parsed.confidence);

  return {
    predictedStage,
    confidence,
    modelVersion: GEMINI_MODEL_VERSION,
    scale: input.gender === "male" ? "norwood" : "ludwig",
    mismatchWithSelfReport: computeMismatch(
      predictedStage,
      input.selfReportedStage,
      input.gender
    ),
    lowConfidence: confidence < CONFIDENCE_THRESHOLD,
    reasoning: parsed.reasoning,
  };
}

/** Deterministic fallback when GEMINI_API_KEY is not configured. */
async function analyzeWithHeuristics(input: ScalpAnalysisInput): Promise<ScalpAnalysisOutput> {
  await new Promise((r) => setTimeout(r, 500));

  const hashSample = (img: string) => {
    let hash = 0;
    const sample = img.slice(100, 500);
    for (let i = 0; i < sample.length; i++) {
      hash = ((hash << 5) - hash + sample.charCodeAt(i)) | 0;
    }
    return Math.abs(hash % 100) / 100;
  };

  const frontN = hashSample(input.frontImage);
  const topN = hashSample(input.topImage);
  const avg = (frontN + topN) / 2;

  const stageNum =
    input.gender === "male"
      ? Math.min(7, Math.max(1, Math.floor(avg * 7) + 1))
      : Math.min(3, Math.max(1, Math.floor(avg * 3) + 1));

  const predictedStage =
    input.gender === "male" ? String(stageNum) : ["I", "II", "III"][stageNum - 1];

  const confidence = clampConfidence(0.55 + avg * 0.25);

  return {
    predictedStage,
    confidence,
    modelVersion: "heuristic-fallback-v1",
    scale: input.gender === "male" ? "norwood" : "ludwig",
    mismatchWithSelfReport: computeMismatch(
      predictedStage,
      input.selfReportedStage,
      input.gender
    ),
    lowConfidence: true,
    reasoning: "Heuristic fallback — set GEMINI_API_KEY for real vision analysis.",
  };
}

export async function analyzeScalpImages(input: ScalpAnalysisInput): Promise<ScalpAnalysisOutput> {
  if (!isGeminiConfigured()) {
    console.warn("[ScalpAnalysis] GEMINI_API_KEY missing — using heuristic fallback");
    return analyzeWithHeuristics(input);
  }

  try {
    return await analyzeWithGemini(input);
  } catch (error) {
    console.error("[ScalpAnalysis] Gemini error:", error);
    throw new Error(
      "Scalp analysis failed. Please check your API key and try again."
    );
  }
}

// Re-export for result-engine compatibility
export { femalePatternToNum, ludwigToNumber };
