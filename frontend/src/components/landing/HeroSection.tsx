import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { DEMO_IMAGES } from '../../config/demoContent';

interface HeroSectionProps {
  onOpenNotifyModal: (source: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenNotifyModal }) => {
  // State for colour chip toggle (Ivory vs Black model image)
  const [activeColor, setActiveColor] = useState<'ivory' | 'black'>('ivory');

  const activeImage = activeColor === 'ivory' ? DEMO_IMAGES.hero.ivory : DEMO_IMAGES.hero.black;

  return (
    <section className="relative w-full border-b border-[#DAD7CE] overflow-hidden bg-[#F4F3EE]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[660px] border-x border-[#DAD7CE]">
          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-10 lg:px-12 py-16 md:py-24 border-b lg:border-b-0 lg:border-r border-[#DAD7CE]">
            {/* Eyebrow Label */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
                OVERSIZED ESSENTIALS
              </span>
              <span className="h-px w-6 bg-[#DAD7CE]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#202020]/60">
                FIRST DROP
              </span>
            </div>

            {/* Hero Headline: Large, semi-bold, tight leading with text-balance */}
            <h1 className="text-4xl sm:text-6xl lg:text-[72px] font-semibold text-[#202020] leading-[1.04] tracking-[-0.03em] max-w-xl text-balance">
              Room to be you.
            </h1>

            {/* Subcopy with comfortable reading length */}
            <p className="mt-6 text-base sm:text-lg text-[#202020]/80 font-normal leading-relaxed max-w-[65ch]">
              Easy silhouettes. Quiet confidence. Your next everyday favourite.
            </p>

            {/* CTA Button: Sharp rectangular (rounded-none) in charcoal with arrow icon */}
            <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                type="button"
                onClick={() => onOpenNotifyModal('hero_cta')}
                className="group inline-flex items-center justify-between space-x-4 bg-[#202020] text-[#F4F3EE] px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#333333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] focus-visible:ring-offset-2 transition-all active:scale-[0.99] shadow-sm rounded-none"
              >
                <span>Notify me at launch</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <span className="text-[11px] uppercase tracking-wider text-[#5C6548] font-medium">
                Launch date: 8 Nov 2026
              </span>
            </div>

            {/* Editorial Metadata Badges */}
            <div className="mt-14 pt-8 border-t border-[#DAD7CE]/70 grid grid-cols-3 gap-4 text-left max-w-md">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5C6548] font-semibold">GSM</p>
                <p className="text-sm font-medium text-[#202020] mt-0.5">240 — 450</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5C6548] font-semibold">Cut</p>
                <p className="text-sm font-medium text-[#202020] mt-0.5">Boxy Oversized</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5C6548] font-semibold">Fulfillment</p>
                <p className="text-sm font-medium text-[#202020] mt-0.5">Custom POD</p>
              </div>
            </div>
          </div>

          {/* Right Column: Demo Model Image + Interactive Colour Chips */}
          <div className="lg:col-span-5 relative flex items-center justify-center bg-[#EAE8E1] p-4 sm:p-6 lg:p-8 min-h-[440px] lg:min-h-full">
            {/* Main Visual Display */}
            <div className="relative w-full aspect-[4/5] max-h-[640px] flex items-center justify-center overflow-hidden border border-[#DAD7CE] shadow-sm">
              <img
                src={activeImage}
                alt={`VYOMIK model silhouette in ${activeColor}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                key={activeColor}
              />

              {/* Bottom-Right Colour Chips for swapping image */}
              <div className="absolute bottom-4 right-4 bg-[#F4F3EE]/95 backdrop-blur-md p-2 border border-[#DAD7CE] shadow-md flex items-center space-x-3">
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#202020] pl-1">
                  Color:
                </span>

                {/* Ivory Chip */}
                <button
                  type="button"
                  onClick={() => setActiveColor('ivory')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium border transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#202020] ${
                    activeColor === 'ivory'
                      ? 'border-[#202020] bg-white text-[#202020] shadow-sm'
                      : 'border-transparent text-[#202020]/60 hover:text-[#202020]'
                  }`}
                  aria-label="View Ivory model photo"
                >
                  <span className="w-3 h-3 bg-[#FCFBF9] border border-[#DAD7CE] inline-block" />
                  <span>Ivory</span>
                </button>

                {/* Black Chip */}
                <button
                  type="button"
                  onClick={() => setActiveColor('black')}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 text-[11px] font-medium border transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#202020] ${
                    activeColor === 'black'
                      ? 'border-[#202020] bg-white text-[#202020] shadow-sm'
                      : 'border-transparent text-[#202020]/60 hover:text-[#202020]'
                  }`}
                  aria-label="View Pitch Black model photo"
                >
                  <span className="w-3 h-3 bg-[#202020] border border-[#111111] inline-block" />
                  <span>Black</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

