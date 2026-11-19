import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HoodieItem {
  id: string;
  name: string;
  colorName: string;
  price: string;
  image: string;
  alt: string;
}

export const FeaturedCollectionShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Center item is index 2
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hoodies: HoodieItem[] = [
    {
      id: 'hoodie-black-back',
      name: 'Signature V Heavyweight Hoodie',
      colorName: 'Midnight Black',
      price: '₹2,999',
      image: '/assets/home/hoodie-black-back.png',
      alt: 'VYOMIK Midnight Black Oversized Hoodie with Back V Graphic',
    },
    {
      id: 'hoodie-rust',
      name: 'Core Terracotta Boxy Hoodie',
      colorName: 'Burnt Rust',
      price: '₹2,999',
      image: '/assets/home/hoodie-rust.png',
      alt: 'VYOMIK Burnt Rust Terracotta Streetwear Hoodie',
    },
    {
      id: 'hoodie-ivory-hero',
      name: 'Original Signature Oversized Hoodie',
      colorName: 'Warm Ivory',
      price: '₹2,999',
      image: '/assets/vyomik-original-hoodie.png',
      alt: 'VYOMIK Warm Ivory Signature Oversized Hoodie',
    },
    {
      id: 'hoodie-charcoal-art',
      name: 'Terrain Line-Art Oversized Hoodie',
      colorName: 'Charcoal Wash',
      price: '₹2,999',
      image: '/assets/home/hoodie-charcoal-art.png',
      alt: 'VYOMIK Charcoal Hoodie with Mountain Geometric Art',
    },
    {
      id: 'hoodie-ivory-back',
      name: 'Emblem Graphic Oversized Hoodie',
      colorName: 'Warm Ivory / Black Print',
      price: '₹2,999',
      image: '/assets/home/hoodie-ivory-back.png',
      alt: 'VYOMIK Warm Ivory Hoodie with Rear Emblem Print',
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? hoodies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === hoodies.length - 1 ? 0 : prev + 1));
  };

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
  };

  const handleProductClick = (id: string) => {
    navigate(`/collections?item=${id}`);
  };

  return (
    <section
      aria-label="Core Elements Featured Drop"
      className="w-full py-20 sm:py-24 lg:py-28 bg-[#0B0B0B] text-[#F4F0E8] relative overflow-hidden select-none"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-full max-w-[800px] h-[350px] sm:h-[500px] bg-[#A64B2A]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 flex flex-col items-center text-center">
        {/* Eyebrow */}
        <span className="font-montserrat font-semibold text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#716B63] mb-3">
          NEW LAUNCHES
        </span>

        {/* Section Title */}
        <h2 className="font-syne font-extrabold text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-[#F4F0E8]">
          CORE <span className="text-[#A64B2A] italic">ELEMENTS</span>
        </h2>

        {/* Subtitle */}
        <p className="font-montserrat text-xs sm:text-sm text-[#716B63] mt-3 mb-12 sm:mb-16 max-w-md">
          Our latest drop &mdash; minimal, bold, and built for everyday movement.
        </p>

        {/* 3D Arc Perspective Showcase Container */}
        <div className="relative w-full max-w-5xl h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center">
          {/* Navigation Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous hoodie style"
            className="absolute left-2 sm:left-6 lg:left-10 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#141210]/80 backdrop-blur-md border border-[#242321] hover:border-[#A64B2A] text-[#D9D1C3] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next hoodie style"
            className="absolute right-2 sm:right-6 lg:right-10 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#141210]/80 backdrop-blur-md border border-[#242321] hover:border-[#A64B2A] text-[#D9D1C3] hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 5 Flanking Hoodies in Arc */}
          <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
            {hoodies.map((hoodie, idx) => {
              // Offset relative to activeIndex (-2, -1, 0, +1, +2)
              const offset = idx - activeIndex;
              const isCenter = offset === 0;

              // Calculate horizontal translation, scale, opacity and z-index based on distance
              const step = isMobile ? 70 : 140;
              let translateX = offset * step;
              let scale = isMobile
                ? (isCenter ? 0.9 : 0.65)
                : (1 - Math.abs(offset) * 0.18);
              let opacity = isMobile
                ? (isCenter ? 1 : Math.abs(offset) === 1 ? 0.35 : 0)
                : (1 - Math.abs(offset) * 0.35);
              let zIndex = 20 - Math.abs(offset) * 5;
              let rotateY = offset * -8;

              // Constrain non-visible if offset > 2 or < -2
              if (Math.abs(offset) > 2) {
                opacity = 0;
                translateX = offset * (isMobile ? 120 : 200);
              }

              return (
                <div
                  key={hoodie.id}
                  onClick={() => (isCenter ? handleProductClick(hoodie.id) : handleSelect(idx))}
                  style={{
                    transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity: opacity > 0 ? opacity : 0,
                  }}
                  className={`absolute top-6 sm:top-10 transition-all duration-500 ease-out cursor-pointer flex flex-col items-center ${
                    isCenter ? 'cursor-zoom-in' : 'hover:opacity-90'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={hoodie.name}
                >
                  {/* Subtle Background Glow Framing Plate */}
                  <div className={`relative rounded-2xl p-2 transition-all duration-300 ${
                    isCenter ? 'drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]' : ''
                  }`}>
                    {/* Glowing Accent Border Card in Reference */}
                    <div className={`absolute inset-0 rounded-2xl border transition-colors ${
                      isCenter ? 'border-[#A64B2A]/40 bg-[#141210]/40' : 'border-white/5 bg-[#141210]/20'
                    }`} />

                    <img
                      src={hoodie.image}
                      alt={hoodie.alt}
                      className="relative z-10 w-44 sm:w-56 md:w-64 h-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]"
                      loading="lazy"
                    />
                  </div>

                  {/* Active Hoodie Info Card */}
                  {isCenter && (
                    <div className="mt-4 flex flex-col items-center animate-fadeIn">
                      <span className="font-montserrat font-bold text-sm sm:text-base tracking-wide text-[#F4F0E8]">
                        {hoodie.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-[#D9D1C3] font-montserrat">{hoodie.colorName}</span>
                        <span className="text-[#A64B2A]">&bull;</span>
                        <span className="text-xs font-semibold text-[#A64B2A] font-montserrat">{hoodie.price}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Glowing Elliptical Pedestal Light Ring */}
          <div className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 w-[280px] sm:w-[460px] md:w-[540px] h-[45px] sm:h-[75px] rounded-[100%] border-[2px] border-[#F5B964]/80 shadow-[0_0_40px_rgba(245,185,100,0.65),inset_0_0_20px_rgba(245,185,100,0.4)] pointer-events-none transform -rotate-x-60" />
        </div>

        {/* Carousel Indicators */}
        <div className="mt-8 flex items-center justify-center gap-2.5">
          {hoodies.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSelect(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? 'w-7 bg-[#A64B2A]'
                  : 'w-2 bg-[#242321] hover:bg-[#716B63]'
              }`}
            />
          ))}
        </div>

        {/* Drag / Interaction Hint */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] font-montserrat text-[#716B63] uppercase tracking-wider">
          <svg className="w-3.5 h-3.5 text-[#A64B2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
          <span>Drag or click to rotate</span>
        </div>
      </div>
    </section>
  );
};
