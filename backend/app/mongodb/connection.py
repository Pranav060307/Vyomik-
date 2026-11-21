"""
MongoDB Connection and Beanie ODM Initialization.
"""

import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings
from app.mongodb.models import (
    ProductDoc,
    OrderDoc,
    CustomerDoc,
    WaitlistDoc,
)

logger = logging.getLogger("vyomik.mongodb")

_client: Optional[AsyncIOMotorClient] = None


async def init_mongodb() -> bool:
    """Initializes the async Motor client and Beanie ODM."""
    global _client
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}...")
        _client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=2000,
        )
        
        # Test connection with a quick ping
        await _client.admin.command("ping")
        logger.info(f"MongoDB ping successful! Initializing Beanie database '{settings.MONGODB_DB_NAME}'...")

        db = _client[settings.MONGODB_DB_NAME]
        await init_beanie(
            database=db,
            document_models=[
                ProductDoc,
                OrderDoc,
                CustomerDoc,
                WaitlistDoc,
            ],
        )
        logger.info("Beanie ODM successfully initialized with all collections & indexes.")
        return True
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB: {e}. (Falling back to relational SQLite/PostgreSQL)")
        return False


async def close_mongodb() -> None:
    """Closes the MongoDB connection."""
    global _client
    if _client:
        _client.close()
        logger.info("MongoDB connection closed.")
