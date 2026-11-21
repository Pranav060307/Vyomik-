"""
Catalog Seeder for Local Development and Initial Testing.
Populates products with variants and real Qikink Store & Product SKU mappings.
"""

import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product, ProductVariant, VariantQikinkSku, QikinkEnvironment

logger = logging.getLogger("vyomik.seeder")

SEED_PRODUCTS = [
    {
        "slug": "unisex-oversized-classic-t-shirt-white",
        "name": "Unisex Oversized Classic T-Shirt — White",
        "description": "Architectural oversized silhouette in premium combed cotton with durable dropped shoulder and dense collar band. Direct integration with Qikink production line.",
        "category": "plain-tees",
        "base_price": 79900,  # Rs. 799.00
        "variants": [
            ("XS", "White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HCc", "UOsMRnHs-Wh-XS"),
            ("S", "White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOZ", "UOsMRnHs-Wh-S"),
            ("M", "White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOa", "UOsMRnHs-Wh-M"),
            ("L", "White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOb", "UOsMRnHs-Wh-L"),
            ("XL", "White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOU", "UOsMRnHs-Wh-XL"),
            ("XXL", "White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOV", "UOsMRnHs-Wh-XXL"),
        ],
    },
    {
        "slug": "essential-oversized-tee-black",
        "name": "Essential Oversized Tee — Pitch Black",
        "description": "Our signature oversized fit dyed in deep pitch black. Retains structure and saturation wash after wash.",
        "category": "plain-tees",
        "base_price": 119900,
        "variants": [
            ("S", "Pitch Black", 119900, "VY-PL-BLK-S", "VY-PL-BLK-S-SBX"),
            ("M", "Pitch Black", 119900, "VY-PL-BLK-M", "VY-PL-BLK-M-SBX"),
            ("L", "Pitch Black", 119900, "VY-PL-BLK-L", "VY-PL-BLK-L-SBX"),
            ("XL", "Pitch Black", 119900, "VY-PL-BLK-XL", "VY-PL-BLK-XL-SBX"),
        ],
    },
    {
        "slug": "essential-oversized-tee-olive",
        "name": "Essential Oversized Tee — Washed Olive",
        "description": "A custom olive pigment wash designed to pair effortlessly with ecru denim or charcoal trousers.",
        "category": "plain-tees",
        "base_price": 124900,
        "variants": [
            ("M", "Washed Olive", 124900, "VY-PL-OLV-M", "VY-PL-OLV-M-SBX"),
            ("L", "Washed Olive", 124900, "VY-PL-OLV-L", "VY-PL-OLV-L-SBX"),
        ],
    },
    {
        "slug": "vyomik-wordmark-tee-ivory",
        "name": "VYOMIK Signature Wordmark Tee — Ivory",
        "description": "High-density matte plastisol print of the VYOMIK wordmark across the chest. Quiet branding for discerning wardrobes.",
        "category": "wordmark-tees",
        "base_price": 139900,
        "variants": [
            ("S", "Ivory", 139900, "VY-WM-IVO-S", "VY-WM-IVO-S-SBX"),
            ("M", "Ivory", 139900, "VY-WM-IVO-M", "VY-WM-IVO-M-SBX"),
            ("L", "Ivory", 139900, "VY-WM-IVO-L", "VY-WM-IVO-L-SBX"),
        ],
    },
    {
        "slug": "vyomik-wordmark-tee-black",
        "name": "VYOMIK Signature Wordmark Tee — Black",
        "description": "Charcoal base fabric contrasted with warm ivory micro-tracked wordmark.",
        "category": "wordmark-tees",
        "base_price": 139900,
        "variants": [
            ("M", "Pitch Black", 139900, "VY-WM-BLK-M", "VY-WM-BLK-M-SBX"),
            ("L", "Pitch Black", 139900, "VY-WM-BLK-L", "VY-WM-BLK-L-SBX"),
        ],
    },
    {
        "slug": "heavyweight-hoodie-stone",
        "name": "Heavyweight Relaxed Hoodie — Raw Stone",
        "description": "Constructed from loopback French terry with heavy ribbed hem and cuff bindings. No drawstrings for a pure, distraction-free neckline.",
        "category": "hoodies",
        "base_price": 279900,
        "variants": [
            ("S", "Raw Stone", 279900, "VY-HD-STN-S", "VY-HD-STN-S-SBX"),
            ("M", "Raw Stone", 279900, "VY-HD-STN-M", "VY-HD-STN-M-SBX"),
            ("L", "Raw Stone", 279900, "VY-HD-STN-L", "VY-HD-STN-L-SBX"),
        ],
    },
    {
        "slug": "heavyweight-hoodie-olive",
        "name": "Heavyweight Relaxed Hoodie — Washed Olive",
        "description": "Rich olive French terry with substantial weight and drape. Kangaroo pouch pocket reinforced with bartacks.",
        "category": "hoodies",
        "base_price": 279900,
        "variants": [
            ("M", "Washed Olive", 279900, "VY-HD-OLV-M", "VY-HD-OLV-M-SBX"),
            ("L", "Washed Olive", 279900, "VY-HD-OLV-L", "VY-HD-OLV-L-SBX"),
        ],
    },
    {
        "slug": "heavyweight-hoodie-black",
        "name": "Heavyweight Relaxed Hoodie — Pitch Black",
        "description": "Maximum warmth, clean dropped-shoulder drape, engineered without cords for a modern, uncluttered look.",
        "category": "hoodies",
        "base_price": 279900,
        "variants": [
            ("S", "Pitch Black", 279900, "VY-HD-BLK-S", "VY-HD-BLK-S-SBX"),
            ("M", "Pitch Black", 279900, "VY-HD-BLK-M", "VY-HD-BLK-M-SBX"),
            ("L", "Pitch Black", 279900, "VY-HD-BLK-L", "VY-HD-BLK-L-SBX"),
        ],
    },
]


async def seed_demo_products_if_empty(session: AsyncSession) -> None:
    """Inserts or updates products with real Qikink variant SKUs."""
    # Check if the Unisex Oversized Classic T-Shirt exists
    res = await session.execute(
        select(Product).where(Product.slug == "unisex-oversized-classic-t-shirt-white")
    )
    existing_qikink_product = res.scalars().first()

    if not existing_qikink_product:
        logger.info("Adding Unisex Oversized Classic T-Shirt with active Qikink SKUs...")
        item = SEED_PRODUCTS[0]
        p = Product(
            slug=item["slug"],
            name=item["name"],
            description=item["description"],
            category=item["category"],
            base_price=item["base_price"],
            is_active=True,
            is_demo=False,
        )
        session.add(p)
        await session.flush()

        for size, color, price, live_sku, sandbox_sku in item["variants"]:
            v = ProductVariant(
                product_id=p.id,
                size=size,
                color=color,
                price=price,
                is_active=True,
            )
            session.add(v)
            await session.flush()

            # Map Qikink SKU for sandbox & live
            q_sku_sandbox = VariantQikinkSku(
                variant_id=v.id,
                environment=QikinkEnvironment.SANDBOX,
                qikink_sku=sandbox_sku,
            )
            q_sku_live = VariantQikinkSku(
                variant_id=v.id,
                environment=QikinkEnvironment.LIVE,
                qikink_sku=live_sku,
            )
            session.add_all([q_sku_sandbox, q_sku_live])

        await session.commit()
        logger.info("Unisex Oversized Classic T-Shirt with 6 sizes seeded successfully.")
