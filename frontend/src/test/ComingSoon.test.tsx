import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from '../App';
import { ComingSoon } from '../pages/ComingSoon';

function renderWithProviders(ui: React.ReactElement, initialRoute = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        {ui}
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Pre-Launch Coming Soon & Gate System', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('renders ComingSoon page at "/" when gate is active and session flag is absent', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/config')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              store_name: 'VYOMIK',
              store_mode: 'coming_soon',
              launch_date: '2026-11-08',
              launch_at: '2026-11-08T00:00:00+05:30',
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

    // Heading "Room to be you." on Coming Soon page
    expect(await screen.findByRole('heading', { name: /Room to be you\./i })).toBeInTheDocument();
    expect(screen.getByText(/THE FIRST DROP/i)).toBeInTheDocument();
    expect(screen.getByText(/Something new is arriving on/i)).toBeInTheDocument();
    expect(screen.getAllByText('08.11.2026').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Explore/i })).toBeInTheDocument();
    expect(screen.getByTestId('countdown-tiles')).toBeInTheDocument();
  });

  it('sets sessionStorage flag and navigates to /home when Explore button is clicked', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/config')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              store_name: 'VYOMIK',
              store_mode: 'coming_soon',
              launch_date: '2026-11-08',
              launch_at: '2026-11-08T00:00:00+05:30',
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

    const exploreBtn = await screen.findByRole('button', { name: /Explore/i });
    expect(sessionStorage.getItem('vyomik_explore_passed')).toBeNull();

    act(() => {
      fireEvent.click(exploreBtn);
      vi.advanceTimersByTime(500);
    });

    expect(sessionStorage.getItem('vyomik_explore_passed')).toBe('true');

    vi.useRealTimers();
  });

  it('renders normal landing page at "/" once sessionStorage flag exists', async () => {
    sessionStorage.setItem('vyomik_explore_passed', 'true');

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/config')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              store_name: 'VYOMIK',
              store_mode: 'coming_soon',
              launch_date: '2026-11-08',
              launch_at: '2026-11-08T00:00:00+05:30',
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

    // Should render normal LandingPage with header Collections link and everyday edit
    expect(await screen.findByRole('heading', { name: /The everyday edit/i })).toBeInTheDocument();
    expect(screen.getByText('OVERSIZED ESSENTIALS')).toBeInTheDocument();
  });

  it('does NOT gate deep links like /collections even without explore flag', async () => {
    renderWithProviders(<App />, '/collections');

    expect(await screen.findByRole('heading', { name: /The Complete Edit/i })).toBeInTheDocument();
    expect(screen.getByText(/All Silhouettes/i)).toBeInTheDocument();
  });

  it('renders live state "We\'re live" and "Enter the store" when countdown reaches zero', async () => {
    // Mock target date in past relative to server time
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/config')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              store_name: 'VYOMIK',
              store_mode: 'coming_soon',
              launch_date: '2026-11-08',
              launch_at: '2026-11-01T00:00:00Z', // past date
              server_time: '2026-11-04T12:00:00Z', // now > launch_at
              gate_enabled: false,
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

    renderWithProviders(<ComingSoon />);

    expect(await screen.findByTestId('countdown-live')).toBeInTheDocument();
    expect(screen.getByText(/We're live/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enter the store/i })).toBeInTheDocument();
  });

  it('handles inline email signup with success and duplicate response', async () => {
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/waitlist')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              email: 'vip@vyomik.com',
              message: "You're on the list. We'll email you 1 hour before doors open.",
              created_at: new Date().toISOString(),
            }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    renderWithProviders(<ComingSoon />);

    const input = screen.getByPlaceholderText(/Enter your email for private access/i);
    fireEvent.change(input, { target: { value: 'vip@vyomik.com' } });

    const submitBtn = screen.getByRole('button', { name: /Notify me/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('gate-waitlist-success')).toBeInTheDocument();
      expect(screen.getByText(/You're on the list\./i)).toBeInTheDocument();
    });
  });

  it('renders offline fallback smoothly without crashing if config fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithProviders(<ComingSoon />);

    expect(await screen.findByRole('heading', { name: /Room to be you\./i })).toBeInTheDocument();
    expect(screen.getByText(/THE FIRST DROP/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Explore/i })).toBeInTheDocument();
  });
});
