"""
VYOMIK E-Commerce Backend Application Entrypoint.
Production-grade FastAPI with SQLAlchemy 2.0, Pydantic v2, and Payment/Fulfillment abstractions.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints.health import router as health_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("vyomik.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler for startup and shutdown procedures."""
    logger.info(
        f"Starting {settings.PROJECT_NAME} v{settings.VERSION} "
        f"[Store Mode: {settings.STORE_MODE.upper()} | Payment: {settings.PAYMENT_PROVIDER.upper()} | Qikink: {settings.QIKINK_MODE.upper()}]"
    )

    # For local SQLite development, automatically create tables if needed
    if "sqlite" in settings.DATABASE_URL:
        from app.core.database import engine, Base, AsyncSessionLocal
        from app.core.seeder import seed_demo_products_if_empty
        from app.models import (  # noqa: F401
            Product, ProductVariant, VariantQikinkSku, ProductImage,
            Customer, Address, Order, OrderItem, Return, Payment,
            WaitlistSignup, WebhookEvent
        )
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        async with AsyncSessionLocal() as session:
            await seed_demo_products_if_empty(session)

        logger.info("Local SQLite database initialized with all 12 tables and seeded catalog.")

    # Initialize MongoDB & Beanie ODM
    from app.mongodb.connection import init_mongodb, close_mongodb
    from app.mongodb.seeder import seed_mongodb_products_if_empty
    mongo_ok = await init_mongodb()
    if mongo_ok:
        await seed_mongodb_products_if_empty()

    yield
    await close_mongodb()
    logger.info("Gracefully shutting down VYOMIK application.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Official API for VYOMIK — Oversized essentials clothing brand.",
    openapi_url="/api/v1/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root-level health check for load balancers and orchestrators
app.include_router(health_router, tags=["Health"])

# Versioned API routes under /api/v1
app.include_router(api_router, prefix="/api/v1")


@app.get("/", include_in_schema=False)
async def root_redirect():
    return {
        "brand": "VYOMIK",
        "tagline": "Room to be you.",
        "launch_date": settings.LAUNCH_DATE,
        "docs": "/docs",
        "store_mode": settings.STORE_MODE,
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.method} {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )

