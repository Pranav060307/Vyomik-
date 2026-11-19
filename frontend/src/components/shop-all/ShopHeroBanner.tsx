import React from 'react';

export const ShopHeroBanner: React.FC = () => {
  return (
    <section
      role="banner"
      aria-label="Shop All Hero"
      className="w-full relative bg-[#0B0B0B] border-b border-[#242321] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Subtitle */}
          <div className="md:col-span-6 flex flex-col justify-center text-left">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black italic uppercase tracking-tight text-[#F4F0E8] leading-[1.05] font-montserrat select-none">
              SHOP ALL
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#716B63] max-w-lg font-montserrat leading-relaxed">
              Explore our complete range of premium streetwear.
            </p>
          </div>

          {/* Right Column: Model Photography with Diagonal Burnt-Rust Accent */}
          <div className="md:col-span-6 relative flex justify-end">
            <div className="relative w-full max-w-lg h-[220px] sm:h-[260px] md:h-[280px] rounded-2xl overflow-hidden border border-white/5 bg-[#141414] shadow-2xl group">
              {/* Background Diagonal Burnt-Rust Texture Layer */}
              <div
                className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 20%, #A64B2A 45%, #C85A2E 55%, transparent 75%)',
                }}
              />

              {/* Main Model Image */}
              <img
                src="/images/vyomik/shop/shop-hero-banner.jpg"
                alt="VYOMIK Streetwear Model"
                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />

              {/* Seamless Dark Edge Vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B] via-transparent to-[#0B0B0B]/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
