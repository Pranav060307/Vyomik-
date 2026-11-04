"""
Mock Payment Provider.
Default provider used while the real payment gateway is being finalized.
Allows complete end-to-end frontend checkout, verification, and refund flows
with zero third-party dependencies or external network calls.
"""

import uuid
from typing import Any, Dict
from app.core.config import settings
from app.integrations.payment.base import (
    PaymentProvider,
    CreatePaymentOrderRequest,
    CreatePaymentOrderResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
    RefundRequest,
    RefundResponse,
)


class MockPaymentProvider(PaymentProvider):
    @property
    def provider_name(self) -> str:
        return "mock"

    async def create_payment_order(
        self, request: CreatePaymentOrderRequest
    ) -> CreatePaymentOrderResponse:
        mock_order_id = f"mock_order_{uuid.uuid4().hex[:12]}"
        return CreatePaymentOrderResponse(
            provider=self.provider_name,
            provider_order_id=mock_order_id,
            amount_paise=request.amount_paise,
            currency="INR",
            client_payload={
                "mock_mode": True,
                "order_number": request.public_order_number,
                "provider_order_id": mock_order_id,
                "amount_paise": request.amount_paise,
                "auto_success": settings.MOCK_PAYMENT_AUTO_SUCCESS,
                "message": "Demo payment provider active. No actual bank transaction will be made.",
            },
        )

    async def verify_payment(
        self, request: VerifyPaymentRequest
    ) -> VerifyPaymentResponse:
        # If simulated failure is requested in payload, return failed
        should_fail = request.raw_payload.get("simulate_failure", False)
        
        if should_fail:
            return VerifyPaymentResponse(
                is_successful=False,
                provider=self.provider_name,
                provider_payment_id=request.provider_payment_id or f"mock_pay_{uuid.uuid4().hex[:10]}",
                status="failed",
                error_message="Simulated transaction failure in mock payment provider.",
                raw_response={"mock_status": "FAILED", "reason": "user_simulation"},
            )

        mock_pay_id = request.provider_payment_id or f"mock_pay_{uuid.uuid4().hex[:12]}"
        return VerifyPaymentResponse(
            is_successful=True,
            provider=self.provider_name,
            provider_payment_id=mock_pay_id,
            status="captured",
            error_message=None,
            raw_response={
                "mock_status": "SUCCESS",
                "payment_id": mock_pay_id,
                "order_id": request.provider_order_id,
                "mode": "test_sandbox",
            },
        )

    async def process_refund(self, request: RefundRequest) -> RefundResponse:
        mock_refund_id = f"mock_rfnd_{uuid.uuid4().hex[:10]}"
        return RefundResponse(
            is_successful=True,
            refund_id=mock_refund_id,
            amount_paise=request.amount_paise,
            status="processed",
            raw_response={
                "refund_id": mock_refund_id,
                "payment_id": request.provider_payment_id,
                "amount": request.amount_paise,
                "status": "refund_completed_mock",
            },
        )

    async def parse_webhook(
        self, headers: Dict[str, str], body: bytes
    ) -> Dict[str, Any]:
        return {
            "event": "mock.payment.captured",
            "provider": self.provider_name,
            "raw_body_length": len(body),
        }

