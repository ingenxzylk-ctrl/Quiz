import Link from "next/link";
import BrandMark from "@/components/ui/BrandMark";

const STEPS = [
  { num: "01", label: "About You", desc: "Basic profile", icon: "👤" },
  { num: "02", label: "Hair Health", desc: "Fall & pattern", icon: "💇" },
  { num: "03", label: "Internal Health", desc: "Root causes", icon: "🩺" },
  { num: "04", label: "Scalp Scan", desc: "AI analysis", icon: "📸" },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-1.47 4.41a2.25 2.25 0 01-2.12 1.59H8.59a2.25 2.25 0 01-2.12-1.59L5 14.5" />
      </svg>
    ),
    title: "AI Scalp Analysis",
    desc: "Dual-angle photo capture with confidence-scored stage classification.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "Root Cause Mapping",
    desc: "Genetic, hormonal, nutritional, and lifestyle factors analyzed together.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Hope-Forward Results",
    desc: "Honest, reassuring guidance with clear next steps — never alarmist.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen mesh-bg">
      {/* Decorative */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#1a5c45]/6 blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#c9a227]/8 blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <BrandMark />
        <Link
          href="/quiz"
          className="text-sm font-semibold text-[#1a5c45] hover:text-[#144736] transition-colors"
        >
          Start Assessment →
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-20 sm:pt-16 sm:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a5c45]/10 border border-[#1a5c45]/15 text-[#1a5c45] text-xs font-semibold uppercase tracking-wider mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a5c45] animate-pulse" />
              Free · 5 min assessment
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold text-[#1c1917] leading-[1.15] tracking-tight">
              Understand your hair.
              <span className="block text-[#1a5c45] mt-1">Start your recovery.</span>
            </h1>
            <p className="mt-6 text-lg text-[#78716c] leading-relaxed max-w-md">
              A personalized 4-step diagnostic quiz with AI-powered scalp analysis
              and a tailored action plan — built around you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/quiz" className="btn-primary inline-flex items-center justify-center gap-2 py-4 px-8 text-base">
                Start Free Assessment
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <span className="flex items-center justify-center text-sm text-[#a8a29e] px-4">
                No commitment · Private & secure
              </span>
            </div>

            {/* Trust strip */}
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-[#78716c]">
              {["50,000+ assessments", "AI-powered analysis", "Doctor-reviewed"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#1a5c45]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Steps card */}
          <div className="quiz-card p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#1a5c45] mb-5">
              How it works
            </p>
            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#f7f5f0]/80 border border-[rgba(28,25,23,0.05)] hover:border-[#1a5c45]/15 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                    {step.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#c9a227]">{step.num}</span>
                      <h3 className="font-semibold text-[#1c1917]">{step.label}</h3>
                    </div>
                    <p className="text-sm text-[#78716c]">{step.desc}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block w-px h-8 bg-[#e7e5e4] absolute" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid sm:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="quiz-card p-6 hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-[#e8f3ed] text-[#1a5c45] flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-[#1c1917] text-[0.9375rem]">{f.title}</h3>
              <p className="text-sm text-[#78716c] mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 border-t border-[rgba(28,25,23,0.06)] bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#1c1917]">
            Ready to take the first step?
          </p>
          <Link href="/quiz" className="btn-primary inline-flex mt-5 py-3.5 px-8">
            Begin Your Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
