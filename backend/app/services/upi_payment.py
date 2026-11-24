"""
UPI Dynamic QR Code Generator and Transaction Matching Engine.
Replicates and enhances the battle-tested ChampsArena UPI verification logic.
"""

import base64
import io
import logging
import random
import re
import string
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, Optional, Tuple, Literal
from urllib.parse import urlencode

import qrcode
from app.core.config import settings

logger = logging.getLogger("vyomik.upi_payment")

# In-memory fallback cache for pending payments and processed UTRs
_in_memory_pending_orders: Dict[str, Dict[str, Any]] = {}
_in_memory_processed_utrs: Dict[str, float] = {}  # utr -> timestamp


def normalize_upi(upi: Optional[str]) -> str:
    """Trims and lowercases a UPI ID."""
    if not upi:
        return ""
    return upi.strip().lower()


def matches_upi(entered_upi: Optional[str], email_upi: Optional[str]) -> bool:
    """
    Checks if a customer-entered UPI matches an email UPI (which might be masked like *******atel@fam).
    Ported directly from ChampsArena test_hdfc.ts logic.
    """
    norm_entered = normalize_upi(entered_upi)
    norm_email = normalize_upi(email_upi)

    if not norm_entered or not norm_email:
        return False

    # 1. Exact match
    if norm_entered == norm_email:
        return True

    if "@" not in norm_entered or "@" not in norm_email:
        return False

    entered_user, entered_domain = norm_entered.split("@", 1)
    email_user, email_domain = norm_email.split("@", 1)

    # Domains must match strictly (e.g. fam == fam, okhdfcbank == okhdfcbank)
    if entered_domain != email_domain:
        return False

    # 2. If email UPI contains masking characters (* or x/X)
    if "*" in email_user or "x" in email_user:
        suffix_match = re.search(r"[\*xX]+([a-zA-Z0-9._\-]+)$", email_user)
        prefix_match = re.search(r"^([a-zA-Z0-9._\-]+)[\*xX]+", email_user)

        required_suffix = suffix_match.group(1) if suffix_match else ""
        required_prefix = prefix_match.group(1) if prefix_match else ""

        suffix_ok = not required_suffix or entered_user.endswith(required_suffix)
        prefix_ok = not required_prefix or entered_user.startswith(required_prefix)

        return suffix_ok and prefix_ok

    return False


def generate_tr(prefix: str = "VY") -> str:
    """Generates a unique UPI transaction reference (TR) <= 30 chars."""
    now_ms = int(time.time() * 1000)
    rand_chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}{now_ms}{rand_chars}"[:30]


def build_upi_uri(
    tr: str,
    amount_paise: int,
    merchant_vpa: str,
    merchant_name: str,
    note: str = "",
) -> str:
    """
    Constructs a standards-compliant NPCI UPI deep link URI:
    upi://pay?pa=...&pn=...&am=...&cu=INR&tr=...&tn=...
    """
    amount_inr = f"{amount_paise / 100:.2f}"
    clean_note = (note or f"VYOMIK Order {tr}")[:40]
    clean_merchant = merchant_name[:50]

    params = {
        "pa": merchant_vpa.strip(),
        "pn": clean_merchant,
        "am": amount_inr,
        "cu": "INR",
        "tr": tr[:30],
        "tn": clean_note,
    }
    return f"upi://pay?{urlencode(params)}"


def make_qr_png_base64(data: str) -> str:
    """
    Renders high-contrast QR Code PNG image and returns it as a data URL:
    data:image/png;base64,...
    """
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#000000", back_color="#FFFFFF")

    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    b64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")
    buffer.close()

    return f"data:image/png;base64,{b64_str}"


async def store_pending_payment(tr: str, data: Dict[str, Any]) -> None:
    """Stores pending payment record in memory and Redis if available."""
    _in_memory_pending_orders[tr] = {
        **data,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "status": "awaiting_payment",
    }

    # Best-effort Redis integration
    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        redis_key = f"pending:order:{tr}"
        await r.hset(redis_key, mapping={
            "orderId": str(data.get("order_number", "")),
            "amount": str(data.get("amount_paise", 0) / 100),
            "payerUpiId": str(data.get("customer_upi_id", "")),
            "vpa": str(data.get("receiving_vpa", settings.MERCHANT_VPA)),
            "status": "pending",
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "tr": tr,
        })
        await r.expire(redis_key, settings.UPI_QR_EXPIRY_MINUTES * 60)
        await r.close()
    except Exception as e:
        logger.debug(f"[Redis Cache] Could not write pending order to Redis: {e}")


async def get_pending_payment(tr: str) -> Optional[Dict[str, Any]]:
    """Retrieves pending payment record."""
    if tr in _in_memory_pending_orders:
        return _in_memory_pending_orders[tr]

    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        data = await r.hgetall(f"pending:order:{tr}")
        await r.close()
        if data:
            return data
    except Exception:
        pass
    return None


async def is_utr_already_processed(utr: str) -> bool:
    """Idempotency check to guarantee no bank UTR is credited more than once."""
    clean_utr = utr.strip().upper()
    if clean_utr in _in_memory_processed_utrs:
        return True

    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        exists = await r.exists(f"processed_utr:{clean_utr}")
        await r.close()
        if exists:
            return True
    except Exception:
        pass
    return False


async def mark_utr_processed(utr: str) -> None:
    """Marks a bank UTR as processed."""
    clean_utr = utr.strip().upper()
    _in_memory_processed_utrs[clean_utr] = time.time()

    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        await r.set(f"processed_utr:{clean_utr}", "1", ex=86400 * 30)  # 30 days
        await r.close()
    except Exception:
        pass
