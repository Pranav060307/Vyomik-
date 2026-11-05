import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const TermsPage: React.FC = () => {
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
        <div className="max-w-3xl mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#5C6548] block mb-3">
            TERMS & CONDITIONS
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#202020] leading-[1.08]">
            Terms of Service
          </h1>
          <p className="text-xs uppercase tracking-wider text-[#202020]/60 mt-2">
            Last Updated: November 2026
          </p>
        </div>

        <div className="max-w-3xl space-y-8 text-sm text-[#202020]/80 leading-relaxed border-t border-[#DAD7CE] pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">1. Store Overview</h2>
            <p>
              This website is operated by VYOMIK. Throughout the site, terms "we", "us", and "our" refer to VYOMIK clothing brand. By browsing, joining our waitlist, or purchasing our garments, you engage in our service and agree to be bound by these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">2. Products & Pricing</h2>
            <p>
              All prices are displayed in Indian Rupees (INR) inclusive of applicable taxes. We reserve the right to limit sales of products to any geographic region or jurisdiction across India.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">3. Intellectual Property</h2>
            <p>
              All visual trademarks, brand signatures, typography treatments, garment silhouettes, editorial images, and copy on this platform are proprietary to VYOMIK.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">4. Contact Details</h2>
            <p>
              Questions regarding these Terms of Service should be directed to{' '}
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="font-medium text-[#202020] underline hover:text-[#5C6548] transition-colors"
              >
                {contactEmail}
              </a>{' '}
              or via Instagram at{' '}
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
          </section>
        </div>
      </main>

      <Footer onOpenNotifyModal={() => setIsWaitlistOpen(true)} />
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource="terms_page"
      />
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
    </div>
  );
};
