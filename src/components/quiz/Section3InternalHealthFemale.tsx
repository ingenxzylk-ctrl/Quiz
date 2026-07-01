"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import {
  BALANCED_DIET,
  DIGESTION_OPTIONS,
  ENERGY_OPTIONS,
  FEMALE_IRON,
  FEMALE_LIFE_STAGE,
  FEMALE_SYMPTOMS,
  FOOD_HABITS,
  SLEEP_OPTIONS,
  STRESS_OPTIONS,
  SUPPLEMENT_OPTIONS,
} from "@/data/questions";
import ProgressBar from "./ProgressBar";
import QuizLayout from "./QuizLayout";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import PrivacyNotice from "./PrivacyNotice";
import ContinueButton from "./ContinueButton";
import { trackQuestionView } from "@/lib/analytics";

const STEPS = [
  "iron_level",
  "symptoms",
  "life_stage",
  "digestion",
  "sleep_cycle",
  "stress_level",
  "energy_level",
  "supplements",
  "food_habits",
  "balanced_diet",
] as const;

const TITLES: Record<string, string> = {
  iron_level: "What is your iron level status?",
  symptoms: "Do you experience any of these? (select all that apply)",
  life_stage: "Which of these apply to your current life stage?",
  digestion: "Any digestion issues?",
  sleep_cycle: "How many hours do you sleep on average?",
  stress_level: "What is your current stress level?",
  energy_level: "How is your daytime energy level?",
  supplements: "Do you take supplements or vitamins?",
  food_habits: "What are your food habits?",
  balanced_diet: "Do you eat a balanced diet most days?",
};

export default function Section3InternalHealthFemale({ onComplete }: { onComplete: () => void }) {
  const { state, setAnswer, getAnswer, goToSection, privacyAccepted, setPrivacyAccepted } = useQuiz();
  const [step, setStep] = useState(0);
  const currentQ = STEPS[step];

  useEffect(() => {
    trackQuestionView(state.sessionId, currentQ, "internal_health");
  }, [currentQ, state.sessionId]);

  const canContinue = () => {
    if (step === 0 && !privacyAccepted) return false;
    const val = getAnswer(currentQ);
    if (currentQ === "symptoms") return Array.isArray(val) && val.length > 0;
    return !!val;
  };

  const handleContinue = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else { goToSection(3); onComplete(); }
  };

  return (
    <QuizLayout
      title="Internal Health"
      subtitle="Understanding your internal health helps identify root causes."
      onBack={step > 0 ? () => setStep(step - 1) : undefined}
      showBack={step > 0}
    >
      <ProgressBar currentSection={2} sectionLabel="Internal Health" />

      {step === 0 && <PrivacyNotice accepted={privacyAccepted} onAccept={setPrivacyAccepted} />}

      <h2 className="text-lg font-semibold text-gray-800 mb-4">{TITLES[currentQ]}</h2>

      {currentQ === "iron_level" && (
        <SingleSelect options={FEMALE_IRON} value={getAnswer("iron_level") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "iron_level", gender_path: "female", value: v })} />
      )}
      {currentQ === "symptoms" && (
        <MultiSelect options={FEMALE_SYMPTOMS} value={(getAnswer("symptoms") as string[]) || []}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "symptoms", gender_path: "female", value: v })} />
      )}
      {currentQ === "life_stage" && (
        <SingleSelect options={FEMALE_LIFE_STAGE} value={getAnswer("life_stage") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "life_stage", gender_path: "female", value: v })} />
      )}
      {currentQ === "digestion" && (
        <SingleSelect options={DIGESTION_OPTIONS} value={getAnswer("digestion") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "digestion", gender_path: "female", value: v })} />
      )}
      {currentQ === "sleep_cycle" && (
        <SingleSelect options={SLEEP_OPTIONS} value={getAnswer("sleep_cycle") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "sleep_cycle", gender_path: "female", value: v })} />
      )}
      {currentQ === "stress_level" && (
        <SingleSelect options={STRESS_OPTIONS} value={getAnswer("stress_level") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "stress_level", gender_path: "female", value: v })} />
      )}
      {currentQ === "energy_level" && (
        <SingleSelect options={ENERGY_OPTIONS} value={getAnswer("energy_level") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "energy_level", gender_path: "female", value: v })} />
      )}
      {currentQ === "supplements" && (
        <SingleSelect options={SUPPLEMENT_OPTIONS} value={getAnswer("supplements") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "supplements", gender_path: "female", value: v })} />
      )}
      {currentQ === "food_habits" && (
        <SingleSelect options={FOOD_HABITS} value={getAnswer("food_habits") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "food_habits", gender_path: "female", value: v })} />
      )}
      {currentQ === "balanced_diet" && (
        <SingleSelect options={BALANCED_DIET} value={getAnswer("balanced_diet") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "balanced_diet", gender_path: "female", value: v })} />
      )}

      <ContinueButton onClick={handleContinue} disabled={!canContinue()} />
    </QuizLayout>
  );
}
