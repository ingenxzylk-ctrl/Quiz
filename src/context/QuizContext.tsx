"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AboutMeData,
  AIAnalysisResult,
  Gender,
  QuizAnswer,
  QuizResult,
  QuizState,
  ScalpImage,
  Section,
} from "@/types/quiz";
import { saveToLocal, saveToServer } from "@/lib/storage";
import { trackSectionComplete, trackQuestionAnswer } from "@/lib/analytics";
import { generateResult } from "@/lib/result-engine";

interface QuizContextValue {
  state: QuizState;
  gender: Gender | null;
  setAboutMe: (data: Partial<AboutMeData>) => void;
  setAnswer: (answer: QuizAnswer) => void;
  getAnswer: (questionId: string) => string | string[] | undefined;
  setScalpImages: (images: ScalpImage[]) => void;
  scalpConsent: boolean;
  privacyAccepted: boolean;
  setScalpConsent: (consent: boolean) => void;
  setPrivacyAccepted: (accepted: boolean) => void;
  setAIAnalysis: (analysis: AIAnalysisResult) => void;
  goToSection: (section: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  generateQuizResult: (aiOverride?: AIAnalysisResult | null) => QuizResult;
  saveProgress: () => Promise<string | null>;
  loadState: (state: QuizState) => void;
  totalSections: number;
}

const QuizContext = createContext<QuizContextValue | null>(null);

function createInitialState(sessionId?: string): QuizState {
  const now = new Date().toISOString();
  return {
    sessionId: sessionId || uuidv4(),
    currentSection: 0,
    currentStep: 0,
    aboutMe: {},
    answers: [],
    scalpImages: [],
    scalpConsent: false,
    privacyAccepted: false,
    aiAnalysis: null,
    result: null,
    startedAt: now,
    lastUpdatedAt: now,
  };
}

export function QuizProvider({
  children,
  initialSessionId,
}: {
  children: ReactNode;
  initialSessionId?: string;
}) {
  const [state, setState] = useState<QuizState>(() => createInitialState(initialSessionId));

  const gender = (state.aboutMe.gender as Gender) || null;

  useEffect(() => {
    saveToLocal(state.sessionId, state);
  }, [state]);

  const setAboutMe = useCallback((data: Partial<AboutMeData>) => {
    setState((prev) => ({
      ...prev,
      aboutMe: { ...prev.aboutMe, ...data },
      lastUpdatedAt: new Date().toISOString(),
    }));
  }, []);

  const setAnswer = useCallback((answer: QuizAnswer) => {
    setState((prev) => {
      const filtered = prev.answers.filter((a) => a.question_id !== answer.question_id);
      trackQuestionAnswer(prev.sessionId, answer.question_id, answer.section);
      return {
        ...prev,
        answers: [...filtered, answer],
        lastUpdatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const getAnswer = useCallback(
    (questionId: string) => state.answers.find((a) => a.question_id === questionId)?.value,
    [state.answers]
  );

  const setScalpImages = useCallback((images: ScalpImage[]) => {
    setState((prev) => ({ ...prev, scalpImages: images, lastUpdatedAt: new Date().toISOString() }));
  }, []);

  const setScalpConsent = useCallback((consent: boolean) => {
    setState((prev) => ({ ...prev, scalpConsent: consent, lastUpdatedAt: new Date().toISOString() }));
  }, []);

  const setPrivacyAccepted = useCallback((accepted: boolean) => {
    setState((prev) => ({ ...prev, privacyAccepted: accepted, lastUpdatedAt: new Date().toISOString() }));
  }, []);

  const setAIAnalysis = useCallback((analysis: AIAnalysisResult) => {
    setState((prev) => ({ ...prev, aiAnalysis: analysis, lastUpdatedAt: new Date().toISOString() }));
  }, []);

  const goToSection = useCallback((section: number) => {
    setState((prev) => {
      if (section > prev.currentSection) {
        const sections: Section[] = ["about_me", "hair_health", "internal_health", "scalp_assessment"];
        trackSectionComplete(prev.sessionId, sections[prev.currentSection]);
      }
      return { ...prev, currentSection: section, currentStep: 0, lastUpdatedAt: new Date().toISOString() };
    });
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1, lastUpdatedAt: new Date().toISOString() }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
      lastUpdatedAt: new Date().toISOString(),
    }));
  }, []);

  const setStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step, lastUpdatedAt: new Date().toISOString() }));
  }, []);

  const generateQuizResult = useCallback((aiOverride?: AIAnalysisResult | null) => {
    if (!gender) throw new Error("Gender required for result generation");
    const ai = aiOverride !== undefined ? aiOverride : state.aiAnalysis;
    const result = generateResult(state.answers, gender, ai);
    setState((prev) => ({
      ...prev,
      aiAnalysis: aiOverride !== undefined ? aiOverride : prev.aiAnalysis,
      result,
      lastUpdatedAt: new Date().toISOString(),
    }));
    return result;
  }, [gender, state.answers, state.aiAnalysis]);

  const saveProgress = useCallback(async () => {
    try {
      const { resumeUrl } = await saveToServer(state);
      return resumeUrl;
    } catch {
      return null;
    }
  }, [state]);

  const loadState = useCallback((loaded: QuizState) => {
    setState(loaded);
  }, []);

  const value = useMemo(
    () => ({
      state,
      gender,
      scalpConsent: state.scalpConsent,
      privacyAccepted: state.privacyAccepted,
      setAboutMe,
      setAnswer,
      getAnswer,
      setScalpImages,
      setScalpConsent,
      setPrivacyAccepted,
      setAIAnalysis,
      goToSection,
      nextStep,
      prevStep,
      setStep,
      generateQuizResult,
      saveProgress,
      loadState,
      totalSections: 4,
    }),
    [
      state,
      gender,
      setAboutMe,
      setAnswer,
      getAnswer,
      setScalpImages,
      setScalpConsent,
      setPrivacyAccepted,
      setAIAnalysis,
      goToSection,
      nextStep,
      prevStep,
      setStep,
      generateQuizResult,
      saveProgress,
      loadState,
    ]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}
