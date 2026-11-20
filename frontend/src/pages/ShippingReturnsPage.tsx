import React from 'react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { Truck, RotateCcw, ShieldCheck, Mail, ArrowUpRight } from 'lucide-react';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#F4F0E8] font-montserrat selection:bg-[#C85A2E] selection:text-white">
      {/* 1. Header System */}
      <AnnouncementBar />
      <HomeNavbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Header Block */}
        <div className="max-w-2xl mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C85A2E] block mb-3">
            LOGISTICS & POLICIES
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F4F0E8] leading-tight">
            Shipping & Returns
          </h1>
          <p className="text-sm sm:text-base text-[#A8A29E] mt-4 leading-relaxed">
            Straightforward logistics engineered for reliability. Every garment is carefully inspected, packed in biodegradable mailers, and shipped across India.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-[#242321] bg-[#141414] p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] border border-[#242321] flex items-center justify-center mb-5 text-[#C85A2E]">
                <Truck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F0E8] mb-2">Pan-India Delivery</h2>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Standard shipping takes 3–6 business days across India. Free shipping applies automatically to all orders above ₹1,499. Orders below ₹1,499 carry a flat ₹99 shipping fee.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#242321] text-[11px] font-bold uppercase tracking-wider text-[#C85A2E]">
              Tracked via BlueDart & Delhivery
            </div>
          </div>

          <div className="border border-[#242321] bg-[#141414] p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] border border-[#242321] flex items-center justify-center mb-5 text-[#C85A2E]">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F0E8] mb-2">7-Day Easy Returns</h2>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Unworn items with tags intact can be returned or exchanged within 7 days of delivery. Doorstep reverse pickup is arranged seamlessly across serviceable pincodes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#242321] text-[11px] font-bold uppercase tracking-wider text-[#C85A2E]">
              Hassle-Free Doorstep Pickup
            </div>
          </div>

          <div className="border border-[#242321] bg-[#141414] p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#0B0B0B] border border-[#242321] flex items-center justify-center mb-5 text-[#C85A2E]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-[#F4F0E8] mb-2">Cash on Delivery</h2>
              <p className="text-xs text-[#716B63] leading-relaxed">
                Cash on delivery is supported for all serviceable pincodes across India with a nominal handling fee of ₹49. UPI, Cards & NetBanking have zero extra fees.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#242321] text-[11px] font-bold uppercase tracking-wider text-[#C85A2E]">
              100% Encrypted & Safe
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="border border-[#242321] bg-[#141414] p-8 sm:p-10 rounded-2xl space-y-4">
          <h3 className="text-xl font-bold text-[#F4F0E8]">
            Initiate a Return or Exchange
          </h3>
          <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed max-w-2xl">
            To start a return or report an issue with your delivery, contact our concierge at{' '}
            <a
              href={mailtoUrl}
              aria-label="Email VYOMIK"
              className="font-semibold text-[#F4F0E8] underline hover:text-[#C85A2E] transition-colors inline-flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 inline text-[#C85A2E]" />
              <span>{contactEmail}</span>
            </a>{' '}
            with your order reference number. You may also direct message us on Instagram at{' '}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VYOMIK on Instagram"
              className="inline-flex items-center gap-1 font-semibold text-[#F4F0E8] underline hover:text-[#C85A2E] transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-[#C85A2E] inline" />
              <span>{instagramHandle}</span>
              <ArrowUpRight className="w-3 h-3 text-[#C85A2E]" />
            </a>.
          </p>
        </div>
      </main>

      <HomeFooter />
      <SearchBar />
      <BagDrawer />
    </div>
  );
};
