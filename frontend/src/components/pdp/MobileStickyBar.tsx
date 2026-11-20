import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { ShopProduct } from '../../config/shopProducts';

interface MobileStickyBarProps {
  product: ShopProduct;
  selectedSize: string;
  onAddToCart: () => void;
  visible: boolean;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({
  product,
  selectedSize,
  onAddToCart,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-[#242321] px-4 py-3 flex items-center justify-between shadow-2xl animate-slideUp">
      <div className="flex items-center gap-3">
        <img
          src={product.primaryImage}
          alt={product.name}
          className="w-10 h-12 object-cover rounded-md border border-[#242321]"
        />
        <div className="text-left">
          <div className="text-xs font-montserrat font-bold text-[#F4F0E8] truncate max-w-[140px] sm:max-w-[200px]">
            {product.name}
          </div>
          <div className="text-xs font-montserrat font-semibold text-[#C85A2E]">
            ₹{product.price.toLocaleString('en-IN')}{' '}
            <span className="text-[#716B63] font-normal">({selectedSize})</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        className="h-10 px-5 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-montserrat font-bold text-xs tracking-wide flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>Add to Bag</span>
      </button>
    </div>
  );
};

