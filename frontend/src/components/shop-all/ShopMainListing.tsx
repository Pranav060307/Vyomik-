import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SHOP_PRODUCTS, ShopProduct } from '../../config/shopProducts';
import { FilterSidebar, FilterState } from './FilterSidebar';
import { ProductGridArea } from './ProductGridArea';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

  const [catalogProducts, setCatalogProducts] = useState<ShopProduct[]>(SHOP_PRODUCTS);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  // Fetch live products from backend to ensure Qikink / MongoDB items display
  useEffect(() => {
    let isMounted = true;
    async function loadLiveProducts() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            const liveMapped: ShopProduct[] = data.map((p: any) => {
              const existing = SHOP_PRODUCTS.find((sp) => sp.slug === p.slug);
              if (existing) {
                return {
                  ...existing,
                  price: p.base_price ? Math.round(p.base_price / 100) : existing.price,
                  pricePaise: p.base_price || existing.pricePaise,
                };
              }
              const isSweatshirt = p.category === 'sweatshirt' || p.slug?.includes('sweatshirt');
              const isHoodie = p.category?.includes('hoodie') || p.slug?.includes('hoodie');
              const catKey = isSweatshirt ? 'sweatshirt' : isHoodie ? 'hoodies' : 'oversized';
              const catLabel = isSweatshirt ? 'Sweatshirt' : isHoodie ? 'Hoodies' : 'Oversized';
              return {
                id: String(p.id || p.slug),
                slug: p.slug,
                name: p.name || p.title,
                category: catKey as any,
                categoryLabel: catLabel,
                price: p.base_price ? Math.round(p.base_price / 100) : 799,
                oldPrice: p.base_price ? Math.round((p.base_price / 100) * 1.35) : 1199,
                pricePaise: p.base_price || 79900,
                color: '#F4F0E8',
                colorName: 'White',
                swatches: [{ name: 'White', hex: '#F4F0E8' }, { name: 'Black', hex: '#141414' }],
                availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                primaryImage: p.images?.[0]?.url || '/assets/oversized-basic-tee.png',
                hoverImage: '/assets/rack-tees.png',
                description: p.description || '',
                fabricSpecs: p.fabric_specs || '240 GSM Combed Cotton',
              };
            });

            const combined = [...liveMapped];
            for (const sp of SHOP_PRODUCTS) {
              if (!combined.some((c) => c.slug === sp.slug)) {
                combined.push(sp);
              }
            }
            setCatalogProducts(combined);
          }
        }
      } catch (err) {
        console.warn('Could not load live products for shop catalog:', err);
      }
    }
    loadLiveProducts();
    return () => { isMounted = false; };
  }, []);

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
      all: catalogProducts.length,
      oversized: 0,
      sweatshirt: 0,
      hoodies: 0,
    };

    catalogProducts.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category]++;
      }
    });

    return counts;
  }, [catalogProducts]);

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
    let list = [...catalogProducts];

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
              categoryCounts={categoryCounts}
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
              categoryCounts={categoryCounts}
            />
          </div>
        </div>
      )}
    </section>
  );
};
