import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NewArrivalsCategoriesProps {
  onSelectCategory?: (category: string) => void;
}

export const NewArrivalsCategories: React.FC<NewArrivalsCategoriesProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 'hoodies',
      label: 'HOODIES',
      image: '/images/vyomik/new-arrivals/hoodies.webp',
      alt: 'VYOMIK Oversized Hoodies',
    },
    {
      id: 'plain',
      label: 'T-SHIRTS',
      image: '/images/vyomik/new-arrivals/tshirts.webp',
      alt: 'VYOMIK Heavyweight T-Shirts',
    },
    {
      id: 'cargos',
      label: 'CARGOS',
      image: '/images/vyomik/new-arrivals/cargos.webp',
      alt: 'VYOMIK Technical Cargos',
    },
    {
      id: 'accessories',
      label: 'ACCESSORIES',
      image: '/images/vyomik/new-arrivals/accessories.webp',
      alt: 'VYOMIK Headwear and Accessories',
    },
  ];

  const handleCardClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    } else {
      navigate(`/collections?cat=${catId}`);
    }
  };

  const handleExploreAll = () => {
    if (onSelectCategory) {
      onSelectCategory('all');
    } else {
      navigate('/collections');
    }
  };

  return (
    <section
      aria-label="New Arrivals by Category"
      className="w-full py-16 sm:py-20 lg:py-24 bg-[#0B0B0B] text-[#F4F0E8] relative z-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Heading and Explore All */}
          <div className="lg:col-span-3 flex flex-col items-start text-left">
            <h2
              aria-label="NEW ARRIVALS"
              className="font-syne font-extrabold text-3xl sm:text-4xl lg:text-[40px] uppercase tracking-tight text-[#F4F0E8] leading-[1.05]"
            >
              NEW<br />ARRIVALS
            </h2>
            <p className="font-montserrat text-xs sm:text-sm text-[#716B63] mt-3.5 mb-6 leading-relaxed max-w-xs">
              The latest drops, crafted for everyday impact.
            </p>
            <button
              type="button"
              onClick={handleExploreAll}
              className="px-6 py-2.5 rounded-full border border-[#242321] hover:border-[#A64B2A] text-xs font-montserrat font-semibold tracking-wider uppercase text-[#D9D1C3] hover:text-[#F4F0E8] transition-all duration-300 hover:scale-[1.02] flex items-center gap-2 cursor-pointer group"
            >
              <span>Explore All</span>
              <span className="transition-transform group-hover:translate-x-1 duration-200">&rarr;</span>
            </button>
          </div>

          {/* Right Column: 4 Category Image Cards */}
          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleCardClick(cat.id)}
                className="group relative rounded-2xl overflow-hidden bg-[#141210] border border-[#242321] hover:border-[#716B63] cursor-pointer transition-all duration-300 aspect-[3/4] flex flex-col justify-end p-4 select-none shadow-lg hover:shadow-2xl"
                role="button"
                tabIndex={0}
                aria-label={`Shop ${cat.label}`}
              >
                {/* Background Category Image */}
                <img
                  src={cat.image}
                  alt={cat.alt}
                  className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                  loading="lazy"
                />

                {/* Scrim overlay for crisp typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                {/* Card Bottom Label & Action Icon */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span className="font-montserrat font-bold text-xs sm:text-sm tracking-wider uppercase text-[#F4F0E8] group-hover:text-white transition-colors">
                    {cat.label}
                  </span>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#141210]/80 backdrop-blur-sm border border-[#242321] flex items-center justify-center text-[#D9D1C3] group-hover:bg-[#A64B2A] group-hover:border-[#A64B2A] group-hover:text-white transition-all duration-300 transform group-hover:scale-105">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
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
