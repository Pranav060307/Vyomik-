"""
Webhook Events model for idempotent event processing.
Guarantees at-most-once processing of payment and fulfillment partner callbacks.
"""

from typing import Dict, Any
from sqlalchemy import (
    Integer,
    String,
    DateTime,
    JSON,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.base import utc_now


class WebhookEvent(Base):
    __tablename__ = "webhook_events"
    __table_args__ = (
        Index("ix_webhook_source_event", "source", "event_id"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # "payment" | "qikink"
    event_id: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    payload: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    processed_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<WebhookEvent(source='{self.source}', event_id='{self.event_id}')>"

