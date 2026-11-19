import React from 'react';

export const CollectionsHero: React.FC = () => {
  return (
    <section className="relative w-full bg-[#0B0B0B] overflow-hidden h-auto min-h-[440px] lg:h-[470px] flex items-center border-b border-[#242321]/40">
      {/* 1. Volcanic Rock Terrain Background with Directional Warm Orange Lighting */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] lg:h-[68%] z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/vyomik-rock-bg.jpg"
          alt=""
          className="w-full h-full object-cover object-bottom opacity-50 mix-blend-screen scale-105 select-none"
        />
        {/* Environmental Vignette & Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-[#0B0B0B]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#0B0B0B_88%)]" />
        {/* Warm Orange Horizon Rim Glow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[650px] h-[180px] bg-[#C85A2E]/20 blur-[90px] rounded-full pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 w-full py-4 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-2 items-center">
          
          {/* LEFT CONTENT: Editorial Typography */}
          <div className="lg:col-span-5 flex flex-col justify-center z-20">
            {/* Small uppercase eyebrow */}
            <span className="text-[11px] font-semibold tracking-[0.25em] text-[#D9D1C3]/80 uppercase mb-2 font-montserrat">
              COLLECTIONS
            </span>

            {/* Large two-line heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[54px] font-black italic tracking-tight uppercase text-white font-montserrat leading-[1.05] mb-2 select-none">
              <span className="block">EXPLORE</span>
              <span className="relative inline-block mt-0.5">
                OUR DROPS
                {/* Organic Burnt-Orange Hand-Drawn Brush Stroke Underline */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-[104%] h-3.5 text-[#C85A2E] overflow-visible pointer-events-none"
                  viewBox="0 0 240 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 11C42 5 118 4 238 9.5C170 14 82 14.5 2 11Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 12.5C62 6.5 148 6 226 10.5"
                    stroke="#E58348"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                </svg>
              </span>
            </h1>

            {/* Description with thin burnt-orange vertical accent */}
            <div className="flex items-start gap-3 mt-4 max-w-sm sm:max-w-md">
              <div className="w-[2.5px] h-9 bg-[#A64B2A] rounded-full flex-shrink-0 mt-0.5" />
              <p className="text-[#D9D1C3]/80 text-xs sm:text-sm font-light leading-relaxed">
                Curated collections that bring together style, comfort, and purpose.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT: 3D Product Presentation with Floating Apparel & Orbital Ring */}
          <div className="lg:col-span-7 relative h-[320px] sm:h-[380px] lg:h-[440px] flex items-center justify-center">
            
            {/* Rocky Pedestal Base Light Ring */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[260px] sm:w-[380px] lg:w-[440px] h-[45px] sm:h-[65px] rounded-[50%] border-2 border-[#C85A2E]/80 shadow-[0_0_35px_rgba(200,90,46,0.7),inset_0_0_20px_rgba(200,90,46,0.5)] pointer-events-none z-10" />
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 w-[160px] sm:w-[240px] h-[30px] rounded-[50%] bg-[#C85A2E]/30 blur-lg pointer-events-none z-10" />

            {/* 1. LEFT FLOATING DISPLAY: Burnt-Orange T-Shirt on Perspective Glass Plaque */}
            <div
              className="absolute left-2 sm:left-4 lg:left-8 top-[18%] sm:top-[16%] w-[110px] sm:w-[150px] lg:w-[170px] h-[135px] sm:h-[185px] lg:h-[210px] rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-white/15 p-2 sm:p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-15 transition-all duration-500 hover:scale-105"
              style={{
                transform: 'perspective(1000px) rotateY(22deg) rotateX(4deg) rotateZ(-2deg)',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#141210]/40">
                <img
                  src="/images/vyomik/collections/rust-tee.png"
                  alt="Burnt-Orange Tee"
                  className="w-[92%] h-[92%] object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.9)]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* 2. RIGHT UPPER FLOATING DISPLAY: Black Graphic T-Shirt on Perspective Glass Plaque */}
            <div
              className="absolute right-3 sm:right-6 lg:right-10 top-[6%] sm:top-[4%] w-[105px] sm:w-[140px] lg:w-[160px] h-[130px] sm:h-[175px] lg:h-[195px] rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-white/15 p-2 sm:p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-15 transition-all duration-500 hover:scale-105"
              style={{
                transform: 'perspective(1000px) rotateY(-24deg) rotateX(6deg) rotateZ(3deg)',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#141210]/40">
                <img
                  src="/images/vyomik/collections/hero-black-tee.png"
                  alt="Black Mountain Graphic Tee"
                  className="w-[94%] h-[94%] object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.9)]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* 3. RIGHT LOWER FLOATING DISPLAY: Charcoal Cargo Pants on Perspective Glass Plaque */}
            <div
              className="absolute right-0 sm:right-2 lg:right-4 bottom-[8%] sm:bottom-[6%] w-[95px] sm:w-[130px] lg:w-[150px] h-[120px] sm:h-[165px] lg:h-[185px] rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-md border border-white/15 p-2 sm:p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.85)] z-15 transition-all duration-500 hover:scale-105"
              style={{
                transform: 'perspective(1000px) rotateY(-18deg) rotateX(8deg) rotateZ(2deg)',
              }}
            >
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-xl bg-[#141210]/40">
                <img
                  src="/images/vyomik/collections/hero-cargos.png"
                  alt="Tactical Cargo Pants"
                  className="w-[92%] h-[92%] object-contain drop-shadow-[0_12px_22px_rgba(0,0,0,0.9)]"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />
              </div>
            </div>

            {/* 4. CENTRAL FLOATING WARM-IVORY VYOMIK HOODIE */}
            <div className="relative z-20 flex items-center justify-center w-[220px] sm:w-[300px] lg:w-[380px] select-none">
              <div className="relative transition-transform duration-700 ease-out hover:scale-105 animate-[float_4.5s_ease-in-out_infinite]">
                <img
                  src="/assets/ivory-hoodie.png"
                  alt="Core Oversized Warm Ivory Hoodie"
                  className="w-full h-auto object-contain drop-shadow-[0_22px_32px_rgba(0,0,0,0.95)]"
                />
              </div>
            </div>

            {/* 5. 3D GLOWING ORBITAL RING AROUND THE APPAREL DISPLAY */}
            {/* Positioned at the lower waist/hem of the hoodie, looping below it without obscuring logo */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[14%] sm:bottom-[16%] lg:bottom-[18%] w-[330px] sm:w-[480px] lg:w-[560px] h-[90px] sm:h-[120px] lg:h-[140px] pointer-events-none z-25 flex items-center justify-center"
            >
              {/* Outer SVG Elliptical Curved Band with illuminated glowing text along the front lower arc */}
              <svg
                viewBox="0 0 560 140"
                className="w-full h-full overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Glowing elliptical orbital outline */}
                <ellipse
                  cx="280"
                  cy="70"
                  rx="265"
                  ry="58"
                  stroke="#C85A2E"
                  strokeWidth="2.5"
                  className="opacity-85 filter drop-shadow-[0_0_12px_rgba(200,90,46,0.85)]"
                />
                {/* Inner glass rim reflection */}
                <ellipse
                  cx="280"
                  cy="70"
                  rx="263"
                  ry="56"
                  stroke="#F4F0E8"
                  strokeWidth="0.8"
                  className="opacity-30"
                />

                {/* Path defining the FRONT / LOWER arc of the elliptical ring for text placement */}
                <path
                  id="orbital-front-arc"
                  d="M 35 70 A 265 58 0 0 0 525 70"
                  fill="none"
                />

                {/* Drop labels placed precisely along the front/lower arc of the ring */}
                <text
                  fill="#F4F0E8"
                  fontSize="10"
                  fontWeight="700"
                  letterSpacing="0.22em"
                  className="font-montserrat uppercase select-none drop-shadow-[0_0_6px_rgba(200,90,46,0.95)]"
                >
                  <textPath
                    href="#orbital-front-arc"
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    CORE ELEMENTS &nbsp;|&nbsp; URBAN TERRAIN &nbsp;|&nbsp; MONOCHROME EDIT &nbsp;|&nbsp; ESSENTIALS
                  </textPath>
                </text>
              </svg>
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }
      `}</style>
    </section>
  );
};
