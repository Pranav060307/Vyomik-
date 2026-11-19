# VYOMIK — COLLECTIONS PAGE IMPLEMENTATION PLAN & DESIGN SPECIFICATION
## Phase 03: Architectural Blueprint & Visual Execution Roadmap

**DOCUMENT STATUS:** PLANNING ONLY — PENDING USER APPROVAL  
**AUTHOR:** Senior Frontend & Creative 3D Architect  
**DATE:** November 19, 2026  
**BRAND:** VYOMIK — Premium Minimalist Streetwear  

---

## 1. EXECUTIVE SUMMARY & OBJECTIVES

The objective of Phase 03 is to design, architect, and plan the official **Collections Page** for VYOMIK (`/collections`), faithfully recreating the luxury editorial streetwear showcase presented in the primary design specification reference screenshot.

### Primary Objectives
1. **1:1 Visual & Spatial Fidelity**: Recreate the cinematic floating garment exhibition, glowing orbital ring with collection labels, rugged illuminated rock foundation, and the iconic 4-card collection row.
2. **Signature Orange Neon Border Glow**: Precise engineering of the luminous burnt-rust perimeter glow on the featured `CORE ELEMENTS` card using layered CSS box-shadows and radial pseudo-element lighting.
3. **Independent Asset Architecture**: Zero cropping or extraction of elements from the reference screenshot. All garments, background terrain, and collection card portraits will be dedicated, photorealistic high-resolution assets.
4. **Strict Backend Preservation**: Frontend-only execution. Zero modifications to FastAPI endpoints, SQLAlchemy models, or SQLite/Postgres schemas. Deep reuse of existing routing, cart, and brand contexts.

---

## 2. EXISTING ARCHITECTURE & REUSABLE ASSETS FINDINGS

### 2.1 Routing Structure (`frontend/src/App.tsx`)
* `/`: Root Gate Route (`ComingSoon` when gate active, else `LandingPage`).
* `/home`: Main Ecommerce Homepage (10 sections).
* `/shop`: Comprehensive Shop All catalog page.
* `/collections`: Currently renders a legacy 3-card stage view (`CollectionsPage.tsx`).
* **Plan**: Replace `CollectionsPage.tsx` with the new production-quality Collections experience, and alias `/drops` or preserve query-parameter support (`/collections?col=core-elements`).

### 2.2 Reusable Component Inventory
| Component | Existing Location | Reuse Strategy |
|---|---|---|
| **AnnouncementBar** | `src/components/home/AnnouncementBar.tsx` | Reused directly at top of page (threshold message & controls). |
| **HomeNavbar** | `src/components/home/HomeNavbar.tsx` | Reused directly; update active underline logic to illuminate `Collections ˇ` when on `/collections`. |
| **HomeFooter** | `src/components/home/HomeFooter.tsx` | Reused directly at bottom with official links and copyright. |
| **BagDrawer** | `src/components/shop/BagDrawer.tsx` | Accessible on bag trigger via `useCart()`. |
| **SearchBar** | `src/components/shop/SearchBar.tsx` | Accessible via search icon trigger. |
| **ToastContext** | `src/context/ToastContext.tsx` | Used for interaction feedback. |

### 2.3 Existing 3D & Animation Libraries
* `three` (`^0.187.0`), `@react-three/fiber` (`^8.18.0`), and `@react-three/drei` (`^9.122.0`): Installed and actively utilized on the Coming Soon hero.
* `gsap` (`^3.15.1`) & `framer-motion` (`^14.14.0`): Available for timeline transitions, hover physics, and card entry stagger.

### 2.4 Existing Image Assets Available in Repository
* Central floating hoodie: `/assets/ivory-hoodie.png` and `/assets/vyomik-original-hoodie.png` (clean transparent cutout).
* Floating garments:
  * Rust T-shirt: `/assets/home/hoodie-rust.png` / `/assets/essential-hoodie.png`
  * Black graphic T-shirt: `/images/vyomik/products/element-tee-black.webp` / `/assets/vyomik-logo-tee.png`
  * Charcoal cargo trousers: `/images/vyomik/new-arrivals/cargos.webp`
* Terrain: `/assets/vyomik-rock-bg.jpg` (volcanic cinematic rock plate with warm rim lighting).
* Card portraits:
  * `CORE ELEMENTS`: `/images/vyomik/collections/core-essentials.webp` (model with sunglasses in ivory hoodie).
  * `URBAN TERRAIN`: `/images/vyomik/collections/urban-terrain.webp` (model facing mountain ridge).
  * `MONOCHROME EDIT`: `/images/vyomik/collections/monochrome-edit.webp` (moody model in black hoodie).
  * `ESSENTIALS`: `/images/vyomik/new-arrivals/accessories.webp` / textured fabric asset.

---

## 3. PAGE COMPONENT HIERARCHY

```
CollectionsPage.tsx (src/pages/CollectionsPage.tsx)
│
├── AnnouncementBar (src/components/home/AnnouncementBar.tsx) [REUSED]
├── HomeNavbar (src/components/home/HomeNavbar.tsx) [REUSED with active Collections indicator]
│
├── CollectionsHero.tsx (src/components/collections/CollectionsHero.tsx) [NEW]
│   ├── Left Column:
│   │   ├── Eyebrow: "COLLECTIONS"
│   │   ├── Main Title: "EXPLORE OUR DROPS" (Bold italic uppercase)
│   │   ├── Organic Burnt-Rust Brush Stroke SVG Underline
│   │   └── Editorial Description with vertical burnt-rust accent border
│   │
│   └── Right Column (Cinematic Exhibition):
│       ├── GarmentShowcaseExhibition.tsx (3D R3F Canvas or Layered Parallax Scene)
│       │   ├── Floating Central Ivory VYOMIK Hoodie
│       │   ├── Floating Left Rust T-Shirt (encased in perspective glass plane)
│       │   ├── Floating Upper-Right Black Graphic Tee (in perspective glass plane)
│       │   ├── Floating Far-Right Charcoal Cargos (in perspective glass plane)
│       │   ├── Glowing Illuminated Elliptical Base Pedestal Ring
│       │   └── Glowing Horizontal Orbital Ring with Collection Labels:
│       │       "| CORE ELEMENTS | URBAN TERRAIN | MONOCHROME EDIT | ESSENTIALS |"
│       └── RockyMountainLandscape (Bottom & side atmospheric rock foundation)
│
├── CollectionCardsGrid.tsx (src/components/collections/CollectionCardsGrid.tsx) [NEW]
│   ├── Card 1: CORE ELEMENTS (FEATURED with Signature Orange Neon Glow)
│   ├── Card 2: URBAN TERRAIN (Rugged. Functional. Versatile.)
│   ├── Card 3: MONOCHROME EDIT (Minimal tones. Maximum impact.)
│   └── Card 4: ESSENTIALS (Everyday fits. Elevated.)
│
├── CollectionsValuesStrip.tsx (src/components/collections/CollectionsValuesStrip.tsx) [NEW]
│   ├── Item 1: Premium Materials (Built for long-lasting wear)
│   ├── Item 2: Sustainable Approach (Thoughtful, responsible fashion)
│   ├── Item 3: Timeless Design (Style beyond seasons)
│   └── Item 4: New Drops Regularly (Fresh collections, all year round)
│
├── HomeFooter (src/components/home/HomeFooter.tsx) [REUSED]
├── BagDrawer [REUSED via CartContext]
└── SearchBar [REUSED via CartContext]
```

---

## 4. SECTION-BY-SECTION DETAILED SPECIFICATION

### Section A: Announcement Bar
* **Reused Component**: `src/components/home/AnnouncementBar.tsx`.
* **Visuals**: Burnt-Rust `#A64B2A` background, white/ivory text, dynamic shipping threshold (`₹1,499`), and carousel controls.

### Section B: Main Navigation
* **Reused Component**: `src/components/home/HomeNavbar.tsx`.
* **Active State**: Navigation link `Collections ˇ` receives the active Warm Ivory text color and a permanent 1.5px Burnt-Rust underline bar (`bg-[#A64B2A]`).

### Section C: Cinematic Collections Hero
* **Layout**: Full-width container (`min-h-[580px]` to `640px` on desktop) split into a typographic left column (col-span-5) and a spatial exhibition right column (col-span-7).
* **Left Editorial Content**:
  * Eyebrow: `COLLECTIONS` in 11px uppercase, tracking `[0.35em]`, text `#A64B2A` / `#D9D1C3`.
  * Headline:
    ```
    EXPLORE
    OUR DROPS
    ```
    Typeset in 64px–76px `font-black italic uppercase text-[#F4F0E8] leading-[0.95]`.
  * Underline Accent: Burnt-Rust organic brush stroke SVG positioned beneath "OUR DROPS".
  * Supporting Copy:
    `"Curated collections that bring together style, comfort, and purpose."`
    Rendered with a vertical accent bar on the left (`border-l-2 border-[#A64B2A] pl-4 text-[#716B63] text-sm md:text-base leading-relaxed`).
* **Right Spatial Garment Exhibition**:
  * **Central Hero Garment**: High-resolution cutout of the Warm Ivory VYOMIK hoodie, positioned centrally with gentle sinusoidal float (`translateY: ±8px, duration: 4s`).
  * **Flanking Garments in Glass Perspective Frames**:
    * Left: Burnt-Rust T-shirt tilted slightly inwards (`rotateY: 25deg, scale: 0.82`).
    * Upper Right: Black Graphic Tee tilted inwards (`rotateY: -22deg, scale: 0.85`).
    * Far Right: Charcoal tactical cargo trousers (`rotateY: -30deg, scale: 0.80`).
    * Each flanking item is encased in a translucent glass card with a subtle border (`border-white/10 bg-white/[0.02] backdrop-blur-[2px]`).
  * **Illuminated Pedestal Ring**:
    * An elliptical ring beneath the central hoodie glowing in vibrant amber/gold (`#F5B964` / `#A64B2A`), projecting soft ambient upward light onto the hoodie hem.
  * **Horizontal Orbital Collection Ring**:
    * An elliptical glowing glass ribbon circling horizontally around the garments.
    * Text embedded along the ring:
      `| CORE ELEMENTS | URBAN TERRAIN | MONOCHROME EDIT | ESSENTIALS |`
    * Styled with glowing top and bottom edges (`border-t border-b border-[#C85A2E]/70 shadow-[0_0_25px_rgba(200,90,46,0.35)]`), rotating slowly or smoothly positioned to guide the viewer.
* **Background Rocky Environment**:
  * Cinematic dark rock formations framing the lower third and sides of the hero section.
  * Volcanic rock ridges highlighted by warm orange rim light, seamlessly blending into `#0B0B0B` at the bottom edge.

---

## 5. SIGNATURE ORANGE NEON BORDER GLOW (DETAILED SPECIFICATION)

### Architecture of the Glow
In the reference screenshot, Card 1 (`CORE ELEMENTS`) possesses a signature luminous perimeter glow that looks like warm physical edge lighting rather than a flat neon line.

```css
/* Signature Glow Formula for Featured Card */
.collection-card-featured {
  position: relative;
  border-radius: 1.25rem; /* 20px */
  border: 1.5px solid rgba(200, 90, 46, 0.85); /* Burnt Rust primary edge */
  box-shadow: 
    0 0 15px rgba(200, 90, 46, 0.45),   /* Immediate edge brightness */
    0 0 35px rgba(200, 90, 46, 0.25),   /* Mid ambient spread */
    0 10px 40px rgba(0, 0, 0, 0.8),     /* Drop shadow for depth */
    inset 0 0 15px rgba(200, 90, 46, 0.15); /* Internal edge warmth */
  background: #141414;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Subtle ambient spill on bottom/outer edge */
.collection-card-featured::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 100%, rgba(200, 90, 46, 0.35), transparent 70%);
  pointer-events: none;
  z-index: 1;
}
```

### Hover State Physics:
1. `box-shadow` expands smoothly to `0 0 25px rgba(200, 90, 46, 0.65), 0 0 50px rgba(200, 90, 46, 0.35)`.
2. Card translates upward by `-4px` (`transform: translateY(-4px) scale(1.01)`).
3. Background photograph scales subtly by `1.04` with a 700ms ease-out transition.
4. Non-featured cards (Cards 2, 3, 4) have a restrained `border-white/10` by default and smoothly acquire an orange glow when hovered.

---

## 6. COLLECTION CARDS (4 LARGE CARDS IN A SINGLE ROW)

| Card | Title | Description | Visual Asset | Badge / Accent |
|---|---|---|---|---|
| **Card 1** | `CORE ELEMENTS` | *"The signature collection."* | Model in Warm Ivory hoodie with sunglasses, concrete brutalist setting | `FEATURED` badge + Signature Orange Glow |
| **Card 2** | `URBAN TERRAIN` | *"Rugged. Functional. Versatile."* | Model from behind in black hoodie against orange sunset mountain terrain | Circular arrow button `↗` |
| **Card 3** | `MONOCHROME EDIT` | *"Minimal tones. Maximum impact."* | Model wearing deep black hoodie with hood up, dark cinematic fashion setting | Circular arrow button `↗` |
| **Card 4** | `ESSENTIALS` | *"Everyday fits. Elevated."* | Macro textured ivory cotton fabric with embroidered black VYOMIK angular logo | Circular arrow button `↗` |

* **Layout**: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5` on desktop.
* **Card Height**: ~420px to 460px tall on desktop.
* **Navigation Action**: Clicking any card navigates to `/shop?cat=...` or opens the specific collection view with smooth state preservation.

---

## 7. BRAND VALUES STRIP SPECIFICATION

Positioned directly below the collection cards row:
* **Background**: `#0B0B0B` with subtle top and bottom borders (`border-[#242321]`).
* **Grid**: 4 horizontal columns on desktop (`grid-cols-2 lg:grid-cols-4 gap-6 py-10`).
* **Items**:
  1. **Premium Materials**: Layered square/fabric icon | Title: *Premium Materials* | Subtitle: *Built for long-lasting wear*
  2. **Sustainable Approach**: Stylized leaf line icon | Title: *Sustainable Approach* | Subtitle: *Thoughtful, responsible fashion*
  3. **Timeless Design**: Minimal infinity loop icon | Title: *Timeless Design* | Subtitle: *Style beyond seasons*
  4. **New Drops Regularly**: Lightning bolt line icon | Title: *New Drops Regularly* | Subtitle: *Fresh collections, all year round*
* **Typography**: Title in 14px bold Warm Ivory `#F4F0E8`, Subtitle in 12px Warm Grey `#716B63`.

---

## 8. INDEPENDENT IMAGE ASSETS REQUIREMENTS

| Asset Name | Target Destination | Subject Matter |
|---|---|---|
| `central-ivory-hoodie.png` | `public/images/vyomik/collections/hero-ivory-hoodie.png` | Isolated floating Warm Ivory VYOMIK hoodie with transparent background. |
| `hero-rust-tee.png` | `public/images/vyomik/collections/hero-rust-tee.png` | Isolated floating Burnt-Rust T-shirt. |
| `hero-black-graphic-tee.png` | `public/images/vyomik/collections/hero-black-graphic-tee.png` | Isolated floating Black graphic T-shirt with line-art print. |
| `hero-charcoal-cargos.png` | `public/images/vyomik/collections/hero-charcoal-cargos.png` | Isolated floating Charcoal tactical cargo trousers. |
| `cinematic-rocky-bg.jpg` | `public/images/vyomik/collections/cinematic-rock-terrain.jpg` | Volcanic black rock landscape with burnt-orange rim-lit ridges. |
| `col-core-elements.webp` | `public/images/vyomik/collections/col-core-elements.webp` | Model in ivory hoodie with sunglasses and brutalist architecture. |
| `col-urban-terrain.webp` | `public/images/vyomik/collections/col-urban-terrain.webp` | Model from rear in black hoodie looking at sunset mountains. |
| `col-monochrome-edit.webp` | `public/images/vyomik/collections/col-monochrome-edit.webp` | Model in hooded black sweatshirt in dark editorial lighting. |
| `col-essentials.webp` | `public/images/vyomik/collections/col-essentials.webp` | Textured Warm Ivory cotton weave with black VYOMIK angular logo. |

---

## 9. RESPONSIVE DESIGN & ADAPTIVE LAYOUT

* **Desktop (≥ 1024px)**:
  * Full 2-column cinematic hero with floating garments and glowing orbital ring.
  * 4 collection cards in a single horizontal row (`grid-cols-4`).
  * 4-column brand values strip.
* **Tablet (768px – 1023px)**:
  * Hero transitions to compact stacked composition with reduced garment spread.
  * Collection cards reflow to a 2×2 grid (`grid-cols-2`).
  * Brand values strip in 2×2 grid.
* **Mobile (< 768px)**:
  * Typographic hero with central floating hoodie and glowing pedestal.
  * Collection cards stacked vertically or presented as an overflow-safe horizontal snap-scroll track.
  * Verified zero horizontal page overflow (`scrollWidth <= window.innerWidth`).

---

## 10. FILE CREATION & MODIFICATION PLAN

### New Components to Create:
1. `frontend/src/components/collections/CollectionsHero.tsx`: Typography, brush stroke, floating garments, orbital ring, and rock foundation.
2. `frontend/src/components/collections/CollectionCardsGrid.tsx`: 4 large collection cards with signature orange glow on `CORE ELEMENTS`.
3. `frontend/src/components/collections/CollectionsValuesStrip.tsx`: 4 brand pillars strip.

### Files to Modify:
1. `frontend/src/pages/CollectionsPage.tsx`: Completely rebuild to assemble the above sections into the official Collections page.
2. `frontend/src/components/home/HomeNavbar.tsx`: Update active link logic so `Collections` shows the active underline when visiting `/collections`.
3. `frontend/src/test/CollectionsPage.test.tsx`: Write automated test suite verifying sections, links, and card interactions.

### Files Untouched:
* Zero backend modifications.
* Zero database schema changes.

---

## 11. TESTING & ACCEPTANCE CRITERIA

1. **Visual Match**:
   * Layout matches the reference screenshot (Hero typography, floating garment exhibition with orbital ring, 4 cards in a row with glowing featured card, 4-pillar strip, footer).
2. **Interaction Verification**:
   * Clicking `CORE ELEMENTS`, `URBAN TERRAIN`, `MONOCHROME EDIT`, or `ESSENTIALS` navigates to `/shop?cat=...`.
   * Featured card displays luminous burnt-orange perimeter glow by default.
   * Hovering on cards triggers smooth scale and elevated glow.
3. **Automated Vitest Suite**:
   * All existing 47 tests pass.
   * New `CollectionsPage.test.tsx` tests pass (100% green).
4. **Production Build**:
   * `npm run build` succeeds with zero TypeScript errors.

---

**END OF IMPLEMENTATION PLAN**  
*Awaiting explicit user review and approval before writing code.*
