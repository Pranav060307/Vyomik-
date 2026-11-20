import React, { useState } from 'react';
import { Check, Star, ShieldCheck } from 'lucide-react';
import { ShopProduct } from '../../config/shopProducts';

interface ProductInfoTabsProps {
  product: ShopProduct;
  tabRef?: React.Ref<HTMLDivElement>;
}

export type TabKey = 'details' | 'fabric' | 'shipping' | 'reviews';

export const ProductInfoTabs: React.FC<ProductInfoTabsProps> = ({
  product,
  tabRef,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('details');

  const tabs: Array<{ key: TabKey; label: string }> = [
    { key: 'details', label: 'Product Details' },
    { key: 'fabric', label: 'Fabric & Care' },
    { key: 'shipping', label: 'Shipping & Returns' },
    { key: 'reviews', label: `Reviews (${product.reviewCount || 124})` },
  ];

  return (
    <div
      ref={tabRef}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-12 sm:mt-16 text-left"
    >
      {/* Tab Navigation Strip */}
      <div
        className="flex items-center gap-6 sm:gap-10 border-b border-[#242321] overflow-x-auto scrollbar-none"
        role="tablist"
        aria-label="Product Information Tabs"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 sm:pb-3.5 text-xs sm:text-sm font-montserrat font-bold whitespace-nowrap transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#F4F0E8]'
                  : 'text-[#716B63] hover:text-[#D9D1C3]'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C85A2E] rounded-full shadow-[0_0_8px_rgba(200,90,46,0.6)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="pt-6 sm:pt-8">
        {/* TAB 1: Product Details (Exact 3-Zone Composition from Reference) */}
        {activeTab === 'details' && (
          <div
            id="panel-details"
            role="tabpanel"
            aria-labelledby="tab-details"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-fadeIn"
          >
            {/* Zone 1: Editorial Description */}
            <div className="lg:col-span-4">
              <p className="text-xs sm:text-[13px] leading-relaxed text-[#A8A29E] font-normal">
                The Core Hoodie is a wardrobe essential designed for comfort, versatility, and everyday expression. Crafted from premium cotton-blend fabric, it delivers a soft, structured feel with a modern, relaxed fit.
              </p>
            </div>

            {/* Zone 2: Feature Checkpoints */}
            <div className="lg:col-span-4 space-y-2.5">
              {(product.features && product.features.length > 0
                ? product.features
                : [
                    'Premium cotton blend (320 GSM)',
                    'Relaxed unisex fit',
                    'Ribbed cuffs and hem',
                    'VYOMIK signature logo detail',
                    'Everyday wear – all seasons',
                  ]
              ).map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#F4F0E8]"
                >
                  <Check className="w-3.5 h-3.5 text-[#C85A2E] flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Zone 3: Macro Fabric Banner */}
            <div className="lg:col-span-4 rounded-xl overflow-hidden border border-[#242321] bg-[#141414] shadow-md group">
              <img
                src="/images/vyomik/products/pdp/core-hoodie-details-banner.jpg"
                alt="VYOMIK Fabric Craftsmanship"
                className="w-full h-32 sm:h-36 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Fabric & Care */}
        {activeTab === 'fabric' && (
          <div
            id="panel-fabric"
            role="tabpanel"
            aria-labelledby="tab-fabric"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn text-xs sm:text-[13px]"
          >
            <div className="space-y-3">
              <h4 className="font-montserrat font-bold text-[#F4F0E8] text-sm uppercase tracking-wider">
                Material & Construction
              </h4>
              <p className="text-[#A8A29E] leading-relaxed">
                Constructed from 80% Combed Compact Cotton and 20% Polyester fleece. Custom milled 320 GSM French Terry providing heavy, structured streetwear drape with micro-loopback backing for all-day thermal comfort.
              </p>
              <ul className="space-y-1.5 text-[#D9D1C3]">
                <li>• Pre-shrunk fabric to prevent post-wash shrinkage</li>
                <li>• Reinforced twin-needle stitching at stress points</li>
                <li>• Double-layer hood construction without loose drawstrings</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-montserrat font-bold text-[#F4F0E8] text-sm uppercase tracking-wider">
                Care Instructions
              </h4>
              <ul className="space-y-2 text-[#A8A29E]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C85A2E] font-bold">1.</span>
                  <span>Machine wash cold (30°C max) inside out with similar colors.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C85A2E] font-bold">2.</span>
                  <span>Use gentle, bleach-free detergent to maintain depth of color.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C85A2E] font-bold">3.</span>
                  <span>Flat dry in shade or tumble dry low. Do not wring or dry clean.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C85A2E] font-bold">4.</span>
                  <span>Warm iron on reverse. Never iron directly over chest embroidery or back print.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: Shipping & Returns */}
        {activeTab === 'shipping' && (
          <div
            id="panel-shipping"
            role="tabpanel"
            aria-labelledby="tab-shipping"
            className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn text-xs sm:text-[13px]"
          >
            <div className="space-y-3">
              <h4 className="font-montserrat font-bold text-[#F4F0E8] text-sm uppercase tracking-wider">
                Shipping & Delivery
              </h4>
              <p className="text-[#A8A29E] leading-relaxed">
                All orders are dispatched from our central hub within 24–48 hours. We partner with Bluedart, Delhivery, and Xpressbees for guaranteed tracked delivery.
              </p>
              <ul className="space-y-1.5 text-[#D9D1C3]">
                <li>• <strong className="text-[#F4F0E8]">Free Shipping:</strong> On all domestic orders above ₹1,499.</li>
                <li>• <strong className="text-[#F4F0E8]">Metro Cities:</strong> 2 to 4 business days.</li>
                <li>• <strong className="text-[#F4F0E8]">Rest of India:</strong> 4 to 6 business days.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-montserrat font-bold text-[#F4F0E8] text-sm uppercase tracking-wider">
                7-Day Hassle-Free Returns
              </h4>
              <p className="text-[#A8A29E] leading-relaxed">
                If the fit or color isn't completely right, exchange or return it within 7 days of delivery.
              </p>
              <ul className="space-y-1.5 text-[#D9D1C3]">
                <li>• Free doorstep reverse pickup arranged from your address.</li>
                <li>• Garment must be unworn, unwashed, with all original brand tags intact.</li>
                <li>• Instant store credit or refund processed within 3 business days upon warehouse verification.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: Customer Reviews */}
        {activeTab === 'reviews' && (
          <div
            id="panel-reviews"
            role="tabpanel"
            aria-labelledby="tab-reviews"
            className="space-y-6 animate-fadeIn"
          >
            {/* Rating Overview */}
            <div className="p-5 rounded-xl bg-[#141414] border border-[#242321] flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-montserrat font-bold text-[#F4F0E8]">
                  {product.rating || 4.8}
                </div>
                <div>
                  <div className="flex items-center text-[#E5A93C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E5A93C] text-[#E5A93C]" />
                    ))}
                  </div>
                  <div className="text-xs text-[#716B63] mt-0.5">
                    Based on {product.reviewCount || 124} verified buyer reviews
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="w-full sm:w-64 space-y-1.5 text-xs text-[#716B63]">
                <div className="flex items-center gap-2">
                  <span>5★</span>
                  <div className="flex-1 h-1.5 bg-[#242321] rounded-full overflow-hidden">
                    <div className="w-[86%] h-full bg-[#C85A2E]" />
                  </div>
                  <span>86%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>4★</span>
                  <div className="flex-1 h-1.5 bg-[#242321] rounded-full overflow-hidden">
                    <div className="w-[11%] h-full bg-[#C85A2E]" />
                  </div>
                  <span>11%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>3★</span>
                  <div className="flex-1 h-1.5 bg-[#242321] rounded-full overflow-hidden">
                    <div className="w-[3%] h-full bg-[#C85A2E]" />
                  </div>
                  <span>3%</span>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-[#242321] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#E5A93C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#E5A93C] text-[#E5A93C]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#716B63]">2 days ago</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#F4F0E8]">Rahul M.</span>
                  <span className="text-[9px] bg-[#2A1810] text-[#C85A2E] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  "The 320 GSM weight is unreal. The drop-shoulder drape is exactly like luxury streetwear houses. Warm ivory color matches anything."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#242321] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#E5A93C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#E5A93C] text-[#E5A93C]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#716B63]">1 week ago</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#F4F0E8]">Ananya S.</span>
                  <span className="text-[9px] bg-[#2A1810] text-[#C85A2E] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  "Fit is wonderfully boxy. Fleece inside is super soft, and the hood actually holds its structure without sagging flat."
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-[#242321] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#E5A93C]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#E5A93C] text-[#E5A93C]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#716B63]">2 weeks ago</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#F4F0E8]">Kabir V.</span>
                  <span className="text-[9px] bg-[#2A1810] text-[#C85A2E] px-1.5 py-0.2 rounded font-medium flex items-center gap-0.5">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  "Best hoodie purchase this year. The chest logo and back print quality are pristine. Definitely grabbing the rust color next."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
