import { SelectOption } from "@/types/quiz";

interface SingleSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
}

export default function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
            value === opt.id
              ? "border-emerald-600 bg-emerald-50 text-emerald-900"
              : "border-gray-200 bg-white hover:border-emerald-300 text-gray-700"
          }`}
        >
          <span className="font-medium">{opt.label}</span>
          {opt.description && (
            <span className="block text-sm text-gray-500 mt-0.5">{opt.description}</span>
          )}
        </button>
      ))}
    </div>
  );
}
