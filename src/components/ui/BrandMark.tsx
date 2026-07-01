import Link from "next/link";

interface BrandMarkProps {
  href?: string;
  size?: "sm" | "md";
}

export default function BrandMark({ href = "/", size = "md" }: BrandMarkProps) {
  const iconSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const textSize = size === "sm" ? "text-base" : "text-lg";

  const content = (
    <div className="flex items-center gap-2.5">
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-[#1a5c45] to-[#2d8a66] flex items-center justify-center shadow-md`}
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <span className={`font-[family-name:var(--font-display)] font-semibold text-[#1c1917] ${textSize} tracking-tight`}>
        Follicle<span className="text-[#1a5c45]">Care</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-flex hover:opacity-90 transition-opacity">{content}</Link>;
  }
  return content;
}
