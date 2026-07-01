import { QuizState } from "@/types/quiz";

const STORAGE_PREFIX = "hair-quiz-";

export function saveToLocal(sessionId: string, state: QuizState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${sessionId}`, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable
  }
}

export function loadFromLocal(sessionId: string): QuizState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${sessionId}`);
    return raw ? (JSON.parse(raw) as QuizState) : null;
  } catch {
    return null;
  }
}

export async function saveToServer(state: QuizState): Promise<{ resumeUrl: string }> {
  const res = await fetch("/api/quiz/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state),
  });
  if (!res.ok) throw new Error("Failed to save quiz");
  return res.json();
}

export async function loadFromServer(sessionId: string): Promise<QuizState | null> {
  const res = await fetch(`/api/quiz/resume/${sessionId}`);
  if (!res.ok) return null;
  return res.json();
}
