import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ShopAllPage } from './pages/ShopAllPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { SignUpPage } from './pages/SignUpPage';
import { SignInPage } from './pages/SignInPage';
import { OurStoryPage } from './pages/OurStoryPage';
import { ContactPage } from './pages/ContactPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { ComingSoon } from './pages/ComingSoon';
import { BagPage } from './pages/BagPage';
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

      {/* Direct Coming Soon view */}
      <Route path="/coming-soon" element={<ComingSoon />} />

      {/* Main landing page: always reachable directly or from Explore */}
      <Route path="/home" element={<LandingPage />} />

      {/* Shop All Catalog Route */}
      <Route path="/shop" element={<ShopAllPage />} />
      <Route path="/shop-all" element={<ShopAllPage />} />

      {/* Collections & New Arrivals */}
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/drops" element={<CollectionsPage />} />
      <Route path="/new-arrivals" element={<CollectionsPage />} />

      {/* Authentication routes */}
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/login" element={<SignInPage />} />

      {/* Direct deep links */}
      <Route path="/bag" element={<BagPage />} />
      <Route path="/cart" element={<BagPage />} />
      <Route path="/our-story" element={<OurStoryPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="/terms-of-service" element={<TermsPage />} />

      {/* Catch-all */}
      <Route path="*" element={<RootGateRoute />} />
    </Routes>
  );
};
