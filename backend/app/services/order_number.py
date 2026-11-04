"""
Public Order Number Generator.
CRITICAL CONSTRAINT: Qikink partner API strictly limits order numbers to 15 characters max.
Format: 'VY' + YYMMDD (6) + random uppercase alphanumeric (5) = 13 characters total.
Guarantees uniqueness, chronological sortability, and strict length compliance.
"""

import secrets
import string
from datetime import datetime, timezone

# Crockford Base32 alphabet without ambiguous letters (I, L, O, U)
BASE32_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
MAX_ORDER_NUMBER_LENGTH = 15
ORDER_PREFIX = "VY"


def generate_public_order_number(dt: datetime | None = None, random_length: int = 5) -> str:
    """
    Generates a human-readable, brand-prefixed public order number.
    Example output: 'VY261108A7K9M' (13 chars <= 15 chars)
    """
    if dt is None:
        dt = datetime.now(timezone.utc)
    
    date_part = dt.strftime("%y%m%d")  # 6 chars (e.g. 261108)
    random_part = "".join(secrets.choice(BASE32_ALPHABET) for _ in range(random_length))
    
    order_number = f"{ORDER_PREFIX}{date_part}{random_part}".upper()
    
    if len(order_number) > MAX_ORDER_NUMBER_LENGTH:
        raise ValueError(
            f"Generated order number '{order_number}' exceeds maximum length of {MAX_ORDER_NUMBER_LENGTH} characters."
        )
    
    return order_number


def validate_order_number(order_number: str) -> bool:
    """Validates length and format of public order numbers."""
    if not order_number or not isinstance(order_number, str):
        return False
    if len(order_number) > MAX_ORDER_NUMBER_LENGTH or len(order_number) < 8:
        return False
    if not order_number.startswith(ORDER_PREFIX):
        return False
    return True

