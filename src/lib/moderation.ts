const NSFW_KEYWORDS = ["inappropriate", "nsfw"];

export interface ModerationResult {
  passed: boolean;
  reason?: string;
  hasScalp: boolean;
}

export async function moderateImage(imageDataUrl: string): Promise<ModerationResult> {
  // In production, call a hosted NSFW classifier (e.g., AWS Rekognition, Google Vision SafeSearch)
  // This mock uses basic heuristics on the data URL and image dimensions

  if (!imageDataUrl || !imageDataUrl.startsWith("data:image/")) {
    return { passed: false, reason: "Invalid image format", hasScalp: false };
  }

  // Simulate async API call
  await new Promise((r) => setTimeout(r, 300));

  const base64 = imageDataUrl.split(",")[1] || "";
  if (base64.length < 1000) {
    return {
      passed: false,
      reason: "This image couldn't be processed. Please upload a clear photo of your scalp only.",
      hasScalp: false,
    };
  }

  // Detect blank/solid-color images (very small payload relative to dimensions)
  const lower = imageDataUrl.toLowerCase();
  for (const kw of NSFW_KEYWORDS) {
    if (lower.includes(kw)) {
      return {
        passed: false,
        reason: "This image couldn't be processed. Please upload a clear photo of your scalp only.",
        hasScalp: false,
      };
    }
  }

  return { passed: true, hasScalp: true };
}
