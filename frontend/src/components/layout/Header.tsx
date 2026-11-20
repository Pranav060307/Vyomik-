import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../../config/brand';
import { InstagramIcon } from '../common/InstagramIcon';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  bagCount?: number;
  onOpenBag?: () => void;
  onOpenNotifyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  bagCount = 0,
  onOpenBag,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();

  const effectiveCount = bagCount > 0 ? bagCount : itemCount;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleBagClick = () => {
    closeMobileMenu();
    if (onOpenBag) {
      onOpenBag();
    } else {
      navigate('/bag');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-[#242321] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 transition-opacity hover:opacity-85"
          >
            <img src="/assets/logo.png" alt="VYOMIK" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-xs uppercase font-bold tracking-[0.16em] text-[#F4F0E8]">
          <Link
            to="/collections"
            className={`transition-colors hover:text-[#C85A2E] pb-0.5 border-b-2 ${
              location.pathname === '/collections' ? 'border-[#C85A2E] text-[#C85A2E]' : 'border-transparent text-[#F4F0E8]'
            }`}
          >
            Collections
          </Link>
          <Link
            to="/our-story"
            className={`transition-colors hover:text-[#C85A2E] pb-0.5 border-b-2 ${
              location.pathname === '/our-story' || location.pathname === '/about' ? 'border-[#C85A2E] text-[#C85A2E]' : 'border-transparent text-[#F4F0E8]'
            }`}
          >
            Our story
          </Link>
          <Link
            to="/contact"
            className={`transition-colors hover:text-[#C85A2E] pb-0.5 border-b-2 ${
              location.pathname === '/contact' ? 'border-[#C85A2E] text-[#C85A2E]' : 'border-transparent text-[#F4F0E8]'
            }`}
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={handleBagClick}
            className={`flex items-center space-x-2 transition-colors hover:text-[#C85A2E] focus:outline-none pb-0.5 border-b-2 cursor-pointer ${
              location.pathname === '/bag' ? 'border-[#C85A2E] text-[#C85A2E]' : 'border-transparent text-[#F4F0E8]'
            }`}
            aria-label={`Shopping bag with ${effectiveCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span>Bag ({effectiveCount})</span>
          </button>
        </nav>

        {/* Mobile Hamburger & Quick Bag */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            type="button"
            onClick={handleBagClick}
            className="p-1.5 text-[#F4F0E8] hover:text-[#C85A2E] focus:outline-none cursor-pointer"
            aria-label="Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {effectiveCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#C85A2E] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {effectiveCount}
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#F4F0E8] hover:text-[#C85A2E] focus:outline-none cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-[#141414] border-b border-[#242321] px-6 py-8 shadow-2xl animate-fadeIn z-50">
          <nav className="flex flex-col space-y-6 text-sm uppercase font-bold tracking-[0.2em] text-[#F4F0E8]">
            <Link
              to="/collections"
              onClick={closeMobileMenu}
              className="hover:text-[#C85A2E] transition-colors"
            >
              Collections
            </Link>
            <Link
              to="/bag"
              onClick={closeMobileMenu}
              className="hover:text-[#C85A2E] transition-colors flex items-center justify-between"
            >
              <span>Shopping Bag</span>
              <span className="bg-[#C85A2E] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                {effectiveCount}
              </span>
            </Link>
            <Link
              to="/our-story"
              onClick={closeMobileMenu}
              className="hover:text-[#C85A2E] transition-colors"
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="hover:text-[#C85A2E] transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="mt-8 pt-6 border-t border-[#242321] flex items-center justify-between">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs text-[#716B63] hover:text-[#C85A2E]"
            >
              <InstagramIcon className="w-4 h-4 text-[#C85A2E]" />
              <span>{instagramHandle}</span>
            </a>
            <a
              href={mailtoUrl}
              className="text-xs text-[#716B63] hover:text-[#F4F0E8]"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
