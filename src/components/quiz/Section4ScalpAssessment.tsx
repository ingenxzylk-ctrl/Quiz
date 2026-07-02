"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useQuiz } from "@/context/QuizContext";
import ProgressBar from "./ProgressBar";
import QuizLayout from "./QuizLayout";
import ContinueButton from "./ContinueButton";
import { AIAnalysisResult, ScalpImage } from "@/types/quiz";
import { trackQuestionView } from "@/lib/analytics";
import { QuizCard, QuestionHeading } from "@/components/ui/QuizCard";

type CaptureStep = "consent" | "guide" | "front" | "top" | "analyzing";

export default function Section4ScalpAssessment({ onComplete }: { onComplete: (analysis?: AIAnalysisResult) => void }) {
  const { state, gender, setScalpConsent, setScalpImages, setAIAnalysis, getAnswer, scalpConsent: consent } = useQuiz();
  const [step, setStep] = useState<CaptureStep>("consent");
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [topImage, setTopImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCaptureType = step === "front" ? "front" : "top";

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const moderationRes = await fetch("/api/scalp/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const moderation = await moderationRes.json();

      if (!moderation.passed) {
        setError(moderation.reason || "This image couldn't be processed. Please upload a clear photo of your scalp only.");
        return;
      }

      if (currentCaptureType === "front") {
        setFrontImage(dataUrl);
        setStep("top");
      } else {
        setTopImage(dataUrl);
        setStep("analyzing");
        await runAnalysis(dataUrl, frontImage!);
      }
    };
    reader.readAsDataURL(file);
  }, [currentCaptureType, frontImage]);

  const captureFromCamera = useCallback(async () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (!screenshot) return;
    setError(null);

    const moderationRes = await fetch("/api/scalp/moderate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: screenshot }),
    });
    const moderation = await moderationRes.json();

    if (!moderation.passed) {
      setError(moderation.reason || "This image couldn't be processed. Please upload a clear photo of your scalp only.");
      return;
    }

    if (currentCaptureType === "front") {
      setFrontImage(screenshot);
      setStep("top");
      setUseCamera(false);
    } else {
      setTopImage(screenshot);
      setStep("analyzing");
      setUseCamera(false);
      await runAnalysis(screenshot, frontImage!);
    }
  }, [currentCaptureType, frontImage]);

  const runAnalysis = async (top: string, front: string) => {
    trackQuestionView(state.sessionId, "scalp_analysis", "scalp_assessment");

    const selfReported =
      gender === "male"
        ? (getAnswer("norwood_stage") as string) || "2"
        : (getAnswer("hair_pattern") as string) || "volume_reduced";

    const res = await fetch("/api/scalp/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        frontImage: front,
        topImage: top,
        gender,
        selfReportedStage: selfReported,
        sessionId: state.sessionId,
      }),
    });

    const analysis = await res.json();
    if (!res.ok) {
      setError(analysis.error || "Scalp analysis failed. Please try again.");
      setStep("top");
      return;
    }

    setAIAnalysis(analysis);

    const images: ScalpImage[] = [
      { type: "front", dataUrl: front, moderated: true, moderationPassed: true },
      { type: "top", dataUrl: top, moderated: true, moderationPassed: true },
    ];
    setScalpImages(images);
    onComplete(analysis);
  };

  if (step === "consent") {
    return (
      <QuizLayout
        title="Scalp Photo Assessment"
        subtitle="AI-powered analysis for accurate results."
        progress={<ProgressBar currentSection={3} />}
      >
        <QuizCard>
          <QuestionHeading
            title="Photo Consent"
            subtitle="We need your permission before capturing scalp images."
          />
          <p className="text-sm text-[#57534e] leading-relaxed mb-5">
            We&apos;ll ask you to upload or capture two photos of your scalp (front and top view).
            These images are analyzed by our AI model to assess your hair loss stage. Photos are
            encrypted, processed securely, and used only for your assessment.
          </p>
          <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl bg-[#f7f5f0] border border-[rgba(28,25,23,0.06)] hover:border-[#1a5c45]/20 transition-colors">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setScalpConsent(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#d6d3d1] text-[#1a5c45] focus:ring-[#1a5c45]/30"
            />
            <span className="text-sm text-[#1c1917] leading-relaxed">
              I consent to capturing and analyzing scalp photos for this health assessment.
            </span>
          </label>
          <ContinueButton
            label="I Agree — Continue"
            disabled={!consent}
            onClick={() => setStep("guide")}
          />
        </QuizCard>
      </QuizLayout>
    );
  }

  if (step === "guide") {
    return (
      <QuizLayout
        title="Photo Guidelines"
        subtitle="Good photos lead to accurate analysis."
        progress={<ProgressBar currentSection={3} />}
      >
        <QuizCard>
          <QuestionHeading title="How to take a good photo" />
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="rounded-2xl border-2 border-[#b8dcc8] bg-gradient-to-b from-[#e8f3ed] to-white p-5 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                ✅
              </div>
              <p className="text-sm font-semibold text-[#144736]">Good Photo</p>
              <p className="text-xs text-[#1a5c45]/80 mt-1.5 leading-relaxed">Clear scalp, good lighting, hair parted</p>
            </div>
            <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-b from-red-50 to-white p-5 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                ❌
              </div>
              <p className="text-sm font-semibold text-red-800">Bad Photo</p>
              <p className="text-xs text-red-600/80 mt-1.5 leading-relaxed">Blurry, dark, or wrong angle</p>
            </div>
          </div>
          <ContinueButton label="Got it — Take Photos" onClick={() => setStep("front")} />
        </QuizCard>
      </QuizLayout>
    );
  }

  if (step === "analyzing") {
    return (
      <QuizLayout title="Analyzing Your Scalp" showBack={false} progress={<ProgressBar currentSection={3} />}>
        <QuizCard className="text-center py-12">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[#e8f3ed]" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#1a5c45] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🔬</div>
          </div>
          <p className="font-semibold text-[#1c1917]">Analyzing your scalp photos...</p>
          <p className="text-sm text-[#78716c] mt-2">This usually takes a few seconds</p>
        </QuizCard>
      </QuizLayout>
    );
  }

  const captureLabel = step === "front" ? "Front of Scalp" : "Top of Scalp";

  return (
    <QuizLayout
      title={`Capture: ${captureLabel}`}
      subtitle={`Photo ${step === "front" ? "1" : "2"} of 2 — position your scalp within the guide frame.`}
      onBack={() => setStep(step === "top" ? "front" : "guide")}
      progress={<ProgressBar currentSection={3} />}
    >
      <QuizCard>
        <QuestionHeading title={`${captureLabel} photo`} subtitle="Align your scalp within the oval guide." />

      {error && (
        <div className="flex gap-3 bg-red-50 border border-red-200/80 text-red-800 rounded-xl p-4 mb-5 text-sm">
          <span className="shrink-0">⚠️</span>
          {error}
        </div>
      )}

      {useCamera ? (
        <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] max-w-sm mx-auto shadow-xl">
          {typeof window !== "undefined" && (
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user", width: 480, height: 640 }}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-64 border-2 border-dashed border-white/60 rounded-[50%] shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]" />
          </div>
          <button
            onClick={captureFromCamera}
            aria-label="Capture photo"
            className="absolute bottom-5 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-[#1a5c45] shadow-lg hover:scale-105 transition-transform"
          />
        </div>
      ) : (
        <div className="text-center space-y-6">
          <div className="w-52 h-68 mx-auto border-2 border-dashed border-[#1a5c45]/30 rounded-[50%] bg-gradient-to-b from-[#e8f3ed]/50 to-[#f7f5f0] flex flex-col items-center justify-center gap-2 py-16">
            <svg className="w-10 h-10 text-[#1a5c45]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
            </svg>
            <span className="text-sm text-[#78716c]">Position scalp here</span>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary px-8 py-3.5"
            >
              Upload Photo
            </button>
            <button
              onClick={() => setUseCamera(true)}
              className="btn-secondary px-8 py-3.5"
            >
              Use Camera
            </button>
          </div>
        </div>
      )}

      {(frontImage || topImage) && (
        <div className="mt-6 flex gap-4 justify-center">
          {frontImage && (
            <div className="text-center">
              <img src={frontImage} alt="Front" className="w-20 h-20 rounded-xl object-cover border-2 border-[#1a5c45] shadow-sm" />
              <span className="text-xs font-medium text-[#1a5c45] mt-1.5 block">Front ✓</span>
            </div>
          )}
          {topImage && (
            <div className="text-center">
              <img src={topImage} alt="Top" className="w-20 h-20 rounded-xl object-cover border-2 border-[#1a5c45] shadow-sm" />
              <span className="text-xs font-medium text-[#1a5c45] mt-1.5 block">Top ✓</span>
            </div>
          )}
        </div>
      )}
      </QuizCard>
    </QuizLayout>
  );
}
