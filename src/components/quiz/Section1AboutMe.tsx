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

const STEPS = ["name", "contact", "age", "gender"] as const;

export default function Section1AboutMe({ onComplete }: { onComplete: () => void }) {
  const { state, setAboutMe, setAnswer, goToSection } = useQuiz();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { aboutMe } = state;

  useEffect(() => {
    trackQuestionView(state.sessionId, STEPS[step], "about_me");
  }, [step, state.sessionId]);

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

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <QuizLayout
      title="About You"
      subtitle="Let's start with a few basics to personalize your assessment."
      onBack={step > 0 ? handleBack : undefined}
      showBack={step > 0}
    >
      <ProgressBar currentSection={0} sectionLabel="About Me" />

      {step === 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={aboutMe.fullName || ""}
            onChange={(e) => setAboutMe({ fullName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
            <div className="flex gap-2">
              <select
                value={aboutMe.countryCode || "+91"}
                onChange={(e) => setAboutMe({ countryCode: e.target.value })}
                className="px-3 py-3 rounded-xl border border-gray-200 bg-white focus:border-emerald-500 outline-none"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={aboutMe.whatsapp || ""}
                onChange={(e) => setAboutMe({ whatsapp: e.target.value.replace(/\D/g, "") })}
                placeholder="Phone number"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
            {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={aboutMe.email || ""}
              onChange={(e) => setAboutMe({ email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Age Range</label>
          <SingleSelect
            options={AGE_RANGES}
            value={aboutMe.ageRange}
            onChange={(v) => setAboutMe({ ageRange: v })}
          />
          {errors.ageRange && <p className="text-red-500 text-sm mt-1">{errors.ageRange}</p>}
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Gender</label>
          <p className="text-sm text-gray-500 mb-3">This helps us tailor the assessment to you.</p>
          <ImageSelect
            options={GENDER_OPTIONS}
            value={aboutMe.gender}
            onChange={(v) => setAboutMe({ gender: v as Gender })}
            columns={2}
          />
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
      )}

      <ContinueButton onClick={handleContinue} />
    </QuizLayout>
  );
}
