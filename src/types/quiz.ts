export type Gender = "male" | "female";

export type Section = "about_me" | "hair_health" | "internal_health" | "scalp_assessment";

export interface QuizAnswer {
  section: Section;
  question_id: string;
  gender_path: Gender | "universal";
  value: string | string[];
}

export interface AboutMeData {
  fullName: string;
  whatsapp: string;
  countryCode: string;
  email: string;
  ageRange: string;
  gender: Gender;
}

export interface ScalpImage {
  type: "front" | "top";
  dataUrl: string;
  moderated: boolean;
  moderationPassed: boolean;
}

export interface AIAnalysisResult {
  predictedStage: string;
  confidence: number;
  modelVersion: string;
  scale: "norwood" | "ludwig";
  mismatchWithSelfReport: boolean;
  lowConfidence: boolean;
}

export interface ContributingFactor {
  tag: "genetic" | "hormonal" | "nutritional" | "stress-related" | "scalp-related";
  label: string;
  description: string;
}

export interface QuizResult {
  finalStage: string;
  stageDescription: string;
  selfReportedStage: string;
  aiPredictedStage: string | null;
  aiConfidence: number | null;
  mismatchFlag: boolean;
  lowConfidence: boolean;
  contributingFactors: ContributingFactor[];
  regrowthOutlook: string;
  recommendations: string[];
}

export interface QuizState {
  sessionId: string;
  currentSection: number;
  currentStep: number;
  aboutMe: Partial<AboutMeData>;
  answers: QuizAnswer[];
  scalpImages: ScalpImage[];
  scalpConsent: boolean;
  privacyAccepted: boolean;
  aiAnalysis: AIAnalysisResult | null;
  result: QuizResult | null;
  startedAt: string;
  lastUpdatedAt: string;
}

export interface AnalyticsEvent {
  event: string;
  questionId?: string;
  section?: Section;
  timestamp: string;
  sessionId: string;
}

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
  image?: string;
}
