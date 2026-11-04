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
)

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(config.router, tags=["Configuration"])
api_router.include_router(waitlist.router, tags=["Waitlist"])
api_router.include_router(products.router, tags=["Products"])
api_router.include_router(preview.router, tags=["Preview"])

