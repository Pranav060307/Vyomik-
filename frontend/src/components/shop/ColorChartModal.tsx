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
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#F4F3EE] border border-[#202020] shadow-2xl p-6 sm:p-8 animate-scaleIn text-[#202020] max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close color chart"
          className="absolute top-5 right-5 p-1.5 text-[#202020]/70 hover:text-[#202020] hover:bg-[#EAE8E1] transition-colors focus:outline-none"
        >
          <X className="w-5 h-5 stroke-[1.5]" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#DAD7CE] pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4 text-[#5C6548]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
              OFFICIAL SHADE PALETTE · 19 COLORS
            </span>
          </div>
          <h2
            id="color-chart-title"
            className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#202020] mt-1"
          >
            Garment Color Chart
          </h2>
          <p className="text-xs sm:text-sm text-[#202020]/70 mt-1">
            Choose any custom shade for <span className="font-semibold text-[#202020]">{productName}</span>.
          </p>
        </div>

        {/* Selected / Hovered Color Banner */}
        <div className="bg-white border border-[#DAD7CE] p-4 mb-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-9 h-9 rounded-md border shadow-inner transition-transform duration-200 ${
                activeDisplayColor.isLight ? 'border-[#DAD7CE]' : 'border-transparent'
              }`}
              style={{ backgroundColor: activeDisplayColor.hex }}
            />
            <div>
              <p className="text-xs uppercase font-medium tracking-wider text-[#202020]/60">
                Selected Shade
              </p>
              <h4 className="text-base font-semibold text-[#202020] leading-snug">
                {activeDisplayColor.name}{' '}
                <span className="text-xs font-mono font-normal text-[#202020]/60 ml-1">
                  ({activeDisplayColor.hex})
                </span>
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowOriginalChart(!showOriginalChart)}
            className="inline-flex items-center space-x-1.5 text-[11px] font-medium uppercase tracking-wider text-[#5C6548] hover:text-[#202020] underline underline-offset-4"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{showOriginalChart ? 'Hide Reference' : 'Original Reference'}</span>
          </button>
        </div>

        {/* Original Reference Image Preview */}
        {showOriginalChart && (
          <div className="mb-6 p-3 bg-white border border-[#DAD7CE] animate-fadeIn">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-[#202020]/60 mb-2">
              Color Chart Reference Sheet:
            </p>
            <img
              src={COLOR_CHART_IMAGE_URL}
              alt="Official VYOMIK Garment Color Chart"
              className="w-full h-auto object-contain border border-[#EAE8E1]"
            />
          </div>
        )}

        {/* Interactive 3-Row Color Swatch Grid (Matches uploaded chart format) */}
        <div className="space-y-4 bg-white p-5 sm:p-6 border border-[#DAD7CE]">
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
                      className={`relative group w-11 h-11 sm:w-12 sm:h-12 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] focus-visible:ring-offset-2 ${
                        isWhiteFirstSwatch
                          ? 'rounded-full shadow-md'
                          : 'rounded-xl shadow-xs'
                      } ${
                        isSelected
                          ? 'ring-3 ring-[#202020] ring-offset-2 scale-105'
                          : 'hover:scale-110 hover:shadow-md'
                      } ${color.isLight ? 'border border-[#DAD7CE]' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSelected && (
                        <span
                          className={`absolute inset-0 flex items-center justify-center ${
                            color.isLight ? 'text-[#202020]' : 'text-white'
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
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#202020]/70 pt-4 border-t border-[#DAD7CE] gap-3">
          <p className="text-[11px] uppercase tracking-wider text-[#202020]/60">
            Click any shade to apply it instantly to this garment card.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto bg-[#202020] text-[#F4F3EE] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#333333] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
