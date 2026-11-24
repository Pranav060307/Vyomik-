"""
Integration tests for Qikink Sandbox API using the configured sandbox credentials.
These verify network connectivity, OAuth JWT token exchange, and sandbox validation.
"""

import pytest
from app.core.config import settings
from app.integrations.qikink.client import HttpQikinkClient
from app.integrations.qikink.settings import QikinkSettings


@pytest.mark.asyncio
async def test_qikink_sandbox_oauth_token_exchange():
    """Verify live OAuth token generation with Qikink Sandbox."""
    q_settings = QikinkSettings(
        mode=settings.QIKINK_MODE,
        client_id=settings.QIKINK_CLIENT_ID,
        api_key=settings.QIKINK_API_KEY,
    )
    client = HttpQikinkClient(q_settings)
    token = await client.get_access_token()

    assert token is not None
    assert len(token) > 20
    # Caching check
    cached_token = await client.get_access_token()
    assert cached_token == token
