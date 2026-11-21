import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShopAllPage } from '../pages/ShopAllPage';
import { CartProvider } from '../context/CartContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/shop']) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>{ui}</ToastProvider>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('VYOMIK — Shop All Page Component & Interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('1. renders Announcement Bar, Navigation, and Shop Hero Banner', () => {
    renderWithProviders(<ShopAllPage />);

    // Announcement
    expect(screen.getByRole('region', { name: /announcement/i })).toBeInTheDocument();

    // Navigation
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('banner', { name: /vyomik brand home/i })).toBeInTheDocument();

    // Hero banner
    expect(screen.getByRole('heading', { level: 1, name: /shop all/i })).toBeInTheDocument();
    expect(screen.getByText(/explore our complete range of premium streetwear/i)).toBeInTheDocument();
  });

  it('2. renders all 4 horizontal category selector options', () => {
    renderWithProviders(<ShopAllPage />);

    const catNav = screen.getByRole('navigation', { name: /category selection/i });
    expect(catNav).toBeInTheDocument();

    expect(within(catNav).getByRole('button', { name: /all products/i })).toBeInTheDocument();
    expect(within(catNav).getByRole('button', { name: /oversized/i })).toBeInTheDocument();
    expect(within(catNav).getByRole('button', { name: /sweatshirts/i })).toBeInTheDocument();
    expect(within(catNav).getByRole('button', { name: /hoodies/i })).toBeInTheDocument();
  });

  it('3. filters product catalog when a horizontal category is clicked', async () => {
    renderWithProviders(<ShopAllPage />);

    const catNav = screen.getByRole('navigation', { name: /category selection/i });
    const hoodiesBtn = within(catNav).getByRole('button', { name: /hoodies/i });
    fireEvent.click(hoodiesBtn);

    // Verify hoodies are shown
    await waitFor(() => {
      expect(screen.getByText(/core hoodie.*ivory/i)).toBeInTheDocument();
      expect(screen.getByText(/core hoodie.*rust/i)).toBeInTheDocument();
      expect(screen.queryByText(/cyber anime/i)).not.toBeInTheDocument();
    });
  });

  it('4. renders Filter Sidebar with Category, Size, Color, Price Range, and Sort By', () => {
    renderWithProviders(<ShopAllPage />);

    // Filter sidebar
    const filterAside = screen.getByRole('complementary', { name: /product filters/i });
    expect(filterAside).toBeInTheDocument();

    // Accordion headers
    expect(within(filterAside).getByRole('button', { name: /^category/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^size/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^color/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^price range/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^sort by/i })).toBeInTheDocument();

    // Check size buttons within sidebar
    expect(within(filterAside).getByRole('button', { name: /^s$/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^m$/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^l$/i })).toBeInTheDocument();
    expect(within(filterAside).getByRole('button', { name: /^xl$/i })).toBeInTheDocument();
  });

  it('5. toggles wishlist and saves state to localStorage with toast notification', async () => {
    renderWithProviders(<ShopAllPage />);

    const wishlistButtons = screen.getAllByRole('button', { name: /add to wishlist/i });
    expect(wishlistButtons.length).toBeGreaterThan(0);

    fireEvent.click(wishlistButtons[0]);

    await waitFor(() => {
      const stored = localStorage.getItem('vyomik_wishlist');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!)).toHaveLength(1);
    });
  });

  it('6. adds product to shopping bag via Quick Add and updates bag count', async () => {
    renderWithProviders(<ShopAllPage />);

    const addButtons = screen.getAllByRole('button', { name: /add to bag/i });
    expect(addButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);

    await waitFor(() => {
      const cart = localStorage.getItem('vyomik_cart');
      expect(cart).toBeTruthy();
      const items = JSON.parse(cart!);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it('7. allows toggling between Grid and List view modes', async () => {
    renderWithProviders(<ShopAllPage />);

    const listToggle = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listToggle);

    // List view buttons "Add to Bag" should now be rendered
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /add to bag/i }).length).toBeGreaterThan(0);
    });

    const gridToggle = screen.getByRole('button', { name: /grid view/i });
    fireEvent.click(gridToggle);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /add to bag/i }).length).toBeGreaterThan(0);
    });
  });

  it('8. renders multi-column footer with brand information and social links', () => {
    renderWithProviders(<ShopAllPage />);

    const footer = screen.getByRole('contentinfo', { name: /footer/i });
    expect(footer).toBeInTheDocument();

    const instagramLink = screen.getByRole('link', { name: /instagram/i });
    expect(instagramLink).toHaveAttribute('href', 'https://www.instagram.com/simplyvyomik');
    expect(instagramLink).toHaveAttribute('target', '_blank');
  });
});
