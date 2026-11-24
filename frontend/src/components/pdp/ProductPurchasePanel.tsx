import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Ruler, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus } from 'lucide-react';
import { ShopProduct } from '../../config/shopProducts';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductPurchasePanelProps {
  product: ShopProduct;
  selectedColor: string;
  onSelectColor: (colorName: string) => void;
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  onSelectSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  quantity: number;
  onIncrementQuantity: () => void;
  onDecrementQuantity: () => void;
  onOpenSizeChart: () => void;
  onScrollToReviews: () => void;
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
    window.dispatchEvent(new Event('vyomik_wishlist_updated'));
    return newState;
  } catch {
    return false;
  }
}

export const ProductPurchasePanel: React.FC<ProductPurchasePanelProps> = ({
  product,
  selectedColor,
  onSelectColor,
  selectedSize,
  onSelectSize,
  quantity,
  onIncrementQuantity,
  onDecrementQuantity,
  onOpenSizeChart,
  onScrollToReviews,
}) => {
  const { addItem, openBag } = useCart();
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState<boolean>(() =>
    isProductInWishlist(product.id)
  );

  useEffect(() => {
    setIsWishlisted(isProductInWishlist(product.id));
  }, [product.id]);

  const handleWishlistToggle = () => {
    const nextState = toggleProductWishlist(product.id);
    setIsWishlisted(nextState);
    toast(nextState ? `Saved ${product.name} to wishlist` : `Removed from wishlist`);
  };

  const handleAddToCart = () => {
    const currentSwatch = product.swatches?.find(
      (s) => s.name.toLowerCase() === selectedColor.toLowerCase()
    );
    const colorGarmentImage = currentSwatch?.img || product.primaryImage;

    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      pricePaise: product.pricePaise || product.price * 100,
      type: product.category,
      color: selectedColor,
      size: selectedSize,
      img: colorGarmentImage,
      image: colorGarmentImage,
      quantity,
    });
    toast(`${product.name} (${selectedSize} · ${selectedColor}) added to bag`);
    openBag();
  };

  const allSizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'> = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
  ];

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 17;

  return (
    <div className="flex flex-col text-left space-y-4 sm:space-y-5">
      {/* 1. Status Badge */}
      <div>
        <span className="inline-block bg-[#C85A2E] text-white text-[11px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-[4px] shadow-sm">
          {product.badge || 'New Launch'}
        </span>
      </div>

      {/* 2. Title & Short Tagline */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-montserrat font-bold text-[#F4F0E8] tracking-tight leading-snug">
          {product.name}
        </h1>
        <p className="mt-1.5 text-xs sm:text-[13px] text-[#A8A29E] font-normal leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* 3. Pricing & Ratings */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-[28px] font-montserrat font-bold text-[#F4F0E8]">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {product.oldPrice && (
            <span className="text-sm sm:text-base font-montserrat line-through text-[#716B63]">
              ₹{product.oldPrice.toLocaleString('en-IN')}
            </span>
          )}

          <span className="bg-[#2A1810] text-[#C85A2E] text-[11px] font-montserrat font-bold px-2 py-0.5 rounded border border-[#C85A2E]/30">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Aggregate Star Rating */}
        <div className="flex items-center gap-2 text-xs sm:text-[13px]">
          <div className="flex items-center text-[#E5A93C]" aria-label="5 star rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[#E5A93C] text-[#E5A93C]"
              />
            ))}
          </div>
          <span className="text-[#F4F0E8] font-semibold">
            {product.rating || 4.8}
          </span>
          <button
            type="button"
            onClick={onScrollToReviews}
            className="text-[#716B63] hover:text-[#C85A2E] transition-colors underline-offset-2 hover:underline cursor-pointer"
          >
            ({product.reviewCount || 124} Reviews)
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-[#242321]" />

      {/* 4. Color Swatches */}
      <div>
        <div className="text-xs sm:text-[13px] font-montserrat font-medium text-[#F4F0E8] mb-2.5">
          Color: <span className="text-[#A8A29E] font-normal">{selectedColor}</span>
        </div>
        <div className="flex items-center gap-2.5" role="radiogroup" aria-label="Available Colors">
          {product.swatches && product.swatches.length > 0 ? (
            product.swatches.map((swatch) => {
              const isSelected = selectedColor.toLowerCase() === swatch.name.toLowerCase();
              return (
                <button
                  key={swatch.name}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={swatch.name}
                  onClick={() => onSelectColor(swatch.name)}
                  style={{ backgroundColor: swatch.hex }}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-white scale-115 ring-2 ring-[#C85A2E] ring-offset-2 ring-offset-[#0B0B0B]'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  title={swatch.name}
                />
              );
            })
          ) : (
            <div
              style={{ backgroundColor: product.color }}
              className="w-6 h-6 rounded-full border border-white"
            />
          )}
        </div>
      </div>

      {/* 5. Size Selector & Size Chart Modal Link */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs sm:text-[13px] font-montserrat font-medium text-[#F4F0E8]">
            Size:
          </span>
          <button
            type="button"
            onClick={onOpenSizeChart}
            className="inline-flex items-center gap-1.5 text-xs text-[#716B63] hover:text-[#C85A2E] transition-colors cursor-pointer"
            aria-label="Open Size Chart Modal"
          >
            <Ruler className="w-3.5 h-3.5 text-[#C85A2E]" />
            <span className="underline underline-offset-2 font-medium">Size Chart</span>
          </button>
        </div>

        {/* Size Chips */}
        <div className="grid grid-cols-6 gap-2" role="radiogroup" aria-label="Select Size">
          {allSizes.map((size) => {
            const isAvailable = product.availableSizes?.includes(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={!isAvailable}
                onClick={() => onSelectSize(size)}
                className={`h-10 rounded-lg text-xs font-montserrat font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C85A2E] text-white shadow-md border-transparent scale-[1.02]'
                    : isAvailable
                    ? 'bg-[#141414] text-[#D9D1C3] border border-[#242321] hover:border-white/30 hover:text-white'
                    : 'bg-[#111] text-[#444] border border-[#1c1c1c] cursor-not-allowed line-through opacity-50'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Quantity Stepper */}
      <div className="flex items-center gap-4">
        <span className="text-xs sm:text-[13px] font-montserrat font-medium text-[#F4F0E8]">
          Quantity:
        </span>
        <div className="inline-flex items-center bg-[#141414] border border-[#242321] rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={onDecrementQuantity}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#716B63] hover:text-[#F4F0E8] hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 sm:w-10 text-center text-xs sm:text-sm font-montserrat font-bold text-[#F4F0E8] select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={onIncrementQuantity}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#716B63] hover:text-[#F4F0E8] hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7. Action Buttons (Add to Cart & Wishlist) */}
      <div className="pt-2 flex items-center gap-3">
        {/* Primary CTA: Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 h-12 sm:h-12.5 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-montserrat font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-lg transition-all duration-200 cursor-pointer hover:shadow-[0_0_20px_rgba(200,90,46,0.4)] active:scale-[0.98]"
        >
          <ShoppingBag className="w-4.5 h-4.5" />
          <span>Add to Cart</span>
        </button>

        {/* Secondary: Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`h-12 sm:h-12.5 px-4 sm:px-5 rounded-xl border flex items-center justify-center gap-2 font-montserrat text-xs font-semibold transition-all duration-200 cursor-pointer active:scale-95 ${
            isWishlisted
              ? 'bg-[#2A1810] border-[#C85A2E] text-[#C85A2E]'
              : 'bg-[#141414] border-[#242321] hover:border-white/30 text-[#D9D1C3] hover:text-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${
              isWishlisted ? 'fill-[#C85A2E] text-[#C85A2E]' : 'text-current'
            }`}
          />
          <span className="hidden sm:inline">Wishlist</span>
        </button>
      </div>

      {/* 8. Trust Indicators (3-column Row Exact Match to Reference) */}
      <div className="pt-4 border-t border-[#242321] grid grid-cols-3 gap-2 text-left">
        <div className="flex items-start gap-2">
          <Truck className="w-4 h-4 text-[#C85A2E] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] sm:text-xs font-montserrat font-bold text-[#F4F0E8]">
              Free Shipping
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#716B63]">
              On orders above ₹1,499
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <RotateCcw className="w-4 h-4 text-[#C85A2E] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] sm:text-xs font-montserrat font-bold text-[#F4F0E8]">
              Easy Returns
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#716B63]">
              7-day hassle free returns
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C85A2E] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-[11px] sm:text-xs font-montserrat font-bold text-[#F4F0E8]">
              Secure Payment
            </div>
            <div className="text-[9px] sm:text-[10px] text-[#716B63]">
              100% safe & encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

