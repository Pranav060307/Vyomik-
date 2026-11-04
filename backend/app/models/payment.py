"""
Payment model.
Generic provider abstraction so any payment gateway (Razorpay, Stripe, Cashfree, PhonePe)
or MockProvider can be linked without altering schema.
"""

from typing import Optional, Any, Dict
from sqlalchemy import (
    ForeignKey,
    Integer,
    String,
    DateTime,
    JSON,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.base import utc_now


class Payment(Base):
    __tablename__ = "payments"
    __table_args__ = (
        Index("ix_payments_order_id", "order_id"),
        Index("ix_payments_provider_id", "provider", "provider_payment_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    
    # Generic provider name: e.g. "mock", "razorpay", "cashfree", "cod"
    provider: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Provider-assigned transaction / payment identifier
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Status: "initiated", "captured", "failed", "refunded"
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Complete raw response from provider webhook / API for auditing & reconciliation
    raw_payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    # Relationship
    order: Mapped["Order"] = relationship("Order", back_populates="payments")  # type: ignore

    def __repr__(self) -> str:
        return f"<Payment(id={self.id}, order_id={self.order_id}, provider='{self.provider}', status='{self.status}')>"
