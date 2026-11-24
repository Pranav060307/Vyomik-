"""
Comprehensive End-to-End Test Suite for VYOMIK Automatic UPI Payment & Verification System.
Validates:
1. Masked VPA matching algorithm (HDFC Bank format).
2. Standards-compliant dynamic UPI URI construction and QR rendering.
3. Official PDF receipt generation.
4. FastAPI endpoints: QR generation, Watcher callback, idempotency, receipt download, and admin reconciliation.
"""

import asyncio
import random
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.config import settings
from app.services.upi_payment import matches_upi, build_upi_uri, make_qr_png_base64, generate_tr
from app.services.receipt import generate_vyomik_pdf_receipt


def test_masked_upi_matching():
    """Validates smart matching against HDFC Bank privacy-masked VPAs."""
    # 1. Exact match
    assert matches_upi("vibhav@okhdfcbank", "vibhav@okhdfcbank") is True
    assert matches_upi("VIBHAV@OKHDFCBANK", "vibhav@okhdfcbank") is True

    # 2. HDFC Bank masked VPA with asterisk: *******atel@fam matching vibhavpatel@fam
    assert matches_upi("vibhavpatel@fam", "*******atel@fam") is True
    assert matches_upi("vibhav.patel@fam", "*******atel@fam") is True
    assert matches_upi("aryanpatel@fam", "*******atel@fam") is True

    # 3. Domain mismatch must fail
    assert matches_upi("vibhavpatel@okaxis", "*******atel@fam") is False

    # 4. Suffix mismatch must fail
    assert matches_upi("vibhavsharma@fam", "*******atel@fam") is False

    # 5. Empty or missing values must fail
    assert matches_upi("", "*******atel@fam") is False
    assert matches_upi(None, "*******atel@fam") is False
    print("✓ test_masked_upi_matching passed")


def test_upi_uri_and_qr_rendering():
    """Validates standards-compliant NPCI UPI deep links and QR PNG generation."""
    tr = generate_tr("VY")
    uri = build_upi_uri(
        tr=tr,
        amount_paise=249900,
        merchant_vpa="vyomik@okhdfcbank",
        merchant_name="VYOMIK",
        note="Order Test",
    )
    assert uri.startswith("upi://pay?")
    assert "pa=vyomik%40okhdfcbank" in uri or "pa=vyomik@okhdfcbank" in uri
    assert "am=2499.00" in uri
    assert f"tr={tr}" in uri
    assert "cu=INR" in uri

    qr_b64 = make_qr_png_base64(uri)
    assert qr_b64.startswith("data:image/png;base64,")
    assert len(qr_b64) > 100
    print("✓ test_upi_uri_and_qr_rendering passed")


def test_pdf_receipt_generation():
    """Validates ReportLab branded PDF generation."""
    test_receipt = {
        "receipt_number": "VYREC-20261123-9999",
        "order_number": "VY2611TESTORD",
        "customer_name": "Vibhav Patel",
        "customer_email": "vibhav@vyomik.com",
        "customer_upi_id": "vibhavpatel@fam",
        "receiving_vpa": "vyomik@okhdfcbank",
        "utr_number": "630155807241",
        "amount_paise": 249900,
        "items": [
            {"title": "Core Hoodie — Ivory", "color": "Ivory", "size": "M", "qty": 1, "price_paise": 249900}
        ],
        "pricing": {
            "subtotal_paise": 249900,
            "shipping_fee_paise": 0,
            "total_paise": 249900,
        },
    }
    pdf_bytes = generate_vyomik_pdf_receipt(test_receipt)
    assert isinstance(pdf_bytes, bytes)
    assert pdf_bytes.startswith(b"%PDF")
    assert len(pdf_bytes) > 1000
    print("✓ test_pdf_receipt_generation passed")


@pytest.mark.asyncio
async def test_api_payment_flow():
    """Validates complete API payment workflow: Order Checkout -> QR Creation -> Watcher Callback -> Receipt Download."""
    from app.core.database import engine, Base
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Place an initial order
        order_payload = {
            "shipping_address": {
                "first_name": "Aarav",
                "last_name": "Sharma",
                "address1": "12th Main, Indiranagar",
                "city": "Bengaluru",
                "state": "Karnataka",
                "zipcode": "560038",
                "phone": "9876543210",
                "email": "aarav.sharma@vyomik.com",
            },
            "payment_method": "prepaid",
            "items": [
                {
                    "title": "Core Hoodie — Ivory",
                    "color": "Ivory",
                    "size": "M",
                    "qty": 1,
                    "price_paise": 249900,
                }
            ],
            "total_paise": 249900,
            "subtotal_paise": 249900,
            "shipping_fee_paise": 0,
        }
        res_order = await client.post("/api/v1/orders", json=order_payload)
        assert res_order.status_code == 200, res_order.text
        order_data = res_order.json()
        order_num = order_data["order_number"]

        # 2. Generate Dynamic UPI QR
        qr_payload = {
            "order_number": order_num,
            "customer_upi_id": "aarav@okhdfcbank",
        }
        res_qr = await client.post("/api/v1/payments/create-upi-qr", json=qr_payload)
        assert res_qr.status_code == 200, res_qr.text
        qr_data = res_qr.json()
        assert qr_data["order_number"] == order_num
        assert qr_data["amount_inr"] == 2499.0
        assert qr_data["upi_uri"].startswith("upi://pay?")
        assert qr_data["qr_base64"].startswith("data:image/png;base64,")
        tr = qr_data["tr"]

        # 3. Check Initial Status (awaiting_payment)
        res_status = await client.get(f"/api/v1/payments/status/{tr}")
        assert res_status.status_code == 200
        assert res_status.json()["status"] == "awaiting_payment"

        # 4. Test Customer "I Have Paid" signal
        res_verifying = await client.post(f"/api/v1/payments/set-verifying/{tr}")
        assert res_verifying.status_code == 200
        assert res_verifying.json()["status"] == "verifying"

        test_utr = f"6301{random.randint(10000000, 99999999)}"

        # 5. Unauthorized Watcher Callback (missing x-api-key) must fail with 401
        res_unauth = await client.post(
            f"/api/v1/payments/verify-callback/{tr}",
            json={"utr": test_utr, "amount": 2499.0},
        )
        assert res_unauth.status_code == 401

        # 6. Authorized Watcher Callback confirming HDFC Bank credit
        callback_payload = {
            "orderId": tr,
            "status": "paid",
            "utr": test_utr,
            "amount": 2499.0,
            "senderUpi": "aarav@okhdfcbank",
            "senderName": "Aarav Sharma",
            "rawSnippet": f"Rs.2499.00 has been successfully credited to your HDFC Bank account... UPI Reference No.: {test_utr}",
        }
        res_callback = await client.post(
            f"/api/v1/payments/verify-callback/{tr}",
            json=callback_payload,
            headers={"x-api-key": settings.WATCH_API_KEY},
        )
        assert res_callback.status_code == 200, res_callback.text
        callback_data = res_callback.json()
        assert callback_data["ok"] is True
        assert callback_data["status"] == "paid"

        # 7. Check Payment Status Now (PAID)
        res_paid_status = await client.get(f"/api/v1/payments/status/{tr}")
        assert res_paid_status.status_code == 200
        paid_data = res_paid_status.json()
        assert paid_data["status"] == "paid"
        assert paid_data["utr_number"] == test_utr
        assert paid_data["receipt_url"] is not None

        # 8. Idempotent check (same callback with same UTR)
        res_idempotent = await client.post(
            f"/api/v1/payments/verify-callback/{tr}",
            json=callback_payload,
            headers={"x-api-key": settings.WATCH_API_KEY},
        )
        assert res_idempotent.status_code == 200
        assert res_idempotent.json()["alreadyProcessed"] is True

        # 9. Download Official PDF Receipt
        res_receipt_pdf = await client.get(f"/api/v1/payments/receipt/{tr}/download")
        assert res_receipt_pdf.status_code == 200
        assert res_receipt_pdf.headers["content-type"] == "application/pdf"
        assert res_receipt_pdf.content.startswith(b"%PDF")

        # 10. Check Admin Payments Ledger
        res_admin = await client.get("/api/v1/admin/payments")
        assert res_admin.status_code == 200
        admin_data = res_admin.json()
        assert admin_data["verified_count"] >= 1
        assert admin_data["total_volume_paise"] >= 249900

        print("✓ test_api_payment_flow passed successfully!")


if __name__ == "__main__":
    test_masked_upi_matching()
    test_upi_uri_and_qr_rendering()
    test_pdf_receipt_generation()
    asyncio.run(test_api_payment_flow())
    print("\nALL BACKEND TESTS PASSED!")
