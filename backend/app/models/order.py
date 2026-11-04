"""
Order, OrderItem, and Returns models.
All monetary amounts are strictly persisted in integer Paise (1 INR = 100 Paise).
Public order numbers are limited to 15 characters max to adhere to Qikink partner requirements.
"""

import enum
from typing import List, Optional, Any, Dict
from sqlalchemy import (
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import TimestampMixin


class PaymentMethod(str, enum.Enum):
    PREPAID = "prepaid"
    COD = "cod"


class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUNDED = "refunded"


class OrderStatus(str, enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    DISPATCHED = "dispatched"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


class ReturnStatus(str, enum.Enum):
    REQUESTED = "requested"
    PICKUP_SCHEDULED = "pickup_scheduled"
    RECEIVED_IN_WAREHOUSE = "received_in_warehouse"
    RESTOCKED = "restocked"
    REFUNDED = "refunded"
    REJECTED = "rejected"


class Order(Base, TimestampMixin):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint("length(public_order_number) <= 15", name="ck_public_order_number_length"),
        Index("ix_orders_customer_id", "customer_id"),
        Index("ix_orders_public_order_num", "public_order_number"),
        Index("ix_orders_status", "order_status"),
        Index("ix_orders_qikink_order_id", "qikink_order_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # Partner requirement: Qikink order_number limit <= 15 chars
    public_order_number: Mapped[str] = mapped_column(String(15), unique=True, nullable=False)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"), nullable=False)
    
    # Complete frozen snapshot of recipient details & delivery address at order time
    address_snapshot: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)

    # Financial breakdown in integer Paise
    subtotal: Mapped[int] = mapped_column(Integer, nullable=False, comment="Cart subtotal in Paise")
    shipping_fee: Mapped[int] = mapped_column(Integer, default=0, nullable=False, comment="Shipping fee in Paise")
    cod_fee: Mapped[int] = mapped_column(Integer, default=0, nullable=False, comment="COD fee in Paise")
    total: Mapped[int] = mapped_column(Integer, nullable=False, comment="Grand total in Paise")

    # Payment & Fulfillment State
    payment_method: Mapped[PaymentMethod] = mapped_column(
        Enum(PaymentMethod, name="payment_method_enum"),
        nullable=False,
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus, name="payment_status_enum"),
        default=PaymentStatus.PENDING,
        nullable=False,
    )
    order_status: Mapped[OrderStatus] = mapped_column(
        Enum(OrderStatus, name="order_status_enum"),
        default=OrderStatus.PENDING,
        nullable=False,
    )

    # Qikink Partner Tracking
    qikink_order_id: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    qikink_status: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)

    # Relationships
    customer: Mapped["Customer"] = relationship("Customer", back_populates="orders")  # type: ignore
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    payments: Mapped[List["Payment"]] = relationship("Payment", back_populates="order")  # type: ignore
    returns: Mapped[List["Return"]] = relationship("Return", back_populates="order")

    def __repr__(self) -> str:
        return f"<Order(id={self.id}, number='{self.public_order_number}', total={self.total}p)>"


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    variant_id: Mapped[int] = mapped_column(ForeignKey("product_variants.id"), nullable=False)
    qty: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[int] = mapped_column(Integer, nullable=False, comment="Unit price at checkout in Paise")
    sku_snapshot: Mapped[str] = mapped_column(String(80), nullable=False)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="items")
    variant: Mapped["ProductVariant"] = relationship("ProductVariant")  # type: ignore


class Return(Base, TimestampMixin):
    __tablename__ = "returns"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[ReturnStatus] = mapped_column(
        Enum(ReturnStatus, name="return_status_enum"),
        default=ReturnStatus.REQUESTED,
        nullable=False,
    )
    # Reference ID returned by Qikink reverse pickup API
    qikink_reverse_ref: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="returns")

