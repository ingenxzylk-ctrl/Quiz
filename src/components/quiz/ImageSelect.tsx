import { SelectOption } from "@/types/quiz";
import Image from "next/image";

interface ImageSelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
}

export default function ImageSelect({
  options,
  value,
  onChange,
  columns = 2,
}: ImageSelectProps) {
  const gridCols = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-2 sm:grid-cols-4" };

  return (
    <div className={`grid ${gridCols[columns]} gap-3`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`relative rounded-xl border-2 p-3 text-left transition-all hover:shadow-md ${
            value === opt.id
              ? "border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-200"
              : "border-gray-200 bg-white hover:border-emerald-300"
          }`}
        >
          {opt.image && (
            <div className="aspect-square mb-2 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <Image
                src={opt.image}
                alt={opt.label}
                width={120}
                height={120}
                className="object-contain w-full h-full p-2"
              />
            </div>
          )}
          <span className="block text-sm font-medium text-gray-900">{opt.label}</span>
          {opt.description && (
            <span className="block text-xs text-gray-500 mt-0.5">{opt.description}</span>
          )}
          {value === opt.id && (
            <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
