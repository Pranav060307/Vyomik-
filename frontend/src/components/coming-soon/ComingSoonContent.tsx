import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { NotifyForm } from './NotifyForm';
import { FeatureHighlights } from './FeatureHighlights';
import { ComingSoonCountdown } from './ComingSoonCountdown';

export const ComingSoonContent: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const brushPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion safely
    const prefersReducedMotion =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Animate category tag
      tl.from('.cs-category', {
        opacity: 0,
        y: -15,
        duration: 0.7,
      });

      // Animate COMING and SOON display title
      tl.from(
        '.cs-title-word',
        {
          opacity: 0,
          y: 40,
          stagger: 0.15,
          duration: 0.85,
        },
        '-=0.4'
      );

      // Animate brush stroke path draw
      if (brushPathRef.current) {
        const length = brushPathRef.current.getTotalLength?.() || 280;
        gsap.set(brushPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        tl.to(
          brushPathRef.current,
          {
            strokeDashoffset: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          },
          '-=0.3'
        );
      }

      // Animate subtitle
      tl.from(
        '.cs-subtitle',
        {
          opacity: 0,
          y: 20,
          duration: 0.7,
        },
        '-=0.5'
      );

      // Animate form
      tl.from(
        '.cs-form',
        {
          opacity: 0,
          y: 20,
          duration: 0.7,
        },
        '-=0.4'
      );

      // Animate feature highlights
      tl.from(
        '.cs-features',
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
        },
        '-=0.4'
      );

      // Animate countdown section
      tl.from(
        '.cs-countdown',
        {
          opacity: 0,
          y: 25,
          duration: 0.7,
        },
        '-=0.3'
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={contentRef}
      className="w-full flex flex-col items-start text-left z-20 relative select-none"
    >
      {/* Category Eyebrow Tag */}
      <div className="cs-category flex items-center gap-2 text-xs sm:text-[13px] tracking-[0.28em] font-medium text-[#716B63] uppercase font-montserrat mb-2 lg:mb-2.5">
        <span>STREETWEAR</span>
        <span className="text-[#A64B2A] font-bold">/</span>
        <span>ESSENTIALS</span>
        <span className="text-[#A64B2A] font-bold">/</span>
        <span>EVERYDAY WEAR</span>
      </div>

      {/* Main Heading & Burnt Rust Brush Underline */}
      <div className="relative mb-2.5 sm:mb-3 lg:mb-3.5">
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[74px] xl:text-[84px] font-black tracking-tight leading-[0.88] text-[#F4F0E8] uppercase font-anton"
          role="heading"
          aria-label="COMING SOON."
        >
          <span className="cs-title-word block">COMING</span>
          <span className="cs-title-word block">SOON</span>
        </h1>

        {/* Dynamic Burnt Rust Brush Underline SVG */}
        <div className="w-[150px] sm:w-[190px] md:w-[220px] h-3.5 sm:h-4.5 mt-1">
          <svg viewBox="0 0 280 24" fill="none" className="w-full h-full overflow-visible">
            <path
              ref={brushPathRef}
              d="M3 14 C 45 6, 120 4, 180 10 C 220 14, 255 12, 276 5 C 255 16, 210 20, 160 17 C 95 13, 35 18, 5 19 Z"
              fill="#A64B2A"
              stroke="#A64B2A"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {/* Brand Subtitle Description */}
      <p className="cs-subtitle text-[#D9D1C3] text-xs sm:text-sm md:text-[15px] leading-snug max-w-[420px] sm:max-w-[450px] font-montserrat font-normal mb-3 sm:mb-4 lg:mb-4.5 border-l-2 border-[#A64B2A] pl-3">
        A modern clothing label built for everyday style, comfort, and self-expression.
      </p>

      {/* Waitlist Subscription Form */}
      <div className="cs-form w-full mb-3 sm:mb-4 lg:mb-4.5">
        <NotifyForm />
      </div>

      {/* Brand Pillars / Feature Highlights */}
      <div className="cs-features w-full mb-3.5 sm:mb-4 lg:mb-5">
        <FeatureHighlights />
      </div>

      {/* Authoritative Server Countdown */}
      <div className="cs-countdown w-full">
        <ComingSoonCountdown />
      </div>
    </div>
  );
};
