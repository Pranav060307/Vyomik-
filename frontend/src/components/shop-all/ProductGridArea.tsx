import React from 'react';
import { ShopProduct } from '../../config/shopProducts';
import { ShopProductCard } from './ShopProductCard';
import { PaginationControls } from './PaginationControls';

interface ProductGridAreaProps {
  products: ShopProduct[];
  totalProductsCount: number;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (sort: 'newest' | 'price-asc' | 'price-desc' | 'popular') => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onOpenMobileFilters: () => void;
  onResetFilters: () => void;
  activeFilterCount: number;
}

export const ProductGridArea: React.FC<ProductGridAreaProps> = ({
  products,
  totalProductsCount,
  viewMode,
  onToggleViewMode,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  onOpenMobileFilters,
  onResetFilters,
  activeFilterCount,
}) => {
  const pageSize = 6;
  const startIndex = totalProductsCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalProductsCount);

  return (
    <div className="flex-1 flex flex-col text-left">
      {/* Top Toolbar */}
      <div className="pb-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Product count readout & Mobile filter trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-[#181818] border border-white/10 text-xs font-montserrat font-bold text-[#F4F0E8] flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#C85A2E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C85A2E] text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          <span className="text-xs sm:text-[13px] font-montserrat text-[#D9D1C3]">
            Showing {totalProductsCount === 0 ? 0 : `${startIndex} – ${endIndex}`} of {totalProductsCount} Products
          </span>
        </div>

        {/* Right: Grid/List toggle & Sort Select */}
        <div className="flex items-center gap-3 ml-auto">
          {/* View Mode Toggle Buttons */}
          <div className="hidden sm:flex items-center bg-[#141414] border border-[#242321] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => onToggleViewMode('grid')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#242321] text-[#F4F0E8]'
                  : 'text-[#716B63] hover:text-white'
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm-11 11h7v7H3v-7zm11 0h7v7h-7v-7z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => onToggleViewMode('list')}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#242321] text-[#F4F0E8]'
                  : 'text-[#716B63] hover:text-white'
              }`}
              aria-label="List view"
              title="List view"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              </svg>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-[#141414] border border-[#242321] text-[#D9D1C3] text-xs font-montserrat font-medium rounded-xl py-2 pl-3.5 pr-8 appearance-none cursor-pointer focus:outline-none focus:border-[#C85A2E]"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <svg
              className="w-3.5 h-3.5 text-[#716B63] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main 4-Column Grid (Desktop) or 2-Column (Mobile) */}
      {products.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#181818] border border-white/5 flex items-center justify-center text-[#C85A2E] mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <h4 className="text-base font-montserrat font-bold text-[#F4F0E8]">
            No products match your selected filters
          </h4>
          <p className="mt-1 text-xs text-[#716B63] max-w-sm font-montserrat">
            Try adjusting your price range, sizes, or category selection to discover more essentials.
          </p>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-5 px-6 py-2.5 rounded-full bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs font-montserrat font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
          {products.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              viewMode="list"
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
