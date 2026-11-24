"""
Pydantic schemas for Automatic UPI QR Payment Verification & Receipt System.
Adheres strictly to standard UPI specifications, integer Paise amounts,
and ChampsArena-style callback structures.
"""

import re
from datetime import datetime
from typing import Optional, List, Dict, Any, Literal
from pydantic import BaseModel, Field, field_validator


UPI_REGEX = re.compile(r"^[a-zA-Z0-9._*#\-]+@[a-zA-Z0-9.\-]+$")


class CreateUpiQrRequest(BaseModel):
    order_number: str = Field(..., description="Public order number e.g. VY2611ABC12")
    customer_upi_id: str = Field(..., description="Customer VPA / UPI ID e.g. vibhav@okhdfcbank")
    amount_paise: Optional[int] = Field(None, description="Optional explicit amount in paise. Defaults to order total.")

    @field_validator("customer_upi_id")
    @classmethod
    def validate_customer_upi(cls, v: str) -> str:
        clean = v.strip().lower()
        if not UPI_REGEX.match(clean):
            raise ValueError(
                f"Invalid UPI ID format '{v}'. Must be a standard VPA handle (e.g. name@okhdfcbank, user@fam, user@okaxis)"
            )
        return clean


class CreateUpiQrResponse(BaseModel):
    tr: str = Field(..., description="Unique transaction reference for tracking")
    order_number: str
    amount_paise: int
    amount_inr: float
    merchant_vpa: str
    merchant_name: str
    customer_upi_id: str
    upi_uri: str
    qr_base64: str
    expires_at: datetime
    status: str


class PaymentStatusResponse(BaseModel):
    tr: str
    order_number: str
    status: Literal["created", "awaiting_payment", "verifying", "paid", "failed", "expired", "manual_review"]
    amount_paise: int
    amount_inr: float
    customer_upi_id: Optional[str] = None
    receiving_vpa: Optional[str] = None
    utr_number: Optional[str] = None
    paid_at: Optional[datetime] = None
    receipt_url: Optional[str] = None
    receipt_number: Optional[str] = None
    message: Optional[str] = None


class WatcherCallbackRequest(BaseModel):
    orderId: Optional[str] = Field(None, description="Order identifier or TR if present in email")
    status: str = Field("paid", description="Status reported by watcher")
    paidAt: Optional[str] = Field(None, description="ISO timestamp of credit")
    utr: str = Field(..., description="HDFC Bank UPI Reference No / UTR")
    amount: Optional[float] = Field(None, description="Transaction amount in INR")
    senderUpi: Optional[str] = Field(None, description="Extracted sender VPA (can be masked e.g. *******atel@fam)")
    senderName: Optional[str] = Field(None, description="Extracted sender full name")
    userId: Optional[str] = None
    tournamentId: Optional[str] = None
    rawSnippet: Optional[str] = Field(None, description="Preview of bank notification email")


class WatcherCallbackResponse(BaseModel):
    ok: bool
    tr: str
    order_number: str
    status: str
    message: str
    alreadyProcessed: bool = False
    receipt_url: Optional[str] = None


class ManualReconciliationRequest(BaseModel):
    tr: str = Field(..., description="Transaction reference (TR) of the pending order to reconcile")
    utr: str = Field(..., description="Bank UTR / UPI Reference No from bank notification")
    notes: str = Field(..., description="Audit justification for manual approval")
    admin_email: Optional[str] = "operations@vyomik.com"


class PaymentAuditItem(BaseModel):
    id: int
    tr: str
    order_number: str
    customer_name: Optional[str] = None
    customer_email: Optional[str] = None
    customer_upi_id: Optional[str] = None
    amount_paise: int
    amount_inr: float
    status: str
    utr_number: Optional[str] = None
    created_at: datetime
    verified_at: Optional[datetime] = None
    receipt_number: Optional[str] = None


class AdminPaymentsListResponse(BaseModel):
    total_volume_paise: int
    total_volume_inr: float
    total_count: int
    verified_count: int
    awaiting_count: int
    manual_review_count: int
    failed_count: int
    payments: List[PaymentAuditItem]


class ReceiptDetailResponse(BaseModel):
    receipt_number: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_upi_id: Optional[str] = None
    amount_paise: int
    amount_inr: float
    utr_number: str
    receiving_vpa: str
    payment_status: str
    issued_at: datetime
    items: List[Dict[str, Any]]
    pricing: Dict[str, Any]
    download_url: str
