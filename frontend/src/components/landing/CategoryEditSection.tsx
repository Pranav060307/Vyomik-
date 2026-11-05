import React, { useState } from 'react';
import { X, ArrowRight, Bell } from 'lucide-react';
import { DEMO_CATEGORIES, DemoCategoryInfo } from '../../config/demoContent';
import { instagramUrl, instagramHandle } from '../../config/brand';
import { InstagramIcon } from '../common/InstagramIcon';

interface CategoryEditSectionProps {
  onOpenNotifyModal: (source: string) => void;
}

export const CategoryEditSection: React.FC<CategoryEditSectionProps> = ({
  onOpenNotifyModal,
}) => {
  // Currently expanded category ID for the inline "Coming soon" panel
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const selectedCategory = DEMO_CATEGORIES.find((c) => c.id === selectedCategoryId);

  const handleCardClick = (cat: DemoCategoryInfo) => {
    // If clicking same, toggle close; else open
    if (selectedCategoryId === cat.id) {
      setSelectedCategoryId(null);
    } else {
      setSelectedCategoryId(cat.id);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-[1280px] mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 pb-4 border-b border-[#DAD7CE]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
            CURATED DROP
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#202020] tracking-tight mt-1 text-balance">
            The everyday edit
          </h2>
        </div>
        <p className="text-xs uppercase tracking-[0.16em] text-[#202020]/60 mt-2 sm:mt-0">
          THREE CORE SILHOUETTES · LAUNCH EDITION
        </p>
      </div>

      {/* 3 Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {DEMO_CATEGORIES.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const isOliveHighlight = cat.isHighlighted;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleCardClick(cat);
                }
              }}
              className={`group cursor-pointer transition-all duration-300 relative border flex flex-col justify-between overflow-hidden text-left h-full ${
                isOliveHighlight
                  ? 'bg-[#5C6548] text-[#F4F3EE] border-[#4D553C] hover:bg-[#525B40]'
                  : 'bg-white text-[#202020] border-[#DAD7CE] hover:border-[#202020]'
              } ${isSelected ? 'ring-2 ring-[#202020] ring-offset-2' : ''} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] focus-visible:ring-offset-2`}
              aria-expanded={isSelected}
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EAE8E1]/40 border-b border-inherit shrink-0">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {isOliveHighlight && (
                  <div className="absolute top-4 right-4 bg-[#F4F3EE] text-[#202020] text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                    FEATURED
                  </div>
                )}
              </div>

              {/* Card Footer Details */}
              <div className="p-6 sm:p-7 flex items-end justify-between flex-1 mt-auto">
                <div className="pr-4">
                  <h3
                    className={`text-xl sm:text-2xl font-semibold tracking-tight ${
                      isOliveHighlight ? 'text-[#F4F3EE]' : 'text-[#202020]'
                    }`}
                  >
                    {cat.title}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 leading-relaxed ${
                      isOliveHighlight ? 'text-[#DAD7CE]' : 'text-[#202020]/70'
                    }`}
                  >
                    {cat.tagline}
                  </p>
                </div>

                <div
                  className={`p-1.5 shrink-0 transition-transform group-hover:translate-x-1 ${
                    isOliveHighlight ? 'text-[#F4F3EE]' : 'text-[#202020]'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 stroke-[1.75]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inline 'Coming soon' panel below cards (Requirement 4) */}
      {selectedCategory && (
        <div
          data-testid="category-inline-panel"
          className="mt-8 bg-white border border-[#202020] p-6 sm:p-8 relative animate-fadeIn shadow-sm"
        >
          {/* Close (×) button */}
          <button
            type="button"
            onClick={() => setSelectedCategoryId(null)}
            className="absolute top-4 right-4 p-2 text-[#202020] hover:bg-[#F4F3EE] transition-colors focus:outline-none"
            aria-label="Close coming soon panel"
          >
            <X className="w-5 h-5 stroke-[1.5]" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pr-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#5C6548] animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5C6548]">
                  DROP STATUS · COMING SOON
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-semibold text-[#202020]">
                {selectedCategory.title}
              </h4>
              <p className="text-sm text-[#202020]/80 max-w-xl">
                {selectedCategory.comingSoonMessage.split(instagramHandle)[0]}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="VYOMIK on Instagram"
                  className="font-medium text-[#202020] underline hover:text-[#5C6548] transition-colors"
                >
                  {instagramHandle}
                </a>
                {selectedCategory.comingSoonMessage.split(instagramHandle)[1] || ''}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenNotifyModal(`category_${selectedCategory.id}`)}
                className="inline-flex items-center justify-center space-x-3 bg-[#202020] text-[#F4F3EE] px-6 py-3.5 text-xs font-medium uppercase tracking-[0.16em] hover:bg-[#333333] transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span>Notify me for this drop</span>
              </button>

              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on Instagram"
                className="inline-flex items-center justify-center space-x-2 border border-[#DAD7CE] px-5 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-[#202020] hover:border-[#202020] hover:text-[#5C6548] transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-current" />
                <span>Follow {instagramHandle} ↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

