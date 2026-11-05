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
        mode="sandbox",
        client_id="977241055248744",
        api_key="5035a27d101638bea11c2220543016821d7320522f779599aa3a007582b5abb8",
    )
    client = HttpQikinkClient(q_settings)
    token = await client.get_access_token()

    assert token is not None
    assert len(token) > 20
    # Caching check
    cached_token = await client.get_access_token()
    assert cached_token == token
