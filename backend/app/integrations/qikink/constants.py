"""
Qikink API Constants & Endpoint Registry.

NOTE TO TEAM:
All endpoints, query parameter names, and authentication headers defined here
must be checked against official Qikink Custom API documentation once partner
access is granted.
"""

# TODO(verify against Qikink docs): Confirm base URLs with Qikink developer portal
QIKINK_SANDBOX_BASE_URL = "https://sandbox-api.qikink.com/api/v1"
QIKINK_LIVE_BASE_URL = "https://api.qikink.com/api/v1"

# TODO(verify against Qikink docs): Confirm exact case-sensitive header names and credentials keys
# Qikink Custom API typically authenticates via Client ID and API Key headers
AUTH_HEADER_CLIENT_ID = "X-Qikink-Client-Id"
AUTH_HEADER_API_KEY = "X-Qikink-Api-Key"

# TODO(verify against Qikink docs): Verify exact REST endpoint routes
ENDPOINT_CREATE_ORDER = "/orders/create"
ENDPOINT_GET_ORDER_STATUS = "/orders/status"
ENDPOINT_CANCEL_ORDER = "/orders/cancel"
ENDPOINT_GET_WALLET_BALANCE = "/user/wallet/balance"
ENDPOINT_CHECK_SERVICEABILITY = "/shipping/pincode/serviceability"
ENDPOINT_CREATE_REVERSE_PICKUP = "/returns/reverse-pickup"

# Hard Constraints enforced by Qikink API
MAX_QIKINK_ORDER_NUMBER_LEN = 15
TIMEOUT_SECONDS = 30.0
MAX_SUBMISSION_RETRIES = 3
