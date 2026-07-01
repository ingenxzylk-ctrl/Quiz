import { NextRequest, NextResponse } from "next/server";
import { QuizState } from "@/types/quiz";
import { setSession } from "@/lib/session-store";

export async function POST(request: NextRequest) {
  const state: QuizState = await request.json();
  setSession(state.sessionId, state);

  const baseUrl = request.nextUrl.origin;
  const resumeUrl = `${baseUrl}/quiz/resume/${state.sessionId}`;

  return NextResponse.json({ success: true, resumeUrl, sessionId: state.sessionId });
}
