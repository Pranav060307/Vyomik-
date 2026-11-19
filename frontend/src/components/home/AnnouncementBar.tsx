import React, { useState } from 'react';
import { useStoreConfig } from '../../hooks/useStoreConfig';
import { formatPaiseToRupees } from '../../utils/format';

export const AnnouncementBar: React.FC = () => {
  const { data: config } = useStoreConfig();
  const [currentIndex, setCurrentIndex] = useState(0);

  const freeShippingThreshold = config?.free_shipping_threshold_paise
    ? formatPaiseToRupees(config.free_shipping_threshold_paise)
    : '₹1,499';

  const announcements = [
    `Free Shipping on Orders Above ${freeShippingThreshold}`,
    'New Launch: Core Element Collection',
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="w-full bg-[#A64B2A] text-[#F4F0E8] text-[11px] sm:text-xs font-montserrat font-medium tracking-wider uppercase py-2 px-4 flex items-center justify-between select-none relative z-40 transition-colors"
    >
      {/* Left Chevron */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous announcement"
        className="p-1 hover:text-white transition-opacity opacity-80 hover:opacity-100 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Main Dual Announcement on Desktop / Single on Mobile */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-1 text-center truncate min-w-0">
        {/* Truck Icon */}
        <span className="hidden sm:inline-flex items-center text-white/90">
          <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span>Free Shipping on Orders Above {freeShippingThreshold}</span>
        </span>

        <span className="hidden sm:inline text-white/60 font-light">|</span>

        {/* Second Message */}
        <span className="hidden sm:inline text-white/95">
          New Launch: Core Element Collection
        </span>

        {/* Mobile View: Shows active index item */}
        <span className="sm:hidden text-center truncate">
          {announcements[currentIndex]}
        </span>
      </div>

      {/* Right Chevron */}
      <button
        type="button"
        onClick={handleNext}
        aria-label="Next announcement"
        className="p-1 hover:text-white transition-opacity opacity-80 hover:opacity-100 cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
