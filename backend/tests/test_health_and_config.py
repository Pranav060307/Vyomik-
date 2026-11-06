import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_endpoint(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "VYOMIK E-Commerce API"
    assert "store_mode" in data
    assert "payment_provider" in data
    assert "qikink_mode" in data


@pytest.mark.asyncio
async def test_store_config_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/config")
    assert response.status_code == 200
    data = response.json()
    assert data["store_name"] == "VYOMIK"
    assert data["store_mode"] in ["coming_soon", "live"]
    assert data["launch_date"] == "2026-11-10"
    assert "launch_at" in data
    assert "server_time" in data
    assert isinstance(data["gate_enabled"], bool)
    assert data["payment_provider"] == "mock"
    assert data["cod_available"] is True
    assert data["free_shipping_threshold_paise"] == 149900
    assert data["contact_email"] == "simplyvyomik@gmail.com"
    assert data["instagram_url"] == "https://www.instagram.com/simplyvyomik"

