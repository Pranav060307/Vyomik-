"""
Schemas for team preview key verification.
"""

from pydantic import BaseModel, Field


class PreviewVerifyRequest(BaseModel):
    key: str = Field(min_length=1, description="Preview key passed via ?preview=<key>")


class PreviewVerifyResponse(BaseModel):
    valid: bool
    message: str

