import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CollectionCardData {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  categoryFilter: string;
  isFeatured?: boolean;
  isItalicTitle?: boolean;
}

const COLLECTIONS_DATA: CollectionCardData[] = [
  {
    id: 'core-elements',
    title: 'CORE ELEMENTS',
    subtitle: 'The signature collection.',
    image: '/images/vyomik/collections/col-core-elements-clean.webp',
    categoryFilter: 'hoodies',
    isFeatured: true,
  },
  {
    id: 'urban-terrain',
    title: 'URBAN TERRAIN',
    subtitle: 'Rugged. Functional. Versatile.',
    image: '/images/vyomik/collections/col-urban-terrain-clean.webp',
    categoryFilter: 'cargos',
  },
  {
    id: 'monochrome-edit',
    title: 'MONOCHROME EDIT',
    subtitle: 'Minimal tones. Maximum impact.',
    image: '/images/vyomik/collections/col-monochrome-edit-clean.webp',
    categoryFilter: 'wordmark',
  },
  {
    id: 'essentials',
    title: 'ESSENTIALS',
    subtitle: 'Everyday fits. Elevated.',
    image: '/images/vyomik/collections/col-essentials-clean.webp',
    categoryFilter: 'plain',
    isItalicTitle: true,
  },
];

export const CollectionCardsGrid: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const handleCardClick = (categoryFilter: string) => {
    navigate(`/shop?cat=${categoryFilter}`);
  };

  return (
    <section className="w-full bg-[#0B0B0B] py-5 lg:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Four equal-width cards in one horizontal desktop row, approx 250px tall */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {COLLECTIONS_DATA.map((col) => {
            const isHighlighted = col.isFeatured || hoveredCardId === col.id;

            return (
              <div
                key={col.id}
                onClick={() => handleCardClick(col.categoryFilter)}
                onMouseEnter={() => setHoveredCardId(col.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(col.categoryFilter);
                  }
                }}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:-translate-y-1 h-[230px] sm:h-[240px] lg:h-[250px] flex flex-col justify-between p-4 sm:p-5 select-none ${
                  isHighlighted
                    ? 'border-[1.5px] border-[#C85A2E] shadow-[0_0_16px_rgba(200,90,46,0.5),0_0_32px_rgba(200,90,46,0.22),inset_0_0_12px_rgba(200,90,46,0.12)]'
                    : 'border border-[#242321] hover:border-[#A64B2A]/70'
                }`}
              >
                {/* Edge-to-Edge Photographic Imagery */}
                <div className="absolute inset-0 z-0 overflow-hidden bg-[#141210]">
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Dark gradient overlay for typography readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/95 via-[#0B0B0B]/40 to-transparent" />
                </div>

                {/* Top Row: FEATURED Badge for Card 1 */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  {col.isFeatured ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase text-[#F4F0E8] bg-[#0B0B0B]/85 border border-[#A64B2A] backdrop-blur-md">
                      FEATURED
                    </span>
                  ) : (
                    <div />
                  )}
                </div>

                {/* Bottom Row: Typography & Circular Arrow Icon */}
                <div className="relative z-10 flex items-end justify-between w-full mt-auto">
                  <div className="pr-2">
                    <h3
                      className={`text-base lg:text-[17px] font-bold tracking-wider uppercase text-white font-montserrat leading-tight group-hover:text-[#F4F0E8] transition-colors ${
                        col.isItalicTitle ? 'italic font-black' : ''
                      }`}
                    >
                      {col.title}
                    </h3>
                    <p className="text-xs text-[#D9D1C3]/80 font-light mt-0.5">
                      {col.subtitle}
                    </p>
                  </div>

                  {/* Circular Outlined Arrow Icon (↗) in Bottom-Right Corner */}
                  <div
                    aria-label={`Explore ${col.title}`}
                    className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center text-white flex-shrink-0 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:border-white group-hover:scale-105 shadow-md"
                  >
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 17L17 7M17 7H7M17 7V17"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
