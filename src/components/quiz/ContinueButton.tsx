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
      className="w-full mt-8 py-3.5 px-6 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
    >
      {label}
    </button>
  );
}
