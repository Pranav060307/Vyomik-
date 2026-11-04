"""
Health Check & Service Readiness endpoints.
"""

from typing import Dict, Any
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health", summary="Health check endpoint")
async def health_check() -> Dict[str, Any]:
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "store_mode": settings.STORE_MODE,
        "payment_provider": settings.PAYMENT_PROVIDER,
        "qikink_mode": settings.QIKINK_MODE,
    }
