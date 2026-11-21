"""
MongoDB Document Model for Customers using Beanie ODM.
"""

from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field
from beanie import Document, Indexed
from app.mongodb.models.order import ShippingAddressDoc


class CustomerDoc(Document):
    email: Indexed(str, unique=True)
    phone: Optional[str] = None
    name: Optional[str] = None
    saved_addresses: List[ShippingAddressDoc] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "customers"
        indexes = ["email"]
