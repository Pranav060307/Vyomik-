import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStoreConfig } from '../../hooks/useStoreConfig';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../../config/brand';
import { InstagramIcon } from '../common/InstagramIcon';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWaitlist: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  onClose,
  onOpenWaitlist,
}) => {
  const { data: config } = useStoreConfig();
  const isComingSoon = config?.store_mode === 'coming_soon';

  // Keyboard navigation: Escape key closes the drawer
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="fixed inset-y-0 right-0 max-w-full flex pl-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-screen max-w-md bg-[#F4F3EE] border-l border-[#DAD7CE] flex flex-col justify-between shadow-2xl">
          {/* Drawer Header */}
          <div className="px-6 py-6 border-b border-[#DAD7CE] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#202020]" />
              <h2 className="text-sm uppercase font-semibold tracking-[0.2em] text-[#202020]">
                Your Bag
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-[#202020] hover:opacity-60 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[#202020]"
              aria-label="Close bag drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center text-center">
            {isComingSoon ? (
              <div className="space-y-4 max-w-xs">
                <div className="w-12 h-12 border border-[#DAD7CE] flex items-center justify-center mx-auto text-[#5C6548]">
                  <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#5C6548] block">
                  COMING SOON · STORE LAUNCH
                </span>
                <h3 className="text-xl font-semibold text-[#202020]">
                  Cart opens 8 November 2026.
                </h3>
                <p className="text-xs text-[#202020]/70 leading-relaxed">
                  Our first drop is being crafted. Get notified first and enjoy reserved launch pricing.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenWaitlist();
                    }}
                    className="w-full bg-[#202020] text-[#F4F3EE] py-3.5 text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#333333] transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Join Launch Waitlist</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[#202020]/70">Your shopping bag is currently empty.</p>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-6 border-t border-[#DAD7CE] bg-[#FAF9F6] text-center space-y-2.5">
            <p className="text-[11px] uppercase tracking-wider text-[#5C6548] font-medium">
              Free shipping across India on orders over ₹1,499
            </p>
            <div className="flex items-center justify-center space-x-4 text-[11px] text-[#202020]/70 pt-1">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on Instagram"
                className="inline-flex items-center space-x-1 hover:text-[#5C6548] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-current" />
                <span>{instagramHandle} ↗</span>
              </a>
              <span className="text-[#DAD7CE]">·</span>
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="hover:text-[#5C6548] transition-colors lowercase"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

