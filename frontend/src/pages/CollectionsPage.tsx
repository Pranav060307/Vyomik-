import React, { useState } from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { WaitlistModal } from '../components/landing/WaitlistModal';
import { BagDrawer } from '../components/shop/BagDrawer';
import { DEMO_PRODUCTS, DemoProduct } from '../config/demoContent';
import { paise_to_inr_display } from '../utils/format';

export const CollectionsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistSource, setWaitlistSource] = useState('collections');
  const [isBagOpen, setIsBagOpen] = useState(false);

  const filteredProducts =
    selectedCategory === 'all'
      ? DEMO_PRODUCTS
      : DEMO_PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleNotifyProduct = (product: DemoProduct) => {
    setWaitlistSource(`product_${product.slug}`);
    setIsWaitlistOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F3EE] text-[#202020]">
      <AnnouncementBar />
      <Header
        bagCount={0}
        onOpenBag={() => setIsBagOpen(true)}
        onOpenNotifyModal={() => {
          setWaitlistSource('header_nav');
          setIsWaitlistOpen(true);
        }}
      />

      <main className="flex-1 max-w-7xl mx-auto px-6 sm:px-8 py-16 w-full">
        {/* Page Header */}
        <div className="border-b border-[#DAD7CE] pb-8 mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C6548]">
            CATALOGUE · FIRST DROP
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#202020] mt-2">
            The Complete Edit
          </h1>
          <p className="text-xs sm:text-sm text-[#202020]/70 mt-2 max-w-lg leading-relaxed">
            Everyday oversized essentials engineered with boxy silhouettes and heavyweight fabrics.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-8">
            {[
              { id: 'all', label: 'All Silhouettes' },
              { id: 'plain-tees', label: 'Plain Tees' },
              { id: 'wordmark-tees', label: 'Wordmark Tees' },
              { id: 'hoodies', label: 'Oversized Hoodies' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-[#202020] text-[#F4F3EE] border-[#202020]'
                    : 'bg-white text-[#202020] border-[#DAD7CE] hover:border-[#202020]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const firstColorKey = product.availableColors[0]?.key || 'ivory';
            const displayImage = product.images[firstColorKey] || Object.values(product.images)[0];

            return (
              <div
                key={product.id}
                className="group border border-[#DAD7CE] bg-white flex flex-col justify-between hover:border-[#202020] transition-colors"
              >
                <div className="relative aspect-[3/4] bg-[#EAE8E1]/50 border-b border-[#DAD7CE] overflow-hidden">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#202020] text-[#F4F3EE] text-[9px] uppercase tracking-wider px-2 py-0.5">
                    FIRST DROP
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#5C6548]">
                      {product.categoryLabel}
                    </span>
                    <h3 className="text-base font-semibold text-[#202020] mt-1 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-[#202020]/70 mt-1 line-clamp-2">
                      {product.headline}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#DAD7CE]/60 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#202020]">
                      {paise_to_inr_display(product.basePricePaise)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleNotifyProduct(product)}
                      className="text-[11px] font-medium uppercase tracking-wider text-[#5C6548] hover:text-[#202020] underline underline-offset-4"
                    >
                      Notify ↗
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer onOpenNotifyModal={() => {
        setWaitlistSource('footer');
        setIsWaitlistOpen(true);
      }} />

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        initialSource={waitlistSource}
      />

      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        onOpenWaitlist={() => {
          setWaitlistSource('bag_drawer');
          setIsWaitlistOpen(true);
        }}
      />
    </div>
  );
};

