# VYOMIK — HOMEPAGE DESIGN & IMPLEMENTATION PLAN
## Premium Streetwear Ecommerce Website

> **Status:** PLANNING PHASE ONLY — Awaiting User Approval Prior to Implementation  
> **Target Page:** Main Ecommerce Homepage (`/home` and root `/` when gate is inactive)  
> **Design Specification:** Supplied Full-Page Visual Blueprint (`media_1795098610887_88d7b86d.jpg`)  
> **Brand Color System:** Midnight Black (`#0B0B0B`), Charcoal (`#242321`), Warm Ivory (`#F4F0E8`), Sand Beige (`#D9D1C3`), Burnt Rust (`#A64B2A`), Warm Grey (`#716B63`)

---

## 1. Existing Project Architecture & Inspection Findings

### A. Framework, Routing & Core Setup
- **Core Framework:** React 18.2 with TypeScript 5.4, Vite 5.1.
- **Routing Engine (`react-router-dom` v6.22):**
  - Current Root Gate Route (`frontend/src/App.tsx`): Evaluates `useLaunchGate()`. If `isGateActive` is `true`, renders `ComingSoon`; otherwise renders `LandingPage`.
  - `/home` directly mounts `LandingPage`.
  - Dedicated routes exist for `/collections`, `/new-arrivals`, `/bag`, `/cart`, `/sign-in`, `/sign-up`, `/our-story`, `/contact`, `/shipping-returns`, `/privacy-policy`, `/terms-of-service`.
- **Styling Architecture:** Tailwind CSS v3.4 + PostCSS with customized font families:
  - `font-montserrat`: Primary editorial sans-serif.
  - `font-anton`: Dominant high-impact display titles.
  - `font-barlow`: Condensed auxiliary accents.
- **State & Context Management:**
  - `CartContext.tsx`: Full cart persistence in `localStorage`, quantity controls, shipping fee calculation (`FREE_SHIPPING_THRESHOLD_PAISE = 149900`, `DEFAULT_SHIPPING_FEE_PAISE = 9900`), and modal state (`isBagOpen`, `isSearchOpen`).
  - `AuthContext.tsx`: User session persistence (`localStorage` / `sessionStorage`), SHA-256 client password hashing, signin/signup/signout routines.
  - `ToastContext.tsx`: Centralized feedback toast notification provider.
  - `useLaunchGate.ts`: Pre-launch gate evaluation communicating with `/api/v1/config`.
  - `useWaitlist.ts`: Mutation hook communicating with `/api/v1/waitlist`.
  - `useProducts.ts`: TanStack Query v5 hook fetching `/api/v1/products` with fallback to `DEMO_PRODUCTS`.

### B. Current `LandingPage.tsx` State
- Currently contains a legacy prototype using `ResponsiveStage` (fixed 1920x1080 scaling stage designed for static mockup files).
- **Target Transformation:** Replace the legacy `ResponsiveStage` layout with a modern, fully fluid, production-grade responsive container system structured strictly to match the new visual reference screenshot.

---

## 2. Existing Assets & Inventory

### Available & Reusable Brand Assets
| Asset Filename | Format / Mode | Resolution | Usage in Homepage |
|---|---|---|---|
| `logo.png` / `logo-original.png` | RGBA PNG | Transparent | Header logo & Footer logo (Ivory/White) |
| `official-emblem.png` | RGBA PNG | 200×140 | Small V brandmark badges |
| `vyomik-wordmark-trimmed.png` | RGBA PNG | Transparent | High-contrast editorial wordmark |
| `vyomik-original-hoodie.png` | RGBA PNG | 1024×917 | Centerpiece of Core Elements 3D showcase |
| `glowing-v-emblem-trimmed.png` | RGBA PNG | Transparent | Architectural lighting / V backdrop accent |
| `burnt-orange-ribbon-trimmed.png`| RGBA PNG | Transparent | Luxury flowing silk accent |
| `vyomik-rock-bg.jpg` | RGB JPEG | 1024×576 | Background plate for cinematic rock environment & Newsletter section |
| `essential-hoodie.png` | RGBA PNG | 600×600 | Secondary carousel product card (Crimson hoodie) |
| `oversized-basic-tee.png` | RGBA PNG | 600×600 | Catalog tee asset |
| `vyomik-logo-tee.png` | RGBA PNG | 600×600 | Catalog wordmark tee asset |

### Required Missing Assets (To Be Curated / Generated for Approval)
1. **Hero Banner Photography (`hero-editorial-model.jpg`)**:
   - High-fashion editorial male model wearing the oversized ivory VYOMIK hoodie, black sunglasses, relaxed posture, leaning against brutalist concrete architecture with a burnt-rust geometric V emblem projected on the wall.
2. **New Arrivals Category Cards (4 Images)**:
   - `category-hoodies.jpg`: Model in ivory hoodie from behind showing V logo.
   - `category-tshirts.jpg`: Model wearing black crewneck tee with chest V emblem.
   - `category-cargos.jpg`: Detailed tactical cargo pocket with V badge.
   - `category-accessories.jpg`: Muted sand beige baseball cap with black embroidered V logo.
3. **Core Elements Carousel Flanking Products (4 Images)**:
   - `product-hoodie-black-back.png`: Black heavyweight hoodie showing V emblem.
   - `product-hoodie-rust.png`: Burnt-orange / copper heavyweight pullover hoodie.
   - `product-hoodie-charcoal-art.png`: Charcoal hoodie with geometric mountain embroidery.
   - `product-hoodie-ivory-back.png`: Ivory heavyweight hoodie back angle.
4. **Explore Collections Editorial Cards (3 Images)**:
   - `collection-core-essentials.jpg`: Editorial model profile in ivory hoodie.
   - `collection-urban-terrain.jpg`: Rugged cargo styling in natural daylight.
   - `collection-monochrome-edit.jpg`: Editorial back view of model in black VYOMIK tee.

---

## 3. Existing API & Backend Integration Mapping

The backend is developed with FastAPI and SQLite (`vyomik_dev.db`). Under the **frontend-only protection mandate**, no backend files or database schemas will be touched. All frontend features map directly to existing endpoints:

| Homepage Section / Feature | Backend Endpoint / Service | Status | Classification |
|---|---|---|---|
| **Announcement Bar** (Free Shipping ₹1,499) | `GET /api/v1/config` -> `free_shipping_threshold_paise: 149900` | Active & Verified | **Existing to Reuse** |
| **Store Gate & Launch Status** | `GET /api/v1/config` -> `gate_enabled`, `launch_at` | Active & Verified | **Existing to Reuse** |
| **Shopping Cart & Badge Count** | `CartContext` (`itemCount`, `totalPaise`) | Client State (`localStorage`) | **Existing to Reuse** |
| **Search Drawer** | `CartContext` (`isSearchOpen`, `openSearch`) + `SearchBar.tsx` | Active & Verified | **Existing to Reuse** |
| **User Account & Session** | `AuthContext` (`user`, `signin`, `signup`) | Active & Verified | **Existing to Reuse** |
| **Featured Products / Catalog** | `GET /api/v1/products?category=hoodies` | Active & Verified | **Existing to Reuse** |
| **Newsletter / Collective Signup** | `POST /api/v1/waitlist` (`source: "homepage_collective"`) | Active & Verified | **Existing to Reuse** |
| **Order Placement / Checkout** | `POST /api/v1/orders` | Active & Verified | **Existing to Reuse** |
| **Slide Indicators / Interactive Carousels** | Pure Frontend Client State | New Component | **Frontend to Implement** |
| **Three.js Interactive Showcase** | Three.js / React Three Fiber / GSAP | New Component | **Frontend to Implement** |

---

## 4. Homepage Section-by-Section Implementation Plan

### Section 1: Announcement Bar
- **Positioning:** Fixed or sticky top bar above navigation, height 36px.
- **Color:** Burnt Rust (`#A64B2A`) background with Warm Ivory (`#F4F0E8`) text.
- **Content:**
  - Left & Right chevron controls.
  - Truck icon + *"Free Shipping on Orders Above ₹1,499"* (dynamically tied to `config.free_shipping_threshold_paise`).
  - Vertical divider + *"New Launch: Core Element Collection"*.
- **Classification:** **Frontend to Implement** (consuming existing `useStoreConfig`).

### Section 2: Main Navigation Bar
- **Left:** Official VYOMIK ivory logo asset (`/assets/logo.png`), linking to `/home`.
- **Center:** Minimal navigation items:
  - `Home` (active indicator with warm ivory underline).
  - `Shop ⌵` (hover dropdown previewing Hoodies, T-Shirts, Cargos, Accessories).
  - `Collections ⌵` (hover dropdown previewing Core Essentials, Urban Terrain, Monochrome Edit).
  - `About` (links to `/our-story`).
- **Right:**
  - Search icon button (triggers `openSearch()`).
  - User/Profile icon button (navigates to `/sign-in` or shows user name if authenticated).
  - Shopping Bag icon button with burnt-rust badge counter showing `itemCount` (triggers `openBag()`).
- **Styling:** Transparent dark backdrop with glassmorphism blur over the hero banner, transitioning to solid `#0B0B0B`/95 on scroll.
- **Classification:** **Frontend to Implement** (reusing `CartContext`, `AuthContext`, and existing routes).

### Section 3: Cinematic Hero Banner
- **Layout:** Two-column split layout on desktop (50/50).
- **Left Editorial Content:**
  - Category eyebrow tag: `STREETWEAR / ESSENTIALS / EVERYDAY WEAR` in `#716B63` with `#A64B2A` slashes.
  - Huge bold italic display typography:
    ```
    WEAR
    YOUR
    PERSPECTIVE
    ```
    with custom hand-painted burnt-rust SVG brush stroke underline under `PERSPECTIVE`.
  - Brand description with 2px vertical burnt-rust border: *"Modern streetwear for a generation that thinks different."*
  - CTA Button Row:
    - Primary: `Shop Collection →` (filled `#A64B2A`, rounded-xl, hover glow, scrolls to Core Elements or routes to `/collections`).
    - Secondary: `▶ Our Story` (thin outline `#3A3530`, text `#F4F0E8`, hover border `#D9D1C3`, routes to `/our-story`).
  - Carousel Slide Counter: `01 / 03` with `<` and `>` arrow navigation buttons.
- **Right Photographic Hero:**
  - Framed editorial photograph of model in architectural concrete environment wearing the VYOMIK ivory hoodie with projected orange V backdrop.
  - Subtle mouse parallax and soft ambient edge vignette.
- **Classification:** **Frontend to Implement** (asset requires curation/approval).

### Section 4: Benefits & Trust Strip
- **Layout:** Full-width horizontal strip on `#141210`, bordered top and bottom with `#242321`.
- **Four Items:**
  1. *Free Shipping* — "On orders above ₹1,499" (Truck icon).
  2. *Quality Guarantee* — "Premium fabric & long lasting" (Shield-check icon).
  3. *Easy Returns* — "7-day hassle free returns" (Package return icon).
  4. *Sustainable Choice* — "Ethically crafted & responsible" (Leaf icon).
- **Styling:** Thin-line Warm Ivory icons, Warm Ivory titles, Warm Grey descriptions, subtle vertical dividers.
- **Classification:** **Frontend to Implement**.

### Section 5: New Arrivals — Category Cards
- **Left Header Block (Width ~22%):**
  - Section title: `NEW ARRIVALS` in bold Montserrat.
  - Description: *"The latest drops, crafted for everyday impact."*
  - Outlined button: `Explore All →` (navigates to `/collections`).
- **Right Grid (Width ~78%):**
  - 4 vertical image-led category cards:
    1. **HOODIES** (routes to `/collections?cat=hoodies`)
    2. **T-SHIRTS** (routes to `/collections?cat=plain`)
    3. **CARGOS** (routes to `/collections?cat=cargos`)
    4. **ACCESSORIES** (routes to `/collections?cat=accessories`)
  - Each card: Aspect ratio 3:4, rounded-2xl, subtle border `#242321`, dark bottom gradient overlay, category label in bold Warm Ivory with circular arrow button (`↗`), and subtle image zoom on hover (`scale-105`).
- **Classification:** **Frontend to Implement** (category assets require curation/approval).

### Section 6: Featured Collection — Core Elements Showcase (Interactive 3D / Layered Carousel)
- **Header:**
  - Centered eyebrow: `NEW LAUNCHES` (`#716B63`, tracking `0.3em`).
  - Main title: `CORE ELEMENTS` (`CORE` in Warm Ivory, `ELEMENTS` in Burnt Rust `#A64B2A` italic display).
  - Description: *"Our latest drop — minimal, bold, and built for everyday movement."*
- **Visual Composition & Interaction:**
  - Central dominant floating product: The authentic VYOMIK Warm-Ivory Oversized Hoodie (`vyomik-original-hoodie.png`).
  - Four secondary framed colorways arranged in true 3D perspective / arc flanking the center:
    - Slot -2: Black V Hoodie
    - Slot -1: Burnt-Rust Hoodie
    - Slot 0: Ivory Core Hoodie (Center, 100% scale, dominant focal point)
    - Slot +1: Charcoal Line-Art Hoodie
    - Slot +2: Ivory Back View Hoodie
  - Ground Plane: Glowing circular pedestal ring on dark volcanic rock base (`border-[2.5px] border-[#F5B964]` with intense radial bloom).
  - Navigation Controls:
    - Circular arrow buttons `<` (left) and `>` (right).
    - Carousel pagination indicator dots (active dot in Burnt Rust).
    - Mouse / Touch Drag interaction: Smooth horizontal drag-to-rotate that updates active product.
    - Click any flanking card to bring it into center focus.
    - Click center product to open quick-view or product detail page.
- **Architecture:** Implemented with React Three Fiber / Three.js fallback mode using hardware-accelerated plane meshes and GSAP interactive arc interpolation, guaranteeing smooth 60 FPS performance without heavy 3D mesh overhead.
- **Classification:** **Frontend to Implement** (reusing existing Three.js setup and `vyomik-original-hoodie.png`).

### Section 7: Explore Collections
- **Left Header Block:**
  - Section title: `EXPLORE COLLECTIONS` with burnt-rust brush stroke accent.
  - Subhead: *"Curated drops for every part of your day."*
  - Outlined button: `View Collections →` (navigates to `/collections`).
- **Right Cards Grid (3 Cards):**
  - **Core Essentials**: *"Timeless everyday fits."*
  - **Urban Terrain**: *"Rugged. Functional. Versatile."*
  - **Monochrome Edit**: *"Minimal tones. Maximum impact."*
- **Card Styling:** Wide 16:10 aspect ratio cards, dark cinematic gradient overlay, title, description, and circular arrow link (`↗`).
- **Classification:** **Frontend to Implement**.

### Section 8: Brand Benefits Strip
- **Layout:** Matching the aesthetic of Section 4 with four distinct brand pillars:
  1. *Bold Design* — "Clean, modern and distinctive." (Lightning icon)
  2. *Premium Comfort* — "Breathable, durable and all-day wear." (Layers icon)
  3. *Versatile Style* — "From campus to the streets." (Infinity icon)
  4. *Responsible Fashion* — "Thoughtful materials, smaller footprint." (Leaf icon)
- **Classification:** **Frontend to Implement**.

### Section 9: Newsletter Section — Join The VYOMIK Collective
- **Visual Composition:**
  - Full-bleed cinematic volcanic mountain backdrops on the left and right with burnt-rust illuminated edges and ambient atmospheric haze.
  - Central dark focus with high-contrast typography:
    `JOIN THE VYOMIK COLLECTIVE`
    *"Get early access to new drops, exclusive offers and behind-the-scenes."*
- **Subscription Form:**
  - Outlined pill input with envelope icon (`Enter your email`).
  - Filled burnt-rust submit button: `Subscribe →`.
  - Fully integrated with `useWaitlist()` hook calling `POST /api/v1/waitlist` with `source: "homepage_collective"`.
  - Interactive validation, loading spinner, success toast, and duplicate detection handling.
- **Classification:** **Frontend to Implement** (reusing existing backend waitlist API).

### Section 10: Multi-Column Footer
- **Layout:** 5-column editorial layout matching the reference:
  - **Col 1 (Brand):** Official VYOMIK logo (`/assets/logo.png`) + statement: *"Modern streetwear for a generation that thinks different."*
  - **Col 2 (Shop):** All Products (`/collections`), Hoodies, T-Shirts, Cargos, Accessories.
  - **Col 3 (Company):** About Us (`/our-story`), Our Story (`/our-story`), Collections (`/collections`), Careers, Contact (`/contact`).
  - **Col 4 (Support):** FAQ, Shipping & Delivery (`/shipping-returns`), Returns & Refunds (`/shipping-returns`), Size Guide, Track Order.
  - **Col 5 (Follow Us):** Instagram (`https://www.instagram.com/simplyvyomik`), YouTube, X, Discord.
- **Bottom Bar:**
  - `© 2026 VYOMIK. All rights reserved.`
  - Links: `Privacy Policy` (`/privacy-policy`) | `Terms & Conditions` (`/terms-of-service`).
  - Smooth back-to-top interaction.
- **Classification:** **Frontend to Implement** (reusing existing brand links, policies, and routes).

---

## 5. Component Architecture

```
frontend/src/
├── pages/
│   ├── LandingPage.tsx                       <-- Refactored main homepage container
│   └── ComingSoon.tsx                        <-- Preserved Coming Soon page
├── components/
│   ├── home/
│   │   ├── AnnouncementBar.tsx               <-- Top burnt-rust announcement banner
│   │   ├── HomeNavbar.tsx                    <-- Fixed/sticky navigation with bag & search triggers
│   │   ├── HeroSection.tsx                   <-- 2-column editorial hero with model photograph
│   │   ├── TrustBenefitsStrip.tsx            <-- 4-item shipping & return guarantee strip
│   │   ├── NewArrivalsCategories.tsx         <-- 4-card editorial category grid
│   │   ├── FeaturedCollectionShowcase.tsx    <-- Core Elements interactive 3D carousel
│   │   ├── ExploreCollectionsSection.tsx     <-- 3 editorial collection cards
│   │   ├── BrandBenefitsStrip.tsx            <-- 4-item brand philosophy strip
│   │   ├── NewsletterSection.tsx             <-- Cinematic collective subscription section
│   │   └── HomeFooter.tsx                    <-- 5-column comprehensive footer
│   ├── shop/
│   │   ├── BagDrawer.tsx                     <-- Existing slide-over cart drawer (reused)
│   │   └── SearchBar.tsx                     <-- Existing search overlay (reused)
│   └── common/
│       ├── VyomikLogo.tsx                    <-- Official brand SVG / PNG component
│       └── BrushUnderline.tsx                <-- Hand-painted burnt-rust SVG underline
```

---

## 6. Animation Implementation Plan

| Section | Animation Type | Library | Implementation Details |
|---|---|---|---|
| **Page Entrance** | Staggered Fade & Rise | GSAP Timeline | Announcement bar slides down, navbar fades in, hero heading lines reveal sequentially with brush stroke draw. |
| **Hero Parallax** | Cursor-Following Parallax | GSAP + RAF | Subtle 2D translation of model photograph and architectural background in response to mouse position. |
| **Trust Strips** | Scroll-Triggered Reveal | GSAP ScrollTrigger | Items fade and slide up with 0.1s stagger upon scrolling into viewport. |
| **Category & Collection Cards** | Hover Scale & Dark Vignette | Tailwind + CSS | `transition-transform duration-300 group-hover:scale-105` on image, smooth elevation of text and circular arrow. |
| **Core Elements Showcase** | 3D Arc Carousel & Drag-to-Rotate | GSAP / Three.js | Active card remains centered with floating oscillation. Flanking cards position along elliptical arc with depth scaling (`scale: 0.78, opacity: 0.6`). Drag gestures interpolate smoothly with inertia. |
| **Newsletter Section** | Ambient Volcanic Ember Float | CSS Animation | Sparse orange ember particles drifting slowly across the rocky backdrop. |
| **Buttons & Interactive CTAs** | Ripple & Glow Feedback | Tailwind / Framer Motion | Burnt-rust buttons expand subtle box-shadow glow on hover (`hover:shadow-[0_0_20px_rgba(166,75,42,0.5)]`). |
| **Reduced Motion** | Universal Motion Gate | Media Query | Disables parallax and continuous oscillation if `(prefers-reduced-motion: reduce)` is active. |

---

## 7. Three.js & 3D Usage Plan
- **Primary Objective:** Deliver a high-performance, fluid experience matching the reference.
- **Core Elements Showcase Strategy:**
  - Use Three.js / React Three Fiber for the ambient pedestal projector ring and particle illumination.
  - Implement the 5-hoodie carousel as a hybrid layered presentation: high-resolution transparent product renders mapped to GPU planar meshes or DOM nodes along a mathematical elliptical arc (`x = rx * sin(theta)`, `z = rz * cos(theta)`).
  - This architecture supports dropping in a real `.glb` / `.gltf` model in the center slot later without rewriting the carousel structure.
  - Completely avoids heavy multi-geometry canvas lag while maintaining 60 FPS performance on all devices.

---

## 8. Responsive Design Strategy

| Breakpoint | Layout Adaptations |
|---|---|
| **Desktop ($\ge$ 1280px)** | Full 1920×1080 proportioned composition. Two-column hero with large typography, 4-column category cards, 5-product visible arc showcase, 3-column collection cards, 5-column footer. |
| **Laptop / Tablet (768px – 1279px)** | Hero typography scales to `text-5xl` / `text-6xl`. New Arrivals cards shift to 2×2 grid. Featured carousel compresses horizontal spacing. Explore Collections shifts to 1 large + 2 stacked cards. |
| **Mobile ($<$ 768px)** | Header converts to compact brandmark + hamburger drawer + cart icon. Hero stacks vertically (headline first, CTAs, model image below). Trust strips convert to 2×2 compact grid. Category cards become horizontally swipeable. Core Elements carousel shows 1 active product with swipe controls. Newsletter form stacks input and button vertically. Footer collapses into clean accordion / stacked columns. Zero horizontal overflow. |

---

## 9. SEO & Accessibility Plan
- **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Heading Hierarchy:** `<h1>` (Hero headline: *Wear Your Perspective*), `<h2>` (Section headers: *New Arrivals*, *Core Elements*, *Explore Collections*, *Join The VYOMIK Collective*), `<h3>` (Card titles).
- **ARIA & Keyboard Navigation:**
  - Interactive cards and carousel arrows have descriptive `aria-label` attributes (`aria-label="Previous featured product"`).
  - Form inputs have associated labels or accessible names.
  - Focus rings styled with subtle burnt-rust outline (`focus-visible:ring-2 focus-visible:ring-[#A64B2A]`).
- **Metadata & Open Graph:** Pre-configured in `index.html` with title: `"VYOMIK — Everyday Oversized Essentials"`.

---

## 10. Performance & Production Standards
- **Lazy Loading:** All below-the-fold media uses `loading="lazy"` and `decoding="async"`.
- **Image Optimization:** Compressed WebP/PNG assets with defined width and height to eliminate layout shifts (CLS < 0.05).
- **Render Optimization:** Pure component memoization (`React.memo`, `useMemo`) for carousel state and static benefit strips.
- **Bundle Footprint:** Reuses already installed dependencies (`gsap`, `lucide-react`, `framer-motion`) without adding new libraries.

---

## 11. Testing & Quality Assurance Strategy

1. **Unit & Integration Tests (`frontend/src/test/`)**:
   - `LandingPage.test.tsx`:
     - Test that navbar renders logo, links, and triggers for bag/search.
     - Test that hero renders headline, CTA buttons, and category line.
     - Test that benefits strips render all 4 guarantee items.
     - Test that category cards navigate to corresponding filter/route.
     - Test that Core Elements carousel navigates between products.
     - Test that newsletter form validates email and submits to waitlist endpoint.
     - Test that footer renders all 5 columns, social links, and back-to-top interaction.
   - `BrandLinksAndPolish.test.tsx`:
     - Confirm all Instagram links match `https://www.instagram.com/simplyvyomik`.
     - Confirm all mailto links match `mailto:simplyvyomik@gmail.com`.
2. **Visual & Responsive Verification**:
   - Test at 1920×1080 (Desktop), 1024×768 (Tablet), and 390×844 (Mobile).
   - Verify zero horizontal scrolling.
3. **Backend Safeguard**:
   - Run test suite to verify 0 regressions across existing pages.

---

## 12. Implementation Phases (Post-Approval)

- **Phase 1: Component Scaffolding & Foundation**
  - Create reusable subcomponents in `frontend/src/components/home/`.
  - Wire up `AnnouncementBar`, `HomeNavbar`, `TrustBenefitsStrip`, `BrandBenefitsStrip`, `HomeFooter`.
- **Phase 2: Hero Section & Editorial Typography**
  - Implement `HeroSection` with typography, brush underline, buttons, and model photography framing.
- **Phase 3: Category & Collection Editorial Grids**
  - Implement `NewArrivalsCategories` (4 cards) and `ExploreCollectionsSection` (3 cards) with hover effects and routing.
- **Phase 4: Featured Collection 3D Product Showcase**
  - Implement `FeaturedCollectionShowcase` with central floating hoodie, flanking perspective products, glowing pedestal ring, drag/swipe controls, and dot indicators.
- **Phase 5: Newsletter Integration & Full Assembly**
  - Implement `NewsletterSection` connected to `useWaitlist()`.
  - Assemble full page inside `LandingPage.tsx`.
- **Phase 6: Verification, Automated Testing & Visual Review**
  - Run `vitest` tests, test responsive breakpoints, and capture browser verification screenshots.

---

## 13. Files Expected to Change / Be Created

### New Files to Create:
1. `VYOMIK_HOMEPAGE_IMPLEMENTATION_PLAN.md` (This document)
2. `frontend/src/components/home/AnnouncementBar.tsx`
3. `frontend/src/components/home/HomeNavbar.tsx`
4. `frontend/src/components/home/HeroSection.tsx`
5. `frontend/src/components/home/TrustBenefitsStrip.tsx`
6. `frontend/src/components/home/NewArrivalsCategories.tsx`
7. `frontend/src/components/home/FeaturedCollectionShowcase.tsx`
8. `frontend/src/components/home/ExploreCollectionsSection.tsx`
9. `frontend/src/components/home/BrandBenefitsStrip.tsx`
10. `frontend/src/components/home/NewsletterSection.tsx`
11. `frontend/src/components/home/HomeFooter.tsx`

### Existing Files to Modify (Post-Approval Only):
1. `frontend/src/pages/LandingPage.tsx` (Refactor from legacy `ResponsiveStage` to the full homepage layout)
2. `frontend/src/test/LandingPage.test.tsx` (Update test assertions to cover all 10 homepage sections)

---

## 14. Awaiting Approval Notice
*No code or asset modifications have been made during this turn. This document serves as the formal specification for user review and approval.*
        