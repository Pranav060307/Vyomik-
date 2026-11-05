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
    <header className="sticky top-0 z-40 bg-[#F4F3EE]/95 backdrop-blur-md border-b border-[#DAD7CE] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center">
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="text-2xl sm:text-[26px] font-light text-[#202020] tracking-[0.28em] uppercase transition-opacity hover:opacity-80"
          >
            VYOMIK
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-xs uppercase font-medium tracking-[0.16em] text-[#202020]">
          <Link
            to="/collections"
            className={`transition-colors hover:text-[#5C6548] pb-0.5 border-b-2 ${
              location.pathname === '/collections' ? 'border-[#202020]' : 'border-transparent'
            }`}
          >
            Collections
          </Link>
          <Link
            to="/our-story"
            className={`transition-colors hover:text-[#5C6548] pb-0.5 border-b-2 ${
              location.pathname === '/our-story' ? 'border-[#202020]' : 'border-transparent'
            }`}
          >
            Our story
          </Link>
          <Link
            to="/contact"
            className={`transition-colors hover:text-[#5C6548] pb-0.5 border-b-2 ${
              location.pathname === '/contact' ? 'border-[#202020]' : 'border-transparent'
            }`}
          >
            Contact
          </Link>
          <button
            type="button"
            onClick={handleBagClick}
            className={`flex items-center space-x-2 transition-colors hover:text-[#5C6548] focus:outline-none pb-0.5 border-b-2 ${
              location.pathname === '/bag' ? 'border-[#202020]' : 'border-transparent'
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
            className="p-1.5 text-[#202020] hover:text-[#5C6548] focus:outline-none"
            aria-label="Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {effectiveCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#202020] text-[#F4F3EE] text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {effectiveCount}
                </span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#202020] hover:text-[#5C6548] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-[1.5]" /> : <Menu className="w-6 h-6 stroke-[1.5]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-20 bg-[#F4F3EE] border-b border-[#DAD7CE] px-6 py-8 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-6 text-sm uppercase font-semibold tracking-[0.2em] text-[#202020]">
            <Link
              to="/collections"
              onClick={closeMobileMenu}
              className="hover:text-[#5C6548] transition-colors"
            >
              Collections
            </Link>
            <Link
              to="/bag"
              onClick={closeMobileMenu}
              className="hover:text-[#5C6548] transition-colors flex items-center justify-between"
            >
              <span>Shopping Bag</span>
              <span className="bg-[#202020] text-[#F4F3EE] text-[10px] px-2 py-0.5">
                {effectiveCount}
              </span>
            </Link>
            <Link
              to="/our-story"
              onClick={closeMobileMenu}
              className="hover:text-[#5C6548] transition-colors"
            >
              Our Story
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="hover:text-[#5C6548] transition-colors"
            >
              Contact
            </Link>
          </nav>
          <div className="mt-8 pt-6 border-t border-[#DAD7CE] flex items-center justify-between">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs text-[#202020] hover:text-[#5C6548]"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>{instagramHandle}</span>
            </a>
            <a
              href={mailtoUrl}
              className="text-xs text-[#202020]/70 hover:text-[#202020]"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
