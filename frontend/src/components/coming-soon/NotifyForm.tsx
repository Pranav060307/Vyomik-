import React, { useState } from 'react';
import { useWaitlist } from '../../hooks/useWaitlist';
import { useToast } from '../../context/ToastContext';

export const NotifyForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const waitlistMutation = useWaitlist();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      toast('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    waitlistMutation.mutate(
      { email: cleanEmail, source: 'coming_soon_gate' },
      {
        onSuccess: (data) => {
          setIsSubmitting(false);
          setEmail('');
          try {
            localStorage.setItem('vyomik_waitlist_registered', cleanEmail);
          } catch {
            // Ignore storage restriction
          }

          if (data.is_duplicate || data.message?.toLowerCase().includes('already')) {
            toast('You are already on the VIP list. We will notify you at launch!');
          } else {
            toast(data.message || "You're on the list! We'll email you 1 hour before doors open.");
          }
        },
        onError: (err) => {
          setIsSubmitting(false);
          // Strict Rule: Never report success when backend submission fails
          const message =
            err instanceof Error && err.message
              ? err.message
              : 'Unable to join waitlist. Please check your connection and try again.';
          toast(message);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[440px] sm:max-w-[480px] h-11 sm:h-12 flex items-center rounded-xl border border-[#3A3530] bg-[#141210]/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] backdrop-blur-sm overflow-hidden transition-all duration-200 focus-within:border-[#A64B2A] focus-within:shadow-[0_0_20px_rgba(166,75,42,0.3)] z-20 relative"
      aria-label="Waitlist email subscription form"
    >
      {/* Mail Envelope Icon */}
      <div className="pl-4 pr-2 text-[#716B63] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      </div>

      {/* Email Input Field */}
      <input
        id="waitlist-email-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isSubmitting}
        placeholder="Enter your email"
        autoComplete="off"
        spellCheck={false}
        required
        className="flex-1 min-w-0 bg-transparent border-0 outline-none text-[#F4F0E8] font-montserrat text-sm sm:text-[15px] placeholder:text-[#8E877D] caret-[#A64B2A] px-2"
      />

      {/* Notify Me Submit Button */}
      <button
        type="submit"
        aria-label="Submit email notification"
        disabled={isSubmitting}
        className="h-full px-5 sm:px-6 bg-[#A64B2A] hover:bg-[#BA5632] active:scale-[0.98] text-[#F4F0E8] font-montserrat font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 cursor-pointer transition-all duration-200 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
      >
        <span>{isSubmitting ? 'Submitting...' : 'Notify Me'}</span>
        {!isSubmitting && <span className="text-base leading-none">→</span>}
      </button>
    </form>
  );
};
