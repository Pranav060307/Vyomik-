"""
Catalog Seeder for Local Development and Initial Testing.
Populates products with variants and real Qikink Store & Product SKU mappings
under the 3 core categories:
1. Oversized (POD Graphic T-Shirts)
2. Sweatshirt (Heavyweight Boxy Crewnecks)
3. Hoodies (Architectural 450 GSM Oversized Hoodies)
"""

import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product, ProductVariant, VariantQikinkSku, QikinkEnvironment, ProductImage

logger = logging.getLogger("vyomik.seeder")

SEED_PRODUCTS = [
    # -------------------------------------------------------------
    # 1. Category: oversized
    # -------------------------------------------------------------
    {
        "slug": "unisex-oversized-classic-t-shirt-white",
        "name": "Unisex Oversized T-Shirt – Cyber Graphic White",
        "description": "Heavyweight architectural oversized t-shirt in crisp white with signature futuristic cyber graphic print. Tailored boxy drape that maintains structured drop shoulders all day.",
        "category": "oversized",
        "base_price": 79900,  # Rs. 799.00
        "image_url": "/images/vyomik/products/qikink-tee-cyber-white.png",
        "variants": [
            ("XS", "Cyber White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HCc", "UOsMRnHs-Wh-XS"),
            ("S", "Cyber White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOZ", "UOsMRnHs-Wh-S"),
            ("M", "Cyber White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOa", "UOsMRnHs-Wh-M"),
            ("L", "Cyber White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOb", "UOsMRnHs-Wh-L"),
            ("XL", "Cyber White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOU", "UOsMRnHs-Wh-XL"),
            ("XXL", "Cyber White", 79900, "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOV", "UOsMRnHs-Wh-XXL"),
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-sunset-black",
        "name": "Unisex Oversized T-Shirt – Sunset Graphic Black",
        "description": "Pitch black oversized silhouette featuring vivid burnt orange sunset graphic art on the back and subtle chest monogram. Deep reactive dye stays pitch black wash after wash.",
        "category": "oversized",
        "base_price": 79900,
        "image_url": "/images/vyomik/products/qikink-tee-sunset-black.png",
        "variants": [
            ("XS", "Pitch Black", 79900, "v-65082462-XS", "UOsMRnHs-Blk-XS"),
            ("S", "Pitch Black", 79900, "v-65082462-S", "UOsMRnHs-Blk-S"),
            ("M", "Pitch Black", 79900, "v-65082462-M", "UOsMRnHs-Blk-M"),
            ("L", "Pitch Black", 79900, "v-65082462-L", "UOsMRnHs-Blk-L"),
            ("XL", "Pitch Black", 79900, "v-65082462-XL", "UOsMRnHs-Blk-XL"),
            ("XXL", "Pitch Black", 79900, "v-65082462-XXL", "UOsMRnHs-Blk-XXL"),
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-emerald-green",
        "name": "Unisex Oversized T-Shirt – Emerald Typography Green",
        "description": "Earthy pine emerald oversized tee engineered with clean minimalist typography across the front and wide back line print. Relaxed fit with room to breathe.",
        "category": "oversized",
        "base_price": 89900,
        "image_url": "/images/vyomik/products/qikink-tee-emerald-green.png",
        "variants": [
            ("S", "Pine Emerald", 89900, "v-65082446-S", "UOsMRnHs-Grn-S"),
            ("M", "Pine Emerald", 89900, "v-65082446-M", "UOsMRnHs-Grn-M"),
            ("L", "Pine Emerald", 89900, "v-65082446-L", "UOsMRnHs-Grn-L"),
            ("XL", "Pine Emerald", 89900, "v-65082446-XL", "UOsMRnHs-Grn-XL"),
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-retro-maroon",
        "name": "Unisex Oversized T-Shirt – Retro Graphic Maroon",
        "description": "Deep wine burgundy oversized t-shirt featuring vintage editorial illustrations. Soft-hand feel with durable boxy silhouette tailored for Indian streetwear.",
        "category": "oversized",
        "base_price": 89900,
        "image_url": "/images/vyomik/products/qikink-tee-retro-maroon.png",
        "variants": [
            ("S", "Vintage Wine", 89900, "v-65080554-S", "UOsMRnHs-Mrn-S"),
            ("M", "Vintage Wine", 89900, "v-65080554-M", "UOsMRnHs-Mrn-M"),
            ("L", "Vintage Wine", 89900, "v-65080554-L", "UOsMRnHs-Mrn-L"),
            ("XL", "Vintage Wine", 89900, "v-65080554-XL", "UOsMRnHs-Mrn-XL"),
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-core-black",
        "name": "Unisex Oversized T-Shirt – Minimalist Core Black",
        "description": "The foundational black oversized streetwear tee. Minimalist chest emblem, heavy ribbed collar, and relaxed drop-shoulder cut.",
        "category": "oversized",
        "base_price": 79900,
        "image_url": "/images/vyomik/products/qikink-tee-core-black.png",
        "variants": [
            ("S", "Pitch Black", 79900, "v-65068402-S", "UOsMRnHs-CBlk-S"),
            ("M", "Pitch Black", 79900, "v-65068402-M", "UOsMRnHs-CBlk-M"),
            ("L", "Pitch Black", 79900, "v-65068402-L", "UOsMRnHs-CBlk-L"),
            ("XL", "Pitch Black", 79900, "v-65068402-XL", "UOsMRnHs-CBlk-XL"),
        ],
    },

    # -------------------------------------------------------------
    # 2. Category: sweatshirt
    # -------------------------------------------------------------
    {
        "slug": "heavyweight-oversized-sweatshirt-stone",
        "name": "Heavyweight Oversized Sweatshirt – Raw Stone",
        "description": "Heavyweight crewneck sweatshirt crafted from 380 GSM diagonal loopback French Terry in neutral raw stone. Perfectly balanced boxy silhouette.",
        "category": "sweatshirt",
        "base_price": 199900,
        "image_url": "/images/vyomik/products/sweatshirt-raw-stone.png",
        "variants": [
            ("S", "Raw Stone", 199900, "VYO-SWT-STN-S", "VYO-SWT-STN-S-SBX"),
            ("M", "Raw Stone", 199900, "VYO-SWT-STN-M", "VYO-SWT-STN-M-SBX"),
            ("L", "Raw Stone", 199900, "VYO-SWT-STN-L", "VYO-SWT-STN-L-SBX"),
            ("XL", "Raw Stone", 199900, "VYO-SWT-STN-XL", "VYO-SWT-STN-XL-SBX"),
        ],
    },
    {
        "slug": "signature-oversized-sweatshirt-black",
        "name": "Signature Oversized Sweatshirt – Pitch Black",
        "description": "Monochromatic luxury sweatshirt with dropped shoulder profile, dense collar ribbing, and tactile tonal embroidery.",
        "category": "sweatshirt",
        "base_price": 199900,
        "image_url": "/images/vyomik/products/sweatshirt-pitch-black.png",
        "variants": [
            ("S", "Pitch Black", 199900, "VYO-SWT-BLK-S", "VYO-SWT-BLK-S-SBX"),
            ("M", "Pitch Black", 199900, "VYO-SWT-BLK-M", "VYO-SWT-BLK-M-SBX"),
            ("L", "Pitch Black", 199900, "VYO-SWT-BLK-L", "VYO-SWT-BLK-L-SBX"),
            ("XL", "Pitch Black", 199900, "VYO-SWT-BLK-XL", "VYO-SWT-BLK-XL-SBX"),
        ],
    },
    {
        "slug": "boxy-vintage-sweatshirt-olive",
        "name": "Boxy Vintage Sweatshirt – Washed Olive",
        "description": "Vintage-washed boxy sweatshirt in muted tactical olive. Heavyweight 400 GSM fleece provides warmth without stiffness.",
        "category": "sweatshirt",
        "base_price": 219900,
        "image_url": "/images/vyomik/products/sweatshirt-washed-olive.png",
        "variants": [
            ("S", "Washed Olive", 219900, "VYO-SWT-OLV-S", "VYO-SWT-OLV-S-SBX"),
            ("M", "Washed Olive", 219900, "VYO-SWT-OLV-M", "VYO-SWT-OLV-M-SBX"),
            ("L", "Washed Olive", 219900, "VYO-SWT-OLV-L", "VYO-SWT-OLV-L-SBX"),
            ("XL", "Washed Olive", 219900, "VYO-SWT-OLV-XL", "VYO-SWT-OLV-XL-SBX"),
        ],
    },

    # -------------------------------------------------------------
    # 3. Category: hoodies
    # -------------------------------------------------------------
    {
        "slug": "core-hoodie-ivory",
        "name": "Core Heavyweight Hoodie – Warm Ivory",
        "description": "The defining VYOMIK silhouette. 450 GSM luxury French Terry, double-lined crossover hood that stays upright, and dropped shoulders.",
        "category": "hoodies",
        "base_price": 249900,
        "image_url": "/images/vyomik/products/hoodie-warm-ivory.png",
        "variants": [
            ("S", "Warm Ivory", 249900, "VYO-HOOD-IVR-S", "VYO-HOOD-IVR-S-SBX"),
            ("M", "Warm Ivory", 249900, "VYO-HOOD-IVR-M", "VYO-HOOD-IVR-M-SBX"),
            ("L", "Warm Ivory", 249900, "VYO-HOOD-IVR-L", "VYO-HOOD-IVR-L-SBX"),
            ("XL", "Warm Ivory", 249900, "VYO-HOOD-IVR-XL", "VYO-HOOD-IVR-XL-SBX"),
        ],
    },
    {
        "slug": "core-hoodie-black",
        "name": "Signature Boxy Hoodie – Midnight Black",
        "description": "Architectural streetwear hoodie in jet black. Built for cold studio nights and everyday movement with a boxy oversized drape.",
        "category": "hoodies",
        "base_price": 249900,
        "image_url": "/images/vyomik/products/hoodie-midnight-black.png",
        "variants": [
            ("S", "Midnight Black", 249900, "VYO-HOOD-BLK-S", "VYO-HOOD-BLK-S-SBX"),
            ("M", "Midnight Black", 249900, "VYO-HOOD-BLK-M", "VYO-HOOD-BLK-M-SBX"),
            ("L", "Midnight Black", 249900, "VYO-HOOD-BLK-L", "VYO-HOOD-BLK-L-SBX"),
            ("XL", "Midnight Black", 249900, "VYO-HOOD-BLK-XL", "VYO-HOOD-BLK-XL-SBX"),
        ],
    },
    {
        "slug": "core-hoodie-rust",
        "name": "Terracotta Drop Shoulder Hoodie – Burnt Rust",
        "description": "Earthy terracotta oversized hoodie dyed in rich burnt rust. Finished with durable dropped shoulder seams and structured collar contour.",
        "category": "hoodies",
        "base_price": 249900,
        "image_url": "/images/vyomik/products/hoodie-burnt-rust.png",
        "variants": [
            ("S", "Burnt Rust", 249900, "VYO-HOOD-RST-S", "VYO-HOOD-RST-S-SBX"),
            ("M", "Burnt Rust", 249900, "VYO-HOOD-RST-M", "VYO-HOOD-RST-M-SBX"),
            ("L", "Burnt Rust", 249900, "VYO-HOOD-RST-L", "VYO-HOOD-RST-L-SBX"),
            ("XL", "Burnt Rust", 249900, "VYO-HOOD-RST-XL", "VYO-HOOD-RST-XL-SBX"),
        ],
    },
]


async def seed_demo_products_if_empty(session: AsyncSession) -> None:
    """Inserts or updates products with real Qikink variant SKUs across all 3 categories."""
    valid_slugs = {item["slug"] for item in SEED_PRODUCTS}
    
    # Deactivate legacy products outside the 3 exclusive categories
    all_res = await session.execute(select(Product))
    for p in all_res.scalars().all():
        if p.slug not in valid_slugs:
            p.is_active = False

    for item in SEED_PRODUCTS:
        res = await session.execute(
            select(Product).where(Product.slug == item["slug"])
        )
        existing = res.scalars().first()

        if not existing:
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

            if item.get("image_url"):
                img = ProductImage(
                    product_id=p.id,
                    url=item["image_url"],
                    sort_order=0,
                )
                session.add(img)

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
        else:
            # Update fields
            existing.category = item["category"]
            existing.name = item["name"]
            existing.base_price = item["base_price"]
            existing.is_active = True

            # Sync primary image
            img_res = await session.execute(
                select(ProductImage).where(ProductImage.product_id == existing.id)
            )
            img = img_res.scalars().first()
            if not img and item.get("image_url"):
                session.add(
                    ProductImage(
                        product_id=existing.id,
                        url=item["image_url"],
                        sort_order=0,
                    )
                )
            elif img and item.get("image_url"):
                img.url = item["image_url"]

    await session.commit()
    logger.info("Synchronized 11 products with 3 exclusive categories and clean mockups in SQL database.")
