/**
 * ==============================================================================
 * VYOMIK E-COMMERCE DEMO CONTENT REGISTRY
 * ==============================================================================
 * FLAG: DEMO_CONTENT = true
 * NOTE: The design team is finalizing campaign photography and product designs.
 * ALL demo/placeholder media and initial catalog seeds are routed strictly
 * through this single configuration module.
 * 
 * TO REPLACE FOR PRODUCTION LAUNCH:
 * 1. Drop final high-resolution assets into /assets/brand/ or CDN
 * 2. Update the image URLs / imports in this file
 * 3. Set DEMO_CONTENT = false
 * ==============================================================================
 */

import heroIvory from '../assets/demo/hero-ivory.svg';
import heroBlack from '../assets/demo/hero-black.svg';
import categoryPlainTees from '../assets/demo/category-plain-tees.svg';
import categoryWordmarkTees from '../assets/demo/category-wordmark-tees.svg';
import categoryHoodies from '../assets/demo/category-hoodies.svg';
import productPlainTeeIvory from '../assets/demo/product-plain-tee-ivory.svg';
import productPlainTeeBlack from '../assets/demo/product-plain-tee-black.svg';
import productPlainTeeOlive from '../assets/demo/product-plain-tee-olive.svg';
import productWordmarkIvory from '../assets/demo/product-wordmark-ivory.svg';
import productWordmarkBlack from '../assets/demo/product-wordmark-black.svg';
import productHoodieStone from '../assets/demo/product-hoodie-stone.svg';
import productHoodieOlive from '../assets/demo/product-hoodie-olive.svg';
import productHoodieBlack from '../assets/demo/product-hoodie-black.svg';
import ourStoryImage from '../assets/demo/our-story.svg';
import { instagramHandle } from './brand';

export const DEMO_CONTENT = true;

export interface DemoImageRegistry {
  hero: {
    ivory: string;
    black: string;
  };
  categories: {
    plainTees: string;
    wordmarkTees: string;
    hoodies: string;
  };
  products: Record<string, string>;
  story: string;
}

export const DEMO_IMAGES: DemoImageRegistry = {
  hero: {
    ivory: heroIvory,
    black: heroBlack,
  },
  categories: {
    plainTees: categoryPlainTees,
    wordmarkTees: categoryWordmarkTees,
    hoodies: categoryHoodies,
  },
  products: {
    'plain-tee-ivory': productPlainTeeIvory,
    'plain-tee-black': productPlainTeeBlack,
    'plain-tee-olive': productPlainTeeOlive,
    'wordmark-tee-ivory': productWordmarkIvory,
    'wordmark-tee-black': productWordmarkBlack,
    'hoodie-stone': productHoodieStone,
    'hoodie-olive': productHoodieOlive,
    'hoodie-black': productHoodieBlack,
  },
  story: ourStoryImage,
};

export interface DemoProductVariant {
  id: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  colorHex: string;
  pricePaise: number;
  inStock: boolean;
  qikinkSkuMock: string;
}

export interface DemoProduct {
  id: string;
  slug: string;
  name: string;
  category: 'plain-tees' | 'wordmark-tees' | 'hoodies' | 'sweatshirts' | 'oversized-tees';
  categoryLabel: string;
  headline: string;
  description: string;
  fabricSpecs: string;
  basePricePaise: number;
  defaultColor: string;
  images: Record<string, string>;
  availableColors: Array<{ name: string; hex: string; key: string }>;
  availableSizes: Array<'S' | 'M' | 'L' | 'XL' | 'XXL'>;
  variants: DemoProductVariant[];
  isDemo: boolean;
}

// 8 Carefully Structured Demo Products with Integer Paise Pricing
export const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'prod-001',
    slug: 'essential-oversized-tee-ivory',
    name: 'Essential Oversized Plain Tee',
    category: 'plain-tees',
    categoryLabel: 'Plain Tees',
    headline: 'Clean architecture in combed 240 GSM cotton.',
    description: 'Designed with a dropped shoulder, dense ribbed neckband, and a roomy silhouette that drapes without sagging. A foundation piece for everyday presence.',
    fabricSpecs: '240 GSM 100% Combed Cotton · Bio-Washed · Pre-Shrunk',
    basePricePaise: 119900, // Rs. 1,199.00
    defaultColor: 'Ivory',
    availableColors: [
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Washed Olive', hex: '#5C6548', key: 'olive' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: {
      ivory: DEMO_IMAGES.products['plain-tee-ivory'],
      black: DEMO_IMAGES.products['plain-tee-black'],
      olive: DEMO_IMAGES.products['plain-tee-olive'],
    },
    variants: [
      { id: 'v-001', size: 'S', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-IVO-S' },
      { id: 'v-002', size: 'M', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-IVO-M' },
      { id: 'v-003', size: 'L', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-IVO-L' },
      { id: 'v-004', size: 'XL', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-IVO-XL' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-002',
    slug: 'essential-oversized-tee-black',
    name: 'Essential Oversized Tee — Pitch Black',
    category: 'plain-tees',
    categoryLabel: 'Plain Tees',
    headline: 'Deep charcoal black with zero sheen.',
    description: 'Our signature oversized fit dyed in deep pitch black. Retains structure and saturation wash after wash.',
    fabricSpecs: '240 GSM 100% Combed Cotton · Reactive Dyed',
    basePricePaise: 119900,
    defaultColor: 'Pitch Black',
    availableColors: [
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: {
      black: DEMO_IMAGES.products['plain-tee-black'],
      ivory: DEMO_IMAGES.products['plain-tee-ivory'],
    },
    variants: [
      { id: 'v-005', size: 'S', color: 'Pitch Black', colorHex: '#202020', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-BLK-S' },
      { id: 'v-006', size: 'M', color: 'Pitch Black', colorHex: '#202020', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-BLK-M' },
      { id: 'v-007', size: 'L', color: 'Pitch Black', colorHex: '#202020', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-BLK-L' },
      { id: 'v-008', size: 'XL', color: 'Pitch Black', colorHex: '#202020', pricePaise: 119900, inStock: true, qikinkSkuMock: 'VY-PL-BLK-XL' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-003',
    slug: 'essential-oversized-tee-olive',
    name: 'Essential Oversized Tee — Washed Olive',
    category: 'plain-tees',
    categoryLabel: 'Plain Tees',
    headline: 'Earthy muted olive tailored for warm minimal styling.',
    description: 'A custom olive pigment wash designed to pair effortlessly with ecru denim or charcoal trousers.',
    fabricSpecs: '240 GSM Combed Cotton · Garment Pigment Dye',
    basePricePaise: 124900,
    defaultColor: 'Washed Olive',
    availableColors: [
      { name: 'Washed Olive', hex: '#5C6548', key: 'olive' },
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: {
      olive: DEMO_IMAGES.products['plain-tee-olive'],
      ivory: DEMO_IMAGES.products['plain-tee-ivory'],
    },
    variants: [
      { id: 'v-009', size: 'M', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 124900, inStock: true, qikinkSkuMock: 'VY-PL-OLV-M' },
      { id: 'v-010', size: 'L', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 124900, inStock: true, qikinkSkuMock: 'VY-PL-OLV-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-004',
    slug: 'vyomik-wordmark-tee-ivory',
    name: 'VYOMIK Signature Wordmark Tee — Ivory',
    category: 'wordmark-tees',
    categoryLabel: 'Wordmark Tees',
    headline: 'Tracked typography positioned with architectural balance.',
    description: 'High-density matte plastisol print of the VYOMIK wordmark across the chest. Quiet branding for discerning wardrobes.',
    fabricSpecs: '240 GSM Combed Cotton · High Density Matte Screenprint',
    basePricePaise: 139900,
    defaultColor: 'Warm Ivory',
    availableColors: [
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: {
      ivory: DEMO_IMAGES.products['wordmark-tee-ivory'],
      black: DEMO_IMAGES.products['wordmark-tee-black'],
    },
    variants: [
      { id: 'v-011', size: 'S', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-IVO-S' },
      { id: 'v-012', size: 'M', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-IVO-M' },
      { id: 'v-013', size: 'L', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-IVO-L' },
      { id: 'v-014', size: 'XL', color: 'Ivory', colorHex: '#F4F3EE', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-IVO-XL' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-005',
    slug: 'vyomik-wordmark-tee-black',
    name: 'VYOMIK Signature Wordmark Tee — Black',
    category: 'wordmark-tees',
    categoryLabel: 'Wordmark Tees',
    headline: 'Tonal black-on-black typographic essential.',
    description: 'Charcoal base fabric contrasted with warm ivory micro-tracked wordmark.',
    fabricSpecs: '240 GSM Combed Cotton · Soft-Hand Discharge Screenprint',
    basePricePaise: 139900,
    defaultColor: 'Pitch Black',
    availableColors: [
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: {
      black: DEMO_IMAGES.products['wordmark-tee-black'],
      ivory: DEMO_IMAGES.products['wordmark-tee-ivory'],
    },
    variants: [
      { id: 'v-015', size: 'S', color: 'Pitch Black', colorHex: '#202020', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-BLK-S' },
      { id: 'v-016', size: 'M', color: 'Pitch Black', colorHex: '#202020', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-BLK-M' },
      { id: 'v-017', size: 'L', color: 'Pitch Black', colorHex: '#202020', pricePaise: 139900, inStock: true, qikinkSkuMock: 'VY-WM-BLK-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-006',
    slug: 'heavyweight-hoodie-stone',
    name: 'Heavyweight Relaxed Hoodie — Raw Stone',
    category: 'hoodies',
    categoryLabel: 'Oversized Hoodies',
    headline: '450 GSM French Terry with double-layered hood.',
    description: 'Constructed from loopback French terry with heavy ribbed hem and cuff bindings. No drawstrings for a pure, distraction-free neckline.',
    fabricSpecs: '450 GSM 100% Cotton French Terry · Double-Layered Hood',
    basePricePaise: 279900, // Rs. 2,799.00
    defaultColor: 'Raw Stone',
    availableColors: [
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
      { name: 'Washed Olive', hex: '#5C6548', key: 'olive' },
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: {
      stone: DEMO_IMAGES.products['hoodie-stone'],
      olive: DEMO_IMAGES.products['hoodie-olive'],
      black: DEMO_IMAGES.products['hoodie-black'],
    },
    variants: [
      { id: 'v-018', size: 'S', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-STN-S' },
      { id: 'v-019', size: 'M', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-STN-M' },
      { id: 'v-020', size: 'L', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-STN-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-007',
    slug: 'heavyweight-hoodie-olive',
    name: 'Heavyweight Relaxed Hoodie — Washed Olive',
    category: 'hoodies',
    categoryLabel: 'Oversized Hoodies',
    headline: 'The headline outerwear piece of First Drop.',
    description: 'Rich olive French terry with substantial weight and drape. Kangaroo pouch pocket reinforced with bartacks.',
    fabricSpecs: '450 GSM French Terry · Garment Washed',
    basePricePaise: 279900,
    defaultColor: 'Washed Olive',
    availableColors: [
      { name: 'Washed Olive', hex: '#5C6548', key: 'olive' },
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
    ],
    availableSizes: ['M', 'L', 'XL'],
    images: {
      olive: DEMO_IMAGES.products['hoodie-olive'],
      stone: DEMO_IMAGES.products['hoodie-stone'],
    },
    variants: [
      { id: 'v-021', size: 'M', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-OLV-M' },
      { id: 'v-022', size: 'L', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-OLV-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-008',
    slug: 'heavyweight-hoodie-black',
    name: 'Heavyweight Relaxed Hoodie — Pitch Black',
    category: 'hoodies',
    categoryLabel: 'Oversized Hoodies',
    headline: 'Timeless dense black silhouette for cooler weather.',
    description: 'Maximum warmth, clean dropped-shoulder drape, engineered without cords for a modern, uncluttered look.',
    fabricSpecs: '450 GSM French Terry · Deep Black Dye',
    basePricePaise: 279900,
    defaultColor: 'Pitch Black',
    availableColors: [
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: {
      black: DEMO_IMAGES.products['hoodie-black'],
      stone: DEMO_IMAGES.products['hoodie-stone'],
    },
    variants: [
      { id: 'v-023', size: 'S', color: 'Pitch Black', colorHex: '#202020', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-BLK-S' },
      { id: 'v-024', size: 'M', color: 'Pitch Black', colorHex: '#202020', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-BLK-M' },
      { id: 'v-025', size: 'L', color: 'Pitch Black', colorHex: '#202020', pricePaise: 279900, inStock: true, qikinkSkuMock: 'VY-HD-BLK-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-009',
    slug: 'heavyweight-boxy-zip-hoodie-black',
    name: 'Heavyweight Boxy Zip Hoodie — Vintage Black',
    category: 'hoodies',
    categoryLabel: 'Hoodies',
    headline: 'Double-slide YKK zipper with custom boxy silhouette.',
    description: 'Constructed from 450 GSM diagonal-loop French Terry. Featuring dropped shoulders, double-layered hood, and deep set-in hand pockets.',
    fabricSpecs: '450 GSM French Terry · YKK Two-Way Metal Zipper',
    basePricePaise: 299900, // Rs. 2,999.00
    defaultColor: 'Pitch Black',
    availableColors: [
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: {
      black: DEMO_IMAGES.products['hoodie-black'],
      stone: DEMO_IMAGES.products['hoodie-stone'],
    },
    variants: [
      { id: 'v-026', size: 'S', color: 'Pitch Black', colorHex: '#202020', pricePaise: 299900, inStock: true, qikinkSkuMock: 'VY-HD-ZIP-S' },
      { id: 'v-027', size: 'M', color: 'Pitch Black', colorHex: '#202020', pricePaise: 299900, inStock: true, qikinkSkuMock: 'VY-HD-ZIP-M' },
      { id: 'v-028', size: 'L', color: 'Pitch Black', colorHex: '#202020', pricePaise: 299900, inStock: true, qikinkSkuMock: 'VY-HD-ZIP-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-010',
    slug: 'architectural-crewneck-sweatshirt-stone',
    name: 'Architectural Crewneck Sweatshirt — Raw Stone',
    category: 'sweatshirts',
    categoryLabel: 'Sweatshirts',
    headline: 'Sculpted boxy fit in 400 GSM heavyweight French fleece.',
    description: 'A clean, collarbone-grazing crewneck neckline with ribbed side panels for structural retention and all-day comfort.',
    fabricSpecs: '400 GSM 100% Combed Cotton Fleece · Ribbed Side Gussets',
    basePricePaise: 249900, // Rs. 2,499.00
    defaultColor: 'Raw Stone',
    availableColors: [
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Washed Olive', hex: '#5C6548', key: 'olive' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: {
      stone: DEMO_IMAGES.products['hoodie-stone'],
      black: DEMO_IMAGES.products['hoodie-black'],
      olive: DEMO_IMAGES.products['hoodie-olive'],
    },
    variants: [
      { id: 'v-029', size: 'S', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-STN-S' },
      { id: 'v-030', size: 'M', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-STN-M' },
      { id: 'v-031', size: 'L', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-STN-L' },
      { id: 'v-032', size: 'XL', color: 'Raw Stone', colorHex: '#DAD7CE', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-STN-XL' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-011',
    slug: 'relaxed-minimalist-sweatshirt-olive',
    name: 'Relaxed Minimalist Sweatshirt — Washed Olive',
    category: 'sweatshirts',
    categoryLabel: 'Sweatshirts',
    headline: 'Earthy tone pigment dye with dropped shoulder seams.',
    description: 'Designed for effortless layering over our oversized tees. Finished with heavy 2x2 ribbing on collar, cuffs, and hem.',
    fabricSpecs: '400 GSM French Terry · Garment Washed · Pre-Shrunk',
    basePricePaise: 249900, // Rs. 2,499.00
    defaultColor: 'Washed Olive',
    availableColors: [
      { name: 'Washed Olive', hex: '#5C6548', key: 'olive' },
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: {
      olive: DEMO_IMAGES.products['hoodie-olive'],
      stone: DEMO_IMAGES.products['hoodie-stone'],
    },
    variants: [
      { id: 'v-033', size: 'S', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-OLV-S' },
      { id: 'v-034', size: 'M', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-OLV-M' },
      { id: 'v-035', size: 'L', color: 'Washed Olive', colorHex: '#5C6548', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-OLV-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-012',
    slug: 'core-boxy-sweatshirt-black',
    name: 'Core Boxy Sweatshirt — Pitch Black',
    category: 'sweatshirts',
    categoryLabel: 'Sweatshirts',
    headline: 'Deep monochromatic black essentials for everyday comfort.',
    description: 'The definitive daily crewneck sweatshirt. Resists pilling and keeps its sharp boxy shape through endless wears.',
    fabricSpecs: '400 GSM Heavyweight Fleece · Anti-Pilling Cotton Blend',
    basePricePaise: 249900, // Rs. 2,499.00
    defaultColor: 'Pitch Black',
    availableColors: [
      { name: 'Pitch Black', hex: '#202020', key: 'black' },
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: {
      black: DEMO_IMAGES.products['hoodie-black'],
      ivory: DEMO_IMAGES.products['plain-tee-ivory'],
    },
    variants: [
      { id: 'v-036', size: 'S', color: 'Pitch Black', colorHex: '#202020', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-BLK-S' },
      { id: 'v-037', size: 'M', color: 'Pitch Black', colorHex: '#202020', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-BLK-M' },
      { id: 'v-038', size: 'L', color: 'Pitch Black', colorHex: '#202020', pricePaise: 249900, inStock: true, qikinkSkuMock: 'VY-SW-BLK-L' },
    ],
    isDemo: true,
  },
  {
    id: 'prod-013',
    slug: 'heavyweight-raglan-sweatshirt-ivory',
    name: 'Heavyweight Raglan Sweatshirt — Warm Ivory',
    category: 'sweatshirts',
    categoryLabel: 'Sweatshirts',
    headline: 'Diagonal raglan sleeve cut for fluid arm mobility.',
    description: 'An architectural silhouette in organic ecru warm ivory. Subtle tonal flatlock stitching along raglan seams.',
    fabricSpecs: '400 GSM Unbleached Organic Cotton · Flatlock Seam Construction',
    basePricePaise: 239900, // Rs. 2,399.00
    defaultColor: 'Warm Ivory',
    availableColors: [
      { name: 'Warm Ivory', hex: '#F4F3EE', key: 'ivory' },
      { name: 'Raw Stone', hex: '#DAD7CE', key: 'stone' },
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    images: {
      ivory: DEMO_IMAGES.products['plain-tee-ivory'],
      stone: DEMO_IMAGES.products['hoodie-stone'],
    },
    variants: [
      { id: 'v-039', size: 'S', color: 'Warm Ivory', colorHex: '#F4F3EE', pricePaise: 239900, inStock: true, qikinkSkuMock: 'VY-SW-IVO-S' },
      { id: 'v-040', size: 'M', color: 'Warm Ivory', colorHex: '#F4F3EE', pricePaise: 239900, inStock: true, qikinkSkuMock: 'VY-SW-IVO-M' },
      { id: 'v-041', size: 'L', color: 'Warm Ivory', colorHex: '#F4F3EE', pricePaise: 239900, inStock: true, qikinkSkuMock: 'VY-SW-IVO-L' },
    ],
    isDemo: true,
  },
];

// Category metadata for landing page and collections
export interface DemoCategoryInfo {
  id: 'plain-tees' | 'wordmark-tees' | 'hoodies';
  title: string;
  tagline: string;
  image: string;
  isHighlighted?: boolean;
  comingSoonMessage: string;
}

export const DEMO_CATEGORIES: DemoCategoryInfo[] = [
  {
    id: 'plain-tees',
    title: 'Plain tees',
    tagline: 'Pure silhouettes. Zero logos. Combed 240 GSM cotton.',
    image: DEMO_IMAGES.categories.plainTees,
    comingSoonMessage: `Plain oversized tees. Coming soon. Follow ${instagramHandle} for the first drop.`,
  },
  {
    id: 'wordmark-tees',
    title: 'Wordmark tees',
    tagline: 'Subtle typographic identity. Architectural proportions.',
    image: DEMO_IMAGES.categories.wordmarkTees,
    comingSoonMessage: `Wordmark tees. Coming soon. Follow ${instagramHandle} for the first drop.`,
  },
  {
    id: 'hoodies',
    title: 'Hoodies',
    tagline: '450 GSM French Terry. Distraction-free hood construction.',
    image: DEMO_IMAGES.categories.hoodies,
    isHighlighted: true, // Olive-highlighted card as required by screenshot
    comingSoonMessage: `Oversized hoodies. Coming soon. Follow ${instagramHandle} for the first drop.`,
  },
];

