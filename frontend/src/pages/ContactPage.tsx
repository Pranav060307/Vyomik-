import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const ContactPage: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isBagOpen, setIsBagOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#F4F0E8] font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white text-left">
      <AnnouncementBar />
      <HomeNavbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16">
        {/* Header Block */}
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C85A2E] block mb-2.5">
            ASSISTANCE & INQUIRIES
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F4F0E8] leading-tight">
            We are here to assist<span className="text-[#C85A2E]">.</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#A8A29E] mt-3 leading-relaxed max-w-[65ch]">
            Have inquiries regarding sizing, fabric compositions, the First Drop launch, or press collaborations? Reach out directly through our channels below.
          </p>
        </div>

        {/* 3 Contact Channels Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email Support Card */}
          <div className="border border-[#242321] bg-[#141414] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#242321] flex items-center justify-center text-[#C85A2E] mb-5">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C85A2E] block mb-2">
                DIRECT INQUIRIES
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#F4F0E8] mb-2">
                Email Customer Care
              </h2>
              <p className="text-xs text-[#716B63] leading-relaxed mb-6">
                For order support, sizing advice, returns, or corporate correspondence.
              </p>
            </div>
            <div className="pt-4 border-t border-[#242321]">
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="text-xs font-semibold text-[#F4F0E8] hover:text-[#C85A2E] transition-colors flex items-center justify-between group"
              >
                <span>{contactEmail}</span>
                <ArrowUpRight className="w-4 h-4 text-[#716B63] group-hover:text-[#C85A2E] transition-colors" />
              </a>
            </div>
          </div>

          {/* Instagram Community Card */}
          <div className="border border-[#242321] bg-[#141414] rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#242321] flex items-center justify-center text-[#C85A2E] mb-5">
                <InstagramIcon className="w-5 h-5 text-current" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C85A2E] block mb-2">
                OFFICIAL CHANNEL
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#F4F0E8] mb-2">
                Instagram Journal
              </h2>
              <p className="text-xs text-[#716B63] leading-relaxed mb-6">
                Drop announcements, visual previews, editorial stories, and community direct messages.
              </p>
            </div>
            <div className="pt-4 border-t border-[#242321]">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on Instagram"
                className="text-xs font-semibold text-[#F4F0E8] hover:text-[#C85A2E] transition-colors flex items-center justify-between group"
              >
                <span>{instagramHandle}</span>
                <span className="text-[11px] tracking-wider uppercase text-[#716B63] group-hover:text-[#C85A2E]">Follow ↗</span>
              </a>
            </div>
          </div>

          {/* Response Commitment Card */}
          <div className="border border-[#242321] bg-[#141414] rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-md">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0B0B0B] border border-[#242321] flex items-center justify-center text-[#C85A2E] mb-5">
                <Clock className="w-5 h-5 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C85A2E] block mb-2">
                RESPONSE TIME
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#F4F0E8] mb-2">
                24–48 Business Hours
              </h2>
              <p className="text-xs text-[#716B63] leading-relaxed mb-6">
                Our support team attends to all customer inquiries Monday through Saturday.
              </p>
            </div>
            <div className="pt-4 border-t border-[#242321] flex items-center space-x-2 text-xs text-[#C85A2E]">
              <ShieldCheck className="w-4 h-4 stroke-[1.75]" />
              <span className="font-semibold text-[11px]">Every inquiry answered</span>
            </div>
          </div>
        </div>

        {/* Helpful Resources Navigation */}
        <div className="border border-[#242321] bg-[#141414] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
          <div className="max-w-xl">
            <h3 className="text-base sm:text-lg font-bold text-[#F4F0E8]">
              Need policy or shipping information?
            </h3>
            <p className="text-xs text-[#716B63] mt-1 leading-relaxed">
              Find transparent information about pan-India deliveries, reverse pickups, and data privacy.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wider">
            <Link
              to="/shipping-returns"
              className="px-4 py-2.5 rounded-xl border border-[#242321] bg-[#0B0B0B] text-[#D9D1C3] hover:text-white hover:border-[#C85A2E] transition-colors"
            >
              Shipping & Returns ↗
            </Link>
            <Link
              to="/privacy-policy"
              className="px-4 py-2.5 rounded-xl border border-[#242321] bg-[#0B0B0B] text-[#D9D1C3] hover:text-white hover:border-[#C85A2E] transition-colors"
            >
              Privacy Policy ↗
            </Link>
          </div>
        </div>
      </main>

      <HomeFooter />
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
      <SearchBar />
    </div>
  );
};
