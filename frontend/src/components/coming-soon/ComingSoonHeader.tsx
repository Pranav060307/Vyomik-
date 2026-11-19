import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ComingSoonHeaderProps {
  onNotifyClick?: () => void;
}

export const ComingSoonHeader: React.FC<ComingSoonHeaderProps> = ({ onNotifyClick }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNotify = () => {
    if (onNotifyClick) {
      onNotifyClick();
    } else {
      const formInput = document.getElementById('waitlist-email-input');
      formInput?.focus();
      formInput?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="w-full h-16 md:h-18 lg:h-20 px-6 sm:px-10 lg:px-14 flex items-center justify-between z-30 relative select-none shrink-0">
      {/* Official VYOMIK Logo Image Asset */}
      <div
        onClick={() => navigate('/home')}
        className="flex items-center cursor-pointer group transition-transform duration-200 hover:scale-105"
        role="banner"
        aria-label="VYOMIK Brand Home"
      >
        <img
          src="/assets/logo.png"
          alt="VYOMIK"
          className="h-8 sm:h-9 md:h-10 lg:h-11 w-auto object-contain"
        />
      </div>

      {/* Desktop Navigation Links */}
      <nav
        className="hidden md:flex items-center gap-8 lg:gap-12 text-[14px] lg:text-[15px] font-medium tracking-wide font-montserrat"
        role="navigation"
        aria-label="Main Navigation"
      >
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="relative text-[#F4F0E8] hover:text-white transition-colors py-1 cursor-pointer"
        >
          <span>Home</span>
          <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#D9D1C3]" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/our-story')}
          className="text-[#D9D1C3] hover:text-[#F4F0E8] transition-colors py-1 cursor-pointer"
        >
          About
        </button>

        <button
          type="button"
          onClick={() => navigate('/collections')}
          className="text-[#D9D1C3] hover:text-[#F4F0E8] transition-colors py-1 cursor-pointer"
        >
          Collections
        </button>

        {/* Notify Me Top Action Button (Outlined Burnt-Rust Button with Rust Glow on Hover) */}
        <button
          type="button"
          onClick={handleNotify}
          className="ml-2 inline-flex items-center gap-2 px-5 py-2 rounded-lg border border-[#A64B2A] text-[#F4F0E8] text-[13px] lg:text-[14px] font-semibold tracking-wide hover:bg-[#A64B2A] hover:text-white hover:shadow-[0_0_20px_rgba(166,75,42,0.55)] active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Notify Me</span>
          <span className="text-base leading-none">↗</span>
        </button>
      </nav>

      {/* Mobile Hamburger Toggle */}
      <div className="flex md:hidden items-center gap-3">
        <button
          type="button"
          onClick={handleNotify}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md border border-[#D9D1C3]/50 text-[#F4F0E8] text-[12px] font-semibold hover:bg-[#A64B2A] transition-colors"
        >
          <span>Notify</span>
          <span className="text-xs">↗</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#D9D1C3] hover:text-white transition-colors"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#0B0B0B]/95 backdrop-blur-md border-b border-[#242321] px-6 py-5 flex flex-col gap-4 text-left z-40">
          <button
            type="button"
            onClick={() => {
              navigate('/home');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#F4F0E8] text-base font-medium py-1"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/our-story');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#D9D1C3] hover:text-white text-base font-medium py-1"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => {
              navigate('/collections');
              setMobileMenuOpen(false);
            }}
            className="text-left text-[#D9D1C3] hover:text-white text-base font-medium py-1"
          >
            Collections
          </button>
        </div>
      )}
    </header>
  );
};
