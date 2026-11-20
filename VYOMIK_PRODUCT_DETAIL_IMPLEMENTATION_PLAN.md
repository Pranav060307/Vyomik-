# VYOMIK — PRODUCT DETAIL PAGE (PDP)
## Comprehensive Technical Architecture & Implementation Plan

> **STATUS: PLANNING PHASE ONLY — AWAITING EXPLICIT USER APPROVAL BEFORE IMPLEMENTATION**  
> **Visual Reference:** `media_1795110983038_b9264cd3.jpg` (Full desktop viewport reference)  
> **Target Primary Product:** `Core Hoodie – Ivory` (`core-hoodie-ivory`)  
> **Document Version:** 1.0.0  
> **Author:** Antigravity Pairing Agent  

---

## 1. Executive Summary & Objective

The objective is to architect and deliver a world-class, conversion-focused **Product Detail Page (PDP)** for VYOMIK that matches the provided design reference in every nuance: composition, proportion, dark cinematic atmosphere, typography, warm orange lighting, and micro-interactions.

The VYOMIK aesthetic is **premium streetwear editorial documentary** — defined by:
- Deep obsidian and midnight-black backgrounds (`#0B0B0B`, `#141414`).
- Warm ivory typography (`#F4F0E8`) with refined charcoal secondary text (`#716B63`, `#A8A29E`).
- Burnt rust and incandescent orange accents (`#A64B2A`, `#C85A2E`, `#FF6B35`).
- Realistic apparel textures, rock pedestal lighting, and restrained illumination rings.
- Razor-sharp UI components with crisp 1px borders (`#242321`), rounded containers (`rounded-xl` / `rounded-2xl`), and tactile feedback.

This document provides the full structural audit, data models, component hierarchy, responsive layouts, asset strategy, and phased execution roadmap. **No implementation code will be written until the user reviews and provides explicit written approval.**

---

## 2. Codebase Audit & Architectural Inventory

### 2.1 Routing & Gatekeeper Architecture
- **Location:** `frontend/src/App.tsx`
- **Current State:** Routes exist for `/`, `/coming-soon`, `/home`, `/shop`, `/collections`, `/drops`, `/new-arrivals`, `/bag`, `/about`, `/contact`, etc.
- **Identified Gap:** There is currently **no product detail route** in `App.tsx`.
- **Planned Routing Addition:**
  - Primary route: `/product/:slug` (e.g. `/product/core-hoodie-ivory`)
  - Compatibility aliases:
    - `/products/:slug`
    - `/shop/products/:slug`
    - `/shop/:category/:slug` (e.g. `/shop/hoodies/core-hoodie-ivory`)
- **Gatekeeper Compatibility:** When the pre-launch gate is active, visiting `/product/:slug` directly will respect the `useLaunchGate` hook, while allowing authorized testing or previewing when gate is bypassed or unlocked.

### 2.2 Navigation & Active Indicator
- **Components:**
  - `frontend/src/components/home/AnnouncementBar.tsx` (reused across all main pages)
  - `frontend/src/components/home/HomeNavbar.tsx` (sticky dark translucent navbar)
- **Active Navigation Rule:**
  - In `HomeNavbar.tsx`, `isShopActive` currently checks:
    ```ts
    const isShopActive =
      (location.pathname.startsWith('/shop') ||
      location.pathname.startsWith('/new-arrivals')) && !isCollectionsActive;
    ```
  - We will update `HomeNavbar.tsx` to include `location.pathname.startsWith('/product')` so that the **"Shop"** navigation link renders with its signature orange underline indicator on the PDP, exactly as seen in the visual reference screenshot!

### 2.3 Backend API vs. Client Catalog Fallback
- **Backend API:** `backend/app/api/v1/endpoints/products.py` exposes:
  - `GET /api/v1/products`
  - `GET /api/v1/products/{slug}`
- **Database Status:** When PostgreSQL is stopped locally, backend calls fail with `ConnectionRefusedError [WinError 1225]`.
- **Catalog Architecture:**
  - `frontend/src/config/shopProducts.ts` defines the complete static catalog of 8 rich products, including:
    - `vy-prod-01`: `slug: 'core-hoodie-ivory'`, `name: 'Core Hoodie – Ivory'`, `price: 2499`, `oldPrice: 2999`, color `Warm Ivory`, swatches, sizes `['S', 'M', 'L', 'XL']`, primary image `/images/vyomik/products/core-hoodie-ivory.jpg`.
    - `vy-prod-02`: `element-tee-black` (₹1,299)
    - `vy-prod-03`: `terrain-cargos-charcoal` (₹2,299)
    - `vy-prod-04`: `core-hoodie-rust` (₹2,499)
    - `vy-prod-07`: `vyomik-cap-sand` (₹899)
    - `vy-prod-08`: `element-hoodie-black` (₹2,699)
- **PDP Data Strategy (`useProductDetail` Hook):**
  - The page will attempt to fetch live product details from `http://localhost:8000/api/v1/products/{slug}`.
  - If the backend is unreachable or returns 404/500, the hook seamlessly falls back to matching the slug against `SHOP_PRODUCTS` in `shopProducts.ts`.
  - This ensures 100% reliability both in production-with-database and in standalone client demo mode.

### 2.4 Cart & Bag Drawer Integration
- **Context:** `frontend/src/context/CartContext.tsx`
- **Method:** `addItem(...)` adds items with `id`, `name`, `price`, `pricePaise`, `color`, `size`, `quantity`, `image`, and automatically opens the bag drawer with `openBag()`.
- **Thresholds:** `freeShippingThresholdPaise: 149900` (₹1,499) matches the announcement bar and PDP trust indicators!
- **Feedback:** Integrates with `useToast()` to display "Added to bag" confirmations.

### 2.5 Wishlist System
- **Storage:** LocalStorage key `'vyomik_wishlist'` stores an array of product IDs (`string[]`).
- **Hook / State:** We will provide a clean reactive `useWishlist` hook or utility with window event dispatch (`vyomik_wishlist_updated`) so header counters and card hearts remain in sync instantly across the entire application.

---

## 3. Brand Design System & Visual Specification

| Element | Hex / Token | Implementation Details |
|---|---|---|
| **Base Background** | `#0B0B0B` | Deep midnight black body background |
| **Surface Black** | `#141414` | Card containers, modal backgrounds, input controls |
| **Elevated Surface** | `#1A1918` | Thumbnail frames, active selectors |
| **Borders** | `#242321` | Crisp 1px borders, subtle glass divider lines |
| **Border Hover/Active**| `#A64B2A` / `#C85A2E` | Burnt rust active highlights & selected state halos |
| **Primary Text** | `#F4F0E8` | Warm ivory for titles, headings, and bold labels |
| **Secondary Text** | `#716B63` / `#A8A29E` | Muted descriptions, specifications, trust subtext |
| **Accent / Button** | `#C85A2E` / `#A64B2A` | Burnt orange CTA button, selected chip, active unit toggle |
| **Platform Glow** | `rgba(200, 90, 46, 0.35)` | Elliptical orange neon ring around the rocky pedestal base |
| **Star Rating** | `#E5A93C` / Gold | 5-star aggregate rating icons |

---

## 4. Visual Reference Composition Breakdown

```
+---------------------------------------------------------------------------------------------------------+
| [ANNOUNCEMENT BAR: Free Shipping on Orders Above ₹1,499  |  New Launch: Core Element Collection]        |
+---------------------------------------------------------------------------------------------------------+
| [NAVBAR: VYOMIK logo         Home   Shop (active)   Collections   About             (Search) (User) (Bag)]|
+---------------------------------------------------------------------------------------------------------+
| Home > Shop > Hoodies > Core Hoodie – Ivory                                                             |
+---------------------------------------------------------------------------------------------------------+
| [THUMBNAILS]   |                      [MAIN PRODUCT IMAGE]                     | [PURCHASE INFO PANEL]  |
| [1. Front    ] | +-----------------------------------------------------------+ | [New Launch]           |
| [2. Back     ] | |                                                           | | Core Hoodie – Ivory    |
| [3. Emblem   ] | |                 Ivory Oversized Hoodie                    | | Minimal, bold, ...     |
| [4. Fabric   ] | |                                                           | | ₹2,499 ₹2,999 17% OFF  |
| [5. Video (▶)] | |         [ Rocky Pedestal with Orange Glow Ring ]          | | ★★★★★ 4.8 (124 Reviews)|
|                | |                                                       [⤢] | | ---------------------- |
|                | +-----------------------------------------------------------+ | Color: Ivory (4 dots)  |
|                |                                                               | Size: XS S [M] L XL XXL|
|                |                                                               | [Size Chart link]      |
|                |                                                               | Quantity: [-] 1 [+]    |
|                |                                                               | [ADD TO CART] [Wishlist|
|                |                                                               | [Trust Badges: 3 items]|
+---------------------------------------------------------------------------------------------------------+
| [SIZE CHART MODAL / OVERLAY] (Opens via 'Size Chart' button)                                             |
| Title: Size Chart  | Unit Toggle: [in | cm]  | Close (✕)                                                |
| Table: XS through XXL (Chest, Length, Shoulder, Sleeve)                                                 |
| Hoodie Vector Diagram: Shoulder, Chest, Length, Sleeve measurement lines                                |
| How to Measure: 4-step checklist with checkmarks                                                        |
+---------------------------------------------------------------------------------------------------------+
| [TABS:  Product Details (active)  |  Fabric & Care  |  Shipping & Returns  |  Reviews (124) ]           |
| Description Text        |  5 Feature Checkmarks                   | Fabric Macro Image Banner with logo |
+---------------------------------------------------------------------------------------------------------+
| YOU MAY ALSO LIKE                                                                                       |
| [Card 1: Black Hoodie] [Card 2: Rust Hoodie] [Card 3: Black Tee] [Card 4: Cargos] [Card 5: Sand Cap]  |
+---------------------------------------------------------------------------------------------------------+
| [FOOTER: VYOMIK Official Brand Footer]                                                                  |
+---------------------------------------------------------------------------------------------------------+
```

---

## 5. Detailed Component Specifications

### 5.1 Breadcrumb Component (`ProductBreadcrumbs.tsx`)
- **Hierarchy:** `Home > Shop > Hoodies > Core Hoodie – Ivory`
- **Behavior:**
  - `Home` links to `/`
  - `Shop` links to `/shop`
  - `Hoodies` links to `/shop?cat=hoodies`
  - `Core Hoodie – Ivory` is non-clickable, styled in warm ivory `#F4F0E8`
  - Separator is a subtle muted chevron or slash (`/` or `>`) in `#716B63`

### 5.2 Product Gallery & Pedestal View (`ProductGallery.tsx` & `ProductPedestalView.tsx`)
- **Thumbnail Strip (Column 1):**
  - Vertical stack of 5 items:
    1. **Front View:** Full front photo of the Ivory Hoodie.
    2. **Back View:** Back photo displaying the angular VYOMIK printed insignia.
    3. **Emblem Macro:** High-contrast close-up of the chest embroidery and typography.
    4. **Fabric Macro:** Close-up tactile weave of the 320–450 GSM French Terry loopback cotton.
    5. **Video Tile:** Video thumbnail with a central glowing play button icon (`▶`). Clicking plays a subtle looped showcase video or opens the video modal.
  - Active thumbnail has a 2px solid burnt-orange border (`#C85A2E`) and subtle outer glow.
  - Hovering or clicking a thumbnail smoothly updates the main image with a cross-fade transition.
- **Main Showcase Image (Column 2):**
  - Dimensions: Generous aspect ratio (`aspect-[4/5]` or `h-[600px]`), centered inside a rounded-2xl dark stage.
  - Pedestal / Lighting Stage:
    - Dark textured rock / slate pedestal base under the hoodie.
    - Burnt-orange illuminated circular ring around the bottom base (`rgba(200, 90, 46, 0.4)` blur effect), creating dramatic atmospheric depth.
    - Floating shadow beneath the hoodie hem.
  - Interactive Controls:
    - **Fullscreen Lightbox trigger (`⤢`):** Located at bottom-right corner. Clicking opens the high-resolution lightbox with zoom capabilities.
    - Smooth touch-swipe navigation on mobile.

### 5.3 Product Purchase Information Panel (`ProductPurchasePanel.tsx`)
- **Status Badge:** Pill badge reading `New Launch` with burnt-orange background (`#C85A2E`), bold uppercase 10px tracking.
- **Product Title:** `Core Hoodie – Ivory` in bold editorial font (`font-montserrat font-bold text-2xl sm:text-3xl text-[#F4F0E8]`).
- **Tagline / Short Description:** "The signature VYOMIK hoodie. Minimal, bold, and built for everyday movement." in `#A8A29E`.
- **Pricing Group:**
  - Current Price: `₹2,499` in large bold font (`text-2xl text-[#F4F0E8]`).
  - Strikethrough Price: `₹2,999` in muted grey (`text-sm line-through text-[#716B63]`).
  - Discount Tag: `17% OFF` in a rounded burnt-rust chip (`bg-[#2A1810] text-[#C85A2E] text-xs font-bold px-2 py-0.5 border border-[#C85A2E]/30`).
- **Star Rating:**
  - 5 gold stars (`text-[#E5A93C]`), aggregate value `4.8`, review link `(124 Reviews)`. Clicking scrolls directly to the Reviews tab.
- **Divider:** Subtle 1px `#242321` line.
- **Color Selector:**
  - Label: `Color: Ivory` (dynamic based on active swatch).
  - 4 round swatches:
    - Swatch 1: Warm Ivory (`#F4F0E8`) — default active with double ring border.
    - Swatch 2: Charcoal / Pitch Black (`#1E1E1E`).
    - Swatch 3: Burnt Rust (`#A64B2A`).
    - Swatch 4: Washed Olive (`#4E5340`).
  - Switching color updates the selected state and navigates to the respective product or updates imagery.
- **Size Selector:**
  - Header: `Size:` on the left, `Size Chart` with ruler/chart icon on the right (triggering the modal).
  - 6 size chips: `XS`, `S`, `M` (default selected), `L`, `XL`, `XXL`.
  - Selected state: Burnt-orange background (`#C85A2E`), white bold text, shadow.
  - Inactive state: Dark surface (`#141414`), charcoal border (`#242321`), hover highlight.
- **Quantity Selector:**
  - Minus `[-]`, current quantity integer `[ 1 ]`, plus `[+]`.
  - Enforces min 1 and max 10.
- **Purchase Actions (Side by Side):**
  - **Add to Cart:**
    - Full-width / primary CTA in burnt orange (`#C85A2E` hover `#a64720`).
    - Includes shopping bag / cart icon + `Add to Cart` bold label.
    - Adds product with selected size and color to `CartContext` and triggers `openBag()`.
  - **Wishlist:**
    - Square/compact secondary button in dark surface (`#141414`) with border (`#242321`).
    - Heart icon (toggles filled burnt-orange when wishlisted).
    - Syncs to `localStorage` and triggers toast feedback.
- **Trust Indicators (3-Column Row):**
  - 1. Free Shipping (`Truck` icon): "Free Shipping / On orders above ₹1,499"
  - 2. Easy Returns (`Package` icon): "Easy Returns / 7-day hassle free returns"
  - 3. Secure Payment (`ShieldCheck` icon): "Secure Payment / 100% safe & encrypted"

### 5.4 Interactive Size Chart Modal (`SizeChartModal.tsx`)
- **Structure:**
  - Fixed full-screen backdrop overlay (`bg-black/80 backdrop-blur-sm`).
  - Centered modal container (`bg-[#141414] border border-[#242321] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative`).
- **Header:**
  - Title: `Size Chart` in warm ivory.
  - Unit toggle: Segmented control `[ in | cm ]`.
    - In reference: `cm` is highlighted in burnt orange (`#C85A2E`), `in` is dark.
    - Clicking toggles measurement units dynamically across the entire table!
  - Close button: `✕` icon button at top-right.
- **Measurements Table:**
  - Headers: `Size`, `Chest`, `Length`, `Shoulder`, `Sleeve`
  - Values Matrix:
    | Size | Chest (cm / in) | Length (cm / in) | Shoulder (cm / in) | Sleeve (cm / in) |
    |---|---|---|---|---|
    | **XS** | 96 cm / 37.8" | 64 cm / 25.2" | 44 cm / 17.3" | 58 cm / 22.8" |
    | **S** | 102 cm / 40.2" | 66 cm / 26.0" | 46 cm / 18.1" | 59 cm / 23.2" |
    | **M** | 108 cm / 42.5" | 68 cm / 26.8" | 48 cm / 18.9" | 60 cm / 23.6" |
    | **L** | 114 cm / 44.9" | 70 cm / 27.6" | 50 cm / 19.7" | 61 cm / 24.0" |
    | **XL** | 120 cm / 47.2" | 72 cm / 28.3" | 52 cm / 20.5" | 62 cm / 24.4" |
    | **XXL** | 126 cm / 49.6" | 74 cm / 29.1" | 54 cm / 21.3" | 63 cm / 24.8" |
- **Hoodie Illustration & How to Measure:**
  - Left: Clean vector SVG technical flat drawing of the hoodie with orange labeled measurement arrows:
    - Arrow 1: `Shoulder` (horizontal top seam)
    - Arrow 2: `Chest` (armpit to armpit)
    - Arrow 3: `Length` (high point shoulder to hem)
    - Arrow 4: `Sleeve` (shoulder seam to wrist)
  - Right: `How to Measure` checklist with orange checkmarks:
    - **Chest:** Measure around the fullest part of your chest.
    - **Length:** From highest point of shoulder to hem.
    - **Shoulder:** Across the back from one shoulder to another.
    - **Sleeve:** From shoulder seam to wrist.

### 5.5 Product Information Tabs (`ProductInfoTabs.tsx`)
- **Tab Navigation Bar:**
  - 4 horizontal tabs:
    1. `Product Details`
    2. `Fabric & Care`
    3. `Shipping & Returns`
    4. `Reviews (124)`
  - Active tab highlighted with bold warm ivory text and a thin burnt-orange bottom underline indicator (`border-b-2 border-[#C85A2E]`).
- **Tab 1: Product Details Content (Matching Reference Screenshot Exactly):**
  - Split 3-zone layout:
    - **Zone 1 (Description):**
      "The Core Hoodie is a wardrobe essential designed for comfort, versatility, and everyday expression. Crafted from premium cotton-blend fabric, it delivers a soft, structured feel with a modern, relaxed fit."
    - **Zone 2 (Key Features with Orange Checkmarks):**
      - [✓] Premium cotton blend (320 GSM)
      - [✓] Relaxed unisex fit
      - [✓] Ribbed cuffs and hem
      - [✓] VYOMIK signature logo detail
      - [✓] Everyday wear – all seasons
    - **Zone 3 (Fabric Macro Banner):**
      - Wide horizontal image banner showing the folded warm ivory cotton fabric with the authentic embroidered VYOMIK angular logo and wordmark.
- **Tab 2: Fabric & Care Content:**
  - Material: 80% Combed Cotton, 20% Polyester fleece for structural retention.
  - Care Instructions:
    - Machine wash cold (30°C) inside out with similar colors.
    - Do not bleach or use heavy enzymatic detergents.
    - Tumble dry low or flat dry in shade to preserve fit and print longevity.
    - Warm iron on reverse; do not iron directly over the back graphic or chest print.
- **Tab 3: Shipping & Returns Content:**
  - Shipping: Dispatched within 24–48 hours via Bluedart / Delhivery Express. Delivery in 3–5 business days across India. Free shipping on orders over ₹1,499.
  - Returns: 7-day hassle-free return and exchange policy from date of delivery. Items must be unworn with original tags attached.
- **Tab 4: Reviews Content:**
  - Rating summary: 4.8 / 5.0 rating breakdown bar (5★: 85%, 4★: 12%, 3★: 3%).
  - 3 authentic customer reviews with verified buyer badges, dates, sizing feedback ("True to size / perfect relaxed drape"), and star ratings.

### 5.6 "YOU MAY ALSO LIKE" Recommended Products (`YouMayAlsoLike.tsx`)
- **Heading:**
  - Centered or left-aligned `YOU MAY ALSO LIKE` with the signature VYOMIK burnt-orange brush underline accent.
- **5-Card Product Grid (Matching Reference Screenshot):**
  1. **Core Hoodie – Black:** ₹2,499 (Image: `/images/vyomik/products/element-hoodie-black.webp`)
  2. **Core Hoodie – Rust:** ₹2,499 (Image: `/images/vyomik/products/core-hoodie-rust.png`)
  3. **Element Tee – Black:** ₹1,299 (Image: `/images/vyomik/products/element-tee-black.webp`)
  4. **Terrain Cargos – Charcoal:** ₹2,299 (Image: `/images/vyomik/products/terrain-cargos-charcoal.webp`)
  5. **VYOMIK Cap – Sand:** ₹899 (Image: `/images/vyomik/products/vyomik-cap-sand.webp`)
- **Card Features:**
  - Individual high-resolution imagery.
  - Quick-action wishlist heart button at top-right.
  - Clean typography: Product title in `#F4F0E8` and price in `₹...`.
  - Clicking any card smoothly navigates to that product's detail page (`/product/:slug`) and scrolls window to top.

### 5.7 Fullscreen Image Lightbox Modal (`ProductLightbox.tsx`)
- Fullscreen modal triggered by the expand icon (`⤢`).
- Includes high-res image zoom, previous/next controls, and close button (`✕` or `Esc` key).

### 5.8 Mobile Responsive Experience & Sticky Bottom Bar
- **Desktop (>1024px):** 3-column layout (Gallery thumbs | Main Pedestal View | Purchase Panel).
- **Tablet (768px – 1023px):** 2-column layout (Combined gallery and main image on left, purchase panel on right).
- **Mobile (<768px):**
  - Full-width swipeable image carousel with indicator dots.
  - Collapsible accordion or drawer for size chart.
  - Sticky bottom purchase bar fixed to screen bottom: Displays product thumbnail, price `₹2,499`, and instant `Add to Bag` button, guaranteeing maximum conversion rate on handheld devices.

---

## 6. Asset Strategy & Generation Plan

To strictly follow the prompt constraint (**"Do not use the reference screenshot as a background, crop it into sections, or reuse portions of it as image assets"**), we will curate and generate standalone, high-resolution photographic and vector assets:

| Asset Name | Target File Path | Sourcing Strategy | Description |
|---|---|---|---|
| **Hoodie Front Hero on Pedestal** | `/images/vyomik/products/pdp/core-hoodie-ivory-front.jpg` | Sourced/Composited | Front angle of Ivory hoodie with realistic fabric folds and chest emblem |
| **Hoodie Back Graphic** | `/images/vyomik/products/pdp/core-hoodie-ivory-back.jpg` | Sourced/Composited | Back view displaying the sharp angular VYOMIK emblem |
| **Chest Emblem Detail** | `/images/vyomik/products/pdp/core-hoodie-ivory-detail.jpg` | Composited Macro | Macro close-up of chest logo printing/embroidery texture |
| **Macro Fabric Weave** | `/images/vyomik/products/pdp/core-hoodie-ivory-fabric.jpg` | Reuse existing high-res asset | Derived from existing `/images/vyomik/about/about-fabric-macro.jpg` |
| **Video Thumbnail Tile** | `/images/vyomik/products/pdp/core-hoodie-ivory-video.jpg` | Composed Asset | Lifestyle editorial model wearing hoodie with SVG glowing play icon overlay |
| **Hoodie Measurement Diagram** | Inline SVG in `SizeChartModal.tsx` | Clean Vector SVG | Vector line drawing of hoodie with annotated dimension arrows (Shoulder, Chest, Length, Sleeve) |
| **Folded Fabric Banner** | `/images/vyomik/products/pdp/core-hoodie-details-banner.jpg` | Existing Asset Reuse | Rich macro fabric fold banner with VYOMIK logo for Product Details tab |

---

## 7. Phased Implementation Roadmap

### Phase 1: Routing & Data Infrastructure
1. Create `frontend/src/pages/ProductDetailPage.tsx` and register routes in `frontend/src/App.tsx`:
   - `/product/:slug`
   - `/products/:slug`
   - `/shop/products/:slug`
   - `/shop/:category/:slug`
2. Update `frontend/src/components/home/HomeNavbar.tsx` so `isShopActive` is true on `/product/*` routes.
3. Build the `useProductDetail(slug)` custom hook:
   - Queries `http://localhost:8000/api/v1/products/{slug}`
   - Fallback to matching `SHOP_PRODUCTS` in `shopProducts.ts` if backend database is offline or endpoint 404s.

### Phase 2: Core 3-Column Product Section
1. Implement `ProductBreadcrumbs.tsx`:
   - Dynamic pathing `Home > Shop > [Category] > [Product Name]`.
2. Implement `ProductGallery.tsx`:
   - 5-thumbnail vertical strip with active burnt-orange border and keyboard accessibility.
3. Implement `ProductPedestalView.tsx`:
   - Central hero showcase with rocky pedestal styling and glowing orange base halo.
   - Expand lightbox button `⤢`.
4. Implement `ProductPurchasePanel.tsx`:
   - Badge `New Launch`, Title, Tagline, Price with strikethrough and `17% OFF` tag.
   - Star rating with direct jump to Reviews.
   - 4 color swatches with active outline.
   - 6 size chips (`XS`–`XXL`) with selected state.
   - Stepper quantity control (`- 1 +`).
   - `Add to Cart` (connected to `CartContext.addItem` & `openBag`) and `Wishlist` button.
   - Trust indicators with icons.

### Phase 3: Interactive Size Chart Modal & Lightbox
1. Implement `SizeChartModal.tsx`:
   - Modal container with backdrop blur and close button.
   - `[ in | cm ]` unit toggle with live unit conversion math.
   - 6-row measurement table (`XS` through `XXL`).
   - SVG vector flat drawing of hoodie with labeled measurement lines.
   - 4-point "How to Measure" checklist.
2. Implement `ProductLightbox.tsx`:
   - Fullscreen zoomable lightbox modal for inspecting fabric details.

### Phase 4: Product Information Tabs & Recommendations Grid
1. Implement `ProductInfoTabs.tsx`:
   - 4-tab bar (`Product Details`, `Fabric & Care`, `Shipping & Returns`, `Reviews (124)`).
   - Details panel: 3-zone layout with editorial description, 5 checkmarked features, and fabric fold banner.
   - Fabric & Care panel with washing guidelines and GSM specifications.
   - Shipping & Returns panel with dispatch times and exchange conditions.
   - Reviews panel with rating breakdown bar and verified buyer reviews.
2. Implement `YouMayAlsoLike.tsx`:
   - 5-item product card grid matching reference.
   - Hover zoom effect, wishlist button, and smooth route transitions.

### Phase 5: Mobile Optimizations, Testing & Verification
1. Implement mobile sticky bottom purchase bar.
2. Ensure touch swipe gestures on mobile thumbnail view.
3. Add automated test suite `frontend/src/test/ProductDetailPage.test.tsx`:
   - Test breadcrumbs rendering.
   - Test thumbnail selection and active state.
   - Test color swatch and size chip selection.
   - Test quantity stepper bounds.
   - Test Add to Cart invocation on `CartContext`.
   - Test Size Chart modal open/close and unit toggle calculation.
   - Test Tab navigation switching.
   - Test fallback to static catalog when backend is unavailable.
4. Verify complete build (`npm run build`) and run all test suites (`npm run test`).

---

## 8. Identified Gaps, Risks & Mitigation Strategies

| Area | Gap / Potential Risk | Mitigation / Solution |
|---|---|---|
| **Backend Database** | PostgreSQL may not be running locally on port 5432 during dev testing. | The hook `useProductDetail` will gracefully catch network/server errors and fall back to `SHOP_PRODUCTS` in `shopProducts.ts`. |
| **Reviews Model** | The backend currently has no `Review` database table or schema. | The PDP will render realistic reviews via a structured local configuration object while defining an extensible interface for future backend integration. |
| **Size Chart Model** | Sizing metrics are not in the current SQL schema. | Measurements matrix is managed cleanly in a dedicated `sizeChartData.ts` configuration supporting dynamic metric/imperial unit conversions. |
| **Image Asset Quality** | Low-res or cropped assets would break the premium streetwear luxury feel. | Create independent, dedicated high-resolution images matching the exact composition, without cropping the reference screenshot. |
| **Wishlist Persistence** | No backend wishlist table exists. | Utilize synchronized `localStorage` (`vyomik_wishlist`) with window event dispatching, matching the existing `ShopProductCard` behavior. |

---

## 9. Verification & Acceptance Criteria Checklist

- [ ] **Visual Hierarchy & Composition:** Desktop 3-column layout closely reproduces the reference screenshot proportions and spacing.
- [ ] **Brand Aesthetic:** Midnight black backgrounds, warm ivory typography, burnt-orange accents, and dark rocky pedestal with orange halo.
- [ ] **Navigation & Header:** Existing announcement bar and navbar reused, with `Shop` active state correctly highlighted.
- [ ] **Breadcrumbs:** `Home > Shop > Hoodies > Core Hoodie – Ivory` rendered with working links.
- [ ] **Thumbnails:** 5 vertical thumbnails (Front, Back, Logo, Fabric, Video) with active border and image switching.
- [ ] **Pedestal Showcase:** Large hoodie centered with rock pedestal, orange glow ring, and lightbox expand button.
- [ ] **Purchase Controls:**
  - [ ] `New Launch` badge
  - [ ] ₹2,499 price, ₹2,999 strikethrough, 17% OFF tag
  - [ ] 4 color swatches (Ivory, Charcoal, Rust, Washed Olive)
  - [ ] 6 size chips (`XS`–`XXL`) with selection state
  - [ ] Quantity stepper (`- 1 +`)
  - [ ] `Add to Cart` adds item to `CartContext` and triggers `openBag()`
  - [ ] `Wishlist` button toggles state and persists to `localStorage`
  - [ ] 3 trust indicator badges with icons
- [ ] **Interactive Size Chart:**
  - [ ] Opens via `Size Chart` button
  - [ ] `in` / `cm` unit toggle updates table numbers dynamically
  - [ ] Full table with XS–XXL rows and Chest, Length, Shoulder, Sleeve columns
  - [ ] Vector hoodie flat diagram with measurement labels
  - [ ] "How to Measure" checklist with orange checkmarks
- [ ] **Product Info Tabs:**
  - [ ] 4 tabs with active underline indicator
  - [ ] Product details features 5 checkmarks and fabric fold banner
  - [ ] Fabric & Care, Shipping & Returns, and Reviews render full content
- [ ] **"YOU MAY ALSO LIKE":**
  - [ ] 5 cards (Black Hoodie, Rust Hoodie, Element Tee, Terrain Cargos, VYOMIK Cap)
  - [ ] Card hover effects and navigation
- [ ] **Mobile & Responsive:**
  - [ ] Stacks cleanly on tablet and mobile
  - [ ] Sticky bottom purchase bar on mobile screens
- [ ] **Tests:** All Vitest unit tests pass without regressions.

---

> **Awaiting User Review & Explicit Approval Before Writing Implementation Code.**

