import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface ProductBreadcrumbsProps {
  category: string;
  categoryLabel: string;
  productName: string;
}

export const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({
  category,
  categoryLabel,
  productName,
}) => {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-4 flex items-center text-xs sm:text-[13px] font-montserrat text-[#716B63]"
    >
      <Link
        to="/"
        className="hover:text-[#F4F0E8] transition-colors tracking-wide"
      >
        Home
      </Link>
      <ChevronRight className="w-3.5 h-3.5 mx-2 text-[#716B63]/60 flex-shrink-0" />

      <Link
        to="/shop"
        className="hover:text-[#F4F0E8] transition-colors tracking-wide"
      >
        Shop
      </Link>
      <ChevronRight className="w-3.5 h-3.5 mx-2 text-[#716B63]/60 flex-shrink-0" />

      <Link
        to={`/shop?cat=${category}`}
        className="hover:text-[#F4F0E8] transition-colors tracking-wide capitalize"
      >
        {categoryLabel || category}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 mx-2 text-[#716B63]/60 flex-shrink-0" />

      <span className="text-[#F4F0E8] font-medium truncate max-w-[200px] sm:max-w-none">
        {productName}
      </span>
    </nav>
  );
};

