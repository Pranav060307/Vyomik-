"""
Payment, BankTransaction, and PaymentReceipt models.
Generic provider abstraction with dedicated support for Automatic UPI QR verification,
HDFC bank transaction reconciliation, and PDF receipt auditing.
"""

from typing import Optional, Any, Dict
from sqlalchemy import (
    ForeignKey,
    Integer,
    String,
    DateTime,
    Text,
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
        Index("ix_payments_tr", "tr"),
        Index("ix_payments_utr", "utr_number"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    
    # Provider: "upi_qr", "mock", "razorpay", "cashfree", "cod"
    provider: Mapped[str] = mapped_column(String(50), default="upi_qr", nullable=False)
    
    # Unique transaction reference e.g. VY261189421A
    tr: Mapped[Optional[str]] = mapped_column(String(50), unique=True, nullable=True)

    # Provider-assigned transaction / payment identifier
    provider_payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Status: "created", "awaiting_payment", "verifying", "paid", "failed", "expired", "manual_review"
    status: Mapped[str] = mapped_column(String(50), default="awaiting_payment", nullable=False)
    
    # Customer-provided UPI ID (e.g. vibhav@okhdfcbank or vibhav@fam)
    customer_upi_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Amount in integer Paise (1 INR = 100 Paise)
    amount_paise: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Receiving UPI ID (merchant VPA)
    receiving_vpa: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Bank UTR / UPI Reference No from HDFC Bank email
    utr_number: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)

    # Validity window
    expires_at: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    verified_at: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Complete raw response from provider webhook / bank watcher for auditing
    raw_payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    # Relationships
    order: Mapped["Order"] = relationship("Order", back_populates="payments")  # type: ignore
    receipt: Mapped[Optional["PaymentReceipt"]] = relationship("PaymentReceipt", back_populates="payment", uselist=False)
    bank_transactions: Mapped[list["BankTransaction"]] = relationship("BankTransaction", back_populates="matched_payment")

    def __repr__(self) -> str:
        return f"<Payment(id={self.id}, order_id={self.order_id}, tr='{self.tr}', status='{self.status}', utr='{self.utr_number}')>"


class BankTransaction(Base):
    __tablename__ = "bank_transactions"
    __table_args__ = (
        Index("ix_bank_txn_utr", "utr"),
        Index("ix_bank_txn_status", "status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    utr: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    amount_paise: Mapped[int] = mapped_column(Integer, nullable=False)
    payer_vpa: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    sender_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    bank_email_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    raw_email_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Foreign key to matched payment record
    matched_payment_id: Mapped[Optional[int]] = mapped_column(ForeignKey("payments.id"), nullable=True)
    
    # Status: "matched", "unmatched", "ambiguous", "manual_reconciled"
    status: Mapped[str] = mapped_column(String(50), default="matched", nullable=False)

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    # Relationship
    matched_payment: Mapped[Optional["Payment"]] = relationship("Payment", back_populates="bank_transactions")

    def __repr__(self) -> str:
        return f"<BankTransaction(id={self.id}, utr='{self.utr}', amount_paise={self.amount_paise}, status='{self.status}')>"


class PaymentReceipt(Base):
    __tablename__ = "payment_receipts"
    __table_args__ = (
        Index("ix_receipts_number", "receipt_number"),
        Index("ix_receipts_order", "order_number"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    receipt_number: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    payment_id: Mapped[int] = mapped_column(ForeignKey("payments.id", ondelete="CASCADE"), unique=True, nullable=False)
    order_number: Mapped[str] = mapped_column(String(50), nullable=False)
    pdf_file_path: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    receipt_data: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)

    issued_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    # Relationship
    payment: Mapped["Payment"] = relationship("Payment", back_populates="receipt")

    def __repr__(self) -> str:
        return f"<PaymentReceipt(id={self.id}, receipt_number='{self.receipt_number}', order_number='{self.order_number}')>"


