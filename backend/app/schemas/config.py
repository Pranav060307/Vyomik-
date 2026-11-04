"""
Store configuration schema returned by GET /api/v1/config.
"""

from typing import Literal
from pydantic import BaseModel


class StoreConfigResponse(BaseModel):
    store_name: str
    store_mode: Literal["coming_soon", "live"]
    launch_date: str
    payment_provider: str
    cod_available: bool
    free_shipping_threshold_paise: int
    default_shipping_fee_paise: int
    cod_fee_paise: int
    demo_content: bool
