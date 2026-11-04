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
    yield
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
