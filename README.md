# VYOMIK · Official E-Commerce Platform

> **"Room to be you."** — Architectural oversized essentials (plain tees, wordmark tees, heavyweight hoodies).  
> Launching publicly on **8 November 2026**.

This repository contains the official, production-grade e-commerce monorepo for **VYOMIK**, engineered with high performance, strict type safety, relational data integrity, and decoupled fulfillment/payment abstractions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, TanStack Query v5, React Router v6, Lucide Icons |
| **Backend** | Python 3.12+, FastAPI, SQLAlchemy 2.0 (Async + Sync), Alembic, Pydantic v2, httpx |
| **Database** | PostgreSQL 16 (Relational integrity, integer paise currency, strict constraints) |
| **Queue & Cache** | Redis 7 + Background Task Queue |
| **Testing** | Pytest + pytest-asyncio (Backend), Vitest + React Testing Library (Frontend) |
| **Containerization** | Docker, Docker Compose |

---

## Design System Tokens ("Warm Minimal")

Derived directly from brand guidelines:
- **Ivory (`#F4F3EE`)**: Main surface background
- **Charcoal (`#202020`)**: Primary text, sharp rectangular buttons, high-contrast badges
- **Olive (`#5C6548`)**: Accent badges, announcement bar, highlighted cards
- **Stone (`#DAD7CE`)**: 1px dividers, soft card backdrops
- **Typography**: Clean grotesque sans (Inter). Light weight VYOMIK wordmark with wide letter spacing (`0.28em`). Semi-bold hero headline with tight leading. Small uppercase tracked eyebrow labels (`0.22em`). Sharp rectangular buttons with zero corner rounding (`rounded-none`).

---

## Monorepo Layout

```
.
├── docker-compose.yml          # PostgreSQL 16, Redis 7, Backend, Frontend
├── .env.example                # Unified environment variables template
├── docs/
│   ├── architecture.md         # System design, data flows, and partner diagrams
│   └── qikink-integration.md   # Qikink POD Custom API architecture & SKU rules
├── frontend/                   # React 18 + Vite + Tailwind CSS SPA
│   ├── src/
│   │   ├── assets/demo/        # All demo SVGs & placeholders in ONE location
│   │   ├── components/
│   │   │   ├── landing/        # HeroSection, CategoryEditSection, WaitlistModal
│   │   │   ├── layout/         # AnnouncementBar, Header, Footer
│   │   │   └── shop/           # BagDrawer
│   │   ├── config/
│   │   │   └── demoContent.ts  # Central DEMO_CONTENT registry & seed catalog
│   │   ├── hooks/              # useStoreConfig, useWaitlist
│   │   ├── pages/              # LandingPage, CollectionsPage, OurStoryPage
│   │   └── types/              # Store contracts
│   └── src/test/               # Vitest component test suite
└── backend/                    # FastAPI + SQLAlchemy 2.0 Backend
    ├── app/
    │   ├── api/v1/endpoints/   # /health, /config, /waitlist, /products
    │   ├── core/               # config.py (pydantic-settings), database.py
    │   ├── integrations/
    │   │   ├── payment/        # PaymentProvider interface & MockPaymentProvider
    │   │   └── qikink/         # QikinkClient interface & MockQikinkClient
    │   ├── models/             # SQLAlchemy 2.0 ORM models (12 tables)
    │   ├── schemas/            # Pydantic v2 validation contracts
    │   └── services/           # order_number.py (<=15 chars), pricing.py (integer paise)
    ├── alembic/                # Database migrations (0001_initial_schema.py)
    └── tests/                  # Pytest test suite (25 tests covering all domains)
```

---

## Quickstart (Local Development)

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+ (or Docker & Docker Compose)

### 1. Run with Docker Compose (Recommended)
```bash
# Clone and enter repo
cd "Final Vyomik"

# Create .env from template
cp .env.example .env

# Build and start all services
docker-compose up --build
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
- API Health Check: [http://localhost:8000/health](http://localhost:8000/health)

### 2. Run Manually (Local Dev Mode)

**Backend Setup:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start API server
uvicorn app.main:app --reload --port 8000
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

---

## Test Verification

### Backend Tests (Pytest)
```bash
cd backend
.venv/Scripts/pytest -v
```
*Executes 25 comprehensive tests covering:*
- Pricing engine & paise arithmetic
- Order number generation boundary (<= 15 characters, `VY` prefix)
- Payment provider abstraction contract & simulated states
- Qikink mock client (SKU validation, environment isolation, wallet alerts, returns)
- Waitlist idempotent signup & config endpoints

### Frontend Tests (Vitest)
```bash
cd frontend
npm test
```
*Validates:*
- All 5 Landing Page core sections and typography
- Color chip toggle switching active model photos between Ivory and Black
- Expanding and collapsing the inline "Coming soon" category drawer
- Waitlist modal submission and confirmation states

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `STORE_MODE` | Store shopping flag: `"coming_soon"` or `"live"` | `coming_soon` |
| `LAUNCH_AT` | Launch timestamp ISO 8601 with timezone (confirm with CEO) | `2026-11-08T00:00:00+05:30` |
| `LAUNCH_GATE_ENABLED` | Manual kill switch for pre-launch Coming Soon gate (`true`/`false`) | `true` |
| `PREVIEW_KEY` | Secret key for team preview bypass via `/?preview=<key>` | `vyomik_team_preview_2026` |
| `PAYMENT_PROVIDER` | Decoupled payment adapter: `"mock"`, `"razorpay"`, `"cashfree"` | `mock` |
| `QIKINK_MODE` | Qikink environment: `"mock"`, `"sandbox"`, `"live"` | `mock` |
| `DATABASE_URL` | Async database connection URI | `postgresql+asyncpg://...` (or local SQLite) |
| `FREE_SHIPPING_THRESHOLD_PAISE` | Free shipping minimum (in Paise: 149900 = ₹1,499) | `149900` |
| `DEFAULT_SHIPPING_FEE_PAISE` | Flat shipping fee (in Paise: 9900 = ₹99) | `9900` |
| `COD_AVAILABLE` | Enable or disable Cash on Delivery | `true` |
| `COD_FEE_PAISE` | COD handling fee (in Paise: 4900 = ₹49) | `4900` |

> **IMPORTANT: Independence of `STORE_MODE` and the Launch Gate:**  
> Reaching the `LAUNCH_AT` timestamp automatically lifts the full-screen Coming Soon gate at `/`, so visitors see the full storefront without needing a redeploy. However, **`STORE_MODE` stays independent**: product purchases and cart checkout remain disabled in `coming_soon` mode until explicitly toggled to `STORE_MODE=live` when the operations and warehouse team is fully ready to accept customer orders.

---

## "Before Going Live" Checklist

Before launching on **8 November 2026**, execute the following steps:

1. [ ] **Replace Demo Media & Catalog Seeds:**
   - Drop final campaign photography into `frontend/src/assets/brand/`
   - Update `frontend/src/config/demoContent.ts` with production product copy, specs, and URLs
   - Toggle `DEMO_CONTENT = false` in `demoContent.ts`
2. [ ] **Finalize Payment Gateway:**
   - Implement the real provider adapter under `backend/app/integrations/payment/<provider>.py` implementing `PaymentProvider`
   - Set `PAYMENT_PROVIDER=razorpay` (or chosen gateway) and add live gateway keys to `.env`
3. [ ] **Verify Qikink Custom API Access & SKUs:**
   - Confirm official Qikink docs against `backend/app/integrations/qikink/constants.py` (marked with `TODO(verify against Qikink docs)`)
   - Pre-create products and variants in Qikink Dashboard under *My Products*
   - Seed `variant_qikink_skus` in PostgreSQL for the `live` environment
   - Fund the Qikink prepaid fulfillment wallet (minimum 1–2 days order volume)
   - Set `QIKINK_MODE=live` with verified `QIKINK_CLIENT_ID` and `QIKINK_API_KEY`
4. [ ] **Switch Store Mode to Live:**
   - Update `.env`: `STORE_MODE=live`
   - Re-deploy to enable public shopping cart and instant order creation.

