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
      <footer id="foot" role="contentinfo">
        <div className="fl">
          <div
            className="logo"
            onClick={() => navigate('/home')}
            role="button"
            tabIndex={0}
            aria-label="VYOMIK"
          >
            <svg className="logo-mark" viewBox="0 0 80 66" xmlns="http://www.w3.org/2000/svg">
              <polygon points="0,0 80,0 40,66" fill="#e10600" />
              <polygon points="14,8 38,8 40,22 52,8 66,8 40,52" fill="#0b0b0b" />
              <polygon points="28,16 40,34 52,16 44,16 40,22 36,16" fill="#e10600" />
            </svg>
            <span className="logo-text">VYOMIK</span>
          </div>
          <p>Everyday oversized essentials, engineered with boxy silhouettes and heavyweight fabrics.</p>
        </div>
        <div className="fc">
          <b>SHOP</b>
          <span onClick={() => navigate('/collections')}>New Arrivals</span>
          <span onClick={() => onSelectCategory ? onSelectCategory('plain') : navigate('/collections?cat=plain')}>Plain Tees</span>
          <span onClick={() => onSelectCategory ? onSelectCategory('wordmark') : navigate('/collections?cat=wordmark')}>Wordmark Tees</span>
          <span onClick={() => onSelectCategory ? onSelectCategory('hoodies') : navigate('/collections?cat=hoodies')}>Oversized Hoodies</span>
        </div>
        <div className="fc">
          <b>ACCOUNT</b>
          <span onClick={() => navigate('/sign-in')}>Sign In</span>
          <span onClick={() => navigate('/sign-up')}>Create Account</span>
        </div>
        <div className="copy">
          &copy; 2026 VYOMIK. All rights reserved.
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
      className="w-full border-t border-[#222] bg-black text-white px-6 md:px-[112px] py-12 md:py-[70px] select-none relative"
      role="contentinfo"
    >
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-[150px] mb-12">
        {/* Brand Column */}
        <div className="w-full lg:w-[520px]">
          <VyomikLogo
            markClassName="w-[50px] md:w-[60px]"
            textClassName="text-[26px] md:text-[30px] font-semibold tracking-[0.5em]"
          />
          <p className="mt-[26px] text-[18px] md:text-[20px] leading-[1.6] text-[#aaa]">
            Everyday oversized essentials, engineered with boxy silhouettes and heavyweight fabrics.
          </p>

          {/* Social and Contact compliant links */}
          <div className="mt-6 flex flex-wrap items-center gap-6 text-[15px] md:text-[16px] text-[#888]">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VYOMIK on Instagram"
              className="hover:text-[#e10600] transition-colors"
            >
              Instagram
            </a>
            <span className="w-1.5 h-1.5 rounded-full bg-[#444]" />
            <a
              href={mailtoUrl}
              aria-label="Email VYOMIK"
              className="hover:text-[#e10600] transition-colors"
            >
              {contactEmail}
            </a>
            <span className="w-1.5 h-1.5 rounded-full bg-[#444]" />
            <Link
              to="/contact"
              aria-label="Contact"
              className="hover:text-[#e10600] transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Shop Column */}
        <div className="fc">
          <b className="block text-[15px] md:text-[17px] tracking-[0.35em] mb-[22px] font-bold text-white">
            SHOP
          </b>
          <span
            onClick={() => navigate('/collections')}
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            New Arrivals
          </span>
          <span
            onClick={() => navigate('/collections?cat=plain')}
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Plain Tees
          </span>
          <span
            onClick={() => navigate('/collections?cat=wordmark')}
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Wordmark Tees
          </span>
          <span
            onClick={() => navigate('/collections?cat=hoodies')}
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Oversized Hoodies
          </span>
        </div>

        {/* Account & Policies Column */}
        <div className="fc">
          <b className="block text-[15px] md:text-[17px] tracking-[0.35em] mb-[22px] font-bold text-white">
            ACCOUNT
          </b>
          <span
            onClick={() => navigate('/sign-in')}
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Sign In
          </span>
          <span
            onClick={() => navigate('/sign-up')}
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Create Account
          </span>
          <Link
            to="/shipping-returns"
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Shipping & Returns
          </Link>
          <Link
            to="/privacy-policy"
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="block text-[18px] md:text-[20px] text-[#ccc] mb-[14px] hover:text-[#e10600] cursor-pointer transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="copy text-[15px] md:text-[16px] text-[#777] border-t border-[#1a1a1a] pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>&copy; 2026 VYOMIK. All rights reserved.</span>
        <span className="text-[13px] tracking-widest uppercase text-[#555]">
          ROOM TO BE YOU
        </span>
      </div>
    </footer>
  );
};
