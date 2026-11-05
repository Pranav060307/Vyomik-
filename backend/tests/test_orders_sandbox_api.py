"""
Tests for Orders & Qikink Sandbox API Integration Endpoint.
"""

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings


@pytest.mark.asyncio
async def test_order_sandbox_submission_endpoint(monkeypatch):
    """Verify POST /api/v1/orders/sandbox-test processes order and returns verified result."""
    monkeypatch.setattr(settings, "STORE_MODE", "live")
    
    payload = {
        "shipping_address": {
            "first_name": "Aarav",
            "last_name": "Sharma",
            "address1": "12th Main, Indiranagar",
            "city": "Bengaluru",
            "state": "Karnataka",
            "zipcode": "560038",
            "phone": "9876543210",
            "email": "aarav@vyomik.com",
        },
        "payment_method": "prepaid",
        "items": [
            {
                "title": "Essential Oversized Plain Tee",
                "color": "Pitch Black",
                "size": "M",
                "qty": 1,
                "price_paise": 119900,
                "sku": "VY-PL-BLK-M",
            }
        ],
        "total_paise": 119900,
    }

    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/v1/orders/sandbox-test", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["order_number"].startswith("VY")
        assert len(data["order_number"]) <= 15
        assert "status" in data
        assert "message" in data
