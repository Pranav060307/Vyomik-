import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_waitlist_signup_success(client: AsyncClient):
    response = await client.post(
        "/api/v1/waitlist",
        json={"email": "earlybird@vyomik.com", "source": "hero_cta"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["email"] == "earlybird@vyomik.com"
    assert "on the list" in data["message"].lower()


@pytest.mark.asyncio
async def test_waitlist_signup_duplicate_idempotent(client: AsyncClient):
    # First signup
    res1 = await client.post(
        "/api/v1/waitlist",
        json={"email": "vip@vyomik.com", "source": "hero_cta"},
    )
    assert res1.status_code == 201

    # Second signup with same email
    res2 = await client.post(
        "/api/v1/waitlist",
        json={"email": "vip@vyomik.com", "source": "category_panel"},
    )
    assert res2.status_code == 201
    data2 = res2.json()
    assert data2["success"] is True
    assert "already on the vip list" in data2["message"].lower()


@pytest.mark.asyncio
async def test_waitlist_signup_invalid_email(client: AsyncClient):
    response = await client.post(
        "/api/v1/waitlist",
        json={"email": "not-an-email", "source": "hero_cta"},
    )
    assert response.status_code == 422
