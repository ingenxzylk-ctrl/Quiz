interface PrivacyNoticeProps {
  accepted: boolean;
  onAccept: (accepted: boolean) => void;
}

export default function PrivacyNotice({ accepted, onAccept }: PrivacyNoticeProps) {
  return (
    <div className="rounded-2xl border border-[#fde68a]/60 bg-gradient-to-br from-[#fffbeb] to-[#fef3c7]/40 p-5 sm:p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-[#d97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-[#92400e] text-[0.9375rem]">Your Health Data Privacy</h3>
          <p className="text-sm text-[#a16207] mt-1 leading-relaxed">
            Health conditions, lifestyle habits, and scalp photos are encrypted and stored securely.
            Used only for your assessment — never shared without consent.
          </p>
        </div>
      </div>
      <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-white/60 border border-[#fde68a]/40 hover:bg-white/80 transition-colors">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onAccept(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-[#d97706]/40 text-[#1a5c45] focus:ring-[#1a5c45]/30"
        />
        <span className="text-sm text-[#78350f] leading-relaxed">
          I consent to the secure collection and storage of my health data for this assessment.
        </span>
      </label>
    </div>
  );
}
