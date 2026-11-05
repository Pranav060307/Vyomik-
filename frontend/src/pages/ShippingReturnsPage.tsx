import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EE] text-[#202020]">
      <AnnouncementBar />
      <Header
        bagCount={0}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenNotifyModal={() => setIsWaitlistOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-16 md:py-24">
        {/* Header Block */}
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5C6548] block mb-3">
            LOGISTICS & POLICIES
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#202020] leading-[1.08]">
            Shipping & Returns
          </h1>
          <p className="text-base sm:text-lg text-[#202020]/80 mt-4 leading-relaxed max-w-[65ch]">
            Straightforward logistics engineered for reliability. Every garment is carefully inspected, packed in biodegradable mailers, and shipped across India.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          <div className="border border-[#DAD7CE] bg-white p-6 sm:p-8">
            <Truck className="w-6 h-6 text-[#5C6548] mb-4" />
            <h2 className="text-lg font-semibold text-[#202020] mb-2">Pan-India Delivery</h2>
            <p className="text-xs text-[#202020]/70 leading-relaxed">
              Standard shipping takes 3–6 business days across India. Free shipping applies automatically to all orders above ₹1,499. Orders below ₹1,499 carry a flat ₹99 shipping fee.
            </p>
          </div>

          <div className="border border-[#DAD7CE] bg-white p-6 sm:p-8">
            <RotateCcw className="w-6 h-6 text-[#5C6548] mb-4" />
            <h2 className="text-lg font-semibold text-[#202020] mb-2">7-Day Easy Returns</h2>
            <p className="text-xs text-[#202020]/70 leading-relaxed">
              Unworn items with tags intact can be returned or exchanged within 7 days of delivery. Doorstep reverse pickup is arranged seamlessly across serviceable pincodes.
            </p>
          </div>

          <div className="border border-[#DAD7CE] bg-white p-6 sm:p-8">
            <ShieldCheck className="w-6 h-6 text-[#5C6548] mb-4" />
            <h2 className="text-lg font-semibold text-[#202020] mb-2">Cash on Delivery</h2>
            <p className="text-xs text-[#202020]/70 leading-relaxed">
              Cash on delivery is supported for all serviceable pincodes across India with a nominal handling fee of ₹49.
            </p>
          </div>
        </div>

        {/* Support Section */}
        <div className="border border-[#DAD7CE] bg-[#FAF9F6] p-8 sm:p-10 space-y-4">
          <h3 className="text-xl font-semibold text-[#202020]">
            Initiate a Return or Exchange
          </h3>
          <p className="text-xs sm:text-sm text-[#202020]/80 leading-relaxed max-w-[65ch]">
            To start a return or report an issue with your delivery, contact our concierge at{' '}
            <a
              href={mailtoUrl}
              aria-label="Email VYOMIK"
              className="font-medium text-[#202020] underline hover:text-[#5C6548] transition-colors"
            >
              {contactEmail}
            </a>{' '}
            with your order reference number. You may also direct message us on Instagram at{' '}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VYOMIK on Instagram"
              className="inline-flex items-center space-x-1 font-medium text-[#202020] underline hover:text-[#5C6548] transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-current inline" />
              <span>{instagramHandle} ↗</span>
            </a>.
          </p>
        </div>
      </main>

      <Footer onOpenNotifyModal={() => setIsWaitlistOpen(true)} />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource="shipping_page"
      />
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
    </div>
  );
};
