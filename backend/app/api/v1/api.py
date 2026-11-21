"""
API v1 Router aggregation.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    config,
    waitlist,
    products,
    preview,
    orders,
    admin,
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(config.router, tags=["Configuration"])
api_router.include_router(waitlist.router, tags=["Waitlist"])
api_router.include_router(products.router, tags=["Products"])
api_router.include_router(preview.router, tags=["Preview"])
api_router.include_router(orders.router, tags=["Orders"])
api_router.include_router(admin.router, tags=["Admin"])
