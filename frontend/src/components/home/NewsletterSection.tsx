import React, { useState } from 'react';
import { useWaitlist } from '../../hooks/useWaitlist';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const waitlistMutation = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    try {
      await waitlistMutation.mutateAsync({
        email: trimmed,
        source: 'homepage_collective',
      });
      setStatusMessage({
        type: 'success',
        text: 'Welcome to the VYOMIK Collective. Check your inbox soon.',
      });
      setEmail('');
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <section
      aria-label="Join Collective"
      className="w-full relative py-20 sm:py-28 overflow-hidden bg-[#0B0B0B]"
    >
      {/* Background Volcanic Rock Backdrop */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src="/images/vyomik/backgrounds/newsletter-atmosphere.webp"
          alt="Cinematic atmospheric backdrop"
          className="w-full h-full object-cover object-center opacity-65"
          loading="lazy"
        />
        {/* Soft edge gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-transparent to-[#0B0B0B]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        {/* Section Heading */}
        <h2 className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F4F0E8] select-none">
          JOIN THE VYOMIK COLLECTIVE
        </h2>

        {/* Subtitle */}
        <p className="font-montserrat text-xs sm:text-sm text-[#D9D1C3] mt-3.5 mb-8 sm:mb-10 max-w-lg leading-relaxed">
          Get early access to new drops, exclusive offers and behind-the-scenes.
        </p>

        {/* Subscription Form matching Reference */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl flex flex-col sm:flex-row items-center gap-3 p-1.5 sm:p-2 rounded-2xl bg-[#141210]/90 backdrop-blur-md border border-[#242321] shadow-2xl focus-within:border-[#A64B2A] transition-colors"
        >
          {/* Email Input Field */}
          <div className="flex items-center gap-3 flex-1 px-4 py-2.5 sm:py-2 w-full">
            <svg className="w-4 h-4 text-[#716B63] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              required
              className="w-full bg-transparent text-sm text-[#F4F0E8] placeholder-[#716B63] font-montserrat focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={waitlistMutation.isPending}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#A64B2A] hover:bg-[#8e3f22] text-[#F4F0E8] font-montserrat font-semibold text-xs tracking-wider uppercase transition-all duration-200 transform hover:-translate-y-0.5 shrink-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{waitlistMutation.isPending ? 'Joining...' : 'Subscribe'}</span>
            {!waitlistMutation.isPending && (
              <span>&rarr;</span>
            )}
          </button>
        </form>

        {/* Feedback / Status Notification */}
        {statusMessage && (
          <div
            className={`mt-4 px-4 py-2 rounded-lg text-xs font-montserrat font-medium transition-all ${
              statusMessage.type === 'success'
                ? 'bg-[#141210] border border-green-800 text-green-300'
                : 'bg-[#141210] border border-red-800 text-red-300'
            }`}
          >
            {statusMessage.text}
          </div>
        )}
      </div>
    </section>
  );
};
