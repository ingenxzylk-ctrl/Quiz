const SECTIONS = [
  { label: "About You", short: "You" },
  { label: "Hair Health", short: "Hair" },
  { label: "Internal Health", short: "Health" },
  { label: "Scalp Scan", short: "Scan" },
];

interface ProgressBarProps {
  currentSection: number;
  totalSections?: number;
  sectionLabel?: string;
}

export default function ProgressBar({
  currentSection,
  totalSections = 4,
}: ProgressBarProps) {
  const percent = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="w-full">
      {/* Step dots */}
      <div className="flex items-center justify-between mb-3">
        {SECTIONS.slice(0, totalSections).map((section, i) => {
          const isComplete = i < currentSection;
          const isCurrent = i === currentSection;
          return (
            <div key={section.label} className="flex flex-col items-center flex-1 relative">
              {i > 0 && (
                <div
                  className={`absolute right-1/2 top-3.5 w-full h-0.5 -translate-y-1/2 ${
                    isComplete ? "bg-[#1a5c45]" : "bg-[#e7e5e4]"
                  }`}
                  style={{ width: "calc(100% - 1.75rem)", left: "calc(-50% + 0.875rem)" }}
                />
              )}
              <div
                className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isComplete
                    ? "bg-[#1a5c45] text-white shadow-md"
                    : isCurrent
                    ? "bg-[#1a5c45] text-white ring-4 ring-[#1a5c45]/20 shadow-md scale-110"
                    : "bg-white border-2 border-[#e7e5e4] text-[#a8a29e]"
                }`}
              >
                {isComplete ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] sm:text-xs font-medium hidden sm:block ${
                  isCurrent ? "text-[#1a5c45]" : isComplete ? "text-[#1a5c45]/70" : "text-[#a8a29e]"
                }`}
              >
                {section.short}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[#e7e5e4] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#1a5c45] to-[#2d8a66] transition-all duration-700 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-[#1a5c45] whitespace-nowrap tabular-nums">
          {currentSection + 1}/{totalSections}
        </span>
      </div>
    </div>
  );
}
