import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  LogOut,
  MapPin,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface OrderItem {
  id: number;
  title: string;
  size: string;
  color: string;
  qty: number;
  unit_price: number;
  unit_price_inr: number;
  sku_snapshot: string;
}

interface CustomerOrder {
  id: number;
  order_number: string;
  order_status: string;
  payment_method: string;
  payment_status: string;
  subtotal: number;
  shipping_fee: number;
  cod_fee: number;
  total: number;
  total_inr: number;
  created_at: string;
  shipping_address: Record<string, any>;
  tr?: string | null;
  utr_number?: string | null;
  receipt_number?: string | null;
  receipt_url?: string | null;
  items: OrderItem[];
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);
  const [copiedOrder, setCopiedOrder] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'address'>('orders');

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

  const fetchOrders = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/v1/orders/customer/${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data || []);
      }
    } catch {
      // Quiet background handling
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/sign-in?redirect=/profile');
      return;
    }
    fetchOrders();
  }, [user]);

  const handleCopy = (text: string, type: 'utr' | 'order') => {
    navigator.clipboard.writeText(text);
    if (type === 'utr') {
      setCopiedUtr(text);
      setTimeout(() => setCopiedUtr(null), 2000);
    } else {
      setCopiedOrder(text);
      setTimeout(() => setCopiedOrder(null), 2000);
    }
  };

  const handleSignOut = () => {
    signout();
    toast('Signed out successfully');
    navigate('/home');
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Recent';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const userInitials = (user?.name || 'V')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');

  const paidCount = orders.filter((o) => o.payment_status.toLowerCase() === 'captured' || o.payment_status.toLowerCase() === 'paid').length;
  const receiptsCount = orders.filter((o) => !!o.receipt_url).length;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      <AnnouncementBar />
      <HomeNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#716B63] mb-6 sm:mb-8 font-medium">
          <Link to="/" className="hover:text-[#F4F0E8] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C85A2E]">Collector Profile & Receipts</span>
        </nav>

        {/* 1. USER IDENTITY HERO CARD */}
        <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
            style={{
              background: 'radial-gradient(circle, rgba(200, 90, 46, 0.4) 0%, transparent 70%)',
            }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Monogram Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#0B0B0B] border border-[#C85A2E]/40 flex items-center justify-center font-bold text-xl sm:text-2xl text-[#C85A2E] shadow-lg shadow-[#C85A2E]/10 shrink-0">
                {userInitials || <User className="w-8 h-8" />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#F4F0E8] tracking-tight">
                    {user?.name || 'Collector'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1F1915] border border-[#C85A2E]/50 text-[#C85A2E] text-[10px] font-bold uppercase tracking-wider">
                    Archive Member
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#A8A29E] font-mono">
                  {user?.email}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-[#716B63] mt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#86C286]" />
                  <span>Direct HDFC UPI Reconciliation Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchOrders}
                className="px-4 py-2.5 rounded-xl bg-[#201E1C] hover:bg-[#282522] border border-[#242321] text-xs font-semibold uppercase tracking-wider text-[#D9D1C3] flex items-center gap-2 transition-colors cursor-pointer"
                title="Refresh order history"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C85A2E]' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="px-4 py-2.5 rounded-xl bg-[#241715] hover:bg-[#331D1A] border border-[#592621]/50 text-xs font-semibold uppercase tracking-wider text-[#E0857D] flex items-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-[#242321]">
            <div className="bg-[#0B0B0B] border border-[#242321] rounded-xl p-3 sm:p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-[#716B63] tracking-wider block mb-1">
                Total Orders
              </span>
              <span className="text-lg sm:text-2xl font-bold text-[#F4F0E8]">{orders.length}</span>
            </div>
            <div className="bg-[#0B0B0B] border border-[#242321] rounded-xl p-3 sm:p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-[#716B63] tracking-wider block mb-1">
                Verified Paid
              </span>
              <span className="text-lg sm:text-2xl font-bold text-[#86C286]">{paidCount}</span>
            </div>
            <div className="bg-[#0B0B0B] border border-[#242321] rounded-xl p-3 sm:p-4 text-center">
              <span className="text-[10px] uppercase font-bold text-[#716B63] tracking-wider block mb-1">
                Tax Receipts
              </span>
              <span className="text-lg sm:text-2xl font-bold text-[#C85A2E]">{receiptsCount}</span>
            </div>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex items-center gap-4 border-b border-[#242321] pb-4 mb-6 text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setActiveTab('orders')}
            className={`pb-2 relative cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'orders' ? 'text-[#F4F0E8]' : 'text-[#716B63] hover:text-[#D9D1C3]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Orders & Official Invoices ({orders.length})</span>
            {activeTab === 'orders' && (
              <span className="absolute -bottom-4 left-0 w-full h-[2px] bg-[#C85A2E]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('address')}
            className={`pb-2 relative cursor-pointer transition-colors flex items-center gap-2 ${
              activeTab === 'address' ? 'text-[#F4F0E8]' : 'text-[#716B63] hover:text-[#D9D1C3]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Shipping Details</span>
            {activeTab === 'address' && (
              <span className="absolute -bottom-4 left-0 w-full h-[2px] bg-[#C85A2E]" />
            )}
          </button>
        </div>

        {/* 3. ORDERS & RECEIPTS TAB VIEW */}
        {activeTab === 'orders' && (
          <div>
            {isLoading ? (
              <div className="bg-[#141414] border border-[#242321] rounded-2xl p-12 text-center">
                <div className="w-10 h-10 border-3 border-[#C85A2E]/20 border-t-[#C85A2E] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xs text-[#A8A29E] uppercase tracking-wider font-semibold">
                  Loading Your Order Archive…
                </p>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-[#141414] border border-[#242321] rounded-2xl p-12 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#0B0B0B] border border-[#242321] text-[#716B63] flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-[#F4F0E8] mb-2">No Orders in Your Archive</h2>
                <p className="text-xs text-[#A8A29E] leading-relaxed mb-6">
                  Items you purchase using our Dynamic UPI QR and their official tax invoices will be stored here permanently.
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#C85A2E]/20"
                >
                  <span>Explore Shop</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const isPaid = order.payment_status.toLowerCase() === 'captured' || order.payment_status.toLowerCase() === 'paid';
                  const receiptUrl = order.receipt_url || (isPaid && order.tr ? `/api/v1/payments/receipt/${order.tr}/download` : null);

                  return (
                    <div
                      key={order.id}
                      className="bg-[#141414] border border-[#242321] hover:border-[#353432] rounded-2xl p-5 sm:p-7 shadow-xl transition-all text-left"
                    >
                      {/* Top Bar: Order ID, Date, Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242321] gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[#716B63] font-medium uppercase">Order</span>
                            <span className="font-mono font-bold text-[#F4F0E8] text-sm">
                              {order.order_number}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(order.order_number, 'order')}
                              className="text-[#716B63] hover:text-[#C85A2E] transition-colors p-1"
                              title="Copy Order Number"
                            >
                              {copiedOrder === order.order_number ? (
                                <Check className="w-3.5 h-3.5 text-[#86C286]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-[#716B63] block mt-0.5">
                            Placed on {formatDate(order.created_at)}
                          </span>
                        </div>

                        {/* Status Badges */}
                        <div className="flex items-center gap-2">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#122416] border border-[#2B7A4B] text-[#86C286] text-[11px] font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Paid & Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#241E15] border border-[#C88A2E] text-[#D9A757] text-[11px] font-bold uppercase tracking-wider">
                              <Clock className="w-3.5 h-3.5" />
                              <span>Payment Pending</span>
                            </span>
                          )}

                          <span className="px-2.5 py-1 rounded-full bg-[#0B0B0B] border border-[#242321] text-[#A8A29E] text-[10px] font-bold uppercase tracking-wider">
                            {order.order_status}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="py-4 space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs py-1.5">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#0B0B0B] border border-[#242321] flex items-center justify-center font-mono text-[10px] text-[#716B63] shrink-0">
                                {item.sku_snapshot?.substring(0, 4) || 'VY'}
                              </div>
                              <div>
                                <p className="font-semibold text-[#F4F0E8]">{item.title}</p>
                                <p className="text-[11px] text-[#716B63]">
                                  Size: <span className="text-[#D9D1C3]">{item.size}</span> | Color: <span className="text-[#D9D1C3]">{item.color}</span> | Qty: {item.qty}
                                </p>
                              </div>
                            </div>
                            <div className="font-bold text-[#F4F0E8]">
                              ₹{item.unit_price_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financials & Verification Footer */}
                      <div className="pt-4 border-t border-[#242321] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Payment & Bank Details */}
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="text-[#716B63]">Method:</span>
                            <span className="font-semibold text-[#D9D1C3] uppercase">{order.payment_method}</span>
                          </div>
                          {order.utr_number && (
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="text-[#716B63]">HDFC Bank UTR:</span>
                              <span className="font-mono text-[#86C286] font-semibold">{order.utr_number}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(order.utr_number!, 'utr')}
                                className="text-[#716B63] hover:text-[#C85A2E] p-0.5"
                                title="Copy UTR"
                              >
                                {copiedUtr === order.utr_number ? (
                                  <Check className="w-3 h-3 text-[#86C286]" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                          <div className="text-[11px] text-[#716B63]">
                            Grand Total: <b className="text-[#F4F0E8] font-bold text-sm">₹{order.total_inr.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</b>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          {receiptUrl && (
                            <a
                              href={`${apiBase}${receiptUrl}`}
                              download
                              className="px-4 py-2.5 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-[#C85A2E]/20 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF Receipt</span>
                            </a>
                          )}
                          <Link
                            to={`/payment/${order.order_number}`}
                            className="px-4 py-2.5 rounded-xl bg-[#201E1C] hover:bg-[#2c2825] border border-[#242321] text-[#D9D1C3] hover:text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                          >
                            <span>Live Status</span>
                            <ExternalLink className="w-3.5 h-3.5 text-[#716B63]" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. SAVED ADDRESS VIEW */}
        {activeTab === 'address' && (
          <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-8 text-left shadow-xl">
            <h3 className="text-sm font-bold text-[#F4F0E8] uppercase tracking-wider mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C85A2E]" />
              <span>Primary Shipping Address</span>
            </h3>
            <p className="text-xs text-[#A8A29E] mb-6">
              This address is linked to your verified checkout profile and automatically pre-filled on your orders.
            </p>

            {orders.length > 0 && orders[0].shipping_address ? (
              <div className="bg-[#0B0B0B] border border-[#242321] rounded-xl p-5 max-w-md space-y-2 text-xs">
                <div className="font-bold text-[#F4F0E8] text-sm">
                  {orders[0].shipping_address.first_name} {orders[0].shipping_address.last_name}
                </div>
                <div className="text-[#A8A29E] leading-relaxed">
                  {orders[0].shipping_address.address1}
                  {orders[0].shipping_address.address2 ? `, ${orders[0].shipping_address.address2}` : ''}
                </div>
                <div className="text-[#A8A29E]">
                  {orders[0].shipping_address.city}, {orders[0].shipping_address.state} — {orders[0].shipping_address.zipcode}
                </div>
                <div className="text-[#716B63] pt-2 border-t border-[#242321] font-mono">
                  Phone: {orders[0].shipping_address.phone}
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#716B63] italic">
                No shipping address saved yet. Addresses are captured automatically when placing an order.
              </div>
            )}
          </div>
        )}
      </main>

      <HomeFooter />
    </div>
  );
};
