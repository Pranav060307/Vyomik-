import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

describe('VYOMIK Main Ecommerce Homepage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('1 & 2. renders Announcement Bar and Main Navigation with VYOMIK logo and actions', () => {
    renderWithProviders(<LandingPage />);

    // Announcement bar
    expect(screen.getByRole('region', { name: /announcement/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Free Shipping on Orders Above/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/New Launch: Core Element Collection/i)).toBeInTheDocument();

    // Navigation
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('banner', { name: /vyomik brand home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^shop$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^collections$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^about$/i })).toBeInTheDocument();

    // Nav Action Icons
    expect(screen.getByRole('button', { name: /search products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in to account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shopping bag/i })).toBeInTheDocument();
  });

  it('3. renders Cinematic Hero Banner with headline, brush stroke, and CTAs', () => {
    renderWithProviders(<LandingPage />);

    // Eyebrow
    expect(screen.getByText('STREETWEAR')).toBeInTheDocument();
    expect(screen.getByText('ESSENTIALS')).toBeInTheDocument();
    expect(screen.getByText('EVERYDAY WEAR')).toBeInTheDocument();

    // Headline
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toBeInTheDocument();
    expect(heroHeading.textContent).toContain('WEAR');
    expect(heroHeading.textContent).toContain('YOUR');
    expect(heroHeading.textContent).toContain('PERSPECTIVE');

    // Brand description
    expect(
      screen.getAllByText(/Modern streetwear for a generation that thinks different\./i).length
    ).toBeGreaterThanOrEqual(1);

    // CTAs
    expect(screen.getByRole('button', { name: /shop collection/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /our story/i })).toBeInTheDocument();

    // Slide Counter
    expect(screen.getByLabelText(/Slide 01 of 03/i)).toBeInTheDocument();
  });

  it('4. renders Benefits & Trust Strip with 4 core value propositions', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('region', { name: /trust and benefits/i })).toBeInTheDocument();
    expect(screen.getByText('Quality Guarantee')).toBeInTheDocument();
    expect(screen.getByText('Easy Returns')).toBeInTheDocument();
    expect(screen.getByText('Sustainable Choice')).toBeInTheDocument();
    expect(screen.getByText('Premium fabric & long lasting')).toBeInTheDocument();
    expect(screen.getByText('7-day hassle free returns')).toBeInTheDocument();
    expect(screen.getByText('Ethically crafted & responsible')).toBeInTheDocument();
  });

  it('5. renders New Arrivals 4 category image cards', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('region', { name: /new arrivals by category/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /new arrivals/i })).toBeInTheDocument();
    expect(screen.getByText('The latest drops, crafted for everyday impact.')).toBeInTheDocument();

    // 4 Category Cards
    expect(screen.getByRole('button', { name: /shop hoodies/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shop t-shirts/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shop cargos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /shop accessories/i })).toBeInTheDocument();
  });

  it('6. renders Core Elements interactive 3D perspective showcase', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('region', { name: /core elements featured drop/i })).toBeInTheDocument();
    expect(screen.getByText('NEW LAUNCHES')).toBeInTheDocument();
    expect(screen.getByText('ELEMENTS')).toBeInTheDocument();
    expect(screen.getByText(/Our latest drop — minimal, bold, and built for everyday movement\./i)).toBeInTheDocument();

    // Interactive chevrons & cues
    expect(screen.getByRole('button', { name: /previous hoodie style/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next hoodie style/i })).toBeInTheDocument();
    expect(screen.getByText(/drag or click to rotate/i)).toBeInTheDocument();
  });

  it('7. renders Explore Collections with 3 editorial collection cards', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('region', { name: /explore collections/i })).toBeInTheDocument();
    expect(screen.getByText('COLLECTIONS')).toBeInTheDocument();
    expect(screen.getByText('Curated drops for every part of your day.')).toBeInTheDocument();

    // 3 Cards
    expect(screen.getByRole('button', { name: /explore core essentials/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore urban terrain/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore monochrome edit/i })).toBeInTheDocument();
  });

  it('8. renders Brand Highlights & Benefits strip', () => {
    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('region', { name: /brand highlights/i })).toBeInTheDocument();
    expect(screen.getByText('Bold Design')).toBeInTheDocument();
    expect(screen.getByText('Clean, modern and distinctive.')).toBeInTheDocument();
    expect(screen.getByText('Premium Comfort')).toBeInTheDocument();
    expect(screen.getByText('Breathable, durable and all-day wear.')).toBeInTheDocument();
    expect(screen.getByText('Versatile Style')).toBeInTheDocument();
    expect(screen.getByText('From campus to the streets.')).toBeInTheDocument();
    expect(screen.getByText('Responsible Fashion')).toBeInTheDocument();
    expect(screen.getByText('Thoughtful materials, smaller footprint.')).toBeInTheDocument();
  });

  it('9. renders Newsletter Collective waitlist signup section', async () => {
    // Mock fetch for waitlist endpoint
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
      if (url.toString().includes('/api/v1/waitlist')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true, message: 'Added to waitlist' }),
        } as Response);
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) } as Response);
    });

    renderWithProviders(<LandingPage />);

    expect(screen.getByRole('region', { name: /join collective/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /JOIN THE VYOMIK COLLECTIVE/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();

    const subscribeBtn = screen.getByRole('button', { name: /subscribe/i });
    expect(subscribeBtn).toBeInTheDocument();

    // Input email and submit
    const input = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(input, { target: { value: 'collective@vyomik.com' } });
    fireEvent.click(subscribeBtn);

    await waitFor(() => {
      expect(screen.getByText(/Welcome to the VYOMIK Collective/i)).toBeInTheDocument();
    });
  });

  it('10. renders Multi-Column Editorial Footer with official links and copyright', () => {
    renderWithProviders(<LandingPage />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();

    // 5 Columns
    expect(screen.getByRole('heading', { name: /^shop$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^company$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^support$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^follow us$/i })).toBeInTheDocument();

    // Social & Contact
    expect(screen.getByRole('link', { name: /vyomik on instagram/i })).toHaveAttribute(
      'href',
      'https://www.instagram.com/simplyvyomik'
    );
    expect(screen.getByRole('link', { name: /email vyomik/i })).toHaveAttribute(
      'href',
      'mailto:simplyvyomik@gmail.com'
    );

    // Copyright
    expect(screen.getByText(/© 2026 VYOMIK\. All rights reserved\./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });
});
