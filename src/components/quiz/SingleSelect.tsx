import { SelectOption } from "@/types/quiz";

interface SingleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
}

export default function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="space-y-2.5">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`option-card w-full text-left px-4 py-3.5 flex items-center gap-3.5 ${
              selected ? "option-card-selected" : ""
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                selected ? "border-[#1a5c45] bg-[#1a5c45]" : "border-[#d6d3d1]"
              }`}
            >
              {selected && <div className="w-2 h-2 rounded-full bg-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className={`block font-medium text-[0.9375rem] ${selected ? "text-[#1a5c45]" : "text-[#1c1917]"}`}>
                {opt.label}
              </span>
              {opt.description && (
                <span className="block text-sm text-[#78716c] mt-0.5">{opt.description}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
