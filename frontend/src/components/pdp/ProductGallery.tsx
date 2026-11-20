import React from 'react';
import { Play } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  activeIndex: number;
  onSelectImage: (index: number) => void;
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  activeIndex,
  onSelectImage,
  productName,
}) => {
  return (
    <div
      className="flex flex-row lg:flex-col gap-2.5 sm:gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none"
      role="tablist"
      aria-label="Product image thumbnails"
    >
      {images.map((imgSrc, index) => {
        const isSelected = activeIndex === index;
        const isVideoTile = index === 4; // 5th item is the video preview

        return (
          <button
            key={imgSrc + index}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-label={`${productName} thumbnail ${index + 1}`}
            onClick={() => onSelectImage(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectImage(index);
              }
            }}
            className={`relative flex-shrink-0 w-16 sm:w-20 lg:w-[84px] aspect-[4/5] rounded-xl overflow-hidden bg-[#141414] transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A2E] ${
              isSelected
                ? 'border-2 border-[#C85A2E] shadow-[0_0_12px_rgba(200,90,46,0.35)] scale-[1.02]'
                : 'border border-[#242321] hover:border-white/30 opacity-80 hover:opacity-100'
            }`}
          >
            <img
              src={imgSrc}
              alt={`${productName} view ${index + 1}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />

            {/* Glowing play icon overlay for video thumbnail tile */}
            {isVideoTile && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 border border-white/40 flex items-center justify-center text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
                  <Play className="w-3.5 h-3.5 ml-0.5 fill-white text-white" />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

