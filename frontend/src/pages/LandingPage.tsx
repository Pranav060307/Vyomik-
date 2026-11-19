import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HeroSection } from '../components/home/HeroSection';
import { TrustBenefitsStrip } from '../components/home/TrustBenefitsStrip';
import { NewArrivalsCategories } from '../components/home/NewArrivalsCategories';
import { FeaturedCollectionShowcase } from '../components/home/FeaturedCollectionShowcase';
import { ExploreCollectionsSection } from '../components/home/ExploreCollectionsSection';
import { BrandBenefitsStrip } from '../components/home/BrandBenefitsStrip';
import { NewsletterSection } from '../components/home/NewsletterSection';
import { HomeFooter } from '../components/home/HomeFooter';
import { SearchBar } from '../components/shop/SearchBar';
import { BagDrawer } from '../components/shop/BagDrawer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectCategory = (cat: string) => {
    navigate(`/collections?cat=${cat}`);
  };

  const handleSelectCollection = (collectionId: string) => {
    navigate(`/collections?collection=${collectionId}`);
  };

  const handleShop = () => {
    navigate('/collections');
  };

  const handleStory = () => {
    navigate('/our-story');
  };

  return (
    <div className="w-full min-h-screen bg-[#0B0B0B] text-[#F4F0E8] font-montserrat flex flex-col relative overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      {/* 1 & 2. Announcement Bar & Sticky Main Navbar */}
      <header className="sticky top-0 z-40 w-full flex flex-col shadow-md">
        <AnnouncementBar />
        <HomeNavbar onSelectCategory={handleSelectCategory} />
      </header>

      {/* Main Page Content */}
      <main className="w-full flex-1 flex flex-col">
        {/* 3. Hero Showcase */}
        <HeroSection onShopClick={handleShop} onStoryClick={handleStory} />

        {/* 4. Trust & Benefits Strip */}
        <TrustBenefitsStrip />

        {/* 5. New Arrivals by Category */}
        <NewArrivalsCategories onSelectCategory={handleSelectCategory} />

        {/* 6. Core Elements Interactive 3D Perspective Showcase */}
        <FeaturedCollectionShowcase />

        {/* 7. Explore Collections */}
        <ExploreCollectionsSection onSelectCollection={handleSelectCollection} />

        {/* 8. Brand Highlights Strip */}
        <BrandBenefitsStrip />

        {/* 9. Join The VYOMIK Collective (Newsletter) */}
        <NewsletterSection />
      </main>

      {/* 10. Multi-Column Editorial Footer */}
      <HomeFooter onSelectCategory={handleSelectCategory} />

      {/* Global Modals / Drawers */}
      <SearchBar />
      <BagDrawer />
    </div>
  );
};
