interface ProgressBarProps {
  currentSection: number;
  totalSections?: number;
  sectionLabel?: string;
}

export default function ProgressBar({
  currentSection,
  totalSections = 4,
  sectionLabel,
}: ProgressBarProps) {
  const percent = ((currentSection + 1) / totalSections) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-emerald-700">
          Step {currentSection + 1} of {totalSections}
        </span>
        {sectionLabel && (
          <span className="text-sm text-gray-500">{sectionLabel}</span>
        )}
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
