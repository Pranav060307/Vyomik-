import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { BagDrawer } from '../components/shop/BagDrawer';
import { SearchBar } from '../components/shop/SearchBar';
import { ProductBreadcrumbs } from '../components/pdp/ProductBreadcrumbs';
import { ProductGallery } from '../components/pdp/ProductGallery';
import { ProductPedestalView } from '../components/pdp/ProductPedestalView';
import { ProductPurchasePanel } from '../components/pdp/ProductPurchasePanel';
import { SizeChartModal } from '../components/pdp/SizeChartModal';
import { ProductLightbox } from '../components/pdp/ProductLightbox';
import { ProductInfoTabs } from '../components/pdp/ProductInfoTabs';
import { YouMayAlsoLike } from '../components/pdp/YouMayAlsoLike';
import { MobileStickyBar } from '../components/pdp/MobileStickyBar';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const {
    product,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    selectedImageIndex,
    setSelectedImageIndex,
    quantity,
    incrementQuantity,
    decrementQuantity,
  } = useProductDetail(slug);

  const { addItem, openBag } = useCart();
  const { toast } = useToast();

  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [showMobileSticky, setShowMobileSticky] = useState(false);

  const tabsRef = useRef<HTMLDivElement>(null);
  const purchasePanelRef = useRef<HTMLDivElement>(null);

  // Scroll to top on load or slug change
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
    } catch {
      // ignore
    }
  }, [slug]);

  // Monitor scroll for mobile sticky purchase bar
  useEffect(() => {
    const handleScroll = () => {
      if (purchasePanelRef.current) {
        const rect = purchasePanelRef.current.getBoundingClientRect();
        // If bottom of panel is above the top of viewport, show sticky bar
        setShowMobileSticky(rect.bottom < 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [
          product.primaryImage,
          product.hoverImage || product.primaryImage,
          '/images/vyomik/products/pdp/core-hoodie-ivory-detail.jpg',
          '/images/vyomik/products/pdp/core-hoodie-ivory-fabric.jpg',
          '/images/vyomik/products/pdp/core-hoodie-ivory-video.jpg',
        ];

  const activeImage = galleryImages[selectedImageIndex] || product.primaryImage;
  const isVideoActive = selectedImageIndex === 4;

  const handleScrollToReviews = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMobileAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedColor}-${selectedSize}`,
      productId: product.id,
      name: product.name,
      title: product.name,
      price: product.price,
      pricePaise: product.pricePaise || product.price * 100,
      type: product.category,
      color: selectedColor,
      size: selectedSize,
      img: product.primaryImage,
      image: product.primaryImage,
      quantity,
    });
    toast(`${product.name} (${selectedSize}) added to bag`);
    openBag();
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      {/* 1. Global Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Global Translucent Navbar (Shop link active with orange underline) */}
      <HomeNavbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {/* Breadcrumb Navigation */}
        <ProductBreadcrumbs
          category={product.category}
          categoryLabel={product.categoryLabel}
          productName={product.name}
        />

        {/* 3-Column Core Product Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mt-2 sm:mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Column 1: Vertical 5-Item Thumbnail Gallery (Desktop) */}
            <div className="order-2 lg:order-1 lg:col-span-1">
              <ProductGallery
                images={galleryImages}
                activeIndex={selectedImageIndex}
                onSelectImage={setSelectedImageIndex}
                productName={product.name}
              />
            </div>

            {/* Column 2: Main Showcase Image with Rock Pedestal & Glowing Base */}
            <div className="order-1 lg:order-2 lg:col-span-6">
              <ProductPedestalView
                activeImage={activeImage}
                productName={product.name}
                isVideo={isVideoActive}
                onOpenLightbox={() => setIsLightboxOpen(true)}
              />
            </div>

            {/* Column 3: Purchase Panel & Product Information */}
            <div
              ref={purchasePanelRef}
              className="order-3 lg:col-span-5 lg:pl-2"
            >
              <ProductPurchasePanel
                product={product}
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
                quantity={quantity}
                onIncrementQuantity={incrementQuantity}
                onDecrementQuantity={decrementQuantity}
                onOpenSizeChart={() => setIsSizeChartOpen(true)}
                onScrollToReviews={handleScrollToReviews}
              />
            </div>
          </div>
        </div>

        {/* 4. Product Information Tabs (Details, Fabric & Care, Shipping, Reviews) */}
        <ProductInfoTabs product={product} tabRef={tabsRef} />

        {/* 5. "YOU MAY ALSO LIKE" Section (5 Product Cards) */}
        <YouMayAlsoLike />
      </main>

      {/* Official Brand Footer */}
      <HomeFooter />

      {/* Global Interactive Overlays */}
      <BagDrawer />
      <SearchBar />

      {/* Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />

      {/* Fullscreen Product Image Lightbox */}
      <ProductLightbox
        isOpen={isLightboxOpen}
        images={galleryImages}
        currentIndex={selectedImageIndex}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={setSelectedImageIndex}
        productName={product.name}
      />

      {/* Mobile Sticky Add-to-Bag Bar */}
      <MobileStickyBar
        product={product}
        selectedSize={selectedSize}
        onAddToCart={handleMobileAddToCart}
        visible={showMobileSticky}
      />
    </div>
  );
};
