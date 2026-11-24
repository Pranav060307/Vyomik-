"""
MongoDB Document Models for Orders, Payments & Qikink Fulfillment using Beanie ODM.
"""

from datetime import datetime, timezone
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from beanie import Document, Indexed


class ShippingAddressDoc(BaseModel):
    first_name: str
    last_name: Optional[str] = ""
    address1: str
    address2: Optional[str] = ""
    city: str
    state: str
    zipcode: str
    phone: str
    email: str


class OrderItemDoc(BaseModel):
    product_id: Optional[str] = None
    variant_id: Optional[str] = None
    title: str
    size: str
    color: str
    qty: int = Field(gt=0, default=1)
    price_paise: int = Field(ge=0)
    sku: str


class PricingDoc(BaseModel):
    subtotal_paise: int = Field(ge=0)
    shipping_fee_paise: int = Field(ge=0)
    cod_fee_paise: int = Field(ge=0)
    total_paise: int = Field(ge=0)


class PaymentDoc(BaseModel):
    method: str = "prepaid"  # "prepaid" | "cod"
    status: str = "captured"  # "awaiting_payment" | "verifying" | "paid" | "captured" | "failed" | "manual_review"
    provider: str = "upi_qr"  # "upi_qr" | "razorpay" | "cashfree" | "stripe" | "mock"
    transaction_id: Optional[str] = None
    tr: Optional[str] = None
    customer_upi_id: Optional[str] = None
    utr_number: Optional[str] = None
    verified_at: Optional[datetime] = None
    receipt_number: Optional[str] = None
    raw_payload: Dict[str, Any] = Field(default_factory=dict)


class FulfillmentDoc(BaseModel):
    provider: str = "qikink"
    environment: str = "sandbox"  # "sandbox" | "live"
    qikink_order_id: Optional[str] = None
    status: str = "PENDING"  # "SUBMITTED" | "FAILED" | "DISPATCHED" | "DELIVERED"
    courier_partner: Optional[str] = None
    awb_number: Optional[str] = None
    tracking_url: Optional[str] = None
    pushed_at: Optional[datetime] = None
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class OrderDoc(Document):
    # Strict cap of 15 characters enforced for Qikink
    public_order_number: Indexed(str, unique=True)
    customer_email: Indexed(str)
    shipping_address: ShippingAddressDoc
    items: List[OrderItemDoc]
    pricing: PricingDoc
    payment: PaymentDoc
    fulfillment: FulfillmentDoc
    order_status: str = "CONFIRMED"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Settings:
        name = "orders"
        indexes = [
            "public_order_number",
            "customer_email",
            "order_status",
            "fulfillment.qikink_order_id",
        ]
