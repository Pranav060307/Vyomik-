import React from 'react';

export const AboutMission: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0B0B0B] py-16 sm:py-24 border-b border-[#242321]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Eyebrow: OUR MISSION */}
        <span className="text-[11px] font-semibold tracking-[0.28em] text-[#A8A29E] uppercase mb-4 font-montserrat block">
          OUR MISSION
        </span>

        {/* Two-Column Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Heading: CLOTHING WITH PURPOSE */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl sm:text-5xl lg:text-[52px] font-black italic tracking-tight uppercase text-[#F4F0E8] font-montserrat leading-[1.02] select-none">
              <span className="block">CLOTHING</span>
              <span className="relative inline-block mt-1">
                WITH PURPOSE
                {/* Hand-drawn organic burnt-orange brush stroke SVG underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-[105%] h-3.5 text-[#A64B2A] overflow-visible pointer-events-none"
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
          </div>

          {/* Right Description with Vertical Orange Accent */}
          <div className="lg:col-span-6 flex items-start gap-4 lg:pl-6">
            {/* Vertical Accent Bar */}
            <div className="w-[2.5px] h-14 bg-[#A64B2A] rounded-full flex-shrink-0 mt-0.5 shadow-[0_0_8px_rgba(166,75,42,0.6)]" />
            
            {/* Statement Text */}
            <p className="text-xs sm:text-[14px] lg:text-[15px] text-[#D9D1C3]/85 font-light leading-relaxed max-w-xl">
              To design modern streetwear that blends style, comfort, and meaning — empowering a generation to be original, confident, and limitless.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

