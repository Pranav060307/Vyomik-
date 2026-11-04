# Qikink POD Custom API Integration Architecture

## Core Rules & Partner Constraints

### 1. Pre-Created Products & SKUs
- **We never send artwork through the API.**
- Products, variants, colors, and designs are created in the Qikink Dashboard under **My Products**.
- Qikink automatically generates one unique SKU per size and color.
- Every order sent to Qikink must reference these exact SKUs.
- A database constraint and API validation rule blocks any variant from being sellable in live mode if it lacks a pre-mapped SKU for the active environment.

### 2. Environment Isolation (Sandbox vs Live)
- Qikink maintains **completely separate databases, product catalogs, and SKUs** between Sandbox and Live.
- The `variant_qikink_skus` table enforces a composite unique constraint on `(variant_id, environment)`.
- The active environment is logged on every invocation.
- Default mode is `mock`, requiring zero network calls and enabling full local testing.

```
PostgreSQL: variant_qikink_skus
├── id
├── variant_id -> product_variants.id
├── environment ENUM ('sandbox', 'live')
└── qikink_sku VARCHAR(80)
    UNIQUE(variant_id, environment)
```

### 3. Public Order Number Limit (15 Characters Max)
- **Constraint**: Qikink's API rejects any `order_number` longer than **15 characters**.
- **Format**:
  `VY` (2 chars) + `YYMMDD` (6 chars) + `Random Crockford Base32` (5 chars) = **13 characters total**.
- Example: `VY261108A7K9M`
- **Enforcement**:
  1. Service Generator (`generate_public_order_number`) checks length.
  2. Pydantic validator (`QikinkCreateOrderRequest.order_number`) validates boundary.
  3. PostgreSQL Check Constraint `CheckConstraint('length(public_order_number) <= 15')`.
  4. Unit test suite verifies 1000 generated numbers remain within boundary.

### 4. Asynchronous Submission & Wallet Protection
- Fulfillment is never executed synchronously inside the user's checkout HTTP request.
- The order is created in PostgreSQL with `order_status='pending'` or `'confirmed'`.
- A background worker submits the order to Qikink with exponential backoff and idempotency.
- The worker monitors the Qikink prepaid wallet balance and alerts administrators if balance drops below `QIKINK_WALLET_MIN_THRESHOLD_PAISE`.

### 5. Returns & Reverse Pickups
- Reverse pickup requests dispatch directly back to Qikink's central warehouse.
- Returns are tracked via `qikink_reverse_ref` in the `returns` table.

