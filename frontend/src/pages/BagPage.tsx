import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { useCart } from '../context/CartContext';
import { paise_to_inr_display } from '../utils/format';

interface DeliveryForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  paymentMethod: 'prepaid' | 'cod';
}

interface SandboxOrderResult {
  success: boolean;
  orderNumber: string;
  qikinkOrderId?: string;
  status: string;
  rawResponse?: any;
  message?: string;
}

export const BagPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotalPaise,
    shippingFeePaise,
    totalPaise,
    freeShippingThresholdPaise,
  } = useCart();

  const [form, setForm] = useState<DeliveryForm>({
    firstName: 'Aarav',
    lastName: 'Sharma',
    phone: '9876543210',
    email: 'aarav@vyomik.com',
    address: '12th Main, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    zipcode: '560038',
    paymentMethod: 'prepaid',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<SandboxOrderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const amountForFreeShipping = Math.max(0, freeShippingThresholdPaise - subtotalPaise);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotalPaise / freeShippingThresholdPaise) * 100)
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceSandboxOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSandboxResult(null);

    const payload = {
      shipping_address: {
        first_name: form.firstName,
        last_name: form.lastName,
        address1: form.address,
        city: form.city,
        state: form.state,
        zipcode: form.zipcode,
        phone: form.phone,
        email: form.email,
      },
      payment_method: form.paymentMethod,
      items: items.map((item) => ({
        product_id: item.productId,
        variant_id: item.variantId,
        title: item.title || item.name || "VYOMIK Apparel",
        color: item.color || "White",
        size: item.size || "M",
        qty: item.quantity || 1,
        price_paise: item.pricePaise || (item.price ? item.price * 100 : 249900),
        sku: (item as any).sku || (item as any).store_sku || (item as any).qikinkSkuMock || `VY-${(item.title || item.name || '').includes('Hoodie') ? 'HD' : (item.title || item.name || '').includes('Sweatshirt') ? 'SW' : 'TS'}-${(item.color || 'BLK').slice(0, 3).toUpperCase()}-${item.size || 'M'}`,
      })),
      total_paise: totalPaise,
      subtotal_paise: subtotalPaise,
      shipping_fee_paise: shippingFeePaise,
    };

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/v1/orders`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to submit order to sandbox');
      }

      setSandboxResult({
        success: true,
        orderNumber: data.order_number || `VY-${Date.now().toString().slice(-6)}`,
        qikinkOrderId: data.qikink_order_id,
        status: data.status || 'sandbox_verified',
        rawResponse: data,
        message: data.message || 'Sandbox order successfully verified with Qikink API.',
      });
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Sandbox test order execution failed. Check console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      {/* Announcement Bar & Main Navbar */}
      <AnnouncementBar />
      <HomeNavbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14 w-full">
        {/* Header Block */}
        <div className="border-b border-[#242321] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div>
            <div className="flex items-center gap-2 text-[#C85A2E] text-xs font-bold uppercase tracking-[0.2em] mb-1.5">
              <ShoppingBag className="w-4 h-4" />
              <span>SHOPPING BAG</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#F4F0E8] uppercase">
              Your Bag & Checkout
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase font-bold tracking-wider text-[#A8A29E] hover:text-[#C85A2E] transition-colors underline underline-offset-4"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Sandbox API Live Result Alert */}
        {sandboxResult && (
          <div className="mb-8 p-6 bg-[#141414] border border-green-500/40 rounded-2xl shadow-2xl text-left animate-fadeIn">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-6 h-6 text-green-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-400 block">
                  ORDER FULFILLMENT VERIFIED
                </span>
                <h3 className="text-lg font-bold text-[#F4F0E8] mt-1">
                  Order Successfully Submitted: {sandboxResult.orderNumber}
                </h3>
                <p className="text-xs text-[#A8A29E] mt-1 leading-relaxed">
                  {sandboxResult.message || 'The order passed inventory verification, authentication, and SKU boundary checks.'}
                </p>

                <div className="mt-4 p-4 bg-[#0B0B0B] border border-[#242321] rounded-xl font-mono text-[11px] text-[#D9D1C3] overflow-x-auto">
                  <div className="font-bold text-xs mb-2 uppercase tracking-wider text-[#C85A2E]">
                    API Response Payload:
                  </div>
                  <pre>{JSON.stringify(sandboxResult.rawResponse || sandboxResult, null, 2)}</pre>
                </div>

                <div className="mt-5">
                  <Link
                    to="/shop"
                    className="inline-flex items-center px-5 py-2.5 bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md"
                  >
                    <span>Shop More Collections</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-[#2A1810] border border-[#C85A2E]/50 rounded-xl text-red-300 text-xs flex items-center gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-[#C85A2E] shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && !sandboxResult ? (
          <div className="py-20 text-center border border-[#242321] bg-[#141414] rounded-2xl p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#0B0B0B] border border-[#242321] flex items-center justify-center mx-auto mb-4 text-[#716B63]">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="text-xl font-bold text-[#F4F0E8]">Your bag is currently empty</h2>
            <p className="text-xs text-[#A8A29E] mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our architectural hoodies, heavyweight sweatshirts, and oversized graphic tees.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center px-6 py-3 bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs font-bold uppercase tracking-[0.16em] rounded-xl transition-all shadow-lg space-x-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start text-left">
            {/* Left 7 cols: Bag Items List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Free Shipping Meter */}
              <div className="p-4 bg-[#141414] border border-[#242321] rounded-2xl shadow-md">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2 font-semibold text-[#F4F0E8]">
                    <Truck className="w-4 h-4 text-[#C85A2E]" />
                    <span>
                      {amountForFreeShipping === 0
                        ? '🎉 You unlocked Free Express Shipping!'
                        : `Add ${paise_to_inr_display(amountForFreeShipping)} more for Free Shipping`}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#C85A2E]">
                    {freeShippingProgress}%
                  </span>
                </div>
                <div className="w-full bg-[#0B0B0B] h-1.5 rounded-full overflow-hidden border border-[#242321]">
                  <div
                    className="bg-[#C85A2E] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card List */}
              <div className="divide-y divide-[#242321] border border-[#242321] rounded-2xl bg-[#141414] overflow-hidden">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden bg-[#0B0B0B] border border-[#242321] shrink-0">
                        <img
                          src={item.image || item.img || '/images/vyomik/products/core-hoodie-ivory.jpg'}
                          alt={item.name || item.title || 'Product'}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-[#F4F0E8]">
                          {item.name || item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 text-xs text-[#716B63]">
                          {item.size && (
                            <span className="px-2 py-0.5 rounded bg-[#0B0B0B] border border-[#242321] text-[#D9D1C3]">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="px-2 py-0.5 rounded bg-[#0B0B0B] border border-[#242321] text-[#D9D1C3]">
                              {item.color}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 text-sm font-bold text-[#C85A2E]">
                          ₹{(item.price || 2499).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                      {/* Quantity Stepper */}
                      <div className="inline-flex items-center bg-[#0B0B0B] border border-[#242321] rounded-lg">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#716B63] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#F4F0E8]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-[#716B63] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[#716B63] hover:text-[#C85A2E] p-2 transition-colors cursor-pointer"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Features Bar */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-[#141414] border border-[#242321] rounded-2xl text-[11px] text-[#A8A29E]">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C85A2E] shrink-0" />
                  <span>Free Express Delivery above ₹1,499</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#C85A2E] shrink-0" />
                  <span>7-Day Hassle-Free Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C85A2E] shrink-0" />
                  <span>100% Encrypted Payment</span>
                </div>
              </div>
            </div>

            {/* Right 5 cols: Delivery & Checkout Form */}
            <div className="lg:col-span-5 bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 shadow-2xl">
              <h2 className="text-lg font-bold text-[#F4F0E8] uppercase tracking-wider pb-3 border-b border-[#242321]">
                Order Summary & Checkout
              </h2>

              <div className="py-4 border-b border-[#242321] space-y-2 text-xs sm:text-[13px] text-[#A8A29E]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#F4F0E8] font-bold">
                    {paise_to_inr_display(subtotalPaise)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className={shippingFeePaise === 0 ? 'text-green-400 font-bold' : 'text-[#F4F0E8] font-bold'}>
                    {shippingFeePaise === 0 ? 'FREE' : paise_to_inr_display(shippingFeePaise)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#242321] flex justify-between text-sm sm:text-base font-bold text-[#F4F0E8]">
                  <span>Total Due</span>
                  <span className="text-[#C85A2E]">
                    {paise_to_inr_display(totalPaise)}
                  </span>
                </div>
              </div>

              {/* Delivery Address Form */}
              <form onSubmit={handlePlaceSandboxOrder} className="mt-5 space-y-3.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85A2E] block">
                  Delivery Details
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#716B63] uppercase font-semibold">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    required
                    className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#716B63] uppercase font-semibold">PIN</label>
                    <input
                      type="text"
                      name="zipcode"
                      value={form.zipcode}
                      onChange={handleInputChange}
                      required
                      className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#716B63] uppercase font-semibold">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={form.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full mt-1 px-3 py-2 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-lg text-xs text-[#F4F0E8] outline-none cursor-pointer"
                  >
                    <option value="prepaid">Online Payment (UPI, Cards, Netbanking)</option>
                    <option value="cod">Cash on Delivery (COD)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full mt-3 h-12 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(200,90,46,0.4)] transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Verifying Sandbox Order…</span>
                  ) : (
                    <>
                      <span>Place Order (Verify Checkout)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </main>

      {/* Brand Footer */}
      <HomeFooter />

      {/* Global Drawers */}
      <BagDrawer />
      <SearchBar />
    </div>
  );
};
