import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { HOODIE_SIZE_CHART, MEASUREMENT_INSTRUCTIONS } from '../../config/sizeChartData';

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="size-chart-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#141414] border border-[#242321] rounded-2xl shadow-2xl p-5 sm:p-7 text-left max-h-[90vh] overflow-y-auto scrollbar-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Title, Unit Switcher & Close Button */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242321]">
          <h2
            id="size-chart-title"
            className="text-lg sm:text-xl font-montserrat font-bold text-[#F4F0E8]"
          >
            Size Chart
          </h2>

          <div className="flex items-center gap-4">
            {/* Unit Toggle: [ in | cm ] */}
            <div
              className="inline-flex items-center p-0.5 rounded-lg bg-[#0B0B0B] border border-[#242321]"
              role="radiogroup"
              aria-label="Measurement units"
            >
              <button
                type="button"
                role="radio"
                aria-checked={unit === 'in'}
                onClick={() => setUnit('in')}
                className={`px-3 py-1 text-xs font-montserrat font-bold rounded-md transition-all cursor-pointer ${
                  unit === 'in'
                    ? 'bg-[#C85A2E] text-white shadow-sm'
                    : 'text-[#716B63] hover:text-[#F4F0E8]'
                }`}
              >
                in
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={unit === 'cm'}
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 text-xs font-montserrat font-bold rounded-md transition-all cursor-pointer ${
                  unit === 'cm'
                    ? 'bg-[#C85A2E] text-white shadow-sm'
                    : 'text-[#716B63] hover:text-[#F4F0E8]'
                }`}
              >
                cm
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close size chart"
              className="w-8 h-8 rounded-lg bg-[#0B0B0B] border border-[#242321] text-[#716B63] hover:text-[#F4F0E8] hover:border-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Measurement Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-montserrat">
            <thead>
              <tr className="border-b border-[#242321] text-[#716B63] font-semibold">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Chest</th>
                <th className="py-2.5 px-3">Length</th>
                <th className="py-2.5 px-3">Shoulder</th>
                <th className="py-2.5 px-3">Sleeve</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242321]/50 text-[#F4F0E8]">
              {HOODIE_SIZE_CHART.map((row) => (
                <tr
                  key={row.size}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-[#C85A2E]">
                    {row.size}
                  </td>
                  <td className="py-2.5 px-3 text-[#D9D1C3]">
                    {unit === 'cm' ? row.chestCm : row.chestIn}
                  </td>
                  <td className="py-2.5 px-3 text-[#D9D1C3]">
                    {unit === 'cm' ? row.lengthCm : row.lengthIn}
                  </td>
                  <td className="py-2.5 px-3 text-[#D9D1C3]">
                    {unit === 'cm' ? row.shoulderCm : row.shoulderIn}
                  </td>
                  <td className="py-2.5 px-3 text-[#D9D1C3]">
                    {unit === 'cm' ? row.sleeveCm : row.sleeveIn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Hoodie Diagram & How to Measure Split */}
        <div className="mt-7 pt-6 border-t border-[#242321] grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Left: Vector Technical Flat Drawing of Hoodie */}
          <div className="flex flex-col items-center justify-center bg-[#0B0B0B] border border-[#242321] rounded-xl p-4 sm:p-5 relative">
            <svg
              viewBox="0 0 200 180"
              className="w-48 sm:w-56 h-auto stroke-[#D9D1C3] fill-none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Hoodie Body Outline */}
              <path d="M 60 40 Q 100 20 140 40 L 175 75 L 155 95 L 140 80 L 140 160 L 60 160 L 60 80 L 45 95 L 25 75 Z" />
              {/* Hood */}
              <path d="M 75 40 Q 100 15 125 40" stroke="#716B63" strokeDasharray="2 2" />
              {/* Kangaroo Pocket */}
              <path d="M 75 120 L 125 120 L 130 150 L 70 150 Z" stroke="#716B63" />

              {/* Measurement Annotations (Burnt Rust/Orange) */}
              {/* Shoulder Arrow */}
              <line x1="50" y1="42" x2="150" y2="42" stroke="#C85A2E" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="100" y="38" fill="#C85A2E" fontSize="8" textAnchor="middle" fontWeight="bold">
                Shoulder
              </text>

              {/* Chest Arrow */}
              <line x1="60" y1="90" x2="140" y2="90" stroke="#C85A2E" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="100" y="86" fill="#C85A2E" fontSize="8" textAnchor="middle" fontWeight="bold">
                Chest
              </text>

              {/* Length Arrow */}
              <line x1="52" y1="45" x2="52" y2="160" stroke="#C85A2E" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="42" y="105" fill="#C85A2E" fontSize="8" textAnchor="middle" transform="rotate(-90 42 105)" fontWeight="bold">
                Length
              </text>

              {/* Sleeve Arrow */}
              <line x1="140" y1="45" x2="175" y2="78" stroke="#C85A2E" strokeWidth="1.5" strokeDasharray="3 2" />
              <text x="168" y="58" fill="#C85A2E" fontSize="8" textAnchor="middle" fontWeight="bold">
                Sleeve
              </text>
            </svg>
          </div>

          {/* Right: How to Measure Checklist */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-montserrat font-bold text-[#F4F0E8] uppercase tracking-wider mb-2">
              How to Measure
            </h3>

            {MEASUREMENT_INSTRUCTIONS.map((item) => (
              <div key={item.label} className="flex items-start gap-2.5 text-xs text-[#D9D1C3]">
                <Check className="w-3.5 h-3.5 text-[#C85A2E] flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F4F0E8] font-bold">{item.label}:</strong>{' '}
                  <span className="text-[#A8A29E]">{item.instruction}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

