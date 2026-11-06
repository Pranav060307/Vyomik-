import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResponsiveStage } from '../components/common/ResponsiveStage';
import { ProductCard, ProductItem } from '../components/shop/ProductCard';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';

export const CollectionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const catParam = searchParams.get('cat') || '';
  const { itemCount, openBag, openSearch } = useCart();

  const { data: allProducts = [] } = useProducts(catParam);

  // Filter products by search query and category
  const filteredProducts: ProductItem[] = useMemo(() => {
    let result = allProducts;

    if (catParam && catParam !== 'all') {
      const normalizedCat = catParam.toLowerCase().replace('-tees', '');
      result = result.filter((p) => p.category?.toLowerCase().includes(normalizedCat));
    }

    if (queryParam.trim()) {
      const q = queryParam.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.fabricFit && p.fabricFit.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Default featured set: 1 Plain Tee, 1 Wordmark Tee, 1 Hoodie
    if (!catParam && !queryParam.trim() && result.length >= 3) {
      const plain = result.find((p) => p.category === 'plain' || (p.type === 'tee' && p.logo !== 1));
      const wordmark = result.find((p) => p.category === 'wordmark' || p.logo === 1);
      const hoodie = result.find((p) => p.category === 'hoodies' || p.type === 'hoodie');

      if (plain && wordmark && hoodie) {
        return [plain, wordmark, hoodie];
      }
    }

    return result;
  }, [allProducts, catParam, queryParam]);

  // Display top 3 matching products (as specified in 1920x1080 design stage)
  const displayedProducts = filteredProducts.slice(0, 3);
  const n = displayedProducts.length;

  return (
    <ResponsiveStage className="bg-[#050505] relative overflow-hidden font-montserrat">
      {/* Top Floating Nav */}
      <div className="fnav absolute right-[95px] top-[44px] flex items-center gap-[38px] text-[22px] tracking-[0.18em] font-semibold text-white z-20 select-none">
        <span
          onClick={() => navigate('/home')}
          className="hover:text-[#e10600] cursor-pointer transition-colors"
        >
          HOME
        </span>
        <span
          onClick={openSearch}
          className="hover:text-[#e10600] cursor-pointer transition-colors"
        >
          SEARCH
        </span>
        <span
          onClick={openBag}
          className="hover:text-[#e10600] cursor-pointer transition-colors"
        >
          Bag ({itemCount})
        </span>
      </div>

      {/* Eyebrow */}
      <div className="eyebrow absolute left-[75px] top-[50px] text-[25px] tracking-[0.5em] font-medium text-white flex items-center gap-[30px] select-none">
        FEATURED COLLECTION
        <i className="block w-[110px] h-[3px] bg-[#e10600]" />
      </div>

      {/* Main Heading */}
      <h2
        className="absolute left-[72px] top-[82px] font-black text-[84px] tracking-[-2px] text-white leading-none font-montserrat select-none"
        role="heading"
      >
        NEW <span className="red text-[#e10600]">ARRIVALS.</span>
      </h2>

      {/* View All button */}
      <div
        onClick={() => navigate('/collections')}
        className="viewall absolute right-[95px] top-[122px] text-[26px] text-white flex items-center gap-[16px] cursor-pointer hover:text-[#e10600] transition-colors select-none"
      >
        View All
        <span className="ico text-[#e10600] w-[36px] h-[36px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      {/* Cards Area */}
      {displayedProducts.length > 0 ? (
        <div className="cards absolute left-0 top-0 w-[1920px] h-[1080px]">
          {displayedProducts.map((p, i) => {
            // Position identically to HTML:
            // When 3 cards: left is 70px, 665px, 1260px; top is 235px
            const leftPos = n === 3
              ? (i === 0 ? 70 : i === 1 ? 665 : 1260)
              : Math.round((1920 - (n * 590 + (n - 1) * 5)) / 2 + i * 595);

            return (
              <ProductCard
                key={p.id + i}
                product={p}
                variant="newArrivals"
                className="absolute"
                style={{
                  left: `${leftPos}px`,
                  top: '235px',
                }}
              />
            );
          })}
        </div>
      ) : (
        <div className="noresult absolute left-0 right-0 top-[480px] text-center text-[34px] text-[#ccc]">
          No products match “{queryParam}”
          <u
            onClick={() => navigate('/collections')}
            className="text-[#e10600] cursor-pointer ml-[14px]"
          >
            Clear search
          </u>
        </div>
      )}

      {/* Overlays */}
      <SearchBar />
      <BagDrawer />
    </ResponsiveStage>
  );
};
