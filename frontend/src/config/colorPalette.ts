/**
 * VYOMIK 19-Color Fabric Palette & Color Chart Registry
 * Extracted directly from brand palette specification:
 * Row 1: 7 Colors (White, Black, Navy, Grey, Bottle Green, Deep Royal, Crimson)
 * Row 2: 7 Colors (Dark Burgundy, Deep Plum, Marigold, Dark Petrol, Military Olive, Mustard Ochre, Blush Pink)
 * Row 3: 5 Colors (Soft Lavender, Terracotta, Mint Aqua, Sky Blue, Warm Cream)
 */

export interface SwatchColor {
  id: string;
  name: string;
  hex: string;
  row: 1 | 2 | 3;
  isLight?: boolean;
}

export const VYOMIK_COLOR_PALETTE: SwatchColor[] = [
  // ROW 1 (7 colors)
  { id: 'pure-white', name: 'Crisp White', hex: '#FFFFFF', row: 1, isLight: true },
  { id: 'pitch-black', name: 'Pitch Black', hex: '#151515', row: 1 },
  { id: 'midnight-navy', name: 'Midnight Navy', hex: '#000B17', row: 1 },
  { id: 'heather-grey', name: 'Heather Grey', hex: '#C3C3C3', row: 1, isLight: true },
  { id: 'bottle-green', name: 'Bottle Green', hex: '#003813', row: 1 },
  { id: 'deep-royal', name: 'Deep Royal Blue', hex: '#121B52', row: 1 },
  { id: 'crimson-red', name: 'Crimson Red', hex: '#9E0000', row: 1 },

  // ROW 2 (7 colors)
  { id: 'dark-burgundy', name: 'Dark Burgundy', hex: '#2E0005', row: 2 },
  { id: 'deep-plum', name: 'Deep Plum', hex: '#2A0E36', row: 2 },
  { id: 'marigold-amber', name: 'Marigold Amber', hex: '#FF9C00', row: 2 },
  { id: 'dark-petrol', name: 'Dark Petrol Teal', hex: '#002B31', row: 2 },
  { id: 'military-olive', name: 'Military Olive', hex: '#262604', row: 2 },
  { id: 'mustard-ochre', name: 'Mustard Ochre', hex: '#BE8200', row: 2 },
  { id: 'blush-pink', name: 'Blush Pink', hex: '#FFD2E9', row: 2, isLight: true },

  // ROW 3 (5 colors)
  { id: 'soft-lavender', name: 'Soft Lavender', hex: '#E4D1FF', row: 3, isLight: true },
  { id: 'terracotta-rust', name: 'Terracotta Rust', hex: '#C13E43', row: 3 },
  { id: 'mint-aqua', name: 'Mint Aqua', hex: '#93FFEF', row: 3, isLight: true },
  { id: 'sky-blue', name: 'Pastel Sky Blue', hex: '#97ECFF', row: 3, isLight: true },
  { id: 'warm-cream', name: 'Warm Cream', hex: '#FFF9E6', row: 3, isLight: true },
];

export const COLOR_CHART_IMAGE_URL = '/color-chart.png';
