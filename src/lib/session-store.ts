import { QuizState } from "@/types/quiz";

const sessions = new Map<string, QuizState>();

export function getSession(id: string): QuizState | undefined {
  return sessions.get(id);
}

export function setSession(id: string, state: QuizState): void {
  sessions.set(id, state);
}
