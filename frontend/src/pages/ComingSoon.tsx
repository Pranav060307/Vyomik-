import React from 'react';
import { ComingSoonHeader } from '../components/coming-soon/ComingSoonHeader';
import { ComingSoonContent } from '../components/coming-soon/ComingSoonContent';
import { HeroVisualComposition } from '../components/coming-soon/scene/HeroVisualComposition';
import { ScrollIndicator } from '../components/coming-soon/ScrollIndicator';
import {
  instagramUrl,
  youtubeUrl,
  discordUrl,
  twitterUrl,
  contactEmail,
  mailtoUrl,
} from '../config/brand';

export const ComingSoon: React.FC = () => {
  return (
    <div className="w-full bg-[#0B0B0B] text-white flex flex-col relative select-none overflow-x-hidden">
      {/* =========================================================================
          SECTION 1: HERO VIEWPORT (Full Screen Initial Landing matching design spec)
          ========================================================================= */}
      <section className="w-full min-h-screen h-screen flex flex-col justify-between relative overflow-hidden">
        {/* 0. Full-Screen Cinematic Volcanic Rock Environment Background Plate */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <img
            src="/assets/vyomik-rock-bg.jpg"
            alt="VYOMIK Dark Volcanic Rock Environment"
            className="w-full h-full object-cover object-[center_35%] lg:object-[center_28%]"
          />
          {/* Soft subtle gradient on left side to guarantee typography contrast while keeping volcanic rock clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent pointer-events-none" />
        </div>

        {/* 1. Header with Official Logo Image Asset */}
        <ComingSoonHeader />

        {/* 2. Main Hero Section (Split Layout on Desktop) */}
        <main className="w-full flex-1 min-h-0 flex flex-col lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-14 xl:px-18 py-1 sm:py-2 relative z-10">
          {/* Left Column: Brand Content, Headings, Form, Pillars, Countdown */}
          <div className="w-full lg:w-[48%] xl:w-[46%] flex flex-col justify-center z-20 shrink-0">
            <ComingSoonContent />
          </div>

          {/* Right Column: Layered Visual Composition (Glowing V Emblem, Burnt Orange Ribbon, Warm-Ivory Hoodie) */}
          <div
            className="w-full lg:w-[52%] xl:w-[54%] h-full max-h-[calc(100vh-130px)] relative z-10 flex items-center justify-center pointer-events-auto lg:-translate-x-6 xl:-translate-x-8"
            role="img"
            aria-label="VYOMIK oversized warm-ivory hoodie showcase with glowing V emblem and flowing silk ribbon"
          >
            <HeroVisualComposition />
          </div>
        </main>

        {/* 3. Bottom Exploration Indicator */}
        <footer className="w-full flex flex-col items-center justify-center pt-0 pb-1.5 z-20 shrink-0">
          <ScrollIndicator />
        </footer>
      </section>

      {/* =========================================================================
          SECTION 2: SECONDARY BRAND INTRODUCTION & MINIMAL FOOTER
          ========================================================================= */}
      <section
        id="brand-intro"
        className="w-full bg-[#0B0B0B] border-t border-[#242321] text-[#F4F0E8] py-16 px-6 sm:px-10 lg:px-14 relative z-20"
      >
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Brand Statement Eyebrow */}
          <div className="mb-3">
            <span className="text-xs sm:text-[13px] font-semibold tracking-[0.28em] text-[#A64B2A] uppercase font-montserrat">
              ARCHITECTURAL ESSENTIALS
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase font-montserrat tracking-tight max-w-3xl mb-5 leading-tight text-[#F4F0E8]">
            Built for everyday style, structural comfort, and uncompromising self-expression.
          </h2>

          <p className="text-sm sm:text-base text-[#D9D1C3] max-w-2xl font-montserrat leading-relaxed mb-12">
            VYOMIK engineers heavyweight garments with boxy, relaxed architectural silhouettes.
            Our inaugural collection drops exclusively in strictly limited quantities.
          </p>

          {/* 3 Brand Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16 text-left">
            <div className="p-6 rounded-2xl bg-[#141210]/90 border border-[#242321] hover:border-[#A64B2A]/40 transition-colors">
              <span className="text-xs font-bold text-[#A64B2A] tracking-wider uppercase mb-2 block font-montserrat">
                01 / TEXTILE
              </span>
              <h3 className="text-lg font-bold text-[#F4F0E8] mb-2 font-montserrat">
                450 GSM Heavyweight Fleece
              </h3>
              <p className="text-xs sm:text-sm text-[#716B63] font-montserrat leading-relaxed">
                Custom-milled, ultra-heavy combed cotton fleece designed to retain its architectural structure wear after wear.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141210]/90 border border-[#242321] hover:border-[#A64B2A]/40 transition-colors">
              <span className="text-xs font-bold text-[#A64B2A] tracking-wider uppercase mb-2 block font-montserrat">
                02 / SILHOUETTE
              </span>
              <h3 className="text-lg font-bold text-[#F4F0E8] mb-2 font-montserrat">
                Boxy Engineered Fit
              </h3>
              <p className="text-xs sm:text-sm text-[#716B63] font-montserrat leading-relaxed">
                Extended shoulders, double-layered structured hood, and relaxed kangaroo geometry for contemporary drape.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#141210]/90 border border-[#242321] hover:border-[#A64B2A]/40 transition-colors">
              <span className="text-xs font-bold text-[#A64B2A] tracking-wider uppercase mb-2 block font-montserrat">
                03 / CRAFTSMANSHIP
              </span>
              <h3 className="text-lg font-bold text-[#F4F0E8] mb-2 font-montserrat">
                Minimalist Finishing
              </h3>
              <p className="text-xs sm:text-sm text-[#716B63] font-montserrat leading-relaxed">
                Discrete chest emblem, dense ribbed cuffs, reinforced flatlock stitching, and custom woven sleeve tags.
              </p>
            </div>
          </div>

          {/* Minimal Lower Footer Section */}
          <div className="w-full pt-8 border-t border-[#242321] flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#716B63] font-montserrat">
            {/* VYOMIK Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo.png"
                alt="VYOMIK"
                className="h-6 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>

            {/* Social & Contact Links */}
            <div className="flex items-center gap-6">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F4F0E8] transition-colors"
                aria-label="VYOMIK on Instagram"
              >
                Instagram (@simplyvyomik)
              </a>
              <a
                href={mailtoUrl}
                className="hover:text-[#F4F0E8] transition-colors"
                aria-label="Email VYOMIK"
              >
                {contactEmail}
              </a>
            </div>

            {/* Copyright & Smooth Back-to-Top Interaction */}
            <div className="flex items-center gap-6">
              <span>&copy; {new Date().getFullYear()} VYOMIK. All rights reserved.</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-[#D9D1C3] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                aria-label="Back to top"
              >
                <span>&uarr;</span>
                <span>Top</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accessible Compliance and Social Anchors for SEO */}
      <div className="sr-only">
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">YouTube</a>
        <a href={discordUrl} target="_blank" rel="noopener noreferrer">Discord</a>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer">X</a>
      </div>
    </div>
  );
};
