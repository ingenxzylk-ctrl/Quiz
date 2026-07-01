"use client";

import { QuizResult } from "@/types/quiz";
import BrandMark from "@/components/ui/BrandMark";

const FACTOR_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  genetic: { bg: "bg-purple-50", text: "text-purple-800", dot: "bg-purple-500" },
  hormonal: { bg: "bg-pink-50", text: "text-pink-800", dot: "bg-pink-500" },
  nutritional: { bg: "bg-orange-50", text: "text-orange-800", dot: "bg-orange-500" },
  "stress-related": { bg: "bg-blue-50", text: "text-blue-800", dot: "bg-blue-500" },
  "scalp-related": { bg: "bg-teal-50", text: "text-teal-800", dot: "bg-teal-500" },
};

interface ResultsPageProps {
  result: QuizResult;
  userName?: string;
  onSaveProgress?: () => void;
}

export default function ResultsPage({ result, userName, onSaveProgress }: ResultsPageProps) {
  const confidencePercent = result.aiConfidence ? Math.round(result.aiConfidence * 100) : null;

  return (
    <div className="min-h-screen mesh-bg">
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#1a5c45]/5 blur-3xl" />
      </div>

      <header className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <BrandMark href="/" size="sm" />
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-16">
        {/* Hero */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a5c45] to-[#2d8a66] shadow-lg mb-5">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c45] mb-2">
            Assessment Complete
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1c1917] tracking-tight">
            {userName ? `${userName}'s ` : "Your "}Hair Health Report
          </h1>
          <p className="text-[#78716c] mt-2">Personalized insights based on your responses & scalp analysis</p>
        </div>

        {/* Stage card */}
        <div className="quiz-card p-6 sm:p-8 mb-5 animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#78716c] mb-3">Stage Classification</p>
          <p className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1a5c45] leading-tight">
            {result.finalStage}
          </p>
          <p className="text-[#57534e] mt-3 leading-relaxed">{result.stageDescription}</p>

          {confidencePercent !== null && (
            <div className="mt-6 p-4 rounded-xl bg-[#f7f5f0]">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-[#57534e]">AI Confidence</span>
                <span className="font-bold text-[#1a5c45]">{confidencePercent}%</span>
              </div>
              <div className="h-2 bg-[#e7e5e4] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    confidencePercent >= 70 ? "bg-gradient-to-r from-[#1a5c45] to-[#2d8a66]" : "bg-gradient-to-r from-[#d97706] to-[#f59e0b]"
                  }`}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
            </div>
          )}

          {result.mismatchFlag && (
            <div className="mt-5 flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/80">
              <span className="text-xl shrink-0">🔍</span>
              <p className="text-sm text-amber-900 leading-relaxed">
                <strong>Let&apos;s double-check:</strong> Your self-reported stage and AI analysis differ.
                A free consultation can provide the most accurate assessment.
              </p>
            </div>
          )}

          {result.lowConfidence && (
            <div className="mt-5 flex gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200/80">
              <span className="text-xl shrink-0">📊</span>
              <p className="text-sm text-blue-900 leading-relaxed">
                AI confidence is below 70%. We&apos;re showing an estimated range — a consultation can refine this.
              </p>
            </div>
          )}

          {result.aiPredictedStage && (
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                { label: "Self-reported", value: result.selfReportedStage },
                { label: "AI analysis", value: result.aiPredictedStage },
              ].map((item) => (
                <span key={item.label} className="px-3 py-1.5 rounded-lg bg-[#f7f5f0] text-xs font-medium text-[#57534e]">
                  {item.label}: <strong className="text-[#1c1917]">{item.value}</strong>
                </span>
              ))}
            </div>
          )}

          {result.aiReasoning && (
            <p className="mt-4 text-sm text-[#57534e] leading-relaxed italic border-l-2 border-[#1a5c45]/30 pl-4">
              {result.aiReasoning}
            </p>
          )}
        </div>

        {/* Outlook */}
        <div className="rounded-2xl bg-gradient-to-br from-[#1a5c45] to-[#227a5a] p-6 sm:p-8 mb-5 text-white shadow-lg animate-fade-in-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌱</span>
            <h2 className="font-semibold text-lg">Your Outlook</h2>
          </div>
          <p className="text-white/90 leading-relaxed text-[0.9375rem]">{result.regrowthOutlook}</p>
        </div>

        {/* Factors */}
        <div className="quiz-card p-6 sm:p-8 mb-5 animate-fade-in-up">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1c1917] mb-5">
            Likely Contributing Factors
          </h2>
          <div className="space-y-4">
            {result.contributingFactors.map((factor, i) => {
              const style = FACTOR_STYLES[factor.tag] || { bg: "bg-gray-50", text: "text-gray-800", dot: "bg-gray-500" };
              return (
                <div key={i} className={`flex gap-4 p-4 rounded-xl ${style.bg}`}>
                  <div className={`w-2 h-2 rounded-full ${style.dot} mt-2 shrink-0`} />
                  <div>
                    <p className={`font-semibold text-sm ${style.text}`}>{factor.label}</p>
                    <p className="text-sm text-[#57534e] mt-1 leading-relaxed">{factor.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommendations */}
        <div className="quiz-card p-6 sm:p-8 mb-8 animate-fade-in-up">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#1c1917] mb-5">
            Recommended Next Steps
          </h2>
          <ul className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex gap-4 p-3 rounded-xl hover:bg-[#f7f5f0]/80 transition-colors">
                <span className="shrink-0 w-8 h-8 bg-[#e8f3ed] text-[#1a5c45] rounded-lg flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-[#57534e] leading-relaxed pt-1.5">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTAs */}
        <div className="space-y-3 animate-fade-in-up">
          <button className="btn-primary w-full py-4 text-base">
            Book a Free Consultation
          </button>
          <button className="btn-secondary w-full py-4 text-base">
            View Recommended Routine
          </button>
          {onSaveProgress && (
            <button
              onClick={onSaveProgress}
              className="w-full py-3 text-sm font-medium text-[#78716c] hover:text-[#1a5c45] transition-colors"
            >
              Save results &amp; email me a copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
