import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../App';
import { ComingSoon } from '../pages/ComingSoon';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

function renderWithProviders(ui: React.ReactElement, initialRoute = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <MemoryRouter initialEntries={[initialRoute]}>
              {ui}
            </MemoryRouter>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

describe('Pre-Launch Coming Soon & Gate System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  it('renders ComingSoon page at "/" when gate is active', async () => {
    // Provide a future launch date so gate is active
    const futureDate = new Date(Date.now() + 86400000 * 10).toISOString();

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/config')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              store_name: 'VYOMIK',
              store_mode: 'coming_soon',
              launch_date: '2026-11-24',
              launch_at: futureDate,
              server_time: new Date().toISOString(),
              gate_enabled: true,
              payment_provider: 'mock',
              cod_available: true,
              free_shipping_threshold_paise: 149900,
              default_shipping_fee_paise: 9900,
              cod_fee_paise: 4900,
              demo_content: true,
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderWithProviders(<App />, '/');

    // Heading "COMING SOON." on Coming Soon page
    expect(await screen.findByRole('heading', { name: /COMING SOON\./i })).toBeInTheDocument();
    expect(screen.getByText(/STREETWEAR/i)).toBeInTheDocument();
    expect(screen.getByText(/A modern clothing label built for everyday style/i)).toBeInTheDocument();
    expect(screen.getByTestId('countdown-tiles')).toBeInTheDocument();
  });

  it('renders normal landing page at "/" once explore flag exists or gate is inactive', async () => {
    sessionStorage.setItem('vyomik_explore_passed', 'true');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/config')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              store_name: 'VYOMIK',
              store_mode: 'coming_soon',
              launch_date: '2026-11-10',
              launch_at: '2026-11-10T00:00:00+05:30',
              server_time: new Date().toISOString(),
              gate_enabled: true,
              payment_provider: 'mock',
              cod_available: true,
              free_shipping_threshold_paise: 149900,
              default_shipping_fee_paise: 9900,
              cod_fee_paise: 4900,
              demo_content: true,
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderWithProviders(<App />, '/');

    expect(await screen.findByRole('heading', { name: /WEAR/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /NEW ARRIVALS/i })).toBeInTheDocument();
  });

  it('does NOT gate deep links like /collections even without explore flag', async () => {
    renderWithProviders(<App />, '/collections');

    expect(await screen.findByRole('heading', { name: /EXPLORE/i })).toBeInTheDocument();
    expect(screen.getAllByText(/COLLECTIONS/i).length).toBeGreaterThan(0);
  });

  it('handles inline email signup with success response and updates UI state', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/waitlist')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              email: 'vip@vyomik.com',
              is_duplicate: false,
              message: "You're on the list! We'll email you 1 hour before doors open.",
              created_at: new Date().toISOString(),
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderWithProviders(<ComingSoon />);

    const input = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(input, { target: { value: 'vip@vyomik.com' } });

    const submitBtn = screen.getByRole('button', { name: /Submit email notification/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/You're on the list/i)).toBeInTheDocument();
    });

    // Check localStorage was populated
    expect(localStorage.getItem('vyomik_waitlist_registered')).toBe('vip@vyomik.com');
  });

  it('informs user if email is already in waitlist', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/waitlist')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              email: 'gparth067@gmail.com',
              is_duplicate: true,
              message: 'You are already on the VIP list. We will email you 1 hour before doors open.',
              created_at: new Date().toISOString(),
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderWithProviders(<ComingSoon />);

    const input = screen.getByPlaceholderText(/Enter your email/i);
    fireEvent.change(input, { target: { value: 'gparth067@gmail.com' } });

    const submitBtn = screen.getByRole('button', { name: /Submit email notification/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/You are already on the VIP list/i)).toBeInTheDocument();
    });
  });

  it('renders offline fallback smoothly without crashing if config fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithProviders(<ComingSoon />);

    expect(await screen.findByRole('heading', { name: /COMING SOON\./i })).toBeInTheDocument();
    expect(screen.getByText(/STREETWEAR/i)).toBeInTheDocument();
    expect(screen.getByText(/LAUNCH DATE ANNOUNCING SOON/i)).toBeInTheDocument();
  });
});
