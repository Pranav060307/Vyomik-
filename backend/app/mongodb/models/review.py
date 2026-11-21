"""
MongoDB Document Model for Product Reviews & UGC using Beanie ODM.
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document, Indexed


class ReviewDoc(Document):
    product_slug: Indexed(str)
    product_title: str
    customer_name: str
    customer_email: Optional[str] = None
    rating: int = Field(ge=1, le=5, default=5)
    title: str
    comment: str
    verified_purchase: bool = True
    status: Indexed(str) = "approved"  # "approved", "pending", "flagged"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "reviews"
        indexes = [
            "product_slug",
            "status",
            "rating",
        ]
