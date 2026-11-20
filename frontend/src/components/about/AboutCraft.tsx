import React from 'react';

export const AboutCraft: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0B0B0B] py-16 sm:py-20 border-b border-[#242321]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Macro Luxury Fashion Product Photograph */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#3A3530]/60 bg-[#141210]/40 shadow-2xl aspect-[16/9] w-full group">
              <img
                src="/images/vyomik/about/about-fabric-macro.jpg"
                alt="Tactile warm-ivory fabric weave with official VYOMIK emblem printed across the fold"
                className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
              />
              {/* Subtle luxury edge lighting overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0B0B0B]/35 via-transparent to-[#0B0B0B]/20 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: The Craft Editorial Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Eyebrow */}
            <span className="text-[11px] font-semibold tracking-[0.28em] text-[#A8A29E] uppercase mb-2 font-montserrat block">
              THE CRAFT
            </span>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-black italic tracking-tight uppercase text-[#F4F0E8] font-montserrat leading-[1.04] mb-4 select-none">
              <span className="block">DETAILS</span>
              <span className="relative inline-block mt-0.5">
                THAT MATTER
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
            </h2>

            {/* Description */}
            <p className="mt-4 text-xs sm:text-[14px] text-[#D9D1C3]/80 font-light leading-relaxed max-w-md">
              From fabric to fit, every detail is thoughtfully crafted to deliver a premium and timeless experience.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

