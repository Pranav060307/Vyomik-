import React from 'react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';
import { ArrowUpRight, Mail } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B0B] text-[#F4F0E8] font-montserrat selection:bg-[#C85A2E] selection:text-white">
      <AnnouncementBar />
      <HomeNavbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="mb-12">
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#C85A2E] block mb-3">
            TERMS & CONDITIONS
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#F4F0E8] leading-tight">
            Terms of Service
          </h1>
          <p className="text-xs uppercase tracking-wider text-[#716B63] mt-2">
            Last Updated: November 2026
          </p>
        </div>

        <div className="space-y-8 bg-[#141414] border border-[#242321] p-6 sm:p-10 rounded-2xl text-sm text-[#A8A29E] leading-relaxed">
          <section className="space-y-3 pb-6 border-b border-[#242321]/60">
            <h2 className="text-lg font-bold text-[#F4F0E8]">1. Store Overview</h2>
            <p>
              This website is operated by VYOMIK. Throughout the site, terms "we", "us", and "our" refer to VYOMIK clothing brand. By browsing, joining our waitlist, or purchasing our garments, you engage in our service and agree to be bound by these terms.
            </p>
          </section>

          <section className="space-y-3 pb-6 border-b border-[#242321]/60">
            <h2 className="text-lg font-bold text-[#F4F0E8]">2. Products & Pricing</h2>
            <p>
              All prices are displayed in Indian Rupees (INR) inclusive of applicable taxes. We reserve the right to limit sales of products to any geographic region or jurisdiction across India.
            </p>
          </section>

          <section className="space-y-3 pb-6 border-b border-[#242321]/60">
            <h2 className="text-lg font-bold text-[#F4F0E8]">3. Intellectual Property</h2>
            <p>
              All visual trademarks, brand signatures, typography treatments, garment silhouettes, editorial images, and copy on this platform are proprietary to VYOMIK.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#F4F0E8]">4. Contact Details</h2>
            <p>
              Questions regarding these Terms of Service should be directed to{' '}
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="font-semibold text-[#F4F0E8] underline hover:text-[#C85A2E] transition-colors inline-flex items-center gap-1"
              >
                <Mail className="w-3.5 h-3.5 text-[#C85A2E] inline" />
                <span>{contactEmail}</span>
              </a>{' '}
              or via Instagram at{' '}
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
          </section>
        </div>
      </main>

      <HomeFooter />
      <SearchBar />
      <BagDrawer />
    </div>
  );
};
