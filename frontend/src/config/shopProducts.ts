export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  category: 'hoodies' | 't-shirts' | 'cargos' | 'jackets' | 'accessories';
  categoryLabel: string;
  price: number; // in INR rupees
  oldPrice?: number;
  pricePaise: number;
  isNew?: boolean;
  isSale?: boolean;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  color: string;
  colorName: string;
  swatches: Array<{ name: string; hex: string; img?: string }>;
  availableSizes: Array<'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL'>;
  primaryImage: string;
  hoverImage?: string;
  gallery?: string[];
  features?: string[];
  description: string;
  fabricSpecs: string;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'vy-prod-01',
    slug: 'core-hoodie-ivory',
    name: 'Core Hoodie – Ivory',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 2499,
    oldPrice: 2999,
    pricePaise: 249900,
    isNew: true,
    badge: 'New Launch',
    rating: 4.8,
    reviewCount: 124,
    color: '#F4F0E8',
    colorName: 'Ivory',
    swatches: [
      { name: 'Ivory', hex: '#F4F0E8' },
      { name: 'Charcoal', hex: '#242321' },
      { name: 'Burnt Rust', hex: '#A64B2A' },
      { name: 'Washed Olive', hex: '#4E5340' },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    primaryImage: '/images/vyomik/products/pdp/core-hoodie-ivory-front.jpg',
    hoverImage: '/images/vyomik/products/pdp/core-hoodie-ivory-back.jpg',
    gallery: [
      '/images/vyomik/products/pdp/core-hoodie-ivory-front.jpg',
      '/images/vyomik/products/pdp/core-hoodie-ivory-back.jpg',
      '/images/vyomik/products/pdp/core-hoodie-ivory-detail.jpg',
      '/images/vyomik/products/pdp/core-hoodie-ivory-fabric.jpg',
      '/images/vyomik/products/pdp/core-hoodie-ivory-video.jpg',
    ],
    features: [
      'Premium cotton blend (320 GSM)',
      'Relaxed unisex fit',
      'Ribbed cuffs and hem',
      'VYOMIK signature logo detail',
      'Everyday wear – all seasons',
    ],
    description: 'The signature VYOMIK hoodie. Minimal, bold, and built for everyday movement.',
    fabricSpecs: '320 GSM Premium Cotton Blend · Double-Layered Hood · Unisex Fit',
  },
  {
    id: 'vy-prod-02',
    slug: 'element-tee-black',
    name: 'Element Tee – Black',
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    price: 1299,
    pricePaise: 129900,
    isNew: true,
    badge: 'NEW',
    rating: 4.8,
    reviewCount: 52,
    color: '#141414',
    colorName: 'Pitch Black',
    swatches: [
      { name: 'Pitch Black', hex: '#141414' },
      { name: 'Charcoal', hex: '#242321' },
      { name: 'Burnt Rust', hex: '#A64B2A' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    primaryImage: '/images/vyomik/products/element-tee-black.webp',
    hoverImage: '/images/vyomik/collections/monochrome-edit.webp',
    description: 'Heavyweight boxy streetwear tee with mountain line graphic print on the back. Reactive black dye maintains deep saturation.',
    fabricSpecs: '240 GSM Combed Cotton · Back Graphic Print · Anti-Pilling',
  },
  {
    id: 'vy-prod-03',
    slug: 'terrain-cargos-charcoal',
    name: 'Terrain Cargos – Charcoal',
    category: 'cargos',
    categoryLabel: 'Cargos',
    price: 2299,
    pricePaise: 229900,
    isNew: true,
    badge: 'NEW',
    rating: 5.0,
    reviewCount: 29,
    color: '#242321',
    colorName: 'Charcoal',
    swatches: [
      { name: 'Charcoal', hex: '#242321' },
      { name: 'Pitch Black', hex: '#141414' },
      { name: 'Sand Beige', hex: '#D9D1C3' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    primaryImage: '/images/vyomik/products/terrain-cargos-charcoal.webp',
    hoverImage: '/images/vyomik/collections/urban-terrain.webp',
    description: 'Tactical cargo trousers with 3D bellows utility pocket, articulated knee seams, and adjustable cuff drawcord.',
    fabricSpecs: '320 GSM Ripstop Cotton · Matte Hardware · Reinforced Seams',
  },
  {
    id: 'vy-prod-04',
    slug: 'core-hoodie-rust',
    name: 'Core Hoodie – Rust',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 2499,
    pricePaise: 249900,
    rating: 4.9,
    reviewCount: 44,
    color: '#A64B2A',
    colorName: 'Burnt Rust',
    swatches: [
      { name: 'Burnt Rust', hex: '#A64B2A' },
      { name: 'Charcoal', hex: '#242321' },
      { name: 'Sand Beige', hex: '#D9D1C3' },
    ],
    availableSizes: ['M', 'L', 'XL', 'XXL'],
    primaryImage: '/images/vyomik/products/core-hoodie-rust.png',
    hoverImage: '/images/vyomik/products/core-hoodie-ivory.jpg',
    description: 'Our signature oversized hoodie dyed in rich burnt rust with back VYOMIK angular logo print. Kangaroo pocket with reinforced bartacks.',
    fabricSpecs: '450 GSM Cotton French Terry · Custom Pigment Dye',
  },
  {
    id: 'vy-prod-05',
    slug: 'apex-jacket-black',
    name: 'Apex Jacket – Black',
    category: 'jackets',
    categoryLabel: 'Jackets',
    price: 3499,
    pricePaise: 349900,
    rating: 4.9,
    reviewCount: 19,
    color: '#141414',
    colorName: 'Pitch Black',
    swatches: [
      { name: 'Pitch Black', hex: '#141414' },
      { name: 'Charcoal', hex: '#242321' },
      { name: 'Burnt Rust', hex: '#A64B2A' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    primaryImage: '/images/vyomik/products/apex-jacket-black.png',
    hoverImage: '/images/vyomik/products/element-hoodie-black.webp',
    description: 'Minimalist architectural track jacket crafted from matte waterproof technical nylon with custom metal hardware.',
    fabricSpecs: 'Water-Repellent Technical Nylon · Satin Lined · YKK Hardware',
  },
  {
    id: 'vy-prod-06',
    slug: 'essential-tee-ivory',
    name: 'Essential Tee – Ivory',
    category: 't-shirts',
    categoryLabel: 'T-Shirts',
    price: 1199,
    pricePaise: 119900,
    rating: 4.7,
    reviewCount: 63,
    color: '#F4F0E8',
    colorName: 'Warm Ivory',
    swatches: [
      { name: 'Warm Ivory', hex: '#F4F0E8' },
      { name: 'Charcoal', hex: '#242321' },
      { name: 'Burnt Rust', hex: '#A64B2A' },
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    primaryImage: '/images/vyomik/products/essential-tee-ivory.webp',
    hoverImage: '/images/vyomik/new-arrivals/tshirts.webp',
    description: 'Foundational relaxed boxy tee in 240 GSM combed cotton with minimal angular chest branding.',
    fabricSpecs: '240 GSM 100% Combed Cotton · Bio-Washed · Pre-Shrunk',
  },
  {
    id: 'vy-prod-07',
    slug: 'vyomik-cap-sand',
    name: 'VYOMIK Cap – Sand',
    category: 'accessories',
    categoryLabel: 'Accessories',
    price: 899,
    pricePaise: 89900,
    rating: 4.8,
    reviewCount: 31,
    color: '#D9D1C3',
    colorName: 'Sand Beige',
    swatches: [
      { name: 'Sand Beige', hex: '#D9D1C3' },
      { name: 'Pitch Black', hex: '#141414' },
    ],
    availableSizes: ['M', 'L'],
    primaryImage: '/images/vyomik/products/vyomik-cap-sand.webp',
    hoverImage: '/images/vyomik/new-arrivals/accessories.webp',
    description: 'Structured 6-panel cotton twill cap featuring tonal embroidered VYOMIK angular emblem and brass buckle strapback.',
    fabricSpecs: '100% Cotton Twill · Antique Brass Hardware · Curved Brim',
  },
  {
    id: 'vy-prod-08',
    slug: 'element-hoodie-black',
    name: 'Element Hoodie – Black',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    price: 2699,
    pricePaise: 269900,
    rating: 5.0,
    reviewCount: 47,
    color: '#141414',
    colorName: 'Pitch Black',
    swatches: [
      { name: 'Pitch Black', hex: '#141414' },
      { name: 'Warm Ivory', hex: '#F4F0E8' },
      { name: 'Burnt Rust', hex: '#A64B2A' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    primaryImage: '/images/vyomik/products/element-hoodie-black.webp',
    hoverImage: '/images/vyomik/new-arrivals/hoodies.webp',
    description: 'Pitch black heavyweight hoodie featuring graphic mountain line art and rust-orange circle on the back. Dropped shoulder streetwear drape.',
    fabricSpecs: '450 GSM Heavyweight Loopback Terry · Back Artwork Print',
  },
];
