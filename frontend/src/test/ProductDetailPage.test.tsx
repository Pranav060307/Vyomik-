import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('VYOMIK — Product Detail Page (PDP) Full Implementation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockNavigate.mockClear();
    localStorage.clear();
  });

  const renderProductDetailPage = (slug = 'core-hoodie-ivory') => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <MemoryRouter initialEntries={[`/product/${slug}`]}>
                <Routes>
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                </Routes>
              </MemoryRouter>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('1. renders Announcement Bar, Main Navigation with active Shop state, and Footer', () => {
    renderProductDetailPage();

    // Announcement bar (both desktop & mobile nodes rendered in DOM)
    expect(
      screen.getAllByText(/Free Shipping on Orders Above ₹1,499/i).length
    ).toBeGreaterThan(0);

    // Nav brand logo / links
    expect(screen.getAllByAltText('VYOMIK').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Home/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Shop' })).toBeInTheDocument();

    // Footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(
      screen.getByText(/Modern streetwear for a generation/i)
    ).toBeInTheDocument();
  });

  it('2. renders Breadcrumbs correctly with links', () => {
    renderProductDetailPage();

    const breadcrumbNav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(breadcrumbNav).toBeInTheDocument();
    expect(breadcrumbNav).toHaveTextContent('Home');
    expect(breadcrumbNav).toHaveTextContent('Shop');
    expect(breadcrumbNav).toHaveTextContent('Hoodies');
    expect(breadcrumbNav).toHaveTextContent('Core Hoodie – Ivory');
  });

  it('3. renders 3-column layout components (Thumbnails, Pedestal Image, Purchase Panel)', () => {
    renderProductDetailPage();

    // Thumbnails strip
    const thumbnailList = screen.getByRole('tablist', {
      name: /Product image thumbnails/i,
    });
    expect(thumbnailList).toBeInTheDocument();
    const thumbnails = screen.getAllByRole('tab', {
      name: /Core Hoodie – Ivory thumbnail/i,
    });
    expect(thumbnails.length).toBe(5);

    // Pedestal showcase image
    const mainImages = screen.getAllByAltText('Core Hoodie – Ivory');
    expect(mainImages.length).toBeGreaterThan(0);

    // Purchase Panel Details
    expect(screen.getByText('New Launch')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Core Hoodie – Ivory' })
    ).toBeInTheDocument();
    expect(screen.getAllByText('₹2,499').length).toBeGreaterThan(0);
    expect(screen.getByText('₹2,999')).toBeInTheDocument();
    expect(screen.getByText('17% OFF')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(124 Reviews)')).toBeInTheDocument();
  });

  it('4. allows selecting thumbnails to switch the active image', () => {
    renderProductDetailPage();

    const thumbnails = screen.getAllByRole('tab', {
      name: /Core Hoodie – Ivory thumbnail/i,
    });

    // Click 2nd thumbnail (Back view)
    fireEvent.click(thumbnails[1]);
    expect(thumbnails[1]).toHaveAttribute('aria-selected', 'true');

    // Click 3rd thumbnail (Emblem detail)
    fireEvent.click(thumbnails[2]);
    expect(thumbnails[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('5. allows selecting color swatches and updates color name', () => {
    renderProductDetailPage();

    expect(screen.getByText('Color:')).toBeInTheDocument();
    expect(screen.getByText('Ivory')).toBeInTheDocument();

    const burntRustSwatch = screen.getByRole('radio', { name: 'Burnt Rust' });
    fireEvent.click(burntRustSwatch);
    expect(screen.getByText('Burnt Rust')).toBeInTheDocument();
  });

  it('6. allows selecting sizes and shows active size state', () => {
    renderProductDetailPage();

    const sizeM = screen.getByRole('radio', { name: 'M' });
    expect(sizeM).toHaveAttribute('aria-checked', 'true');

    const sizeL = screen.getByRole('radio', { name: 'L' });
    fireEvent.click(sizeL);
    expect(sizeL).toHaveAttribute('aria-checked', 'true');
  });

  it('7. controls quantity with minus and plus buttons', () => {
    renderProductDetailPage();

    const decrementBtn = screen.getByRole('button', { name: /Decrease quantity/i });
    const incrementBtn = screen.getByRole('button', { name: /Increase quantity/i });

    // Initial quantity is 1
    expect(decrementBtn).toBeDisabled();

    // Increment to 2
    fireEvent.click(incrementBtn);
    expect(decrementBtn).not.toBeDisabled();

    // Decrement back to 1
    fireEvent.click(decrementBtn);
    expect(decrementBtn).toBeDisabled();
  });

  it('8. opens and closes the interactive Size Chart Modal with CM/IN conversion', () => {
    renderProductDetailPage();

    // Size Chart modal is initially closed
    expect(screen.queryByRole('dialog', { name: /Size Chart/i })).not.toBeInTheDocument();

    // Click "Size Chart" button
    const openChartBtn = screen.getByRole('button', { name: /Open Size Chart Modal/i });
    fireEvent.click(openChartBtn);

    // Modal is now open
    const modal = screen.getByRole('dialog', { name: /Size Chart/i });
    expect(modal).toBeInTheDocument();

    // Check table headers and measurements
    expect(screen.getAllByText(/Chest/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Shoulder/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sleeve/i).length).toBeGreaterThan(0);

    // CM is default unit (96 for XS)
    expect(screen.getByText('96')).toBeInTheDocument();

    // Switch to IN
    const inButton = screen.getByRole('radio', { name: 'in' });
    fireEvent.click(inButton);
    expect(screen.getByText('37.8')).toBeInTheDocument();

    // Check "How to Measure" instructions
    expect(screen.getByText(/How to Measure/i)).toBeInTheDocument();
    expect(screen.getByText(/Measure around the fullest part of your chest/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole('button', { name: /Close size chart/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: /Size Chart/i })).not.toBeInTheDocument();
  });

  it('9. switches between Product Details, Fabric & Care, Shipping & Returns, and Reviews tabs', () => {
    renderProductDetailPage();

    // Default tab is Product Details
    expect(screen.getByRole('tab', { name: 'Product Details' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByText(/Premium cotton blend \(320 GSM\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Relaxed unisex fit/i)).toBeInTheDocument();

    // Switch to Fabric & Care
    const fabricTab = screen.getByRole('tab', { name: 'Fabric & Care' });
    fireEvent.click(fabricTab);
    expect(fabricTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Material & Construction/i)).toBeInTheDocument();
    expect(screen.getByText(/Care Instructions/i)).toBeInTheDocument();

    // Switch to Shipping & Returns
    const shippingTab = screen.getByRole('tab', { name: 'Shipping & Returns' });
    fireEvent.click(shippingTab);
    expect(shippingTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/7-Day Hassle-Free Returns/i)).toBeInTheDocument();

    // Switch to Reviews
    const reviewsTab = screen.getByRole('tab', { name: /Reviews \(124\)/i });
    fireEvent.click(reviewsTab);
    expect(reviewsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText(/Rahul M./i)).toBeInTheDocument();
    expect(screen.getByText(/Ananya S./i)).toBeInTheDocument();
  });

  it('10. renders "YOU MAY ALSO LIKE" section with 5 recommended products', () => {
    renderProductDetailPage();

    expect(screen.getByText('YOU MAY ALSO LIKE')).toBeInTheDocument();
    expect(screen.getByText('Core Hoodie – Black')).toBeInTheDocument();
    expect(screen.getByText('Core Hoodie – Rust')).toBeInTheDocument();
    expect(screen.getByText('Element Tee – Black')).toBeInTheDocument();
    expect(screen.getByText('Heavyweight Sweatshirt – Stone')).toBeInTheDocument();
    expect(screen.getByText('Cyber Anime Oversized Tee')).toBeInTheDocument();
  });

  it('11. opens fullscreen Lightbox when expand button is clicked', () => {
    renderProductDetailPage();

    const expandBtn = screen.getByRole('button', { name: /View full screen image/i });
    fireEvent.click(expandBtn);

    const lightbox = screen.getByRole('dialog', { name: /Product Image Lightbox/i });
    expect(lightbox).toBeInTheDocument();
    expect(screen.getByText(/1 \/ 5/i)).toBeInTheDocument();

    const closeLightboxBtn = screen.getByRole('button', { name: /Close Lightbox/i });
    fireEvent.click(closeLightboxBtn);
    expect(screen.queryByRole('dialog', { name: /Product Image Lightbox/i })).not.toBeInTheDocument();
  });

  it('12. allows adding product to cart and toggling wishlist', () => {
    renderProductDetailPage();

    // Add to Cart
    const addToCartBtn = screen.getByRole('button', { name: /Add to Cart/i });
    fireEvent.click(addToCartBtn);

    // Wishlist Toggle
    const wishlistBtns = screen.getAllByRole('button', { name: /Wishlist/i });
    fireEvent.click(wishlistBtns[0]);

    const savedWishlist = JSON.parse(localStorage.getItem('vyomik_wishlist') || '[]');
    expect(savedWishlist).toContain('vy-prod-01');
  });

  it('13. dynamically changes product pedestal preview image when switching color swatches', () => {
    renderProductDetailPage('unisex-oversized-classic-t-shirt-white');

    // Helper to get active showcase image
    const getShowcaseImg = () =>
      screen.getByRole('button', { name: /View full screen image/i }).previousSibling as HTMLImageElement;

    // Initially Cyber White tee is displayed on the main showcase
    expect(getShowcaseImg().src).toContain('qikink-tee-cyber-white.png');

    // Click "Pitch Black" color swatch
    const pitchBlackSwatch = screen.getByRole('radio', { name: 'Pitch Black' });
    fireEvent.click(pitchBlackSwatch);

    // Color name label updates to Pitch Black
    expect(screen.getByText('Pitch Black')).toBeInTheDocument();

    // Showcase pedestal image immediately switches to qikink-tee-cyber-black.png with identical artwork
    expect(getShowcaseImg().src).toContain('qikink-tee-cyber-black.png');

    // Click back to Cyber White
    const cyberWhiteSwatch = screen.getByRole('radio', { name: 'Cyber White' });
    fireEvent.click(cyberWhiteSwatch);
    expect(getShowcaseImg().src).toContain('qikink-tee-cyber-white.png');
  });
});
