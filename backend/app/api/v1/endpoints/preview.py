"""
Endpoint to verify internal team preview key without exposing it to the frontend bundle.
"""

import secrets
from fastapi import APIRouter
from app.core.config import settings
from app.schemas.preview import PreviewVerifyRequest, PreviewVerifyResponse

router = APIRouter()


@router.post(
    "/preview/verify",
    response_model=PreviewVerifyResponse,
    summary="Verify internal team preview key",
)
async def verify_preview_key(payload: PreviewVerifyRequest) -> PreviewVerifyResponse:
    # Use secrets.compare_digest to prevent timing attacks
    is_valid = secrets.compare_digest(payload.key.strip(), settings.PREVIEW_KEY.strip())
    
    if is_valid:
        return PreviewVerifyResponse(
            valid=True,
            message="Preview access granted.",
        )
    return PreviewVerifyResponse(
        valid=False,
        message="Invalid preview key. Access denied.",
    )

