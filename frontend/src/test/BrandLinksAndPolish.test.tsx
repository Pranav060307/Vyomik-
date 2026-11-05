import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Footer } from '../components/layout/Footer';
import { ComingSoon } from '../pages/ComingSoon';
import { ContactPage } from '../pages/ContactPage';
import { ShippingReturnsPage } from '../pages/ShippingReturnsPage';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage';
import { TermsPage } from '../pages/TermsPage';
import * as brand from '../config/brand';

function renderWithProviders(ui: React.ReactElement, initialEntries = ['/']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Brand Details & Polish Verification (TASK 1, 2, 3)', () => {
  it('exports exact required constants from brand.ts without tracking query parameters', () => {
    expect(brand.brandName).toBe('VYOMIK');
    expect(brand.instagramUrl).toBe('https://www.instagram.com/simplyvyomik');
    expect(brand.instagramHandle).toBe('@simplyvyomik');
    expect(brand.contactEmail).toBe('simplyvyomik@gmail.com');
    expect(brand.mailtoUrl).toBe('mailto:simplyvyomik@gmail.com');

    // Assert no query parameters on Instagram URL
    const url = new URL(brand.instagramUrl);
    expect(url.search).toBe('');
  });

  it('Footer renders Instagram link with target="_blank", rel="noopener noreferrer", and mailto link', () => {
    renderWithProviders(<Footer />);

    // Instagram link
    const igLinks = screen.getAllByRole('link', { name: /instagram/i });
    const footerIg = igLinks.find(
      (link) => link.getAttribute('href') === 'https://www.instagram.com/simplyvyomik'
    );
    expect(footerIg).toBeDefined();
    expect(footerIg?.getAttribute('target')).toBe('_blank');
    expect(footerIg?.getAttribute('rel')).toContain('noopener');
    expect(footerIg?.getAttribute('rel')).toContain('noreferrer');

    // Mailto link
    const mailLink = screen.getByRole('link', { name: /email vyomik/i });
    expect(mailLink).toHaveAttribute('href', 'mailto:simplyvyomik@gmail.com');
    expect(mailLink.textContent).toContain('simplyvyomik@gmail.com');

    // Contact page link
    expect(screen.getByRole('link', { name: /^contact$/i })).toHaveAttribute('href', '/contact');
  });

  it('Coming Soon page renders Instagram link and mailto in mini footer row', () => {
    renderWithProviders(<ComingSoon />);

    const igLink = screen.getByRole('link', { name: /vyomik on instagram/i });
    expect(igLink).toHaveAttribute('href', 'https://www.instagram.com/simplyvyomik');
    expect(igLink.getAttribute('target')).toBe('_blank');
    expect(igLink.getAttribute('rel')).toContain('noopener');
    expect(igLink.getAttribute('rel')).toContain('noreferrer');

    const emailLink = screen.getByRole('link', { name: /email vyomik/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:simplyvyomik@gmail.com');
    expect(emailLink.textContent).toContain('simplyvyomik@gmail.com');
  });

  it('Contact page renders Instagram link and mailto email address', () => {
    renderWithProviders(<ContactPage />);

    const igLinks = screen.getAllByRole('link', { name: /vyomik on instagram/i });
    expect(igLinks.length).toBeGreaterThanOrEqual(1);
    const mainIg = igLinks.find(
      (l) => l.getAttribute('href') === 'https://www.instagram.com/simplyvyomik'
    );
    expect(mainIg).toBeDefined();
    expect(mainIg?.getAttribute('target')).toBe('_blank');
    expect(mainIg?.getAttribute('rel')).toContain('noopener');
    expect(mainIg?.getAttribute('rel')).toContain('noreferrer');

    const emailLinks = screen.getAllByRole('link', { name: /email vyomik/i });
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
    const mainEmail = emailLinks.find(
      (l) => l.getAttribute('href') === 'mailto:simplyvyomik@gmail.com'
    );
    expect(mainEmail).toBeDefined();
    expect(mainEmail?.textContent).toContain('simplyvyomik@gmail.com');
  });

  it('verifies that no rogue "@vyomik" without "simply" exists in rendered text', () => {
    const { container: footerContainer } = renderWithProviders(<Footer />);
    const { container: comingSoonContainer } = renderWithProviders(<ComingSoon />);
    const { container: contactContainer } = renderWithProviders(<ContactPage />);
    const { container: shippingContainer } = renderWithProviders(<ShippingReturnsPage />);
    const { container: privacyContainer } = renderWithProviders(<PrivacyPolicyPage />);
    const { container: termsContainer } = renderWithProviders(<TermsPage />);

    const allText = [
      footerContainer.textContent,
      comingSoonContainer.textContent,
      contactContainer.textContent,
      shippingContainer.textContent,
      privacyContainer.textContent,
      termsContainer.textContent,
    ].join(' ');

    // Match any "@vyomik" that is not preceded or succeeded by "simply"
    const rogueHandles = allText.match(/@vyomik(?!\b_)/gi);
    expect(rogueHandles).toBeNull();
  });

  it('asserts that no href="#" links exist across all rendered pages', () => {
    const pages = [
      <Footer />,
      <ComingSoon />,
      <ContactPage />,
      <ShippingReturnsPage />,
      <PrivacyPolicyPage />,
      <TermsPage />,
    ];

    pages.forEach((page) => {
      const { container } = renderWithProviders(page);
      const hashLinks = container.querySelectorAll('a[href="#"]');
      expect(hashLinks.length).toBe(0);
    });
  });

  it('asserts that no city names exist as brand address or studio references', () => {
    const { container: footerContainer } = renderWithProviders(<Footer />);
    const { container: comingSoonContainer } = renderWithProviders(<ComingSoon />);
    const { container: contactContainer } = renderWithProviders(<ContactPage />);

    const brandText = [
      footerContainer.textContent,
      comingSoonContainer.textContent,
      contactContainer.textContent,
    ].join(' ');

    expect(brandText).not.toMatch(/Bengaluru/i);
    expect(brandText).not.toMatch(/Bangalore/i);
    expect(brandText).not.toMatch(/Mumbai/i);
    expect(brandText).not.toMatch(/Delhi(?!very)/i);
    expect(brandText).not.toMatch(/Tirupur/i);
  });
});
