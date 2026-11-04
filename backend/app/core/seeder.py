"""
Catalog Seeder for Local Development and Initial Testing.
Populates 8 demo products with variants and Qikink SKU mappings if database is empty.
"""

import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product, ProductVariant, VariantQikinkSku, ProductImage, QikinkEnvironment

logger = logging.getLogger("vyomik.seeder")

DEMO_SEED_DATA = [
    {
        "slug": "essential-oversized-tee-ivory",
        "name": "Essential Oversized Plain Tee",
        "description": "Designed with a dropped shoulder, dense ribbed neckband, and a roomy silhouette that drapes without sagging. A foundation piece for everyday presence.",
        "category": "plain-tees",
        "base_price": 119900,
        "variants": [
            ("S", "Ivory", 119900, "VY-PL-IVO-S"),
            ("M", "Ivory", 119900, "VY-PL-IVO-M"),
            ("L", "Ivory", 119900, "VY-PL-IVO-L"),
            ("XL", "Ivory", 119900, "VY-PL-IVO-XL"),
        ],
    },
    {
        "slug": "essential-oversized-tee-black",
        "name": "Essential Oversized Tee — Pitch Black",
        "description": "Our signature oversized fit dyed in deep pitch black. Retains structure and saturation wash after wash.",
        "category": "plain-tees",
        "base_price": 119900,
        "variants": [
            ("S", "Pitch Black", 119900, "VY-PL-BLK-S"),
            ("M", "Pitch Black", 119900, "VY-PL-BLK-M"),
            ("L", "Pitch Black", 119900, "VY-PL-BLK-L"),
        ],
    },
    {
        "slug": "essential-oversized-tee-olive",
        "name": "Essential Oversized Tee — Washed Olive",
        "description": "A custom olive pigment wash designed to pair effortlessly with ecru denim or charcoal trousers.",
        "category": "plain-tees",
        "base_price": 124900,
        "variants": [
            ("M", "Washed Olive", 124900, "VY-PL-OLV-M"),
            ("L", "Washed Olive", 124900, "VY-PL-OLV-L"),
        ],
    },
    {
        "slug": "vyomik-wordmark-tee-ivory",
        "name": "VYOMIK Signature Wordmark Tee — Ivory",
        "description": "High-density matte plastisol print of the VYOMIK wordmark across the chest. Quiet branding for discerning wardrobes.",
        "category": "wordmark-tees",
        "base_price": 139900,
        "variants": [
            ("S", "Ivory", 139900, "VY-WM-IVO-S"),
            ("M", "Ivory", 139900, "VY-WM-IVO-M"),
            ("L", "Ivory", 139900, "VY-WM-IVO-L"),
        ],
    },
    {
        "slug": "vyomik-wordmark-tee-black",
        "name": "VYOMIK Signature Wordmark Tee — Black",
        "description": "Charcoal base fabric contrasted with warm ivory micro-tracked wordmark.",
        "category": "wordmark-tees",
        "base_price": 139900,
        "variants": [
            ("M", "Pitch Black", 139900, "VY-WM-BLK-M"),
            ("L", "Pitch Black", 139900, "VY-WM-BLK-L"),
        ],
    },
    {
        "slug": "heavyweight-hoodie-stone",
        "name": "Heavyweight Relaxed Hoodie — Raw Stone",
        "description": "Constructed from loopback French terry with heavy ribbed hem and cuff bindings. No drawstrings for a pure, distraction-free neckline.",
        "category": "hoodies",
        "base_price": 279900,
        "variants": [
            ("S", "Raw Stone", 279900, "VY-HD-STN-S"),
            ("M", "Raw Stone", 279900, "VY-HD-STN-M"),
            ("L", "Raw Stone", 279900, "VY-HD-STN-L"),
        ],
    },
    {
        "slug": "heavyweight-hoodie-olive",
        "name": "Heavyweight Relaxed Hoodie — Washed Olive",
        "description": "Rich olive French terry with substantial weight and drape. Kangaroo pouch pocket reinforced with bartacks.",
        "category": "hoodies",
        "base_price": 279900,
        "variants": [
            ("M", "Washed Olive", 279900, "VY-HD-OLV-M"),
            ("L", "Washed Olive", 279900, "VY-HD-OLV-L"),
        ],
    },
    {
        "slug": "heavyweight-hoodie-black",
        "name": "Heavyweight Relaxed Hoodie — Pitch Black",
        "description": "Maximum warmth, clean dropped-shoulder drape, engineered without cords for a modern, uncluttered look.",
        "category": "hoodies",
        "base_price": 279900,
        "variants": [
            ("S", "Pitch Black", 279900, "VY-HD-BLK-S"),
            ("M", "Pitch Black", 279900, "VY-HD-BLK-M"),
            ("L", "Pitch Black", 279900, "VY-HD-BLK-L"),
        ],
    },
]


async def seed_demo_products_if_empty(session: AsyncSession) -> None:
    """Inserts demo products if products table is currently empty."""
    res = await session.execute(select(Product))
    existing = res.scalars().first()
    if existing:
        return

    logger.info("Seeding 8 demo products into catalog...")
    for item in DEMO_SEED_DATA:
        p = Product(
            slug=item["slug"],
            name=item["name"],
            description=item["description"],
            category=item["category"],
            base_price=item["base_price"],
            is_active=True,
            is_demo=True,
        )
        session.add(p)
        await session.flush()

        for size, color, price, sku in item["variants"]:
            v = ProductVariant(
                product_id=p.id,
                size=size,
                color=color,
                price=price,
                is_active=True,
            )
            session.add(v)
            await session.flush()

            # Map mock Qikink SKU for sandbox & live
            q_sku_sandbox = VariantQikinkSku(
                variant_id=v.id,
                environment=QikinkEnvironment.SANDBOX,
                qikink_sku=f"{sku}-SBX",
            )
            q_sku_live = VariantQikinkSku(
                variant_id=v.id,
                environment=QikinkEnvironment.LIVE,
                qikink_sku=sku,
            )
            session.add_all([q_sku_sandbox, q_sku_live])

    await session.commit()
    logger.info("Demo products, variants, and Qikink SKU mappings seeded successfully.")

