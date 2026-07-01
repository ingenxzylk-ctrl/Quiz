"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import {
  DANDRUFF_OPTIONS,
  FAMILY_HISTORY,
  FEMALE_HAIR_DURATION,
  FEMALE_HAIR_PATTERN,
  FEMALE_HAIR_VOLUME,
  FEMALE_TREATMENTS,
} from "@/data/questions";
import ProgressBar from "./ProgressBar";
import QuizLayout from "./QuizLayout";
import ImageSelect from "./ImageSelect";
import SingleSelect from "./SingleSelect";
import MultiSelect from "./MultiSelect";
import ContinueButton from "./ContinueButton";
import { trackQuestionView } from "@/lib/analytics";
import { QuizCard, QuestionHeading } from "@/components/ui/QuizCard";

const STEPS = [
  "hair_volume",
  "hair_duration",
  "hair_pattern",
  "treatments",
  "female_dandruff",
  "female_family_history",
] as const;

const TITLES: Record<string, string> = {
  hair_volume: "How much hair do you lose when you comb or wash?",
  hair_duration: "How long have you been experiencing hair fall?",
  hair_pattern: "What best describes your current hair volume/pattern?",
  treatments: "Which hair treatments have you done? (select all that apply)",
  female_dandruff: "Do you experience dandruff?",
  female_family_history: "Family history of hair loss?",
};

export default function Section2HairHealthFemale({ onComplete }: { onComplete: () => void }) {
  const { state, setAnswer, getAnswer, goToSection } = useQuiz();
  const [step, setStep] = useState(0);
  const currentQ = STEPS[step];

  useEffect(() => {
    trackQuestionView(state.sessionId, currentQ, "hair_health");
  }, [currentQ, state.sessionId]);

  const canContinue = () => {
    const val = getAnswer(currentQ);
    if (currentQ === "treatments") return Array.isArray(val) && val.length > 0;
    return !!val;
  };

  const handleContinue = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else { goToSection(2); onComplete(); }
  };

  return (
    <QuizLayout
      title="Hair Health"
      subtitle="Tell us about your hair fall experience."
      onBack={step > 0 ? () => setStep(step - 1) : undefined}
      showBack={step > 0}
      progress={<ProgressBar currentSection={1} />}
    >
      <QuizCard>
      <QuestionHeading title={TITLES[currentQ]} />

      {currentQ === "hair_volume" && (
        <ImageSelect
          options={FEMALE_HAIR_VOLUME}
          value={getAnswer("hair_volume") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "hair_volume", gender_path: "female", value: v })}
        />
      )}

      {currentQ === "hair_duration" && (
        <SingleSelect
          options={FEMALE_HAIR_DURATION}
          value={getAnswer("hair_duration") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "hair_duration", gender_path: "female", value: v })}
        />
      )}

      {currentQ === "hair_pattern" && (
        <ImageSelect
          options={FEMALE_HAIR_PATTERN}
          value={getAnswer("hair_pattern") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "hair_pattern", gender_path: "female", value: v })}
          columns={2}
        />
      )}

      {currentQ === "treatments" && (
        <MultiSelect
          options={FEMALE_TREATMENTS}
          value={(getAnswer("treatments") as string[]) || []}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "treatments", gender_path: "female", value: v })}
        />
      )}

      {currentQ === "female_dandruff" && (
        <SingleSelect
          options={DANDRUFF_OPTIONS}
          value={getAnswer("female_dandruff") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "female_dandruff", gender_path: "female", value: v })}
        />
      )}

      {currentQ === "female_family_history" && (
        <SingleSelect
          options={FAMILY_HISTORY}
          value={getAnswer("female_family_history") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "female_family_history", gender_path: "female", value: v })}
        />
      )}

      <ContinueButton onClick={handleContinue} disabled={!canContinue()} />
      </QuizCard>
    </QuizLayout>
  );
}
