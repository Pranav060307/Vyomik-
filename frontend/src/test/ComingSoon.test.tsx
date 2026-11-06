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

  it('renders ComingSoon page at "/" with no preview store button when gate is active', async () => {
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
              server_time: '2026-11-04T12:00:00Z',
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
    expect(screen.getByText(/SOMETHING NEW IS/i)).toBeInTheDocument();
    expect(screen.getByText(/A new experience in everyday essentials\./i)).toBeInTheDocument();
    // Preview store button must be removed
    expect(screen.queryByRole('button', { name: /Explore store preview/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/PREVIEW STORE/i)).not.toBeInTheDocument();
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
              server_time: '2026-11-04T12:00:00Z',
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

    expect(await screen.findByRole('heading', { name: /THE COMPLETE/i })).toBeInTheDocument();
    expect(screen.getByText('NEW ARRIVALS')).toBeInTheDocument();
  });

  it('does NOT gate deep links like /collections even without explore flag', async () => {
    renderWithProviders(<App />, '/collections');

    expect(await screen.findByRole('heading', { name: /NEW ARRIVALS\./i })).toBeInTheDocument();
    expect(screen.getByText(/FEATURED COLLECTION/i)).toBeInTheDocument();
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

    const input = screen.getByPlaceholderText(/Notify me when we go live/i);
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

    const input = screen.getByPlaceholderText(/Notify me when we go live/i);
    fireEvent.change(input, { target: { value: 'gparth067@gmail.com' } });

    const submitBtn = screen.getByRole('button', { name: /Submit email notification/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/You are already on the VIP waitlist!/i)).toBeInTheDocument();
    });
  });

  it('renders offline fallback smoothly without crashing if config fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithProviders(<ComingSoon />);

    expect(await screen.findByRole('heading', { name: /COMING SOON\./i })).toBeInTheDocument();
    expect(screen.getByText(/SOMETHING NEW IS/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Explore store preview/i })).not.toBeInTheDocument();
  });
});
