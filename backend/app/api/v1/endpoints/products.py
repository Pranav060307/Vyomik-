"""
Catalog & Product endpoints.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.product import Product
from app.schemas.product import ProductRead

router = APIRouter()


@router.get(
    "/products",
    response_model=List[ProductRead],
    summary="List active products with category filtering",
)
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category slug"),
    db: AsyncSession = Depends(get_db),
) -> List[ProductRead]:
    stmt = (
        select(Product)
        .where(Product.is_active.is_(True))
        .options(
            selectinload(Product.variants),
            selectinload(Product.images),
        )
    )
    if category:
        stmt = stmt.where(Product.category == category)
    
    result = await db.execute(stmt)
    products = result.scalars().all()
    return list(products)


@router.get(
    "/products/{slug}",
    response_model=ProductRead,
    summary="Get single product by slug",
)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ProductRead:
    stmt = (
        select(Product)
        .where(Product.slug == slug, Product.is_active.is_(True))
        .options(
            selectinload(Product.variants),
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
    return product

