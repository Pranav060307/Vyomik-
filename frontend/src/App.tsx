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
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PaymentPage } from './pages/PaymentPage';
import { ProfilePage } from './pages/ProfilePage';
import { useLaunchGate } from './hooks/useLaunchGate';

// Admin Console Components & Pages
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { AdminRouteGuard } from './admin/components/AdminRouteGuard';
import { AdminLayout } from './admin/components/AdminLayout';
import { AdminLoginPage } from './admin/pages/AdminLoginPage';
import { AdminDashboardPage } from './admin/pages/AdminDashboardPage';
import { AdminOrdersPage } from './admin/pages/AdminOrdersPage';
import { AdminProductsPage } from './admin/pages/AdminProductsPage';
import { AdminInventoryPage } from './admin/pages/AdminInventoryPage';
import { AdminCustomersPage } from './admin/pages/AdminCustomersPage';
import { AdminFulfillmentPage } from './admin/pages/AdminFulfillmentPage';
import { AdminDiscountsPage } from './admin/pages/AdminDiscountsPage';
import { AdminReviewsPage } from './admin/pages/AdminReviewsPage';
import { AdminContentPage } from './admin/pages/AdminContentPage';
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage';
import { AdminPaymentsPage } from './admin/pages/AdminPaymentsPage';

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
    <AdminAuthProvider>
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

        {/* Product Detail Page (PDP) */}
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/shop/products/:slug" element={<ProductDetailPage />} />
        <Route path="/shop/:category/:slug" element={<ProductDetailPage />} />

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

        {/* Customer Profile & Order History */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/account" element={<ProfilePage />} />
        <Route path="/orders" element={<ProfilePage />} />

        {/* Direct deep links */}
        <Route path="/bag" element={<BagPage />} />
        <Route path="/cart" element={<BagPage />} />
        <Route path="/payment/:orderNumber" element={<PaymentPage />} />
        <Route path="/checkout/payment/:orderNumber" element={<PaymentPage />} />
        <Route path="/about" element={<OurStoryPage />} />
        <Route path="/our-story" element={<OurStoryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-of-service" element={<TermsPage />} />

        {/* Admin Operations Console Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="inventory" element={<AdminInventoryPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="fulfillment" element={<AdminFulfillmentPage />} />
          <Route path="discounts" element={<AdminDiscountsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<RootGateRoute />} />
      </Routes>
    </AdminAuthProvider>
  );
};
