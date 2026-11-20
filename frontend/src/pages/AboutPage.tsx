import React, { useEffect } from 'react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { AboutHero } from '../components/about/AboutHero';
import { AboutMeaning } from '../components/about/AboutMeaning';
import { AboutValues } from '../components/about/AboutValues';
import { AboutEmblem3DScene } from '../components/about/AboutEmblem3DScene';
import { AboutMission } from '../components/about/AboutMission';
import { AboutCraft } from '../components/about/AboutCraft';
import { AboutCta } from '../components/about/AboutCta';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';

export const AboutPage: React.FC = () => {
  // Always scroll to top upon mounting the About page
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore in headless test environments
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      {/* 1. Header System: Burnt-orange Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation with Active About Indicator */}
      <HomeNavbar />

      {/* Main Experience — 7 Cinematic Sections */}
      <main className="flex-1 w-full flex flex-col">
        {/* Section One: Cinematic About Hero (Split Editorial Layout) */}
        <AboutHero />

        {/* Section Two: The Meaning Behind VYOMIK (Mountains & Brand Story) */}
        <AboutMeaning />

        {/* Section Three: Our Values (4 Centered Pillars with Ivory Icons) */}
        <AboutValues />

        {/* Section Four: Signature 3D Brand Emblem Scene (Three.js Extruded Emblem & Sunrise Arc) */}
        <AboutEmblem3DScene />

        {/* Section Five: Our Mission (Clothing With Purpose) */}
        <AboutMission />

        {/* Section Six: The Craft / Fabric Detail (Macro Tactile Textile with Brand Print) */}
        <AboutCraft />

        {/* Section Seven: Final Call to Action (Cinematic Mountains & Explore Collections) */}
        <AboutCta />
      </main>

      {/* Official Brand Footer */}
      <HomeFooter />

      {/* Global Interactive Overlays */}
      <SearchBar />
      <BagDrawer />
    </div>
  );
};

