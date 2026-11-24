"""
Pricing & Cart Arithmetic Service.
Rule: All money values are strictly modeled and calculated as integer Paise (INR).
Never trust client-submitted unit prices; all prices must be validated against DB.
"""

from typing import List
from pydantic import BaseModel, Field

from app.core.config import settings
from app.models.order import PaymentMethod


class CartItemValidation(BaseModel):
    variant_id: int
    qty: int = Field(gt=0, description="Quantity must be greater than zero")
    unit_price: int = Field(ge=0, description="Verified unit price in integer Paise")
    sku_snapshot: str


class PricingBreakdown(BaseModel):
    subtotal: int = Field(ge=0, description="Sum of (qty * unit_price) in Paise")
    shipping_fee: int = Field(ge=0, description="Shipping cost in Paise")
    cod_fee: int = Field(ge=0, description="Cash on delivery fee in Paise")
    total: int = Field(ge=0, description="Grand total in Paise")
    is_free_shipping: bool
    free_shipping_threshold: int
    amount_needed_for_free_shipping: int


def calculate_order_pricing(
    items: List[CartItemValidation],
    payment_method: PaymentMethod,
) -> PricingBreakdown:
    """
    Computes exact, server-validated order pricing breakdown in integer Paise.
    """
    if not items:
        raise ValueError("Cannot calculate pricing for empty cart items.")

    subtotal = sum(item.qty * item.unit_price for item in items)

    # Free shipping rule (free for standard threshold or test transactions <= Rs 1)
    threshold = settings.FREE_SHIPPING_THRESHOLD_PAISE
    if subtotal >= threshold or subtotal <= 100:
        shipping_fee = 0
        is_free_shipping = True
        amount_needed = 0
    else:
        shipping_fee = settings.DEFAULT_SHIPPING_FEE_PAISE
        is_free_shipping = False
        amount_needed = threshold - subtotal

    # COD fee rule
    cod_fee = 0
    if payment_method == PaymentMethod.COD:
        if not settings.COD_AVAILABLE:
            raise ValueError("Cash on delivery is currently unavailable.")
        cod_fee = settings.COD_FEE_PAISE

    total = subtotal + shipping_fee + cod_fee

    return PricingBreakdown(
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        cod_fee=cod_fee,
        total=total,
        is_free_shipping=is_free_shipping,
        free_shipping_threshold=threshold,
        amount_needed_for_free_shipping=amount_needed,
    )


def paise_to_inr_display(paise: int) -> str:
    """Formats integer paise into standard Indian Rupee string, e.g. 119900 -> '₹1,199'"""
    rupees = paise / 100
    if rupees.is_integer():
        return f"₹{int(rupees):,}"
    return f"₹{rupees:,.2f}"

