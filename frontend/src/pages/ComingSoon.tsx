import React, { useState, useEffect } from 'react';
import { ArrowDown, ArrowUpRight, Check, Loader2 } from 'lucide-react';
import { Countdown } from '../components/Countdown';
import { useLaunchGate } from '../hooks/useLaunchGate';
import { useWaitlist } from '../hooks/useWaitlist';
import { DEMO_IMAGES } from '../config/demoContent';
import { instagramUrl, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';

function formatLaunchDateDisplay(isoString?: string): string {
  if (!isoString) return '08.11.2026';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '08.11.2026';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return '08.11.2026';
  }
}

export const ComingSoon: React.FC = () => {
  const { onExplore, launchAtIso, serverTimeIso, isTimePassed } = useLaunchGate();
  const [activeColor, setActiveColor] = useState<'ivory' | 'black'>('ivory');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [liveState, setLiveState] = useState(isTimePassed);

  useEffect(() => {
    if (isTimePassed) {
      setLiveState(true);
    }
  }, [isTimePassed]);

  const waitlistMutation = useWaitlist();
  const dateFormatted = formatLaunchDateDisplay(launchAtIso);

  // Set document title and OpenGraph / Twitter tags
  useEffect(() => {
    document.title = `VYOMIK · The First Drop · ${dateFormatted}`;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };

    setMeta('description', `VYOMIK — Oversized essentials clothing brand launching ${dateFormatted}. Architectural silhouettes, 240 GSM combed cotton, 450 GSM French Terry.`);
    setMeta('og:title', `VYOMIK · The First Drop · ${dateFormatted}`, true);
    setMeta('og:description', 'Room to be you. Oversized essentials for everyday presence.', true);
    setMeta('og:image', DEMO_IMAGES.hero.ivory, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', `VYOMIK · The First Drop · ${dateFormatted}`);
    setMeta('twitter:image', DEMO_IMAGES.hero.ivory);
  }, [dateFormatted]);

  const activeImage = activeColor === 'ivory' ? DEMO_IMAGES.hero.ivory : DEMO_IMAGES.hero.black;

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    waitlistMutation.mutate(
      { email: trimmed, source: 'coming_soon_gate' },
      {
        onSuccess: (data) => {
          setIsSuccess(true);
          setSuccessMessage(data.message || "You're on the list.");
        },
        onError: (err) => {
          setEmailError(err.message || 'Unable to join waitlist. Please try again.');
        },
      }
    );
  };

  const handleExploreClick = () => {
    // 400ms smooth fade/slide transition before route push
    setIsTransitioning(true);
    setTimeout(() => {
      onExplore();
    }, 400);
  };

  return (
    <div
      className={`min-h-[100dvh] w-full bg-[#F4F3EE] text-[#202020] flex flex-col justify-between transition-opacity duration-400 ${
        isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Top Header: Centered Brand Wordmark */}
      <header className="w-full pt-6 sm:pt-8 pb-2 px-4 sm:px-6 lg:px-12 text-center shrink-0">
        <span className="text-2xl sm:text-3xl font-light tracking-[0.28em] uppercase text-[#202020] select-none inline-block">
          VYOMIK
        </span>
      </header>

      {/* Main Centre Block */}
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 lg:px-12 py-6 sm:py-8 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Hero Content, Countdown & Waitlist */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 sm:space-y-7">
            {/* Eyebrow */}
            <div className="flex items-center space-x-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5C6548]">
                THE FIRST DROP
              </span>
              <span className="h-px w-6 bg-[#DAD7CE]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#202020]/60">
                {dateFormatted}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-semibold text-[#202020] leading-[1.06] tracking-[-0.03em] text-balance">
              Room to be you.
            </h1>

            {/* Subcopy with dynamic launch date */}
            <p className="text-base sm:text-lg text-[#202020]/80 font-normal leading-relaxed max-w-[65ch]">
              Easy silhouettes. Quiet confidence. Something new is arriving on{' '}
              <span className="font-medium text-[#202020]">{dateFormatted}</span>.
            </p>

            {/* Live Countdown */}
            <div className="pt-2">
              <Countdown
                targetIso={launchAtIso}
                serverTimeIso={serverTimeIso}
                onZero={() => setLiveState(true)}
              />
            </div>

            {/* Inline Email Waitlist */}
            <div className="pt-2 max-w-lg">
              {!isSuccess ? (
                <form onSubmit={handleInlineSubmit} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <label htmlFor="gate-email" className="sr-only">
                      Email address for launch notification
                    </label>
                    <input
                      id="gate-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email for private access"
                      required
                      disabled={waitlistMutation.isPending}
                      className="flex-1 h-12 px-4 bg-white border border-[#DAD7CE] text-sm text-[#202020] placeholder:text-[#202020]/40 focus:border-[#202020] focus:ring-1 focus:ring-[#202020] outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={waitlistMutation.isPending}
                      className="inline-flex items-center justify-center space-x-2 bg-[#202020] text-[#F4F3EE] h-12 px-6 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] transition-colors disabled:opacity-60 shrink-0"
                    >
                      {waitlistMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Reserving...</span>
                        </>
                      ) : (
                        <>
                          <span>Notify me</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                  {emailError && (
                    <p className="text-xs text-red-700 font-medium">{emailError}</p>
                  )}

                  <p className="text-[10px] uppercase tracking-wider text-[#202020]/50">
                    VIP ACCESS 1 HOUR BEFORE PUBLIC DOORS OPEN. NO SPAM.
                  </p>
                </form>
              ) : (
                <div
                  data-testid="gate-waitlist-success"
                  className="bg-white border border-[#5C6548] p-4 flex items-start space-x-3 animate-fadeIn"
                >
                  <div className="p-1 bg-[#5C6548] text-[#F4F3EE] mt-0.5">
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-[#202020]">
                      {successMessage || "You're on the list."}
                    </p>
                    <p className="text-[11px] text-[#202020]/70 mt-0.5">
                      We'll email <span className="font-medium text-[#202020]">{email}</span> 1 hour before launch.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Visual (Desktop split / Mobile stacked) */}
          <div className="lg:col-span-5 relative flex items-center justify-center bg-[#EAE8E1] p-3 sm:p-6 border border-[#DAD7CE]">
            <div className="relative w-full aspect-[4/5] max-h-[500px] overflow-hidden">
              <img
                src={activeImage}
                alt={`VYOMIK editorial visual in ${activeColor}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                key={activeColor}
              />

              {/* Color chips */}
              <div className="absolute bottom-3 right-3 bg-[#F4F3EE]/95 backdrop-blur-xs p-1.5 border border-[#DAD7CE] shadow-sm flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveColor('ivory')}
                  className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider border transition-all ${
                    activeColor === 'ivory'
                      ? 'border-[#202020] bg-white text-[#202020]'
                      : 'border-transparent text-[#202020]/60'
                  }`}
                  aria-label="Switch to Ivory preview"
                >
                  Ivory
                </button>
                <button
                  type="button"
                  onClick={() => setActiveColor('black')}
                  className={`px-2 py-1 text-[10px] font-medium uppercase tracking-wider border transition-all ${
                    activeColor === 'black'
                      ? 'border-[#202020] bg-white text-[#202020]'
                      : 'border-transparent text-[#202020]/60'
                  }`}
                  aria-label="Switch to Black preview"
                >
                  Black
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Pinned Bottom Block (Visible without scrolling) */}
      <footer className="w-full shrink-0 pb-6 pt-2 px-4 sm:px-6 lg:px-12 flex flex-col items-center">
        {/* Explore Button with Tracked Caption */}
        <div className="text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#5C6548] font-medium mb-2.5">
            {liveState ? 'The store is open' : 'Take a look around while you wait'}
          </p>
          <button
            type="button"
            onClick={handleExploreClick}
            className="group inline-flex items-center space-x-3 bg-[#202020] text-[#F4F3EE] px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] focus-visible:ring-offset-2 transition-all shadow-sm active:scale-[0.99]"
            aria-label={liveState ? 'Enter the store' : 'Explore preview of store'}
          >
            <span>{liveState ? 'Enter the store' : 'Explore'}</span>
            <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        {/* Thin Stone Divider & Mini Footer Row */}
        <div className="w-full max-w-[1280px] border-t border-[#DAD7CE] pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[#202020]/70 space-y-2.5 sm:space-y-0">
          <span>VYOMIK · ROOM TO BE YOU</span>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VYOMIK on Instagram"
              className="inline-flex items-center space-x-1.5 text-[#202020] hover:text-[#5C6548] transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-current" />
              <span>Instagram ↗</span>
            </a>
            <span className="text-[#DAD7CE]">·</span>
            <a
              href={mailtoUrl}
              aria-label="Email VYOMIK"
              className="lowercase text-[#202020] hover:text-[#5C6548] transition-colors"
            >
              {contactEmail}
            </a>
            <span className="text-[#DAD7CE]">·</span>
            <span className="text-[#202020]/60">PUBLIC DROP: {dateFormatted}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
