import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { OurStoryPage } from './pages/OurStoryPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/our-story" element={<OurStoryPage />} />
      {/* Catch-all redirect to landing */}
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
};
