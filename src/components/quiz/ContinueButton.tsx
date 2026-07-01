"use client";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function ContinueButton({
  onClick,
  disabled = false,
  label = "Continue",
}: ContinueButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn-primary w-full mt-8 py-4 px-6 text-[0.9375rem] flex items-center justify-center gap-2"
    >
      {label}
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
}
