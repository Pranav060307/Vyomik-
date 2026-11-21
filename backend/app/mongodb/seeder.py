"""
MongoDB Seeder for VYOMIK Catalog with Real Qikink SKUs.
"""

import logging
from app.mongodb.models.product import (
    ProductDoc,
    ProductVariantDoc,
    QikinkSkuDoc,
    ProductImageDoc,
)

logger = logging.getLogger("vyomik.mongodb.seeder")

MONGODB_SEED_PRODUCTS = [
    {
        "slug": "unisex-oversized-classic-t-shirt-white",
        "name": "Unisex Oversized Classic T-Shirt — White",
        "category": "plain-tees",
        "base_price_paise": 79900,
        "description": "Architectural oversized silhouette in premium combed cotton with durable dropped shoulder and dense collar band. Direct integration with Qikink production line.",
        "fabric_specs": "240 GSM Combed Cotton · Bio-Washed · High Density Screenprint",
        "variants": [
            {
                "variant_id": "var_uo_wh_xs",
                "size": "XS",
                "color": "White",
                "color_hex": "#F4F3EE",
                "price_paise": 79900,
                "store_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HCc",
                "product_sku": "UOsMRnHs-Wh-XS",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HCc"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Wh-XS"},
                ],
            },
            {
                "variant_id": "var_uo_wh_s",
                "size": "S",
                "color": "White",
                "color_hex": "#F4F3EE",
                "price_paise": 79900,
                "store_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOZ",
                "product_sku": "UOsMRnHs-Wh-S",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOZ"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Wh-S"},
                ],
            },
            {
                "variant_id": "var_uo_wh_m",
                "size": "M",
                "color": "White",
                "color_hex": "#F4F3EE",
                "price_paise": 79900,
                "store_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOa",
                "product_sku": "UOsMRnHs-Wh-M",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOa"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Wh-M"},
                ],
            },
            {
                "variant_id": "var_uo_wh_l",
                "size": "L",
                "color": "White",
                "color_hex": "#F4F3EE",
                "price_paise": 79900,
                "store_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOb",
                "product_sku": "UOsMRnHs-Wh-L",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOb"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Wh-L"},
                ],
            },
            {
                "variant_id": "var_uo_wh_xl",
                "size": "XL",
                "color": "White",
                "color_hex": "#F4F3EE",
                "price_paise": 79900,
                "store_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOU",
                "product_sku": "UOsMRnHs-Wh-XL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOU"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Wh-XL"},
                ],
            },
            {
                "variant_id": "var_uo_wh_xxl",
                "size": "XXL",
                "color": "White",
                "color_hex": "#F4F3EE",
                "price_paise": 79900,
                "store_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOV",
                "product_sku": "UOsMRnHs-Wh-XXL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-9R6n0iSDaVZW1sMHNxYpubfWpQPb8HOV"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Wh-XXL"},
                ],
            },
        ],
    },
    {
        "slug": "essential-oversized-tee-black",
        "name": "Essential Oversized Tee — Pitch Black",
        "category": "plain-tees",
        "base_price_paise": 119900,
        "description": "Our signature oversized fit dyed in deep pitch black. Retains structure and saturation wash after wash.",
        "fabric_specs": "240 GSM 100% Combed Cotton · Reactive Dyed",
        "variants": [
            {
                "variant_id": "var_es_blk_s",
                "size": "S",
                "color": "Pitch Black",
                "color_hex": "#202020",
                "price_paise": 119900,
                "store_sku": "VY-PL-BLK-S",
                "product_sku": "VY-PL-BLK-S-SBX",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "VY-PL-BLK-S"},
                    {"environment": "sandbox", "qikink_sku": "VY-PL-BLK-S-SBX"},
                ],
            },
            {
                "variant_id": "var_es_blk_m",
                "size": "M",
                "color": "Pitch Black",
                "color_hex": "#202020",
                "price_paise": 119900,
                "store_sku": "VY-PL-BLK-M",
                "product_sku": "VY-PL-BLK-M-SBX",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "VY-PL-BLK-M"},
                    {"environment": "sandbox", "qikink_sku": "VY-PL-BLK-M-SBX"},
                ],
            },
            {
                "variant_id": "var_es_blk_l",
                "size": "L",
                "color": "Pitch Black",
                "color_hex": "#202020",
                "price_paise": 119900,
                "store_sku": "VY-PL-BLK-L",
                "product_sku": "VY-PL-BLK-L-SBX",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "VY-PL-BLK-L"},
                    {"environment": "sandbox", "qikink_sku": "VY-PL-BLK-L-SBX"},
                ],
            },
        ],
    },
    {
        "slug": "vyomik-wordmark-tee-ivory",
        "name": "VYOMIK Signature Wordmark Tee — Ivory",
        "category": "wordmark-tees",
        "base_price_paise": 139900,
        "description": "High-density matte plastisol print of the VYOMIK wordmark across the chest. Quiet branding for discerning wardrobes.",
        "fabric_specs": "240 GSM Combed Cotton · High Density Matte Screenprint",
        "variants": [
            {
                "variant_id": "var_wm_ivo_s",
                "size": "S",
                "color": "Warm Ivory",
                "color_hex": "#F4F3EE",
                "price_paise": 139900,
                "store_sku": "VY-WM-IVO-S",
                "product_sku": "VY-WM-IVO-S-SBX",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "VY-WM-IVO-S"},
                    {"environment": "sandbox", "qikink_sku": "VY-WM-IVO-S-SBX"},
                ],
            },
            {
                "variant_id": "var_wm_ivo_m",
                "size": "M",
                "color": "Warm Ivory",
                "color_hex": "#F4F3EE",
                "price_paise": 139900,
                "store_sku": "VY-WM-IVO-M",
                "product_sku": "VY-WM-IVO-M-SBX",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "VY-WM-IVO-M"},
                    {"environment": "sandbox", "qikink_sku": "VY-WM-IVO-M-SBX"},
                ],
            },
            {
                "variant_id": "var_wm_ivo_l",
                "size": "L",
                "color": "Warm Ivory",
                "color_hex": "#F4F3EE",
                "price_paise": 139900,
                "store_sku": "VY-WM-IVO-L",
                "product_sku": "VY-WM-IVO-L-SBX",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "VY-WM-IVO-L"},
                    {"environment": "sandbox", "qikink_sku": "VY-WM-IVO-L-SBX"},
                ],
            },
        ],
    },
]


async def seed_mongodb_products_if_empty() -> None:
    """Seeds products into MongoDB collection if empty."""
    count = await ProductDoc.count()
    if count > 0:
        logger.info(f"MongoDB already contains {count} products.")
        return

    logger.info("Seeding products into MongoDB 'products' collection...")
    for item in MONGODB_SEED_PRODUCTS:
        variants = [
            ProductVariantDoc(
                variant_id=v["variant_id"],
                size=v["size"],
                color=v["color"],
                color_hex=v.get("color_hex"),
                price_paise=v["price_paise"],
                in_stock=True,
                sku=v["store_sku"],
                store_sku=v["store_sku"],
                product_sku=v["product_sku"],
                qikink_skus=[QikinkSkuDoc(**q) for q in v.get("qikink_skus", [])],
            )
            for v in item["variants"]
        ]

        doc = ProductDoc(
            slug=item["slug"],
            name=item["name"],
            category=item["category"],
            base_price_paise=item["base_price_paise"],
            description=item.get("description", ""),
            fabric_specs=item.get("fabric_specs"),
            variants=variants,
            images=[],
            is_active=True,
            is_demo=False,
        )
        await doc.insert()

    logger.info("Successfully seeded products into MongoDB!")
