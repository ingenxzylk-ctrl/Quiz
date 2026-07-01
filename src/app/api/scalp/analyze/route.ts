import { NextRequest, NextResponse } from "next/server";
import { analyzeScalpImages } from "@/lib/scalp-analysis";
import { Gender } from "@/types/quiz";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { frontImage, topImage, gender, selfReportedStage, sessionId } = body;

  if (!frontImage || !topImage || !gender) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const analysis = await analyzeScalpImages({
      frontImage,
      topImage,
      gender: gender as Gender,
      selfReportedStage: selfReportedStage || "2",
    });

    // Log for QA/retraining
    console.info("[ScalpAnalysis]", {
      sessionId,
      modelVersion: analysis.modelVersion,
      predictedStage: analysis.predictedStage,
      confidence: analysis.confidence,
      mismatch: analysis.mismatchWithSelfReport,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    console.error("[ScalpAnalysis] API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
