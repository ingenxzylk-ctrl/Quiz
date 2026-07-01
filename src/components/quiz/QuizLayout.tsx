import { ReactNode } from "react";

interface QuizLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
}

export default function QuizLayout({
  children,
  title,
  subtitle,
  onBack,
  showBack = true,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="mb-6 flex items-center gap-1 text-gray-500 hover:text-emerald-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
