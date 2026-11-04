"""
Payment Provider Factory.
Instantiates the configured provider based on settings.PAYMENT_PROVIDER.
"""

from app.core.config import settings
from app.integrations.payment.base import PaymentProvider
from app.integrations.payment.mock import MockPaymentProvider


def get_payment_provider() -> PaymentProvider:
    provider = settings.PAYMENT_PROVIDER.lower()
    if provider == "mock":
        return MockPaymentProvider()
    
    # Ready for future adapters:
    # elif provider == "razorpay":
    #     from app.integrations.payment.razorpay import RazorpayProvider
    #     return RazorpayProvider(...)
    # elif provider == "cashfree":
    #     from app.integrations.payment.cashfree import CashfreeProvider
    #     return CashfreeProvider(...)
    
    raise NotImplementedError(
        f"Payment provider '{provider}' is not implemented yet. "
        f"Available options: 'mock'."
    )
