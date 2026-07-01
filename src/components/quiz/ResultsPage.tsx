"use client";

import { QuizResult } from "@/types/quiz";

const FACTOR_COLORS: Record<string, string> = {
  genetic: "bg-purple-100 text-purple-800",
  hormonal: "bg-pink-100 text-pink-800",
  nutritional: "bg-orange-100 text-orange-800",
  "stress-related": "bg-blue-100 text-blue-800",
  "scalp-related": "bg-teal-100 text-teal-800",
};

interface ResultsPageProps {
  result: QuizResult;
  userName?: string;
  onSaveProgress?: () => void;
}

export default function ResultsPage({ result, userName, onSaveProgress }: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {userName ? `${userName}'s ` : "Your "}Hair Health Report
          </h1>
          <p className="text-gray-500 mt-2">Personalized assessment based on your responses</p>
        </div>

        {/* Stage Classification */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Stage Classification</h2>
          <p className="text-2xl font-bold text-emerald-700">{result.finalStage}</p>
          <p className="text-gray-600 mt-2">{result.stageDescription}</p>

          {result.mismatchFlag && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-800">
                <strong>Let&apos;s double-check:</strong> Your self-reported stage and our AI analysis
                show some difference. We recommend a free consultation to get the most accurate assessment.
              </p>
            </div>
          )}

          {result.lowConfidence && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                Our AI confidence is below 70% for this assessment. We&apos;re showing an estimated range
                rather than a definitive stage. A free consultation can provide a more precise evaluation.
              </p>
            </div>
          )}

          {result.aiPredictedStage && (
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span>Self-reported: {result.selfReportedStage}</span>
              <span>AI analysis: {result.aiPredictedStage}</span>
              {result.aiConfidence && <span>Confidence: {Math.round(result.aiConfidence * 100)}%</span>}
            </div>
          )}
        </div>

        {/* Regrowth Outlook */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 mb-6">
          <h2 className="font-semibold text-emerald-900 mb-2">Your Outlook</h2>
          <p className="text-emerald-800 leading-relaxed">{result.regrowthOutlook}</p>
        </div>

        {/* Contributing Factors */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Likely Contributing Factors</h2>
          <div className="space-y-4">
            {result.contributingFactors.map((factor, i) => (
              <div key={i} className="flex gap-3">
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${FACTOR_COLORS[factor.tag] || "bg-gray-100 text-gray-800"}`}>
                  {factor.label}
                </span>
                <p className="text-sm text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Recommended Next Steps</h2>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="shrink-0 w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                {rec}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-3">
          <button className="w-full py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            Book a Free Consultation
          </button>
          <button className="w-full py-4 border-2 border-emerald-600 text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors">
            View Recommended Routine
          </button>
          {onSaveProgress && (
            <button
              onClick={onSaveProgress}
              className="w-full py-3 text-gray-500 text-sm hover:text-emerald-700 transition-colors"
            >
              Save results &amp; email me a copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
