interface HopeMessageProps {
  message: string;
  variant?: "success" | "info";
}

export default function HopeMessage({ message, variant = "success" }: HopeMessageProps) {
  const styles = {
    success: {
      bg: "bg-gradient-to-r from-[#e8f3ed] to-[#f0faf5]",
      border: "border-[#b8dcc8]",
      text: "text-[#144736]",
      icon: "✨",
    },
    info: {
      bg: "bg-gradient-to-r from-[#eff6ff] to-[#f0f9ff]",
      border: "border-[#bfdbfe]",
      text: "text-[#1e40af]",
      icon: "💡",
    },
  };

  const s = styles[variant];

  return (
    <div className={`rounded-2xl border ${s.border} ${s.bg} p-5 my-5 animate-fade-in-up`}>
      <div className="flex gap-3.5">
        <span className="text-2xl shrink-0 animate-float">{s.icon}</span>
        <p className={`text-sm leading-relaxed font-medium ${s.text}`}>{message}</p>
      </div>
    </div>
  );
}
