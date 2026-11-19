import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SHOP_PRODUCTS } from '../../config/shopProducts';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { ProductGridArea } from './ProductGridArea';

interface ShopMainListingProps {
  initialCategory?: string;
  onCategoryCountChange?: (counts: Record<string, number>) => void;
}

const DEFAULT_FILTERS: FilterState = {
  category: 'all',
  sizes: [],
  colors: [],
  minPrice: 500,
  maxPrice: 4000,
  sortBy: 'newest',
};

const PAGE_SIZE = 6;

export const ShopMainListing: React.FC<ShopMainListingProps> = ({
  initialCategory,
  onCategoryCountChange,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('cat') || initialCategory || 'all';

  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    category: urlCategory,
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Sync category changes from parent / URL
  useEffect(() => {
    if (urlCategory && urlCategory !== filters.category) {
      setFilters((prev) => ({ ...prev, category: urlCategory }));
      setCurrentPage(1);
    }
  }, [urlCategory]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: SHOP_PRODUCTS.length,
      hoodies: 0,
      't-shirts': 0,
      cargos: 0,
      jackets: 0,
      accessories: 0,
    };

    SHOP_PRODUCTS.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, []);

  useEffect(() => {
    if (onCategoryCountChange) {
      onCategoryCountChange(categoryCounts);
    }
  }, [categoryCounts, onCategoryCountChange]);

  const handleFilterChange = (updated: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...updated };
      // Update URL query if category changes
      if (updated.category && updated.category !== prev.category) {
        if (updated.category === 'all') {
          searchParams.delete('cat');
        } else {
          searchParams.set('cat', updated.category);
        }
        setSearchParams(searchParams, { replace: true });
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setFilters({ ...DEFAULT_FILTERS, category: 'all' });
    searchParams.delete('cat');
    setSearchParams(searchParams, { replace: true });
    setCurrentPage(1);
  };

  // Filter and sort execution
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...SHOP_PRODUCTS];

    // 1. Category Filter
    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.category === filters.category);
    }

    // 2. Size Filter
    if (filters.sizes.length > 0) {
      list = list.filter((p) =>
        p.availableSizes.some((s) => filters.sizes.includes(s))
      );
    }

    // 3. Color Filter
    if (filters.colors.length > 0) {
      list = list.filter((p) =>
        p.swatches.some((sw) => filters.colors.includes(sw.hex))
      );
    }

    // 4. Price Range Filter
    list = list.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    );

    // 5. Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'newest':
      default:
        // Keep catalog order
        break;
    }

    return list;
  }, [filters]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PAGE_SIZE);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAndSortedProducts.slice(start, start + PAGE_SIZE);
  }, [filteredAndSortedProducts, currentPage]);

  const activeFilterCount =
    (filters.category !== 'all' ? 1 : 0) +
    filters.sizes.length +
    filters.colors.length +
    (filters.maxPrice < 4000 ? 1 : 0);

  return (
    <section
      role="region"
      aria-label="Product Catalog"
      className="w-full bg-[#0B0B0B] py-10 sm:py-14"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-start gap-8 lg:gap-12">
          {/* Desktop Sidebar (hidden on mobile/tablet) */}
          <div className="hidden lg:block sticky top-24">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* Right Product Grid Area */}
          <ProductGridArea
            products={paginatedProducts}
            totalProductsCount={filteredAndSortedProducts.length}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            sortBy={filters.sortBy}
            onSortChange={(sort) => handleFilterChange({ sortBy: sort })}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            onOpenMobileFilters={() => setMobileDrawerOpen(true)}
            onResetFilters={handleClearAll}
            activeFilterCount={activeFilterCount}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over panel */}
          <div className="relative ml-auto w-full max-w-xs sm:max-w-sm h-full bg-[#0B0B0B] shadow-2xl z-10 flex flex-col">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClearAll={handleClearAll}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}
    </section>
  );
};
