"""
Qikink API Client & Mock Implementation.
Implements the Qikink Custom API client behind a typed interface.
In 'mock' mode (default), returns realistic fake responses with zero network calls.
"""

import uuid
from abc import ABC, abstractmethod
from typing import Dict, Any

from app.core.config import settings
from app.integrations.qikink.settings import QikinkSettings
from app.integrations.qikink.schemas import (
    QikinkCreateOrderRequest,
    QikinkCreateOrderResponse,
    QikinkOrderStatusResponse,
    QikinkWalletResponse,
    QikinkReversePickupRequest,
    QikinkReversePickupResponse,
)
from app.integrations.qikink.exceptions import (
    QikinkOrderNumberLengthError,
    QikinkSkuMissingError,
)
from app.integrations.qikink.constants import MAX_QIKINK_ORDER_NUMBER_LEN


class QikinkClient(ABC):
    """Abstract client interface for Qikink Custom API."""

    def __init__(self, qikink_settings: QikinkSettings) -> None:
        self.settings = qikink_settings

    @abstractmethod
    async def submit_order(
        self, request: QikinkCreateOrderRequest
    ) -> QikinkCreateOrderResponse:
        """Submits an order with pre-created SKUs to Qikink."""
        pass

    @abstractmethod
    async def get_order_status(
        self, qikink_order_id: str, order_number: str
    ) -> QikinkOrderStatusResponse:
        """Polls status, courier details, and AWB tracking for an order."""
        pass

    @abstractmethod
    async def check_wallet_balance(self) -> QikinkWalletResponse:
        """Checks the prepaid wallet balance to ensure uninterrupted fulfillment."""
        pass

    @abstractmethod
    async def check_pincode_serviceability(self, pincode: str) -> bool:
        """Verifies if delivery pincode is serviceable by Qikink courier partners."""
        pass

    @abstractmethod
    async def request_reverse_pickup(
        self, request: QikinkReversePickupRequest
    ) -> QikinkReversePickupResponse:
        """Creates a reverse pickup return request back to Qikink warehouse."""
        pass


class MockQikinkClient(QikinkClient):
    """
    Mock implementation for development and testing.
    Never makes network requests. Validates all inputs strictly.
    """

    async def submit_order(
        self, request: QikinkCreateOrderRequest
    ) -> QikinkCreateOrderResponse:
        self.settings.log_call_environment("submit_order")

        # Assert hard 15-char boundary
        if len(request.order_number) > MAX_QIKINK_ORDER_NUMBER_LEN:
            raise QikinkOrderNumberLengthError(
                f"order_number '{request.order_number}' has {len(request.order_number)} chars; max limit is {MAX_QIKINK_ORDER_NUMBER_LEN}"
            )

        # Assert all items have SKUs (Rule 1)
        for item in request.line_items:
            if not item.sku or not item.sku.strip():
                raise QikinkSkuMissingError(
                    f"Line item missing mandatory Qikink pre-created SKU"
                )

        # Generate realistic mock partner ID
        mock_qikink_id = f"QK-{uuid.uuid4().hex[:8].upper()}"

        return QikinkCreateOrderResponse(
            success=True,
            order_number=request.order_number,
            qikink_order_id=mock_qikink_id,
            status="SUBMITTED",
            raw_response={
                "mock": True,
                "environment": self.settings.mode,
                "order_id": mock_qikink_id,
                "reference_no": request.order_number,
                "is_cod": request.is_cod,
                "cod_amount": request.cod_amount_paise / 100,
                "message": "Order successfully accepted by Qikink Mock Engine.",
            },
        )

    async def get_order_status(
        self, qikink_order_id: str, order_number: str
    ) -> QikinkOrderStatusResponse:
        self.settings.log_call_environment("get_order_status")

        return QikinkOrderStatusResponse(
            order_number=order_number,
            qikink_order_id=qikink_order_id,
            status="IN_PRODUCTION",
            courier_partner="Delhivery",
            awb_number=f"DLH{uuid.uuid4().hex[:9].upper()}",
            tracking_url=f"https://track.mock-courier.com/status/{qikink_order_id}",
            raw_response={
                "mock": True,
                "environment": self.settings.mode,
                "qikink_order_id": qikink_order_id,
                "current_step": "PRINTING_AND_CURING",
            },
        )

    async def check_wallet_balance(self) -> QikinkWalletResponse:
        self.settings.log_call_environment("check_wallet_balance")

        # Mock balance of INR 45,000 (4,500,000 paise)
        mock_balance_paise = 4_500_000
        is_low = mock_balance_paise < self.settings.wallet_min_threshold_paise

        return QikinkWalletResponse(
            balance_paise=mock_balance_paise,
            currency="INR",
            is_low_balance=is_low,
            raw_response={
                "mock": True,
                "environment": self.settings.mode,
                "wallet_balance_inr": mock_balance_paise / 100,
                "threshold_inr": self.settings.wallet_min_threshold_paise / 100,
            },
        )

    async def check_pincode_serviceability(self, pincode: str) -> bool:
        self.settings.log_call_environment("check_pincode_serviceability")
        # In mock mode, all valid 6-digit Indian pincodes are serviceable except '000000'
        if pincode == "000000" or len(pincode) != 6:
            return False
        return True

    async def request_reverse_pickup(
        self, request: QikinkReversePickupRequest
    ) -> QikinkReversePickupResponse:
        self.settings.log_call_environment("request_reverse_pickup")

        mock_reverse_ref = f"QK-REV-{uuid.uuid4().hex[:8].upper()}"
        return QikinkReversePickupResponse(
            success=True,
            reverse_ref=mock_reverse_ref,
            status="PICKUP_SCHEDULED",
            raw_response={
                "mock": True,
                "reverse_reference": mock_reverse_ref,
                "warehouse_hub": "Qikink Tirupur Hub",
                "message": "Reverse pickup scheduled with courier partner.",
            },
        )


def get_qikink_client() -> QikinkClient:
    """Factory creating the appropriate client instance."""
    q_settings = QikinkSettings(
        mode=settings.QIKINK_MODE,
        client_id=settings.QIKINK_CLIENT_ID,
        api_key=settings.QIKINK_API_KEY,
        webhook_secret=settings.QIKINK_WEBHOOK_SECRET,
        wallet_min_threshold_paise=settings.QIKINK_WALLET_MIN_THRESHOLD_PAISE,
    )

    if q_settings.is_mock:
        return MockQikinkClient(q_settings)
    
    # Sandbox and Live will use the real HTTP client once docs are verified
    raise NotImplementedError(
        f"Qikink mode '{q_settings.mode}' requires verified API credentials and endpoint testing. "
        f"Currently running in 'mock' mode."
    )
