import React, { useState } from 'react';

export interface FilterState {
  category: string;
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onClearAll: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
  categoryCounts?: Record<string, number>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onClearAll,
  isMobileDrawer = false,
  onCloseMobileDrawer,
  categoryCounts,
}) => {
  const [openCategories, setOpenCategories] = useState(true);
  const [openSizes, setOpenSizes] = useState(true);
  const [openColors, setOpenColors] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);
  const [openSort, setOpenSort] = useState(true);

  const categories = [
    { id: 'oversized', label: 'Oversized', count: categoryCounts?.oversized ?? 5 },
    { id: 'sweatshirt', label: 'Sweatshirt', count: categoryCounts?.sweatshirt ?? 3 },
    { id: 'hoodies', label: 'Hoodies', count: categoryCounts?.hoodies ?? 3 },
  ];

  const sizeRows = [
    ['XS', 'S', 'M', 'L'],
    ['XL', 'XXL'],
  ];

  const availableColors = [
    { name: 'Ivory', hex: '#F4F0E8', label: 'Warm Ivory' },
    { name: 'Black', hex: '#141414', label: 'Pitch Black' },
    { name: 'Charcoal', hex: '#3A3A3A', label: 'Charcoal' },
    { name: 'Rust', hex: '#C85A2E', label: 'Burnt Rust' },
    { name: 'Olive', hex: '#4E5B42', label: 'Washed Olive' },
  ];

  const handleSizeToggle = (size: string) => {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onChange({ sizes: next });
  };

  const handleColorToggle = (hex: string) => {
    const next = filters.colors.includes(hex)
      ? filters.colors.filter((c) => c !== hex)
      : [...filters.colors, hex];
    onChange({ colors: next });
  };

  return (
    <aside
      className={`flex flex-col text-left ${
        isMobileDrawer
          ? 'w-full h-full overflow-y-auto px-6 py-6 bg-[#0B0B0B]'
          : 'w-60 lg:w-64 flex-none pr-6 lg:pr-8 border-r border-[#242321]'
      }`}
      aria-label="Product Filters"
    >
      {/* Header: Filters + Clear All */}
      <div className="flex items-center justify-between pb-5 border-b border-[#242321]">
        <h3 className="text-lg font-montserrat font-bold text-[#F4F0E8]">
          Filters
        </h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-montserrat font-semibold text-[#C85A2E] hover:underline cursor-pointer"
        >
          Clear All
        </button>

        {isMobileDrawer && onCloseMobileDrawer && (
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="p-1 text-white/70 hover:text-white cursor-pointer ml-3"
            aria-label="Close filters"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Accordion 1: Category */}
      <div className="py-4 border-b border-[#242321]">
        <button
          type="button"
          onClick={() => setOpenCategories(!openCategories)}
          className="w-full flex items-center justify-between text-sm font-montserrat font-bold text-[#F4F0E8] cursor-pointer"
        >
          <span>Category</span>
          <svg className={`w-4 h-4 text-[#716B63] transition-transform duration-200 ${openCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openCategories && (
          <div className="mt-3.5 flex flex-col gap-2.5">
            {categories.map((cat) => {
              const isChecked = filters.category === cat.id;
              return (
                <label
                  key={cat.id}
                  className="flex items-center justify-between text-xs font-montserrat text-[#D9D1C3] hover:text-white cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        onChange({ category: isChecked ? 'all' : cat.id });
                      }}
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'bg-[#C85A2E] border-[#C85A2E]'
                          : 'border-white/20 bg-[#141414] group-hover:border-white/40'
                      }`}
                    >
                      {isChecked && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[#716B63] text-xs">({cat.count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: Size */}
      <div className="py-4 border-b border-[#242321]">
        <button
          type="button"
          onClick={() => setOpenSizes(!openSizes)}
          className="w-full flex items-center justify-between text-sm font-montserrat font-bold text-[#F4F0E8] cursor-pointer"
        >
          <span>Size</span>
          <svg className={`w-4 h-4 text-[#716B63] transition-transform duration-200 ${openSizes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openSizes && (
          <div className="mt-3.5 flex flex-col gap-2">
            {sizeRows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-2">
                {row.map((size) => {
                  const isSelected = filters.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-montserrat font-bold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#C85A2E] border-[#C85A2E] text-white shadow-md'
                          : 'bg-[#141414] text-[#D9D1C3] border-white/10 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 3: Color */}
      <div className="py-4 border-b border-[#242321]">
        <button
          type="button"
          onClick={() => setOpenColors(!openColors)}
          className="w-full flex items-center justify-between text-sm font-montserrat font-bold text-[#F4F0E8] cursor-pointer"
        >
          <span>Color</span>
          <svg className={`w-4 h-4 text-[#716B63] transition-transform duration-200 ${openColors ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openColors && (
          <div className="mt-3.5 flex items-center gap-2">
            {availableColors.map((col) => {
              const isSelected = filters.colors.includes(col.hex);
              return (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => handleColorToggle(col.hex)}
                  title={col.label}
                  style={{ backgroundColor: col.hex }}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#C85A2E] scale-125 ring-2 ring-white/50'
                      : 'border-white/20 hover:scale-110'
                  }`}
                  aria-label={col.label}
                />
              );
            })}
            <button
              type="button"
              className="w-6 h-6 rounded-full border border-white/20 bg-[#141414] text-[#716B63] text-xs flex items-center justify-center hover:text-white"
            >
              +
            </button>
          </div>
        )}
      </div>

      {/* Accordion 4: Price Range */}
      <div className="py-4 border-b border-[#242321]">
        <button
          type="button"
          onClick={() => setOpenPrice(!openPrice)}
          className="w-full flex items-center justify-between text-sm font-montserrat font-bold text-[#F4F0E8] cursor-pointer"
        >
          <span>Price Range</span>
          <svg className={`w-4 h-4 text-[#716B63] transition-transform duration-200 ${openPrice ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openPrice && (
          <div className="mt-3.5 flex flex-col gap-2.5">
            <input
              type="range"
              min="499"
              max="3499"
              step="100"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-[#C85A2E] cursor-pointer"
            />
            <div className="text-xs font-montserrat font-medium text-[#F4F0E8]">
              ₹499 — ₹{filters.maxPrice.toLocaleString('en-IN')}
            </div>
          </div>
        )}
      </div>

      {/* Accordion 5: Sort By */}
      <div className="py-4">
        <button
          type="button"
          onClick={() => setOpenSort(!openSort)}
          className="w-full flex items-center justify-between text-sm font-montserrat font-bold text-[#F4F0E8] cursor-pointer"
        >
          <span>Sort By</span>
          <svg className={`w-4 h-4 text-[#716B63] transition-transform duration-200 ${openSort ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {openSort && (
          <div className="mt-3.5">
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => onChange({ sortBy: e.target.value as any })}
                className="w-full bg-[#141414] border border-white/10 text-[#D9D1C3] text-xs font-montserrat font-medium rounded-xl py-2.5 px-3 appearance-none cursor-pointer focus:outline-none focus:border-[#C85A2E]"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <svg
                className="w-3.5 h-3.5 text-[#716B63] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Apply Button */}
      {isMobileDrawer && (
        <div className="mt-6 pt-4 border-t border-[#242321]">
          <button
            type="button"
            onClick={onCloseMobileDrawer}
            className="w-full py-3.5 rounded-full bg-[#C85A2E] text-white text-xs font-montserrat font-bold uppercase tracking-wider shadow-xl"
          >
            Apply Filters
          </button>
        </div>
      )}
    </aside>
  );
};
