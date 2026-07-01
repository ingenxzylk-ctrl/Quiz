import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-50">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6">
          <span className="text-4xl">🌿</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Hair &amp; Scalp Health Assessment
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
          Take our personalized 4-step quiz to understand your hair health, identify root causes,
          and get AI-powered scalp analysis with a tailored action plan.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 max-w-lg mx-auto">
          {[
            { step: "1", label: "About You" },
            { step: "2", label: "Hair Health" },
            { step: "3", label: "Internal Health" },
            { step: "4", label: "Scalp Scan" },
          ].map((s) => (
            <div key={s.step} className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-1">
                {s.step}
              </div>
              <p className="text-xs text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        <Link
          href="/quiz"
          className="inline-block px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md text-lg"
        >
          Start Free Assessment
        </Link>

        <p className="text-sm text-gray-400 mt-6">Takes about 5–7 minutes · No commitment required</p>

        <div className="mt-16 grid sm:grid-cols-3 gap-6 text-left">
          {[
            { icon: "🔬", title: "AI Scalp Analysis", desc: "Upload photos for AI-powered stage classification with confidence scoring." },
            { icon: "🧬", title: "Root Cause Mapping", desc: "We analyze genetic, hormonal, nutritional, and lifestyle factors together." },
            { icon: "💚", title: "Hope-Forward Results", desc: "Honest, reassuring guidance with clear next steps — never alarmist." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="font-semibold text-gray-900 mt-2">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
