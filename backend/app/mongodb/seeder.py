"""
MongoDB Seeder for VYOMIK Catalog with Real Qikink SKUs & 3 Exclusive Categories:
1. Oversized (POD Graphic T-Shirts)
2. Sweatshirt (Heavyweight Boxy Crewnecks)
3. Hoodies (Architectural 450 GSM Oversized Hoodies)
"""

import logging
from datetime import datetime, timezone, timedelta
from app.mongodb.models.product import (
    ProductDoc,
    ProductVariantDoc,
    QikinkSkuDoc,
    ProductImageDoc,
)
from app.mongodb.models.discount import DiscountDoc
from app.mongodb.models.review import ReviewDoc
from app.mongodb.models.customer import CustomerDoc
from app.mongodb.models.order import (
    OrderDoc,
    ShippingAddressDoc,
    OrderItemDoc,
    PricingDoc,
    PaymentDoc,
    FulfillmentDoc,
)

logger = logging.getLogger("vyomik.mongodb.seeder")

MONGODB_SEED_PRODUCTS = [
    # -------------------------------------------------------------
    # Category 1: Oversized (Real Qikink Graphic Drop Shoulders)
    # -------------------------------------------------------------
    {
        "slug": "unisex-oversized-classic-t-shirt-white",
        "name": "Unisex Oversized T-Shirt – Cyber Graphic White",
        "category": "oversized",
        "base_price_paise": 79900,
        "description": "Heavyweight architectural oversized t-shirt in crisp white with signature futuristic cyber graphic print. Tailored boxy drape that maintains structured drop shoulders all day.",
        "fabric_specs": "240 GSM 100% Combed Cotton · High-Density Plastisol Print · Bio-Washed",
        "images": [
            {"url": "/images/vyomik/products/qikink-tee-cyber-white.png", "sort_order": 0, "color": "Cyber White", "is_primary": True},
            {"url": "/images/vyomik/products/qikink-tee-cyber-black.png", "sort_order": 1, "color": "Pitch Black"},
            {"url": "/assets/rack-tees.png", "sort_order": 2},
        ],
        "variants": [
            {
                "variant_id": "var_uo_wh_xs",
                "size": "XS",
                "color": "Cyber White",
                "color_hex": "#F4F0E8",
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
                "color": "Cyber White",
                "color_hex": "#F4F0E8",
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
                "color": "Cyber White",
                "color_hex": "#F4F0E8",
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
                "color": "Cyber White",
                "color_hex": "#F4F0E8",
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
                "color": "Cyber White",
                "color_hex": "#F4F0E8",
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
                "color": "Cyber White",
                "color_hex": "#F4F0E8",
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
        "slug": "unisex-oversized-t-shirt-sunset-black",
        "name": "Unisex Oversized T-Shirt – Sunset Graphic Black",
        "category": "oversized",
        "base_price_paise": 79900,
        "description": "Pitch black oversized silhouette featuring vivid burnt orange sunset graphic art on the back and subtle chest monogram. Deep reactive dye stays pitch black wash after wash.",
        "fabric_specs": "240 GSM Combed Cotton · Double-Needle Seams · Reactive Dye",
        "images": [
            {"url": "/images/vyomik/products/qikink-tee-sunset-black.png", "sort_order": 0, "color": "Pitch Black", "is_primary": True},
            {"url": "/images/vyomik/products/qikink-tee-sunset-white.png", "sort_order": 1, "color": "Cyber White"},
            {"url": "/images/vyomik/collections/hero-black-tee.png", "sort_order": 2},
        ],
        "variants": [
            {
                "variant_id": "var_uo_sb_xs",
                "size": "XS",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65082462-XS",
                "product_sku": "UOsMRnHs-Blk-XS",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082462-XS"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Blk-XS"},
                ],
            },
            {
                "variant_id": "var_uo_sb_s",
                "size": "S",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65082462-S",
                "product_sku": "UOsMRnHs-Blk-S",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082462-S"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Blk-S"},
                ],
            },
            {
                "variant_id": "var_uo_sb_m",
                "size": "M",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65082462-M",
                "product_sku": "UOsMRnHs-Blk-M",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082462-M"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Blk-M"},
                ],
            },
            {
                "variant_id": "var_uo_sb_l",
                "size": "L",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65082462-L",
                "product_sku": "UOsMRnHs-Blk-L",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082462-L"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Blk-L"},
                ],
            },
            {
                "variant_id": "var_uo_sb_xl",
                "size": "XL",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65082462-XL",
                "product_sku": "UOsMRnHs-Blk-XL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082462-XL"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Blk-XL"},
                ],
            },
            {
                "variant_id": "var_uo_sb_xxl",
                "size": "XXL",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65082462-XXL",
                "product_sku": "UOsMRnHs-Blk-XXL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082462-XXL"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Blk-XXL"},
                ],
            },
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-emerald-green",
        "name": "Unisex Oversized T-Shirt – Emerald Typography Green",
        "category": "oversized",
        "base_price_paise": 89900,
        "description": "Earthy pine emerald oversized tee engineered with clean minimalist typography across the front and wide back line print. Relaxed fit with room to breathe.",
        "fabric_specs": "240 GSM Premium Jersey · Silk Screen Monogram · Anti-Pilling",
        "images": [
            {"url": "/images/vyomik/products/qikink-tee-emerald-green.png", "sort_order": 0, "color": "Pine Emerald", "is_primary": True},
            {"url": "/images/vyomik/products/qikink-tee-emerald-black.png", "sort_order": 1, "color": "Pitch Black"},
            {"url": "/images/vyomik/products/essential-tee-ivory.webp", "sort_order": 2},
        ],
        "variants": [
            {
                "variant_id": "var_uo_eg_s",
                "size": "S",
                "color": "Pine Emerald",
                "color_hex": "#2A4334",
                "price_paise": 89900,
                "store_sku": "v-65082446-S",
                "product_sku": "UOsMRnHs-Grn-S",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082446-S"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Grn-S"},
                ],
            },
            {
                "variant_id": "var_uo_eg_m",
                "size": "M",
                "color": "Pine Emerald",
                "color_hex": "#2A4334",
                "price_paise": 89900,
                "store_sku": "v-65082446-M",
                "product_sku": "UOsMRnHs-Grn-M",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082446-M"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Grn-M"},
                ],
            },
            {
                "variant_id": "var_uo_eg_l",
                "size": "L",
                "color": "Pine Emerald",
                "color_hex": "#2A4334",
                "price_paise": 89900,
                "store_sku": "v-65082446-L",
                "product_sku": "UOsMRnHs-Grn-L",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082446-L"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Grn-L"},
                ],
            },
            {
                "variant_id": "var_uo_eg_xl",
                "size": "XL",
                "color": "Pine Emerald",
                "color_hex": "#2A4334",
                "price_paise": 89900,
                "store_sku": "v-65082446-XL",
                "product_sku": "UOsMRnHs-Grn-XL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65082446-XL"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Grn-XL"},
                ],
            },
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-retro-maroon",
        "name": "Unisex Oversized T-Shirt – Retro Graphic Maroon",
        "category": "oversized",
        "base_price_paise": 89900,
        "description": "Deep wine burgundy oversized t-shirt featuring vintage editorial illustrations. Soft-hand feel with durable boxy silhouette tailored for Indian streetwear.",
        "fabric_specs": "240 GSM Combed Cotton · Pigment Dye · Bio-Washed",
        "images": [
            {"url": "/images/vyomik/products/qikink-tee-retro-maroon.png", "sort_order": 0, "color": "Vintage Wine", "is_primary": True},
            {"url": "/images/vyomik/products/qikink-tee-retro-black.png", "sort_order": 1, "color": "Pitch Black"},
            {"url": "/assets/oversized-basic-tee.png", "sort_order": 2},
        ],
        "variants": [
            {
                "variant_id": "var_uo_rm_s",
                "size": "S",
                "color": "Vintage Wine",
                "color_hex": "#5C1D24",
                "price_paise": 89900,
                "store_sku": "v-65080554-S",
                "product_sku": "UOsMRnHs-Mrn-S",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65080554-S"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Mrn-S"},
                ],
            },
            {
                "variant_id": "var_uo_rm_m",
                "size": "M",
                "color": "Vintage Wine",
                "color_hex": "#5C1D24",
                "price_paise": 89900,
                "store_sku": "v-65080554-M",
                "product_sku": "UOsMRnHs-Mrn-M",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65080554-M"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Mrn-M"},
                ],
            },
            {
                "variant_id": "var_uo_rm_l",
                "size": "L",
                "color": "Vintage Wine",
                "color_hex": "#5C1D24",
                "price_paise": 89900,
                "store_sku": "v-65080554-L",
                "product_sku": "UOsMRnHs-Mrn-L",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65080554-L"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Mrn-L"},
                ],
            },
            {
                "variant_id": "var_uo_rm_xl",
                "size": "XL",
                "color": "Vintage Wine",
                "color_hex": "#5C1D24",
                "price_paise": 89900,
                "store_sku": "v-65080554-XL",
                "product_sku": "UOsMRnHs-Mrn-XL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65080554-XL"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-Mrn-XL"},
                ],
            },
        ],
    },
    {
        "slug": "unisex-oversized-t-shirt-core-black",
        "name": "Unisex Oversized T-Shirt – Minimalist Core Black",
        "category": "oversized",
        "base_price_paise": 79900,
        "description": "The foundational black oversized streetwear tee. Minimalist chest emblem, heavy ribbed collar, and relaxed drop-shoulder cut.",
        "fabric_specs": "240 GSM Combed Cotton · High-Density Rubber Print · Pre-Shrunk",
        "images": [
            {"url": "/images/vyomik/products/qikink-tee-core-black.png", "sort_order": 0, "color": "Pitch Black", "is_primary": True},
            {"url": "/images/vyomik/products/qikink-tee-core-white.png", "sort_order": 1, "color": "Cyber White"},
            {"url": "/assets/rack-tees.png", "sort_order": 2},
        ],
        "variants": [
            {
                "variant_id": "var_uo_cb_s",
                "size": "S",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65068402-S",
                "product_sku": "UOsMRnHs-CBlk-S",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65068402-S"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-CBlk-S"},
                ],
            },
            {
                "variant_id": "var_uo_cb_m",
                "size": "M",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65068402-M",
                "product_sku": "UOsMRnHs-CBlk-M",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65068402-M"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-CBlk-M"},
                ],
            },
            {
                "variant_id": "var_uo_cb_l",
                "size": "L",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65068402-L",
                "product_sku": "UOsMRnHs-CBlk-L",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65068402-L"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-CBlk-L"},
                ],
            },
            {
                "variant_id": "var_uo_cb_xl",
                "size": "XL",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 79900,
                "store_sku": "v-65068402-XL",
                "product_sku": "UOsMRnHs-CBlk-XL",
                "qikink_skus": [
                    {"environment": "live", "qikink_sku": "v-65068402-XL"},
                    {"environment": "sandbox", "qikink_sku": "UOsMRnHs-CBlk-XL"},
                ],
            },
        ],
    },

    # -------------------------------------------------------------
    # Category 2: Sweatshirt (Heavyweight Boxy French Terry)
    # -------------------------------------------------------------
    {
        "slug": "heavyweight-oversized-sweatshirt-stone",
        "name": "Heavyweight Oversized Sweatshirt – Raw Stone",
        "category": "sweatshirt",
        "base_price_paise": 199900,
        "description": "Heavyweight crewneck sweatshirt crafted from 380 GSM diagonal loopback French Terry in neutral raw stone. Perfectly balanced boxy silhouette.",
        "fabric_specs": "380 GSM 100% Loopback French Terry · Mineral Wash",
        "images": [
            {"url": "/images/vyomik/products/sweatshirt-raw-stone.png", "sort_order": 0},
            {"url": "/images/vyomik/products/sweatshirt-pitch-black.png", "sort_order": 1},
        ],
        "variants": [
            {
                "variant_id": "var_sw_stn_s",
                "size": "S",
                "color": "Raw Stone",
                "color_hex": "#D9D1C3",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-STN-S",
                "product_sku": "VYO-SWT-STN-S-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-STN-S"}],
            },
            {
                "variant_id": "var_sw_stn_m",
                "size": "M",
                "color": "Raw Stone",
                "color_hex": "#D9D1C3",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-STN-M",
                "product_sku": "VYO-SWT-STN-M-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-STN-M"}],
            },
            {
                "variant_id": "var_sw_stn_l",
                "size": "L",
                "color": "Raw Stone",
                "color_hex": "#D9D1C3",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-STN-L",
                "product_sku": "VYO-SWT-STN-L-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-STN-L"}],
            },
            {
                "variant_id": "var_sw_stn_xl",
                "size": "XL",
                "color": "Raw Stone",
                "color_hex": "#D9D1C3",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-STN-XL",
                "product_sku": "VYO-SWT-STN-XL-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-STN-XL"}],
            },
        ],
    },
    {
        "slug": "signature-oversized-sweatshirt-black",
        "name": "Signature Oversized Sweatshirt – Pitch Black",
        "category": "sweatshirt",
        "base_price_paise": 199900,
        "description": "Monochromatic luxury sweatshirt with dropped shoulder profile, dense collar ribbing, and tactile tonal embroidery.",
        "fabric_specs": "380 GSM Cotton Blend · Tonal Satin Embroidery · Double Stitched",
        "images": [
            {"url": "/images/vyomik/products/sweatshirt-pitch-black.png", "sort_order": 0},
            {"url": "/images/vyomik/products/sweatshirt-raw-stone.png", "sort_order": 1},
        ],
        "variants": [
            {
                "variant_id": "var_sw_blk_s",
                "size": "S",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-BLK-S",
                "product_sku": "VYO-SWT-BLK-S-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-BLK-S"}],
            },
            {
                "variant_id": "var_sw_blk_m",
                "size": "M",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-BLK-M",
                "product_sku": "VYO-SWT-BLK-M-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-BLK-M"}],
            },
            {
                "variant_id": "var_sw_blk_l",
                "size": "L",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-BLK-L",
                "product_sku": "VYO-SWT-BLK-L-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-BLK-L"}],
            },
            {
                "variant_id": "var_sw_blk_xl",
                "size": "XL",
                "color": "Pitch Black",
                "color_hex": "#141414",
                "price_paise": 199900,
                "store_sku": "VYO-SWT-BLK-XL",
                "product_sku": "VYO-SWT-BLK-XL-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-BLK-XL"}],
            },
        ],
    },
    {
        "slug": "boxy-vintage-sweatshirt-olive",
        "name": "Boxy Vintage Sweatshirt – Washed Olive",
        "category": "sweatshirt",
        "base_price_paise": 219900,
        "description": "Vintage-washed boxy sweatshirt in muted tactical olive. Heavyweight 400 GSM fleece provides warmth without stiffness.",
        "fabric_specs": "400 GSM Heavy French Terry · Vintage Wash · Brushed Interior",
        "images": [
            {"url": "/images/vyomik/products/sweatshirt-washed-olive.png", "sort_order": 0},
            {"url": "/images/vyomik/products/sweatshirt-pitch-black.png", "sort_order": 1},
        ],
        "variants": [
            {
                "variant_id": "var_sw_olv_s",
                "size": "S",
                "color": "Washed Olive",
                "color_hex": "#4E5B42",
                "price_paise": 219900,
                "store_sku": "VYO-SWT-OLV-S",
                "product_sku": "VYO-SWT-OLV-S-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-OLV-S"}],
            },
            {
                "variant_id": "var_sw_olv_m",
                "size": "M",
                "color": "Washed Olive",
                "color_hex": "#4E5B42",
                "price_paise": 219900,
                "store_sku": "VYO-SWT-OLV-M",
                "product_sku": "VYO-SWT-OLV-M-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-OLV-M"}],
            },
            {
                "variant_id": "var_sw_olv_l",
                "size": "L",
                "color": "Washed Olive",
                "color_hex": "#4E5B42",
                "price_paise": 219900,
                "store_sku": "VYO-SWT-OLV-L",
                "product_sku": "VYO-SWT-OLV-L-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-OLV-L"}],
            },
            {
                "variant_id": "var_sw_olv_xl",
                "size": "XL",
                "color": "Washed Olive",
                "color_hex": "#4E5B42",
                "price_paise": 219900,
                "store_sku": "VYO-SWT-OLV-XL",
                "product_sku": "VYO-SWT-OLV-XL-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-SWT-OLV-XL"}],
            },
        ],
    },

    # -------------------------------------------------------------
    # Category 3: Hoodies (Architectural 450 GSM Drop Shoulders)
    # -------------------------------------------------------------
    {
        "slug": "core-hoodie-ivory",
        "name": "Core Heavyweight Hoodie – Warm Ivory",
        "category": "hoodies",
        "base_price_paise": 249900,
        "description": "The defining VYOMIK silhouette. 450 GSM luxury French Terry, double-lined crossover hood that stays upright, and dropped shoulders.",
        "fabric_specs": "450 GSM 100% Cotton French Terry · Double-Layered Hood · Pre-Shrunk",
        "images": [
            {"url": "/images/vyomik/products/hoodie-warm-ivory.png", "sort_order": 0},
            {"url": "/images/vyomik/products/hoodie-midnight-black.png", "sort_order": 1},
        ],
        "variants": [
            {
                "variant_id": "var_hd_ivo_s",
                "size": "S",
                "color": "Warm Ivory",
                "color_hex": "#F4F0E8",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-IVR-S",
                "product_sku": "VYO-HOOD-IVR-S-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-IVR-S"}],
            },
            {
                "variant_id": "var_hd_ivo_m",
                "size": "M",
                "color": "Warm Ivory",
                "color_hex": "#F4F0E8",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-IVR-M",
                "product_sku": "VYO-HOOD-IVR-M-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-IVR-M"}],
            },
            {
                "variant_id": "var_hd_ivo_l",
                "size": "L",
                "color": "Warm Ivory",
                "color_hex": "#F4F0E8",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-IVR-L",
                "product_sku": "VYO-HOOD-IVR-L-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-IVR-L"}],
            },
            {
                "variant_id": "var_hd_ivo_xl",
                "size": "XL",
                "color": "Warm Ivory",
                "color_hex": "#F4F0E8",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-IVR-XL",
                "product_sku": "VYO-HOOD-IVR-XL-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-IVR-XL"}],
            },
        ],
    },
    {
        "slug": "core-hoodie-black",
        "name": "Signature Boxy Hoodie – Midnight Black",
        "category": "hoodies",
        "base_price_paise": 249900,
        "description": "Architectural streetwear hoodie in jet black. Built for cold studio nights and everyday movement with a boxy oversized drape.",
        "fabric_specs": "450 GSM Cotton French Terry · Pre-Shrunk · Heavy Ribbed Trims",
        "images": [
            {"url": "/images/vyomik/products/hoodie-midnight-black.png", "sort_order": 0},
            {"url": "/images/vyomik/products/hoodie-warm-ivory.png", "sort_order": 1},
        ],
        "variants": [
            {
                "variant_id": "var_hd_blk_s",
                "size": "S",
                "color": "Midnight Black",
                "color_hex": "#141414",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-BLK-S",
                "product_sku": "VYO-HOOD-BLK-S-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-BLK-S"}],
            },
            {
                "variant_id": "var_hd_blk_m",
                "size": "M",
                "color": "Midnight Black",
                "color_hex": "#141414",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-BLK-M",
                "product_sku": "VYO-HOOD-BLK-M-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-BLK-M"}],
            },
            {
                "variant_id": "var_hd_blk_l",
                "size": "L",
                "color": "Midnight Black",
                "color_hex": "#141414",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-BLK-L",
                "product_sku": "VYO-HOOD-BLK-L-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-BLK-L"}],
            },
            {
                "variant_id": "var_hd_blk_xl",
                "size": "XL",
                "color": "Midnight Black",
                "color_hex": "#141414",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-BLK-XL",
                "product_sku": "VYO-HOOD-BLK-XL-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-BLK-XL"}],
            },
        ],
    },
    {
        "slug": "core-hoodie-rust",
        "name": "Terracotta Drop Shoulder Hoodie – Burnt Rust",
        "category": "hoodies",
        "base_price_paise": 249900,
        "description": "Earthy terracotta oversized hoodie dyed in rich burnt rust. Finished with durable dropped shoulder seams and structured collar contour.",
        "fabric_specs": "450 GSM Cotton French Terry · Custom Pigment Dye · Bio-Washed",
        "images": [
            {"url": "/images/vyomik/products/hoodie-burnt-rust.png", "sort_order": 0},
            {"url": "/images/vyomik/products/hoodie-warm-ivory.png", "sort_order": 1},
        ],
        "variants": [
            {
                "variant_id": "var_hd_rst_s",
                "size": "S",
                "color": "Burnt Rust",
                "color_hex": "#A64B2A",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-RST-S",
                "product_sku": "VYO-HOOD-RST-S-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-RST-S"}],
            },
            {
                "variant_id": "var_hd_rst_m",
                "size": "M",
                "color": "Burnt Rust",
                "color_hex": "#A64B2A",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-RST-M",
                "product_sku": "VYO-HOOD-RST-M-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-RST-M"}],
            },
            {
                "variant_id": "var_hd_rst_l",
                "size": "L",
                "color": "Burnt Rust",
                "color_hex": "#A64B2A",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-RST-L",
                "product_sku": "VYO-HOOD-RST-L-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-RST-L"}],
            },
            {
                "variant_id": "var_hd_rst_xl",
                "size": "XL",
                "color": "Burnt Rust",
                "color_hex": "#A64B2A",
                "price_paise": 249900,
                "store_sku": "VYO-HOOD-RST-XL",
                "product_sku": "VYO-HOOD-RST-XL-SBX",
                "qikink_skus": [{"environment": "live", "qikink_sku": "VYO-HOOD-RST-XL"}],
            },
        ],
    },
]


async def seed_mongodb_products_if_empty() -> None:
    """Synchronizes or seeds products into MongoDB collection with 3-category catalog and clean mockups."""
    logger.info("Synchronizing 11 distinct products (Oversized, Sweatshirt, Hoodies) with mockups into MongoDB...")
    for item in MONGODB_SEED_PRODUCTS:
        existing = await ProductDoc.find_one(ProductDoc.slug == item["slug"])
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
        images = [
            ProductImageDoc(
                color=img.get("color"),
                url=img["url"],
                sort_order=img["sort_order"],
                is_primary=img.get("is_primary", False),
            )
            for img in item.get("images", [])
        ]

        if existing:
            existing.name = item["name"]
            existing.category = item["category"]
            existing.base_price_paise = item["base_price_paise"]
            existing.description = item.get("description", "")
            existing.fabric_specs = item.get("fabric_specs")
            existing.variants = variants
            existing.images = images
            await existing.save()
        else:
            doc = ProductDoc(
                slug=item["slug"],
                name=item["name"],
                category=item["category"],
                base_price_paise=item["base_price_paise"],
                description=item.get("description", ""),
                fabric_specs=item.get("fabric_specs"),
                variants=variants,
                images=images,
                is_active=True,
                is_demo=False,
            )
            await doc.insert()

    logger.info("Successfully seeded/synced 11 products into MongoDB 'products' collection!")
    await seed_discounts_and_reviews_if_empty()
    await seed_orders_and_customers_if_empty()


async def seed_discounts_and_reviews_if_empty() -> None:
    """Seeds initial coupons and UGC reviews if collections are empty."""
    if await DiscountDoc.count() == 0:
        logger.info("Seeding initial discount coupons into MongoDB...")
        coupons = [
            DiscountDoc(
                code="VYOMIK10",
                discount_type="percentage",
                discount_value=10,
                min_subtotal_paise=99900,
                usage_limit=500,
                usage_count=42,
                is_active=True,
            ),
            DiscountDoc(
                code="EARLYVIP",
                discount_type="fixed_paise",
                discount_value=20000,
                min_subtotal_paise=149900,
                usage_limit=200,
                usage_count=18,
                is_active=True,
            ),
            DiscountDoc(
                code="FREESHIP",
                discount_type="free_shipping",
                discount_value=0,
                min_subtotal_paise=0,
                usage_limit=1000,
                usage_count=87,
                is_active=True,
            ),
        ]
        for c in coupons:
            await c.insert()
        logger.info("Seeded 3 discount coupons into MongoDB.")

    if await ReviewDoc.count() == 0:
        logger.info("Seeding initial product reviews into MongoDB...")
        reviews = [
            ReviewDoc(
                product_slug="core-hoodie-ivory",
                product_title="Core Heavyweight Hoodie – Warm Ivory",
                customer_name="Aarav Sharma",
                customer_email="aarav.sharma@example.com",
                rating=5,
                title="Unmatched silhouette & weight",
                comment="The drape is architectural and heavy. Collar hood stays up without collapsing. Absolute staple.",
                verified_purchase=True,
                status="approved",
            ),
            ReviewDoc(
                product_slug="unisex-oversized-classic-t-shirt-white",
                product_title="Unisex Oversized T-Shirt – Cyber Graphic White",
                customer_name="Rhea Patel",
                customer_email="rhea.patel@example.com",
                rating=5,
                title="Best drop shoulder tee in India",
                comment="Dense 240 GSM combed cotton that does not lose its structure in the wash. True oversized cut.",
                verified_purchase=True,
                status="approved",
            ),
            ReviewDoc(
                product_slug="core-hoodie-rust",
                product_title="Terracotta Drop Shoulder Hoodie – Burnt Rust",
                customer_name="Kabir Mehta",
                customer_email="kabir.m@example.com",
                rating=4,
                title="Deep earthy hue and solid ribbing",
                comment="The burnt orange rust tone is even richer in person. Dense collar band keeps snug against the neck.",
                verified_purchase=True,
                status="approved",
            ),
        ]
        for r in reviews:
            await r.insert()
        logger.info("Seeded 3 product reviews into MongoDB.")

    await seed_orders_and_customers_if_empty()


async def seed_orders_and_customers_if_empty() -> None:
    """Seeds initial production-like customer orders and CRM records into MongoDB if empty."""
    if await OrderDoc.find_one(OrderDoc.public_order_number == "VYO-784912") is None:
        logger.info("Seeding initial live orders into MongoDB 'orders' collection...")
        now = datetime.now(timezone.utc)
        initial_orders = [
            OrderDoc(
                public_order_number="VYO-784912",
                customer_email="aarav.sharma@example.com",
                shipping_address=ShippingAddressDoc(
                    first_name="Aarav",
                    last_name="Sharma",
                    address1="Flat 402, Skyline Residency, Bandra West",
                    address2="Opposite Bandstand",
                    city="Mumbai",
                    state="Maharashtra",
                    zipcode="400050",
                    phone="+91 98765 43210",
                    email="aarav.sharma@example.com",
                ),
                items=[
                    OrderItemDoc(
                        title="Core Hoodie — Black",
                        size="L",
                        color="Midnight Black",
                        qty=1,
                        price_paise=249900,
                        sku="v-core-hoodie-blk-l",
                    )
                ],
                pricing=PricingDoc(
                    subtotal_paise=249900,
                    shipping_fee_paise=0,
                    cod_fee_paise=0,
                    total_paise=249900,
                ),
                payment=PaymentDoc(
                    method="prepaid",
                    status="paid",
                    provider="upi_qr",
                    tr="TR-VYO-784912",
                    customer_upi_id="aarav@okhdfcbank",
                    utr_number="630155807241",
                    verified_at=now - timedelta(minutes=45),
                    receipt_number="VYREC-20261123-8912",
                ),
                fulfillment=FulfillmentDoc(
                    provider="qikink",
                    environment="sandbox",
                    qikink_order_id="QIK-89124",
                    status="SUBMITTED",
                    courier_partner="Delhivery Surface",
                    awb_number="DELHIVERY-789123441",
                    tracking_url="https://www.delhivery.com/track/package/789123441",
                    pushed_at=now - timedelta(minutes=40),
                ),
                order_status="CONFIRMED",
                created_at=now - timedelta(minutes=50),
                updated_at=now - timedelta(minutes=40),
            ),
            OrderDoc(
                public_order_number="VYO-784911",
                customer_email="ishaan.v@example.com",
                shipping_address=ShippingAddressDoc(
                    first_name="Ishaan",
                    last_name="Verma",
                    address1="Tech Zone 4, Greater Noida West",
                    address2="Tower C, Apt 1102",
                    city="Noida",
                    state="Uttar Pradesh",
                    zipcode="201301",
                    phone="+91 91234 56789",
                    email="ishaan.v@example.com",
                ),
                items=[
                    OrderItemDoc(
                        title="Unisex Oversized T-Shirt – Cyber Graphic White",
                        size="M",
                        color="Cyber White",
                        qty=2,
                        price_paise=79900,
                        sku="UOsMRnHs-Wh-M",
                    )
                ],
                pricing=PricingDoc(
                    subtotal_paise=159800,
                    shipping_fee_paise=0,
                    cod_fee_paise=0,
                    total_paise=159800,
                ),
                payment=PaymentDoc(
                    method="prepaid",
                    status="paid",
                    provider="upi_qr",
                    tr="TR-VYO-784911",
                    customer_upi_id="ishaan@icici",
                    utr_number="630155807242",
                    verified_at=now - timedelta(hours=2),
                    receipt_number="VYREC-20261123-8913",
                ),
                fulfillment=FulfillmentDoc(
                    provider="qikink",
                    environment="sandbox",
                    qikink_order_id="QIK-89125",
                    status="SUBMITTED",
                    courier_partner="Delhivery Surface",
                    awb_number="DELHIVERY-789123442",
                    tracking_url="https://www.delhivery.com/track/package/789123442",
                    pushed_at=now - timedelta(hours=1, minutes=50),
                ),
                order_status="PROCESSING",
                created_at=now - timedelta(hours=2, minutes=10),
                updated_at=now - timedelta(hours=1, minutes=50),
            ),
            OrderDoc(
                public_order_number="VYO-784910",
                customer_email="rhea.patel@example.com",
                shipping_address=ShippingAddressDoc(
                    first_name="Rhea",
                    last_name="Patel",
                    address1="12th Cross, Indiranagar",
                    address2="Near Defense Colony",
                    city="Bengaluru",
                    state="Karnataka",
                    zipcode="560038",
                    phone="+91 98111 22334",
                    email="rhea.patel@example.com",
                ),
                items=[
                    OrderItemDoc(
                        title="Heavyweight Oversized Sweatshirt – Raw Stone",
                        size="S",
                        color="Raw Stone",
                        qty=1,
                        price_paise=199900,
                        sku="v-sweat-stone-s",
                    )
                ],
                pricing=PricingDoc(
                    subtotal_paise=199900,
                    shipping_fee_paise=0,
                    cod_fee_paise=0,
                    total_paise=199900,
                ),
                payment=PaymentDoc(
                    method="prepaid",
                    status="paid",
                    provider="upi_qr",
                    tr="TR-VYO-784910",
                    customer_upi_id="rhea@paytm",
                    utr_number="630155807243",
                    verified_at=now - timedelta(hours=5),
                    receipt_number="VYREC-20261123-8914",
                ),
                fulfillment=FulfillmentDoc(
                    provider="qikink",
                    environment="sandbox",
                    qikink_order_id="QIK-89098",
                    status="DISPATCHED",
                    courier_partner="BlueDart Express",
                    awb_number="BLUEDART-55442211",
                    tracking_url="https://www.bluedart.com",
                    pushed_at=now - timedelta(hours=4),
                ),
                order_status="DISPATCHED",
                created_at=now - timedelta(hours=5, minutes=15),
                updated_at=now - timedelta(hours=4),
            ),
            OrderDoc(
                public_order_number="VYO-784909",
                customer_email="kabir.m@example.com",
                shipping_address=ShippingAddressDoc(
                    first_name="Kabir",
                    last_name="Mehta",
                    address1="CG Road, Navrangpura",
                    address2="Opp Municipal Market",
                    city="Ahmedabad",
                    state="Gujarat",
                    zipcode="380009",
                    phone="+91 97654 32109",
                    email="kabir.m@example.com",
                ),
                items=[
                    OrderItemDoc(
                        title="Unisex Oversized T-Shirt – Sunset Graphic Black",
                        size="L",
                        color="Pitch Black",
                        qty=1,
                        price_paise=79900,
                        sku="UOsMRnHs-Blk-L",
                    )
                ],
                pricing=PricingDoc(
                    subtotal_paise=79900,
                    shipping_fee_paise=9900,
                    cod_fee_paise=4900,
                    total_paise=94700,
                ),
                payment=PaymentDoc(
                    method="cod",
                    status="pending",
                    provider="cod",
                ),
                fulfillment=FulfillmentDoc(
                    provider="qikink",
                    environment="sandbox",
                    qikink_order_id="QIK-88942",
                    status="DELIVERED",
                    courier_partner="Delhivery Surface",
                    awb_number="DELHIVERY-99887766",
                    tracking_url="https://www.delhivery.com",
                    pushed_at=now - timedelta(days=1),
                ),
                order_status="DELIVERED",
                created_at=now - timedelta(days=1, hours=2),
                updated_at=now - timedelta(hours=6),
            ),
            OrderDoc(
                public_order_number="VYO-784908",
                customer_email="devika.n@example.com",
                shipping_address=ShippingAddressDoc(
                    first_name="Devika",
                    last_name="Nair",
                    address1="Panampilly Nagar",
                    address2="Avenue 4, House 12",
                    city="Kochi",
                    state="Kerala",
                    zipcode="682036",
                    phone="+91 95432 10987",
                    email="devika.n@example.com",
                ),
                items=[
                    OrderItemDoc(
                        title="Core Hoodie – Rust",
                        size="M",
                        color="Burnt Rust",
                        qty=1,
                        price_paise=249900,
                        sku="v-hoodie-rust-m",
                    )
                ],
                pricing=PricingDoc(
                    subtotal_paise=249900,
                    shipping_fee_paise=0,
                    cod_fee_paise=0,
                    total_paise=249900,
                ),
                payment=PaymentDoc(
                    method="prepaid",
                    status="awaiting_payment",
                    provider="upi_qr",
                    tr="TR-VYO-784908",
                    customer_upi_id="devika@axis",
                ),
                fulfillment=FulfillmentDoc(
                    provider="qikink",
                    environment="sandbox",
                    status="PENDING",
                ),
                order_status="PROCESSING",
                created_at=now - timedelta(minutes=20),
                updated_at=now - timedelta(minutes=20),
            ),
        ]
        for ord_doc in initial_orders:
            await ord_doc.insert()
        logger.info("Successfully seeded 5 initial live orders into MongoDB 'orders' collection.")

    if await CustomerDoc.count() == 0:
        logger.info("Seeding initial customers into MongoDB 'customers' collection...")
        customers = [
            CustomerDoc(
                name="Aarav Sharma",
                email="aarav.sharma@example.com",
                phone="+91 98765 43210",
                saved_addresses=[
                    ShippingAddressDoc(
                        first_name="Aarav",
                        last_name="Sharma",
                        address1="Flat 402, Skyline Residency, Bandra West",
                        city="Mumbai",
                        state="Maharashtra",
                        zipcode="400050",
                        phone="+91 98765 43210",
                        email="aarav.sharma@example.com",
                    )
                ],
            ),
            CustomerDoc(
                name="Ishaan Verma",
                email="ishaan.v@example.com",
                phone="+91 91234 56789",
                saved_addresses=[
                    ShippingAddressDoc(
                        first_name="Ishaan",
                        last_name="Verma",
                        address1="Tech Zone 4, Greater Noida West",
                        city="Noida",
                        state="Uttar Pradesh",
                        zipcode="201301",
                        phone="+91 91234 56789",
                        email="ishaan.v@example.com",
                    )
                ],
            ),
            CustomerDoc(
                name="Rhea Patel",
                email="rhea.patel@example.com",
                phone="+91 98111 22334",
                saved_addresses=[
                    ShippingAddressDoc(
                        first_name="Rhea",
                        last_name="Patel",
                        address1="12th Cross, Indiranagar",
                        city="Bengaluru",
                        state="Karnataka",
                        zipcode="560038",
                        phone="+91 98111 22334",
                        email="rhea.patel@example.com",
                    )
                ],
            ),
            CustomerDoc(
                name="Kabir Mehta",
                email="kabir.m@example.com",
                phone="+91 97654 32109",
                saved_addresses=[
                    ShippingAddressDoc(
                        first_name="Kabir",
                        last_name="Mehta",
                        address1="CG Road, Navrangpura",
                        city="Ahmedabad",
                        state="Gujarat",
                        zipcode="380009",
                        phone="+91 97654 32109",
                        email="kabir.m@example.com",
                    )
                ],
            ),
            CustomerDoc(
                name="Devika Nair",
                email="devika.n@example.com",
                phone="+91 95432 10987",
                saved_addresses=[
                    ShippingAddressDoc(
                        first_name="Devika",
                        last_name="Nair",
                        address1="Panampilly Nagar",
                        city="Kochi",
                        state="Kerala",
                        zipcode="682036",
                        phone="+91 95432 10987",
                        email="devika.n@example.com",
                    )
                ],
            ),
        ]
        for cust in customers:
            await cust.insert()
        logger.info("Successfully seeded 5 initial customers into MongoDB 'customers' collection.")
