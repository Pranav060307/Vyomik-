import React from 'react';

interface ValueItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export const AboutValues: React.FC = () => {
  const values: ValueItem[] = [
    {
      id: 'quality',
      title: 'Quality First',
      subtitle: 'Premium fabrics, lasting comfort.',
      icon: (
        // Layered material icon (3 stacked angled layers)
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2 12.5" />
          <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2 17.5" />
        </svg>
      ),
    },
    {
      id: 'conscious',
      title: 'Conscious Creation',
      subtitle: 'Thoughtful, responsible fashion.',
      icon: (
        // Leaf icon
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
    },
    {
      id: 'versatility',
      title: 'Everyday Versatility',
      subtitle: 'Fits for campus, streets, and beyond.',
      icon: (
        // Infinity symbol icon
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
        </svg>
      ),
    },
    {
      id: 'expression',
      title: 'Bold Expression',
      subtitle: 'Wear what moves you.',
      icon: (
        // Mountain outline icon
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative w-full bg-[#0B0B0B] py-14 sm:py-16 border-b border-[#242321]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Centered Spaced Section Eyebrow Title: O U R   V A L U E S */}
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs sm:text-[13px] font-semibold tracking-[0.45em] text-[#A8A29E] uppercase font-montserrat select-none">
            O U R &nbsp; V A L U E S
          </span>
        </div>

        {/* 4 Equal-Width Columns with Thin Vertical Separators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#242321]/60">
          {values.map((val) => (
            <div
              key={val.id}
              className="flex flex-col items-center text-center px-4 py-6 sm:py-4 group transition-colors cursor-default"
            >
              {/* Elegant Ivory Line Icon with Subtle Orange Hover Glow */}
              <div className="text-[#F4F0E8] transition-all duration-300 group-hover:text-[#E56A38] group-hover:scale-110 mb-3.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {val.icon}
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-[15px] font-bold uppercase tracking-wider text-[#F4F0E8] font-montserrat mb-1.5 transition-colors group-hover:text-white">
                {val.title}
              </h3>

              {/* Subtitle / Description */}
              <p className="text-xs text-[#716B63] font-light leading-relaxed max-w-[200px] transition-colors group-hover:text-[#D9D1C3]">
                {val.subtitle}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

