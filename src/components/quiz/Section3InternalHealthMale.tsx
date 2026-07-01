"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import {
  BALANCED_DIET,
  BOWEL_OPTIONS,
  BP_OPTIONS,
  ENERGY_OPTIONS,
  FOOD_HABITS,
  GAS_OPTIONS,
  MALE_CONDITIONS,
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
import { QuizCard, QuestionHeading } from "@/components/ui/QuizCard";
import { TextInput } from "@/components/ui/FormField";

const STEPS = [
  "sleep_cycle",
  "stress_level",
  "health_conditions",
  "bowel",
  "gas_acidity",
  "energy_level",
  "supplements",
  "blood_pressure",
] as const;

const TITLES: Record<string, string> = {
  sleep_cycle: "How many hours do you sleep on average?",
  stress_level: "What is your current stress level?",
  health_conditions: "Do you have any existing health conditions?",
  bowel: "How are your bowel movements?",
  gas_acidity: "Do you experience gas, acidity, or bloating?",
  energy_level: "How is your daytime energy level?",
  supplements: "Do you take supplements or vitamins?",
  blood_pressure: "What is your blood pressure status?",
};

export default function Section3InternalHealthMale({ onComplete }: { onComplete: () => void }) {
  const { state, setAnswer, getAnswer, goToSection, privacyAccepted, setPrivacyAccepted } = useQuiz();
  const [step, setStep] = useState(0);
  const [otherCondition, setOtherCondition] = useState("");
  const currentQ = STEPS[step];

  useEffect(() => {
    trackQuestionView(state.sessionId, currentQ, "internal_health");
  }, [currentQ, state.sessionId]);

  const canContinue = () => {
    if (step === 0 && !privacyAccepted) return false;
    const val = getAnswer(currentQ);
    if (currentQ === "health_conditions") return Array.isArray(val) && val.length > 0;
    return !!val;
  };

  const handleContinue = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else { goToSection(3); onComplete(); }
  };

  return (
    <QuizLayout
      title="Internal Health"
      subtitle="Your overall health plays a big role in hair wellness."
      onBack={step > 0 ? () => setStep(step - 1) : undefined}
      showBack={step > 0}
      progress={<ProgressBar currentSection={2} />}
    >
      {step === 0 && <PrivacyNotice accepted={privacyAccepted} onAccept={setPrivacyAccepted} />}

      <QuizCard>
      <QuestionHeading title={TITLES[currentQ]} />

      {currentQ === "sleep_cycle" && (
        <SingleSelect options={SLEEP_OPTIONS} value={getAnswer("sleep_cycle") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "sleep_cycle", gender_path: "male", value: v })} />
      )}
      {currentQ === "stress_level" && (
        <SingleSelect options={STRESS_OPTIONS} value={getAnswer("stress_level") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "stress_level", gender_path: "male", value: v })} />
      )}
      {currentQ === "health_conditions" && (
        <>
          <MultiSelect options={MALE_CONDITIONS} value={(getAnswer("health_conditions") as string[]) || []}
            onChange={(v) => setAnswer({ section: "internal_health", question_id: "health_conditions", gender_path: "male", value: v })} />
          {((getAnswer("health_conditions") as string[]) || []).includes("other") && (
            <TextInput type="text" value={otherCondition} onChange={(e) => setOtherCondition(e.target.value)}
              placeholder="Please specify" className="mt-3" />
          )}
        </>
      )}
      {currentQ === "bowel" && (
        <SingleSelect options={BOWEL_OPTIONS} value={getAnswer("bowel") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "bowel", gender_path: "male", value: v })} />
      )}
      {currentQ === "gas_acidity" && (
        <SingleSelect options={GAS_OPTIONS} value={getAnswer("gas_acidity") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "gas_acidity", gender_path: "male", value: v })} />
      )}
      {currentQ === "energy_level" && (
        <SingleSelect options={ENERGY_OPTIONS} value={getAnswer("energy_level") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "energy_level", gender_path: "male", value: v })} />
      )}
      {currentQ === "supplements" && (
        <SingleSelect options={SUPPLEMENT_OPTIONS} value={getAnswer("supplements") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "supplements", gender_path: "male", value: v })} />
      )}
      {currentQ === "blood_pressure" && (
        <SingleSelect options={BP_OPTIONS} value={getAnswer("blood_pressure") as string}
          onChange={(v) => setAnswer({ section: "internal_health", question_id: "blood_pressure", gender_path: "male", value: v })} />
      )}

      <ContinueButton onClick={handleContinue} disabled={!canContinue()} />
      </QuizCard>
    </QuizLayout>
  );
}
