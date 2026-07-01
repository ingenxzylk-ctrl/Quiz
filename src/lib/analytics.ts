import { AnalyticsEvent, Section } from "@/types/quiz";

const events: AnalyticsEvent[] = [];

export function trackEvent(
  event: string,
  sessionId: string,
  meta?: { questionId?: string; section?: Section }
) {
  const entry: AnalyticsEvent = {
    event,
    sessionId,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  events.push(entry);

  if (typeof window !== "undefined") {
    console.debug("[Analytics]", entry);
    window.dispatchEvent(new CustomEvent("quiz-analytics", { detail: entry }));
  }
}

export function trackQuestionView(sessionId: string, questionId: string, section: Section) {
  trackEvent("question_view", sessionId, { questionId, section });
}

export function trackQuestionAnswer(sessionId: string, questionId: string, section: Section) {
  trackEvent("question_answer", sessionId, { questionId, section });
}

export function trackDropOff(sessionId: string, questionId: string, section: Section) {
  trackEvent("drop_off", sessionId, { questionId, section });
}

export function trackSectionComplete(sessionId: string, section: Section) {
  trackEvent("section_complete", sessionId, { section });
}

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return [...events];
}
