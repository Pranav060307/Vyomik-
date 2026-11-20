import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AboutCta: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-[#0B0B0B] min-h-[380px] sm:min-h-[440px] lg:h-[480px] flex items-center justify-center">
      
      {/* Full-width Cinematic Mountain Landscape Background with Illuminated Ridges */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src="/images/vyomik/about/about-cta-mountains.jpg"
          alt="Cinematic mountain landscape with burnt-orange illuminated ridges"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
        />
        {/* Atmospheric Gradients & Vignetting */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/50 to-[#0B0B0B]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_15%,#0B0B0B_85%)]" />
        
        {/* Warm Ember Center Glow */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] sm:w-[600px] h-[160px] bg-[#C85A2E]/20 blur-[100px] rounded-full pointer-events-none" />
      </div>

      {/* Centered Campaign Conclusion Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        
        {/* Eyebrow: BE PART OF VYOMIK */}
        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.36em] text-[#D9D1C3]/80 uppercase font-montserrat mb-3 select-none">
          BE PART OF VYOMIK
        </span>

        {/* Main Title: JOIN THE MOVEMENT */}
        <h2 className="text-3xl sm:text-4xl lg:text-[50px] font-black italic tracking-tight uppercase text-[#F4F0E8] font-montserrat leading-tight mb-8 select-none">
          JOIN THE MOVEMENT
        </h2>

        {/* Primary CTA Button: Explore Collections → */}
        <button
          type="button"
          onClick={() => navigate('/collections')}
          className="group relative inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#A64B2A] text-[#F4F0E8] text-xs sm:text-[13px] font-semibold tracking-wider uppercase font-montserrat transition-all duration-300 hover:bg-[#B8532F] hover:shadow-[0_0_24px_rgba(166,75,42,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span>Explore Collections</span>
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

      </div>
    </section>
  );
};

