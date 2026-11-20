import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AboutPage } from '../pages/AboutPage';
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

describe('VYOMIK — About Us Page Full Implementation', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockNavigate.mockClear();
  });

  const renderAboutPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <MemoryRouter initialEntries={['/about']}>
                <AboutPage />
              </MemoryRouter>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
  };

  it('1. renders Announcement Bar, Main Navigation with active About state, and Footer', () => {
    renderAboutPage();

    // Announcement Bar
    expect(screen.getByRole('region', { name: /announcement/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Free Shipping on Orders Above/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/New Launch: Core Element Collection/i)[0]).toBeInTheDocument();

    // Navigation Logo and Links
    expect(screen.getByRole('banner', { name: /vyomik brand home/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^shop$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^collections/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^about$/i })).toBeInTheDocument();

    // Footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('2. renders Section One: Cinematic About Hero with split layout and lifestyle photograph', () => {
    renderAboutPage();

    // Eyebrow and Heading
    expect(screen.getByText(/ABOUT VYOMIK/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /our story/i })).toBeInTheDocument();

    // Editorial Description
    expect(
      screen.getByText(/More than clothing — VYOMIK is a perspective. A blend of street culture, purpose, and self-expression./i)
    ).toBeInTheDocument();

    // Lifestyle photograph asset
    const heroImg = screen.getByAltText(/Model wearing oversized warm-ivory VYOMIK hoodie/i);
    expect(heroImg).toBeInTheDocument();
    expect(heroImg).toHaveAttribute('src', '/images/vyomik/about/about-hero-model.jpg');
  });

  it('3. renders Section Two: The Meaning Behind VYOMIK with coordinates and mountain photograph', () => {
    renderAboutPage();

    // Heading
    expect(screen.getByRole('heading', { name: /the meaning behind vyomik/i })).toBeInTheDocument();

    // Coordinates overlay
    expect(screen.getByText(/19.8974° N/i)).toBeInTheDocument();
    expect(screen.getByText(/74.4828° E/i)).toBeInTheDocument();

    // Mountain photograph asset
    const mountainImg = screen.getByAltText(/Dramatic mountain peaks with burnt-orange sunlight/i);
    expect(mountainImg).toBeInTheDocument();
    expect(mountainImg).toHaveAttribute('src', '/images/vyomik/about/about-mountain-peaks.jpg');

    // Body copy narrative
    expect(screen.getByText(/VYOMIK is derived from/i)).toBeInTheDocument();
    expect(screen.getByText(/the infinite sky, representing freedom/i)).toBeInTheDocument();
  });

  it('4. renders Section Three: Our Values with 4 equal-width columns and ivory icons', () => {
    renderAboutPage();

    // Centered spaced eyebrow
    expect(screen.getByText((content) => content.includes('O U R') && content.includes('V A L U E S'))).toBeInTheDocument();

    // 4 Values Titles
    expect(screen.getByText('Quality First')).toBeInTheDocument();
    expect(screen.getByText('Conscious Creation')).toBeInTheDocument();
    expect(screen.getByText('Everyday Versatility')).toBeInTheDocument();
    expect(screen.getByText('Bold Expression')).toBeInTheDocument();

    // 4 Values Subtitles
    expect(screen.getByText('Premium fabrics, lasting comfort.')).toBeInTheDocument();
    expect(screen.getByText('Thoughtful, responsible fashion.')).toBeInTheDocument();
    expect(screen.getByText('Fits for campus, streets, and beyond.')).toBeInTheDocument();
    expect(screen.getByText('Wear what moves you.')).toBeInTheDocument();
  });

  it('5. renders Section Four: Signature 3D Brand Emblem Scene container', () => {
    const { container } = renderAboutPage();

    // Check for 3D scene section
    const canvas = container.querySelector('canvas') || container.querySelector('img[src="/assets/vyomik-official-emblem.png"]');
    expect(canvas).toBeInTheDocument();
  });

  it('6. renders Section Five: Our Mission (Clothing With Purpose)', () => {
    renderAboutPage();

    expect(screen.getByText(/OUR MISSION/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /clothing with purpose/i })).toBeInTheDocument();
    expect(
      screen.getByText(/To design modern streetwear that blends style, comfort, and meaning — empowering a generation to be original, confident, and limitless./i)
    ).toBeInTheDocument();
  });

  it('7. renders Section Six: The Craft with macro tactile fabric photograph', () => {
    renderAboutPage();

    expect(screen.getByText(/THE CRAFT/i)).toBeInTheDocument();
    expect(screen.getByText(/DETAILS/i)).toBeInTheDocument();
    expect(screen.getByText(/THAT MATTER/i)).toBeInTheDocument();
    expect(
      screen.getByText(/From fabric to fit, every detail is thoughtfully crafted to deliver a premium and timeless experience./i)
    ).toBeInTheDocument();

    // Fabric macro photograph asset
    const fabricImg = screen.getByAltText(/Tactile warm-ivory fabric weave with official VYOMIK emblem/i);
    expect(fabricImg).toBeInTheDocument();
    expect(fabricImg).toHaveAttribute('src', '/images/vyomik/about/about-fabric-macro.jpg');
  });

  it('8. renders Section Seven: Final Call to Action and navigates to Collections on click', () => {
    renderAboutPage();

    expect(screen.getByText(/BE PART OF VYOMIK/i)).toBeInTheDocument();
    expect(screen.getByText(/JOIN THE MOVEMENT/i)).toBeInTheDocument();

    const ctaBtn = screen.getByRole('button', { name: /explore collections/i });
    expect(ctaBtn).toBeInTheDocument();

    // Click CTA Button
    fireEvent.click(ctaBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/collections');
  });
});
