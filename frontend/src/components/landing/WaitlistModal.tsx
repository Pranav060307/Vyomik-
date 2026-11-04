import React, { useState, useEffect } from 'react';
import { X, Check, Loader2, Mail } from 'lucide-react';
import { useWaitlist } from '../../hooks/useWaitlist';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSource?: string;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({
  isOpen,
  onClose,
  initialSource = 'hero_cta',
}) => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const waitlistMutation = useWaitlist();

  // Reset modal state on open
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setErrorMsg(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    waitlistMutation.mutate(
      { email: trimmed, source: initialSource },
      {
        onSuccess: () => {
          setIsSuccess(true);
        },
        onError: (err) => {
          setErrorMsg(err.message || 'Something went wrong. Please try again.');
        },
      }
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202020]/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#F4F3EE] border border-[#202020] p-8 sm:p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#202020] hover:opacity-60 transition-opacity focus:outline-none"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#5C6548]">
                FIRST DROP · VIP ACCESS
              </span>
              <h3 id="waitlist-title" className="text-2xl sm:text-3xl font-semibold text-[#202020] tracking-tight">
                Be first when doors open.
              </h3>
              <p className="text-xs sm:text-sm text-[#202020]/70 leading-relaxed">
                Join the launch waitlist for VYOMIK. You will receive private access 1 hour before our public drop on 8 November 2026.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="waitlist-email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#202020]/40">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3.5 bg-white border border-[#DAD7CE] text-[#202020] text-sm placeholder:text-[#202020]/40 focus:border-[#202020] focus:ring-1 focus:ring-[#202020] transition-colors outline-none"
                    disabled={waitlistMutation.isPending}
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-red-700 font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={waitlistMutation.isPending}
                className="w-full bg-[#202020] text-[#F4F3EE] py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#333333] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {waitlistMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving your place...</span>
                  </>
                ) : (
                  <span>Notify me at launch ↗</span>
                )}
              </button>

              <p className="text-[10px] text-center text-[#202020]/50 tracking-wider">
                NO SPAM. JUST ONE NOTIFICATION WHEN THE STORE GOES LIVE.
              </p>
            </form>
          </div>
        ) : (
          /* Success Confirmation View */
          <div className="text-center py-6 space-y-5 animate-fadeIn">
            <div className="w-12 h-12 bg-[#5C6548] text-[#F4F3EE] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-semibold text-[#202020]">
                You're on the list.
              </h4>
              <p className="text-xs sm:text-sm text-[#202020]/80 max-w-sm mx-auto leading-relaxed">
                We've reserved your early access spot for <span className="font-semibold">{email}</span>. Check your inbox 1 hour before the public drop.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 border border-[#202020] bg-transparent text-[#202020] px-6 py-2.5 text-xs font-medium uppercase tracking-[0.16em] hover:bg-[#202020] hover:text-[#F4F3EE] transition-colors"
            >
              Back to experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

