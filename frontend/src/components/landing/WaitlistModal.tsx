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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn font-montserrat"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-10 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#0B0B0B] border border-[#242321] text-[#716B63] hover:text-[#F4F0E8] hover:border-white/20 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E]">
                FIRST DROP · VIP ACCESS
              </span>
              <h3 id="waitlist-title" className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] tracking-tight">
                Be first when doors open.
              </h3>
              <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
                Join the launch waitlist for VYOMIK. You will receive private access 1 hour before our public drop.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="waitlist-email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#716B63]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="waitlist-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] text-[#F4F0E8] placeholder:text-[#716B63] text-xs sm:text-sm rounded-xl outline-none transition-colors"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-red-400 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={waitlistMutation.isPending}
                className="w-full h-11 sm:h-12 bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center cursor-pointer disabled:opacity-50"
              >
                {waitlistMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Request VIP Invitation'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 bg-[#2A1810] border border-[#C85A2E]/40 text-[#C85A2E] rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-bold text-[#F4F0E8]">
              You are on the list.
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A29E] max-w-xs mx-auto">
              We have reserved your invitation. Keep an eye on your inbox for launch announcements.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-[#141414] border border-[#242321] hover:border-white/30 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
