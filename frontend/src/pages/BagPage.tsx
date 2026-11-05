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
  Sparkles,
} from 'lucide-react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
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
        title: item.title,
        color: item.color,
        size: item.size,
        qty: item.quantity,
        price_paise: item.pricePaise,
        sku: `VY-${item.title.includes('Hoodie') ? 'HD' : item.title.includes('Sweatshirt') ? 'SW' : 'TS'}-${item.color.slice(0, 3).toUpperCase()}-${item.size}`,
      })),
      total_paise: totalPaise,
      subtotal_paise: subtotalPaise,
      shipping_fee_paise: shippingFeePaise,
    };

    try {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'}/api/v1/orders/sandbox-test`;
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
        success: data.success,
        orderNumber: data.order_number,
        qikinkOrderId: data.qikink_order_id,
        status: data.status,
        rawResponse: data.raw_response,
        message: data.message,
      });

      // Clear cart on successful submission
      if (data.success) {
        clearCart();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to backend order API');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F3EE] flex flex-col font-sans selection:bg-[#202020] selection:text-[#F4F3EE]">
      <AnnouncementBar />
      <Header />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-10 w-full">
        {/* Page Header */}
        <div className="border-b border-[#DAD7CE] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#5C6548] text-xs font-semibold tracking-[0.2em] uppercase mb-1.5">
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
              <span>Shopping Bag</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[#202020] uppercase">
              Your Bag & Sandbox Checkout
            </h1>
          </div>
          <Link
            to="/collections"
            className="text-xs uppercase font-semibold tracking-wider text-[#5C6548] hover:text-[#202020] underline underline-offset-4"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Sandbox API Live Result Alert */}
        {sandboxResult && (
          <div className="mb-8 p-6 bg-white border border-[#202020] shadow-md animate-fadeIn">
            <div className="flex items-start space-x-3.5">
              <CheckCircle2 className="w-6 h-6 text-green-700 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700 block">
                  QIKINK SANDBOX API FULFILLMENT VERIFIED
                </span>
                <h3 className="text-lg font-bold text-[#202020] mt-1">
                  Order Successfully Submitted: {sandboxResult.orderNumber}
                </h3>
                <p className="text-xs text-[#202020]/80 mt-1 leading-relaxed">
                  {sandboxResult.message || 'The order passed Qikink Sandbox authentication, order validation, and SKU boundary checks.'}
                </p>

                <div className="mt-4 p-4 bg-[#F4F3EE] border border-[#DAD7CE] font-mono text-[11px] text-[#202020] overflow-x-auto">
                  <div className="font-bold text-xs mb-2 uppercase tracking-wider text-[#5C6548]">
                    Live Qikink Sandbox Response Payload:
                  </div>
                  <pre>{JSON.stringify(sandboxResult.rawResponse || sandboxResult, null, 2)}</pre>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    to="/collections"
                    className="inline-flex items-center px-4 py-2 bg-[#202020] text-[#F4F3EE] text-xs font-semibold uppercase tracking-wider hover:bg-[#333333]"
                  >
                    <span>Shop More Products</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-8 p-4 bg-red-50 border border-red-300 text-red-900 text-xs flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bag Content */}
        {items.length === 0 && !sandboxResult ? (
          <div className="py-20 text-center border border-[#DAD7CE] bg-white p-8 max-w-lg mx-auto">
            <ShoppingBag className="w-12 h-12 stroke-[1.5] text-[#5C6548] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-[#202020]">Your bag is currently empty</h2>
            <p className="text-xs text-[#202020]/70 mt-2 max-w-sm mx-auto leading-relaxed">
              Explore our architectural oversized tees, hoodies, and sweatshirts with 19 authentic garment colors.
            </p>
            <Link
              to="/collections"
              className="mt-6 inline-flex items-center px-6 py-3 bg-[#202020] text-[#F4F3EE] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#333333] transition-colors space-x-2"
            >
              <span>Explore Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left 7 cols: Bag Items List */}
            <div className="lg:col-span-7 space-y-4">
              {/* Free Shipping Meter */}
              <div className="p-4 bg-white border border-[#DAD7CE] shadow-xs">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center space-x-2 font-semibold text-[#202020]">
                    <Truck className="w-4 h-4 text-[#5C6548]" />
                    <span>
                      {amountForFreeShipping === 0
                        ? '🎉 You unlocked Free Express Shipping!'
                        : `Add ${paise_to_inr_display(amountForFreeShipping)} more for Free Shipping`}
                    </span>
                  </div>
                  <span className="font-bold text-[#5C6548]">{freeShippingProgress}%</span>
                </div>
                <div className="w-full bg-[#EAE8E1] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5C6548] h-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="border border-[#DAD7CE] bg-white divide-y divide-[#DAD7CE]">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex gap-4 sm:gap-6 items-center">
                    {/* Visual Preview */}
                    <div className="w-20 h-24 bg-[#F4F3EE] border border-[#DAD7CE] shrink-0 overflow-hidden flex items-center justify-center p-2 relative">
                      {item.image && item.image.startsWith('#') ? (
                        <div
                          className="w-12 h-14 rounded-xs shadow-xs border border-black/10"
                          style={{ backgroundColor: item.image }}
                        />
                      ) : (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#202020] truncate">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-[#202020]/70 mt-1">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-[#202020]">Color:</span>
                          <span>{item.color}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-[#202020]">Size:</span>
                          <span className="font-bold px-1.5 py-0.5 bg-[#F4F3EE] border border-[#DAD7CE] text-[10px]">
                            {item.size}
                          </span>
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#202020] mt-2">
                        {paise_to_inr_display(item.pricePaise * item.quantity)}
                      </div>
                    </div>

                    {/* Quantity Stepper & Remove */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="flex items-center border border-[#DAD7CE] bg-[#F4F3EE]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-[#EAE8E1] text-[#202020] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#202020]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-[#EAE8E1] text-[#202020] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] uppercase tracking-wider">Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Delivery & Sandbox Checkout Form */}
            <div className="lg:col-span-5 space-y-6">
              {/* Order Summary Box */}
              <div className="border border-[#DAD7CE] bg-white p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#202020] border-b border-[#DAD7CE] pb-3 mb-4">
                  Summary
                </h3>

                <div className="space-y-2.5 text-xs text-[#202020]">
                  <div className="flex justify-between">
                    <span className="text-[#202020]/70">Subtotal</span>
                    <span className="font-semibold">{paise_to_inr_display(subtotalPaise)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#202020]/70">Shipping</span>
                    <span className="font-semibold">
                      {shippingFeePaise === 0 ? (
                        <span className="text-green-700 font-bold uppercase text-[11px]">FREE</span>
                      ) : (
                        paise_to_inr_display(shippingFeePaise)
                      )}
                    </span>
                  </div>
                  {form.paymentMethod === 'cod' && (
                    <div className="flex justify-between">
                      <span className="text-[#202020]/70">COD Handling Fee</span>
                      <span className="font-semibold">₹49.00</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#DAD7CE] flex justify-between text-base font-bold text-[#202020]">
                    <span>Total</span>
                    <span>
                      {paise_to_inr_display(
                        totalPaise + (form.paymentMethod === 'cod' ? 4900 : 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* Sandbox Dispatch Form */}
                <form onSubmit={handlePlaceSandboxOrder} className="mt-6 pt-5 border-t border-[#DAD7CE] space-y-4">
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#5C6548]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Qikink Sandbox Test Details</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={form.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={form.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                        Phone (10 digits)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="zipcode"
                        required
                        maxLength={6}
                        value={form.zipcode}
                        onChange={handleInputChange}
                        className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={form.address}
                      onChange={handleInputChange}
                      className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={form.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={form.state}
                        onChange={handleInputChange}
                        className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-1.5 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-[#202020]/70 block mb-1">
                      Payment Mode
                    </label>
                    <select
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleInputChange}
                      className="w-full bg-[#F4F3EE] border border-[#DAD7CE] px-2.5 py-2 text-xs text-[#202020] focus:border-[#202020] focus:outline-none"
                    >
                      <option value="prepaid">Prepaid (Auto-Mock/Razorpay)</option>
                      <option value="cod">Cash on Delivery (COD)</option>
                    </select>
                  </div>

                  {/* Submission Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-4 bg-[#202020] text-[#F4F3EE] py-3.5 px-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#333333] disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <span>Connecting to Qikink Sandbox...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Place Order & Test Sandbox</span>
                      </>
                    )}
                  </button>

                  <div className="text-[10px] text-center text-[#202020]/60 flex items-center justify-center space-x-1.5 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5C6548]" />
                    <span>Tested with Qikink POD Sandbox API credentials</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );
};
