import { SelectOption } from "@/types/quiz";

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
}

export default function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const toggle = (id: string) => {
    if (id === "none") {
      onChange(["none"]);
      return;
    }
    const withoutNone = value.filter((v) => v !== "none");
    if (withoutNone.includes(id)) {
      onChange(withoutNone.filter((v) => v !== id));
    } else {
      onChange([...withoutNone, id]);
    }
  };

  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const selected = value.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`option-card w-full text-left px-4 py-3.5 flex items-center gap-3.5 ${
              selected ? "option-card-selected" : ""
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                selected ? "border-[#1a5c45] bg-[#1a5c45]" : "border-[#d6d3d1] bg-white"
              }`}
            >
              {selected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className={`font-medium text-[0.9375rem] ${selected ? "text-[#1a5c45]" : "text-[#1c1917]"}`}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
