"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/context/QuizContext";
import { AGE_RANGES, COUNTRY_CODES, GENDER_OPTIONS } from "@/data/questions";
import ProgressBar from "./ProgressBar";
import QuizLayout from "./QuizLayout";
import ImageSelect from "./ImageSelect";
import SingleSelect from "./SingleSelect";
import ContinueButton from "./ContinueButton";
import { trackQuestionView } from "@/lib/analytics";
import { Gender } from "@/types/quiz";
import { QuizCard, QuestionHeading } from "@/components/ui/QuizCard";
import { FormField, TextInput, SelectInput } from "@/components/ui/FormField";

const STEPS = ["name", "contact", "age", "gender"] as const;

const STEP_TITLES: Record<string, { title: string; subtitle?: string }> = {
  name: { title: "What's your name?", subtitle: "We'll personalize your report." },
  contact: { title: "How can we reach you?", subtitle: "For your results and optional follow-up." },
  age: { title: "What's your age range?", subtitle: "Hair health varies across life stages." },
  gender: { title: "How do you identify?", subtitle: "This helps us tailor the assessment to you." },
};

export default function Section1AboutMe({ onComplete }: { onComplete: () => void }) {
  const { state, setAboutMe, setAnswer, goToSection } = useQuiz();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { aboutMe } = state;
  const currentStep = STEPS[step];

  useEffect(() => {
    trackQuestionView(state.sessionId, currentStep, "about_me");
  }, [currentStep, state.sessionId]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 0 && !aboutMe.fullName?.trim()) e.fullName = "Name is required";
    if (step === 1) {
      if (!aboutMe.whatsapp?.trim()) e.whatsapp = "WhatsApp number is required";
      if (!aboutMe.email?.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aboutMe.email)) e.email = "Invalid email format";
    }
    if (step === 2 && !aboutMe.ageRange) e.ageRange = "Please select your age range";
    if (step === 3 && !aboutMe.gender) e.gender = "Please select your gender";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validate()) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setAnswer({
        section: "about_me",
        question_id: "profile",
        gender_path: "universal",
        value: JSON.stringify(aboutMe),
      });
      goToSection(1);
      onComplete();
    }
  };

  return (
    <QuizLayout
      title="About You"
      subtitle="Let's start with a few basics to personalize your assessment."
      onBack={step > 0 ? () => setStep(step - 1) : undefined}
      showBack={step > 0}
      progress={<ProgressBar currentSection={0} />}
    >
      <QuizCard>
        <QuestionHeading {...STEP_TITLES[currentStep]} />

        {step === 0 && (
          <FormField label="Full Name" error={errors.fullName}>
            <TextInput
              type="text"
              value={aboutMe.fullName || ""}
              onChange={(e) => setAboutMe({ fullName: e.target.value })}
              placeholder="Enter your full name"
              error={!!errors.fullName}
            />
          </FormField>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <FormField label="WhatsApp Number" error={errors.whatsapp}>
              <div className="flex gap-2">
                <SelectInput
                  value={aboutMe.countryCode || "+91"}
                  onChange={(e) => setAboutMe({ countryCode: e.target.value })}
                  className="w-auto min-w-[110px]"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </SelectInput>
                <TextInput
                  type="tel"
                  value={aboutMe.whatsapp || ""}
                  onChange={(e) => setAboutMe({ whatsapp: e.target.value.replace(/\D/g, "") })}
                  placeholder="Phone number"
                  error={!!errors.whatsapp}
                  className="flex-1"
                />
              </div>
            </FormField>
            <FormField label="Email" error={errors.email}>
              <TextInput
                type="email"
                value={aboutMe.email || ""}
                onChange={(e) => setAboutMe({ email: e.target.value })}
                placeholder="you@example.com"
                error={!!errors.email}
              />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <FormField label="Age Range" error={errors.ageRange}>
            <SingleSelect
              options={AGE_RANGES}
              value={aboutMe.ageRange}
              onChange={(v) => setAboutMe({ ageRange: v })}
            />
          </FormField>
        )}

        {step === 3 && (
          <FormField label="Gender" error={errors.gender}>
            <ImageSelect
              options={GENDER_OPTIONS}
              value={aboutMe.gender}
              onChange={(v) => setAboutMe({ gender: v as Gender })}
              columns={2}
            />
          </FormField>
        )}

        <ContinueButton onClick={handleContinue} />
      </QuizCard>
    </QuizLayout>
  );
}
