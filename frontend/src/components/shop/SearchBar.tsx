import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export const SearchBar: React.FC = () => {
  const { isSearchOpen, closeSearch } = useCart();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      closeSearch();
      navigate(`/collections?q=${encodeURIComponent(query.trim())}`);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  return (
    <div
      className={`fixed left-0 right-0 top-0 h-[100px] md:h-[130px] bg-[#0b0b0b] border-b-[3px] border-[#e10600] z-50 flex items-center gap-6 md:gap-[30px] px-6 md:px-[112px] transition-transform duration-300 ${
        isSearchOpen ? 'translate-y-0' : '-translate-y-[110%]'
      }`}
      role="search"
    >
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search tees, hoodies…"
        className="flex-1 bg-transparent border-0 border-b-2 border-[#666] outline-none text-white font-normal text-[22px] md:text-[34px] py-2 focus:border-[#e10600] placeholder:text-[#666]"
      />
      <span
        onClick={closeSearch}
        className="text-[28px] md:text-[34px] text-white hover:text-[#e10600] cursor-pointer transition-colors leading-none"
        role="button"
        aria-label="Close search"
      >
        ✕
      </span>
    </div>
  );
};
