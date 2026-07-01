"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import {
  DANDRUFF_OPTIONS,
  FAMILY_HISTORY,
  HAIR_FALL_LOCATION,
  NORWOOD_STAGES,
} from "@/data/questions";
import ProgressBar from "./ProgressBar";
import QuizLayout from "./QuizLayout";
import ImageSelect from "./ImageSelect";
import SingleSelect from "./SingleSelect";
import HopeMessage from "./HopeMessage";
import ContinueButton from "./ContinueButton";
import { trackQuestionView } from "@/lib/analytics";
import { QuizCard, QuestionHeading } from "@/components/ui/QuizCard";

export default function Section2HairHealthMale({ onComplete }: { onComplete: () => void }) {
  const { state, setAnswer, getAnswer, goToSection } = useQuiz();
  const [step, setStep] = useState(0);
  const [showHope, setShowHope] = useState(false);

  const norwoodStage = getAnswer("norwood_stage") as string | undefined;
  const stageNum = norwoodStage ? parseInt(norwoodStage, 10) : 0;

  // Dynamic step list based on branching
  const getSteps = () => {
    const steps = ["norwood_stage"];
    if (stageNum === 2 || stageNum === 3) steps.push("hair_fall_location");
    steps.push("family_history", "dandruff");
    return steps;
  };

  const steps = getSteps();
  const currentQ = steps[step];

  useEffect(() => {
    if (currentQ) trackQuestionView(state.sessionId, currentQ, "hair_health");
  }, [currentQ, state.sessionId]);

  const handleNorwoodSelect = (value: string) => {
    setAnswer({ section: "hair_health", question_id: "norwood_stage", gender_path: "male", value });
    const num = parseInt(value, 10);
    if (num === 1) setShowHope(true);
    else if (num === 2 || num === 3) setShowHope(true);
    else setShowHope(false);
  };

  const handleContinue = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      setShowHope(false);
    } else {
      goToSection(2);
      onComplete();
    }
  };

  const canContinue = () => {
    if (currentQ === "norwood_stage") return !!getAnswer("norwood_stage");
    if (currentQ === "hair_fall_location") return !!getAnswer("hair_fall_location");
    if (currentQ === "family_history") return !!getAnswer("family_history");
    if (currentQ === "dandruff") return !!getAnswer("dandruff");
    return false;
  };

  const getHopeMessage = () => {
    if (stageNum === 1) return "Your hair fall is minimal — this is a great stage to start preventive care and maintain what you have.";
    if (stageNum === 2 || stageNum === 3) return "Early-to-mid stage hair loss like yours responds very well to consistent treatment — regrowth is realistic here.";
    return "";
  };

  const titles: Record<string, string> = {
    norwood_stage: "What stage best describes your hair fall?",
    hair_fall_location: "Where do you notice hair fall most?",
    family_history: "Family history of baldness / hair loss?",
    dandruff: "Do you have dandruff?",
  };

  return (
    <QuizLayout
      title="Hair Health"
      subtitle="Help us understand your hair loss pattern."
      onBack={step > 0 ? () => { setStep(step - 1); setShowHope(false); } : undefined}
      showBack={step > 0}
      progress={<ProgressBar currentSection={1} />}
    >
      <QuizCard>
      <QuestionHeading title={titles[currentQ]} />

      {currentQ === "norwood_stage" && (
        <>
          <ImageSelect
            options={NORWOOD_STAGES}
            value={norwoodStage}
            onChange={handleNorwoodSelect}
            columns={4}
          />
          {showHope && getHopeMessage() && <HopeMessage message={getHopeMessage()} />}
        </>
      )}

      {currentQ === "hair_fall_location" && (
        <SingleSelect
          options={HAIR_FALL_LOCATION}
          value={getAnswer("hair_fall_location") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "hair_fall_location", gender_path: "male", value: v })}
        />
      )}

      {currentQ === "family_history" && (
        <SingleSelect
          options={FAMILY_HISTORY}
          value={getAnswer("family_history") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "family_history", gender_path: "male", value: v })}
        />
      )}

      {currentQ === "dandruff" && (
        <SingleSelect
          options={DANDRUFF_OPTIONS}
          value={getAnswer("dandruff") as string}
          onChange={(v) => setAnswer({ section: "hair_health", question_id: "dandruff", gender_path: "male", value: v })}
        />
      )}

      {currentQ === "hair_fall_location" && showHope === false && stageNum >= 2 && stageNum <= 3 && (
        <HopeMessage message="Early-to-mid stage hair loss like yours responds very well to consistent treatment — regrowth is realistic here." />
      )}

      <ContinueButton onClick={handleContinue} disabled={!canContinue()} />
      </QuizCard>
    </QuizLayout>
  );
}
