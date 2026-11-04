"""
Waitlist request and response schemas.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class WaitlistSignupRequest(BaseModel):
    email: EmailStr = Field(description="Customer email address for launch notification")
    source: str = Field(default="hero_cta", max_length=60, description="Origin CTA button or page")


class WaitlistSignupResponse(BaseModel):
    success: bool
    email: str
    message: str
    created_at: datetime

