import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { instagramUrl, contactEmail, mailtoUrl } from '../../config/brand';

interface HomeFooterProps {
  onSelectCategory?: (category: string) => void;
}

export const HomeFooter: React.FC<HomeFooterProps> = ({ onSelectCategory }) => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (cat: string) => {
    if (onSelectCategory) {
      onSelectCategory(cat);
    } else {
      navigate(cat === 'all' ? '/shop' : `/shop?cat=${cat}`);
    }
  };

  return (
    <footer
      id="foot"
      role="contentinfo"
      aria-label="Footer"
      className="w-full bg-[#0B0B0B] border-t border-[#242321] text-[#F4F0E8] pt-16 pb-12 px-6 sm:px-10 lg:px-16 relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-16 border-b border-[#242321]">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-1 flex flex-col items-start">
            <div
              onClick={() => navigate('/home')}
              className="cursor-pointer group flex items-center"
              role="button"
              tabIndex={0}
              aria-label="VYOMIK Home"
            >
              <img
                src="/assets/logo.png"
                alt="VYOMIK"
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
              />
            </div>
            <p className="mt-5 text-[#716B63] font-montserrat text-xs sm:text-[13px] leading-relaxed max-w-xs">
              Modern streetwear for a generation that thinks different.
            </p>
          </div>

          {/* Col 2: Shop */}
          <div className="flex flex-col text-left">
            <h4 className="text-[13px] font-montserrat font-bold uppercase tracking-wider text-[#F4F0E8] mb-4">
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#D9D1C3] font-montserrat">
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('all')}
                  className="hover:text-[#A64B2A] transition-colors cursor-pointer text-left"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('oversized')}
                  className="hover:text-[#A64B2A] transition-colors cursor-pointer text-left"
                >
                  Oversized Tees
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('sweatshirt')}
                  className="hover:text-[#A64B2A] transition-colors cursor-pointer text-left"
                >
                  Sweatshirts
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleCategoryClick('hoodies')}
                  className="hover:text-[#A64B2A] transition-colors cursor-pointer text-left"
                >
                  Hoodies
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div className="flex flex-col text-left">
            <h4 className="text-[13px] font-montserrat font-bold uppercase tracking-wider text-[#F4F0E8] mb-4">
              Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#D9D1C3] font-montserrat">
              <li>
                <Link to="/our-story" className="hover:text-[#A64B2A] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-[#A64B2A] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#A64B2A] transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#A64B2A] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" aria-label="Contact" className="hover:text-[#A64B2A] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Support */}
          <div className="flex flex-col text-left">
            <h4 className="text-[13px] font-montserrat font-bold uppercase tracking-wider text-[#F4F0E8] mb-4">
              Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-[#D9D1C3] font-montserrat">
              <li>
                <Link to="/faq" className="hover:text-[#A64B2A] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-[#A64B2A] transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/shipping-returns" className="hover:text-[#A64B2A] transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="hover:text-[#A64B2A] transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#A64B2A] transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Follow Us */}
          <div className="flex flex-col text-left">
            <h4 className="text-[13px] font-montserrat font-bold uppercase tracking-wider text-[#F4F0E8] mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-4 text-[#D9D1C3]">
              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on Instagram"
                className="w-9 h-9 rounded-lg bg-[#141210] border border-[#242321] flex items-center justify-center hover:text-[#A64B2A] hover:border-[#A64B2A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@vyomik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on YouTube"
                className="w-9 h-9 rounded-lg bg-[#141210] border border-[#242321] flex items-center justify-center hover:text-[#A64B2A] hover:border-[#A64B2A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://twitter.com/vyomik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK on X"
                className="w-9 h-9 rounded-lg bg-[#141210] border border-[#242321] flex items-center justify-center hover:text-[#A64B2A] hover:border-[#A64B2A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/vyomik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VYOMIK Discord Community"
                className="w-9 h-9 rounded-lg bg-[#141210] border border-[#242321] flex items-center justify-center hover:text-[#A64B2A] hover:border-[#A64B2A] transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>

            <div className="mt-5">
              <a
                href={mailtoUrl}
                aria-label="Email VYOMIK"
                className="text-xs text-[#716B63] hover:text-[#F4F0E8] transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{contactEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#716B63] font-montserrat gap-4">
          <p>© 2026 VYOMIK. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-[#D9D1C3] transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link to="/terms" className="hover:text-[#D9D1C3] transition-colors">
              Terms & Conditions
            </Link>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1.5 hover:text-[#F4F0E8] transition-colors cursor-pointer"
          >
            <span>Top</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};
