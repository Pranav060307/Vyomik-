import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onShopClick?: () => void;
  onStoryClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick, onStoryClick }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 3;

  const heroSlides = [
    {
      id: 1,
      image: '/images/vyomik/hero/hero-slide-01.webp',
      alt: 'Core Streetwear Campaign - Model seated in contemporary brutalist architecture wearing oversized warm ivory hoodie',
    },
    {
      id: 2,
      image: '/images/vyomik/hero/hero-slide-02.webp',
      alt: 'Urban Streetwear Campaign - Model in oversized black t-shirt and dark cargo trousers with industrial concrete architecture',
    },
    {
      id: 3,
      image: '/images/vyomik/hero/hero-slide-03.webp',
      alt: 'Minimal Essentials Campaign - Model in sand beige streetwear outfit within minimalist architectural pavilion',
    },
  ];

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 1 ? totalSlides : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides ? 1 : prev + 1));
  };

  const handleShop = () => {
    if (onShopClick) {
      onShopClick();
    } else {
      navigate('/collections');
    }
  };

  const handleStory = () => {
    if (onStoryClick) {
      onStoryClick();
    } else {
      navigate('/our-story');
    }
  };

  return (
    <section
      aria-label="Hero Showcase"
      className="w-full relative min-h-[calc(100vh-8rem)] pt-8 sm:pt-12 pb-14 lg:pb-20 flex items-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-start text-left z-10">
            {/* Category Breadcrumb / Eyebrow */}
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-montserrat font-semibold uppercase tracking-[0.25em] text-[#716B63] mb-4 sm:mb-6">
              <span>STREETWEAR</span>
              <span className="text-[#A64B2A]">/</span>
              <span>ESSENTIALS</span>
              <span className="text-[#A64B2A]">/</span>
              <span>EVERYDAY WEAR</span>
            </div>

            {/* Giant Editorial Headline */}
            <div className="relative mb-5 sm:mb-6">
              <h1 className="font-syne font-extrabold text-3xl sm:text-5xl md:text-6xl xl:text-[68px] leading-[0.98] tracking-tight uppercase text-[#F4F0E8] select-none break-words">
                WEAR<br />
                YOUR<br />
                <span className="relative inline-block text-white">
                  PERSPECTIVE
                  {/* Burnt-Rust Dynamic Brush Stroke Underline */}
                  <svg
                    className="absolute -bottom-2 sm:-bottom-3 left-0 w-full h-2.5 sm:h-4 text-[#A64B2A] fill-current pointer-events-none"
                    viewBox="0 0 320 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2.5 12.5C45.2 6.8 128.5 3.2 195.4 5.9C245.8 7.9 298.5 12.1 317.5 15.5C319.2 15.8 316.5 17.2 312 17.5C255.4 20.8 172.8 17.5 110.5 16.2C65.2 15.2 18.5 16.8 4 18.5"
                      stroke="#A64B2A"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </h1>
            </div>

            {/* Brand Manifesto Paragraph with Rust Border Accent */}
            <div className="flex items-stretch mb-8 sm:mb-10 max-w-md">
              <div className="w-[3px] bg-[#A64B2A] rounded-full mr-4 shrink-0" />
              <p className="font-montserrat text-xs sm:text-sm md:text-base text-[#D9D1C3] leading-relaxed font-normal">
                Modern streetwear for a generation that thinks different.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-5 w-full sm:w-auto">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={handleShop}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#A64B2A] hover:bg-[#8e3f22] text-[#F4F0E8] font-montserrat font-semibold text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 transform hover:scale-[1.02] shadow-[0_8px_20px_rgba(166,75,42,0.35)] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Shop Collection</span>
                <span className="transition-transform group-hover:translate-x-1 duration-200">&rarr;</span>
              </button>

              {/* Secondary CTA: Our Story */}
              <button
                type="button"
                onClick={handleStory}
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#141210]/80 hover:bg-[#242321] border border-[#242321] hover:border-[#716B63] text-[#F4F0E8] font-montserrat font-medium text-xs sm:text-sm tracking-wide transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full bg-[#242321] flex items-center justify-center text-[10px] text-[#F4F0E8]">
                  ▶
                </span>
                <span>Our Story</span>
              </button>
            </div>

            {/* Slide Pagination & Navigation Controls */}
            <div className="mt-10 sm:mt-12 flex items-center gap-4">
              <span
                aria-label={`Slide 0${currentSlide} of 0${totalSlides}`}
                className="font-montserrat font-semibold text-xs text-[#716B63] tracking-widest"
              >
                0{currentSlide} <span className="text-[#A64B2A]">/</span> 0{totalSlides}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  aria-label="Previous Hero Slide"
                  className="w-8 h-8 rounded-lg bg-[#141210] border border-[#242321] hover:border-[#A64B2A] text-[#D9D1C3] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  aria-label="Next Hero Slide"
                  className="w-8 h-8 rounded-lg bg-[#141210] border border-[#242321] hover:border-[#A64B2A] text-[#D9D1C3] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: High-Fashion Hero Photograph Carousel */}
          <div className="lg:col-span-6 xl:col-span-7 relative flex justify-center lg:justify-end w-full">
            <div className="relative w-full max-w-[580px] lg:max-w-[640px] rounded-2xl overflow-hidden border border-[#242321] shadow-2xl group aspect-[16/10] sm:aspect-[16/9] bg-[#141210]">
              {/* Image Frame with active slide */}
              <img
                key={heroSlides[currentSlide - 1].id}
                src={heroSlides[currentSlide - 1].image}
                alt={heroSlides[currentSlide - 1].alt}
                className="w-full h-full object-cover object-center transform duration-700 ease-out group-hover:scale-103 animate-fadeIn"
                loading="eager"
              />

              {/* Atmospheric Ambient Glow & Border Highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
