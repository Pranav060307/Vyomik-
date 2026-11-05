import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
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
        <div className="max-w-3xl mb-12 md:mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5C6548] block mb-3">
            ASSISTANCE & INQUIRIES
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#202020] leading-[1.08] text-balance">
            We are here to assist.
          </h1>
          <p className="text-base sm:text-lg text-[#202020]/80 mt-4 leading-relaxed max-w-[65ch]">
            Have inquiries regarding sizing, fabric compositions, the First Drop launch, or press collaborations? Reach out directly through our channels below.
          </p>
        </div>

        {/* 3 Contact Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-16">
          {/* Email Support Card */}
          <div className="border border-[#DAD7CE] bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-[#202020] transition-colors">
            <div>
              <div className="w-10 h-10 border border-[#DAD7CE] flex items-center justify-center text-[#5C6548] mb-6">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548] block mb-2">
                DIRECT INQUIRIES
              </span>
              <h2 className="text-lg font-semibold text-[#202020] mb-2">
                Email Customer Care
              </h2>
              <p className="text-xs text-[#202020]/70 leading-relaxed mb-6">
                For order support, sizing advice, returns, or corporate correspondence.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DAD7CE]">
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="text-sm font-medium text-[#202020] hover:text-[#5C6548] transition-colors flex items-center justify-between group"
              >
                <span>{contactEmail}</span>
                <ArrowUpRight className="w-4 h-4 text-[#202020]/40 group-hover:text-[#5C6548] transition-colors" />
              </a>
            </div>
          </div>

          {/* Instagram Community Card */}
          <div className="border border-[#DAD7CE] bg-white p-6 sm:p-8 flex flex-col justify-between hover:border-[#202020] transition-colors">
            <div>
              <div className="w-10 h-10 border border-[#DAD7CE] flex items-center justify-center text-[#5C6548] mb-6">
                <InstagramIcon className="w-5 h-5 text-current" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548] block mb-2">
                OFFICIAL CHANNEL
              </span>
              <h2 className="text-lg font-semibold text-[#202020] mb-2">
                Instagram Journal
              </h2>
              <p className="text-xs text-[#202020]/70 leading-relaxed mb-6">
                Drop announcements, visual previews, editorial stories, and community direct messages.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DAD7CE]">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on Instagram"
                className="text-sm font-medium text-[#202020] hover:text-[#5C6548] transition-colors flex items-center justify-between group"
              >
                <span>{instagramHandle}</span>
                <span className="text-xs tracking-wider uppercase text-[#202020]/60 group-hover:text-[#5C6548]">Follow ↗</span>
              </a>
            </div>
          </div>

          {/* Response Commitment Card */}
          <div className="border border-[#DAD7CE] bg-[#FAF9F6] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 border border-[#DAD7CE] flex items-center justify-center text-[#5C6548] mb-6">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548] block mb-2">
                RESPONSE TIME
              </span>
              <h2 className="text-lg font-semibold text-[#202020] mb-2">
                24–48 Business Hours
              </h2>
              <p className="text-xs text-[#202020]/70 leading-relaxed mb-6">
                Our support team attends to all customer inquiries Monday through Saturday.
              </p>
            </div>
            <div className="pt-4 border-t border-[#DAD7CE] flex items-center space-x-2 text-xs text-[#5C6548]">
              <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
              <span className="font-medium">Every communication answered</span>
            </div>
          </div>
        </div>

        {/* Helpful Resources Navigation */}
        <div className="border border-[#DAD7CE] bg-white p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-semibold text-[#202020]">
              Need policy or shipping information?
            </h3>
            <p className="text-xs sm:text-sm text-[#202020]/70 mt-1 leading-relaxed">
              Find transparent information about pan-India deliveries, reverse pickups, and data privacy.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.16em]">
            <Link
              to="/shipping-returns"
              className="px-5 py-3 border border-[#DAD7CE] text-[#202020] hover:border-[#202020] transition-colors"
            >
              Shipping & Returns ↗
            </Link>
            <Link
              to="/privacy-policy"
              className="px-5 py-3 border border-[#DAD7CE] text-[#202020] hover:border-[#202020] transition-colors"
            >
              Privacy Policy ↗
            </Link>
          </div>
        </div>
      </main>

      <Footer onOpenNotifyModal={() => setIsWaitlistOpen(true)} />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource="contact_page"
      />
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
    </div>
  );
};
