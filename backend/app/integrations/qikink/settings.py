"""
Qikink Integration Settings & Environment Isolation.
Strictly distinguishes between "mock", "sandbox", and "live".
Default is "mock", which requires zero credentials and makes zero network calls.
"""

import logging
from typing import Literal
from pydantic import BaseModel, Field

logger = logging.getLogger("qikink.integration")


class QikinkSettings(BaseModel):
    mode: Literal["mock", "sandbox", "live"] = "mock"
    client_id: str = Field(default="", description="Qikink Custom API Client ID")
    api_key: str = Field(default="", description="Qikink Custom API Key (Secret)")
    webhook_secret: str = Field(default="", description="Shared secret for signature verification")
    wallet_min_threshold_paise: int = Field(
        default=1_000_000, description="Minimum wallet balance in Paise (INR 10,000)"
    )

    @property
    def is_mock(self) -> bool:
        return self.mode == "mock"

    @property
    def is_sandbox(self) -> bool:
        return self.mode == "sandbox"

    @property
    def is_live(self) -> bool:
        return self.mode == "live"

    def log_call_environment(self, action: str) -> None:
        """Rule 2: Log active environment on every call."""
        logger.info(
            f"[Qikink API] Action: '{action}' | Active Mode: '{self.mode.upper()}'"
        )

