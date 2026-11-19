import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { ShopHeroBanner } from '../components/shop-all/ShopHeroBanner';
import { CategoryHorizontalNav } from '../components/shop-all/CategoryHorizontalNav';
import { ShopMainListing } from '../components/shop-all/ShopMainListing';

export const ShopAllPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('cat') || 'all';

  useEffect(() => {
    document.title = 'Shop All — VYOMIK Oversized Essentials';
    try {
      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo(0, 0);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSelectCategory = (catId: string) => {
    if (catId === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] font-montserrat flex flex-col selection:bg-[#A64B2A] selection:text-white overflow-x-hidden">
      {/* 1. Slim Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation Header */}
      <HomeNavbar onSelectCategory={handleSelectCategory} />

      <main className="flex-1 w-full">
        {/* 3. Shop Hero Banner */}
        <ShopHeroBanner />

        {/* 4. Horizontal Category Selector */}
        <CategoryHorizontalNav
          selectedCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 5. Main Product Listing with Left Sidebar & Right Grid */}
        <ShopMainListing
          initialCategory={activeCategory}
        />
      </main>

      {/* 6. Multi-Column Footer */}
      <HomeFooter onSelectCategory={handleSelectCategory} />

      {/* Slide-out Shopping Bag Drawer */}
      <BagDrawer />

      {/* Full-width Search Bar */}
      <SearchBar />
    </div>
  );
};
