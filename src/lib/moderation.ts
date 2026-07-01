import {
  extractJson,
  getGeminiModel,
  isGeminiConfigured,
  parseDataUrl,
} from "@/lib/gemini";

export interface ModerationResult {
  passed: boolean;
  reason?: string;
  hasScalp: boolean;
}

interface GeminiModerationResponse {
  passed: boolean;
  hasScalp: boolean;
  reason?: string;
}

const MODERATION_PROMPT = `You are a content safety filter for a medical hair & scalp health assessment app.

Analyze the provided image and respond with JSON only:
{
  "passed": boolean,
  "hasScalp": boolean,
  "reason": string
}

Rules:
- passed: false if the image contains NSFW content, nudity, violence, minors, or anything inappropriate
- passed: false if the image is NOT a photo of a human scalp, hairline, or top of head (e.g. blank, objects, pets, landscapes)
- passed: true only if it is an appropriate scalp/head photo suitable for hair loss assessment
- hasScalp: true if scalp, hairline, or crown is visible
- reason: short user-friendly message when passed is false (e.g. "Please upload a clear photo of your scalp only"); empty string when passed is true

Do not store or describe identifying features. Be strict on inappropriate content.`;

async function moderateWithGemini(imageDataUrl: string): Promise<ModerationResult> {
  const { mimeType, data } = parseDataUrl(imageDataUrl);
  const model = getGeminiModel({ json: true });

  const result = await model.generateContent([
    { text: MODERATION_PROMPT },
    { inlineData: { mimeType, data } },
  ]);

  const raw = result.response.text();
  const parsed = await extractJson<GeminiModerationResponse>(raw);

  if (!parsed.passed) {
    return {
      passed: false,
      hasScalp: parsed.hasScalp ?? false,
      reason:
        parsed.reason ||
        "This image couldn't be processed. Please upload a clear photo of your scalp only.",
    };
  }

  if (!parsed.hasScalp) {
    return {
      passed: false,
      hasScalp: false,
      reason:
        parsed.reason ||
        "We couldn't detect a scalp in this photo. Please upload a clear front or top view of your head.",
    };
  }

  return { passed: true, hasScalp: true };
}

/** Fallback when GEMINI_API_KEY is not set (local dev only). */
async function moderateWithHeuristics(imageDataUrl: string): Promise<ModerationResult> {
  if (!imageDataUrl.startsWith("data:image/")) {
    return { passed: false, reason: "Invalid image format", hasScalp: false };
  }

  await new Promise((r) => setTimeout(r, 200));

  const base64 = imageDataUrl.split(",")[1] || "";
  if (base64.length < 1000) {
    return {
      passed: false,
      reason: "This image couldn't be processed. Please upload a clear photo of your scalp only.",
      hasScalp: false,
    };
  }

  return { passed: true, hasScalp: true };
}

export async function moderateImage(imageDataUrl: string): Promise<ModerationResult> {
  if (!isGeminiConfigured()) {
    console.warn("[Moderation] GEMINI_API_KEY missing — using heuristic fallback");
    return moderateWithHeuristics(imageDataUrl);
  }

  try {
    return await moderateWithGemini(imageDataUrl);
  } catch (error) {
    console.error("[Moderation] Gemini error:", error);
    return {
      passed: false,
      hasScalp: false,
      reason: "We couldn't process this image right now. Please try again with a clear scalp photo.",
    };
  }
}
