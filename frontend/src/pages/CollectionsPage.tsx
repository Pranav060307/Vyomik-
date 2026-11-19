import React, { useEffect } from 'react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { CollectionsHero } from '../components/collections/CollectionsHero';
import { CollectionCardsGrid } from '../components/collections/CollectionCardsGrid';
import { CollectionsValuesStrip } from '../components/collections/CollectionsValuesStrip';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';

export const CollectionsPage: React.FC = () => {
  // Ensure page scrolls to top on navigation
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore in environments without window.scrollTo
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#C85A2E] selection:text-white">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Primary Navigation Bar */}
      <HomeNavbar />

      {/* 3. Main Collections Experience */}
      <main className="flex-1 w-full">
        {/* Cinematic 3D Garment Exhibition Hero with Orbital Ring & Volcanic Rock Pedestal */}
        <CollectionsHero />

        {/* 4 Large Collection Cards in Single Row with Signature Orange Neon Glow on Core Elements */}
        <CollectionCardsGrid />

        {/* 4-Pillar Brand Values Trust Strip */}
        <CollectionsValuesStrip />
      </main>

      {/* 4. Official Brand Footer */}
      <HomeFooter />

      {/* Global Interactive Overlays */}
      <SearchBar />
      <BagDrawer />
    </div>
  );
};
