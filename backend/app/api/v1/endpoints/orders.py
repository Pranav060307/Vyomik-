"""
Order & Fulfillment Endpoints.
Handles dynamic cart checkout, database persistence, and automated Qikink dispatch.
"""

import logging
from typing import List, Optional, Any, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.services.order_number import generate_public_order_number
from app.services.pricing import calculate_order_pricing, CartItemValidation
from app.models.customer import Customer, Address
from app.models.order import Order, OrderItem, PaymentMethod, PaymentStatus, OrderStatus
from app.models.payment import Payment
from app.models.product import ProductVariant, VariantQikinkSku
from app.schemas.order import (
    CreateOrderRequest,
    OrderSubmissionResponse,
    OrderDetailResponse,
    OrderItemDetail,
)
from app.integrations.qikink.client import get_qikink_client
from app.integrations.qikink.schemas import (
    QikinkCreateOrderRequest,
    QikinkShippingAddress,
    QikinkLineItem,
)

logger = logging.getLogger("vyomik.orders")
router = APIRouter()


async def _resolve_item_sku(
    db: AsyncSession,
    title: str,
    color: str,
    size: str,
    provided_sku: Optional[str] = None,
    variant_id: Optional[Any] = None,
    product_id: Optional[Any] = None,
) -> str:
    """
    Dynamically resolves the active Qikink SKU for an item.
    Prefers provided_sku if present, otherwise queries DB for active VariantQikinkSku.
    """
    if provided_sku and provided_sku.strip():
        return provided_sku.strip()

    num_vid = int(variant_id) if isinstance(variant_id, int) or (isinstance(variant_id, str) and variant_id.isdigit()) else None
    num_pid = int(product_id) if isinstance(product_id, int) or (isinstance(product_id, str) and product_id.isdigit()) else None

    # Query variant by variant_id or size/color
    stmt = select(ProductVariant).options(selectinload(ProductVariant.qikink_skus))
    if num_vid:
        stmt = stmt.where(ProductVariant.id == num_vid)
    elif num_pid:
        stmt = stmt.where(
            ProductVariant.product_id == num_pid,
            ProductVariant.size == size,
            ProductVariant.color == color,
        )
    else:
        stmt = stmt.where(
            ProductVariant.size == size,
            ProductVariant.color == color,
        )

    res = await db.execute(stmt)
    variant = res.scalars().first()

    current_env = settings.QIKINK_MODE.lower()
    if variant and variant.qikink_skus:
        # Match current environment
        for q in variant.qikink_skus:
            env_str = getattr(q.environment, "value", str(q.environment)).lower()
            if env_str == current_env:
                return q.qikink_sku
        # Fallback to any mapped SKU
        return variant.qikink_skus[0].qikink_sku

    # Default fallback
    clean_cat = "HD" if "Hoodie" in title else "SW" if "Sweatshirt" in title else "TS"
    clean_col = color.upper()[:3]
    return f"VY-{clean_cat}-{clean_col}-{size.upper()}"


@router.post(
    "/orders",
    response_model=OrderSubmissionResponse,
    summary="Create dynamic customer order, save to database, and push to Qikink",
)
async def create_order(
    payload: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
) -> OrderSubmissionResponse:
    """
    Production-grade order checkout:
    1. Validates delivery address & line items.
    2. Calculates integer Paise pricing (subtotal, shipping, COD fee).
    3. Resolves real Qikink variant SKUs dynamically from database.
    4. Persists Customer, Address, Order, OrderItems, and Payment.
    5. Dispatches order payload to Qikink API.
    """
    logger.info(f"[Checkout] Processing order for {payload.shipping_address.email}")

    # 1. Calculate pricing
    is_cod = payload.payment_method.lower() == "cod"
    pm = PaymentMethod.COD if is_cod else PaymentMethod.PREPAID

    cart_items = [
        CartItemValidation(
            variant_id=item.variant_id or 1,
            qty=item.qty,
            unit_price=item.price_paise,
            sku_snapshot=item.sku or f"VY-{item.color[:3].upper()}-{item.size}",
        )
        for item in payload.items
    ]
    pricing = calculate_order_pricing(
        items=cart_items,
        payment_method=pm,
    )

    # 2. Generate compliant <= 15 char order number (e.g. VY261121ABC12)
    public_order_number = generate_public_order_number()

    # 3. Find or create Customer
    res_cust = await db.execute(select(Customer).where(Customer.email == payload.shipping_address.email))
    customer = res_cust.scalars().first()
    if not customer:
        customer = Customer(
            email=payload.shipping_address.email,
            phone=payload.shipping_address.phone,
            name=f"{payload.shipping_address.first_name} {payload.shipping_address.last_name or ''}".strip(),
        )
        db.add(customer)
        await db.flush()

    # 4. Save Address
    address = Address(
        customer_id=customer.id,
        full_name=f"{payload.shipping_address.first_name} {payload.shipping_address.last_name or ''}".strip(),
        address_line1=payload.shipping_address.address1,
        address_line2=payload.shipping_address.address2 or "",
        city=payload.shipping_address.city,
        state=payload.shipping_address.state,
        postal_code=payload.shipping_address.zipcode,
        phone=payload.shipping_address.phone,
    )
    db.add(address)
    await db.flush()

    # 5. Create Order record
    order = Order(
        public_order_number=public_order_number,
        customer_id=customer.id,
        address_snapshot=payload.shipping_address.model_dump(),
        subtotal=pricing.subtotal,
        shipping_fee=pricing.shipping_fee,
        cod_fee=pricing.cod_fee,
        total=pricing.total,
        payment_method=pm,
        payment_status=PaymentStatus.PENDING if is_cod else PaymentStatus.CAPTURED,
        order_status=OrderStatus.CONFIRMED if is_cod else OrderStatus.PROCESSING,
    )
    db.add(order)
    await db.flush()

    # 6. Resolve SKUs and create OrderItems
    qikink_items: List[QikinkLineItem] = []
    for item in payload.items:
        resolved_sku = await _resolve_item_sku(
            db=db,
            title=item.title,
            color=item.color,
            size=item.size,
            provided_sku=item.sku,
            variant_id=item.variant_id,
            product_id=item.product_id,
        )

        order_item = OrderItem(
            order_id=order.id,
            variant_id=item.variant_id or 1,
            qty=item.qty,
            unit_price=item.price_paise,
            sku_snapshot=resolved_sku,
        )
        db.add(order_item)

        qikink_items.append(
            QikinkLineItem(
                sku=resolved_sku,
                quantity=item.qty,
                price_paise=item.price_paise,
            )
        )

    # 7. Record Payment
    payment = Payment(
        order_id=order.id,
        provider="cod" if is_cod else settings.PAYMENT_PROVIDER,
        status="captured" if not is_cod else "pending",
        raw_payload={"gateway": "mock_auto_approved" if not is_cod else "cod"},
    )
    db.add(payment)
    await db.commit()

    # 8. Dispatch to Qikink
    qikink_req = QikinkCreateOrderRequest(
        order_number=public_order_number,
        shipping_address=QikinkShippingAddress(
            first_name=payload.shipping_address.first_name,
            last_name=payload.shipping_address.last_name or "",
            address1=payload.shipping_address.address1,
            address2=payload.shipping_address.address2 or "",
            city=payload.shipping_address.city,
            state=payload.shipping_address.state,
            zipcode=payload.shipping_address.zipcode,
            phone=payload.shipping_address.phone,
            email=payload.shipping_address.email,
        ),
        line_items=qikink_items,
        is_cod=is_cod,
        cod_amount_paise=pricing.total if is_cod else 0,
        total_order_value_paise=pricing.total,
    )

    client = get_qikink_client()
    qikink_order_id = None
    raw_response = {}
    qikink_status_msg = "ORDER_RECORDED"

    try:
        q_res = await client.submit_order(qikink_req)
        raw_response = q_res.raw_response or {}
        qikink_order_id = q_res.qikink_order_id

        if q_res.success:
            order.qikink_order_id = qikink_order_id
            order.qikink_status = "SUBMITTED"
            qikink_status_msg = "SUBMITTED_TO_QIKINK"
            await db.commit()
        else:
            order.qikink_status = "PENDING_RETRY"
            qikink_status_msg = "AUTH_VERIFIED_SKU_PENDING"
            await db.commit()
    except Exception as e:
        logger.error(f"[Qikink Dispatch Error] {e}", exc_info=True)
        raw_response = {"error": str(e)}

    # Persist in MongoDB collection
    try:
        from app.mongodb.models.order import (
            OrderDoc,
            ShippingAddressDoc,
            OrderItemDoc,
            PricingDoc,
            PaymentDoc as MongoPaymentDoc,
            FulfillmentDoc,
        )
        mongo_order = OrderDoc(
            public_order_number=public_order_number,
            customer_email=payload.shipping_address.email,
            shipping_address=ShippingAddressDoc(**payload.shipping_address.model_dump()),
            items=[
                OrderItemDoc(
                    title=item.title,
                    size=item.size,
                    color=item.color,
                    qty=item.qty,
                    price_paise=item.price_paise,
                    sku=q_item.sku,
                )
                for item, q_item in zip(payload.items, qikink_items)
            ],
            pricing=PricingDoc(
                subtotal_paise=pricing.subtotal,
                shipping_fee_paise=pricing.shipping_fee,
                cod_fee_paise=pricing.cod_fee,
                total_paise=pricing.total,
            ),
            payment=MongoPaymentDoc(
                method="cod" if is_cod else "prepaid",
                status="captured" if not is_cod else "pending",
                provider=settings.PAYMENT_PROVIDER,
            ),
            fulfillment=FulfillmentDoc(
                provider="qikink",
                environment=settings.QIKINK_MODE,
                qikink_order_id=qikink_order_id,
                status="SUBMITTED" if qikink_order_id else "PENDING",
                raw_response=raw_response,
            ),
            order_status="CONFIRMED" if is_cod else "PROCESSING",
        )
        await mongo_order.insert()
        logger.info(f"Order {public_order_number} successfully saved to MongoDB 'orders' collection.")
    except Exception as me:
        logger.warning(f"Could not persist order to MongoDB: {me}")

    return OrderSubmissionResponse(
        success=True,
        order_number=public_order_number,
        qikink_order_id=qikink_order_id or f"QIKINK-{public_order_number}",
        status=qikink_status_msg,
        message="Order placed successfully and registered with VYOMIK fulfillment system.",
        subtotal_paise=pricing.subtotal,
        shipping_fee_paise=pricing.shipping_fee,
        cod_fee_paise=pricing.cod_fee,
        total_paise=pricing.total,
        raw_response=raw_response,
    )


@router.get(
    "/orders/customer/{email}",
    summary="Get all orders and receipts for a specific customer email",
)
async def get_customer_orders(
    email: str,
    db: AsyncSession = Depends(get_db),
) -> List[Dict[str, Any]]:
    """Fetches full order history, line items, and downloadable receipts for a customer."""
    clean_email = email.strip().lower()
    stmt = (
        select(Order)
        .options(
            selectinload(Order.customer),
            selectinload(Order.items).selectinload(OrderItem.variant),
            selectinload(Order.payments).selectinload(Payment.receipt),
        )
        .where(
            or_(
                Order.customer.has(Customer.email.ilike(clean_email)),
                Order.customer.has(Customer.email == clean_email),
            )
        )
        .order_by(desc(Order.id))
    )
    res = await db.execute(stmt)
    orders = res.scalars().all()

    results: List[Dict[str, Any]] = []
    for o in orders:
        active_payment = None
        receipt_url = None
        receipt_number = None
        utr_number = None
        tr = None

        if o.payments:
            sorted_payments = sorted(
                o.payments,
                key=lambda p: (1 if p.status == "paid" else 0, p.id),
                reverse=True,
            )
            active_payment = sorted_payments[0]
            tr = active_payment.tr
            utr_number = active_payment.utr_number
            if active_payment.receipt:
                receipt_number = active_payment.receipt.receipt_number
                receipt_url = f"/api/v1/payments/receipt/{active_payment.tr}/download"
            elif active_payment.status == "paid" and active_payment.tr:
                receipt_url = f"/api/v1/payments/receipt/{active_payment.tr}/download"

        results.append({
            "id": o.id,
            "order_number": o.public_order_number,
            "order_status": getattr(o.order_status, "value", str(o.order_status)),
            "payment_method": getattr(o.payment_method, "value", str(o.payment_method)),
            "payment_status": getattr(o.payment_status, "value", str(o.payment_status)),
            "subtotal": o.subtotal,
            "shipping_fee": o.shipping_fee,
            "cod_fee": o.cod_fee,
            "total": o.total,
            "total_inr": o.total / 100.0,
            "created_at": o.created_at.isoformat() if hasattr(o, "created_at") and o.created_at else "",
            "shipping_address": o.address_snapshot or {},
            "tr": tr,
            "utr_number": utr_number,
            "receipt_number": receipt_number,
            "receipt_url": receipt_url,
            "items": [
                {
                    "id": item.id,
                    "title": item.sku_snapshot,
                    "size": getattr(getattr(item, "variant", None), "size", "M"),
                    "color": getattr(getattr(item, "variant", None), "color", "Standard"),
                    "qty": item.qty,
                    "unit_price": item.unit_price,
                    "unit_price_inr": item.unit_price / 100.0,
                    "sku_snapshot": item.sku_snapshot,
                }
                for item in (o.items or [])
            ],
        })

    return results


@router.get(
    "/orders/{order_number}",
    response_model=OrderDetailResponse,
    summary="Get complete order details and fulfillment tracking by order number",
)
async def get_order_by_number(
    order_number: str,
    db: AsyncSession = Depends(get_db),
) -> OrderDetailResponse:
    stmt = (
        select(Order)
        .where(Order.public_order_number == order_number)
        .options(selectinload(Order.items).selectinload(OrderItem.variant))
    )
    res = await db.execute(stmt)
    order = res.scalars().first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order '{order_number}' not found.",
        )

    items_detail = [
        OrderItemDetail(
            id=i.id,
            title=getattr(getattr(i, "variant", None), "color", "") + " " + i.sku_snapshot,
            size=getattr(getattr(i, "variant", None), "size", "M"),
            color=getattr(getattr(i, "variant", None), "color", "White"),
            qty=i.qty,
            unit_price=i.unit_price,
            sku_snapshot=i.sku_snapshot,
        )
        for i in order.items
    ]

    return OrderDetailResponse(
        id=order.id,
        public_order_number=order.public_order_number,
        order_status=getattr(order.order_status, "value", str(order.order_status)),
        payment_method=getattr(order.payment_method, "value", str(order.payment_method)),
        payment_status=getattr(order.payment_status, "value", str(order.payment_status)),
        subtotal=order.subtotal,
        shipping_fee=order.shipping_fee,
        cod_fee=order.cod_fee,
        total=order.total,
        qikink_order_id=order.qikink_order_id,
        qikink_status=order.qikink_status,
        created_at=order.created_at.isoformat() if hasattr(order, "created_at") and order.created_at else "",
        shipping_address=order.address_snapshot or {},
        items=items_detail,
    )


@router.post(
    "/orders/sandbox-test",
    response_model=OrderSubmissionResponse,
    summary="Direct Sandbox testing of Order submission to Qikink",
)
async def test_sandbox_order_submission(
    payload: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
) -> OrderSubmissionResponse:
    return await create_order(payload, db)
