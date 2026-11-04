import pytest
from pydantic import ValidationError
from app.integrations.qikink.client import get_qikink_client, MockQikinkClient
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
    AUTH_HEADER_API_KEY,
    MAX_QIKINK_ORDER_NUMBER_LEN,
)


def test_qikink_auth_headers_exact_keys():
    """Assert authentication header constants match required case-sensitive keys."""
    assert AUTH_HEADER_CLIENT_ID == "X-Qikink-Client-Id"
    assert AUTH_HEADER_API_KEY == "X-Qikink-Api-Key"
    assert MAX_QIKINK_ORDER_NUMBER_LEN == 15


@pytest.mark.asyncio
async def test_qikink_mock_submit_order_success():
    client = get_qikink_client()
    assert isinstance(client, MockQikinkClient)

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

    res = await client.submit_order(req)
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
    client = get_qikink_client()
    with pytest.raises(ValidationError):
        QikinkLineItem(sku="", quantity=1)


@pytest.mark.asyncio
async def test_qikink_wallet_balance_check():
    client = get_qikink_client()
    res = await client.check_wallet_balance()

    assert res.currency == "INR"
    assert res.balance_paise > 0
    assert isinstance(res.is_low_balance, bool)


@pytest.mark.asyncio
async def test_qikink_pincode_serviceability():
    client = get_qikink_client()
    assert await client.check_pincode_serviceability("560038") is True
    assert await client.check_pincode_serviceability("000000") is False


@pytest.mark.asyncio
async def test_qikink_reverse_pickup_request():
    client = get_qikink_client()
    req = QikinkReversePickupRequest(
        order_number="VY261108A7K9M",
        qikink_order_id="QK-984210",
        reason="Size too large, exchange requested",
        items=[QikinkLineItem(sku="VY-PL-IVO-M", quantity=1)],
    )
    res = await client.request_reverse_pickup(req)
    assert res.success is True
    assert res.reverse_ref.startswith("QK-REV-")
    assert res.status == "PICKUP_SCHEDULED"
