"""
Public configuration endpoint exposing store flags to the frontend.
"""

from fastapi import APIRouter
from app.core.config import settings
from app.schemas.config import StoreConfigResponse

router = APIRouter()


@router.get("/config", response_model=StoreConfigResponse, summary="Get public store configuration")
async def get_store_config() -> StoreConfigResponse:
    return StoreConfigResponse(
        store_name="VYOMIK",
        store_mode=settings.STORE_MODE,
        launch_date=settings.LAUNCH_DATE,
        payment_provider=settings.PAYMENT_PROVIDER,
        cod_available=settings.COD_AVAILABLE,
        free_shipping_threshold_paise=settings.FREE_SHIPPING_THRESHOLD_PAISE,
        default_shipping_fee_paise=settings.DEFAULT_SHIPPING_FEE_PAISE,
        cod_fee_paise=settings.COD_FEE_PAISE,
        demo_content=True,
    )
