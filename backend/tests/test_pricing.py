import pytest
from app.models.order import PaymentMethod
from app.services.pricing import (
    calculate_order_pricing,
    CartItemValidation,
    paise_to_inr_display,
)


def test_pricing_below_free_shipping_threshold_prepaid():
    items = [
        CartItemValidation(
            variant_id=1,
            qty=1,
            unit_price=119900,  # Rs. 1,199 (below Rs. 1,499 threshold)
            sku_snapshot="VY-PL-IVO-M",
        )
    ]
    breakdown = calculate_order_pricing(items, PaymentMethod.PREPAID)

    assert breakdown.subtotal == 119900
    assert breakdown.shipping_fee == 9900  # Rs. 99
    assert breakdown.cod_fee == 0
    assert breakdown.total == 119900 + 9900
    assert breakdown.is_free_shipping is False
    assert breakdown.amount_needed_for_free_shipping == 149900 - 119900


def test_pricing_above_free_shipping_threshold_prepaid():
    items = [
        CartItemValidation(
            variant_id=1,
            qty=2,
            unit_price=119900,  # 2 * 1,199 = Rs. 2,398 (above Rs. 1,499)
            sku_snapshot="VY-PL-IVO-M",
        )
    ]
    breakdown = calculate_order_pricing(items, PaymentMethod.PREPAID)

    assert breakdown.subtotal == 239800
    assert breakdown.shipping_fee == 0
    assert breakdown.cod_fee == 0
    assert breakdown.total == 239800
    assert breakdown.is_free_shipping is True
    assert breakdown.amount_needed_for_free_shipping == 0


def test_pricing_with_cash_on_delivery():
    items = [
        CartItemValidation(
            variant_id=1,
            qty=1,
            unit_price=119900,
            sku_snapshot="VY-PL-IVO-M",
        )
    ]
    breakdown = calculate_order_pricing(items, PaymentMethod.COD)

    assert breakdown.subtotal == 119900
    assert breakdown.shipping_fee == 9900
    assert breakdown.cod_fee == 4900  # Rs. 49 COD charge
    assert breakdown.total == 119900 + 9900 + 4900


def test_paise_to_inr_display():
    assert paise_to_inr_display(119900) == "₹1,199"
    assert paise_to_inr_display(279900) == "₹2,799"
    assert paise_to_inr_display(9900) == "₹99"
    assert paise_to_inr_display(149950) == "₹1,499.50"
