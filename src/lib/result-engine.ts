import {
  AIAnalysisResult,
  ContributingFactor,
  Gender,
  QuizAnswer,
  QuizResult,
} from "@/types/quiz";

const NORWOOD_DESCRIPTIONS: Record<string, string> = {
  "1": "Minimal hair loss — an excellent stage for preventive care.",
  "2": "Early-stage recession — highly responsive to treatment.",
  "3": "Moderate hair loss — regrowth is realistic with consistent care.",
  "4": "Noticeable thinning — targeted treatment can slow progression.",
  "5": "Significant hair loss — combination therapy recommended.",
  "6": "Advanced hair loss — professional consultation advised.",
  "7": "Extensive hair loss — transplant or advanced treatments may help.",
};

const LUDWIG_DESCRIPTIONS: Record<string, string> = {
  I: "Mild thinning — great stage to start preventive care.",
  II: "Moderate diffuse thinning — treatment can restore volume.",
  III: "Advanced thinning — professional guidance recommended.",
};

function getAnswer(answers: QuizAnswer[], questionId: string): string | string[] | undefined {
  return answers.find((a) => a.question_id === questionId)?.value;
}

function hasFamilyHistory(answers: QuizAnswer[]): boolean {
  const val = getAnswer(answers, "family_history") || getAnswer(answers, "female_family_history");
  return val === "mother" || val === "father" || val === "both";
}

function analyzeFemaleFactors(answers: QuizAnswer[]): ContributingFactor[] {
  const factors: ContributingFactor[] = [];

  if (getAnswer(answers, "iron_level") === "low") {
    factors.push({
      tag: "nutritional",
      label: "Nutritional deficiency",
      description: "Low iron levels can significantly contribute to hair shedding in women.",
    });
  }

  const symptoms = getAnswer(answers, "symptoms");
  const symptomList = Array.isArray(symptoms) ? symptoms : [];
  const lifeStage = getAnswer(answers, "life_stage");

  if (
    symptomList.includes("irregular_periods") ||
    symptomList.includes("hormonal") ||
    symptomList.includes("facial_hair") ||
    lifeStage === "pregnant" ||
    lifeStage === "menopause" ||
    lifeStage === "baby_under_1"
  ) {
    factors.push({
      tag: "hormonal",
      label: "Hormonal factors",
      description: "Hormonal changes or imbalances may be affecting your hair growth cycle.",
    });
  }

  if (getAnswer(answers, "stress_level") === "high" || getAnswer(answers, "stress_level") === "very_high") {
    factors.push({
      tag: "stress-related",
      label: "Stress-related shedding",
      description: "Elevated stress can push more hair follicles into the resting phase.",
    });
  }

  const dandruff = getAnswer(answers, "female_dandruff") || getAnswer(answers, "dandruff");
  if (dandruff === "frequently") {
    factors.push({
      tag: "scalp-related",
      label: "Scalp condition",
      description: "Frequent dandruff can indicate scalp inflammation affecting hair health.",
    });
  }

  if (hasFamilyHistory(answers)) {
    factors.push({
      tag: "genetic",
      label: "Genetic predisposition",
      description: "Family history of hair loss suggests a genetic component to your condition.",
    });
  }

  const sleep = getAnswer(answers, "sleep_cycle");
  const diet = getAnswer(answers, "balanced_diet");
  if (sleep === "less_5" || sleep === "irregular" || diet === "no") {
    factors.push({
      tag: "nutritional",
      label: "Lifestyle factors",
      description: "Sleep and nutrition play key roles in healthy hair growth.",
    });
  }

  return factors.slice(0, 3);
}

function analyzeMaleFactors(answers: QuizAnswer[]): ContributingFactor[] {
  const factors: ContributingFactor[] = [];

  if (hasFamilyHistory(answers)) {
    factors.push({
      tag: "genetic",
      label: "Genetic predisposition",
      description: "Family history of baldness is the strongest predictor of androgenetic alopecia.",
    });
  }

  if (getAnswer(answers, "stress_level") === "high" || getAnswer(answers, "stress_level") === "very_high") {
    factors.push({
      tag: "stress-related",
      label: "Stress acceleration",
      description: "High stress can accelerate existing hair loss patterns.",
    });
  }

  const conditions = getAnswer(answers, "health_conditions");
  const conditionList = Array.isArray(conditions) ? conditions : [];
  if (conditionList.includes("thyroid") || conditionList.includes("diabetes")) {
    factors.push({
      tag: "hormonal",
      label: "Underlying health condition",
      description: "Thyroid or metabolic conditions can contribute to hair thinning.",
    });
  }

  if (getAnswer(answers, "dandruff") === "frequently") {
    factors.push({
      tag: "scalp-related",
      label: "Scalp inflammation",
      description: "Chronic dandruff may worsen hair loss in affected areas.",
    });
  }

  const sleep = getAnswer(answers, "sleep_cycle");
  if (sleep === "less_5" || sleep === "irregular") {
    factors.push({
      tag: "stress-related",
      label: "Poor sleep recovery",
      description: "Inadequate sleep impairs the body's ability to maintain healthy hair follicles.",
    });
  }

  return factors.slice(0, 3);
}

function reconcileStages(
  selfReported: string,
  ai: AIAnalysisResult | null,
  gender: Gender
): { finalStage: string; mismatch: boolean; lowConfidence: boolean } {
  if (!ai) {
    const finalStage =
      gender === "male"
        ? `Norwood Stage ${selfReported}`
        : `Ludwig Stage ${["I", "II", "III"][femaleStageToNumber(selfReported) - 1] || "II"}`;
    return { finalStage, mismatch: false, lowConfidence: false };
  }

  if (ai.lowConfidence) {
    return {
      finalStage: `Stage ${selfReported} (estimated range)`,
      mismatch: false,
      lowConfidence: true,
    };
  }

  const selfNum = parseInt(selfReported, 10);
  const aiNum = gender === "male" ? parseInt(ai.predictedStage, 10) : ludwigToNumber(ai.predictedStage);
  const selfNumNorm = gender === "male" ? selfNum : femaleStageToNumber(selfReported);

  const diff = Math.abs(selfNumNorm - aiNum);
  const mismatch = diff >= 2;

  if (mismatch) {
    return {
      finalStage: `Stage ${Math.round((selfNumNorm + aiNum) / 2)} (review recommended)`,
      mismatch: true,
      lowConfidence: false,
    };
  }

  return {
    finalStage: gender === "male" ? `Norwood Stage ${aiNum}` : `Ludwig Stage ${ai.predictedStage}`,
    mismatch: false,
    lowConfidence: false,
  };
}

function ludwigToNumber(stage: string): number {
  const map: Record<string, number> = { I: 1, II: 2, III: 3 };
  return map[stage] || 2;
}

function femaleStageToNumber(pattern: string): number {
  const map: Record<string, number> = {
    volume_reduced: 1,
    side_thinning: 2,
    widening_partition: 2,
    coin_patch: 3,
  };
  return map[pattern] || 2;
}

function getRegrowthOutlook(stage: string, gender: Gender): string {
  if (gender === "male") {
    const num = parseInt(stage, 10);
    if (num <= 1) return "Your hair is in great shape. Preventive care now can help maintain it for years.";
    if (num <= 3) return "Early-to-mid stage hair loss like yours responds very well to consistent treatment — regrowth is realistic here.";
    if (num <= 5) return "While significant thinning has occurred, medical treatments can slow progression and partially restore density.";
    return "Advanced hair loss requires a comprehensive treatment plan. Consultation with a specialist is strongly recommended.";
  }

  const num = femaleStageToNumber(stage);
  if (num <= 1) return "Mild thinning is highly treatable. With the right routine, you can restore volume within months.";
  if (num <= 2) return "Moderate thinning responds well to targeted treatments addressing root causes like nutrition and hormones.";
  return "Significant thinning benefits from a personalized multi-pronged approach. Professional guidance can make a real difference.";
}

function getRecommendations(factors: ContributingFactor[], gender: Gender): string[] {
  const recs: string[] = [];

  if (factors.some((f) => f.tag === "nutritional")) {
    recs.push("Consider iron and biotin supplementation after consulting a doctor.");
  }
  if (factors.some((f) => f.tag === "hormonal")) {
    recs.push("A hormonal panel test can identify treatable imbalances.");
  }
  if (factors.some((f) => f.tag === "stress-related")) {
    recs.push("Stress management techniques and adequate sleep (7+ hrs) support hair recovery.");
  }
  if (factors.some((f) => f.tag === "scalp-related")) {
    recs.push("Use a medicated anti-dandruff shampoo 2–3 times per week.");
  }
  if (factors.some((f) => f.tag === "genetic")) {
    recs.push(gender === "male"
      ? "Minoxidil and DHT blockers are proven options for genetic hair loss."
      : "Topical minoxidil and addressing underlying triggers can help genetic thinning.");
  }

  if (recs.length === 0) {
    recs.push("A balanced diet rich in protein, iron, and vitamins supports healthy hair.");
    recs.push("Gentle hair care — avoid excessive heat styling and tight hairstyles.");
  }

  return recs.slice(0, 4);
}

export function generateResult(
  answers: QuizAnswer[],
  gender: Gender,
  aiAnalysis: AIAnalysisResult | null
): QuizResult {
  const selfReported =
    gender === "male"
      ? (getAnswer(answers, "norwood_stage") as string) || "2"
      : (getAnswer(answers, "hair_pattern") as string) || "volume_reduced";

  const { finalStage, mismatch, lowConfidence } = reconcileStages(
    selfReported,
    aiAnalysis,
    gender
  );

  const factors =
    gender === "male" ? analyzeMaleFactors(answers) : analyzeFemaleFactors(answers);

  const stageKey = gender === "male" ? selfReported : femaleStageToNumber(selfReported).toString();
  const descriptions = gender === "male" ? NORWOOD_DESCRIPTIONS : LUDWIG_DESCRIPTIONS;
  const descKey = gender === "male" ? selfReported : (["I", "II", "III"][femaleStageToNumber(selfReported) - 1] || "II");

  return {
    finalStage,
    stageDescription: descriptions[descKey] || "Your hair health assessment is complete.",
    selfReportedStage: selfReported,
    aiPredictedStage: aiAnalysis?.predictedStage ?? null,
    aiConfidence: aiAnalysis?.confidence ?? null,
    aiReasoning: aiAnalysis?.reasoning ?? null,
    mismatchFlag: mismatch,
    lowConfidence,
    contributingFactors: factors.length > 0 ? factors : [{
      tag: "scalp-related",
      label: "General hair health",
      description: "Multiple lifestyle factors may be contributing to your hair concerns.",
    }],
    regrowthOutlook: getRegrowthOutlook(selfReported, gender),
    recommendations: getRecommendations(factors, gender),
  };
}
