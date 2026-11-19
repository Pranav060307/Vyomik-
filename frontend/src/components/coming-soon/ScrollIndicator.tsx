import React from 'react';

export const ScrollIndicator: React.FC = () => {
  const handleClick = () => {
    const target = document.getElementById('brand-intro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-1.5 cursor-pointer z-20 group transition-opacity hover:opacity-100 opacity-80 select-none pb-1"
      role="button"
      tabIndex={0}
      aria-label="Scroll to explore"
    >
      {/* Animated Mouse Capsule Outline */}
      <div className="w-4 h-6.5 rounded-full border-[1.5px] border-[#716B63] group-hover:border-[#D9D1C3] flex items-start justify-center p-0.5 transition-colors">
        <div className="w-1 h-1.5 rounded-full bg-[#A64B2A] animate-bounce mt-0.5" />
      </div>

      {/* Label and Down Chevron */}
      <span className="text-[9px] sm:text-[10px] font-medium text-[#716B63] group-hover:text-[#D9D1C3] tracking-[0.22em] font-montserrat uppercase transition-colors flex items-center gap-1">
        <span>SCROLL TO EXPLORE</span>
        <svg className="w-2.5 h-2.5 text-[#A64B2A]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </div>
  );
};
