import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { HeroSection } from '../components/landing/HeroSection';
import { CategoryEditSection } from '../components/landing/CategoryEditSection';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';

export const LandingPage: React.FC = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState('hero_cta');
  const [isBagOpen, setIsBagOpen] = useState(false);

  const handleOpenWaitlist = (source: string = 'hero_cta') => {
    setWaitlistSource(source);
    setIsWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EE] text-[#202020]">
      {/* 1. Announcement Bar (Olive) */}
      <AnnouncementBar />

      {/* 2. Header (Wordmark left, links right) */}
      <Header
        bagCount={0}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenNotifyModal={() => handleOpenWaitlist('header_nav')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Hero Section (Split layout with headline, CTA, and color-swapping model) */}
        <HeroSection onOpenNotifyModal={handleOpenWaitlist} />

        {/* 4. The Everyday Edit (3 Category Cards + Inline Expandable Coming Soon Panel) */}
        <CategoryEditSection onOpenNotifyModal={handleOpenWaitlist} />
      </main>

      {/* 5. Footer (Charcoal with brand statement, links) */}
      <Footer onOpenNotifyModal={() => handleOpenWaitlist('footer')} />

      {/* Interactive Modals & Overlays */}
      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource={waitlistSource}
      />

      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => handleOpenWaitlist('bag_drawer')}
      />
    </div>
  );
};

