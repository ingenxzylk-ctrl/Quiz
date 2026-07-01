"use client";

import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import { useQuiz } from "@/context/QuizContext";
import ProgressBar from "./ProgressBar";
import QuizLayout from "./QuizLayout";
import ContinueButton from "./ContinueButton";
import { ScalpImage } from "@/types/quiz";
import { trackQuestionView } from "@/lib/analytics";

type CaptureStep = "consent" | "guide" | "front" | "top" | "analyzing";

export default function Section4ScalpAssessment({ onComplete }: { onComplete: () => void }) {
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
    setAIAnalysis(analysis);

    const images: ScalpImage[] = [
      { type: "front", dataUrl: front, moderated: true, moderationPassed: true },
      { type: "top", dataUrl: top, moderated: true, moderationPassed: true },
    ];
    setScalpImages(images);
    onComplete();
  };

  if (step === "consent") {
    return (
      <QuizLayout title="Scalp Photo Assessment" subtitle="AI-powered analysis for accurate results.">
        <ProgressBar currentSection={3} sectionLabel="Scalp Assessment" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Photo Consent</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We&apos;ll ask you to upload or capture two photos of your scalp (front and top view).
            These images are analyzed by our AI model to assess your hair loss stage. Photos are
            encrypted, processed securely, and used only for your assessment. They are not shared
            with third parties.
          </p>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setScalpConsent(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm text-gray-700">
              I consent to capturing and analyzing scalp photos for this health assessment.
            </span>
          </label>
        </div>
        <ContinueButton
          label="I Agree — Continue"
          disabled={!consent}
          onClick={() => setStep("guide")}
        />
      </QuizLayout>
    );
  }

  if (step === "guide") {
    return (
      <QuizLayout title="Photo Guidelines" subtitle="Good photos lead to accurate analysis.">
        <ProgressBar currentSection={3} sectionLabel="Scalp Assessment" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-full border-4 border-emerald-400 bg-amber-100 flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm font-medium text-emerald-800">Good Photo</p>
            <p className="text-xs text-emerald-600 mt-1">Clear scalp visible, good lighting, hair parted</p>
          </div>
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 text-center">
            <div className="w-20 h-20 mx-auto mb-2 rounded-full border-4 border-red-300 bg-gray-200 flex items-center justify-center">
              <span className="text-2xl">❌</span>
            </div>
            <p className="text-sm font-medium text-red-800">Bad Photo</p>
            <p className="text-xs text-red-600 mt-1">Blurry, dark, hair covering scalp, or wrong angle</p>
          </div>
        </div>
        <ContinueButton label="Got it — Take Photos" onClick={() => setStep("front")} />
      </QuizLayout>
    );
  }

  if (step === "analyzing") {
    return (
      <QuizLayout title="Analyzing Your Scalp" showBack={false}>
        <div className="flex flex-col items-center py-16">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6" />
          <p className="text-gray-600">Our AI is analyzing your scalp photos...</p>
          <p className="text-sm text-gray-400 mt-2">This usually takes a few seconds</p>
        </div>
      </QuizLayout>
    );
  }

  const captureLabel = step === "front" ? "Front of Scalp" : "Top of Scalp";

  return (
    <QuizLayout
      title={`Capture: ${captureLabel}`}
      subtitle={`Photo ${step === "front" ? "1" : "2"} of 2 — position your scalp within the guide frame.`}
      onBack={() => setStep(step === "top" ? "front" : "guide")}
    >
      <ProgressBar currentSection={3} sectionLabel="Scalp Assessment" />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-4 text-sm">
          {error}
        </div>
      )}

      {useCamera ? (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] max-w-sm mx-auto">
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
            <div className="w-48 h-64 border-2 border-dashed border-white/70 rounded-[50%]" />
          </div>
          <button
            onClick={captureFromCamera}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-500 shadow-lg"
          />
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-48 h-64 mx-auto border-2 border-dashed border-emerald-300 rounded-[50%] bg-emerald-50 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Guide frame</span>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Upload Photo
            </button>
            <button
              onClick={() => setUseCamera(true)}
              className="px-6 py-3 border-2 border-emerald-600 text-emerald-700 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
            >
              Use Camera
            </button>
          </div>
        </div>
      )}

      {(frontImage || topImage) && (
        <div className="mt-4 flex gap-2 justify-center">
          {frontImage && (
            <div className="text-center">
              <img src={frontImage} alt="Front" className="w-16 h-16 rounded-lg object-cover border-2 border-emerald-400" />
              <span className="text-xs text-gray-500">Front ✓</span>
            </div>
          )}
          {topImage && (
            <div className="text-center">
              <img src={topImage} alt="Top" className="w-16 h-16 rounded-lg object-cover border-2 border-emerald-400" />
              <span className="text-xs text-gray-500">Top ✓</span>
            </div>
          )}
        </div>
      )}
    </QuizLayout>
  );
}
