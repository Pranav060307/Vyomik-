import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveStage } from '../components/common/ResponsiveStage';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { ProductCard, ProductItem } from '../components/shop/ProductCard';
import { ClothPreview } from '../components/common/ClothPreview';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 'Oversized Basic Tee',
    name: 'Oversized Basic Tee',
    price: 899,
    oldPrice: 1199,
    category: 'plain',
    type: 'tee',
    color: '#d9c3ad',
    logo: 0,
    img: 'assets/oversized-basic-tee.png',
  },
  {
    id: 'Classic Black Tee',
    name: 'Classic Black Tee',
    price: 899,
    oldPrice: 1199,
    category: 'plain',
    type: 'tee',
    color: '#1a1a1a',
    logo: 0,
  },
  {
    id: 'Crimson Tee',
    name: 'Crimson Tee',
    price: 899,
    oldPrice: 1199,
    category: 'plain',
    type: 'tee',
    color: '#a81818',
    logo: 0,
  },
  {
    id: 'VYOMIK Logo Tee',
    name: 'VYOMIK Logo Tee',
    price: 999,
    oldPrice: 1399,
    category: 'wordmark',
    type: 'tee',
    color: '#141414',
    logo: 1,
    img: 'assets/vyomik-logo-tee.png',
  },
  {
    id: 'Crimson Wordmark Tee',
    name: 'Crimson Wordmark Tee',
    price: 999,
    oldPrice: 1399,
    category: 'wordmark',
    type: 'tee',
    color: '#a81818',
    logo: 1,
  },
  {
    id: 'Essential Hoodie',
    name: 'Essential Hoodie',
    price: 1799,
    oldPrice: 2299,
    category: 'hoodies',
    type: 'hoodie',
    color: '#8e0f14',
    logo: 0,
    img: 'assets/essential-hoodie.png',
  },
  {
    id: 'Midnight Hoodie',
    name: 'Midnight Hoodie',
    price: 1799,
    oldPrice: 2299,
    category: 'hoodies',
    type: 'hoodie',
    color: '#1a1a1a',
    logo: 0,
  },
  {
    id: 'Stone Hoodie',
    name: 'Stone Hoodie',
    price: 1799,
    oldPrice: 2299,
    category: 'hoodies',
    type: 'hoodie',
    color: '#d9c3ad',
    logo: 0,
  },
];

const CATEGORIES = [
  { id: 'all', label: 'ALL COLLECTIONS' },
  { id: 'plain', label: 'PLAIN TEES' },
  { id: 'wordmark', label: 'WORDMARK TEES' },
  { id: 'hoodies', label: 'OVERSIZED HOODIES' },
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load products directly from the design source of truth (PROD in 5-home.html)
  const allProducts: ProductItem[] = DEFAULT_PRODUCTS;

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allProducts;
    }
    return allProducts.filter((p) => p.category === selectedCategory);
  }, [allProducts, selectedCategory]);

  const setFilter = (cat: string, scroll = false) => {
    setSelectedCategory(cat);
    if (scroll) {
      const s = (window as unknown as { __scale?: number }).__scale || 1;
      window.scrollTo({ top: 790 * s, behavior: 'smooth' });
    }
  };

  const handleShopCollection = () => {
    const s = (window as unknown as { __scale?: number }).__scale || 1;
    window.scrollTo({ top: 790 * s, behavior: 'smooth' });
  };

  const handleExploreAll = () => {
    navigate('/collections');
  };

  // Calculate dynamic layout top positions for 1920x1080 stage exactly matching 5-home.html layoutHome()
  const rowsCount = Math.ceil(filteredProducts.length / 4);
  const gridHeight = rowsCount === 0 ? 0 : rowsCount * 560 + (rowsCount - 1) * 20;
  const footerTop = 882 + gridHeight + 70;
  const totalStageHeight = footerTop + 330;

  return (
    <ResponsiveStage
      scroll={true}
      stageHeight={totalStageHeight}
      className="home-page bg-[#050505] relative overflow-hidden font-montserrat"
    >
      {/* 1. Global Navigation Bar */}
      <Navbar onSelectCategory={(cat) => setFilter(cat, true)} />

      {/* 2. Hero Section */}
      <div className="hero">
        {/* Hero Rack Image */}
        <ClothPreview
          type="rack"
          img="assets/hero-rack.png"
          className="rackw"
          alt=""
        />

        {/* Eyebrow */}
        <div className="eb">INTRODUCING</div>

        {/* Heading */}
        <h1 role="heading">
          THE COMPLETE<b>EDIT</b>
        </h1>

        {/* Subhead Description */}
        <p>Everyday oversized essentials engineered with boxy silhouettes and heavyweight fabrics.</p>

        {/* Action Buttons */}
        <div
          onClick={handleShopCollection}
          className="b1"
          role="button"
        >
          Shop Collection
          <span className="ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16M14 6l6 6-6 6" />
            </svg>
          </span>
        </div>

        <div
          onClick={handleExploreAll}
          className="b2"
          role="button"
        >
          Explore All
        </div>

        {/* Filter Chips */}
        <div className="chips">
          {CATEGORIES.map((cat) => (
            <span
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={selectedCategory === cat.id ? 'on' : ''}
            >
              {cat.label}
            </span>
          ))}
        </div>
      </div>

      {/* 3. New Arrivals Header */}
      <div className="na">NEW ARRIVALS</div>

      <div
        onClick={handleExploreAll}
        className="va"
        role="button"
      >
        View All
        <span className="ico">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12h16M14 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      {/* 4. Product Cards Grid */}
      <div
        id="grid"
        className="row"
      >
        {filteredProducts.map((p, idx) => (
          <ProductCard
            key={p.id + idx}
            product={p}
            variant="homeGrid"
          />
        ))}
      </div>

      {/* 5. Footer */}
      <div style={{ position: 'absolute', left: 0, top: `${footerTop}px`, width: '1920px' }}>
        <Footer variant="home" onSelectCategory={(cat) => setFilter(cat, true)} />
      </div>

      {/* Search & Bag Drawer Overlays */}
      <SearchBar />
      <BagDrawer />
    </ResponsiveStage>
  );
};
