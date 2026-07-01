import { Gender } from "@/types/quiz";

const CONFIDENCE_THRESHOLD = 0.7;
const MOCK_MODEL_VERSION = "scalp-classifier-mock-v1.2.0";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

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

function ludwigLabel(n: number): string {
  return ["I", "II", "III"][n - 1] || "II";
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

function selfReportedToNumber(selfReportedStage: string, gender: Gender): number {
  return gender === "male"
    ? parseInt(selfReportedStage, 10) || 2
    : femalePatternToNum(selfReportedStage);
}

/** Convert a validated stage number into the label used by the rest of the app. */
function stageToLabel(stage: number, gender: Gender): string {
  return gender === "male" ? String(stage) : ludwigLabel(stage);
}

function buildOutput(
  stageNumber: number,
  confidence: number,
  modelVersion: string,
  input: ScalpAnalysisInput
): ScalpAnalysisOutput {
  const maxStage = input.gender === "male" ? 7 : 3;
  const stage = Math.min(maxStage, Math.max(1, Math.round(stageNumber)));
  const clampedConfidence = Math.min(1, Math.max(0, confidence));
  const selfNum = selfReportedToNumber(input.selfReportedStage, input.gender);

  return {
    predictedStage: stageToLabel(stage, input.gender),
    confidence: Math.round(clampedConfidence * 100) / 100,
    modelVersion,
    scale: input.gender === "male" ? "norwood" : "ludwig",
    mismatchWithSelfReport: Math.abs(stage - selfNum) >= 2,
    lowConfidence: clampedConfidence < CONFIDENCE_THRESHOLD,
  };
}

// ---------------------------------------------------------------------------
// Gemini-powered analysis
// ---------------------------------------------------------------------------

interface ParsedImage {
  mimeType: string;
  data: string;
}

/** Split a data URL (`data:image/jpeg;base64,....`) into mime type + raw base64. */
function parseDataUrl(dataUrl: string): ParsedImage | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,([\s\S]+)$/.exec(dataUrl || "");
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

interface GeminiScalpResult {
  isScalp: boolean;
  stageNumber: number;
  confidence: number;
  reasoning?: string;
}

function buildPrompt(gender: Gender): string {
  if (gender === "male") {
    return [
      "You are a trichology assistant analyzing two photos of a person's scalp (a front/hairline view and a top/crown view).",
      "Classify the hair-loss severity using the Norwood-Hamilton scale from 1 to 7:",
      "1 = no visible hair loss; 2 = slight temple recession; 3 = deeper frontal/temporal recession;",
      "4 = pronounced recession plus early crown thinning; 5 = larger balding regions with a narrowing bridge;",
      "6 = the bridge is gone, front and crown areas merge; 7 = only a band of hair remains around the sides/back.",
      "Set isScalp to false if the images do not clearly show a human scalp/head.",
      "Return stageNumber (1-7), a confidence between 0 and 1 reflecting image quality and certainty, and brief reasoning.",
    ].join(" ");
  }
  return [
    "You are a trichology assistant analyzing two photos of a person's scalp (a front/part view and a top/crown view).",
    "Classify female-pattern hair loss using the Ludwig scale as a number from 1 to 3:",
    "1 = mild diffuse thinning with slight widening of the part; 2 = moderate diffuse thinning, clearly wider part;",
    "3 = advanced diffuse thinning with visible scalp across the crown.",
    "Set isScalp to false if the images do not clearly show a human scalp/head.",
    "Return stageNumber (1-3), a confidence between 0 and 1 reflecting image quality and certainty, and brief reasoning.",
  ].join(" ");
}

async function analyzeWithGemini(
  input: ScalpAnalysisInput,
  apiKey: string
): Promise<ScalpAnalysisOutput> {
  const front = parseDataUrl(input.frontImage);
  const top = parseDataUrl(input.topImage);
  if (!front || !top) {
    throw new Error("Images must be base64 data URLs");
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const maxStage = input.gender === "male" ? 7 : 3;

  const body = {
    contents: [
      {
        parts: [
          { text: buildPrompt(input.gender) },
          { text: "Photo 1 — front/hairline view:" },
          { inlineData: { mimeType: front.mimeType, data: front.data } },
          { text: "Photo 2 — top/crown view:" },
          { inlineData: { mimeType: top.mimeType, data: top.data } },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          isScalp: { type: "boolean" },
          stageNumber: { type: "integer" },
          confidence: { type: "number" },
          reasoning: { type: "string" },
        },
        required: ["isScalp", "stageNumber", "confidence"],
      },
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Gemini API error ${response.status}: ${detail.slice(0, 500)}`);
  }

  const payload = await response.json();
  const text: string | undefined =
    payload?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("") || undefined;

  if (!text) {
    throw new Error("Gemini returned no content");
  }

  const parsed = JSON.parse(text) as GeminiScalpResult;

  // A non-scalp image can't be reliably staged — surface it as low confidence.
  const confidence = parsed.isScalp ? parsed.confidence : Math.min(parsed.confidence, 0.3);
  const stage = Math.min(maxStage, Math.max(1, Math.round(parsed.stageNumber)));

  return buildOutput(stage, confidence, model, input);
}

// ---------------------------------------------------------------------------
// Deterministic mock (fallback when no API key is configured or Gemini fails)
// ---------------------------------------------------------------------------

function estimateStageFromImageData(
  imageData: string,
  gender: Gender
): { stage: number; confidence: number } {
  let hash = 0;
  const sample = imageData.slice(100, 500);
  for (let i = 0; i < sample.length; i++) {
    hash = ((hash << 5) - hash + sample.charCodeAt(i)) | 0;
  }
  const normalized = Math.abs(hash % 100) / 100;

  if (gender === "male") {
    const stage = Math.min(7, Math.max(1, Math.floor(normalized * 7) + 1));
    return { stage, confidence: 0.55 + normalized * 0.4 };
  }

  const stage = Math.min(3, Math.max(1, Math.floor(normalized * 3) + 1));
  return { stage, confidence: 0.55 + normalized * 0.4 };
}

function mockAnalyze(input: ScalpAnalysisInput): ScalpAnalysisOutput {
  const front = estimateStageFromImageData(input.frontImage, input.gender);
  const top = estimateStageFromImageData(input.topImage, input.gender);
  const avgStage = Math.round((front.stage + top.stage) / 2);
  const avgConfidence = (front.confidence + top.confidence) / 2;

  return buildOutput(avgStage, avgConfidence, MOCK_MODEL_VERSION, input);
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export async function analyzeScalpImages(
  input: ScalpAnalysisInput
): Promise<ScalpAnalysisOutput> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      return await analyzeWithGemini(input, apiKey);
    } catch (err) {
      console.error(
        "[ScalpAnalysis] Gemini analysis failed, falling back to heuristic:",
        err instanceof Error ? err.message : err
      );
    }
  }

  // No key configured (or Gemini failed): keep the app functional with the mock.
  await new Promise((r) => setTimeout(r, 400));
  return mockAnalyze(input);
}
