"""
Public configuration endpoint exposing store flags and launch countdown data.
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.config import StoreConfigResponse

router = APIRouter()


def is_gate_active(now: datetime | None = None) -> bool:
    """
    Evaluates whether the pre-launch coming soon gate should be active.
    Gate active = (server time < LAUNCH_AT) AND LAUNCH_GATE_ENABLED is True.
    """
    if not settings.LAUNCH_GATE_ENABLED:
        return False

    if now is None:
        now = datetime.now(timezone.utc)

    try:
        launch_dt = datetime.fromisoformat(settings.LAUNCH_AT)
        # If naive, assume UTC
        if launch_dt.tzinfo is None:
            launch_dt = launch_dt.replace(tzinfo=timezone.utc)
        
        # Compare in same timezone reference
        return now < launch_dt
    except Exception:
        # If parsing fails for any reason, default to keeping gate active if enabled
        return settings.LAUNCH_GATE_ENABLED


@router.get("/config", response_model=StoreConfigResponse, summary="Get public store configuration")
async def get_store_config() -> StoreConfigResponse:
    now_utc = datetime.now(timezone.utc)
    gate_active = is_gate_active(now_utc)

    return StoreConfigResponse(
        store_name="VYOMIK",
        store_mode=settings.STORE_MODE,
        launch_date=settings.LAUNCH_DATE,
        launch_at=settings.LAUNCH_AT,
        server_time=now_utc.isoformat(),
        gate_enabled=gate_active,
        payment_provider=settings.PAYMENT_PROVIDER,
        cod_available=settings.COD_AVAILABLE,
        free_shipping_threshold_paise=settings.FREE_SHIPPING_THRESHOLD_PAISE,
        default_shipping_fee_paise=settings.DEFAULT_SHIPPING_FEE_PAISE,
        cod_fee_paise=settings.COD_FEE_PAISE,
        demo_content=True,
        contact_email=settings.CONTACT_EMAIL,
        instagram_url=settings.INSTAGRAM_URL,
    )
