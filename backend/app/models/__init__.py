"""
SQLAlchemy models initialization.
Exports all models so Alembic can detect full metadata.
"""

from app.core.database import Base
from app.models.product import (
    Product,
    ProductVariant,
    VariantQikinkSku,
    ProductImage,
    QikinkEnvironment,
)
from app.models.customer import Customer, Address
from app.models.order import (
    Order,
    OrderItem,
    Return,
    PaymentMethod,
    PaymentStatus,
    OrderStatus,
    ReturnStatus,
)
from app.models.payment import Payment, BankTransaction, PaymentReceipt
from app.models.waitlist import WaitlistSignup
from app.models.webhook import WebhookEvent

__all__ = [
    "Base",
    "Product",
    "ProductVariant",
    "VariantQikinkSku",
    "ProductImage",
    "QikinkEnvironment",
    "Customer",
    "Address",
    "Order",
    "OrderItem",
    "Return",
    "PaymentMethod",
    "PaymentStatus",
    "OrderStatus",
    "ReturnStatus",
    "Payment",
    "BankTransaction",
    "PaymentReceipt",
    "WaitlistSignup",
    "WebhookEvent",
]

