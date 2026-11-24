"""
Pydantic v2 validation contracts for Orders, Checkout, and Fulfillment.
"""

from typing import List, Optional, Any, Dict, Union
from pydantic import BaseModel, Field, EmailStr


class OrderAddressSchema(BaseModel):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: Optional[str] = Field(default="", max_length=100)
    address1: str = Field(min_length=1, max_length=255)
    address2: Optional[str] = Field(default="", max_length=255)
    city: str = Field(min_length=1, max_length=100)
    state: str = Field(min_length=1, max_length=100)
    zipcode: str = Field(min_length=3, max_length=20, description="Postal code")
    phone: str = Field(min_length=5, max_length=25, description="Customer contact phone number")
    email: EmailStr = Field(description="Customer receipt and tracking notification email")


class OrderItemInput(BaseModel):
    product_id: Optional[Union[int, str]] = None
    variant_id: Optional[Union[int, str]] = None
    title: str = Field(min_length=1)
    color: str = Field(default="White")
    size: str = Field(default="M")
    qty: int = Field(gt=0, le=10, default=1)
    price_paise: int = Field(ge=0, description="Price per unit in Paise")
    sku: Optional[str] = Field(default=None, description="Qikink variant SKU")


class CreateOrderRequest(BaseModel):
    shipping_address: OrderAddressSchema
    payment_method: str = Field(default="prepaid", pattern=r"^(prepaid|cod)$")
    items: List[OrderItemInput] = Field(min_length=1)
    notes: Optional[str] = None


class OrderItemDetail(BaseModel):
    id: int
    title: str
    size: str
    color: str
    qty: int
    unit_price: int
    sku_snapshot: str


class OrderDetailResponse(BaseModel):
    id: int
    public_order_number: str
    order_status: str
    payment_method: str
    payment_status: str
    subtotal: int
    shipping_fee: int
    cod_fee: int
    total: int
    qikink_order_id: Optional[str] = None
    qikink_status: Optional[str] = None
    created_at: str
    shipping_address: Dict[str, Any]
    items: List[OrderItemDetail] = []


class OrderSubmissionResponse(BaseModel):
    success: bool
    order_number: str
    qikink_order_id: Optional[str] = None
    status: str
    message: str
    subtotal_paise: int
    shipping_fee_paise: int
    cod_fee_paise: int
    total_paise: int
    raw_response: Dict[str, Any] = Field(default_factory=dict)
