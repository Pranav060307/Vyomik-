"""
Product, Variant, Qikink SKU mapping, and Image models.
"""

import enum
from typing import List, Optional
from sqlalchemy import (
    Boolean,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class QikinkEnvironment(str, enum.Enum):
    SANDBOX = "sandbox"
    LIVE = "live"


class Product(Base, TimestampMixin):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    slug: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    category: Mapped[str] = mapped_column(String(60), index=True, nullable=False)
    base_price: Mapped[int] = mapped_column(Integer, nullable=False, comment="Base price in integer Paise (INR)")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    variants: Mapped[List["ProductVariant"]] = relationship(
        "ProductVariant", back_populates="product", cascade="all, delete-orphan"
    )
    images: Mapped[List["ProductImage"]] = relationship(
        "ProductImage", back_populates="product", cascade="all, delete-orphan", order_by="ProductImage.sort_order"
    )

    def __repr__(self) -> str:
        return f"<Product(id={self.id}, slug='{self.slug}', name='{self.name}')>"


class ProductVariant(Base, TimestampMixin):
    __tablename__ = "product_variants"
    __table_args__ = (
        UniqueConstraint("product_id", "size", "color", name="uq_variant_product_size_color"),
        Index("ix_variant_product_active", "product_id", "is_active"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    size: Mapped[str] = mapped_column(String(20), nullable=False)
    color: Mapped[str] = mapped_column(String(50), nullable=False)
    price: Mapped[int] = mapped_column(Integer, nullable=False, comment="Variant price in integer Paise (INR)")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    product: Mapped["Product"] = relationship("Product", back_populates="variants")
    qikink_skus: Mapped[List["VariantQikinkSku"]] = relationship(
        "VariantQikinkSku", back_populates="variant", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<ProductVariant(id={self.id}, size='{self.size}', color='{self.color}')>"


class VariantQikinkSku(Base, TimestampMixin):
    """
    CRITICAL: Sandbox and Live have completely independent product catalogs and SKUs in Qikink.
    Never mix them. This table enforces uniqueness per (variant_id, environment).
    """
    __tablename__ = "variant_qikink_skus"
    __table_args__ = (
        UniqueConstraint("variant_id", "environment", name="uq_variant_qikink_env"),
        Index("ix_variant_env_sku", "variant_id", "environment"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id", ondelete="CASCADE"), nullable=False)
    environment: Mapped[QikinkEnvironment] = mapped_column(
        Enum(QikinkEnvironment, name="qikink_env_enum"),
        nullable=False,
    )
    qikink_sku: Mapped[str] = mapped_column(String(80), nullable=False)

    # Relationship
    variant: Mapped["ProductVariant"] = relationship("ProductVariant", back_populates="qikink_skus")

    def __repr__(self) -> str:
        return f"<VariantQikinkSku(variant_id={self.variant_id}, env='{self.environment.value}', sku='{self.qikink_sku}')>"


class ProductImage(Base):
    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    color: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationship
    product: Mapped["Product"] = relationship("Product", back_populates="images")

