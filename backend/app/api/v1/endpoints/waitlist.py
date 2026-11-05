"""
Waitlist & Pre-registration email signup endpoint for coming_soon mode.
Stores pre-registered email IDs into a .txt file and syncs with database when available.
"""

from datetime import datetime, timezone
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.waitlist import WaitlistSignup
from app.schemas.waitlist import WaitlistSignupRequest, WaitlistSignupResponse
from app.services.waitlist_file import save_email_to_txt, read_registered_emails

logger = logging.getLogger("vyomik.waitlist")
router = APIRouter()


@router.post(
    "/waitlist",
    response_model=WaitlistSignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register email for launch notification and store in .txt file",
)
@router.post(
    "/preregister",
    response_model=WaitlistSignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Pre-register email for launch notification and store in .txt file",
)
async def signup_waitlist(
    payload: WaitlistSignupRequest,
    db: Optional[AsyncSession] = Depends(get_db),
) -> WaitlistSignupResponse:
    clean_email = payload.email.strip().lower()

    # 1. Store email ID in the .txt file
    _, is_file_duplicate = save_email_to_txt(
        email=clean_email,
        source=payload.source,
    )

    # 2. Check and sync with database if database session is active
    db_existing = None
    if db is not None:
        try:
            stmt = select(WaitlistSignup).where(WaitlistSignup.email == clean_email)
            result = await db.execute(stmt)
            db_existing = result.scalar_one_or_none()
        except Exception as e:
            logger.warning(f"Database query skipped or unavailable: {e}")

    # If already on the VIP / waitlist in file or DB
    if is_file_duplicate or db_existing is not None:
        created_at = (
            db_existing.created_at
            if db_existing is not None
            else datetime.now(timezone.utc)
        )
        return WaitlistSignupResponse(
            success=True,
            email=clean_email,
            message="You are already on the VIP list. We will email you 1 hour before doors open.",
            created_at=created_at,
        )

    # Insert new record into database if available
    created_at = datetime.now(timezone.utc)
    if db is not None:
        try:
            signup = WaitlistSignup(
                email=clean_email,
                source=payload.source,
            )
            db.add(signup)
            await db.commit()
            await db.refresh(signup)
            created_at = signup.created_at
        except Exception as e:
            logger.warning(f"Database insert skipped or unavailable: {e}")

    return WaitlistSignupResponse(
        success=True,
        email=clean_email,
        message="You're on the list. We'll email you 1 hour before the first drop opens.",
        created_at=created_at,
    )


@router.get(
    "/waitlist/emails",
    response_model=List[str],
    summary="Get all pre-registered email IDs stored in .txt file",
)
@router.get(
    "/preregister/emails",
    response_model=List[str],
    summary="Get all pre-registered email IDs stored in .txt file",
)
async def get_preregistered_emails() -> List[str]:
    """Retrieve all pre-registered email IDs from the .txt file."""
    return read_registered_emails()
