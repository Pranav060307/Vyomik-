import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { VyomikLogo } from '../common/VyomikLogo';
import { instagramUrl, contactEmail, mailtoUrl } from '../../config/brand';

interface FooterProps {
  onOpenNotifyModal?: () => void;
  variant?: 'home' | 'full';
  onSelectCategory?: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ variant = 'full', onSelectCategory }) => {
  const navigate = useNavigate();

  if (variant === 'home') {
    return (
      <footer id="foot" role="contentinfo" className="bg-[#0B0B0B] border-t border-[#242321] text-[#F4F0E8] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex flex-col items-start">
            <div
              onClick={() => navigate('/home')}
              role="button"
              tabIndex={0}
              aria-label="VYOMIK"
              className="cursor-pointer mb-4"
            >
              <img src="/assets/logo.png" alt="VYOMIK" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-xs text-[#716B63] max-w-xs leading-relaxed">
              Everyday oversized essentials, engineered with boxy silhouettes and heavyweight fabrics.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-[#D9D1C3]">
            <b className="text-white uppercase tracking-wider mb-1">SHOP</b>
            <span onClick={() => navigate('/collections')} className="hover:text-[#C85A2E] cursor-pointer">New Arrivals</span>
            <span onClick={() => onSelectCategory ? onSelectCategory('plain') : navigate('/collections?cat=plain')} className="hover:text-[#C85A2E] cursor-pointer">Plain Tees</span>
            <span onClick={() => onSelectCategory ? onSelectCategory('wordmark') : navigate('/collections?cat=wordmark')} className="hover:text-[#C85A2E] cursor-pointer">Wordmark Tees</span>
            <span onClick={() => onSelectCategory ? onSelectCategory('hoodies') : navigate('/collections?cat=hoodies')} className="hover:text-[#C85A2E] cursor-pointer">Oversized Hoodies</span>
          </div>
          <div className="flex flex-col gap-2 text-xs text-[#D9D1C3]">
            <b className="text-white uppercase tracking-wider mb-1">ACCOUNT</b>
            <span onClick={() => navigate('/sign-in')} className="hover:text-[#C85A2E] cursor-pointer">Sign In</span>
            <span onClick={() => navigate('/sign-up')} className="hover:text-[#C85A2E] cursor-pointer">Create Account</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#242321] text-xs text-[#716B63] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>&copy; 2026 VYOMIK. All rights reserved.</span>
          <span className="sr-only">
            <span>ROOM TO BE YOU</span>
            <a href={mailtoUrl}>{contactEmail}</a>
            <a href={instagramUrl}>Instagram</a>
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer
      id="foot"
      className="w-full border-t border-[#242321] bg-[#0B0B0B] text-[#F4F0E8] px-6 md:px-16 lg:px-24 py-14 select-none relative"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-20 mb-12">
        {/* Brand Column */}
        <div className="w-full lg:w-[480px]">
          <VyomikLogo
            markClassName="w-[45px] md:w-[52px]"
            textClassName="text-[22px] md:text-[26px] font-bold tracking-[0.35em] text-[#F4F0E8]"
          />
          <p className="mt-5 text-sm leading-relaxed text-[#716B63] max-w-sm">
            Everyday oversized essentials, engineered with boxy silhouettes and heavyweight fabrics.
          </p>

          {/* Social and Contact compliant links */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-[#716B63]">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VYOMIK on Instagram"
              className="hover:text-[#C85A2E] transition-colors"
            >
              Instagram
            </a>
            <span className="w-1 h-1 rounded-full bg-[#333]" />
            <a
              href={mailtoUrl}
              aria-label="Email VYOMIK"
              className="hover:text-[#C85A2E] transition-colors"
            >
              {contactEmail}
            </a>
            <span className="w-1 h-1 rounded-full bg-[#333]" />
            <Link
              to="/contact"
              aria-label="Contact"
              className="hover:text-[#C85A2E] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Shop Column */}
        <div className="flex flex-col gap-2.5 text-xs text-[#D9D1C3]">
          <b className="block text-xs uppercase tracking-[0.2em] font-bold text-[#F4F0E8] mb-2">
            SHOP
          </b>
          <span
            onClick={() => navigate('/collections')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            New Arrivals
          </span>
          <span
            onClick={() => navigate('/collections?cat=plain')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Plain Tees
          </span>
          <span
            onClick={() => navigate('/collections?cat=wordmark')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Wordmark Tees
          </span>
          <span
            onClick={() => navigate('/collections?cat=hoodies')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Oversized Hoodies
          </span>
        </div>

        {/* Account & Policies Column */}
        <div className="flex flex-col gap-2.5 text-xs text-[#D9D1C3]">
          <b className="block text-xs uppercase tracking-[0.2em] font-bold text-[#F4F0E8] mb-2">
            ACCOUNT
          </b>
          <span
            onClick={() => navigate('/sign-in')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Sign In
          </span>
          <span
            onClick={() => navigate('/sign-up')}
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Create Account
          </span>
          <Link
            to="/shipping-returns"
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Shipping & Returns
          </Link>
          <Link
            to="/privacy-policy"
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="hover:text-[#C85A2E] cursor-pointer transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto text-xs text-[#716B63] border-t border-[#242321] pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <span>&copy; 2026 VYOMIK. All rights reserved.</span>
        <span className="text-[11px] tracking-widest uppercase text-[#555]">
          ROOM TO BE YOU
        </span>
      </div>
    </footer>
  );
};
