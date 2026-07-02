"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QuizProvider, useQuiz } from "@/context/QuizContext";
import { loadFromServer } from "@/lib/storage";
import Section1AboutMe from "@/components/quiz/Section1AboutMe";
import Section2HairHealthMale from "@/components/quiz/Section2HairHealthMale";
import Section2HairHealthFemale from "@/components/quiz/Section2HairHealthFemale";
import Section3InternalHealthMale from "@/components/quiz/Section3InternalHealthMale";
import Section3InternalHealthFemale from "@/components/quiz/Section3InternalHealthFemale";
import Section4ScalpAssessment from "@/components/quiz/Section4ScalpAssessment";
import ResultsPage from "@/components/quiz/ResultsPage";
import { AIAnalysisResult } from "@/types/quiz";

function QuizFlow() {
  const { state, gender, generateQuizResult, saveProgress } = useQuiz();
  const [showResults, setShowResults] = useState(false);
  const [savedUrl, setSavedUrl] = useState<string | null>(null);

  const handleFinish = (analysis?: AIAnalysisResult) => {
    generateQuizResult(analysis);
    setShowResults(true);
  };

  const handleSave = async () => {
    const url = await saveProgress();
    if (url) setSavedUrl(url);
  };

  if (showResults && state.result) {
    return (
      <>
        <ResultsPage
          result={state.result}
          userName={state.aboutMe.fullName}
          onSaveProgress={handleSave}
        />
        {savedUrl && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-lg max-w-sm text-center">
            Resume link saved! {savedUrl}
          </div>
        )}
      </>
    );
  }

  const section = state.currentSection;

  if (section === 0) return <Section1AboutMe onComplete={() => {}} />;
  if (section === 1) {
    if (gender === "male") return <Section2HairHealthMale onComplete={() => {}} />;
    if (gender === "female") return <Section2HairHealthFemale onComplete={() => {}} />;
  }
  if (section === 2) {
    if (gender === "male") return <Section3InternalHealthMale onComplete={() => {}} />;
    if (gender === "female") return <Section3InternalHealthFemale onComplete={handleFinish} />;
  }
  if (section === 3) return <Section4ScalpAssessment onComplete={handleFinish} />;
  return null;
}

function ResumeLoader() {
  const params = useParams();
  const { loadState } = useQuiz();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadFromServer(params.id as string).then((state) => {
      if (state) { loadState(state); setLoading(false); }
      else { setError(true); setLoading(false); }
    });
  }, [params.id, loadState]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Session Not Found</h1>
          <p className="text-gray-500 mb-4">This quiz link may have expired or is invalid.</p>
          <a href="/quiz" className="text-emerald-600 font-medium hover:underline">Start a new assessment</a>
        </div>
      </div>
    );
  }

  return <QuizFlow />;
}

export default function ResumePage() {
  const params = useParams();
  return (
    <QuizProvider initialSessionId={params.id as string}>
      <ResumeLoader />
    </QuizProvider>
  );
}
