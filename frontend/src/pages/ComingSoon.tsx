import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchGate } from '../hooks/useLaunchGate';
import { useWaitlist } from '../hooks/useWaitlist';
import { useToast } from '../context/ToastContext';
import { ClothPreview } from '../components/common/ClothPreview';
import {
  instagramUrl,
  youtubeUrl,
  discordUrl,
  twitterUrl,
  contactEmail,
  mailtoUrl,
  defaultLaunchAt,
} from '../config/brand';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const ComingSoon: React.FC = () => {
  const { launchAtIso } = useLaunchGate();
  const waitlistMutation = useWaitlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 7, hours: 12, minutes: 34, seconds: 56 });
  const [isAlreadySaved, setIsAlreadySaved] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('vyomik_waitlist_registered');
    } catch {
      return false;
    }
  });

  // Countdown timer logic targeting real launch date
  useEffect(() => {
    const targetIso = launchAtIso || defaultLaunchAt;
    let targetTime = new Date(targetIso).getTime();
    if (isNaN(targetTime) || targetTime <= 0) {
      targetTime = new Date('2026-11-10T00:00:00+05:30').getTime();
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeft({
        days: Math.floor(diff / 86400),
        hours: Math.floor((diff % 86400) / 3600),
        minutes: Math.floor((diff % 3600) / 60),
        seconds: diff % 60,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [launchAtIso]);

  const p = (n: number) => String(n).padStart(2, '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      toast('Enter a valid email address');
      return;
    }

    waitlistMutation.mutate(
      { email: cleanEmail, source: 'coming_soon_gate' },
      {
        onSuccess: (data) => {
          setIsAlreadySaved(true);
          try {
            localStorage.setItem('vyomik_waitlist_registered', cleanEmail);
          } catch {
            // Ignore
          }
          setEmail('');
          if (data.is_duplicate || data.message?.toLowerCase().includes('already')) {
            toast('You are already on the VIP waitlist!');
          } else {
            toast(data.message || "You're on the list! We'll email you 1 hour before doors open.");
          }
        },
        onError: () => {
          // Fallback to local storage
          try {
            const list: string[] = JSON.parse(localStorage.getItem('vyomik_waitlist') || '[]');
            if (list.includes(cleanEmail)) {
              setIsAlreadySaved(true);
              toast('You are already on the VIP waitlist!');
              return;
            }
            list.push(cleanEmail);
            localStorage.setItem('vyomik_waitlist', JSON.stringify(list));
            localStorage.setItem('vyomik_waitlist_registered', cleanEmail);
          } catch {
            // Ignore
          }
          setIsAlreadySaved(true);
          setEmail('');
          toast("You're on the list! We'll email you 1 hour before doors open.");
        },
      }
    );
  };

  const socialLinks = [
    { url: instagramUrl, label: 'VYOMIK on Instagram' },
    { url: youtubeUrl, label: 'YouTube' },
    { url: discordUrl, label: 'Discord' },
    { url: twitterUrl, label: 'X' },
  ];

  return (
    <div
      className="coming-soon-wrapper w-full h-screen max-h-screen overflow-hidden bg-[#0a0807] relative flex flex-col justify-between items-center font-montserrat select-none px-4 py-3 sm:py-5 md:py-6"
      style={{
        background:
          'radial-gradient(900px 600px at 15% 5%, #5a4636 0%, transparent 60%), radial-gradient(900px 700px at 100% 100%, #3a2a1e 0%, transparent 60%), #0a0807',
      }}
    >
      {/* Clothes rack on left: anchored flush to bottom and left of screen */}
      <div className="absolute left-0 bottom-0 w-[240px] sm:w-[320px] md:w-[400px] lg:w-[480px] xl:w-[540px] 2xl:w-[600px] h-[86vh] sm:h-[90vh] md:h-[94vh] lg:h-[98vh] 2xl:h-full pointer-events-none z-0 opacity-20 sm:opacity-35 md:opacity-55 lg:opacity-85 2xl:opacity-100 overflow-hidden">
        <ClothPreview
          type="rack"
          img="assets/rack-tees.png"
          className="rack w-full h-full flex items-end justify-start [&>img]:object-left-bottom [&>img]:object-contain"
          alt="VYOMIK collection rack"
        />
      </div>

      {/* Decorative Stripes in top-right corner of screen */}
      <svg
        className="stripes absolute -right-6 -top-4 sm:-right-8 sm:-top-6 lg:-right-[50px] lg:-top-[25px] w-[90px] sm:w-[150px] md:w-[190px] lg:w-[240px] xl:w-[280px] h-auto pointer-events-none z-0 opacity-40 sm:opacity-75 lg:opacity-90 hidden sm:block"
        viewBox="0 0 330 420"
      >
        <polygon points="330,0 330,60 0,420 0,230" fill="#c40a0a" />
        <polygon points="330,100 330,215 0,420 0,330" fill="#e10600" />
        <polygon points="250,0 330,0 0,200 0,130" fill="#e10600" />
      </svg>

      {/* Top Header: Centered Logo using logo.png */}
      <header className="w-full flex justify-center z-10 pt-2 sm:pt-3 md:pt-4 shrink-0">
        <div
          onClick={() => navigate('/home')}
          className="flex items-center justify-center cursor-pointer select-none max-w-full group"
          role="banner"
          aria-label="VYOMIK"
        >
          <img
            src="/assets/logo.png"
            alt="VYOMIK"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
          />
        </div>
      </header>

      {/* Main Hero & Countdown & Notify Body: centered, fit-to-screen */}
      <main className="w-full max-w-xs sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl flex flex-col items-center justify-center text-center my-auto py-1 sm:py-2 z-10 px-2 shrink-0">
        {/* Eyebrow */}
        <div className="eyebrow flex items-center justify-center gap-2 sm:gap-3 md:gap-4 text-[9px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] sm:tracking-[0.3em] font-medium text-[#ddd] mb-1 sm:mb-1.5 whitespace-nowrap">
          <i className="block w-4 sm:w-8 md:w-14 lg:w-20 h-[1.5px] bg-[#ddd]" />
          <span>SOMETHING NEW IS</span>
          <i className="r block w-5 sm:w-10 md:w-16 lg:w-22 h-[1.5px] bg-[#e10600]" />
        </div>

        {/* Main Title */}
        <h1
          className="font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[72px] tracking-tight leading-none text-white mb-1.5 sm:mb-2 whitespace-nowrap"
          role="heading"
          aria-label="COMING SOON."
        >
          COMING <span className="red text-[#e10600]">SOON.</span>
        </h1>

        {/* Subtitle */}
        <p className="sub text-center text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug text-[#d8d2cc] font-normal mb-3 sm:mb-4 md:mb-5 max-w-xs sm:max-w-md lg:max-w-lg">
          A new experience in everyday essentials.
          <br />
          Get ready to edit your style.
        </p>

        {/* Smaller, Elegant Countdown Tiles */}
        <div
          className="count flex justify-center items-center gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4 mb-3 sm:mb-5 md:mb-6 max-w-full"
          data-testid="countdown-tiles"
        >
          {/* DAYS */}
          <div className="box w-[54px] h-[54px] sm:w-[68px] sm:h-[64px] md:w-[84px] md:h-[78px] lg:w-[98px] lg:h-[88px] xl:w-[110px] xl:h-[96px] rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#4a3d33] to-[#17120f] border-[1.5px] border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] text-center pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5 relative overflow-hidden shrink-0">
            <b className="block text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[36px] font-extrabold leading-tight text-white">
              {p(timeLeft.days)}
            </b>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-wider text-white font-medium">
              DAYS
            </span>
            <div
              className="absolute right-0 bottom-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-br-lg sm:rounded-br-xl lg:rounded-br-2xl"
              style={{ background: 'linear-gradient(135deg, transparent 50%, #e10600 50%)' }}
            />
          </div>

          {/* HOURS */}
          <div className="box w-[54px] h-[54px] sm:w-[68px] sm:h-[64px] md:w-[84px] md:h-[78px] lg:w-[98px] lg:h-[88px] xl:w-[110px] xl:h-[96px] rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#4a3d33] to-[#17120f] border-[1.5px] border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] text-center pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5 relative overflow-hidden shrink-0">
            <b className="block text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[36px] font-extrabold leading-tight text-white">
              {p(timeLeft.hours)}
            </b>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-wider text-white font-medium">
              HOURS
            </span>
            <div
              className="absolute right-0 bottom-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-br-lg sm:rounded-br-xl lg:rounded-br-2xl"
              style={{ background: 'linear-gradient(135deg, transparent 50%, #e10600 50%)' }}
            />
          </div>

          {/* MINUTES */}
          <div className="box w-[54px] h-[54px] sm:w-[68px] sm:h-[64px] md:w-[84px] md:h-[78px] lg:w-[98px] lg:h-[88px] xl:w-[110px] xl:h-[96px] rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#4a3d33] to-[#17120f] border-[1.5px] border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] text-center pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5 relative overflow-hidden shrink-0">
            <b className="block text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[36px] font-extrabold leading-tight text-white">
              {p(timeLeft.minutes)}
            </b>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-wider text-white font-medium">
              MINUTES
            </span>
            <div
              className="absolute right-0 bottom-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-br-lg sm:rounded-br-xl lg:rounded-br-2xl"
              style={{ background: 'linear-gradient(135deg, transparent 50%, #e10600 50%)' }}
            />
          </div>

          {/* SECONDS */}
          <div className="box w-[54px] h-[54px] sm:w-[68px] sm:h-[64px] md:w-[84px] md:h-[78px] lg:w-[98px] lg:h-[88px] xl:w-[110px] xl:h-[96px] rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-[#4a3d33] to-[#17120f] border-[1.5px] border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] text-center pt-1 sm:pt-1.5 md:pt-2 lg:pt-2.5 relative overflow-hidden shrink-0">
            <b className="block text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-[36px] font-extrabold leading-tight text-white">
              {p(timeLeft.seconds)}
            </b>
            <span className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-[11px] tracking-wider text-white font-medium">
              SECONDS
            </span>
            <div
              className="absolute right-0 bottom-0 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 rounded-br-lg sm:rounded-br-xl lg:rounded-br-2xl"
              style={{ background: 'linear-gradient(135deg, transparent 50%, #e10600 50%)' }}
            />
          </div>
        </div>

        {/* Notify Form: compact and fit to screen */}
        <form
          onSubmit={handleSubmit}
          className="notify w-full max-w-[280px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[560px] h-[42px] sm:h-[48px] md:h-[54px] lg:h-[58px] flex rounded-xl sm:rounded-2xl border-[1.5px] border-white/30 bg-gradient-to-b from-[#2a2420] to-[#14100d] shadow-[0_0_20px_rgba(225,6,0,0.22)] overflow-hidden"
        >
          <span className="ico w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 my-auto ml-2 sm:ml-3 md:ml-4 mr-1.5 sm:mr-2.5 text-white flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isAlreadySaved ? "You're already in the waitlist" : 'Notify me when we go live'}
            className="flex-1 min-w-0 bg-transparent border-0 outline-none text-white font-normal text-[11px] sm:text-xs md:text-sm lg:text-base font-sans border-l-[1.5px] border-white/30 pl-2 sm:pl-3 my-1 sm:my-1.5 placeholder:text-[#ddd] caret-[#e10600]"
          />
          <button
            type="submit"
            className="w-[42px] sm:w-[58px] md:w-[72px] lg:w-[84px] border-0 bg-gradient-to-b from-[#f01010] to-[#a80000] text-white cursor-pointer flex items-center justify-center hover:brightness-110 active:scale-[0.98] transition-all shrink-0"
            aria-label="Submit email notification"
          >
            <span className="ico w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex items-center justify-center">
              {isAlreadySaved ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-full h-full">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                  <path d="M4 12h16M14 6l6 6-6 6" />
                </svg>
              )}
            </span>
          </button>
        </form>
      </main>

      {/* Footer: Social Follow & Compliance Links */}
      <footer className="w-full flex justify-center items-center z-10 pt-1 pb-1 sm:pb-2 shrink-0">
        <div className="follow flex justify-center items-center gap-2 sm:gap-3 md:gap-4 text-[9px] sm:text-xs md:text-sm tracking-[0.2em] text-[#ddd]">
          <span>FOLLOW US</span>
          <i className="block w-5 sm:w-10 md:w-14 h-[1.5px] bg-[#888]" />

          {/* Instagram */}
          <a
            href={socialLinks[0].url}
            target="_blank"
            rel="noopener noreferrer"
            className="ico w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white hover:text-[#e10600] transition-colors flex items-center justify-center"
            aria-label="VYOMIK on Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href={socialLinks[1].url}
            target="_blank"
            rel="noopener noreferrer"
            className="ico w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white hover:text-[#e10600] transition-colors flex items-center justify-center"
            aria-label="YouTube"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M23 7.5a3 3 0 00-2.1-2.1C19 5 12 5 12 5s-7 0-8.9.4A3 3 0 001 7.5 31 31 0 00.6 12 31 31 0 001 16.5a3 3 0 002.1 2.1C5 19 12 19 12 19s7 0 8.9-.4a3 3 0 002.1-2.1c.4-1.5.4-4.5.4-4.5s0-3-.4-4.5zM10 15V9l5 3z" />
            </svg>
          </a>

          {/* Discord */}
          <a
            href={socialLinks[2].url}
            target="_blank"
            rel="noopener noreferrer"
            className="ico w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white hover:text-[#e10600] transition-colors flex items-center justify-center"
            aria-label="Discord"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M20 5a17 17 0 00-4.2-1.3l-.5 1a15 15 0 00-4.6 0l-.5-1A17 17 0 004 5C1.3 9 .6 13 .9 16.9a17 17 0 005.2 2.6l1.1-1.8a11 11 0 01-1.7-.8l.4-.3a12 12 0 0010.2 0l.4.3c-.5.3-1.1.6-1.7.8l1.1 1.8a17 17 0 005.2-2.6C23.500 12 22 8 20 5zM8.700 14.800c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2zm6.600 0c-1 0-1.800-.9-1.800-2s.8-2 1.800-2 1.800.9 1.800 2-.8 2-1.800 2z" />
            </svg>
          </a>

          {/* X */}
          <a
            href={socialLinks[3].url}
            target="_blank"
            rel="noopener noreferrer"
            className="ico w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white hover:text-[#e10600] transition-colors flex items-center justify-center"
            aria-label="X"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M18.200 2h3.300l-7.200 8.300L23 22h-6.700l-5.200-6.800L5.100 22H1.800l7.700-8.800L1.400 2h6.800l4.700 6.200zm-1.200 18h1.800L7.100 3.900H5.200z" />
            </svg>
          </a>

          {/* Hidden contact email link for compliance */}
          <a href={mailtoUrl} aria-label="Email VYOMIK" className="sr-only">
            {contactEmail}
          </a>
        </div>
      </footer>
    </div>
  );
};
