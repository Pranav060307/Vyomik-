import pytest
from httpx import AsyncClient
from app.services.waitlist_file import read_registered_emails, get_txt_file_paths


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

    # Verify that the email is stored in the .txt file
    emails = read_registered_emails()
    assert "earlybird@vyomik.com" in emails

    # Check that the .txt file actually exists on disk and contains the email
    for path in get_txt_file_paths():
        assert path.exists()
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            assert "earlybird@vyomik.com" in content


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

    # Verify email appears only once in the list
    emails = read_registered_emails()
    assert emails.count("vip@vyomik.com") == 1


@pytest.mark.asyncio
async def test_waitlist_signup_invalid_email(client: AsyncClient):
    response = await client.post(
        "/api/v1/waitlist",
        json={"email": "not-an-email", "source": "hero_cta"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_preregister_alias_and_get_emails(client: AsyncClient):
    # Test POST /api/v1/preregister
    res = await client.post(
        "/api/v1/preregister",
        json={"email": "comingsoon_fan@vyomik.com", "source": "coming_soon_gate"},
    )
    assert res.status_code == 201
    assert res.json()["success"] is True
    assert res.json()["email"] == "comingsoon_fan@vyomik.com"

    # Test GET /api/v1/waitlist/emails
    res_list = await client.get("/api/v1/waitlist/emails")
    assert res_list.status_code == 200
    email_list = res_list.json()
    assert "comingsoon_fan@vyomik.com" in email_list
