import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from '../pages/LandingPage';

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{ui}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('VYOMIK Landing Page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all 5 core sections: announcement bar, header, hero, everyday edit, and footer', () => {
    renderWithProviders(<LandingPage />);

    // 1. Announcement bar
    expect(screen.getByText(/THE FIRST DROP · COMING SOON/i)).toBeInTheDocument();

    // 2. Header & Navigation links
    expect(screen.getByRole('link', { name: /^VYOMIK$/i })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Collections/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole('link', { name: /Our story/i }).length).toBeGreaterThanOrEqual(1);

    // 3. Hero
    expect(screen.getByText('OVERSIZED ESSENTIALS')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Room to be you\./i })).toBeInTheDocument();
    expect(
      screen.getByText(/Easy silhouettes\. Quiet confidence\. Your next everyday favourite\./i)
    ).toBeInTheDocument();

    // 4. The Everyday Edit
    expect(screen.getByRole('heading', { name: /The everyday edit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Plain tees' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Wordmark tees' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Hoodies' })).toBeInTheDocument();

    // 5. Footer
    expect(screen.getByText('ROOM TO BE YOU')).toBeInTheDocument();
    expect(screen.getByText(/contact@vyomik.com/i)).toBeInTheDocument();
  });

  it('toggles hero model image when clicking colour chips (Ivory vs Black)', () => {
    renderWithProviders(<LandingPage />);

    const heroImage = screen.getByAltText(/VYOMIK model silhouette in ivory/i);
    expect(heroImage).toBeInTheDocument();

    // Click Black colour chip
    const blackChip = screen.getByRole('button', { name: /View Pitch Black model photo/i });
    fireEvent.click(blackChip);

    // Image alt text changes to black silhouette
    expect(screen.getByAltText(/VYOMIK model silhouette in black/i)).toBeInTheDocument();

    // Click Ivory chip again
    const ivoryChip = screen.getByRole('button', { name: /View Ivory model photo/i });
    fireEvent.click(ivoryChip);

    expect(screen.getByAltText(/VYOMIK model silhouette in ivory/i)).toBeInTheDocument();
  });

  it('expands inline "Coming soon" panel when clicking a category card and collapses on close (×)', () => {
    renderWithProviders(<LandingPage />);

    // Inline panel should not exist initially
    expect(screen.queryByTestId('category-inline-panel')).not.toBeInTheDocument();

    // Click on Hoodies category card
    const hoodiesCard = screen.getByText('Hoodies').closest('[role="button"]')!;
    fireEvent.click(hoodiesCard);

    // Inline panel appears with required message
    const panel = screen.getByTestId('category-inline-panel');
    expect(panel).toBeInTheDocument();
    expect(
      screen.getByText(/Oversized hoodies\. Coming soon\. Follow @vyomik for the first drop\./i)
    ).toBeInTheDocument();

    // Click close (×) button on panel
    const closeBtn = screen.getByRole('button', { name: /Close coming soon panel/i });
    fireEvent.click(closeBtn);

    // Panel is removed
    expect(screen.queryByTestId('category-inline-panel')).not.toBeInTheDocument();
  });

  it('opens waitlist modal on CTA click and displays success on email submit', async () => {
    // Mock successful waitlist response
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/waitlist')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              email: 'guest@vyomik.com',
              message: "You're on the list.",
              created_at: new Date().toISOString(),
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    renderWithProviders(<LandingPage />);

    // Click Hero CTA "Notify me at launch ↗"
    const heroCta = screen.getByRole('button', { name: /Notify me at launch/i });
    fireEvent.click(heroCta);

    // Modal is opened
    expect(screen.getByRole('heading', { name: /Be first when doors open\./i })).toBeInTheDocument();

    // Fill in email
    const emailInput = screen.getByPlaceholderText(/Enter your email address/i);
    fireEvent.change(emailInput, { target: { value: 'guest@vyomik.com' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Notify me at launch ↗/i });
    fireEvent.click(submitBtn);

    // Wait for success screen
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /You're on the list\./i })).toBeInTheDocument();
    });
  });
});
