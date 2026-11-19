# VYOMIK — SHOP ALL PAGE IMPLEMENTATION PLAN & DESIGN SPECIFICATION
## Phase 02: Architectural Blueprint & Execution Roadmap

**DOCUMENT STATUS:** PLANNING ONLY — PENDING USER APPROVAL  
**AUTHOR:** Senior Frontend & E-Commerce Architect  
**DATE:** November 19, 2026  
**BRAND:** VYOMIK — Premium Minimalist Streetwear  

---

## 1. EXECUTIVE SUMMARY & OBJECTIVES

The objective of Phase 02 is to design and architect the **Shop All** catalog page for VYOMIK. This page serves as the core commercial browsing experience of the brand, translating the dark, luxury editorial aesthetic established on the Coming Soon and Homepage into an intuitive, high-performance product discovery interface.

### Core Principles
1. **1:1 Visual Fidelity to Design Reference**: Clean editorial grid, generous spacing, razor-sharp typography, and restrained luxury micro-interactions.
2. **Zero Reference Screenshot Reuse**: 100% independent, AI-generated or properly licensed photorealistic fashion imagery. No cropped card screenshots or blurry backgrounds.
3. **Strict Backend Preservation**: Zero changes to FastAPI routes, SQLite/PostgreSQL schemas, or database tables. All filtering, sorting, client pagination, and cart state flow through established frontend contracts.
4. **Seamless Component Reusability**: Deep reuse of existing production components (`AnnouncementBar`, `HomeNavbar`, `HomeFooter`, `BagDrawer`, `SearchBar`, `CartContext`, `AuthContext`, `ToastContext`).

---

## 2. EXISTING PROJECT ARCHITECTURE FINDINGS

### 2.1 Routing Structure (`frontend/src/App.tsx`)
- Current Routes:
  - `/`: Root Gate Route (renders `ComingSoon` when `gate_enabled=true`, else `LandingPage`).
  - `/coming-soon`: Direct Coming Soon page.
  - `/home`: Main Ecommerce Homepage (10 sections).
  - `/collections` & `/new-arrivals`: Currently render `CollectionsPage` (a 3-card desktop showcase adapted from legacy HTML).
  - `/bag` & `/cart`: `BagPage`.
  - `/sign-up`, `/sign-in`: Authentication routes.
  - `/our-story`, `/contact`, `/shipping-returns`, `/privacy-policy`, `/terms-of-service`: Content and legal pages.
- **Routing Strategy for Shop All**:
  - Introduce `/shop` as the canonical route for the new Shop All page.
  - Alias `/collections` and `/new-arrivals` to seamlessly load this comprehensive catalog or filter by query parameter (`?cat=...`).

### 2.2 Reusable Design Tokens & Typography (`frontend/src/index.css`, `tailwind.config.js`)
- **Color Palette**:
  - `Midnight Black`: `#0B0B0B` (Primary canvas background)
  - `Charcoal`: `#242321` (Card surfaces, borders, secondary elements)
  - `Warm Ivory`: `#F4F0E8` (Primary typography & accents)
  - `Sand Beige`: `#D9D1C3` (Secondary surfaces, badges, body text)
  - `Burnt Rust`: `#A64B2A` (Active states, highlights, CTAs, tags)
  - `Warm Grey`: `#716B63` (Muted labels, borders, subtle text)
- **Typography**:
  - Headings: `Montserrat` / `Syne` / `Archivo` (Heavy weights `font-black`, `font-extrabold`, uppercase, tight tracking).
  - Body & UI: `Montserrat` (400, 500, 600, 700).

### 2.3 Existing Component Inventory
| Component | File Path | Status | Reuse Strategy |
|---|---|---|---|
| **AnnouncementBar** | `src/components/home/AnnouncementBar.tsx` | Ready | Reused directly at page top (shipping threshold & launch message). |
| **HomeNavbar** | `src/components/home/HomeNavbar.tsx` | Ready | Reused directly with active link indicator on "Shop". |
| **HomeFooter** | `src/components/home/HomeFooter.tsx` | Ready | Reused directly at page bottom with verified brand links. |
| **BagDrawer** | `src/components/shop/BagDrawer.tsx` | Ready | Reused via `useCart()` for slide-out bag checkout. |
| **SearchBar** | `src/components/shop/SearchBar.tsx` | Ready | Reused via `useCart().openSearch` for global search modal. |
| **ToastNotification** | `src/context/ToastContext.tsx` | Ready | Reused for wishlist & add-to-bag feedback. |

### 2.4 Existing Hooks & Context
- `useCart()` (`CartContext.tsx`): Persistent cart state (`addItem`, `removeItem`, `updateQuantity`, `subtotalPaise`, `shippingFeePaise`, `totalPaise`, `openBag`).
- `useAuth()` (`AuthContext.tsx`): User session, signin, signup, signout.
- `useStoreConfig()` (`useStoreConfig.ts`): Server config (`free_shipping_threshold_paise`, store mode, contact email).
- `useProducts(category)` (`useProducts.ts`): React Query hook fetching from `/api/v1/products` with robust fallback to `DEMO_PRODUCTS`.

### 2.5 Backend API Contracts & Inherent Limitations
- Backend API endpoints:
  - `GET /api/v1/products`: Returns list of products. Supports optional `?category=...`.
  - `GET /api/v1/products/{id}`: Returns product details by ID or slug.
- **Identified Limitations (Strictly Non-Breaking)**:
  - The backend does not expose API-level query filters for multiple sizes, multiple colors, or price ranges (`min_price`, `max_price`).
  - The backend database in production/local setup is isolated.
  - **Architectural Solution**: The frontend will fetch all available products (or query by top-level category) and execute high-performance client-side filtering, sorting, and pagination. This guarantees 100% responsiveness (<1ms filter reaction), works seamlessly offline or with demo fallbacks, and strictly adheres to the rule: *Zero backend or database modifications*.

---

## 3. PROPOSED PAGE COMPONENT HIERARCHY

```
ShopAllPage.tsx (src/pages/ShopAllPage.tsx)
│
├── AnnouncementBar (src/components/home/AnnouncementBar.tsx) [REUSED]
├── HomeNavbar (src/components/home/HomeNavbar.tsx) [REUSED]
│
├── ShopHeroBanner.tsx (src/components/shop-all/ShopHeroBanner.tsx) [NEW]
│   ├── Left Column: "SHOP ALL" Heading + Editorial Subtitle + Result Counter
│   └── Right Column: Independent Model Fashion Photography with Burnt-Rust Texture
│
├── CategoryHorizontalNav.tsx (src/components/shop-all/CategoryHorizontalNav.tsx) [NEW]
│   └── 6 Category Pill/Cards: All Products, Hoodies, T-Shirts, Cargos, Jackets, Accessories
│
├── ShopMainListing.tsx (src/components/shop-all/ShopMainListing.tsx) [NEW]
│   │
│   ├── MobileFilterTrigger (Quick-toggle drawer on mobile screens)
│   │
│   ├── FilterSidebar.tsx (src/components/shop-all/FilterSidebar.tsx) [NEW]
│   │   ├── Active Filters Summary & "Clear All"
│   │   ├── Category Filter Accordion (Hoodies, T-Shirts, Cargos, Jackets, Accessories)
│   │   ├── Size Filter Accordion (XS, S, M, L, XL, XXL)
│   │   ├── Color Filter Accordion (Ivory, Black, Charcoal, Rust, Olive swatches)
│   │   ├── Price Range Dual Slider (₹800 — ₹4,000 with min/max readout)
│   │   └── Sort By Selection
│   │
│   └── ProductGridArea.tsx (src/components/shop-all/ProductGridArea.tsx) [NEW]
│       ├── ShopToolbar.tsx (Product Count, Grid/List view toggle, Sort dropdown)
│       ├── Grid of ShopProductCard.tsx (src/components/shop-all/ShopProductCard.tsx) [NEW]
│       │   ├── Primary Product Image + Hover Secondary Angle Image
│       │   ├── NEW / SALE / FIRST DROP Badges
│       │   ├── Wishlist Heart Toggle (with Toast & LocalStorage sync)
│       │   ├── Product Title & Category Slug
│       │   ├── Formatted Price (₹Sale <s>₹Original</s>)
│       │   ├── Interactive Color Swatch Selector
│       │   └── Quick Add to Bag CTA
│       │
│       ├── EmptyState.tsx (Clean luxury fallback when filters yield 0 results)
│       └── PaginationControls.tsx (src/components/shop-all/PaginationControls.tsx) [NEW]
│
├── HomeFooter (src/components/home/HomeFooter.tsx) [REUSED]
├── BagDrawer [REUSED via CartContext]
└── SearchBar [REUSED via CartContext]
```

---

## 4. DETAILED SECTION-BY-SECTION DESIGN SPECIFICATION

### Section A: Announcement Bar
- **Height**: ~36px slim bar.
- **Background**: Burnt Rust `#A64B2A`.
- **Content**: Free Shipping threshold synced with store config (`Free Shipping on Orders Above ₹1,499`) | `New Launch: Core Element Collection`.
- **Controls**: Minimalist left/right arrow icons for mobile sliding; full display on desktop.

### Section B: Main Navigation
- **Height**: ~72px desktop / 64px mobile.
- **Styling**: Sticky `#0B0B0B` with 95% opacity, backdrop blur, thin charcoal border `#242321`.
- **Branding**: Official original VYOMIK logo (`/assets/logo.png`).
- **Links**: `Home`, `Shop` (highlighted active state with burnt-rust underline), `Collections` (dropdown), `About`.
- **Actions**: Search icon (opens `SearchBar`), Account icon (navigates to `/sign-in` or shows profile), Cart Bag icon with live item count pill badge.

### Section C: Shop Hero Banner
- **Layout**: 2-column split banner (~280px to 340px height on desktop, stacked on mobile).
- **Background**: `#141414` / `#0B0B0B` with subtle grain and radial gradient.
- **Left Column**:
  - Eyebrow: `COLLECTION / 2026 DROP` in `#A64B2A` with 0.3em letter-spacing.
  - Heading: `SHOP ALL` in 64px `font-black italic uppercase text-[#F4F0E8]`.
  - Subtitle: *"Explore our complete range of premium streetwear. Heavyweight fabrics, dropped shoulders, and architectural cuts built for everyday presence."*
  - Live result pill: *"Showing 8 of 8 Essentials"*.
- **Right Column**:
  - High-resolution editorial portrait of a model wearing a VYOMIK hoodie photographed from the back in a brutalist charcoal concrete setting, with subtle burnt-rust distressed graphic overlays.
  - Image size: 100% height, object-cover, soft gradient vignette blending into `#0B0B0B`.

### Section D: Horizontal Category Navigation
- **Layout**: Horizontal flex container with snap-scrolling on mobile, centered or left-aligned on desktop.
- **Items (6 Categories)**:
  1. `All Products` (Iconic brand lockup / full grid)
  2. `Hoodies` (Image of ivory/black hoodie)
  3. `T-Shirts` (Image of boxy tee)
  4. `Cargos` (Image of tactical cargo pocket)
  5. `Jackets` (Image of technical outerwear)
  6. `Accessories` (Image of baseball cap)
- **Visual Treatment**:
  - Compact rounded-xl cards (~120px wide × 110px tall).
  - Dark charcoal background `#181818` with subtle border `border-white/10`.
  - Top thumbnail image (48×48px) with transparent garment render.
  - Label in Warm Ivory `#F4F0E8`, 11px font-bold uppercase.
  - **Active State**: 2px border in Burnt Rust `#A64B2A`, glowing shadow `shadow-[0_0_15px_rgba(166,75,42,0.3)]`, active dot indicator.
  - **Hover**: Subtle lift `scale-[1.03]`, border transition.

### Section E: Main Product Listing Area

#### Left Sidebar — Filters (~280px fixed width on desktop, modal drawer on mobile)
1. **Header**:
   - `FILTERS` heading in 14px bold uppercase text.
   - `Clear All` button (resets all active filters to default).
2. **Category Filter Accordion**:
   - Checkboxes/radios: Hoodies, T-Shirts, Cargos, Jackets, Accessories with count badges.
3. **Size Filter Group**:
   - Grid of square/pill buttons: `XS`, `S`, `M`, `L`, `XL`, `XXL`.
   - Selected state: Burnt rust background `#A64B2A`, white text.
4. **Color Filter Swatches**:
   - Circular color buttons with tooltips: Warm Ivory (`#F4F0E8`), Pitch Black (`#181818`), Charcoal (`#242321`), Burnt Rust (`#A64B2A`), Washed Olive (`#5C6548`).
   - Active state: White outer ring + inner inset shadow.
5. **Price Range Slider**:
   - Dual-thumb or min/max range slider spanning ₹800 to ₹4,000.
   - Numeric readouts: `Min: ₹899` — `Max: ₹2,799`.
6. **Mobile Filter Drawer**:
   - Slide-out bottom sheet or side panel on `<1024px` with "Apply Filters" floating button.

#### Right Content Area — Product Grid
1. **Top Toolbar**:
   - Product count readout: *"Showing 8 products"* (or matching filtered count).
   - View mode toggle: `Grid (3 columns)` vs `List (compact 1 column)`.
   - Sort dropdown:
     - `Newest First` (default)
     - `Price: Low to High`
     - `Price: High to Low`
     - `Customer Rating / Popularity`
2. **Product Cards (`ShopProductCard`)**:
   - Aspect ratio: `3:4` or `4:5` vertical portrait.
   - Card Background: `#141414` with `#242321` border and rounded-xl corners (`rounded-2xl`).
   - Image Area:
     - Primary photographic asset showing front/profile.
     - Secondary hover transition (smooth cross-fade or subtle 4% scale on hover).
     - Top-left badge: `NEW`, `SALE`, or `FIRST DROP` (in `#A64B2A` or `#242321`).
     - Top-right wishlist button: Heart icon with stroke/fill animation, connected to local wishlist hook.
   - Content Area:
     - Product Category in 10px `#716B63` uppercase.
     - Product Title in 15px `font-bold text-[#F4F0E8]` with hover color shift.
     - Price row: `₹1,799` in `#F4F0E8` + `<s>₹2,299</s>` in `#716B63` + discount percentage pill.
     - Color swatches row: 3 to 5 color dots allowing interactive switching of the active card image or color state.
     - Quick Add Button: Floating or slide-up `Quick Add +` button triggering immediate add to `CartContext` with toast notification.
3. **Empty State**:
   - Shown when filter combinations return 0 products.
   - Displays clean minimal illustration, message: *"No products match your selected filters"*, and a `Reset All Filters` button.

### Section F: Pagination
- **Format**:
  - `← Previous` button (disabled on page 1).
  - Page numbers: `1`, `2`, `3` with active pill in `#A64B2A`.
  - `Next →` button.
- **Page Size**: 8 or 12 products per page (configurable).
- **Behavior**: Smooth auto-scroll to the top of the product listing when changing pages.

### Section G: Footer
- Full reuse of `HomeFooter.tsx` with all 5 columns, verified Instagram link (`https://www.instagram.com/simplyvyomik`), verified email (`simplyvyomik@gmail.com`), and legal routes.

---

## 5. PRODUCT IMAGE ASSET REQUIREMENTS & SPECIFICATIONS

### Critical Rule
The reference screenshot is a visual layout guide only. **No cropped card images or background fragments will be used.** Every product and banner will have an independent, ultra-crisp photographic asset.

### Image Generation Matrix (9 Required Assets)

| Asset ID | Target Filename | Dimensions | Subject & Art Direction |
|---|---|---|---|
| **IMG-HERO** | `public/images/vyomik/shop/shop-hero-banner.webp` | 1376×768 | Editorial fashion model wearing a VYOMIK ivory hoodie, photographed from behind. Dark architectural brutalist concrete setting, dramatic cinematic sidelight, subtle burnt-rust graphic accent. |
| **IMG-01** | `public/images/vyomik/products/core-hoodie-ivory.webp` | 896×1120 | Photorealistic studio shot of an oversized Warm Ivory hoodie. Double-layered hood, dropped shoulders, heavyweight 450 GSM French terry texture, dark charcoal studio background. |
| **IMG-02** | `public/images/vyomik/products/element-tee-black.webp` | 896×1120 | Premium boxy black streetwear T-shirt. Dense ribbed neckband, combed 240 GSM cotton weave, relaxed drape, subtle tonal VYOMIK emblem on chest. |
| **IMG-03** | `public/images/vyomik/products/terrain-cargos-charcoal.webp` | 896×1120 | Macro fashion photography of charcoal tactical cargo pants. 3D bellows utility pocket, articulated knee seams, matte metal hardware, rugged luxury finish. |
| **IMG-04** | `public/images/vyomik/products/core-hoodie-rust.webp` | 896×1120 | Oversized hoodie in rich Burnt Rust (`#A64B2A`). Dense loopback cotton, kangaroo pocket with bartack stitching, clean minimal front, dramatic studio lighting. |
| **IMG-05** | `public/images/vyomik/products/apex-jacket-black.webp` | 896×1120 | Black minimalist streetwear bomber/track jacket. Waterproof matte nylon shell, stand collar, YKK zipper with branded puller, charcoal concrete backdrop. |
| **IMG-06** | `public/images/vyomik/products/essential-tee-ivory.webp` | 896×1120 | Warm Ivory oversized minimal T-shirt. Soft directional lighting emphasizing combed cotton fabric quality, flawless drape, clean neckline. |
| **IMG-07** | `public/images/vyomik/products/vyomik-cap-sand.webp` | 896×1120 | Sand Beige 6-panel structured baseball cap. Tonal embroidered VYOMIK angular logo on front crown, brass buckle strapback, studio podium setting. |
| **IMG-08** | `public/images/vyomik/products/element-hoodie-black.webp` | 896×1120 | Pitch Black heavyweight hoodie. Deep tonal saturation, thick ribbed cuffs and hem, structured hood construction, warm rim light. |

---

## 6. FILTERING, SORTING & PAGINATION LOGIC

### 6.1 State Management Architecture
```typescript
interface ShopFilterState {
  category: string; // 'all' | 'hoodies' | 't-shirts' | 'cargos' | 'jackets' | 'accessories'
  sizes: string[]; // e.g. ['M', 'L']
  colors: string[]; // e.g. ['#F4F0E8', '#202020']
  priceRange: [number, number]; // [minPrice, maxPrice] in Rupees
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'popular';
  viewMode: 'grid' | 'list';
  currentPage: number;
}
```

### 6.2 Filter Pipeline (`useMemo`)
1. **Category Filter**: Matches product `category` or `type`.
2. **Size Filter**: Matches products containing at least one selected size in `availableSizes`.
3. **Color Filter**: Matches products having swatches or colors matching selected hex values.
4. **Price Filter**: Verifies `product.price >= minPrice && product.price <= maxPrice`.
5. **Sort Comparator**:
   - `newest`: Preserves drop order.
   - `price-asc`: Ascending numerical price sort (`a.price - b.price`).
   - `price-desc`: Descending numerical price sort (`b.price - a.price`).
   - `popular`: Stable rating/popularity sort.
6. **Slice for Pagination**: `filteredProducts.slice((page - 1) * pageSize, page * pageSize)`.

### 6.3 URL Synchronization
Filter state automatically syncs with browser query params (`?cat=hoodies&sort=price-asc`) so users can share or bookmark filtered catalog views.

---

## 7. CART & WISHLIST INTEGRATION

### 7.1 Cart Integration
- Leverages existing `useCart()`:
  ```typescript
  addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    pricePaise: product.price * 100,
    type: product.type,
    color: activeColor,
    img: product.img,
    size: activeSize || 'M',
    quantity: 1,
  });
  ```
- Triggers `toast(`${product.name} added to bag`)`.
- Optionally triggers `openBag()` or increments the cart counter with an animated bounce.

### 7.2 Wishlist Integration
- Uses persistent client-side wishlist store (`localStorage.getItem('vyomik_wishlist')`).
- Heart icon fills with `#A64B2A` with an organic spring animation.
- Emits Toast feedback: *"Saved to your wishlist"* / *"Removed from wishlist"*.

---

## 8. ANIMATION & MICRO-INTERACTIONS

1. **Hero Entry**: Subtle staggered fade-up on text and image (`opacity: 0, y: 15` → `opacity: 1, y: 0`).
2. **Category Cards Hover**: Eased scale `scale-[1.03]` with glowing border transition (`duration-200`).
3. **Product Image Hover**: Subtle 4% scale on image with smooth CSS transform `duration-500 ease-out`.
4. **Filter Drawer**: Off-canvas slide-in with overlay backdrop blur on mobile (`transition-transform duration-300`).
5. **Add-to-Bag Feedback**: Button ripple / checkmark icon animation, toast slide-up from bottom center.
6. **Zero Performance Bottlenecks**: Pure CSS transforms and GPU-accelerated opacity changes. No heavy Three.js instances required on this page, guaranteeing high frame rates on mobile devices.

---

## 9. RESPONSIVE BEHAVIOR MATRIX

| Breakpoint | Layout Behavior | Grid Columns | Filter Navigation |
|---|---|---|---|
| **Desktop (≥1280px)** | 2-column layout (Sidebar + Grid) | 3 or 4 columns | Sticky left sidebar (280px width) |
| **Laptop (1024px – 1279px)** | 2-column layout (Compact Sidebar + Grid) | 3 columns | Collapsible sidebar (240px width) |
| **Tablet (768px – 1023px)** | Stacked layout | 2 columns | Mobile filter button + slide-out sheet |
| **Mobile (<768px)** | Single-column scroll | 2 columns (or 1 on small screens) | Snap-scroll categories + bottom sheet filters |

---

## 10. FILE CREATION & MODIFICATION PLAN

### New Files to Create:
1. `frontend/src/pages/ShopAllPage.tsx`: Main route container.
2. `frontend/src/components/shop-all/ShopHeroBanner.tsx`: Editorial split hero.
3. `frontend/src/components/shop-all/CategoryHorizontalNav.tsx`: 6-category bar.
4. `frontend/src/components/shop-all/ShopMainListing.tsx`: Filter + grid coordinator.
5. `frontend/src/components/shop-all/FilterSidebar.tsx`: Accordion filter panels.
6. `frontend/src/components/shop-all/ProductGridArea.tsx`: Toolbar, product cards grid, empty state.
7. `frontend/src/components/shop-all/ShopProductCard.tsx`: Premium card with swatches, wishlist, and quick-add.
8. `frontend/src/components/shop-all/PaginationControls.tsx`: Accessible pagination bar.
9. `frontend/src/test/ShopAllPage.test.tsx`: Comprehensive automated test suite.

### Files to Modify:
1. `frontend/src/App.tsx`: Add `<Route path="/shop" element={<ShopAllPage />} />` and map `/collections` to point to it.
2. `frontend/src/components/home/HomeNavbar.tsx`: Ensure "Shop" link routes to `/shop` with active underline state.

### Files Untouched (Preservation Guarantee):
- `backend/**`: Zero modifications.
- `database / sqlite`: Zero modifications.
- `AuthContext.tsx`, `CartContext.tsx`: Maintained as contracts.

---

## 11. TESTING & ACCEPTANCE CRITERIA

1. **Visual Testing**:
   - Layout matches the editorial reference hierarchy (Hero, Category Bar, Filter Sidebar, Product Grid, Pagination).
   - Zero reference screenshot crops used.
2. **Interaction Testing**:
   - Selecting a category updates the active card styling and filters the product grid.
   - Adjusting size, color, or price range filters updates product counts and cards dynamically.
   - Sorting by Price (Low to High / High to Low) orders products correctly.
   - Wishlist heart toggles state, persists across reload, and triggers toast.
   - Quick Add to Bag increments cart badge count and adds item to `BagDrawer`.
3. **Automated Unit & Integration Testing**:
   - 100% pass rate in `npm test -- --run` (all existing 39 tests + new `ShopAllPage.test.tsx` tests).
   - Clean production build with `npm run build` (zero TypeScript or bundle errors).
4. **Mobile Verification**:
   - Zero horizontal scroll overflow (`width <= 390px` verified).
   - Filter drawer opens smoothly and applies selected filters.

---

## 12. ARCHITECTURAL QUESTIONS FOR USER ALIGNMENT

Before implementation begins, please confirm:
1. **Route Alias**: Should `/collections` redirect directly to `/shop`, or remain as a separate page while `/shop` serves as the primary catalog? *(Recommended: Set `/shop` as the primary catalog and have `/collections` route to it).*
2. **Product Catalog Set**: We will generate the 8 luxury editorial products described in Section 5 (Core Hoodie, Element Tee, Terrain Cargos, Core Hoodie Rust, Apex Jacket, Essential Tee, Cap, Element Hoodie Black) with clean studio lighting. Do you approve this product lineup?

---

**END OF IMPLEMENTATION PLAN**  
*No source files or backend configurations have been altered. Awaiting explicit user approval.*
