import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../config/brand';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const PrivacyPolicyPage: React.FC = () => {
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
            LEGAL TRANSPARENCY
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#202020] leading-[1.08]">
            Privacy Policy
          </h1>
          <p className="text-xs uppercase tracking-wider text-[#202020]/60 mt-2">
            Last Updated: November 2026
          </p>
        </div>

        <div className="max-w-3xl space-y-8 text-sm text-[#202020]/80 leading-relaxed border-t border-[#DAD7CE] pt-8">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">1. Introduction</h2>
            <p>
              VYOMIK ("we", "our", or "the brand") respects your privacy and is committed to protecting your personal information. This Privacy Policy outlines how your data is collected, utilized, and safeguarded when you visit our website or subscribe to our First Drop early access list.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">2. Information We Collect</h2>
            <p>
              When subscribing to our launch waitlist or placing an order, we collect your email address, recipient name, contact telephone, and delivery address. We never store raw payment card details on our servers; all transactions are processed through certified and compliant payment infrastructure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">3. How We Use Your Information</h2>
            <p>
              We process your details exclusively to provide drop announcements, fulfill orders, facilitate customer support, and communicate tracking notifications. We will never sell, lease, or monetize your contact information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#202020]">4. Contact & Inquiries</h2>
            <p>
              For any questions regarding your personal information, data deletion requests, or our privacy practices, please contact us at{' '}
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="font-medium text-[#202020] underline hover:text-[#5C6548] transition-colors"
              >
                {contactEmail}
              </a>{' '}
              or connect with us via Instagram at{' '}
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
        initialSource="privacy_page"
      />
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => setIsWaitlistOpen(true)}
      />
    </div>
  );
};

