"""
Catalog & Product endpoints.
Returns dynamic catalog items with active environment Qikink SKUs.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.product import Product, ProductVariant
from app.schemas.product import ProductRead, CreateProductRequest
import logging

logger = logging.getLogger("vyomik.products")

router = APIRouter()


def _enrich_variant_skus(products: List[Product]) -> None:
    """Attaches active environment SKU, store_sku, and product_sku to variants."""
    current_mode = settings.QIKINK_MODE.lower()
    for product in products:
        for v in product.variants:
            store_sku = None
            product_sku = None
            active_sku = None

            for q in v.qikink_skus:
                env_val = getattr(q.environment, "value", str(q.environment)).lower()
                if env_val == "live":
                    store_sku = q.qikink_sku
                elif env_val == "sandbox":
                    product_sku = q.qikink_sku

                if env_val == current_mode:
                    active_sku = q.qikink_sku

            # Fallback for active_sku if not explicitly matched
            if not active_sku:
                active_sku = store_sku or product_sku

            setattr(v, "sku", active_sku)
            setattr(v, "store_sku", store_sku)
            setattr(v, "product_sku", product_sku)


@router.get(
    "/products",
    response_model=List[ProductRead],
    summary="List active products with category filtering and dynamic Qikink SKUs",
)
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    db: AsyncSession = Depends(get_db),
) -> List[ProductRead]:
    stmt = (
        select(Product)
        .where(Product.is_active.is_(True))
        .options(
            selectinload(Product.variants).selectinload(ProductVariant.qikink_skus),
            selectinload(Product.images),
        )
    )
    if category:
        stmt = stmt.where(Product.category == category)
    
    result = await db.execute(stmt)
    products = list(result.scalars().all())
    _enrich_variant_skus(products)
    return products


@router.get(
    "/products/{slug}",
    response_model=ProductRead,
    summary="Get single product by slug with dynamic Qikink SKUs",
)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    stmt = (
        select(Product)
        .where(Product.slug == slug, Product.is_active.is_(True))
        .options(
            selectinload(Product.variants).selectinload(ProductVariant.qikink_skus),
            selectinload(Product.images),
        )
    )
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with slug '{slug}' not found.",
        )
    _enrich_variant_skus([product])
    return product


@router.post(
    "/products",
    response_model=ProductRead,
    summary="Add a new product with Qikink SKUs directly into MongoDB and SQL database",
)
async def create_product(
    payload: CreateProductRequest,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    from app.models.product import VariantQikinkSku, QikinkEnvironment, ProductImage
    from app.mongodb.models.product import ProductDoc, ProductVariantDoc, QikinkSkuDoc, ProductImageDoc

    # Check if slug exists in DB
    existing = await db.execute(select(Product).where(Product.slug == payload.slug))
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Product with slug '{payload.slug}' already exists.",
        )

    # 1. Save in SQL
    prod = Product(
        slug=payload.slug,
        name=payload.name,
        description=payload.description,
        category=payload.category,
        base_price=payload.base_price,
        is_active=True,
        is_demo=False,
    )
    db.add(prod)
    await db.flush()

    if payload.image_url:
        img = ProductImage(product_id=prod.id, image_url=payload.image_url, is_primary=True, sort_order=0)
        db.add(img)

    for v_in in payload.variants:
        variant = ProductVariant(
            product_id=prod.id,
            size=v_in.size,
            color=v_in.color,
            price=v_in.price,
            is_active=True,
        )
        db.add(variant)
        await db.flush()

        if v_in.store_sku:
            live_sku = VariantQikinkSku(
                variant_id=variant.id,
                environment=QikinkEnvironment.LIVE,
                qikink_sku=v_in.store_sku,
            )
            db.add(live_sku)

        if v_in.product_sku:
            sbx_sku = VariantQikinkSku(
                variant_id=variant.id,
                environment=QikinkEnvironment.SANDBOX,
                qikink_sku=v_in.product_sku,
            )
            db.add(sbx_sku)

    await db.commit()

    # 2. Save in MongoDB
    try:
        mongo_variants = [
            ProductVariantDoc(
                variant_id=f"var_{payload.slug[:6]}_{v.size.lower()}",
                size=v.size,
                color=v.color,
                price_paise=v.price,
                store_sku=v.store_sku,
                product_sku=v.product_sku,
                sku=v.store_sku or v.product_sku,
                qikink_skus=[
                    QikinkSkuDoc(environment="live", qikink_sku=v.store_sku)
                    for _ in [0] if v.store_sku
                ] + [
                    QikinkSkuDoc(environment="sandbox", qikink_sku=v.product_sku)
                    for _ in [0] if v.product_sku
                ],
            )
            for v in payload.variants
        ]

        mongo_images = [ProductImageDoc(url=payload.image_url, is_primary=True)] if payload.image_url else []

        doc = ProductDoc(
            slug=payload.slug,
            name=payload.name,
            description=payload.description,
            category=payload.category,
            base_price_paise=payload.base_price,
            variants=mongo_variants,
            images=mongo_images,
            is_active=True,
            is_demo=False,
        )
        await doc.insert()
    except Exception as me:
        logger.warning(f"Failed to mirror product to MongoDB: {me}")

    # Return refreshed product
    return await get_product_by_slug(payload.slug, db)
