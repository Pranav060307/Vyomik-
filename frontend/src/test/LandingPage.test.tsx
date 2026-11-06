import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from '../pages/LandingPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <BrowserRouter>{ui}</BrowserRouter>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('VYOMIK Landing Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all core sections: navbar, hero, chips, new arrivals, and footer', () => {
    renderWithProviders(<LandingPage />);

    // 1. Brand Logo / Header
    expect(screen.getAllByLabelText(/^VYOMIK$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Collections/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Our story/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Contact/i).length).toBeGreaterThanOrEqual(1);

    // 2. Hero
    expect(screen.getByText('INTRODUCING')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /THE COMPLETE/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Everyday oversized essentials engineered with boxy silhouettes and heavyweight fabrics\./i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Shop Collection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore All/i })).toBeInTheDocument();

    // 3. Filter chips
    expect(screen.getByText('ALL COLLECTIONS')).toBeInTheDocument();
    expect(screen.getByText('PLAIN TEES')).toBeInTheDocument();
    expect(screen.getByText('WORDMARK TEES')).toBeInTheDocument();
    expect(screen.getByText('OVERSIZED HOODIES')).toBeInTheDocument();

    // 4. New Arrivals Grid
    expect(screen.getByText('NEW ARRIVALS')).toBeInTheDocument();
    expect(screen.getByText('Oversized Basic Tee')).toBeInTheDocument();

    // 5. Footer
    expect(screen.getByText('ROOM TO BE YOU')).toBeInTheDocument();
    expect(screen.getByText(/simplyvyomik@gmail\.com/i)).toBeInTheDocument();
  });

  it('filters products when clicking category chips (Plain Tees vs Hoodies)', () => {
    renderWithProviders(<LandingPage />);

    // Initially Oversized Basic Tee is visible
    expect(screen.getByText('Oversized Basic Tee')).toBeInTheDocument();

    // Click on OVERSIZED HOODIES chip
    const hoodiesChip = screen.getByText('OVERSIZED HOODIES');
    fireEvent.click(hoodiesChip);

    // Essential Hoodie should be in document
    expect(screen.getByText('Essential Hoodie')).toBeInTheDocument();

    // Click ALL COLLECTIONS chip
    const allChip = screen.getByText('ALL COLLECTIONS');
    fireEvent.click(allChip);

    expect(screen.getByText('Oversized Basic Tee')).toBeInTheDocument();
    expect(screen.getByText('Essential Hoodie')).toBeInTheDocument();
  });

  it('adds item to cart when clicking ADD TO CART on a product card and updates bag count', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByText('Bag (0)')).toBeInTheDocument();

    const addButtons = screen.getAllByRole('button', { name: /ADD TO CART/i });
    expect(addButtons.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(addButtons[0]);

    // Toast appears
    expect(screen.getByText(/added to bag/i)).toBeInTheDocument();

    // Bag count incremented
    expect(screen.getByText('Bag (1)')).toBeInTheDocument();
  });

  it('renders FIRST DROP badges on cards and toggles wishlist heart', () => {
    renderWithProviders(<LandingPage />);

    const badges = screen.getAllByText('FIRST DROP');
    expect(badges.length).toBeGreaterThanOrEqual(1);

    const hearts = screen.getAllByRole('button', { name: /wishlist/i });
    expect(hearts.length).toBeGreaterThanOrEqual(1);

    fireEvent.click(hearts[0]);
    expect(screen.getByText('Added to wishlist')).toBeInTheDocument();

    fireEvent.click(hearts[0]);
    expect(screen.getByText('Removed from wishlist')).toBeInTheDocument();
  });

  it('opens collections dropdown and filters products', () => {
    renderWithProviders(<LandingPage />);

    const collectionsBtn = screen.getByRole('button', { name: /collections/i });
    fireEvent.click(collectionsBtn);

    const hoodiesOption = screen.getAllByText('Oversized Hoodies')[0];
    expect(hoodiesOption).toBeInTheDocument();

    fireEvent.click(hoodiesOption);
    expect(screen.getByText('Essential Hoodie')).toBeInTheDocument();
  });
});
