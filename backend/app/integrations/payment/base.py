"""
Payment Provider Interface & Data Contracts.
Designed so any provider (Razorpay, Stripe, Cashfree, PhonePe) can be plugged in
by writing a single adapter class and setting PAYMENT_PROVIDER in .env.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional
from pydantic import BaseModel, Field


class CreatePaymentOrderRequest(BaseModel):
    public_order_number: str = Field(max_length=15)
    amount_paise: int = Field(gt=0, description="Amount in integer Paise (INR)")
    customer_email: str
    customer_phone: Optional[str] = None
    notes: Dict[str, Any] = Field(default_factory=dict)


class CreatePaymentOrderResponse(BaseModel):
    provider: str
    provider_order_id: str
    amount_paise: int
    currency: str = "INR"
    client_payload: Dict[str, Any] = Field(
        default_factory=dict,
        description="Data returned to frontend SDK to initiate gateway modal / checkout flow"
    )


class VerifyPaymentRequest(BaseModel):
    provider_order_id: str
    provider_payment_id: str
    signature: Optional[str] = None
    raw_payload: Dict[str, Any] = Field(default_factory=dict)


class VerifyPaymentResponse(BaseModel):
    is_successful: bool
    provider: str
    provider_payment_id: str
    status: str  # "captured", "failed", "pending"
    error_message: Optional[str] = None
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class RefundRequest(BaseModel):
    provider_payment_id: str
    amount_paise: int
    reason: str


class RefundResponse(BaseModel):
    is_successful: bool
    refund_id: str
    amount_paise: int
    status: str
    raw_response: Dict[str, Any] = Field(default_factory=dict)


class PaymentProvider(ABC):
    """
    Abstract interface for payment gateway implementations.
    """

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the unique identifier of the payment provider."""
        pass

    @abstractmethod
    async def create_payment_order(
        self, request: CreatePaymentOrderRequest
    ) -> CreatePaymentOrderResponse:
        """Initializes a transaction with the payment gateway."""
        pass

    @abstractmethod
    async def verify_payment(
        self, request: VerifyPaymentRequest
    ) -> VerifyPaymentResponse:
        """Verifies payment signature / callback confirmation from gateway."""
        pass

    @abstractmethod
    async def process_refund(self, request: RefundRequest) -> RefundResponse:
        """Executes a full or partial refund through the provider."""
        pass

    @abstractmethod
    async def parse_webhook(
        self, headers: Dict[str, str], body: bytes
    ) -> Dict[str, Any]:
        """Validates webhook authenticity and returns parsed payload."""
        pass
