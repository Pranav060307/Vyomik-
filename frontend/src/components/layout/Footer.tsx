import React from 'react';
import { Link } from 'react-router-dom';
import { instagramUrl, contactEmail, mailtoUrl } from '../../config/brand';
import { InstagramIcon } from '../common/InstagramIcon';

interface FooterProps {
  onOpenNotifyModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenNotifyModal }) => {
  return (
    <footer className="bg-[#202020] text-[#F4F3EE] pt-16 pb-12 px-4 sm:px-6 lg:px-12 border-t border-[#333333]">
      <div className="max-w-[1280px] mx-auto">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-16 border-b border-[#333333]">
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-xl sm:text-2xl font-light tracking-[0.28em] text-[#F4F3EE]">
              VYOMIK
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-[#DAD7CE]">
              ROOM TO BE YOU
            </p>
            <p className="text-xs text-[#DAD7CE]/70 max-w-sm leading-relaxed pt-2">
              Architectural oversized essentials. Plain tees, wordmark tees, and heavyweight hoodies designed for everyday presence and quiet confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#5C6548] font-semibold">
              Explore
            </h3>
            <ul className="space-y-2.5 text-xs tracking-wider text-[#DAD7CE]">
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-white transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenNotifyModal}
                  className="hover:text-white transition-colors text-left"
                >
                  Join Launch Waitlist ↗
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#5C6548] font-semibold">
              Connect & Legal
            </h3>
            <ul className="space-y-2.5 text-xs tracking-wider text-[#DAD7CE]">
              <li>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="VYOMIK on Instagram"
                  className="hover:text-white transition-colors inline-flex items-center space-x-1.5"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-current" />
                  <span>Instagram</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </li>
              <li>
                <a
                  href={mailtoUrl}
                  aria-label="Email VYOMIK"
                  className="hover:text-white transition-colors block"
                >
                  {contactEmail}
                </a>
              </li>
              <li className="pt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-[#DAD7CE]/70">
                <Link to="/shipping-returns" className="hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
                <span>·</span>
                <Link to="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <span>·</span>
                <Link to="/terms-of-service" className="hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] tracking-wider text-[#DAD7CE]/60 space-y-4 sm:space-y-0">
          <div>
            &copy; 2026 VYOMIK CLOTHING BRAND. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6 text-[10px] uppercase">
            <span>PUBLIC LAUNCH: 8 NOV 2026</span>
            <span>·</span>
            <span>MADE IN INDIA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

