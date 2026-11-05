import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Check, ShoppingBag } from 'lucide-react';
import { DemoProduct } from '../../config/demoContent';
import { paise_to_inr_display } from '../../utils/format';
import {
  VYOMIK_COLOR_PALETTE,
  SwatchColor,
} from '../../config/colorPalette';
import { ColorChartModal } from './ColorChartModal';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: DemoProduct;
  onNotifyProduct: (product: DemoProduct, selectedColor: SwatchColor) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onNotifyProduct,
}) => {
  const navigate = useNavigate();
  const { addItem } = useCart();

  // Default to first available color or Pitch Black
  const initialSwatch =
    VYOMIK_COLOR_PALETTE.find((c) =>
      product.availableColors?.some(
        (ac) => ac.hex.toLowerCase() === c.hex.toLowerCase()
      )
    ) || VYOMIK_COLOR_PALETTE[1]; // Pitch Black

  const [selectedColor, setSelectedColor] = useState<SwatchColor>(initialSwatch);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes.includes('M')
        ? 'M'
        : product.availableSizes[0]
      : 'M'
  );
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  // Check if product has a static pre-rendered image for this color
  const matchedColorKey = product.availableColors?.find(
    (c) => c.hex.toLowerCase() === selectedColor.hex.toLowerCase()
  )?.key;

  const staticImage =
    matchedColorKey && product.images[matchedColorKey]
      ? product.images[matchedColorKey]
      : null;

  // Determine silhouette type for dynamic SVG rendering
  const isHoodie =
    product.category === 'hoodies' || product.slug.includes('hoodie');
  const isSweatshirt =
    product.category === 'sweatshirts' || product.slug.includes('sweatshirt');

  // Quick swatches displayed directly on card:
  const quickSwatches = [
    VYOMIK_COLOR_PALETTE[0], // Crisp White (#FFFFFF)
    VYOMIK_COLOR_PALETTE[1], // Pitch Black (#151515)
    VYOMIK_COLOR_PALETTE[4], // Bottle Green (#003813)
    VYOMIK_COLOR_PALETTE[6], // Crimson Red (#9E0000)
    VYOMIK_COLOR_PALETTE[9], // Marigold Amber (#FF9C00)
    VYOMIK_COLOR_PALETTE[17], // Sky Blue (#97ECFF)
  ];

  const handleAddToCart = () => {
    const matchedVariant = product.variants?.find(
      (v) =>
        v.size === selectedSize &&
        (v.color.toLowerCase() === selectedColor.name.toLowerCase() ||
          v.colorHex?.toLowerCase() === selectedColor.hex.toLowerCase())
    );

    addItem({
      id: `${product.id}-${selectedColor.id}-${selectedSize}`,
      productId: product.id,
      variantId: matchedVariant?.id || `v-${product.id}-${selectedSize}`,
      title: product.name,
      color: selectedColor.name,
      size: selectedSize,
      pricePaise: product.basePricePaise,
      quantity: 1,
      image: staticImage || selectedColor.hex,
    });

    navigate('/bag');
  };

  return (
    <>
      <div className="group border border-[#DAD7CE] bg-white flex flex-col justify-between hover:border-[#202020] transition-colors relative">
        {/* Product Visual Container */}
        <div className="relative aspect-[4/5] bg-[#EAE8E1]/50 border-b border-[#DAD7CE] overflow-hidden flex items-center justify-center">
          {staticImage ? (
            <img
              src={staticImage}
              alt={`${product.name} in ${selectedColor.name}`}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* Dynamic Architectural Garment Vector matching exact chosen hex code */
            <div className="w-full h-full relative flex items-center justify-center p-6 bg-[#F4F3EE] transition-colors duration-300">
              <svg
                viewBox="0 0 600 700"
                className="w-full h-full max-h-[380px] drop-shadow-md transition-all duration-300 group-hover:scale-105"
              >
                {isHoodie ? (
                  /* Hoodie Silhouette */
                  <g transform="translate(100, 95)">
                    {/* Double-layered hood */}
                    <path
                      d="M 140,120 C 130,50 270,50 260,120 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(0,0,0,0.3)'}
                      strokeWidth="2"
                    />
                    <path
                      d="M 160,115 C 160,75 240,75 240,115 Z"
                      fill={selectedColor.isLight ? '#E5E2D8' : 'rgba(0,0,0,0.2)'}
                    />
                    {/* Body & Dropped Sleeves */}
                    <path
                      d="M 50,135 L 130,120 Q 200,135 270,120 L 350,135 L 375,320 L 315,335 L 305,240 L 310,430 L 90,430 L 95,240 L 85,335 L 25,320 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(0,0,0,0.25)'}
                      strokeWidth="2"
                    />
                    {/* Kangaroo Pouch */}
                    <path
                      d="M 140,320 L 260,320 L 275,395 L 125,395 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(0,0,0,0.2)'}
                      strokeWidth="2"
                    />
                    {/* Drawstrings */}
                    <path
                      d="M 185,120 L 185,190 M 215,120 L 215,185"
                      stroke={selectedColor.isLight ? '#202020' : '#F4F3EE'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Ribbed Hem & Cuffs */}
                    <line x1="90" y1="420" x2="310" y2="420" stroke={selectedColor.isLight ? '#C5C1B6' : 'rgba(0,0,0,0.3)'} strokeWidth="1.5" />
                  </g>
                ) : isSweatshirt ? (
                  /* Crewneck Sweatshirt Silhouette */
                  <g transform="translate(100, 110)">
                    {/* Crewneck Collar Band */}
                    <path
                      d="M 155,100 Q 200,128 245,100 Q 200,138 155,100 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#202020' : '#EAE8E1'}
                      strokeWidth="3"
                    />
                    {/* Sweatshirt Triangle V-insert */}
                    <polygon
                      points="190,120 210,120 200,138"
                      fill="none"
                      stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(255,255,255,0.25)'}
                      strokeWidth="1.5"
                    />
                    {/* Torso & Sleeves */}
                    <path
                      d="M 60,118 L 155,100 Q 200,130 245,100 L 340,118 L 365,300 L 305,312 L 295,225 L 300,410 L 100,410 L 105,225 L 95,312 L 35,300 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(0,0,0,0.25)'}
                      strokeWidth="2"
                    />
                    {/* Ribbed Cuffs & Waistband */}
                    <line x1="100" y1="400" x2="300" y2="400" stroke={selectedColor.isLight ? '#C5C1B6' : 'rgba(0,0,0,0.3)'} strokeWidth="1.5" />
                  </g>
                ) : (
                  /* Oversized Boxy Tee Silhouette */
                  <g transform="translate(100, 110)">
                    {/* Dense Ribbed Neckband */}
                    <path
                      d="M 150,95 Q 200,130 250,95 Q 200,140 150,95 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#202020' : '#EAE8E1'}
                      strokeWidth="2.5"
                    />
                    {/* Boxy Body with Dropped Shoulders */}
                    <path
                      d="M 50,115 L 150,95 Q 200,130 250,95 L 350,115 L 370,265 L 315,275 L 305,200 L 308,415 L 92,415 L 95,200 L 85,275 L 30,265 Z"
                      fill={selectedColor.hex}
                      stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(0,0,0,0.2)'}
                      strokeWidth="2"
                    />
                    {/* Clean double-stitched hem */}
                    <line x1="92" y1="405" x2="308" y2="405" stroke={selectedColor.isLight ? '#DAD7CE' : 'rgba(255,255,255,0.15)'} strokeWidth="1" strokeDasharray="4 2" />
                  </g>
                )}
              </svg>

              {/* Minimal Brand Tag */}
              <div
                className="absolute top-4 left-4 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] uppercase border transition-colors"
                style={{
                  backgroundColor: selectedColor.isLight ? '#202020' : '#F4F3EE',
                  color: selectedColor.isLight ? '#F4F3EE' : '#202020',
                  borderColor: selectedColor.isLight ? '#202020' : '#DAD7CE',
                }}
              >
                VYOMIK
              </div>
            </div>
          )}

          {/* Color Chart Launcher Button overlaid on bottom-right of image */}
          <button
            type="button"
            onClick={() => setIsChartModalOpen(true)}
            aria-label={`Open color chart for ${product.name}`}
            className="absolute bottom-2.5 right-2.5 bg-white/95 hover:bg-white text-[#202020] text-[10px] uppercase font-semibold tracking-wider px-2.5 py-1.5 border border-[#DAD7CE] shadow-sm flex items-center space-x-1.5 transition-all hover:border-[#202020] active:scale-95"
          >
            <Palette className="w-3.5 h-3.5 text-[#5C6548]" />
            <span>Color Chart</span>
          </button>
        </div>

        {/* Card Details Body */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 min-h-[220px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5C6548]">
                {product.categoryLabel}
              </span>
              {/* Active Color Indicator */}
              <span className="text-[10px] font-medium uppercase tracking-wider text-[#202020]/70 flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="truncate max-w-[110px]">{selectedColor.name}</span>
              </span>
            </div>

            <h3 className="text-base font-semibold text-[#202020] mt-1.5 leading-snug">
              {product.name}
            </h3>

            <p className="text-xs text-[#202020]/70 mt-1 line-clamp-2">
              {product.headline}
            </p>

            {/* Quick Interactive Swatches Bar */}
            <div className="mt-3.5 pt-3 border-t border-[#DAD7CE]/50 flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {quickSwatches.map((swatch) => {
                  const isSelected =
                    swatch.hex.toLowerCase() === selectedColor.hex.toLowerCase();
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      onClick={() => setSelectedColor(swatch)}
                      title={`${swatch.name} (${swatch.hex})`}
                      aria-label={`Change color to ${swatch.name}`}
                      className={`w-5 h-5 rounded-md transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#202020] flex items-center justify-center ${
                        swatch.isLight ? 'border border-[#DAD7CE]' : 'border-transparent'
                      } ${
                        isSelected
                          ? 'ring-2 ring-[#202020] ring-offset-1 scale-110'
                          : 'hover:scale-115'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-3 h-3 stroke-[3] ${
                            swatch.isLight ? 'text-[#202020]' : 'text-white'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* View 19 Colors Link */}
              <button
                type="button"
                onClick={() => setIsChartModalOpen(true)}
                className="text-[10px] font-semibold uppercase tracking-wider text-[#5C6548] hover:text-[#202020] underline underline-offset-2 ml-2 shrink-0"
              >
                +13 Colors
              </button>
            </div>

            {/* Size Selector Pills */}
            <div className="mt-3 pt-2.5 border-t border-[#DAD7CE]/50 flex items-center justify-between">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#202020]/70">
                Size:
              </span>
              <div className="flex items-center space-x-1">
                {(product.availableSizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`text-[10px] px-2 py-0.5 font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#202020] text-[#F4F3EE]'
                          : 'bg-[#F4F3EE] text-[#202020] hover:bg-[#EAE8E1]'
                      } border border-[#DAD7CE]`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pricing & Add to Cart Action */}
          <div className="pt-3.5 mt-3.5 border-t border-[#DAD7CE]/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-[#202020]">
                {paise_to_inr_display(product.basePricePaise)}
              </span>
              <button
                type="button"
                onClick={() => onNotifyProduct(product, selectedColor)}
                className="text-[10px] font-medium uppercase tracking-wider text-[#5C6548] hover:text-[#202020] underline underline-offset-2 focus-visible:outline-none"
              >
                Waitlist ↗
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-[#202020] text-[#F4F3EE] py-2.5 px-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#333333] active:scale-[0.99] transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* 19-Color Chart Modal */}
      <ColorChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        productName={product.name}
        selectedHex={selectedColor.hex}
        onSelectColor={(color) => setSelectedColor(color)}
      />
    </>
  );
};
