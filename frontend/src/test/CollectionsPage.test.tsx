import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CollectionsPage } from '../pages/CollectionsPage';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CollectionsPage Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const renderCollectionsPage = (initialEntries = ['/collections']) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <AuthProvider>
            <CartProvider>
              <ToastProvider>
                <CollectionsPage />
              </ToastProvider>
            </CartProvider>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('renders the Collections Hero section with correct typography and narrative', () => {
    renderCollectionsPage();

    // Eyebrow and main heading
    expect(screen.getByText('COLLECTIONS')).toBeInTheDocument();
    expect(screen.getByText(/EXPLORE/i)).toBeInTheDocument();
    expect(screen.getByText(/OUR DROPS/i)).toBeInTheDocument();

    // Narrative description
    expect(
      screen.getByText(/Curated collections that bring together style, comfort, and purpose\./i)
    ).toBeInTheDocument();

    // Orbital ring drop labels
    expect(screen.getAllByText(/CORE ELEMENTS/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/URBAN TERRAIN/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders all 4 collection cards with titles, subtitles, and badges', () => {
    renderCollectionsPage();

    // Card 1: Core Elements
    expect(screen.getByRole('heading', { name: 'CORE ELEMENTS' })).toBeInTheDocument();
    expect(screen.getByText('The signature collection.')).toBeInTheDocument();
    expect(screen.getByText('FEATURED')).toBeInTheDocument();

    // Card 2: Urban Terrain
    expect(screen.getByRole('heading', { name: 'URBAN TERRAIN' })).toBeInTheDocument();
    expect(screen.getByText('Rugged. Functional. Versatile.')).toBeInTheDocument();

    // Card 3: Monochrome Edit
    expect(screen.getByRole('heading', { name: 'MONOCHROME EDIT' })).toBeInTheDocument();
    expect(screen.getByText('Minimal tones. Maximum impact.')).toBeInTheDocument();

    // Card 4: Essentials
    expect(screen.getByRole('heading', { name: 'ESSENTIALS' })).toBeInTheDocument();
    expect(screen.getByText('Everyday fits. Elevated.')).toBeInTheDocument();
  });

  it('navigates to the appropriate shop category when a collection card is clicked', () => {
    renderCollectionsPage();
    mockNavigate.mockClear();

    // Click Core Elements card -> should navigate to /shop?cat=hoodies
    const coreHeading = screen.getByRole('heading', { name: 'CORE ELEMENTS' });
    const coreCard = coreHeading.closest('[role="button"]');
    expect(coreCard).toBeTruthy();
    if (coreCard) {
      fireEvent.click(coreCard);
      expect(mockNavigate).toHaveBeenCalledWith('/shop?cat=hoodies');
    }

    // Click Urban Terrain card -> should navigate to /shop?cat=cargos
    const terrainHeading = screen.getByRole('heading', { name: 'URBAN TERRAIN' });
    const terrainCard = terrainHeading.closest('[role="button"]');
    expect(terrainCard).toBeTruthy();
    if (terrainCard) {
      fireEvent.click(terrainCard);
      expect(mockNavigate).toHaveBeenCalledWith('/shop?cat=cargos');
    }
  });

  it('renders all 4 brand trust values in the footer strip', () => {
    renderCollectionsPage();

    expect(screen.getByText('Premium Materials')).toBeInTheDocument();
    expect(screen.getByText('Built for long-lasting wear')).toBeInTheDocument();

    expect(screen.getByText('Sustainable Approach')).toBeInTheDocument();
    expect(screen.getByText('Thoughtful, responsible fashion')).toBeInTheDocument();

    expect(screen.getByText('Timeless Design')).toBeInTheDocument();
    expect(screen.getByText('Style beyond seasons')).toBeInTheDocument();

    expect(screen.getByText('New Drops Regularly')).toBeInTheDocument();
    expect(screen.getByText('Fresh collections, all year round')).toBeInTheDocument();
  });
});
