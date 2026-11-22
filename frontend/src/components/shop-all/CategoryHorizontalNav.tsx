import React from 'react';

export interface CategoryOption {
  id: string;
  name: string;
  image?: string;
  isGridIcon?: boolean;
}

interface CategoryHorizontalNavProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CATEGORIES: CategoryOption[] = [
  {
    id: 'all',
    name: 'All Products',
    isGridIcon: true,
  },
  {
    id: 'oversized',
    name: 'Oversized',
    image: '/assets/oversized-basic-tee.png',
  },
  {
    id: 'sweatshirt',
    name: 'Sweatshirts',
    image: '/assets/home/hoodie-charcoal-art.png',
  },
  {
    id: 'hoodies',
    name: 'Hoodies',
    image: '/images/vyomik/new-arrivals/hoodies.webp',
  },
];

export const CategoryHorizontalNav: React.FC<CategoryHorizontalNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section
      role="navigation"
      aria-label="Category Selection"
      className="w-full bg-[#0B0B0B] border-b border-[#242321] py-6 sm:py-7"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`w-full min-h-[110px] sm:min-h-[125px] p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer select-none group relative ${isActive
                    ? 'bg-[#181818] border-2 border-[#C85A2E] shadow-[0_0_20px_rgba(200,90,46,0.3)]'
                    : 'bg-[#141414] border border-white/5 hover:border-white/20 hover:bg-[#181818] hover:scale-[1.02]'
                  }`}
                aria-pressed={isActive}
              >
                {/* Top: 2x2 Grid Icon for All Products, or Image for other categories */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 mb-2 flex items-center justify-center">
                  {cat.isGridIcon ? (
                    <div className="w-8 h-8 grid grid-cols-2 gap-1 text-[#F4F0E8] group-hover:scale-105 transition-transform">
                      <div className="border-[1.5px] border-currentColor rounded-[3px]" />
                      <div className="border-[1.5px] border-currentColor rounded-[3px]" />
                      <div className="border-[1.5px] border-currentColor rounded-[3px]" />
                      <div className="border-[1.5px] border-currentColor rounded-[3px]" />
                    </div>
                  ) : (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Category Name */}
                <span
                  className={`text-xs sm:text-[13px] font-montserrat font-semibold tracking-wide capitalize truncate max-w-full ${isActive ? 'text-[#F4F0E8]' : 'text-[#D9D1C3] group-hover:text-white'
                    }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
