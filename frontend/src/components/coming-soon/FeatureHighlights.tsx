import React from 'react';

interface FeatureItem {
  line1: string;
  line2: string;
  icon: React.ReactNode;
}

export const FeatureHighlights: React.FC = () => {
  const features: FeatureItem[] = [
    {
      line1: 'Premium',
      line2: 'Fabrics',
      icon: (
        <svg className="w-5 h-5 text-[#A64B2A]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      line1: 'Everyday',
      line2: 'Comfort',
      icon: (
        <svg className="w-5 h-5 text-[#A64B2A]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      ),
    },
    {
      line1: 'Minimal',
      line2: 'Aesthetic',
      icon: (
        <svg className="w-5 h-5 text-[#A64B2A]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <polygon points="6 2 18 2 22 8 12 22 2 8 6 2" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 z-20 relative select-none">
      {features.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#1A1612] border border-[#2D2824] flex items-center justify-center shrink-0">
            {item.icon}
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[#F4F0E8] text-[11px] sm:text-xs font-semibold tracking-wide font-montserrat">
              {item.line1}
            </span>
            <span className="text-[#D9D1C3] text-[11px] sm:text-xs font-medium tracking-wide font-montserrat">
              {item.line2}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
