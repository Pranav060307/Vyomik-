import React, { useState } from 'react';
import { ShopProduct } from '../../config/shopProducts';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ShopProductCardProps {
  product: ShopProduct;
  viewMode?: 'grid' | 'list';
}

const WISHLIST_STORAGE_KEY = 'vyomik_wishlist';

function isProductInWishlist(id: string): boolean {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return false;
    const list: string[] = JSON.parse(raw);
    return list.includes(id);
  } catch {
    return false;
  }
}

function toggleProductWishlist(id: string): boolean {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    const index = list.indexOf(id);
    let newState = false;
    if (index > -1) {
      list.splice(index, 1);
      newState = false;
    } else {
      list.push(id);
      newState = true;
    }
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(list));
    return newState;
  } catch {
    return false;
  }
}

export const ShopProductCard: React.FC<ShopProductCardProps> = ({
  product,
  viewMode = 'grid',
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() =>
    isProductInWishlist(product.id)
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.swatches[0]?.hex || product.color
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleProductWishlist(product.id);
    setIsWishlisted(nextState);
    toast(nextState ? `Saved ${product.name} to wishlist` : `Removed from wishlist`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: `${product.id}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      pricePaise: product.pricePaise || product.price * 100,
      type: product.category,
      color: selectedColor,
      size: product.availableSizes[0] || 'M',
      img: product.primaryImage,
      image: product.primaryImage,
      quantity: 1,
    });
    toast(`${product.name} added to bag`);
  };

  // List View Variant
  if (viewMode === 'list') {
    return (
      <div className="w-full bg-[#141414] border border-[#242321] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 hover:border-white/20 transition-all duration-300 group">
        <div className="w-full sm:w-44 h-48 sm:h-44 rounded-xl overflow-hidden bg-[#0B0B0B] relative flex-none">
          <img
            src={product.primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.badge && (
            <span className="absolute top-2.5 left-2.5 bg-[#C85A2E] text-white text-[10px] font-montserrat font-bold px-2 py-0.5 rounded-[4px]">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between w-full text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-montserrat font-bold text-[#F4F0E8]">
              {product.name}
            </h3>
            <button
              type="button"
              onClick={handleWishlistToggle}
              className="p-1.5 text-white/60 hover:text-[#C85A2E] transition-colors cursor-pointer"
              aria-label="Wishlist"
            >
              <svg
                className="w-5 h-5"
                fill={isWishlisted ? '#C85A2E' : 'none'}
                stroke={isWishlisted ? '#C85A2E' : 'currentColor'}
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-[#716B63] mt-1 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-lg font-montserrat font-bold text-[#F4F0E8]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>

            <button
              type="button"
              onClick={handleQuickAdd}
              className="w-9 h-9 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Add to Bag"
              aria-label="Add to Bag"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View Variant (Matching Reference Screenshot Exactly)
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex flex-col bg-[#141414] border border-[#242321] rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] w-full bg-[#0B0B0B] overflow-hidden">
        <img
          src={isHovered && product.hoverImage ? product.hoverImage : product.primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges & Wishlist */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {product.badge ? (
            <span className="bg-[#C85A2E] text-white text-[10px] font-montserrat font-bold uppercase px-2 py-0.5 rounded-[4px] shadow-sm pointer-events-auto">
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors pointer-events-auto cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill={isWishlisted ? '#C85A2E' : 'none'}
              stroke={isWishlisted ? '#C85A2E' : 'currentColor'}
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-4 sm:p-4.5 flex flex-col flex-1 justify-between text-left">
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-[14px] font-montserrat font-bold text-[#F4F0E8] truncate">
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-1 text-sm sm:text-[15px] font-montserrat font-semibold text-[#D9D1C3]">
            ₹{product.price.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Bottom Row: Swatches on Left, Orange Shopping Bag Button on Right */}
        <div className="mt-3 pt-2 flex items-center justify-between">
          {/* Swatches */}
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Color choices">
            {product.swatches.map((swatch) => (
              <button
                key={swatch.hex}
                type="button"
                onClick={() => setSelectedColor(swatch.hex)}
                style={{ backgroundColor: swatch.hex }}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  selectedColor === swatch.hex
                    ? 'border-white scale-125 shadow-[0_0_0_1.5px_#141414_inset]'
                    : 'border-white/30 hover:scale-110'
                }`}
                title={swatch.name}
                aria-label={swatch.name}
              />
            ))}
          </div>

          {/* Orange Shopping Bag Button (Exact match from reference) */}
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-[10px] bg-[#C85A2E] hover:bg-[#a64720] text-white flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
            title="Add to Bag"
            aria-label="Add to Bag"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
