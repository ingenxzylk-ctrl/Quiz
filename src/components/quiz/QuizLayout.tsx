import { ReactNode } from "react";
import BrandMark from "@/components/ui/BrandMark";

interface QuizLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  progress?: ReactNode;
}

export default function QuizLayout({
  children,
  title,
  subtitle,
  onBack,
  showBack = true,
  progress,
}: QuizLayoutProps) {
  return (
    <div className="min-h-screen mesh-bg">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#1a5c45]/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-[#c9a227]/8 blur-3xl" />
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-20 glass-card border-b border-[rgba(28,25,23,0.06)]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <BrandMark href="/" size="sm" />
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-[#78716c] hover:text-[#1a5c45] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#1a5c45]/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          )}
        </div>
        {progress && (
          <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-4">
            {progress}
          </div>
        )}
      </header>

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c45] mb-2">
            Assessment
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-semibold text-[#1c1917] tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-[#78716c] text-base leading-relaxed max-w-lg">{subtitle}</p>
          )}
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
