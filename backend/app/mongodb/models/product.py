"""
MongoDB Document Models for Products & Variants using Beanie ODM.
"""

from datetime import datetime, timezone
from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from beanie import Document, Indexed


class QikinkSkuDoc(BaseModel):
    environment: str = Field(description="'sandbox' or 'live'")
    qikink_sku: str = Field(description="Unique SKU string")


class ProductVariantDoc(BaseModel):
    variant_id: str
    size: str
    color: str
    color_hex: Optional[str] = None
    price_paise: int = Field(ge=0, description="Price in integer Paise")
    in_stock: bool = True
    sku: Optional[str] = None
    store_sku: Optional[str] = None
    product_sku: Optional[str] = None
    qikink_skus: List[QikinkSkuDoc] = []


class ProductImageDoc(BaseModel):
    url: str
    color: Optional[str] = None
    is_primary: bool = False
    sort_order: int = 0


class ProductDoc(Document):
    slug: Indexed(str, unique=True)
    name: str
    description: str = ""
    category: Indexed(str)
    base_price_paise: int = Field(ge=0, description="Base catalog price in integer Paise")
    is_active: bool = True
    is_demo: bool = False
    fabric_specs: Optional[str] = None
    variants: List[ProductVariantDoc] = []
    images: List[ProductImageDoc] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "products"
        indexes = [
            "slug",
            "category",
            "is_active",
        ]
