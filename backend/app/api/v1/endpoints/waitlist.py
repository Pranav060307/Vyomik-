"""
Waitlist email signup endpoint for coming_soon mode.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.waitlist import WaitlistSignup
from app.schemas.waitlist import WaitlistSignupRequest, WaitlistSignupResponse

router = APIRouter()


@router.post(
    "/waitlist",
    response_model=WaitlistSignupResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register email for launch notification",
)
async def signup_waitlist(
    payload: WaitlistSignupRequest,
    db: AsyncSession = Depends(get_db),
) -> WaitlistSignupResponse:
    # Check if email is already registered
    stmt = select(WaitlistSignup).where(WaitlistSignup.email == payload.email)
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        return WaitlistSignupResponse(
            success=True,
            email=existing.email,
            message="You are already on the VIP list. We will email you 1 hour before doors open.",
            created_at=existing.created_at,
        )

    # Insert new signup
    signup = WaitlistSignup(
        email=payload.email,
        source=payload.source,
    )
    db.add(signup)
    await db.commit()
    await db.refresh(signup)

    return WaitlistSignupResponse(
        success=True,
        email=signup.email,
        message="You're on the list. We'll email you 1 hour before the first drop opens.",
        created_at=signup.created_at,
    )
