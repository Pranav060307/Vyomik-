import React from 'react';
import { useStoreConfig } from '../../hooks/useStoreConfig';
import { formatPaiseToRupees } from '../../utils/format';

export const TrustBenefitsStrip: React.FC = () => {
  const { data: config } = useStoreConfig();
  const freeShippingThreshold = config?.free_shipping_threshold_paise
    ? formatPaiseToRupees(config.free_shipping_threshold_paise)
    : '₹1,499';

  const benefits = [
    {
      title: 'Free Shipping',
      subtitle: `On orders above ${freeShippingThreshold}`,
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 11-4 0 2 2 0 014 0zM18 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H8m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
        </svg>
      ),
    },
    {
      title: 'Quality Guarantee',
      subtitle: 'Premium fabric & long lasting',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Easy Returns',
      subtitle: '7-day hassle free returns',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Sustainable Choice',
      subtitle: 'Ethically crafted & responsible',
      icon: (
        <svg className="w-5 h-5 text-[#F4F0E8]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-label="Trust and Benefits"
      className="w-full bg-[#141210] border-y border-[#242321] py-6 sm:py-7 relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-0 lg:divide-x lg:divide-[#242321]">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-0 lg:px-6 xl:px-8"
            >
              <div className="w-10 h-10 rounded-lg bg-[#242321]/60 border border-[#242321] flex items-center justify-center shrink-0">
                {benefit.icon}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[#F4F0E8] font-montserrat text-xs sm:text-[13px] font-semibold tracking-wide uppercase">
                  {benefit.title}
                </span>
                <span className="text-[#716B63] font-montserrat text-[11px] sm:text-xs mt-0.5">
                  {benefit.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
