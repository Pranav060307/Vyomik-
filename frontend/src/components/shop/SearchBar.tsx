import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, TrendingUp } from 'lucide-react';
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
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  const handleSearch = (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      closeSearch();
      navigate(`/shop?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      closeSearch();
    }
  };

  if (!isSearchOpen) return null;

  const trendingTags = ['Core Hoodie', 'Element Tee', 'Terrain Cargos', 'Cap', 'Rust Hoodie'];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeSearch}
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Floating Search Container */}
      <div
        className={`fixed left-0 right-0 top-0 bg-[#0B0B0B]/98 backdrop-blur-md border-b border-[#242321] z-50 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 transition-all duration-300 shadow-2xl font-montserrat ${
          isSearchOpen ? 'translate-y-0 pointer-events-auto' : '-translate-y-full pointer-events-none'
        }`}
        role="search"
      >
        <div className="max-w-4xl mx-auto">
          {/* Top Row: Input & Close */}
          <div className="flex items-center gap-4 border-b border-[#242321] pb-3 focus-within:border-[#C85A2E] transition-colors">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#C85A2E] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search hoodies, t-shirts, cargos, accessories…"
              className="flex-1 bg-transparent outline-none text-[#F4F0E8] placeholder:text-[#716B63] text-base sm:text-xl font-medium tracking-wide"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-[#716B63] hover:text-[#F4F0E8] text-xs transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeSearch}
              className="w-8 h-8 rounded-lg bg-[#141414] border border-[#242321] text-[#716B63] hover:text-[#F4F0E8] hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer ml-2"
              aria-label="Close search"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Suggestions / Trending Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-[#716B63] font-semibold mr-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#C85A2E]" /> Trending:
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSearch(tag)}
                className="px-3 py-1 rounded-full bg-[#141414] border border-[#242321] text-[#D9D1C3] hover:text-white hover:border-[#C85A2E] transition-all cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
