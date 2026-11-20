import React, { useEffect, useState } from 'react';
import { X, Check, Palette, Image as ImageIcon } from 'lucide-react';
import {
  VYOMIK_COLOR_PALETTE,
  SwatchColor,
  COLOR_CHART_IMAGE_URL,
} from '../../config/colorPalette';

interface ColorChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  selectedHex: string;
  onSelectColor: (color: SwatchColor) => void;
}

export const ColorChartModal: React.FC<ColorChartModalProps> = ({
  isOpen,
  onClose,
  productName,
  selectedHex,
  onSelectColor,
}) => {
  const [hoveredColor, setHoveredColor] = useState<SwatchColor | null>(null);
  const [showOriginalChart, setShowOriginalChart] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentColor =
    VYOMIK_COLOR_PALETTE.find(
      (c) => c.hex.toLowerCase() === selectedHex.toLowerCase()
    ) ||
    hoveredColor ||
    VYOMIK_COLOR_PALETTE[0];

  const activeDisplayColor = hoveredColor || currentColor;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="color-chart-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#141414] border border-[#242321] rounded-2xl shadow-2xl p-6 sm:p-8 animate-scaleIn text-[#F4F0E8] max-h-[90vh] overflow-y-auto scrollbar-none"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close color chart"
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-[#0B0B0B] border border-[#242321] text-[#716B63] hover:text-[#F4F0E8] hover:border-white/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#242321] pb-4 mb-6">
          <div className="flex items-center space-x-2 mb-1.5">
            <Palette className="w-4 h-4 text-[#C85A2E]" />
            <span className="text-[10px] font-montserrat font-bold uppercase tracking-[0.24em] text-[#C85A2E]">
              OFFICIAL SHADE PALETTE · 19 COLORS
            </span>
          </div>
          <h2
            id="color-chart-title"
            className="text-2xl sm:text-3xl font-montserrat font-extrabold tracking-tight text-[#F4F0E8]"
          >
            Garment Color Chart
          </h2>
          <p className="text-xs sm:text-sm text-[#716B63] mt-1 font-montserrat">
            Choose any custom shade for <span className="font-semibold text-[#F4F0E8]">{productName}</span>.
          </p>
        </div>

        {/* Selected / Hovered Color Banner */}
        <div className="bg-[#0B0B0B] border border-[#242321] rounded-xl p-4 mb-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div
              className="w-10 h-10 rounded-lg border border-[#242321] shadow-inner transition-transform duration-200"
              style={{ backgroundColor: activeDisplayColor.hex }}
            />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#716B63] font-montserrat">
                Selected Shade
              </p>
              <h4 className="text-base font-bold text-[#F4F0E8] leading-snug font-montserrat">
                {activeDisplayColor.name}{' '}
                <span className="text-xs font-mono font-normal text-[#716B63] ml-1">
                  ({activeDisplayColor.hex})
                </span>
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOriginalChart(!showOriginalChart)}
            className="inline-flex items-center space-x-1.5 text-[11px] font-montserrat font-medium uppercase tracking-wider text-[#C85A2E] hover:text-[#F4F0E8] underline underline-offset-4 cursor-pointer transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{showOriginalChart ? 'Hide Reference' : 'Original Reference'}</span>
          </button>
        </div>

        {/* Original Reference Image Preview */}
        {showOriginalChart && (
          <div className="mb-6 p-3 bg-[#0B0B0B] border border-[#242321] rounded-xl animate-fadeIn">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#716B63] mb-2 font-montserrat">
              Color Chart Reference Sheet:
            </p>
            <img
              src={COLOR_CHART_IMAGE_URL}
              alt="Official VYOMIK Garment Color Chart"
              className="w-full h-auto object-contain rounded-lg border border-[#242321]"
            />
          </div>
        )}

        {/* Interactive 3-Row Color Swatch Grid */}
        <div className="space-y-4 bg-[#0B0B0B] p-5 sm:p-6 border border-[#242321] rounded-xl">
          {[1, 2, 3].map((rowNum) => {
            const rowColors = VYOMIK_COLOR_PALETTE.filter((c) => c.row === rowNum);
            return (
              <div key={rowNum} className="flex flex-wrap items-center gap-3 sm:gap-4">
                {rowColors.map((color) => {
                  const isSelected =
                    color.hex.toLowerCase() === selectedHex.toLowerCase();
                  const isWhiteFirstSwatch = color.id === 'pure-white';

                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        onSelectColor(color);
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredColor(color)}
                      onMouseLeave={() => setHoveredColor(null)}
                      title={`${color.name} (${color.hex})`}
                      aria-label={`Select color ${color.name} (${color.hex})`}
                      className={`relative group w-11 h-11 sm:w-12 sm:h-12 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A2E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414] cursor-pointer ${
                        isWhiteFirstSwatch
                          ? 'rounded-full shadow-md'
                          : 'rounded-xl shadow-xs'
                      } ${
                        isSelected
                          ? 'ring-2 ring-[#C85A2E] ring-offset-2 ring-offset-[#0B0B0B] scale-105'
                          : 'hover:scale-110 hover:shadow-md'
                      } ${color.isLight ? 'border border-[#333]' : 'border border-[#242321]'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center ${
                            color.isLight ? 'text-black' : 'text-white'
                          }`}
                        >
                          <Check className="w-5 h-5 stroke-[2.5] drop-shadow-sm" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#716B63] pt-4 border-t border-[#242321] gap-3 font-montserrat">
          <p className="text-[11px] uppercase tracking-wider text-[#716B63]">
            Click any shade to apply it instantly to this garment card.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#C85A2E] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#A64B2A] transition-all cursor-pointer shadow-md active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
