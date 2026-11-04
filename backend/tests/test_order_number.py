import pytest
from datetime import datetime, timezone
from app.services.order_number import (
    generate_public_order_number,
    validate_order_number,
    MAX_ORDER_NUMBER_LENGTH,
    ORDER_PREFIX,
)


def test_order_number_length_boundary():
    """Assert generated order numbers are always <= 15 characters."""
    dt = datetime(2026, 11, 8, 10, 30, tzinfo=timezone.utc)
    order_num = generate_public_order_number(dt=dt, random_length=5)
    
    assert len(order_num) <= MAX_ORDER_NUMBER_LENGTH
    assert len(order_num) == 13
    assert order_num.startswith(f"{ORDER_PREFIX}261108")
    assert validate_order_number(order_num) is True


def test_order_number_uniqueness_sample():
    """Generates 500 order numbers and verifies all are unique and <= 15 chars."""
    numbers = set()
    for _ in range(500):
        num = generate_public_order_number()
        assert len(num) <= 15
        assert num.startswith("VY")
        numbers.add(num)
    
    assert len(numbers) == 500


def test_order_number_validator_rejection():
    """Tests that invalid lengths or missing prefixes are rejected."""
    assert validate_order_number("") is False
    assert validate_order_number("VY123") is False  # too short
    assert validate_order_number("VY123456789012345") is False  # 17 chars > 15
    assert validate_order_number("AB261108A7K9M") is False  # Wrong prefix
    assert validate_order_number("VY261108A7K9M") is True


def test_order_number_exceeding_max_raises_value_error():
    """Assert generating an order number beyond 15 chars raises ValueError."""
    with pytest.raises(ValueError, match="exceeds maximum length"):
        generate_public_order_number(random_length=10)
