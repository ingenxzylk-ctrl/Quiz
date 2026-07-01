interface PrivacyNoticeProps {
  accepted: boolean;
  onAccept: (accepted: boolean) => void;
}

export default function PrivacyNotice({ accepted, onAccept }: PrivacyNoticeProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
      <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your Health Data Privacy
      </h3>
      <p className="text-sm text-amber-800 mb-3 leading-relaxed">
        The information you share — including health conditions, lifestyle habits, and scalp photos —
        is encrypted and stored securely. We use it solely to generate your personalized assessment
        and will never share it with third parties without your consent.
      </p>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAccept(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-amber-400 text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-sm text-amber-900">
          I understand and consent to the collection and secure storage of my health data for this assessment.
        </span>
      </label>
    </div>
  );
}
