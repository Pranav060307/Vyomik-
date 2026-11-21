"""
Core application configuration management using Pydantic Settings v2.
Reads from environment variables and .env file.
"""

from typing import List, Literal, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Application Information
    PROJECT_NAME: str = "VYOMIK E-Commerce API"
    VERSION: str = "1.0.0"
    ENVIRONMENT: Literal["development", "staging", "production"] = "development"
    
    # Launch Mode Feature Flag
    # "coming_soon": shop pages show "Coming soon", notify modal active, checkout disabled.
    # "live": full catalogue, bag, and checkout enabled.
    STORE_MODE: Literal["coming_soon", "live"] = "coming_soon"
    LAUNCH_DATE: str = "2026-11-10"

    # Pre-Launch Coming Soon Gate & Live Countdown
    # Value to confirm with CEO: default 2026-11-10T00:00:00+05:30 (IST)
    LAUNCH_AT: str = Field(
        default="2026-11-10T00:00:00+05:30",
        description="Exact launch timestamp in ISO 8601 with timezone offset (confirm with CEO)",
    )
    LAUNCH_GATE_ENABLED: bool = Field(
        default=True,
        description="Manual kill switch to enable/disable the pre-launch coming soon gate",
    )
    PREVIEW_KEY: str = Field(
        default="vyomik_team_preview_2026",
        description="Internal team preview bypass secret key for /?preview=<key>",
    )

    # Brand Details & Public Links
    CONTACT_EMAIL: str = Field(
        default="simplyvyomik@gmail.com",
        description="Official brand contact email address",
    )
    INSTAGRAM_URL: str = Field(
        default="https://www.instagram.com/simplyvyomik",
        description="Official VYOMIK Instagram profile URL",
    )
    WAITLIST_TXT_PATH: str = Field(
        default="preregistrations.txt",
        description="File path where pre-registered email IDs are stored in .txt format",
    )

    # Security
    SECRET_KEY: str = Field(
        default="dev_secret_key_change_in_production_min_32_chars_long",
        description="JWT secret key. Must be at least 32 characters in production."
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Database
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://vyomik:vyomik_secret_dev_pass@localhost:5432/vyomik_db",
        description="Async PostgreSQL connection URI"
    )
    SYNC_DATABASE_URL: str = Field(
        default="postgresql://vyomik:vyomik_secret_dev_pass@localhost:5432/vyomik_db",
        description="Synchronous PostgreSQL connection URI used for Alembic migrations"
    )

    # MongoDB Configuration
    MONGODB_URL: str = Field(
        default="mongodb://127.0.0.1:27017",
        description="MongoDB connection URI"
    )
    MONGODB_DB_NAME: str = Field(
        default="vyomik_db",
        description="MongoDB database name"
    )

    # Redis Cache & Background Queue
    REDIS_URL: str = "redis://localhost:6379/0"

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:5180",
        "http://127.0.0.1:5180",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Payment Provider Abstraction
    # Provider is decoupled so Razorpay, Cashfree, PhonePe or Stripe can be plugged in later
    PAYMENT_PROVIDER: Literal["mock", "razorpay", "cashfree", "stripe"] = "mock"
    MOCK_PAYMENT_AUTO_SUCCESS: bool = True

    # Qikink Integration Settings
    # Default to "mock" for zero-network end-to-end development
    QIKINK_MODE: Literal["mock", "sandbox", "live"] = "mock"
    QIKINK_CLIENT_ID: str = ""
    QIKINK_API_KEY: str = ""
    QIKINK_WEBHOOK_SECRET: str = ""
    QIKINK_WALLET_MIN_THRESHOLD_PAISE: int = 1_000_000  # 10,000 INR

    # Pricing & Shipping Rules (All money values stored in integer Paise: 1 INR = 100 Paise)
    FREE_SHIPPING_THRESHOLD_PAISE: int = 149900  # Rs. 1,499.00
    DEFAULT_SHIPPING_FEE_PAISE: int = 9900       # Rs. 99.00
    COD_AVAILABLE: bool = True
    COD_FEE_PAISE: int = 4900                   # Rs. 49.00

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_coming_soon(self) -> bool:
        return self.STORE_MODE == "coming_soon"


settings = Settings()

