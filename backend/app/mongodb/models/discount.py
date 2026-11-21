"""
MongoDB Document Model for Discounts & Coupons using Beanie ODM.
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document, Indexed


class DiscountDoc(Document):
    code: Indexed(str, unique=True)
    discount_type: str = Field(default="percentage", description="'percentage', 'fixed_paise', or 'free_shipping'")
    discount_value: int = Field(default=10, description="Percentage value (e.g. 10 for 10%) or Paise value")
    min_subtotal_paise: int = Field(default=0, ge=0)
    usage_limit: int = Field(default=100, gt=0)
    usage_count: int = Field(default=0, ge=0)
    is_active: bool = True
    starts_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "discounts"
        indexes = [
            "code",
            "is_active",
        ]
