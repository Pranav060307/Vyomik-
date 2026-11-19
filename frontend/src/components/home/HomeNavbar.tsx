import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface HomeNavbarProps {
  onSelectCategory?: (category: string) => void;
}

export const HomeNavbar: React.FC<HomeNavbarProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openBag, openSearch } = useCart();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [collectionsDropdownOpen, setCollectionsDropdownOpen] = useState(false);

  const isHomeActive = location.pathname === '/' || location.pathname === '/home';
  const isCollectionsActive =
    location.pathname.startsWith('/collections') ||
    location.pathname.startsWith('/drops');
  const isShopActive =
    (location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/new-arrivals')) && !isCollectionsActive;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (cat: string) => {
    setShopDropdownOpen(false);
    setCollectionsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      navigate(`/shop?cat=${cat}`);
    }
  };

  return (
    <nav
      className={`w-full relative z-30 transition-all duration-300 bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#242321]/60 shadow-lg ${
        scrolled ? 'py-3' : 'py-3.5 sm:py-4'
      }`}
      role="navigation"
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
        {/* Left: Official VYOMIK Logo */}
        <div
          onClick={() => navigate('/home')}
          className="flex items-center cursor-pointer group"
          role="banner"
          aria-label="VYOMIK Brand Home"
        >
          <img
            src="/assets/logo.png"
            alt="VYOMIK"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
          />
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 lg:gap-10 text-[13px] lg:text-[14px] font-montserrat font-medium tracking-wider uppercase text-[#D9D1C3]">
          {/* Home */}
          <button
            type="button"
            onClick={() => navigate('/home')}
            className={`transition-colors relative py-1 cursor-pointer ${
              isHomeActive ? 'text-[#F4F0E8]' : 'text-[#D9D1C3] hover:text-white'
            }`}
          >
            <span>Home</span>
            {isHomeActive && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#A64B2A]" />
            )}
          </button>

          {/* Shop with Dropdown */}
          <div
            className="relative py-1"
            onMouseEnter={() => setShopDropdownOpen(true)}
            onMouseLeave={() => setShopDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className={`transition-colors flex items-center gap-1 cursor-pointer relative ${
                isShopActive ? 'text-[#F4F0E8]' : 'hover:text-[#F4F0E8]'
              }`}
              aria-expanded={shopDropdownOpen}
            >
              <span>Shop</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {isShopActive && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#A64B2A]" />
              )}
            </button>

            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-[#141210]/95 backdrop-blur-md border border-[#242321] p-2 shadow-2xl flex flex-col gap-1 z-40">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('hoodies')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#D9D1C3] hover:text-[#F4F0E8] hover:bg-[#242321] rounded-lg transition-colors cursor-pointer"
                >
                  Oversized Hoodies
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('plain')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#D9D1C3] hover:text-[#F4F0E8] hover:bg-[#242321] rounded-lg transition-colors cursor-pointer"
                >
                  Boxy T-Shirts
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('wordmark')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#D9D1C3] hover:text-[#F4F0E8] hover:bg-[#242321] rounded-lg transition-colors cursor-pointer"
                >
                  Signature Wordmark
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#A64B2A] font-semibold hover:bg-[#242321] rounded-lg transition-colors cursor-pointer border-t border-[#242321] mt-1 pt-2"
                >
                  View All Products &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Collections with Dropdown */}
          <div
            className="relative py-1"
            onMouseEnter={() => setCollectionsDropdownOpen(true)}
            onMouseLeave={() => setCollectionsDropdownOpen(false)}
          >
            <button
              type="button"
              onClick={() => navigate('/collections')}
              className={`transition-colors flex items-center gap-1 cursor-pointer relative ${
                isCollectionsActive ? 'text-[#F4F0E8]' : 'text-[#D9D1C3] hover:text-[#F4F0E8]'
              }`}
              aria-expanded={collectionsDropdownOpen}
            >
              <span>Collections</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${collectionsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
              {isCollectionsActive && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#A64B2A]" />
              )}
            </button>

            {collectionsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 rounded-xl bg-[#141210]/95 backdrop-blur-md border border-[#242321] p-2 shadow-2xl flex flex-col gap-1 z-40">
                <button
                  type="button"
                  onClick={() => handleCategoryClick('core-elements')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#D9D1C3] hover:text-[#F4F0E8] hover:bg-[#242321] rounded-lg transition-colors cursor-pointer"
                >
                  Core Elements
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('urban-terrain')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#D9D1C3] hover:text-[#F4F0E8] hover:bg-[#242321] rounded-lg transition-colors cursor-pointer"
                >
                  Urban Terrain
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('monochrome')}
                  className="text-left px-3 py-2 text-xs font-montserrat text-[#D9D1C3] hover:text-[#F4F0E8] hover:bg-[#242321] rounded-lg transition-colors cursor-pointer"
                >
                  Monochrome Edit
                </button>
              </div>
            )}
          </div>

          {/* About */}
          <button
            type="button"
            onClick={() => navigate('/our-story')}
            className="hover:text-[#F4F0E8] transition-colors py-1 cursor-pointer"
          >
            About
          </button>
        </div>

        {/* Right: Search, Account & Shopping Bag Icons */}
        <div className="flex items-center gap-4 sm:gap-6 text-[#F4F0E8]">
          {/* Search Trigger */}
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search products"
            className="p-1 hover:text-[#A64B2A] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Account Profile Trigger */}
          <button
            type="button"
            onClick={() => navigate(user ? '/profile' : '/sign-in')}
            aria-label={user ? `Account (${user.name})` : 'Sign in to account'}
            className="p-1 hover:text-[#A64B2A] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Shopping Bag Trigger with Badge Count */}
          <button
            type="button"
            onClick={openBag}
            aria-label={`Shopping bag with ${itemCount} items`}
            className="p-1 hover:text-[#A64B2A] transition-colors relative cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 rounded-full bg-[#A64B2A] text-white text-[10px] font-bold font-montserrat flex items-center justify-center leading-none shadow-[0_0_8px_rgba(166,75,42,0.8)]">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="md:hidden p-1 text-[#D9D1C3] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full bg-[#0B0B0B]/98 backdrop-blur-md border-b border-[#242321] px-6 py-5 flex flex-col gap-4 text-left z-40 animate-fadeIn">
          <button
            type="button"
            onClick={() => {
              navigate('/home');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#F4F0E8] text-sm font-semibold tracking-wide py-1"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick('hoodies')}
            className="text-left text-[#D9D1C3] text-sm py-1"
          >
            Shop Hoodies
          </button>
          <button
            type="button"
            onClick={() => handleCategoryClick('plain')}
            className="text-left text-[#D9D1C3] text-sm py-1"
          >
            Shop T-Shirts
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/collections');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#D9D1C3] text-sm py-1"
          >
            Explore Collections
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/our-story');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#D9D1C3] text-sm py-1"
          >
            About VYOMIK
          </button>
        </div>
      )}
    </nav>
  );
};
