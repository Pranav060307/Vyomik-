"""
Tests for the Pre-Launch Coming Soon Gate, Server Time, and Preview Verification.
"""

import pytest
from datetime import datetime, timezone
from httpx import AsyncClient
from app.core.config import settings
from app.api.v1.endpoints.config import is_gate_active


@pytest.mark.asyncio
async def test_config_endpoint_gate_fields(client: AsyncClient):
    res = await client.get("/api/v1/config")
    assert res.status_code == 200
    data = res.json()
    assert "launch_at" in data
    assert "server_time" in data
    assert "gate_enabled" in data
    # Parse timestamps
    launch_dt = datetime.fromisoformat(data["launch_at"])
    server_dt = datetime.fromisoformat(data["server_time"])
    assert launch_dt > server_dt
    assert data["gate_enabled"] is True


def test_is_gate_active_logic():
    # Future launch date
    future_now = datetime(2026, 11, 4, 12, 0, tzinfo=timezone.utc)
    assert is_gate_active(future_now) is True

    # Simulated past date (after 8 Nov 2026)
    past_now = datetime(2026, 11, 9, 12, 0, tzinfo=timezone.utc)
    assert is_gate_active(past_now) is False


def test_gate_disabled_via_kill_switch(monkeypatch):
    monkeypatch.setattr(settings, "LAUNCH_GATE_ENABLED", False)
    assert is_gate_active() is False


@pytest.mark.asyncio
async def test_preview_verify_correct_key(client: AsyncClient):
    res = await client.post(
        "/api/v1/preview/verify",
        json={"key": settings.PREVIEW_KEY},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["valid"] is True
    assert "granted" in data["message"].lower()


@pytest.mark.asyncio
async def test_preview_verify_wrong_key(client: AsyncClient):
    res = await client.post(
        "/api/v1/preview/verify",
        json={"key": "wrong_key_123"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["valid"] is False
    assert "denied" in data["message"].lower()


@pytest.mark.asyncio
async def test_preview_verify_empty_key(client: AsyncClient):
    res = await client.post(
        "/api/v1/preview/verify",
        json={"key": ""},
    )
    assert res.status_code == 422

