import { ReactNode } from "react";

interface QuestionHeadingProps {
  title: string;
  subtitle?: string;
}

export function QuestionHeading({ title, subtitle }: QuestionHeadingProps) {
  return (
    <div className="mb-6 animate-fade-in-up">
      <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-[1.75rem] font-semibold text-[#1c1917] leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[#78716c] text-[0.9375rem] leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

interface QuizCardProps {
  children: ReactNode;
  className?: string;
}

export function QuizCard({ children, className = "" }: QuizCardProps) {
  return (
    <div className={`quiz-card p-6 sm:p-8 animate-fade-in-up ${className}`}>
      {children}
    </div>
  );
}
