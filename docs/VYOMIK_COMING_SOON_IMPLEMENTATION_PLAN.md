# VYOMIK — Coming Soon Page: Complete Implementation Plan (v2.1.0)

---

## Document Control & Revision History

| Version | Date | Status | Revisions Included |
|:---|:---|:---|:---|
| 1.0.0 | 2026-11-14 | Superseded | Initial pre-development proposal. |
| 2.0.0 | 2026-11-14 | Superseded | Incorporated 2.5D/3D hoodie strategy and genuine Three.js geometry. |
| 2.1.0 | 2026-11-14 | **PENDING REVIEW** | **Final Plan Corrections**: <br>1. Strict single source of truth for countdown (`launch_at` from backend); removed all invented/dynamic future date fallbacks; added graceful expired/unavailable state reporting.<br>2. Logo rule: use actual supplied image asset (`/assets/logo.png`); removed all SVG polygon recreation.<br>3. Waitlist rule: exact hook reuse; never report success on backend submission failure.<br>4. Reaffirmed 100% backend protection and untouched code/config. |

---

## Executive Summary

This document is the definitive pre-development technical and design specification for building the VYOMIK Coming Soon page.

The design strictly reflects the approved reference screenshot:
1. **Visual & Brand Fidelity**: Authentic logo image asset (`/assets/logo.png`), exact brand palette (`#0B0B0B`, `#242321`, `#F4F0E8`, `#D9D1C3`, `#A64B2A`, `#716B63`), and heavy editorial typography.
2. **Product Presentation**: Oversized Warm-Ivory hoodie with VYOMIK chest branding presented via an illuminated 2.5D depth plane in Three.js world space, with a standardized upgrade path to a genuine GLB garment model.
3. **Genuine 3D Subsystem (Three.js / React Three Fiber)**: Real 3D geometry for the illuminated geometric V emblem, rugged stone pedestal, glowing elliptical ring, atmospheric embers/particles, and animated fabric-inspired ribbons.
4. **Authoritative Countdown**: Backend `launch_at` via `useStoreConfig` and `useLaunchGate` is the sole source of truth. Zero invented dates. Graceful status handling if expired or unconfigured.
5. **Strict Backend Protection**: Exact reuse of `useWaitlist()`, `useLaunchGate()`, `useStoreConfig()`, `useServerClock()`, and `useToast()`. No backend code or contracts will be modified.

**No application code, components, or configuration files have been modified. Coding will begin ONLY after explicit approval.**

---

## 1. Existing Project Inspection & Backend Protection

### 1.1 Architecture & Boundaries

```
D:\Vyomik-\
├── backend/                             # FastAPI Backend (100% READ-ONLY / UNTOUCHED)
│   ├── app/
│   │   ├── api/v1/endpoints/
│   │   │   ├── config.py                # GET /api/v1/config (launch_at, store_mode, gate_enabled)
│   │   │   ├── waitlist.py              # POST /api/v1/waitlist & /preregister
│   │   │   ├── preview.py               # POST /api/v1/preview/verify (?preview=<key>)
│   │   │   └── products.py, orders.py   # Catalog and orders
│   │   ├── core/                        # config.py, database.py, seeder.py
│   │   ├── models/                      # SQLAlchemy models
│   │   └── services/                    # waitlist_file.py
│   └── vyomik_dev.db                    # SQLite dev database
├── frontend/                            # React 18 + TypeScript + Vite SPA
│   ├── public/assets/                   # Real logo files (logo.png) & product assets
│   ├── src/
│   │   ├── pages/ComingSoon.tsx         # Page component to be implemented
│   │   ├── hooks/                       # useWaitlist, useLaunchGate, useStoreConfig, useServerClock
│   │   ├── context/                     # AuthContext, CartContext, ToastContext
│   │   ├── config/                      # brand.ts, colorPalette.ts
│   │   └── components/                  # Reusable UI component library
│   └── vite.config.ts                   # Dev server + waitlist dev middleware
```

### 1.2 Strict Hook & API Preservation

| Hook | Backend Endpoint | Behavior & Preservation Contract |
|:---|:---|:---|
| `useStoreConfig()` | `GET /api/v1/config` | **Untouched**. Single source of truth for `launch_at`, `gate_enabled`, `store_mode`, and server time. |
| `useLaunchGate()` | Composite | **Untouched**. Evaluates gate active status using true server time and team preview keys. |
| `useServerClock()` | Clock Offset Calculation | **Untouched**. Computes offset between client local clock and server UTC time. |
| `useWaitlist()` | `POST /api/v1/waitlist` | **Untouched**. Submits `{email, source}`. Retains existing hook logic. Never report success if submission fails. |
| `useToast()` | Client Context | **Untouched**. Standardized error and feedback notifications. |

---

## 2. Brand Identity & Logo Specification

### 2.1 Logo Image Asset Mandate
- **Source of Truth**: The actual supplied logo image asset located at `frontend/public/assets/logo.png` (and `logo-original.png`).
- **No SVG Recreation**: We will **not** recreate or approximate the logo using SVG polygon points or custom vector paths.
- **Proportions & Presentation**:
  - The image asset will be loaded directly with `object-fit: contain`.
  - The original symbol, wordmark, letterform spacing, and brand coloring are strictly preserved without alteration.
  - Sizing is managed cleanly via responsive height classes (`h-10 sm:h-12 md:h-14 lg:h-16 w-auto`).

### 2.2 Color Palette Reference

| Token Name | Hex Code | Visual Application |
|:---|:---|:---|
| **Midnight Black** | `#0B0B0B` | Viewport backdrop, canvas base. |
| **Charcoal** | `#242321` | Form backgrounds, card surfaces. |
| **Warm Ivory** | `#F4F0E8` | Primary display title (`COMING SOON`), hoodie garment color. |
| **Sand Beige** | `#D9D1C3` | Subtitles, pill borders, secondary labels. |
| **Burnt Rust** | `#A64B2A` | CTA button (`Notify Me →`), brush underline, glow ring, fabric ribbons. |
| **Warm Grey** | `#716B63` | Category tag (`STREETWEAR / ESSENTIALS`), placeholders, countdown units. |
| **Amber Glow** | `#C47A3A` | Emissive illumination on 3D V emblem rim and spotlights. |

---

## 3. Countdown Specification: Single Source of Truth

### 3.1 Authoritative Backend Source
- The backend's `launch_at` ISO string (retrieved via `GET /api/v1/config` through `useStoreConfig`) is the **sole source of truth**.
- **No Invented Dates**: We will **never** invent a launch date, hardcode future mock dates, or generate dynamic future offsets (such as adding arbitrary days/hours).

### 3.2 Handling Expired or Unavailable Launch Timestamps
When `useLaunchGate()` evaluates the launch target:
1. **Valid Future Date**: Countdown ticks down in real-time synchronized via `useServerClock()`.
2. **Expired Date (`launch_at <= server_time`)**:
   - The countdown cleanly presents an appropriate non-counting brand state: **"DOORS OPENING SOON" / "ARRIVING SOON"** (or `00 : 00 : 00 : 00`).
   - A clear diagnostic notice is logged: `console.warn("[VYOMIK Config] Backend launch_at is in the past. Update LAUNCH_AT in backend/.env")` to report the backend configuration issue without breaking page rendering.
3. **Backend Configuration Unavailable (Network Error / Offline / Missing `launch_at`)**:
   - **Strict Rule**: Do **not** use `DEFAULT_FALLBACK_CONFIG` to generate an artificial countdown.
   - Do **not** invent or assume a launch date.
   - Render the Coming Soon page normally and completely (header, hero copy, 3D experience, waitlist form, brand pillars).
   - Display a graceful countdown unavailable state (e.g., brand status badge: *"LAUNCH DATE ANNOUNCING SOON"* or placeholder dash state `— : — : — : —`).
   - Log the configuration/network issue explicitly: `console.warn("[VYOMIK Config] Backend configuration unavailable. Countdown suspended until server connects.")`.
   - Preserve all existing backend hooks (`useStoreConfig`, `useLaunchGate`, `useServerClock`) and their standard return signatures.

---

## 4. Waitlist Registration Integrity

### 4.1 Exact Hook Reuse
- The waitlist form directly calls `useWaitlist().mutate({ email, source: "coming_soon_gate" })`.
- No new submission endpoints or custom network wrappers will be introduced.

### 4.2 Error Handling & Feedback Rules
- **On Success**:
  - If backend reports `is_duplicate: true` or message contains "already": show *"You are already on the VIP list."*
  - If backend reports a new registration: show *"You're on the list! We'll email you 1 hour before doors open."*
  - Mark local session state as registered.
- **On Error / Failure**:
  - **Strict Rule**: **Never** show a successful registration message or pretend the email was saved when a backend request fails.
  - Display an explicit failure toast: *"Unable to join waitlist. Please check your connection and try again."*
  - Only read/write localStorage if the existing implementation already contains that specific fallback; never fake successful server persistence.

---

## 5. Product Presentation: Warm-Ivory Oversized Hoodie

### 5.1 Garment Visual Requirements
- **Color**: Warm Ivory (`#F4F0E8`), matching the approved reference screenshot.
- **Silhouette**: Boxy oversized cut, dropped shoulders, kangaroo pocket, ribbed cuffs and hem.
- **Branding**: Official VYOMIK emblem on the chest and left sleeve cuff.
- **Prohibition**: The crimson hoodie (`essential-hoodie.png`) will **never** be used as the final product visual.

### 5.2 2.5D Depth Plane vs Genuine 3D GLB Model

```
┌────────────────────────────────────────────────────────────────────────┐
│                        <HoodieDisplay /> Switch                        │
│                                                                        │
│   Check: Is a validated GLB asset available in brandConfig?           │
│                                                                        │
│   ├── YES  ──▶ [Tier B: Genuine 3D GLB Garment Model]                  │
│   │            - Real-time 360° interactive orbit / drag rotation      │
│   │            - PBR cloth shader with fabric roughness & sheen        │
│   │            - Dynamic vertex shadow casting                         │
│   │                                                                    │
│   └── NO   ──▶ [Tier A: 2.5D Depth Plane (Initial Production Build)]   │
│                - High-res transparent Warm-Ivory hoodie render         │
│                - Suspended PlaneGeometry in Three.js world space       │
│                - Lighting response matching scene amber spotlights     │
│                - Harmonic floating motion (Y-axis oscillation)         │
│                - Mouse-driven tilt parallax (±6° rotation)             │
│                - Procedural contact shadow cast on stone pedestal      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Genuine Three.js 3D Subsystem

The environmental elements in the right viewport are implemented using **real Three.js 3D geometry**, avoiding flat CSS decorations:

```
<Canvas (React Three Fiber)>
  ├── <PerspectiveCamera />           — FOV 42, Position [0, 1.2, 7.5], Lerp Parallax
  ├── <SceneLighting />               — Key amber spotlight, cool fill, warm rim
  ├── <VEmblem />                     — GENUINE 3D: Extruded chevron with neon edge emission
  ├── <StonePedestal />               — GENUINE 3D: Displaced rock geometry (Icosahedron + noise)
  ├── <GlowRing />                    — GENUINE 3D: TorusGeometry with amber/rust emission
  ├── <AtmosphericParticles />        — GENUINE 3D: 180 floating embers/dust points in world space
  ├── <FabricRibbons />               — GENUINE 3D: Catmull-Rom spline TubeGeometry with wave animation
  ├── <HoodieDisplay />               — Tier A (Depth Plane) / Tier B (GLB)
  └── <PostProcessing />              — Desktop-only selective bloom & vignette
</Canvas>
```

---

## 7. Responsive Layout & 3D Occlusion Safeguards

### 7.1 Non-Interference Guarantees
- **Z-Index Layering**:
  - Canvas container: `z-0` (`pointer-events: none` on wrapper).
  - Content column: `z-10`.
  - Form inputs, buttons, and navigation: `z-20` (`pointer-events: auto`).
- **Contrast & Readability**:
  - In tablet and mobile stacked layouts, a protective dark vignette (`rgba(11,11,11,0.85)`) separates the 3D scene from text elements to ensure strict WCAG AAA contrast.
- **Mobile Performance Scaling**:
  - On viewports `< 768px`: DPR clamped to `[1, 1.25]`, particle count reduced to 45, bloom disabled, ribbons simplified, and mouse parallax converted to subtle auto-float.

---

## 8. Implementation Phases

- **Phase 1: Foundations & Assets**: Confirm image asset paths (`logo.png`, warm-ivory hoodie render), configure Tailwind tokens.
- **Phase 2: Header & Content Layout**: Build `ComingSoonHeader` (using `logo.png`), typography hierarchy, and brand pillars.
- **Phase 3: Three.js Environment**: Build genuine 3D geometry (V emblem, pedestal, glow ring, ribbons, particles) and hoodie display.
- **Phase 4: Animations & Parallax**: Master GSAP entrance timeline, SVG brush stroke draw, and smooth cursor parallax.
- **Phase 5: Countdown & Waitlist Integration**: Connect `useLaunchGate()` countdown with authoritative backend synchronization; wire `useWaitlist()` with strict error handling.
- **Phase 6: Testing & Quality Audit**: Verify test suite, check browser rendering at 1920×1080 against the reference screenshot, and ensure zero backend regressions.

---

*Document version: 2.1.0*  
*Author: Antigravity Development Agent*  
*File Location: `D:\Vyomik-\docs\VYOMIK_COMING_SOON_IMPLEMENTATION_PLAN.md`*  
*Status: AWAITING USER APPROVAL ("PROCEED WITH VYOMIK COMING SOON PAGE.")*
