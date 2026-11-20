import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

export interface BagDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenWaitlist?: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
}) => {
  const {
    items,
    removeItem,
    updateQuantity,
    isBagOpen: contextIsBagOpen,
    closeBag: contextCloseBag,
    subtotalRupees,
    subtotalPaise,
    freeShippingThresholdPaise,
  } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isBagOpen = propIsOpen !== undefined ? propIsOpen : contextIsBagOpen;
  const closeBag = propOnClose || contextCloseBag;

  const thresholdPaise = freeShippingThresholdPaise || 149900;
  const currentPaise = subtotalPaise || subtotalRupees * 100;
  const amountForFreeShipping = Math.max(0, thresholdPaise - currentPaise);
  const freeShippingProgress = Math.min(
    100,
    Math.round((currentPaise / thresholdPaise) * 100)
  );

  const handleCheckout = () => {
    if (!items.length) {
      toast('Your bag is empty');
      return;
    }
    closeBag();
    navigate('/bag');
  };

  if (!isBagOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={closeBag}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isBagOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-out Drawer */}
      <aside
        className={`fixed top-0 bottom-0 right-0 w-[92vw] sm:w-[480px] max-w-full bg-[#0B0B0B] border-l border-[#242321] text-[#F4F0E8] z-50 transition-transform duration-300 ease-out flex flex-col font-montserrat shadow-2xl ${
          isBagOpen
            ? 'translate-x-0 pointer-events-auto'
            : 'translate-x-full pointer-events-none'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-[#242321]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C85A2E]" />
            <h2 className="text-base sm:text-lg font-bold tracking-wider uppercase text-[#F4F0E8]">
              Your Bag
            </h2>
            <span className="text-xs font-semibold text-[#716B63] bg-[#141414] border border-[#242321] px-2 py-0.5 rounded-full">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>

          <button
            type="button"
            onClick={closeBag}
            className="w-8 h-8 rounded-lg bg-[#141414] border border-[#242321] text-[#716B63] hover:text-[#F4F0E8] hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close bag drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="px-6 py-3.5 bg-[#141414] border-b border-[#242321] text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#D9D1C3]">
              <Truck className="w-3.5 h-3.5 text-[#C85A2E]" />
              {amountForFreeShipping === 0
                ? 'Free Express Shipping unlocked!'
                : `Add ₹${Math.round(amountForFreeShipping / 100)} more for Free Shipping`}
            </span>
            <span className="text-[#C85A2E] font-bold">
              {freeShippingProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#0B0B0B] rounded-full overflow-hidden border border-[#242321]">
            <div
              className="h-full bg-[#C85A2E] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#242321]/60 scrollbar-none">
          {!items.length ? (
            <div className="py-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-[#141414] border border-[#242321] flex items-center justify-center mb-4 text-[#716B63]">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="text-base font-bold text-[#F4F0E8]">Your bag is empty</p>
              <p className="text-xs text-[#716B63] mt-1 max-w-xs">
                Explore our streetwear essentials and limited collection pieces.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeBag();
                  navigate('/shop');
                }}
                className="mt-6 px-6 py-2.5 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="py-4 flex gap-4 items-center group relative"
              >
                {/* Thumbnail */}
                <div className="w-20 h-24 shrink-0 bg-[#141414] border border-[#242321] rounded-xl overflow-hidden">
                  <img
                    src={item.image || item.img || '/images/vyomik/products/core-hoodie-ivory.jpg'}
                    alt={item.name || item.title || 'Product'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-left">
                  <h3 className="text-xs sm:text-[13px] font-bold text-[#F4F0E8] truncate">
                    {item.name || item.title}
                  </h3>

                  {/* Size & Color chips */}
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#716B63]">
                    {item.size && (
                      <span className="px-1.5 py-0.5 rounded bg-[#141414] border border-[#242321] text-[#D9D1C3]">
                        Size: {item.size}
                      </span>
                    )}
                    {item.color && (
                      <span className="px-1.5 py-0.5 rounded bg-[#141414] border border-[#242321] text-[#D9D1C3]">
                        {item.color}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-2 text-xs sm:text-[13px] font-bold text-[#C85A2E]">
                    ₹{(item.price || 2499).toLocaleString('en-IN')}
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center bg-[#141414] border border-[#242321] rounded-lg">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#716B63] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-[#F4F0E8]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-[#716B63] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-[#716B63] hover:text-[#C85A2E] p-1 transition-colors cursor-pointer"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-[#0B0B0B] border-t border-[#242321] shrink-0 space-y-4">
            <div className="space-y-1.5 text-xs text-[#716B63]">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="text-[#F4F0E8] font-semibold">
                  ₹{subtotalRupees.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className={amountForFreeShipping === 0 ? 'text-green-500 font-semibold' : 'text-[#F4F0E8]'}>
                  {amountForFreeShipping === 0 ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="pt-2 border-t border-[#242321] flex justify-between items-center text-sm font-bold text-[#F4F0E8]">
                <span>Total</span>
                <span className="text-base text-[#C85A2E]">
                  ₹{(subtotalRupees + (amountForFreeShipping === 0 ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full h-12 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(200,90,46,0.4)] transition-all cursor-pointer active:scale-[0.98]"
            >
              <span>View Bag & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
