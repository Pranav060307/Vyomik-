import { useQuery } from '@tanstack/react-query';
import { DEMO_PRODUCTS, DemoProduct } from '../config/demoContent';
import { ProductItem } from '../components/shop/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export function getFallbackImage(category: string, type: string, logo: number | string): string {
  if (category.includes('hoodie') || type === 'hoodie') {
    return 'assets/essential-hoodie.png';
  }
  if (category.includes('wordmark') || logo === 1 || logo === '1') {
    return 'assets/vyomik-logo-tee.png';
  }
  return 'assets/oversized-basic-tee.png';
}

export function mapDemoProductToItem(dp: DemoProduct): ProductItem {
  const isHoodie = dp.category.includes('hoodie');
  const isWordmark = dp.category.includes('wordmark') || dp.name.toLowerCase().includes('wordmark');
  const type = isHoodie ? 'hoodie' : 'tee';
  const logo = isWordmark ? 1 : 0;
  const fallbackImg = getFallbackImage(dp.category, type, logo);

  // Clean name without color suffix for card display
  const cleanName = dp.name.replace(/—.*$/, '').replace(/-.*$/, '').trim();

  // Price in INR matching brand pricing strategy
  const salePrice = isHoodie ? 1799 : isWordmark ? 999 : 899;
  const oldPrice = isHoodie ? 2299 : isWordmark ? 1399 : 1199;

  // Swatches: provide the collection colors
  const swatches = isHoodie
    ? ['#a81818', '#111111', '#ffffff', '#3a2a1e']
    : isWordmark
    ? ['#111111', '#ffffff', '#e10600', '#3a2a1e']
    : ['#d9c3ad', '#111111', '#e10600', '#ffffff', '#3a2a1e'];

  let fabricFit = '';
  if (isHoodie) {
    fabricFit = 'Heavyweight Fabric \u00a0|\u00a0 Premium Fit';
  } else if (isWordmark) {
    fabricFit = 'Signature Print \u00a0|\u00a0 Oversized Fit';
  } else {
    fabricFit = 'Premium Cotton \u00a0|\u00a0 Relaxed Fit';
  }

  return {
    id: dp.slug || dp.id,
    name: cleanName,
    price: salePrice,
    oldPrice: oldPrice,
    category: isHoodie ? 'hoodies' : isWordmark ? 'wordmark' : 'plain',
    type: type,
    color: swatches[0],
    logo: logo,
    img: fallbackImg,
    fabricFit: fabricFit,
    swatches: swatches,
    hasMore: !isHoodie && !isWordmark,
  };
}

export function useProducts(category?: string) {
  return useQuery<ProductItem[]>({
    queryKey: ['products', category || 'all'],
    queryFn: async () => {
      try {
        const url = category && category !== 'all'
          ? `${API_BASE_URL}/api/v1/products?category=${encodeURIComponent(category)}`
          : `${API_BASE_URL}/api/v1/products`;

        const res = await fetch(url).catch(() => null);
        if (res && res.ok) {
          const data = await res.json().catch(() => null);
          if (Array.isArray(data) && data.length > 0) {
            return data.map((p: any) => {
              const cat = p.category || 'plain';
              const isHoodie = cat.includes('hoodie');
              const isWordmark = cat.includes('wordmark') || p.name?.toLowerCase().includes('wordmark');
              const type = isHoodie ? 'hoodie' : 'tee';
              const logo = isWordmark ? 1 : 0;
              const fallbackImg = getFallbackImage(cat, type, logo);
              const cleanName = p.name.replace(/—.*$/, '').replace(/-.*$/, '').trim();
              const salePrice = isHoodie ? 1799 : isWordmark ? 999 : 899;
              const oldPrice = isHoodie ? 2299 : isWordmark ? 1399 : 1199;

              const swatches = isHoodie
                ? ['#a81818', '#111111', '#ffffff', '#3a2a1e']
                : isWordmark
                ? ['#111111', '#ffffff', '#e10600', '#3a2a1e']
                : ['#d9c3ad', '#111111', '#e10600', '#ffffff', '#3a2a1e'];

              return {
                id: p.slug || String(p.id),
                name: cleanName,
                price: salePrice,
                oldPrice: oldPrice,
                category: isHoodie ? 'hoodies' : isWordmark ? 'wordmark' : 'plain',
                type: type,
                color: swatches[0],
                logo: logo,
                img: p.images?.[0]?.url || fallbackImg,
                fabricFit: isHoodie
                  ? 'Heavyweight Fabric \u00a0|\u00a0 Premium Fit'
                  : isWordmark
                  ? 'Signature Print \u00a0|\u00a0 Oversized Fit'
                  : 'Premium Cotton \u00a0|\u00a0 Relaxed Fit',
                swatches: swatches,
                hasMore: !isHoodie && !isWordmark,
              };
            });
          }
        }
      } catch {
        // Fall back to DEMO_PRODUCTS
      }

      // Filter and map DEMO_PRODUCTS
      let pool = DEMO_PRODUCTS;
      if (category && category !== 'all') {
        const catSlug = category.replace('-tees', '');
        pool = DEMO_PRODUCTS.filter((dp) => dp.category.includes(catSlug));
      }
      return pool.map(mapDemoProductToItem);
    },
    placeholderData: () => {
      let pool = DEMO_PRODUCTS;
      if (category && category !== 'all') {
        const catSlug = category.replace('-tees', '');
        pool = DEMO_PRODUCTS.filter((dp) => dp.category.includes(catSlug));
      }
      return pool.map(mapDemoProductToItem);
    },
  });
}
