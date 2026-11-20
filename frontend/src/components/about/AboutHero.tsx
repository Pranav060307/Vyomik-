import React from 'react';

export const AboutHero: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0B0B0B] border-b border-[#242321]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[340px] lg:h-[370px] py-8 lg:py-0">
          
          {/* Left Side: Brand Introduction */}
          <div className="lg:col-span-5 flex flex-col justify-center z-10 pr-0 lg:pr-6">
            {/* Small uppercase eyebrow */}
            <span className="text-[11px] font-semibold tracking-[0.28em] text-[#A8A29E] uppercase mb-2 font-montserrat block">
              ABOUT VYOMIK
            </span>

            {/* Main two-line heading with hand-drawn orange brush underline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black italic tracking-tight uppercase text-[#F4F0E8] font-montserrat leading-[0.98] mb-4 select-none">
              <span className="block">OUR</span>
              <span className="relative inline-block mt-0.5">
                STORY
                {/* Organic Burnt-Orange Hand-Drawn Brush Stroke Underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-[108%] h-4 text-[#A64B2A] overflow-visible pointer-events-none"
                  viewBox="0 0 240 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 11C42 5 118 4 238 9.5C170 14 82 14.5 2 11Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 12C60 6 150 5.5 228 10"
                    stroke="#E56A38"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="opacity-75"
                  />
                </svg>
              </span>
            </h1>

            {/* Description with thin burnt-orange vertical accent */}
            <div className="flex items-start gap-3.5 mt-5 max-w-sm sm:max-w-md">
              <div className="w-[2.5px] h-10 bg-[#A64B2A] rounded-full flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(166,75,42,0.6)]" />
              <p className="text-[#D9D1C3]/85 text-xs sm:text-[13px] font-light leading-relaxed">
                More than clothing — VYOMIK is a perspective. A blend of street culture, purpose, and self-expression.
              </p>
            </div>
          </div>

          {/* Right Side: Cinematic Lifestyle Photograph */}
          <div className="lg:col-span-7 relative h-[280px] sm:h-[330px] lg:h-[370px] w-full overflow-hidden rounded-lg lg:rounded-none">
            <div className="relative w-full h-full overflow-hidden">
              <img
                src="/images/vyomik/about/about-hero-model.jpg"
                alt="Model wearing oversized warm-ivory VYOMIK hoodie in brutalist concrete architecture"
                className="w-full h-full object-cover object-center lg:object-right select-none transition-transform duration-700 hover:scale-105"
              />
              {/* Cinematic Vignette & Edge Feathering for Seamless Integration */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0B0B0B] to-transparent hidden lg:block pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0B0B0B] to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#0B0B0B]/40 to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

