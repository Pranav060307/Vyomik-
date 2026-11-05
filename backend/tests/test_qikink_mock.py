import pytest
from pydantic import ValidationError
from app.core.config import settings
from app.integrations.qikink.client import (
    get_qikink_client,
    MockQikinkClient,
    HttpQikinkClient,
)
from app.integrations.qikink.settings import QikinkSettings
from app.integrations.qikink.schemas import (
    QikinkCreateOrderRequest,
    QikinkShippingAddress,
    QikinkLineItem,
    QikinkReversePickupRequest,
)
from app.integrations.qikink.exceptions import (
    QikinkOrderNumberLengthError,
    QikinkSkuMissingError,
)
from app.integrations.qikink.constants import (
    AUTH_HEADER_CLIENT_ID,
    AUTH_HEADER_ACCESS_TOKEN,
    AUTH_HEADER_API_KEY,
    MAX_QIKINK_ORDER_NUMBER_LEN,
)


@pytest.fixture
def mock_client() -> MockQikinkClient:
    return MockQikinkClient(QikinkSettings(mode="mock"))


def test_qikink_auth_headers_exact_keys():
    """Assert authentication header constants match required case-sensitive keys."""
    assert AUTH_HEADER_CLIENT_ID == "ClientId"
    assert AUTH_HEADER_ACCESS_TOKEN == "Accesstoken"
    assert AUTH_HEADER_API_KEY == "X-Qikink-Api-Key"
    assert MAX_QIKINK_ORDER_NUMBER_LEN == 15


def test_qikink_client_factory_switching(monkeypatch):
    """Assert get_qikink_client respects QIKINK_MODE configuration."""
    monkeypatch.setattr(settings, "QIKINK_MODE", "mock")
    client_mock = get_qikink_client()
    assert isinstance(client_mock, MockQikinkClient)

    monkeypatch.setattr(settings, "QIKINK_MODE", "sandbox")
    monkeypatch.setattr(settings, "QIKINK_CLIENT_ID", "977241055248744")
    monkeypatch.setattr(settings, "QIKINK_API_KEY", "5035a27d101638bea11c2220543016821d7320522f779599aa3a007582b5abb8")
    client_sandbox = get_qikink_client()
    assert isinstance(client_sandbox, HttpQikinkClient)
    assert client_sandbox.settings.is_sandbox is True


@pytest.mark.asyncio
async def test_qikink_mock_submit_order_success(mock_client: MockQikinkClient):
    req = QikinkCreateOrderRequest(
        order_number="VY261108A7K9M",  # 13 chars <= 15 chars
        shipping_address=QikinkShippingAddress(
            first_name="Aarav",
            last_name="Sharma",
            address1="12th Main, Indiranagar",
            city="Bengaluru",
            state="Karnataka",
            zipcode="560038",
            phone="9876543210",
            email="aarav@vyomik.com",
        ),
        line_items=[
            QikinkLineItem(sku="VY-PL-IVO-M", quantity=1),
            QikinkLineItem(sku="VY-HD-STN-L", quantity=1),
        ],
        is_cod=False,
        cod_amount_paise=0,
    )

    res = await mock_client.submit_order(req)
    assert res.success is True
    assert res.order_number == "VY261108A7K9M"
    assert res.qikink_order_id.startswith("QK-")
    assert res.status == "SUBMITTED"
    assert res.raw_response["mock"] is True


@pytest.mark.asyncio
async def test_qikink_order_number_length_boundary_rejection():
    """Validates that order numbers over 15 characters are rejected."""
    # Test Pydantic schema validation boundary
    with pytest.raises(ValidationError):
        QikinkCreateOrderRequest(
            order_number="VY261108123456789",  # 17 chars > 15
            shipping_address=QikinkShippingAddress(
                first_name="Aarav",
                address1="12th Main",
                city="Bengaluru",
                state="Karnataka",
                zipcode="560038",
                phone="9876543210",
                email="aarav@vyomik.com",
            ),
            line_items=[QikinkLineItem(sku="VY-PL-IVO-M", quantity=1)],
        )


@pytest.mark.asyncio
async def test_qikink_missing_sku_rejection():
    with pytest.raises(ValidationError):
        QikinkLineItem(sku="", quantity=1)


@pytest.mark.asyncio
async def test_qikink_wallet_balance_check(mock_client: MockQikinkClient):
    res = await mock_client.check_wallet_balance()

    assert res.currency == "INR"
    assert res.balance_paise > 0
    assert isinstance(res.is_low_balance, bool)


@pytest.mark.asyncio
async def test_qikink_pincode_serviceability(mock_client: MockQikinkClient):
    assert await mock_client.check_pincode_serviceability("560038") is True
    assert await mock_client.check_pincode_serviceability("000000") is False


@pytest.mark.asyncio
async def test_qikink_reverse_pickup_request(mock_client: MockQikinkClient):
    req = QikinkReversePickupRequest(
        order_number="VY261108A7K9M",
        qikink_order_id="QK-984210",
        reason="Size too large, exchange requested",
        items=[QikinkLineItem(sku="VY-PL-IVO-M", quantity=1)],
    )
    res = await mock_client.request_reverse_pickup(req)
    assert res.success is True
    assert res.reverse_ref.startswith("QK-REV-")
    assert res.status == "PICKUP_SCHEDULED"
