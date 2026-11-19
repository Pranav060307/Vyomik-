import React from 'react';

export const BrandBenefitsStrip: React.FC = () => {
  const brandBenefits = [
    {
      title: 'Bold Design',
      subtitle: 'Clean, modern and distinctive.',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Premium Comfort',
      subtitle: 'Breathable, durable and all-day wear.',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: 'Versatile Style',
      subtitle: 'From campus to the streets.',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      title: 'Responsible Fashion',
      subtitle: 'Thoughtful materials, smaller footprint.',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-label="Brand Highlights"
      className="w-full bg-[#141210]/60 border-y border-[#242321] py-8 sm:py-9 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-[#242321]">
          {brandBenefits.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 px-0 lg:px-6 xl:px-8"
            >
              <div className="w-10 h-10 rounded-lg bg-[#242321]/80 border border-[#242321] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[#F4F0E8] font-montserrat text-xs sm:text-[13px] font-semibold tracking-wide uppercase">
                  {item.title}
                </span>
                <span className="text-[#716B63] font-montserrat text-[11px] sm:text-xs mt-0.5">
                  {item.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
