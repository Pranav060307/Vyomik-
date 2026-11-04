"""
Domain-specific exceptions for Qikink fulfillment integration.
"""

class QikinkError(Exception):
    """Base exception for all Qikink integration errors."""
    def __init__(self, message: str, status_code: int | None = None, payload: dict | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload or {}


class QikinkAuthError(QikinkError):
    """Raised when authentication with Qikink Custom API fails."""
    pass


class QikinkSkuMissingError(QikinkError):
    """
    CRITICAL RULE: Raised when a variant has no pre-mapped SKU for the active environment.
    Orders cannot be submitted without Qikink pre-created SKUs.
    """
    pass


class QikinkWalletError(QikinkError):
    """Raised when Qikink prepaid wallet balance is insufficient to process orders."""
    pass


class QikinkOrderNumberLengthError(QikinkError):
    """Raised when order_number exceeds Qikink's 15-character hard limit."""
    pass


class QikinkRateLimitError(QikinkError):
    """Raised when Qikink API returns 429 Too Many Requests."""
    pass
