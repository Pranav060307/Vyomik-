"""
Pydantic schemas for VYOMIK Admin Operations Console.
"""

from typing import List, Optional, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel


class AdminBaseModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        extra="ignore",
    )


# --- Orders & Fulfillment ---
class AdminOrderItemResponse(AdminBaseModel):
    id: str
    sku: str
    product_title: str
    variant_title: str
    quantity: int
    unit_price_paise: int
    total_price_paise: int
    image: Optional[str] = None


class AdminShippingAddressResponse(AdminBaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    postal_code: str
    country: str = "India"


class AdminOrderResponse(AdminBaseModel):
    id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    status: str
    payment_status: str
    payment_method: str
    subtotal_paise: int
    shipping_fee_paise: int
    cod_fee_paise: int
    discount_paise: int = 0
    total_paise: int
    items: List[AdminOrderItemResponse]
    shipping_address: AdminShippingAddressResponse
    qikink_order_id: Optional[str] = None
    qikink_status: Optional[str] = None
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    notes: Optional[str] = None
    created_at: str
    updated_at: str


class UpdateOrderRequest(BaseModel):
    status: Optional[str] = None
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None
    qikink_status: Optional[str] = None
    notes: Optional[str] = None


# --- Dashboard Analytics ---
class SalesTrendItem(BaseModel):
    day: str
    amount_paise: int
    orders_count: int


class RecentOrderSummary(BaseModel):
    order_number: str
    customer_name: str
    total_paise: int
    status: str
    payment_status: str
    payment_method: str
    created_at: str


class AdminDashboardMetrics(BaseModel):
    total_net_sales_paise: int
    total_orders_count: int
    aov_paise: int
    waitlist_subscribers_count: int
    sales_7d: List[SalesTrendItem]
    recent_orders: List[RecentOrderSummary]
    api_status: str = "healthy"
    mongo_status: str = "connected"
    sql_status: str = "connected"
    qikink_configured: bool = True
    api_latency_ms: int = 12


# --- Customers CRM ---
class AdminCustomerResponse(BaseModel):
    id: str
    full_name: str
    email: str
    phone: str
    city: str
    total_orders: int
    total_spent_paise: int
    last_order_date: str
    is_vip: bool


# --- Inventory Matrix ---
class AdminInventoryItem(BaseModel):
    id: str
    sku: str
    product_title: str
    category: str
    size: str
    color: str
    stock_type: str = "POD On-Demand"
    in_stock: bool = True
    units_available: int = 25
    low_stock_threshold: int = 5


class UpdateInventoryRequest(BaseModel):
    in_stock: Optional[bool] = None
    units_available: Optional[int] = None
    low_stock_threshold: Optional[int] = None


# --- Discounts & Coupons ---
class AdminDiscountResponse(BaseModel):
    id: str
    code: str
    discount_type: str
    discount_value: int
    min_subtotal_paise: int
    usage_limit: int
    usage_count: int
    is_active: bool
    starts_at: Optional[str] = None
    expires_at: Optional[str] = None


class CreateDiscountRequest(BaseModel):
    code: str = Field(min_length=3, max_length=20)
    discount_type: str = Field(default="percentage", pattern="^(percentage|fixed_paise|free_shipping)$")
    discount_value: int = Field(ge=0)
    min_subtotal_paise: int = Field(default=0, ge=0)
    usage_limit: int = Field(default=100, gt=0)
    is_active: bool = True


class ValidateDiscountRequest(BaseModel):
    code: str
    subtotal_paise: int


class ValidateDiscountResponse(BaseModel):
    valid: bool
    message: str
    code: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[int] = None
    discount_paise: int = 0


# --- Reviews & UGC ---
class AdminReviewResponse(BaseModel):
    id: str
    product_slug: str
    product_title: str
    customer_name: str
    rating: int
    title: str
    comment: str
    verified_purchase: bool
    status: str
    created_at: str


class UpdateReviewStatusRequest(BaseModel):
    status: str = Field(pattern="^(approved|pending|flagged)$")


class CreateReviewRequest(BaseModel):
    product_slug: str
    product_title: str
    customer_name: str
    customer_email: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    title: str = Field(min_length=2, max_length=120)
    comment: str = Field(min_length=5, max_length=1000)


# --- Store Settings Overrides ---
class UpdateStoreSettingsRequest(BaseModel):
    free_shipping_threshold_paise: Optional[int] = None
    cod_fee_paise: Optional[int] = None
    store_mode: Optional[str] = None
    announcement_message: Optional[str] = None
