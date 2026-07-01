"use client";

import { useCallback, useState } from "react";
import { QuizProvider, useQuiz } from "@/context/QuizContext";
import Section1AboutMe from "@/components/quiz/Section1AboutMe";
import Section2HairHealthMale from "@/components/quiz/Section2HairHealthMale";
import Section2HairHealthFemale from "@/components/quiz/Section2HairHealthFemale";
import Section3InternalHealthMale from "@/components/quiz/Section3InternalHealthMale";
import Section3InternalHealthFemale from "@/components/quiz/Section3InternalHealthFemale";
import Section4ScalpAssessment from "@/components/quiz/Section4ScalpAssessment";
import ResultsPage from "@/components/quiz/ResultsPage";

function QuizFlow() {
  const { state, gender, generateQuizResult, saveProgress } = useQuiz();
  const [showResults, setShowResults] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const handleSectionComplete = useCallback(() => {
    // Section transitions handled by goToSection in each component
  }, []);

  const handleScalpComplete = useCallback(() => {
    generateQuizResult();
    setShowResults(true);
  }, [generateQuizResult]);

  const handleSave = useCallback(async () => {
    const url = await saveProgress();
    if (url) setSavedUrl(url);
  }, [saveProgress]);

  if (showResults && state.result) {
    return (
      <>
        <ResultsPage
          result={state.result}
          userName={state.aboutMe.fullName}
          onSaveProgress={handleSave}
        />
        {savedUrl && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg">
            Resume link saved! Check your email or use: {savedUrl}
          </div>
        )}
      </>
    );
  }

  const section = state.currentSection;

  if (section === 0) {
    return <Section1AboutMe onComplete={handleSectionComplete} />;
  }

  if (section === 1) {
    if (gender === "male") return <Section2HairHealthMale onComplete={handleSectionComplete} />;
    if (gender === "female") return <Section2HairHealthFemale onComplete={handleSectionComplete} />;
    return null;
  }

  if (section === 2) {
    if (gender === "male") return <Section3InternalHealthMale onComplete={handleSectionComplete} />;
    if (gender === "female") return <Section3InternalHealthFemale onComplete={handleSectionComplete} />;
    return null;
  }

  if (section === 3) {
    return <Section4ScalpAssessment onComplete={handleScalpComplete} />;
  }

  return null;
}

export default function QuizPage() {
  return (
    <QuizProvider>
      <QuizFlow />
    </QuizProvider>
  );
}
