import pytest
from app.integrations.payment.base import (
    CreatePaymentOrderRequest,
    VerifyPaymentRequest,
    RefundRequest,
)
from app.integrations.payment.mock import MockPaymentProvider
from app.integrations.payment.factory import get_payment_provider


@pytest.mark.asyncio
async def test_mock_payment_create_order():
    provider = MockPaymentProvider()
    req = CreatePaymentOrderRequest(
        public_order_number="VY261108A7K9M",
        amount_paise=119900,
        customer_email="test@vyomik.com",
    )
    res = await provider.create_payment_order(req)

    assert res.provider == "mock"
    assert res.amount_paise == 119900
    assert res.currency == "INR"
    assert res.provider_order_id.startswith("mock_order_")
    assert "mock_mode" in res.client_payload


@pytest.mark.asyncio
async def test_mock_payment_verify_success():
    provider = MockPaymentProvider()
    req = VerifyPaymentRequest(
        provider_order_id="mock_order_123456",
        provider_payment_id="mock_pay_987654",
    )
    res = await provider.verify_payment(req)

    assert res.is_successful is True
    assert res.provider == "mock"
    assert res.status == "captured"
    assert res.error_message is None


@pytest.mark.asyncio
async def test_mock_payment_verify_simulated_failure():
    provider = MockPaymentProvider()
    req = VerifyPaymentRequest(
        provider_order_id="mock_order_123456",
        provider_payment_id="mock_pay_fail",
        raw_payload={"simulate_failure": True},
    )
    res = await provider.verify_payment(req)

    assert res.is_successful is False
    assert res.status == "failed"
    assert "Simulated transaction failure" in (res.error_message or "")


@pytest.mark.asyncio
async def test_mock_payment_process_refund():
    provider = MockPaymentProvider()
    req = RefundRequest(
        provider_payment_id="mock_pay_987654",
        amount_paise=119900,
        reason="Customer requested cancellation",
    )
    res = await provider.process_refund(req)

    assert res.is_successful is True
    assert res.refund_id.startswith("mock_rfnd_")
    assert res.status == "processed"


def test_payment_provider_factory():
    provider = get_payment_provider()
    assert isinstance(provider, MockPaymentProvider)
    assert provider.provider_name == "mock"

