"""
Qikink API Constants & Endpoint Registry.

Verified against Qikink Open/Custom API:
- Base URLs: Sandbox (https://sandbox.qikink.com) & Live (https://api.qikink.com)
- Auth Endpoint: POST /api/token (application/x-www-form-urlencoded)
- Headers: ClientId and Accesstoken
- Order Creation: POST /api/order/create
"""

# Qikink Environment Base URLs
QIKINK_SANDBOX_BASE_URL = "https://sandbox.qikink.com"
QIKINK_LIVE_BASE_URL = "https://api.qikink.com"

# Qikink Open/Custom API Authentication Headers
AUTH_HEADER_CLIENT_ID = "ClientId"
AUTH_HEADER_ACCESS_TOKEN = "Accesstoken"
AUTH_HEADER_API_KEY = "X-Qikink-Api-Key"  # Legacy compatibility alias

# Qikink REST API Routes
ENDPOINT_TOKEN = "/api/token"
ENDPOINT_CREATE_ORDER = "/api/order/create"
ENDPOINT_GET_ORDER_STATUS = "/api/order"
ENDPOINT_CANCEL_ORDER = "/api/order/cancel"
ENDPOINT_GET_WALLET_BALANCE = "/user/wallet/balance"
ENDPOINT_CHECK_SERVICEABILITY = "/shipping/pincode/serviceability"
ENDPOINT_CREATE_REVERSE_PICKUP = "/returns/reverse-pickup"

# Hard Constraints enforced by Qikink API
MAX_QIKINK_ORDER_NUMBER_LEN = 15
TIMEOUT_SECONDS = 30.0
MAX_SUBMISSION_RETRIES = 3
