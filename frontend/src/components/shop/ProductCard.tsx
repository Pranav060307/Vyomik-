import React, { useState } from 'react';
import { ClothPreview } from '../common/ClothPreview';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export interface ProductItem {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  category?: 'plain' | 'wordmark' | 'hoodies' | string;
  type?: 'tee' | 'hoodie' | 'rack' | string;
  color?: string;
  logo?: number | string;
  img?: string;
  fabricFit?: string;
  swatches?: string[];
  hasMore?: boolean;
}

interface ProductCardProps {
  product: ProductItem;
  variant?: 'homeGrid' | 'newArrivals';
  className?: string;
  style?: React.CSSProperties;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = 'homeGrid',
  className = '',
  style,
}) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [isLiked, setIsLiked] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.color || '#d9c3ad');

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isLiked;
    setIsLiked(nextState);
    toast(nextState ? 'Added to wishlist' : 'Removed from wishlist');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      pricePaise: product.price * 100,
      type: product.type || 'tee',
      color: selectedColor,
      logo: product.logo || '0',
      img: product.img || '',
      quantity: 1,
    });
    toast(`${product.name} added to bag`);
  };

  // Heart SVG icon
  const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill={isLiked ? '#e10600' : 'none'} stroke={isLiked ? '#e10600' : 'currentColor'} strokeWidth="1.8" className="w-full h-full">
      <path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z" />
    </svg>
  );

  const fallbackImg = product.type === 'hoodie'
    ? 'assets/essential-hoodie.png'
    : (product.logo === 1 || product.logo === '1' || product.category === 'wordmark')
    ? 'assets/vyomik-logo-tee.png'
    : 'assets/oversized-basic-tee.png';

  if (variant === 'newArrivals') {
    const defaultSwatches = product.type === 'hoodie'
      ? ['#a81818', '#111111', '#ffffff', '#3a2a1e']
      : (product.logo === 1 || product.logo === '1' || product.category === 'wordmark')
      ? ['#111111', '#ffffff', '#e10600', '#3a2a1e']
      : ['#d9c3ad', '#111111', '#e10600', '#ffffff', '#3a2a1e'];

    const swatches = product.swatches && product.swatches.length > 0 ? product.swatches : defaultSwatches;

    return (
      <div
        style={style}
        className={`card w-[590px] h-[820px] rounded-[26px] border-[1.5px] border-white/30 bg-[radial-gradient(400px_300px_at_50%_28%,#3a3026,#0a0807_70%)] absolute overflow-hidden px-[36px] select-none ${className}`}
      >
        {/* NEW Badge */}
        <span
          className="badge absolute left-[28px] top-[30px] bg-[#e10600] font-extrabold text-[25px] py-[12px] pr-[30px] pl-[20px] text-white z-10 leading-none select-none"
          style={{ clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)' }}
        >
          NEW
        </span>

        {/* Wishlist Heart */}
        <span
          onClick={handleHeartClick}
          className={`heart ico absolute right-[34px] top-[34px] w-[44px] h-[44px] cursor-pointer text-white hover:text-[#e10600] transition-colors z-10 ${
            isLiked ? 'liked' : ''
          }`}
          role="button"
          aria-label="Wishlist"
        >
          <HeartIcon />
        </span>

        {/* Clothing Image / SVG with fallback */}
        <ClothPreview
          type={product.type || 'tee'}
          color={selectedColor}
          hasLogo={product.logo}
          img={product.img || fallbackImg}
          alt={product.name}
          className="absolute left-[30px] right-[30px] top-[70px] h-[400px]"
        />

        {/* Title */}
        <h3 className="absolute left-[36px] top-[470px] text-[32px] font-bold text-white tracking-tight truncate max-w-[518px]">
          {product.name}
        </h3>

        {/* Meta / Fit */}
        <div className="meta absolute left-[36px] top-[528px] text-[24px] text-[#aaa] font-medium truncate max-w-[518px]">
          {product.fabricFit || 'Premium Cotton \u00a0|\u00a0 Relaxed Fit'}
        </div>

        {/* Price */}
        <div className="price absolute left-[36px] top-[600px] text-[44px] font-extrabold text-[#e10600] flex items-baseline leading-none">
          ₹{product.price.toLocaleString('en-IN')}
          {product.oldPrice && (
            <s className="text-[28px] font-medium text-[#999] ml-[22px]">
              ₹{product.oldPrice.toLocaleString('en-IN')}
            </s>
          )}
        </div>

        {/* Swatches */}
        <div className="sw absolute left-[36px] top-[660px] flex gap-[16px] items-center">
          {swatches.map((swColor, idx) => (
            <i
              key={swColor + idx}
              onClick={() => setSelectedColor(swColor)}
              style={{ background: swColor }}
              className={`w-[44px] h-[44px] rounded-full border-2 border-[#555] block transition-transform hover:scale-110 cursor-pointer ${
                selectedColor === swColor ? 'on border-white shadow-[0_0_0_3px_#000_inset]' : ''
              }`}
            />
          ))}
          {product.hasMore && <em className="not-italic text-[#aaa] text-[24px] ml-1">+1</em>}
        </div>

        {/* Add To Cart Button */}
        <div
          onClick={handleAddToCart}
          className="btn absolute left-[30px] right-[30px] top-[728px] h-[70px] bg-gradient-to-b from-[#e10600] to-[#a30000] rounded-[10px] font-extrabold text-[30px] text-white flex justify-center items-center gap-[20px] cursor-pointer hover:brightness-125 active:scale-[0.98] transition-all select-none"
          role="button"
        >
          <span className="ico w-[44px] h-[44px]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-full h-full">
              <path d="M2 3h3l3 12h11l2-8H6" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
          </span>
          ADD TO CART
        </div>
      </div>
    );
  }

  // Home Grid Compact Card (variant === 'homeGrid')
  return (
    <div
      style={style}
      className={`pc ${className}`}
    >
      {/* FIRST DROP Badge */}
      <span className="fd">FIRST DROP</span>

      {/* Wishlist Heart */}
      <span
        onClick={handleHeartClick}
        className={`ico hrt ${isLiked ? 'liked' : ''}`}
        role="button"
        aria-label="Wishlist"
      >
        <svg viewBox="0 0 24 24" fill={isLiked ? '#e10600' : 'none'} stroke={isLiked ? '#e10600' : 'currentColor'} strokeWidth="1.8">
          <path d="M12 21s-8-5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 6-8 11-8 11z" />
        </svg>
      </span>

      {/* Garment Preview with fallback */}
      <ClothPreview
        type={product.type || 'tee'}
        color={product.color || '#d9c3ad'}
        hasLogo={product.logo}
        img={product.img}
        alt={product.name}
      />

      {/* Title */}
      <h4>{product.name}</h4>

      {/* Price */}
      <div className="pp">
        ₹{product.price.toLocaleString('en-IN')}
        {product.oldPrice && <s>₹{product.oldPrice.toLocaleString('en-IN')}</s>}
      </div>

      {/* ADD TO CART button */}
      <div
        onClick={handleAddToCart}
        className="add"
        role="button"
      >
        ADD TO CART
      </div>
    </div>
  );
};
