"""
MongoDB Document Model for VIP Waitlist using Beanie ODM.
"""

from datetime import datetime, timezone
from typing import Optional
from pydantic import Field
from beanie import Document, Indexed


class WaitlistDoc(Document):
    email: Indexed(str, unique=True)
    source: str = "coming_soon_gate"
    ip_address: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "waitlist"
        indexes = ["email"]
