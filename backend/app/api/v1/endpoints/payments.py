"""
Payment endpoints for Automatic UPI QR Collection, Bank Email Reconciliation,
and Downloadable PDF Receipt Generation.
"""

import logging
import random
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, Header, Query, Response, status
from sqlalchemy import select, or_, and_, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.payment import Payment, BankTransaction, PaymentReceipt
from app.models.customer import Customer
from app.mongodb.models import OrderDoc
from app.schemas.payment import (
    CreateUpiQrRequest,
    CreateUpiQrResponse,
    PaymentStatusResponse,
    WatcherCallbackRequest,
    WatcherCallbackResponse,
    ManualReconciliationRequest,
    AdminPaymentsListResponse,
    PaymentAuditItem,
    ReceiptDetailResponse,
)
from app.services.upi_payment import (
    generate_tr,
    build_upi_uri,
    make_qr_png_base64,
    matches_upi,
    store_pending_payment,
    get_pending_payment,
    is_utr_already_processed,
    mark_utr_processed,
)
from app.services.receipt import generate_vyomik_pdf_receipt

logger = logging.getLogger("vyomik.payments")
router = APIRouter()


# ==============================================================================
# 1. CUSTOMER PAYMENT FLOW & DYNAMIC QR GENERATION
# ==============================================================================

@router.post(
    "/payments/create-upi-qr",
    response_model=CreateUpiQrResponse,
    summary="Generate standards-compliant dynamic UPI QR code for an order",
)
async def create_upi_qr(
    payload: CreateUpiQrRequest,
    db: AsyncSession = Depends(get_db),
) -> CreateUpiQrResponse:
    """
    Creates or updates a pending UPI payment for an existing order:
    1. Validates order existence and amount.
    2. Validates customer UPI ID.
    3. Generates unique transaction reference (TR).
    4. Generates dynamic UPI URI and high-res QR base64.
    5. Saves payment record with expiration window.
    """
    # Find Order by public_order_number
    stmt = (
        select(Order)
        .options(selectinload(Order.customer), selectinload(Order.payments))
        .where(Order.public_order_number == payload.order_number)
    )
    res = await db.execute(stmt)
    order = res.scalars().first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{payload.order_number}' not found",
        )

    # Use specified amount or default to order total
    amount_paise = payload.amount_paise or order.total
    amount_inr = amount_paise / 100.0

    # Generate TR
    tr = generate_tr(prefix="VY")
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.UPI_QR_EXPIRY_MINUTES)

    # Build UPI URI
    merchant_vpa = settings.MERCHANT_VPA
    merchant_name = settings.MERCHANT_NAME
    note = f"VYOMIK {order.public_order_number}"
    upi_uri = build_upi_uri(
        tr=tr,
        amount_paise=amount_paise,
        merchant_vpa=merchant_vpa,
        merchant_name=merchant_name,
        note=note,
    )

    # Generate QR Base64 PNG
    qr_base64 = make_qr_png_base64(upi_uri)

    # Persist or update Payment entity
    payment = Payment(
        order_id=order.id,
        tr=tr,
        provider="upi_qr",
        customer_upi_id=payload.customer_upi_id,
        amount_paise=amount_paise,
        receiving_vpa=merchant_vpa,
        status="awaiting_payment",
        expires_at=expires_at,
        raw_payload={
            "upi_uri": upi_uri,
            "created_via": "create_upi_qr",
            "merchant_vpa": merchant_vpa,
            "merchant_name": merchant_name,
        },
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    # Store in cache for real-time watcher checks
    await store_pending_payment(tr, {
        "order_number": order.public_order_number,
        "amount_paise": amount_paise,
        "customer_upi_id": payload.customer_upi_id,
        "receiving_vpa": merchant_vpa,
        "expires_at": expires_at.isoformat(),
    })

    # Sync to MongoDB OrderDoc if available
    try:
        mongo_order = await OrderDoc.find_one(OrderDoc.order_number == order.public_order_number)
        if mongo_order:
            mongo_order.payment.provider = "upi_qr"
            mongo_order.payment.status = "awaiting_payment"
            mongo_order.payment.tr = tr
            mongo_order.payment.customer_upi_id = payload.customer_upi_id
            await mongo_order.save()
    except Exception as e:
        logger.debug(f"MongoDB payment sync ignored: {e}")

    logger.info(f"[UPI QR] Created QR for order {order.public_order_number} (TR: {tr}, Amount: Rs. {amount_inr:.2f})")

    return CreateUpiQrResponse(
        tr=tr,
        order_number=order.public_order_number,
        amount_paise=amount_paise,
        amount_inr=amount_inr,
        merchant_vpa=merchant_vpa,
        merchant_name=merchant_name,
        customer_upi_id=payload.customer_upi_id,
        upi_uri=upi_uri,
        qr_base64=qr_base64,
        expires_at=expires_at,
        status="awaiting_payment",
    )


@router.get(
    "/payments/status/{identifier}",
    response_model=PaymentStatusResponse,
    summary="Check real-time verification status by TR or Order Number",
)
async def get_payment_status(
    identifier: str,
    db: AsyncSession = Depends(get_db),
) -> PaymentStatusResponse:
    """
    Polled by the frontend customer payment page:
    Returns current payment status ('awaiting_payment', 'verifying', 'paid', 'manual_review', 'expired').
    """
    # Query by TR first, then by Order Number
    stmt = (
        select(Payment)
        .options(selectinload(Payment.order), selectinload(Payment.receipt))
        .where(or_(Payment.tr == identifier, Payment.order.has(Order.public_order_number == identifier)))
        .order_by(desc(Payment.id))
    )
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment or not payment.order:
        # Check cache fallback
        cached = await get_pending_payment(identifier)
        if cached:
            return PaymentStatusResponse(
                tr=identifier,
                order_number=cached.get("order_number", identifier),
                status="awaiting_payment",
                amount_paise=int(cached.get("amount_paise", 0)),
                amount_inr=float(cached.get("amount_paise", 0)) / 100.0,
                customer_upi_id=cached.get("customer_upi_id"),
                receiving_vpa=cached.get("receiving_vpa", settings.MERCHANT_VPA),
            )
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment for identifier '{identifier}' not found",
        )

    # Check for expiration
    now = datetime.now(timezone.utc)
    current_status = payment.status
    if current_status in ["created", "awaiting_payment"] and payment.expires_at:
        # Normalize timezone
        exp = payment.expires_at if payment.expires_at.tzinfo else payment.expires_at.replace(tzinfo=timezone.utc)
        if now > exp:
            current_status = "expired"

    receipt_url = None
    receipt_number = None
    if payment.receipt:
        receipt_number = payment.receipt.receipt_number
        receipt_url = f"/api/v1/payments/receipt/{payment.tr}/download"

    return PaymentStatusResponse(
        tr=payment.tr or f"TR-{payment.id}",
        order_number=payment.order.public_order_number,
        status=current_status,
        amount_paise=payment.amount_paise,
        amount_inr=payment.amount_paise / 100.0,
        customer_upi_id=payment.customer_upi_id,
        receiving_vpa=payment.receiving_vpa or settings.MERCHANT_VPA,
        utr_number=payment.utr_number,
        paid_at=payment.verified_at,
        receipt_url=receipt_url,
        receipt_number=receipt_number,
        message="Payment verified successfully" if current_status == "paid" else None,
    )


@router.post(
    "/payments/set-verifying/{tr}",
    summary="Update payment state to 'verifying' when customer signals payment completion",
)
async def set_payment_verifying(
    tr: str,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """Signals that customer completed UPI payment; switches status to 'verifying'."""
    stmt = select(Payment).where(Payment.tr == tr)
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if payment and payment.status not in ["paid", "manual_review"]:
        payment.status = "verifying"
        await db.commit()

    return {"ok": True, "status": "verifying", "tr": tr}


# ==============================================================================
# 2. WATCHER CALLBACK & AUTOMATIC VERIFICATION
# ==============================================================================

@router.post(
    "/payments/verify-callback/{tr}",
    response_model=WatcherCallbackResponse,
    summary="Secure callback from the Gmail Watcher service to confirm bank credit",
)
async def verify_payment_callback(
    tr: str,
    payload: WatcherCallbackRequest,
    x_api_key: Optional[str] = Header(None, alias="x-api-key"),
    db: AsyncSession = Depends(get_db),
) -> WatcherCallbackResponse:
    """
    Automated webhook callback triggered by the external Gmail Watcher on Render:
    1. Authenticates request via shared secret `x-api-key`.
    2. Enforces idempotency on bank UTR.
    3. Matches amount and customer UPI ID (with masked matching).
    4. Transitions Payment to 'paid', Order to 'processing'.
    5. Creates BankTransaction and PaymentReceipt records.
    """
    # 1. Authenticate Watcher
    if not x_api_key or x_api_key.strip() != settings.WATCH_API_KEY.strip():
        logger.warning(f"[Watcher Callback] Unauthorized access attempt for TR {tr}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing x-api-key header",
        )

    clean_utr = payload.utr.strip()
    logger.info(f"[Watcher Callback] Received verification for TR: {tr}, UTR: {clean_utr}, Amount: {payload.amount}")

    # 2. Query Payment and Order
    stmt = (
        select(Payment)
        .options(selectinload(Payment.order).selectinload(Order.items), selectinload(Payment.receipt))
        .where(or_(Payment.tr == tr, Payment.order.has(Order.public_order_number == tr)))
    )
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment or not payment.order:
        logger.error(f"[Watcher Callback] No pending payment found for TR {tr}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment for TR '{tr}' not found",
        )

    return await _confirm_payment(payment, payload, db)


async def _confirm_payment(
    payment: Payment,
    payload: WatcherCallbackRequest,
    db: AsyncSession,
) -> WatcherCallbackResponse:
    """Internal helper to transition payment to PAID and generate receipt."""
    clean_utr = payload.utr.strip()
    order = payment.order
    tr = payment.tr or f"TR-{payment.id}"

    # 3. Idempotency Check
    if payment.status == "paid":
        logger.info(f"[Payment Confirm] Idempotent hit: TR {tr} already paid.")
        return WatcherCallbackResponse(
            ok=True,
            tr=tr,
            order_number=order.public_order_number,
            status="paid",
            message="Payment already verified and paid.",
            alreadyProcessed=True,
            receipt_url=f"/api/v1/payments/receipt/{tr}/download",
        )

    # 4. Check if UTR was used on another payment
    if await is_utr_already_processed(clean_utr) and payment.utr_number != clean_utr:
        logger.warning(f"[Payment Confirm] Duplicate UTR detected: {clean_utr}")
        payment.status = "manual_review"
        await db.commit()
        return WatcherCallbackResponse(
            ok=False,
            tr=tr,
            order_number=order.public_order_number,
            status="manual_review",
            message=f"UTR {clean_utr} has already been credited to another order. Flagged for manual review.",
        )

    # 5. Amount Validation (if amount reported by email)
    if payload.amount is not None:
        reported_paise = int(round(payload.amount * 100))
        # Allow small rounding diff < 100 paise (1 INR)
        if abs(reported_paise - payment.amount_paise) > 100:
            logger.warning(
                f"[Payment Confirm] Amount mismatch: Expected {payment.amount_paise} paise, got {reported_paise} paise"
            )
            payment.status = "manual_review"
            await db.commit()
            return WatcherCallbackResponse(
                ok=False,
                tr=tr,
                order_number=order.public_order_number,
                status="manual_review",
                message=f"Amount mismatch: Expected Rs. {payment.amount_paise/100:.2f}, bank reported Rs. {payload.amount:.2f}",
            )

    # 6. UPI Match Validation
    if payload.senderUpi and payment.customer_upi_id:
        if not matches_upi(payment.customer_upi_id, payload.senderUpi):
            logger.warning(
                f"[Payment Confirm] UPI mismatch: Expected {payment.customer_upi_id}, bank reported {payload.senderUpi}"
            )
            payment.status = "manual_review"
            await db.commit()
            return WatcherCallbackResponse(
                ok=False,
                tr=tr,
                order_number=order.public_order_number,
                status="manual_review",
                message=f"Payer UPI mismatch: {payment.customer_upi_id} vs {payload.senderUpi}. Flagged for review.",
            )

    # 7. Verification Success — Transition to PAID
    now = datetime.now(timezone.utc)
    payment.status = "paid"
    payment.utr_number = clean_utr
    payment.verified_at = now
    payment.raw_payload = {
        **(payment.raw_payload or {}),
        "verified_via": "gmail_watcher_callback",
        "sender_name": payload.senderName,
        "sender_upi": payload.senderUpi,
        "paid_at": payload.paidAt or now.isoformat(),
        "raw_snippet": payload.rawSnippet,
    }

    # Update Order
    order.payment_status = PaymentStatus.CAPTURED
    order.order_status = OrderStatus.CONFIRMED

    # Create BankTransaction
    bank_txn = BankTransaction(
        utr=clean_utr,
        amount_paise=payment.amount_paise,
        payer_vpa=payload.senderUpi or payment.customer_upi_id,
        sender_name=payload.senderName,
        raw_email_snippet=payload.rawSnippet,
        matched_payment_id=payment.id,
        status="matched",
    )
    db.add(bank_txn)

    # Create PaymentReceipt
    receipt_num = f"VYREC-{now.strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    customer_name = "Valued Customer"
    customer_email = ""
    if order.address_snapshot and isinstance(order.address_snapshot, dict):
        fn = order.address_snapshot.get("first_name", "")
        ln = order.address_snapshot.get("last_name", "")
        customer_name = f"{fn} {ln}".strip() or "Valued Customer"
        customer_email = order.address_snapshot.get("email", "")

    receipt = PaymentReceipt(
        receipt_number=receipt_num,
        payment_id=payment.id,
        order_number=order.public_order_number,
        receipt_data={
            "receipt_number": receipt_num,
            "order_number": order.public_order_number,
            "date_str": now.strftime("%d %B %Y, %I:%M %p UTC"),
            "customer_name": customer_name,
            "customer_email": customer_email,
            "customer_upi_id": payment.customer_upi_id,
            "receiving_vpa": payment.receiving_vpa or settings.MERCHANT_VPA,
            "utr_number": clean_utr,
            "amount_paise": payment.amount_paise,
            "items": [
                {
                    "title": itm.sku_snapshot,
                    "qty": itm.qty,
                    "price_paise": itm.unit_price,
                }
                for itm in (order.items or [])
            ],
            "pricing": {
                "subtotal_paise": order.subtotal,
                "shipping_fee_paise": order.shipping_fee,
                "total_paise": order.total,
            },
        },
    )
    db.add(receipt)

    await db.commit()
    await mark_utr_processed(clean_utr)

    # Sync to MongoDB OrderDoc if available
    try:
        mongo_order = await OrderDoc.find_one(OrderDoc.order_number == order.public_order_number)
        if mongo_order:
            mongo_order.payment.status = "captured"
            mongo_order.payment.utr_number = clean_utr
            mongo_order.payment.verified_at = now
            mongo_order.payment.receipt_number = receipt_num
            mongo_order.order_status = "CONFIRMED"
            await mongo_order.save()
    except Exception as e:
        logger.debug(f"MongoDB payment callback sync ignored: {e}")

    logger.info(f"[Payment Confirm] Successfully marked order {order.public_order_number} as PAID! (UTR: {clean_utr})")

    return WatcherCallbackResponse(
        ok=True,
        tr=tr,
        order_number=order.public_order_number,
        status="paid",
        message="Bank credit confirmed and reconciled successfully.",
        receipt_url=f"/api/v1/payments/receipt/{tr}/download",
    )


@router.post(
    "/payments/auto-verify",
    response_model=WatcherCallbackResponse,
    summary="Auto-match and verify payment from bank alert without requiring TR in email",
)
async def auto_verify_payment(
    payload: WatcherCallbackRequest,
    x_api_key: Optional[str] = Header(None, alias="x-api-key"),
    db: AsyncSession = Depends(get_db),
) -> WatcherCallbackResponse:
    """
    Automated matching endpoint called by Gmail Watcher when email body has no TR:
    1. Authenticates request via shared secret `x-api-key`.
    2. Enforces idempotency on bank UTR.
    3. Finds active pending payments in SQLite database.
    4. Matches on amount and payer UPI (including masked handle like *******atel@fam).
    5. Reconciles payment and generates PDF receipt.
    """
    if not x_api_key or x_api_key.strip() != settings.WATCH_API_KEY.strip():
        logger.warning("[Auto Verify] Unauthorized access attempt")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing x-api-key header",
        )

    clean_utr = payload.utr.strip()
    logger.info(f"[Auto Verify] Incoming credit alert: UTR={clean_utr}, Amount={payload.amount}, Sender={payload.senderUpi}")

    # 1. Check if already matched
    stmt_existing = (
        select(Payment)
        .options(selectinload(Payment.order), selectinload(Payment.receipt))
        .where(Payment.utr_number == clean_utr)
    )
    res_existing = await db.execute(stmt_existing)
    existing_payment = res_existing.scalars().first()
    if existing_payment and existing_payment.order:
        logger.info(f"[Auto Verify] UTR {clean_utr} already matched to TR {existing_payment.tr}")
        return WatcherCallbackResponse(
            ok=True,
            tr=existing_payment.tr or f"TR-{existing_payment.id}",
            order_number=existing_payment.order.public_order_number,
            status=existing_payment.status,
            message="Payment already verified.",
            alreadyProcessed=True,
            receipt_url=f"/api/v1/payments/receipt/{existing_payment.tr}/download" if existing_payment.receipt else None,
        )

    # 2. Query pending payments
    stmt = (
        select(Payment)
        .options(selectinload(Payment.order).selectinload(Order.items), selectinload(Payment.receipt))
        .where(Payment.status.in_(["awaiting_payment", "verifying", "created"]))
        .order_by(desc(Payment.id))
    )
    res = await db.execute(stmt)
    pending_payments = res.scalars().all()

    if not pending_payments:
        logger.warning(f"[Auto Verify] No active pending payments in DB for UTR {clean_utr}")
        return WatcherCallbackResponse(
            ok=False,
            tr="",
            order_number="",
            status="unmatched",
            message="No active pending orders in database.",
        )

    expected_paise = int(round(payload.amount * 100)) if payload.amount is not None else None
    candidates_by_amount: List[Payment] = []
    candidates_by_upi_and_amount: List[Payment] = []

    for p in pending_payments:
        amount_ok = True
        if expected_paise is not None:
            amount_ok = abs(p.amount_paise - expected_paise) <= 100  # within 1 INR

        if not amount_ok:
            continue

        candidates_by_amount.append(p)

        if payload.senderUpi and p.customer_upi_id:
            if matches_upi(p.customer_upi_id, payload.senderUpi):
                candidates_by_upi_and_amount.append(p)

    matched_payment: Optional[Payment] = None

    if len(candidates_by_upi_and_amount) >= 1:
        matched_payment = candidates_by_upi_and_amount[0]
        logger.info(f"[Auto Verify] Match by UPI + Amount to TR {matched_payment.tr} (Order: {matched_payment.order.public_order_number if matched_payment.order else '?'})")
    elif len(candidates_by_amount) == 1:
        matched_payment = candidates_by_amount[0]
        logger.info(f"[Auto Verify] Single pending order amount match to TR {matched_payment.tr}")
    elif len(candidates_by_amount) > 1:
        matched_payment = candidates_by_amount[0]
        logger.info(f"[Auto Verify] Multiple amount candidates, matched most recent TR {matched_payment.tr}")

    if not matched_payment or not matched_payment.order:
        logger.warning(f"[Auto Verify] Unmatched credit alert: UTR {clean_utr}, Rs. {payload.amount}")
        return WatcherCallbackResponse(
            ok=False,
            tr="",
            order_number="",
            status="unmatched",
            message=f"No pending order matched amount Rs. {payload.amount} from {payload.senderUpi}",
        )

    return await _confirm_payment(matched_payment, payload, db)


# ==============================================================================
# 3. RECEIPT PREVIEW & DOWNLOAD
# ==============================================================================

@router.get(
    "/payments/receipt/{tr}",
    response_model=ReceiptDetailResponse,
    summary="Get structured JSON receipt details for display",
)
async def get_receipt_data(
    tr: str,
    db: AsyncSession = Depends(get_db),
) -> ReceiptDetailResponse:
    """Returns JSON receipt metadata for frontend presentation."""
    stmt = (
        select(Payment)
        .options(selectinload(Payment.order).selectinload(Order.items), selectinload(Payment.receipt))
        .where(or_(Payment.tr == tr, Payment.order.has(Order.public_order_number == tr)))
    )
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment or not payment.order or not payment.receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Verified receipt for '{tr}' not found",
        )

    data = payment.receipt.receipt_data
    return ReceiptDetailResponse(
        receipt_number=payment.receipt.receipt_number,
        order_number=payment.order.public_order_number,
        customer_name=data.get("customer_name", "Valued Customer"),
        customer_email=data.get("customer_email", ""),
        customer_upi_id=payment.customer_upi_id,
        amount_paise=payment.amount_paise,
        amount_inr=payment.amount_paise / 100.0,
        utr_number=payment.utr_number or "N/A",
        receiving_vpa=payment.receiving_vpa or settings.MERCHANT_VPA,
        payment_status="PAID",
        issued_at=payment.receipt.issued_at,
        items=data.get("items", []),
        pricing=data.get("pricing", {}),
        download_url=f"/api/v1/payments/receipt/{payment.tr}/download",
    )


@router.get(
    "/payments/receipt/{tr}/download",
    summary="Download high-resolution official PDF receipt",
)
async def download_receipt_pdf(
    tr: str,
    db: AsyncSession = Depends(get_db),
) -> Response:
    """Generates and streams the branded PDF receipt directly."""
    stmt = (
        select(Payment)
        .options(selectinload(Payment.order).selectinload(Order.items), selectinload(Payment.receipt))
        .where(or_(Payment.tr == tr, Payment.order.has(Order.public_order_number == tr)))
    )
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment or not payment.order or not payment.receipt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Verified receipt for '{tr}' not found",
        )

    pdf_bytes = generate_vyomik_pdf_receipt(payment.receipt.receipt_data)

    filename = f"VYOMIK_Receipt_{payment.order.public_order_number}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Cache-Control": "public, max-age=86400",
        },
    )


# ==============================================================================
# 4. ADMIN CONSOLE PAYMENTS & MANUAL RECONCILIATION
# ==============================================================================

@router.get(
    "/admin/payments",
    response_model=AdminPaymentsListResponse,
    summary="Admin ledger of all UPI transactions with status filters",
)
async def list_admin_payments(
    status_filter: Optional[str] = Query(None, alias="status"),
    q: Optional[str] = Query(None, description="Search by TR, Order, UTR, or Customer Email"),
    db: AsyncSession = Depends(get_db),
) -> AdminPaymentsListResponse:
    """Powers the Admin Console /admin/payments ledger."""
    stmt = (
        select(Payment)
        .options(selectinload(Payment.order), selectinload(Payment.receipt))
        .order_by(desc(Payment.id))
    )

    if status_filter and status_filter.lower() != "all":
        stmt = stmt.where(Payment.status == status_filter.lower())

    if q and q.strip():
        term = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Payment.tr.ilike(term),
                Payment.utr_number.ilike(term),
                Payment.customer_upi_id.ilike(term),
                Payment.order.has(Order.public_order_number.ilike(term)),
            )
        )

    res = await db.execute(stmt)
    payments_list = res.scalars().all()

    # Aggregate metrics across all payments
    all_stmt = select(Payment)
    all_res = await db.execute(all_stmt)
    all_payments = all_res.scalars().all()

    total_volume_paise = sum(p.amount_paise for p in all_payments if p.status == "paid")
    verified_count = sum(1 for p in all_payments if p.status == "paid")
    awaiting_count = sum(1 for p in all_payments if p.status in ["created", "awaiting_payment", "verifying"])
    manual_review_count = sum(1 for p in all_payments if p.status == "manual_review")
    failed_count = sum(1 for p in all_payments if p.status in ["failed", "expired"])

    items = []
    for p in payments_list:
        order = p.order
        cust_name = None
        cust_email = None
        if order and order.address_snapshot:
            cust_name = f"{order.address_snapshot.get('first_name', '')} {order.address_snapshot.get('last_name', '')}".strip()
            cust_email = order.address_snapshot.get("email")

        items.append(
            PaymentAuditItem(
                id=p.id,
                tr=p.tr or f"TR-{p.id}",
                order_number=order.public_order_number if order else "N/A",
                customer_name=cust_name,
                customer_email=cust_email,
                customer_upi_id=p.customer_upi_id,
                amount_paise=p.amount_paise,
                amount_inr=p.amount_paise / 100.0,
                status=p.status,
                utr_number=p.utr_number,
                created_at=p.created_at,
                verified_at=p.verified_at,
                receipt_number=p.receipt.receipt_number if p.receipt else None,
            )
        )

    return AdminPaymentsListResponse(
        total_volume_paise=total_volume_paise,
        total_volume_inr=total_volume_paise / 100.0,
        total_count=len(all_payments),
        verified_count=verified_count,
        awaiting_count=awaiting_count,
        manual_review_count=manual_review_count,
        failed_count=failed_count,
        payments=items,
    )


@router.post(
    "/admin/payments/reconcile",
    summary="Admin action to manually verify an ambiguous bank transaction",
)
async def manual_reconcile_payment(
    payload: ManualReconciliationRequest,
    db: AsyncSession = Depends(get_db),
) -> Dict[str, Any]:
    """
    Manually reconciles an ambiguous bank payment with an order:
    1. Validates admin justification.
    2. Updates Payment to 'paid' with UTR and audit metadata.
    3. Issues official PDF receipt.
    """
    clean_utr = payload.utr.strip()

    stmt = (
        select(Payment)
        .options(selectinload(Payment.order).selectinload(Order.items), selectinload(Payment.receipt))
        .where(or_(Payment.tr == payload.tr, Payment.order.has(Order.public_order_number == payload.tr)))
    )
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment or not payment.order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Payment with TR '{payload.tr}' not found",
        )

    order = payment.order
    now = datetime.now(timezone.utc)

    payment.status = "paid"
    payment.utr_number = clean_utr
    payment.verified_at = now
    payment.raw_payload = {
        **payment.raw_payload,
        "verified_via": "admin_manual_reconciliation",
        "admin_email": payload.admin_email,
        "audit_notes": payload.notes,
        "reconciled_at": now.isoformat(),
    }

    order.payment_status = PaymentStatus.CAPTURED
    order.order_status = OrderStatus.CONFIRMED

    # Create BankTransaction
    bank_txn = BankTransaction(
        utr=clean_utr,
        amount_paise=payment.amount_paise,
        payer_vpa=payment.customer_upi_id,
        sender_name=f"Manual Match by {payload.admin_email}",
        raw_email_snippet=f"Reconciled manually. Reason: {payload.notes}",
        matched_payment_id=payment.id,
        status="manual_reconciled",
    )
    db.add(bank_txn)

    # Issue receipt if none exists
    receipt_num = f"VYREC-{now.strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
    receipt = PaymentReceipt(
        receipt_number=receipt_num,
        payment_id=payment.id,
        order_number=order.public_order_number,
        receipt_data={
            "receipt_number": receipt_num,
            "order_number": order.public_order_number,
            "date_str": now.strftime("%d %B %Y, %I:%M %p UTC"),
            "customer_name": f"{order.address_snapshot.get('first_name', '')} {order.address_snapshot.get('last_name', '')}".strip() or "Valued Customer",
            "customer_email": order.address_snapshot.get("email", ""),
            "customer_upi_id": payment.customer_upi_id,
            "receiving_vpa": payment.receiving_vpa or settings.MERCHANT_VPA,
            "utr_number": clean_utr,
            "amount_paise": payment.amount_paise,
            "items": [
                {
                    "title": itm.sku_snapshot,
                    "qty": itm.qty,
                    "price_paise": itm.unit_price,
                }
                for itm in (order.items or [])
            ],
            "pricing": {
                "subtotal_paise": order.subtotal,
                "shipping_fee_paise": order.shipping_fee,
                "total_paise": order.total,
            },
        },
    )
    db.add(receipt)

    await db.commit()
    await mark_utr_processed(clean_utr)

    logger.info(f"[Admin Reconcile] Payment {payment.tr} manually approved by {payload.admin_email}")

    return {
        "ok": True,
        "tr": payment.tr,
        "order_number": order.public_order_number,
        "status": "paid",
        "utr": clean_utr,
        "receipt_number": receipt_num,
        "receipt_url": f"/api/v1/payments/receipt/{payment.tr}/download",
    }
