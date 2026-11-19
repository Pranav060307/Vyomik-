import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ClothPreview } from '../common/ClothPreview';

export interface BagDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenWaitlist?: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const { items, removeItem, updateQuantity, clearCart, isBagOpen: contextIsBagOpen, closeBag: contextCloseBag, subtotalRupees } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isBagOpen = propIsOpen !== undefined ? propIsOpen : contextIsBagOpen;
  const closeBag = propOnClose || contextCloseBag;

  const handleCheckout = () => {
    if (!items.length) {
      toast('Your bag is empty');
      return;
    }
    if (!user) {
      toast('Please sign in to checkout');
      closeBag();
      setTimeout(() => {
        navigate('/sign-in');
      }, 900);
      return;
    }
    clearCart();
    closeBag();
    toast('Order placed (demo). Thank you!');
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={closeBag}
        className={`fixed inset-0 bg-black/65 z-50 transition-opacity duration-300 ${
          isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 bottom-0 right-0 w-[90vw] sm:w-[560px] max-w-full bg-[#0b0b0b] border-l-[3px] border-[#e10600] z-50 transition-all duration-350 flex flex-col ${
          isBagOpen
            ? 'translate-x-0 opacity-100 visible pointer-events-auto'
            : 'translate-x-full opacity-0 invisible pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Your Bag"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-8 md:px-10 py-7 md:py-[34px] border-b border-[#333] text-[24px] md:text-[28px] tracking-[0.3em] font-bold">
          <b>YOUR BAG</b>
          <span
            onClick={closeBag}
            className="cursor-pointer text-[28px] md:text-[30px] hover:text-[#e10600] transition-colors leading-none"
            role="button"
            aria-label="Close bag drawer"
          >
            ✕
          </span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-8 md:px-10 py-4">
          {!items.length ? (
            <p className="text-center text-[#999] text-[20px] md:text-[24px] mt-20">
              Your bag is empty.
            </p>
          ) : (
            items.map((item, idx) => (
              <div
                key={item.id + idx}
                className="flex gap-[22px] items-center py-[22px] border-b border-[#222] relative"
              >
                {/* Garment Thumbnail */}
                <div className="w-[110px] md:w-[130px] h-[110px] md:h-[130px] shrink-0 bg-[#151210] rounded-[10px] p-2 flex items-center justify-center">
                  <ClothPreview
                    type={item.type || 'tee'}
                    color={item.color || '#d9c3ad'}
                    hasLogo={item.logo}
                    img={item.img || item.image}
                    className="w-full h-full"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 pr-16">
                  <b className="text-[19px] md:text-[22px] block font-bold text-white truncate">
                    {item.name || item.title}
                  </b>
                  <span className="text-[#e10600] font-bold text-[19px] md:text-[22px] block my-1 md:my-2">
                    ₹{(item.price || 899).toLocaleString('en-IN')}
                  </span>
                  {/* Quantity controls */}
                  <div className="flex items-center gap-3 md:gap-4 text-[20px] md:text-[22px] text-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 md:w-9 h-8 md:h-9 border-[1.5px] border-[#666] rounded-[6px] flex items-center justify-center hover:border-[#e10600] hover:text-[#e10600] transition-colors cursor-pointer select-none"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="min-w-[22px] text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 md:w-9 h-8 md:h-9 border-[1.5px] border-[#666] rounded-[6px] flex items-center justify-center hover:border-[#e10600] hover:text-[#e10600] transition-colors cursor-pointer select-none"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove item */}
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="absolute right-0 top-[24px] text-[15px] text-[#999] hover:text-[#e10600] underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-8 md:p-10 border-t border-[#333] shrink-0">
          <div className="flex justify-between items-center text-[24px] md:text-[28px] mb-6">
            <span>Total</span>
            <b className="text-[#e10600]">₹{subtotalRupees.toLocaleString('en-IN')}</b>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full bg-gradient-to-b from-[#e10600] to-[#a30000] text-white text-center py-5 md:py-[22px] text-[22px] md:text-[26px] font-extrabold tracking-[0.2em] rounded-[8px] cursor-pointer hover:brightness-125 active:scale-[0.98] transition-all"
          >
            CHECKOUT
          </button>
        </div>
      </aside>
    </>
  );
};
