import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

const RECOMMENDED_PRODUCTS: RecommendedProduct[] = [
  {
    id: 'vy-prod-08',
    slug: 'element-hoodie-black',
    name: 'Core Hoodie – Black',
    price: 2499,
    image: '/images/vyomik/products/element-hoodie-black.webp',
  },
  {
    id: 'vy-prod-04',
    slug: 'core-hoodie-rust',
    name: 'Core Hoodie – Rust',
    price: 2499,
    image: '/images/vyomik/products/core-hoodie-rust.png',
  },
  {
    id: 'vy-prod-02',
    slug: 'element-tee-black',
    name: 'Element Tee – Black',
    price: 1299,
    image: '/images/vyomik/products/element-tee-black.webp',
  },
  {
    id: 'vy-prod-03',
    slug: 'terrain-cargos-charcoal',
    name: 'Terrain Cargos – Charcoal',
    price: 2299,
    image: '/images/vyomik/products/terrain-cargos-charcoal.webp',
  },
  {
    id: 'vy-prod-07',
    slug: 'vyomik-cap-sand',
    name: 'VYOMIK Cap – Sand',
    price: 899,
    image: '/images/vyomik/products/vyomik-cap-sand.webp',
  },
];

const WISHLIST_STORAGE_KEY = 'vyomik_wishlist';

export const YouMayAlsoLike: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
        setWishlist(raw ? JSON.parse(raw) : []);
      } catch {
        // ignore
      }
    };
    window.addEventListener('vyomik_wishlist_updated', handleStorage);
    return () => window.removeEventListener('vyomik_wishlist_updated', handleStorage);
  }, []);

  const handleWishlistToggle = (e: React.MouseEvent, item: RecommendedProduct) => {
    e.stopPropagation();
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const list: string[] = raw ? JSON.parse(raw) : [];
      const idx = list.indexOf(item.id);
      let isAdded = false;
      if (idx > -1) {
        list.splice(idx, 1);
        isAdded = false;
      } else {
        list.push(item.id);
        isAdded = true;
      }
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
      setWishlist(list);
      window.dispatchEvent(new Event('vyomik_wishlist_updated'));
      toast(isAdded ? `Saved ${item.name} to wishlist` : `Removed from wishlist`);
    } catch {
      // ignore
    }
  };

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-14 sm:mt-20 pb-16 text-left">
      {/* Section Heading with Signature Orange Brush Underline */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-montserrat font-bold text-[#F4F0E8] uppercase tracking-wider inline-block relative">
          YOU MAY ALSO LIKE
          <span className="block mt-1 w-12 h-[2px] bg-[#C85A2E] rounded-full shadow-[0_0_8px_rgba(200,90,46,0.6)]" />
        </h2>
      </div>

      {/* 5-Card Product Grid (Exact Reference Replica) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
        {RECOMMENDED_PRODUCTS.map((prod) => {
          const isWishlisted = wishlist.includes(prod.id);

          return (
            <div
              key={prod.id}
              onClick={() => handleProductClick(prod.slug)}
              className="group relative flex flex-col bg-[#141414] border border-[#242321] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer text-left"
            >
              {/* Product Image Area */}
              <div className="relative aspect-[4/5] w-full bg-[#0B0B0B] overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Top Wishlist Heart Icon */}
                <button
                  type="button"
                  onClick={(e) => handleWishlistToggle(e, prod)}
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isWishlisted ? 'fill-[#C85A2E] text-[#C85A2E]' : 'text-current'
                    }`}
                  />
                </button>
              </div>

              {/* Product Details Area */}
              <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                <h3 className="text-xs sm:text-[13px] font-montserrat font-bold text-[#F4F0E8] truncate group-hover:text-[#C85A2E] transition-colors">
                  {prod.name}
                </h3>
                <div className="mt-1 text-xs sm:text-[13px] font-montserrat font-semibold text-[#D9D1C3]">
                  ₹{prod.price.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

