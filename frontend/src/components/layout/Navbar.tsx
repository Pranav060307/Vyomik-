import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VyomikLogo } from '../common/VyomikLogo';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface NavbarProps {
  variant?: 'home' | 'auth' | 'minimal';
  onSelectCategory?: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ variant = 'home', onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openBag, openSearch } = useCart();
  const { user, signout } = useAuth();
  const { toast } = useToast();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const collectionsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (collectionsRef.current && !collectionsRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCollectionsClick = (cat: string) => {
    setIsDropdownOpen(false);
    if (location.pathname === '/home' || location.pathname === '/') {
      if (onSelectCategory) {
        onSelectCategory(cat);
      } else {
        const grid = document.getElementById('grid');
        grid?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/collections?cat=${cat}`);
    }
  };

  const handleAccountClick = () => {
    if (!user) {
      navigate('/sign-in');
    } else {
      setIsUserMenuOpen((prev) => !prev);
    }
  };

  if (variant === 'auth') {
    return (
      <nav
        className="w-full h-[86px] border-b-[3px] border-white flex items-center justify-between px-6 md:px-[60px] select-none relative z-20"
        role="navigation"
        aria-label="Main Navigation"
      >
        <VyomikLogo
          markClassName="w-[60px] md:w-[88px]"
          textClassName="text-[26px] md:text-[36px] tracking-[0.55em] font-medium"
        />
        <div className="flex items-center gap-6 md:gap-[56px] text-[15px] md:text-[20px] tracking-[0.14em] font-semibold text-white">
          <span
            onClick={() => navigate('/collections')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            COLLECTIONS
          </span>
          <span
            onClick={() => navigate('/our-story')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            OUR STORY
          </span>
          <span
            onClick={() => navigate('/contact')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            CONTACT
          </span>
        </div>
      </nav>
    );
  }

  return (
    <div className="nav" role="navigation" aria-label="Main Navigation">
      {/* Brand Logo */}
      <div
        className="logo"
        onClick={() => navigate('/home')}
        role="button"
        tabIndex={0}
        aria-label="VYOMIK"
      >
        <svg className="logo-mark" viewBox="0 0 80 66" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 80,0 40,66" fill="#C85A2E" />
          <polygon points="14,8 38,8 40,22 52,8 66,8 40,52" fill="#0b0b0b" />
          <polygon points="28,16 40,34 52,16 44,16 40,22 36,16" fill="#C85A2E" />
        </svg>
        <span className="logo-text">VYOMIK</span>
      </div>

      {/* Center Links */}
      <div className="mid">
        <span
          ref={collectionsRef}
          onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen((prev) => !prev);
          }}
          role="button"
          tabIndex={0}
        >
          Collections{' '}
          <span className="ico">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </span>
        <span
          onClick={() => toast('Our Story page is not built yet')}
          role="button"
          tabIndex={0}
        >
          Our Story
        </span>
        <span
          onClick={() => toast('Contact page is not built yet')}
          role="button"
          tabIndex={0}
        >
          Contact
        </span>
      </div>

      {/* Collections Dropdown */}
      {isDropdownOpen && (
        <div
          className="dd open"
          style={{
            position: 'absolute',
            left: 'calc(50% - 210px)',
            top: '78px',
            zIndex: 50,
          }}
        >
          <span onClick={() => handleCollectionsClick('all')}>All Collections</span>
          <span onClick={() => handleCollectionsClick('plain')}>Plain Tees</span>
          <span onClick={() => handleCollectionsClick('wordmark')}>Wordmark Tees</span>
          <span onClick={() => handleCollectionsClick('hoodies')}>Oversized Hoodies</span>
        </div>
      )}

      {/* Right Icons */}
      <div className="rt">
        {/* Search Icon */}
        <span
          className="ico"
          onClick={openSearch}
          role="button"
          tabIndex={0}
          aria-label="Open search bar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4" />
          </svg>
        </span>

        {/* User Account Icon */}
        <span
          ref={userMenuRef}
          className="ico"
          onClick={handleAccountClick}
          role="button"
          tabIndex={0}
          aria-label="User account"
          title={user ? `Signed in as ${user.name}` : undefined}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7" />
          </svg>
        </span>

        {/* Bag Icon */}
        <span
          className="bg"
          onClick={openBag}
          role="button"
          tabIndex={0}
          aria-label={`Open shopping bag, ${itemCount} items`}
        >
          <span className="ico" style={{ width: '26px', height: '26px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="4" y="7" width="16" height="14" rx="2" />
              <path d="M8 7a4 4 0 018 0" />
            </svg>
          </span>
          <b data-bag style={{ fontWeight: 400 }}>Bag ({itemCount})</b>
        </span>
      </div>

      {/* User Dropdown Menu */}
      {isUserMenuOpen && user && (
        <div
          className="umenu open"
          style={{
            position: 'absolute',
            right: '120px',
            top: '78px',
            zIndex: 50,
          }}
        >
          <p>Hi, {user.name}</p>
          <span
            onClick={() => {
              signout();
              setIsUserMenuOpen(false);
              toast('Signed out');
            }}
          >
            Sign out
          </span>
        </div>
      )}
    </div>
  );
};
