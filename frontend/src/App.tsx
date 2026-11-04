import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { ComingSoon } from './pages/ComingSoon';
import { useLaunchGate } from './hooks/useLaunchGate';

/**
 * Gate-aware root route component.
 * Renders ComingSoon when pre-launch gate is active;
 * Otherwise seamlessly renders normal LandingPage.
 */
export const RootGateRoute: React.FC = () => {
  const { isGateActive } = useLaunchGate();
  if (isGateActive) {
    return <ComingSoon />;
  }
  return <LandingPage />;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Root route: gated before launch / explore click */}
      <Route path="/" element={<RootGateRoute />} />

      {/* Main landing page: always reachable directly or from Explore */}
      <Route path="/home" element={<LandingPage />} />

      {/* Direct deep links: never blocked by the gate */}
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/our-story" element={<OurStoryPage />} />

      {/* Catch-all */}
      <Route path="*" element={<RootGateRoute />} />
    </Routes>
  );
};
