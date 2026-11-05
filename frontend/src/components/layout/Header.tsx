import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { instagramUrl, instagramHandle, contactEmail, mailtoUrl } from '../../config/brand';
import { InstagramIcon } from '../common/InstagramIcon';

interface HeaderProps {
  bagCount?: number;
  onOpenBag?: () => void;
  onOpenNotifyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  bagCount = 0,
  onOpenBag,
  onOpenNotifyModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setMobileMenuOpen(false);

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
            onClick={onOpenBag}
            className="flex items-center space-x-2 transition-colors hover:text-[#5C6548] focus:outline-none"
            aria-label={`Shopping bag with ${bagCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span>Bag ({bagCount})</span>
          </button>
        </nav>

        {/* Mobile Hamburger & Quick Bag */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            type="button"
            onClick={onOpenBag}
            className="p-1.5 text-[#202020] hover:text-[#5C6548] focus:outline-none"
            aria-label="Bag"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {bagCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#202020] text-[#F4F3EE] text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                  {bagCount}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F4F3EE] border-b border-[#DAD7CE] px-6 py-8 space-y-6 animate-fadeIn">
          <nav className="flex flex-col space-y-5 text-sm uppercase font-medium tracking-[0.18em] text-[#202020]">
            <Link
              to="/collections"
              onClick={closeMobileMenu}
              className="py-1 border-b border-[#DAD7CE]/50 flex justify-between items-center"
            >
              <span>Collections</span>
              <span className="text-[10px] text-[#5C6548]">DROP 01</span>
            </Link>
            <Link
              to="/our-story"
              onClick={closeMobileMenu}
              className="py-1 border-b border-[#DAD7CE]/50"
            >
              Our story
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="py-1 border-b border-[#DAD7CE]/50"
            >
              Contact
            </Link>
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                if (onOpenNotifyModal) onOpenNotifyModal();
              }}
              className="py-1 text-left text-[#5C6548] flex items-center justify-between"
            >
              <span>Notify me at launch</span>
              <span>↗</span>
            </button>
          </nav>

          {/* Mobile Drawer Connect Footer */}
          <div className="pt-6 border-t border-[#DAD7CE] space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5C6548] block">
              Connect
            </span>
            <div className="flex flex-col space-y-2 text-xs tracking-wider">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on Instagram"
                className="flex items-center space-x-2 text-[#202020] hover:text-[#5C6548] transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-current" />
                <span>Instagram ({instagramHandle}) ↗</span>
              </a>
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="text-[#202020]/80 hover:text-[#5C6548] transition-colors lowercase"
              >
                {contactEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

