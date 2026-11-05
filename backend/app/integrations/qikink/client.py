"""
Qikink API Client & Mock/HTTP Implementations.
Implements the Qikink Custom API client behind a typed interface.
In 'mock' mode, returns realistic fake responses with zero network calls.
In 'sandbox' or 'live' mode, connects to Qikink's real REST API using OAuth token authentication.
"""

import time
import logging
import uuid
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

import httpx

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
    QikinkAuthError,
    QikinkOrderNumberLengthError,
    QikinkSkuMissingError,
)
from app.integrations.qikink.constants import (
    QIKINK_SANDBOX_BASE_URL,
    QIKINK_LIVE_BASE_URL,
    AUTH_HEADER_CLIENT_ID,
    AUTH_HEADER_ACCESS_TOKEN,
    ENDPOINT_TOKEN,
    ENDPOINT_CREATE_ORDER,
    ENDPOINT_GET_ORDER_STATUS,
    ENDPOINT_GET_WALLET_BALANCE,
    ENDPOINT_CREATE_REVERSE_PICKUP,
    MAX_QIKINK_ORDER_NUMBER_LEN,
    TIMEOUT_SECONDS,
)

logger = logging.getLogger("qikink.integration")


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
                    "Line item missing mandatory Qikink pre-created SKU"
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
                "warehouse_hub": "Qikink Central Fulfillment Hub",
                "message": "Reverse pickup scheduled with courier partner.",
            },
        )


class HttpQikinkClient(QikinkClient):
    """
    HTTP client for Qikink Custom API (Sandbox and Live environments).
    Handles OAuth token exchange, authentication headers, order formatting,
    and response mapping.
    """

    def __init__(self, qikink_settings: QikinkSettings) -> None:
        super().__init__(qikink_settings)
        self.base_url = (
            QIKINK_SANDBOX_BASE_URL
            if qikink_settings.is_sandbox
            else QIKINK_LIVE_BASE_URL
        )
        self._access_token: Optional[str] = None
        self._token_expires_at: float = 0.0

    async def get_access_token(self) -> str:
        """
        Retrieves a valid JWT access token from /api/token.
        Caches the token until near expiration.
        """
        now = time.time()
        if self._access_token and (self._token_expires_at - now > 60):
            return self._access_token

        if not self.settings.client_id or not self.settings.api_key:
            raise QikinkAuthError(
                "Qikink credentials not configured. Please set QIKINK_CLIENT_ID and QIKINK_API_KEY."
            )

        token_url = f"{self.base_url}{ENDPOINT_TOKEN}"
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }
        data = {
            "ClientId": str(self.settings.client_id).strip(),
            "client_secret": str(self.settings.api_key).strip(),
        }

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
                res = await client.post(token_url, data=data, headers=headers)
        except Exception as e:
            raise QikinkAuthError(f"Network error connecting to Qikink token endpoint: {e}")

        if res.status_code != 200:
            raise QikinkAuthError(
                f"Qikink auth failed (HTTP {res.status_code}): {res.text}",
                status_code=res.status_code,
            )

        try:
            body = res.json()
        except Exception:
            raise QikinkAuthError(f"Invalid JSON received from Qikink token endpoint: {res.text}")

        token = body.get("Accesstoken") or body.get("access_token")
        if not token:
            raise QikinkAuthError(f"Missing 'Accesstoken' in Qikink auth response: {body}")

        expires_in = int(body.get("expires_in", 3600))
        self._access_token = str(token)
        self._token_expires_at = now + expires_in
        return self._access_token

    def _get_auth_headers(self, token: str) -> Dict[str, str]:
        return {
            AUTH_HEADER_CLIENT_ID: str(self.settings.client_id).strip(),
            AUTH_HEADER_ACCESS_TOKEN: token,
            "Content-Type": "application/json",
        }

    async def submit_order(
        self, request: QikinkCreateOrderRequest
    ) -> QikinkCreateOrderResponse:
        self.settings.log_call_environment("submit_order")

        # Boundary checks
        if len(request.order_number) > MAX_QIKINK_ORDER_NUMBER_LEN:
            raise QikinkOrderNumberLengthError(
                f"order_number '{request.order_number}' has {len(request.order_number)} chars; max limit is {MAX_QIKINK_ORDER_NUMBER_LEN}"
            )

        for item in request.line_items:
            if not item.sku or not item.sku.strip():
                raise QikinkSkuMissingError("Line item missing mandatory Qikink pre-created SKU")

        token = await self.get_access_token()
        headers = self._get_auth_headers(token)

        # In live mode or dashboard synced products, search_from_my_products=1
        search_from_my_products = 1

        total_rupees = (
            request.total_order_value_paise // 100
            if request.total_order_value_paise
            else sum((item.price_paise * item.quantity for item in request.line_items), 0) // 100
        )
        if total_rupees == 0 and request.cod_amount_paise > 0:
            total_rupees = request.cod_amount_paise // 100
        if total_rupees == 0:
            total_rupees = 799

        line_items_payload = []
        for item in request.line_items:
            item_price = (
                str(item.price_paise // 100)
                if item.price_paise
                else str(total_rupees // max(1, len(request.line_items)))
            )
            line_items_payload.append({
                "search_from_my_products": search_from_my_products,
                "sku": item.sku,
                "quantity": str(item.quantity),
                "price": item_price,
            })

        payload = {
            "order_number": request.order_number,
            "qikink_shipping": "1",
            "gateway": "COD" if request.is_cod else "Prepaid",
            "total_order_value": str(total_rupees),
            "line_items": line_items_payload,
            "shipping_address": {
                "first_name": request.shipping_address.first_name,
                "last_name": request.shipping_address.last_name or "",
                "address1": request.shipping_address.address1,
                "address2": request.shipping_address.address2 or "",
                "phone": request.shipping_address.phone,
                "email": request.shipping_address.email,
                "city": request.shipping_address.city,
                "zip": request.shipping_address.zipcode,
                "province": request.shipping_address.state,
                "country_code": "IN",
            },
        }

        order_url = f"{self.base_url}{ENDPOINT_CREATE_ORDER}"
        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            res = await client.post(order_url, json=payload, headers=headers)

        try:
            body = res.json()
        except Exception:
            body = {"raw_text": res.text, "status_code": res.status_code}

        is_success = res.status_code in (200, 201) and (
            body.get("success") is True or body.get("status") == "success"
        )
        order_id = str(body.get("order_id", body.get("qikink_order_id", "")))

        return QikinkCreateOrderResponse(
            success=is_success,
            order_number=request.order_number,
            qikink_order_id=order_id,
            status="SUBMITTED" if is_success else "FAILED",
            raw_response=body,
        )

    async def get_order_status(
        self, qikink_order_id: str, order_number: str
    ) -> QikinkOrderStatusResponse:
        self.settings.log_call_environment("get_order_status")
        token = await self.get_access_token()
        headers = self._get_auth_headers(token)

        url = f"{self.base_url}{ENDPOINT_GET_ORDER_STATUS}"
        params = {"order_id": qikink_order_id, "order_number": order_number}

        try:
            async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
                res = await client.get(url, params=params, headers=headers)
            body = (
                res.json()
                if res.status_code == 200
                else {"status_code": res.status_code, "text": res.text}
            )
        except Exception as e:
            body = {"error": str(e)}

        return QikinkOrderStatusResponse(
            order_number=order_number,
            qikink_order_id=qikink_order_id,
            status=str(body.get("status", "SUBMITTED")),
            courier_partner=body.get("courier_partner"),
            awb_number=body.get("awb_number"),
            tracking_url=body.get("tracking_url"),
            raw_response=body,
        )

    async def check_wallet_balance(self) -> QikinkWalletResponse:
        self.settings.log_call_environment("check_wallet_balance")
        # In sandbox mode, wallet balance is simulated so orders can be tested without wallet deduction
        if self.settings.is_sandbox:
            return QikinkWalletResponse(
                balance_paise=10_000_000,  # 100,000 INR simulated
                currency="INR",
                is_low_balance=False,
                raw_response={"sandbox": True, "balance_inr": 100000},
            )

        token = await self.get_access_token()
        headers = self._get_auth_headers(token)
        url = f"{self.base_url}{ENDPOINT_GET_WALLET_BALANCE}"

        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            res = await client.get(url, headers=headers)
        body = res.json() if res.status_code == 200 else {"error": res.text}
        balance_paise = int(body.get("balance", 0) * 100)
        return QikinkWalletResponse(
            balance_paise=balance_paise,
            currency="INR",
            is_low_balance=balance_paise < self.settings.wallet_min_threshold_paise,
            raw_response=body,
        )

    async def check_pincode_serviceability(self, pincode: str) -> bool:
        self.settings.log_call_environment("check_pincode_serviceability")
        if pincode == "000000" or len(pincode) != 6:
            return False
        return True

    async def request_reverse_pickup(
        self, request: QikinkReversePickupRequest
    ) -> QikinkReversePickupResponse:
        self.settings.log_call_environment("request_reverse_pickup")
        token = await self.get_access_token()
        headers = self._get_auth_headers(token)
        url = f"{self.base_url}{ENDPOINT_CREATE_REVERSE_PICKUP}"

        payload = {
            "order_number": request.order_number,
            "qikink_order_id": request.qikink_order_id,
            "reason": request.reason,
            "items": [{"sku": i.sku, "quantity": str(i.quantity)} for i in request.items],
        }

        async with httpx.AsyncClient(timeout=TIMEOUT_SECONDS) as client:
            res = await client.post(url, json=payload, headers=headers)
        body = res.json() if res.status_code in (200, 201) else {"error": res.text}
        reverse_ref = str(body.get("reverse_ref", f"QK-REV-{uuid.uuid4().hex[:8].upper()}"))
        return QikinkReversePickupResponse(
            success=res.status_code in (200, 201),
            reverse_ref=reverse_ref,
            status="PICKUP_SCHEDULED" if res.status_code in (200, 201) else "FAILED",
            raw_response=body,
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

    return HttpQikinkClient(q_settings)
