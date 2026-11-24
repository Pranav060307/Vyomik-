import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';

const UPI_REGEX = /^[a-zA-Z0-9._*#\-]+@[a-zA-Z0-9.\-]+$/;

interface PaymentData {
  tr: string;
  order_number: string;
  status: 'created' | 'awaiting_payment' | 'verifying' | 'paid' | 'failed' | 'expired' | 'manual_review';
  amount_paise: number;
  amount_inr: number;
  customer_upi_id?: string;
  receiving_vpa?: string;
  utr_number?: string;
  paid_at?: string;
  receipt_url?: string;
  receipt_number?: string;
  qr_base64?: string;
  upi_uri?: string;
}

export const PaymentPage: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [searchParams] = useSearchParams();

  const queryTr = searchParams.get('tr');
  const initialUpi = searchParams.get('upi') || '';

  const [customerUpi, setCustomerUpi] = useState<string>(initialUpi);
  const [upiError, setUpiError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [status, setStatus] = useState<PaymentData['status']>('awaiting_payment');
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(1800); // 30 minutes in seconds

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const effectiveIdentifier = paymentData?.tr || queryTr || orderNumber || '';

  // 1. Fetch current status or generate QR
  const fetchStatus = async (targetId: string) => {
    try {
      const res = await fetch(`${apiBase}/api/v1/payments/status/${targetId}`);
      if (res.ok) {
        const data = await res.json();
        setPaymentData((prev) => ({ ...prev, ...data }));
        setStatus(data.status);
        if (data.status === 'paid') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        }
      }
    } catch {
      // Quiet background polling error handling
    }
  };

  const handleGenerateQr = async (upiToUse?: string) => {
    const upi = (upiToUse || customerUpi).trim().toLowerCase();
    if (!upi) {
      setUpiError('Enter your UPI ID (e.g. yourname@okhdfcbank or user@fam)');
      return;
    }
    if (!UPI_REGEX.test(upi)) {
      setUpiError('Invalid UPI ID format. Include your handle name and bank tag (@bank)');
      return;
    }

    setUpiError(null);
    setIsGenerating(true);

    try {
      const res = await fetch(`${apiBase}/api/v1/payments/create-upi-qr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_number: orderNumber || 'VY2611DEMO',
          customer_upi_id: upi,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to generate dynamic QR code');
      }

      const data = await res.json();
      setPaymentData(data);
      setStatus(data.status || 'awaiting_payment');
      setTimeLeft(1800);
    } catch (err: any) {
      setUpiError(err.message || 'Could not connect to payment service. Check server.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Initial load: either fetch existing status or auto-generate if upi query exists
  useEffect(() => {
    if (orderNumber) {
      fetchStatus(orderNumber);
    }
  }, [orderNumber]);

  // Countdown timer
  useEffect(() => {
    if (status === 'paid' || status === 'expired') return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  // Real-time status polling every 2 seconds
  useEffect(() => {
    if (!effectiveIdentifier || status === 'paid' || status === 'expired') return;

    // Immediately poll once
    fetchStatus(effectiveIdentifier);

    pollIntervalRef.current = setInterval(() => {
      fetchStatus(effectiveIdentifier);
    }, 2000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [effectiveIdentifier, status]);

  const handleMarkVerifying = async () => {
    if (!effectiveIdentifier) return;
    setStatus('verifying');
    try {
      await fetch(`${apiBase}/api/v1/payments/set-verifying/${effectiveIdentifier}`, {
        method: 'POST',
      });
      fetchStatus(effectiveIdentifier);
    } catch {
      // Fallback
    }
  };

  const handleCopyVpa = () => {
    const vpa = paymentData?.receiving_vpa || 'champsarena@naviaxis';
    navigator.clipboard.writeText(vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleCopyUtr = () => {
    if (paymentData?.utr_number) {
      navigator.clipboard.writeText(paymentData.utr_number);
      setCopiedUtr(true);
      setTimeout(() => setCopiedUtr(false), 2000);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const commonHandles = ['@okhdfcbank', '@okaxis', '@fam', '@paytm', '@ybl', '@ibl'];

  const appendHandle = (handle: string) => {
    const prefix = customerUpi.split('@')[0] || 'yourname';
    const newUpi = `${prefix}${handle}`;
    setCustomerUpi(newUpi);
    setUpiError(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      <AnnouncementBar />
      <HomeNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#716B63] mb-6 sm:mb-8 font-medium">
          <Link to="/" className="hover:text-[#F4F0E8] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/bag" className="hover:text-[#F4F0E8] transition-colors">Bag</Link>
          <span>/</span>
          <span className="text-[#C85A2E]">Automatic UPI QR Payment</span>
        </nav>

        {/* 1. PAYMENT SUCCESS CELEBRATION STATE */}
        {status === 'paid' ? (
          <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#162116] border border-[#2B7A4B] text-[#86C286] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#86C286] block mb-2">
              BANK RECONCILIATION VERIFIED
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-[#F4F0E8] tracking-tight mb-3">
              Payment Confirmed<span className="text-[#C85A2E]">.</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A8A29E] max-w-md mx-auto mb-8 leading-relaxed">
              We received your payment through HDFC Bank. Your order has been placed into production with zero delay.
            </p>

            {/* Transaction Verification Card */}
            <div className="bg-[#0B0B0B] border border-[#242321] rounded-xl p-5 mb-8 text-left space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#716B63]">Order Reference</span>
                <span className="font-semibold text-[#F4F0E8]">{paymentData?.order_number || orderNumber}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#716B63]">Amount Paid</span>
                <span className="font-bold text-[#86C286]">
                  ₹{paymentData?.amount_inr ? paymentData.amount_inr.toLocaleString('en-IN') : '2,499.00'}
                </span>
              </div>
              {paymentData?.utr_number && (
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[#242321]">
                  <span className="text-[#716B63]">Bank UTR / Ref No</span>
                  <div className="flex items-center gap-1.5 font-mono text-[#F4F0E8]">
                    <span>{paymentData.utr_number}</span>
                    <button
                      type="button"
                      onClick={handleCopyUtr}
                      className="p-1 hover:text-[#C85A2E] transition-colors"
                      title="Copy UTR"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-[#86C286]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`${apiBase}/api/v1/payments/receipt/${paymentData?.tr || effectiveIdentifier}/download`}
                download
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#C85A2E]/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Official Receipt (PDF)</span>
              </a>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#24201D] hover:bg-[#302B27] border border-[#242321] text-[#F4F0E8] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* 2. ACTIVE PAYMENT / DYNAMIC QR / VERIFYING INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Dynamic QR & Mobile Deep Links (7 Cols) */}
            <div className="lg:col-span-7 bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-5 border-b border-[#242321] mb-6">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#C85A2E] block">
                    AUTOMATIC RECONCILIATION
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F4F0E8] tracking-tight">
                    Scan Dynamic UPI QR
                  </h2>
                </div>
                {/* Timer Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0B0B0B] border border-[#242321] text-xs font-mono text-[#D9A757]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatSeconds(timeLeft)}</span>
                </div>
              </div>

              {/* QR Code Presentation */}
              <div className="flex flex-col items-center justify-center p-6 bg-[#0B0B0B] border border-[#242321] rounded-xl mb-6 relative">
                {paymentData?.qr_base64 ? (
                  <div className="bg-white p-3 rounded-lg shadow-lg">
                    <img
                      src={paymentData.qr_base64}
                      alt="VYOMIK UPI QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-lg border-2 border-dashed border-[#242321] flex flex-col items-center justify-center p-4 text-center">
                    <QrCode className="w-12 h-12 text-[#716B63] mb-2" />
                    <p className="text-xs text-[#716B63]">
                      Enter your UPI ID on the right to generate your secure transaction QR
                    </p>
                  </div>
                )}

                <div className="mt-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-[#F4F0E8]">
                    ₹{paymentData?.amount_inr ? paymentData.amount_inr.toLocaleString('en-IN') : '2,499.00'}
                  </div>
                  <div className="text-[11px] text-[#716B63] mt-0.5">
                    Payee: <span className="text-[#A8A29E] font-medium">VYOMIK ({paymentData?.receiving_vpa || 'champsarena@naviaxis'})</span>
                  </div>
                </div>

                {/* Live Real-Time Auto-Verification Status Banner */}
                <div className="w-full mt-5 p-3.5 bg-[#0E150F] border border-[#2B7A4B]/50 rounded-xl flex items-center gap-3 text-left">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#86C286] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#86C286]"></span>
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[#86C286] flex items-center gap-1.5">
                      <span>AUTOMATIC LIVE VERIFICATION ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-[#A8A29E] leading-relaxed mt-0.5">
                      Scan and pay above. We automatically listen to HDFC Bank UPI notifications and mark your order verified within seconds. <b>No button clicks required.</b>
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Deep Link Buttons */}
              {paymentData?.upi_uri && (
                <div className="mb-6">
                  <span className="text-[11px] text-[#716B63] block mb-2 font-medium">
                    Or pay directly using your mobile app:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <a
                      href={paymentData.upi_uri}
                      className="py-2.5 px-3 rounded-xl bg-[#201E1C] hover:bg-[#282522] border border-[#242321] text-[11px] font-semibold text-center text-[#F4F0E8] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>GPay</span>
                      <ExternalLink className="w-3 h-3 text-[#716B63]" />
                    </a>
                    <a
                      href={paymentData.upi_uri}
                      className="py-2.5 px-3 rounded-xl bg-[#201E1C] hover:bg-[#282522] border border-[#242321] text-[11px] font-semibold text-center text-[#F4F0E8] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>PhonePe</span>
                      <ExternalLink className="w-3 h-3 text-[#716B63]" />
                    </a>
                    <a
                      href={paymentData.upi_uri}
                      className="py-2.5 px-3 rounded-xl bg-[#201E1C] hover:bg-[#282522] border border-[#242321] text-[11px] font-semibold text-center text-[#F4F0E8] transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Paytm</span>
                      <ExternalLink className="w-3 h-3 text-[#716B63]" />
                    </a>
                  </div>
                </div>
              )}

              {/* Merchant VPA copy line */}
              <div className="p-3.5 bg-[#0B0B0B] border border-[#242321] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#716B63] text-[10px] uppercase font-bold block">
                    Receiving VPA (HDFC Bank)
                  </span>
                  <span className="font-mono text-[#F4F0E8]">
                    {paymentData?.receiving_vpa || 'champsarena@naviaxis'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyVpa}
                  className="px-3 py-1.5 bg-[#201E1C] hover:bg-[#282522] border border-[#242321] text-[#F4F0E8] rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedVpa ? <Check className="w-3.5 h-3.5 text-[#86C286]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedVpa ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Status Signal Trigger */}
              <div className="mt-6 pt-5 border-t border-[#242321] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#716B63]">
                  <span className="w-2 h-2 rounded-full bg-[#86C286] animate-pulse" />
                  <span>Auto-detecting bank credit every 2s</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    handleMarkVerifying();
                    fetchStatus(effectiveIdentifier);
                  }}
                  className="w-full sm:w-auto px-5 h-11 rounded-xl bg-[#201E1C] hover:bg-[#282522] border border-[#242321] text-[#D9D1C3] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  title="Check Status Now"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Status Now</span>
                </button>
              </div>
            </div>

            {/* Right: Customer UPI Input, Order Details & Instructions (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Customer UPI ID Configuration Card */}
              <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 shadow-xl">
                <h3 className="text-sm font-bold text-[#F4F0E8] uppercase tracking-wider mb-2">
                  1. Your Paying UPI ID
                </h3>
                <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
                  Enter the exact UPI handle you will pay from. Our backend matches this with the HDFC Bank credit email to confirm your order instantly.
                </p>

                <div className="space-y-3">
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={customerUpi}
                      onChange={(e) => {
                        setCustomerUpi(e.target.value);
                        setUpiError(null);
                      }}
                      className="w-full px-4 py-3 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl text-xs sm:text-sm text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                    />
                    {upiError && (
                      <div className="mt-2 text-xs text-[#D47984] flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{upiError}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Handle Selection Pills */}
                  <div>
                    <span className="text-[10px] text-[#716B63] uppercase font-bold block mb-1.5">
                      Quick Handles
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {commonHandles.map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => appendHandle(h)}
                          className="px-2.5 py-1 rounded-lg bg-[#201E1C] hover:bg-[#2c2825] border border-[#242321] text-[10px] font-mono text-[#D9D1C3] transition-colors cursor-pointer"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateQr()}
                    disabled={isGenerating}
                    className="w-full mt-2 h-11 rounded-xl bg-[#24201D] hover:bg-[#302B27] border border-[#C85A2E]/50 text-[#F4F0E8] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isGenerating ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-[#C85A2E]" />
                        <span>Update Dynamic QR</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* How It Works & Verification Steps */}
              <div className="bg-[#141414] border border-[#242321] rounded-2xl p-6 sm:p-7 shadow-xl">
                <h3 className="text-sm font-bold text-[#F4F0E8] uppercase tracking-wider mb-4">
                  2. Payment Steps
                </h3>
                <ol className="space-y-3.5 text-xs text-[#A8A29E]">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#201E1C] border border-[#242321] text-[#C85A2E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Scan the QR code with <b>Google Pay, PhonePe, Paytm, CRED</b>, or BHIM.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#201E1C] border border-[#242321] text-[#C85A2E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <span>
                      Confirm that recipient shows <b>VYOMIK</b> and amount is exact.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#201E1C] border border-[#242321] text-[#C85A2E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <span>
                      Complete transaction with your UPI PIN and return to this page.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-[#201E1C] border border-[#242321] text-[#C85A2E] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      4
                    </span>
                    <span>
                      Our HDFC Bank watcher confirms the credit automatically. Download your receipt instantly.
                    </span>
                  </li>
                </ol>
              </div>

              {/* Zero Manual Upload Notice */}
              <div className="p-4 bg-[#141414] border border-[#242321] rounded-2xl flex items-center gap-3 text-xs text-[#716B63]">
                <ShieldCheck className="w-5 h-5 text-[#C85A2E] shrink-0" />
                <span>
                  No screenshot uploads needed. Verification is handled 100% automatically via HDFC Bank transaction notifications.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      <HomeFooter />
    </div>
  );
};
