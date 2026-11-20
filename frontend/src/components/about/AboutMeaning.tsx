import React from 'react';

export const AboutMeaning: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0B0B0B] py-14 sm:py-20 border-b border-[#242321]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Framed Mountain Landscape with Technical Framing Marks & Coordinates */}
          <div className="lg:col-span-7 relative">
            <div className="relative rounded-lg p-2.5 sm:p-3 border border-[#3A3530]/60 bg-[#141210]/30 shadow-2xl backdrop-blur-sm group">
              
              {/* Corner Framing Marks (Viewfinder / Technical Aesthetic) */}
              <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#D9D1C3]/70 pointer-events-none" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#D9D1C3]/70 pointer-events-none" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#D9D1C3]/70 pointer-events-none" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#D9D1C3]/70 pointer-events-none" />

              {/* Coordinate Overlay in Upper Left */}
              <div className="absolute top-5 left-5 z-20 pointer-events-none">
                <div className="font-mono text-[10px] sm:text-[11px] font-medium tracking-widest text-[#F4F0E8]/90 leading-tight bg-[#0B0B0B]/60 backdrop-blur-md px-2.5 py-1.5 rounded border border-white/10 shadow-lg">
                  <div>19.8974° N</div>
                  <div>74.4828° E</div>
                </div>
              </div>

              {/* Main Mountain Photograph */}
              <div className="relative overflow-hidden rounded aspect-[16/9] w-full">
                <img
                  src="/images/vyomik/about/about-mountain-peaks.jpg"
                  alt="Dramatic mountain peaks with burnt-orange sunlight illuminating sharp ridges"
                  className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle environmental vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/40 via-transparent to-[#0B0B0B]/20 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Right Column: Brand Meaning Editorial Content */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black italic tracking-tight uppercase text-[#F4F0E8] font-montserrat leading-[1.08] mb-4 select-none">
              <span className="block">THE MEANING</span>
              <span className="relative inline-block mt-0.5">
                BEHIND <span className="text-[#A64B2A] drop-shadow-[0_0_12px_rgba(166,75,42,0.4)]">VYOMIK</span>
                {/* Hand-drawn underline accent */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#A64B2A] overflow-visible pointer-events-none"
                  viewBox="0 0 180 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C35 4 95 3 178 7.5"
                    stroke="#E56A38"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Body Copy */}
            <div className="mt-4 space-y-4 text-xs sm:text-[14px] text-[#D9D1C3]/80 font-light leading-relaxed max-w-lg">
              <p>
                VYOMIK is derived from <span className="text-[#F4F0E8] font-medium">&ldquo;Vyom&rdquo;</span> — the infinite sky, representing freedom, exploration, and a mind without limits.
              </p>
              <p>
                It reflects our belief in going beyond the ordinary and creating a style that moves with you, everywhere.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

