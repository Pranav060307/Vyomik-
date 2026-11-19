import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ExploreCollectionsSectionProps {
  onSelectCollection?: (collectionId: string) => void;
}

export const ExploreCollectionsSection: React.FC<ExploreCollectionsSectionProps> = ({
  onSelectCollection,
}) => {
  const navigate = useNavigate();

  const collections = [
    {
      id: 'core-essentials',
      title: 'Core Essentials',
      description: 'Timeless everyday fits.',
      image: '/images/vyomik/collections/core-essentials.webp',
      alt: 'Core Essentials Collection Campaign',
    },
    {
      id: 'urban-terrain',
      title: 'Urban Terrain',
      description: 'Rugged. Functional. Versatile.',
      image: '/images/vyomik/collections/urban-terrain.webp',
      alt: 'Urban Terrain Streetwear Cargo Collection',
    },
    {
      id: 'monochrome-edit',
      title: 'Monochrome Edit',
      description: 'Minimal tones. Maximum impact.',
      image: '/images/vyomik/collections/monochrome-edit.webp',
      alt: 'Monochrome Edit Minimal Black Streetwear Collection',
    },
  ];

  const handleCardClick = (id: string) => {
    if (onSelectCollection) {
      onSelectCollection(id);
    } else {
      navigate(`/collections?collection=${id}`);
    }
  };

  const handleViewCollections = () => {
    if (onSelectCollection) {
      onSelectCollection('all');
    } else {
      navigate('/collections');
    }
  };

  return (
    <section
      aria-label="Explore Collections"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#0B0B0B] text-[#F4F0E8] relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Heading, Subtitle and CTA */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <div className="relative">
              <h2 className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-[40px] uppercase tracking-tight text-[#F4F0E8] leading-[1.05]">
                <span className="relative inline-block">
                  EXPLORE
                  {/* Burnt-Rust Decorative Brush Stroke */}
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-2.5 text-[#A64B2A] fill-current pointer-events-none"
                    viewBox="0 0 160 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 9C28 4.5 78 2.5 118 4.2C138 5 152 7.8 158 9.5"
                      stroke="#A64B2A"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                COLLECTIONS
              </h2>
            </div>

            <p className="font-montserrat text-xs sm:text-sm text-[#716B63] mt-4 mb-6 leading-relaxed max-w-xs">
              Curated drops for every part of your day.
            </p>

            <button
              type="button"
              onClick={handleViewCollections}
              className="px-6 py-2.5 rounded-full border border-[#242321] hover:border-[#A64B2A] text-xs font-montserrat font-semibold tracking-wider uppercase text-[#D9D1C3] hover:text-[#F4F0E8] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 cursor-pointer group"
            >
              <span>View Collections</span>
              <span className="transition-transform group-hover:translate-x-1 duration-200">&rarr;</span>
            </button>
          </div>

          {/* Right Column: 3 Editorial Collection Cards */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {collections.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item.id)}
                className="group relative rounded-2xl overflow-hidden bg-[#141210] border border-[#242321] hover:border-[#716B63] cursor-pointer transition-all duration-300 aspect-[4/5] flex flex-col justify-end p-5 select-none shadow-xl hover:shadow-2xl"
                role="button"
                tabIndex={0}
                aria-label={`Explore ${item.title}`}
              >
                {/* Background Image */}
                <img
                  src={item.image}
                  alt={item.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                {/* Card Bottom Meta */}
                <div className="relative z-10 flex items-end justify-between w-full">
                  <div className="flex flex-col text-left">
                    <h3 className="font-montserrat font-bold text-sm sm:text-base tracking-wide text-[#F4F0E8] group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-montserrat text-xs text-[#716B63] group-hover:text-[#D9D1C3] transition-colors mt-0.5">
                      {item.description}
                    </p>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-[#141210]/80 backdrop-blur-sm border border-[#242321] flex items-center justify-center text-[#D9D1C3] group-hover:bg-[#A64B2A] group-hover:border-[#A64B2A] group-hover:text-white transition-all duration-300 transform group-hover:scale-105 shrink-0 ml-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
