interface HopeMessageProps {
  message: string;
  variant?: "success" | "info";
}

export default function HopeMessage({ message, variant = "success" }: HopeMessageProps) {
  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div className={`rounded-xl border p-4 my-4 ${styles[variant]}`}>
      <div className="flex gap-3">
        <span className="text-xl shrink-0">✨</span>
        <p className="text-sm leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
