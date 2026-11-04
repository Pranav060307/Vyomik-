"""
Product & Variant read schemas for public catalog API.
"""

from typing import List, Optional
from pydantic import BaseModel


class VariantQikinkSkuRead(BaseModel):
    environment: str
    qikink_sku: str

    model_config = {"from_attributes": True}


class ProductVariantRead(BaseModel):
    id: int
    size: str
    color: str
    price: int
    is_active: bool

    model_config = {"from_attributes": True}


class ProductImageRead(BaseModel):
    id: int
    color: Optional[str] = None
    url: str
    sort_order: int

    model_config = {"from_attributes": True}


class ProductRead(BaseModel):
    id: int
    slug: str
    name: str
    description: str
    category: str
    base_price: int
    is_active: bool
    is_demo: bool
    variants: List[ProductVariantRead] = []
    images: List[ProductImageRead] = []

    model_config = {"from_attributes": True}

