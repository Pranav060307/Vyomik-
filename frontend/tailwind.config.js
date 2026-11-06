/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e10600',
          redDark: '#a30000',
          redDeep: '#8e0f14',
          black: '#050505',
          dark: '#0b0b0b',
          panel: '#14100d',
          gray: '#d8d2cc',
        },
        ivory: {
          DEFAULT: '#F4F3EE',
          50: '#FFFFFF',
          100: '#FAF9F6',
          200: '#F4F3EE',
          300: '#EBE9E1',
        },
        charcoal: {
          DEFAULT: '#202020',
          light: '#2E2E2E',
          muted: '#5A5A5A',
        },
        olive: {
          DEFAULT: '#5C6548',
          hover: '#4C533B',
          light: '#727D5B',
          tint: '#F0F2EB',
        },
        stone: {
          DEFAULT: '#DAD7CE',
          light: '#E6E4DE',
          dark: '#B8B4A8',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        anton: ['Anton', 'Impact', 'Barlow Condensed', 'sans-serif'],
        condensed: ['Barlow Condensed', 'Anton', 'sans-serif'],
      },
      letterSpacing: {
        wordmark: '0.5em',
        eyebrow: '0.42em',
      },
    },
  },
  plugins: [],
}
