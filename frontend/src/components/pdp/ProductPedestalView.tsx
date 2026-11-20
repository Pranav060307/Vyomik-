import React, { useState } from 'react';
import { Maximize2, Play } from 'lucide-react';

interface ProductPedestalViewProps {
  activeImage: string;
  productName: string;
  isVideo?: boolean;
  onOpenLightbox: () => void;
}

export const ProductPedestalView: React.FC<ProductPedestalViewProps> = ({
  activeImage,
  productName,
  isVideo = false,
  onOpenLightbox,
}) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] lg:aspect-[4/5] max-h-[640px] rounded-2xl overflow-hidden bg-[#0F0F0E] border border-[#242321] group flex items-center justify-center">
      {/* Main Product Showcase Image */}
      <img
        key={activeImage}
        src={activeImage}
        alt={productName}
        className="w-full h-full object-cover object-center select-none transition-opacity duration-300 animate-fadeIn cursor-zoom-in"
        onClick={onOpenLightbox}
        loading="eager"
      />

      {/* Video Overlay if Video Tile is active */}
      {isVideo && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
            aria-label="Play product video"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#C85A2E]/90 hover:bg-[#C85A2E] text-white flex items-center justify-center shadow-[0_0_30px_rgba(200,90,46,0.8)] transition-transform duration-300 hover:scale-110 cursor-pointer"
          >
            <Play className="w-8 h-8 ml-1 fill-white text-white" />
          </button>
        </div>
      )}

      {/* Bottom Right Fullscreen Lightbox Trigger Button */}
      <button
        type="button"
        onClick={onOpenLightbox}
        aria-label="View full screen image"
        title="View Fullscreen"
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-black/70 hover:bg-[#141414] border border-[#242321] hover:border-white/40 text-white/80 hover:text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
      >
        <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>
    </div>
  );
};

