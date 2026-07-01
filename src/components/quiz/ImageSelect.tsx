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
    <div className={`grid ${gridCols[columns]} gap-3 sm:gap-4`}>
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`option-card relative p-3 sm:p-4 text-left group ${
              selected ? "option-card-selected" : ""
            }`}
          >
            {opt.image && (
              <div className="aspect-square mb-3 rounded-xl overflow-hidden bg-gradient-to-br from-[#f7f5f0] to-[#f0ebe3] flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-200">
                <Image
                  src={opt.image}
                  alt={opt.label}
                  width={120}
                  height={120}
                  className="object-contain w-full h-full p-3"
                />
              </div>
            )}
            <span className={`block text-sm font-semibold leading-snug ${selected ? "text-[#1a5c45]" : "text-[#1c1917]"}`}>
              {opt.label}
            </span>
            {opt.description && (
              <span className="block text-xs text-[#78716c] mt-1 leading-relaxed">{opt.description}</span>
            )}
            {selected && (
              <div className="absolute top-2.5 right-2.5 w-6 h-6 bg-[#1a5c45] rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
