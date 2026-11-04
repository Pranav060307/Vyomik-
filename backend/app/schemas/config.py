"""
Store configuration schema returned by GET /api/v1/config.
"""

from typing import Literal
from pydantic import BaseModel, Field


class StoreConfigResponse(BaseModel):
    store_name: str
    store_mode: Literal["coming_soon", "live"]
    launch_date: str
    launch_at: str = Field(description="Official launch timestamp ISO 8601 with timezone")
    server_time: str = Field(description="Current server timestamp ISO 8601 with timezone")
    gate_enabled: bool = Field(description="True if server_time < launch_at and LAUNCH_GATE_ENABLED is true")
    payment_provider: str
    cod_available: bool
    free_shipping_threshold_paise: int
    default_shipping_fee_paise: int
    cod_fee_paise: int
    demo_content: bool
