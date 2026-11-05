"""
Typed Pydantic v2 schemas for Qikink Custom API requests and responses.
All data exchanged with Qikink is validated here.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
from app.integrations.qikink.constants import MAX_QIKINK_ORDER_NUMBER_LEN


class QikinkShippingAddress(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: Optional[str] = ""
    address1: str = Field(min_length=1)
    address2: Optional[str] = ""
    city: str = Field(min_length=1)
    state: str = Field(min_length=1)
    zipcode: str = Field(pattern=r"^\d{6}$", description="6-digit Indian PIN code")
    phone: str = Field(min_length=10, max_length=15)
    email: str


class QikinkLineItem(BaseModel):
    """
    CRITICAL RULE 1: We NEVER send artwork. We send pre-created SKUs generated
    in Qikink Dashboard under My Products.
    """
    sku: str = Field(min_length=1, description="Pre-created SKU from Qikink Dashboard")
    quantity: int = Field(gt=0, description="Item quantity")
    price_paise: int = Field(default=0, ge=0, description="Unit price in paise")


class QikinkCreateOrderRequest(BaseModel):
    order_number: str = Field(
        max_length=MAX_QIKINK_ORDER_NUMBER_LEN,
        description="Public order identifier (max 15 characters)",
    )
    shipping_address: QikinkShippingAddress
    line_items: List[QikinkLineItem] = Field(min_length=1)
    is_cod: bool = False
    cod_amount_paise: int = Field(default=0, ge=0)
    total_order_value_paise: int = Field(default=0, ge=0)

    @field_validator("order_number")
    @classmethod
    def validate_order_number_length(cls, v: str) -> str:
        if len(v) > MAX_QIKINK_ORDER_NUMBER_LEN:
            raise ValueError(
                f"order_number '{v}' exceeds Qikink max length limit of {MAX_QIKINK_ORDER_NUMBER_LEN} characters"
            )
        return v


class QikinkCreateOrderResponse(BaseModel):
    success: bool
    order_number: str
    qikink_order_id: str
    status: str  # e.g., "SUBMITTED", "IN_PRODUCTION", "REJECTED", "FAILED"
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class QikinkOrderStatusResponse(BaseModel):
    order_number: str
    qikink_order_id: str
    status: str  # "SUBMITTED", "IN_PRODUCTION", "PRINTED", "PACKED", "DISPATCHED", "DELIVERED", "CANCELLED"
    courier_partner: Optional[str] = None
    awb_number: Optional[str] = None
    tracking_url: Optional[str] = None
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class QikinkWalletResponse(BaseModel):
    balance_paise: int
    currency: str = "INR"
    is_low_balance: bool
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class QikinkReversePickupRequest(BaseModel):
    order_number: str = Field(max_length=MAX_QIKINK_ORDER_NUMBER_LEN)
    qikink_order_id: str
    reason: str
    items: List[QikinkLineItem]


class QikinkReversePickupResponse(BaseModel):
    success: bool
    reverse_ref: str
    status: str
    raw_response: Dict[str, Any] = Field(default_factory=dict)
