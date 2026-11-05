import React, { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { ProductCard } from '../components/shop/ProductCard';
import { ColorChartModal } from '../components/shop/ColorChartModal';
import { DEMO_PRODUCTS, DemoProduct } from '../config/demoContent';
import { SwatchColor } from '../config/colorPalette';

interface CategoryTab {
  id: 'oversized-tees' | 'hoodies' | 'sweatshirts';
  label: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: 'oversized-tees', label: 'Oversized Tees' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'sweatshirts', label: 'Sweatshirts' },
];

export const CollectionsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('oversized-tees');
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState('collections');
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isGlobalChartOpen, setIsGlobalChartOpen] = useState(false);

  // Filter products by each section
  const oversizedTees = DEMO_PRODUCTS.filter(
    (p) =>
      p.category === 'plain-tees' ||
      p.category === 'wordmark-tees' ||
      p.category === 'oversized-tees'
  );

  const hoodies = DEMO_PRODUCTS.filter((p) => p.category === 'hoodies');

  const sweatshirts = DEMO_PRODUCTS.filter((p) => p.category === 'sweatshirts');

  const handleNotifyProduct = (
    product: DemoProduct,
    selectedColor?: SwatchColor
  ) => {
    const colorTag = selectedColor ? `_color_${selectedColor.id}` : '';
    setWaitlistSource(`product_${product.slug}${colorTag}`);
    setIsWaitlistOpen(true);
  };

  // Smooth navigation to the requested section
  const handleNavigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -95; // Account for sticky header offset
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      try {
        window.history.replaceState(null, '', `#${sectionId}`);
      } catch {
        // Fallback for sandboxed or strict iframes
      }
    }
  };

  // Scroll to section if hash is present in URL on mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['oversized-tees', 'hoodies', 'sweatshirts'].includes(hash)) {
      setActiveSection(hash);
      const element = document.getElementById(hash);
      if (element) {
        setTimeout(() => {
          const yOffset = -95;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  // Update active button indicator based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['oversized-tees', 'hoodies', 'sweatshirts'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EE] text-[#202020]">
      <AnnouncementBar />
      <Header
        bagCount={0}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenNotifyModal={() => {
          setWaitlistSource('header_nav');
          setIsWaitlistOpen(true);
        }}
      />

      <main className="flex-1 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-16 w-full">
        {/* Page Header */}
        <div className="border-b border-[#DAD7CE] pb-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
                CATALOGUE · FIRST DROP
              </span>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#202020] mt-2 text-balance">
                The Complete Edit
              </h1>
              <p className="text-xs sm:text-sm text-[#202020]/70 mt-2 max-w-[65ch] leading-relaxed">
                Everyday oversized essentials engineered with boxy silhouettes and heavyweight fabrics. Click any color swatch or view the chart on each card to customize shades.
              </p>
            </div>

            {/* Quick 19-Color Palette Overview Banner */}
            <button
              type="button"
              onClick={() => setIsGlobalChartOpen(true)}
              className="inline-flex items-center space-x-2.5 bg-white border border-[#DAD7CE] hover:border-[#202020] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#202020] transition-colors shadow-xs shrink-0 self-start md:self-end"
            >
              <Palette className="w-4 h-4 text-[#5C6548]" />
              <span>Full 19-Shade Palette ↗</span>
            </button>
          </div>

          {/* Category Navigation Buttons */}
          <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-8">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleNavigateToSection(tab.id)}
                  aria-label={`Navigate to ${tab.label} section`}
                  className={`px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-medium border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#202020] active:scale-[0.98] ${
                    isActive
                      ? 'bg-[#202020] text-[#F4F3EE] border-[#202020] shadow-sm'
                      : 'bg-white text-[#202020] border-[#DAD7CE] hover:border-[#202020] hover:bg-[#F4F3EE]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 1: OVERSIZED TEES */}
        <section
          id="oversized-tees"
          data-testid="section-oversized-tees"
          className="scroll-mt-28 mb-20 pt-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#DAD7CE] pb-4 mb-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
                SECTION 01 · 240 GSM COMBED COTTON
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#202020] mt-1">
                Oversized Tees
              </h2>
              <p className="text-xs text-[#202020]/70 mt-1 max-w-xl">
                Dense ribbed neckbands, dropped shoulder cuts, and boxy proportions. Switch colors or open the color chart on any card.
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#202020]/60 font-medium mt-3 sm:mt-0">
              {oversizedTees.length} Silhouettes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {oversizedTees.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNotifyProduct={handleNotifyProduct}
              />
            ))}
          </div>
        </section>

        {/* SECTION 2: HOODIES */}
        <section
          id="hoodies"
          data-testid="section-hoodies"
          className="scroll-mt-28 mb-20 pt-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#DAD7CE] pb-4 mb-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
                SECTION 02 · 450 GSM FRENCH TERRY
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#202020] mt-1">
                Hoodies
              </h2>
              <p className="text-xs text-[#202020]/70 mt-1 max-w-xl">
                Double-layered distraction-free hoods without cords, heavyweight loopback drape, and reinforced bartack pockets.
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#202020]/60 font-medium mt-3 sm:mt-0">
              {hoodies.length} Silhouettes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {hoodies.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNotifyProduct={handleNotifyProduct}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: SWEATSHIRTS */}
        <section
          id="sweatshirts"
          data-testid="section-sweatshirts"
          className="scroll-mt-28 mb-20 pt-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#DAD7CE] pb-4 mb-8">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
                SECTION 03 · 400 GSM HEAVYWEIGHT FLEECE
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#202020] mt-1">
                Sweatshirts
              </h2>
              <p className="text-xs text-[#202020]/70 mt-1 max-w-xl">
                Architectural crewneck silhouettes and raglan cuts designed for clean minimal layering.
              </p>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#202020]/60 font-medium mt-3 sm:mt-0">
              {sweatshirts.length} Silhouettes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {sweatshirts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNotifyProduct={handleNotifyProduct}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer
        onOpenNotifyModal={() => {
          setWaitlistSource('footer');
          setIsWaitlistOpen(true);
        }}
      />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource={waitlistSource}
      />

      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => {
          setWaitlistSource('bag_drawer');
          setIsWaitlistOpen(true);
        }}
      />

      {/* Global 19-Color Chart Modal */}
      <ColorChartModal
        isOpen={isGlobalChartOpen}
        onClose={() => setIsGlobalChartOpen(false)}
        productName="First Drop Collection"
        selectedHex="#151515"
        onSelectColor={() => {}}
      />
    </div>
  );
};
