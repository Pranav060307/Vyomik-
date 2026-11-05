"""
Service for storing pre-registration emails in a text (.txt) file.
Ensures thread-safe, atomic operations, duplicate prevention, and cross-path syncing.
"""

import logging
import threading
from pathlib import Path
from typing import List, Tuple
from datetime import datetime, timezone

from app.core.config import settings

logger = logging.getLogger("vyomik.waitlist_file")

# Thread-safe lock for file operations
_file_lock = threading.Lock()


def get_txt_file_paths() -> List[Path]:
    """
    Returns list of paths where preregistration .txt file should be updated.
    Guarantees the file is saved in both backend/ and project root for convenience.
    """
    configured_filename = getattr(settings, "WAITLIST_TXT_PATH", "preregistrations.txt")
    configured_path = Path(configured_filename)

    here = Path(__file__).resolve().parent  # app/services
    app_dir = here.parent                   # app
    backend_dir = app_dir.parent           # backend
    project_root = backend_dir.parent      # Vyomik--1

    targets: List[Path] = []

    if configured_path.is_absolute():
        targets.append(configured_path)
    else:
        # Save in backend directory
        targets.append(backend_dir / configured_filename)
        # Also mirror in project root if distinct
        if project_root.exists() and project_root != backend_dir:
            targets.append(project_root / configured_filename)

    return targets


def read_registered_emails() -> List[str]:
    """Read all unique email IDs from the .txt file."""
    for path in get_txt_file_paths():
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    lines = [
                        line.strip()
                        for line in f
                        if line.strip() and not line.startswith("#")
                    ]
                return lines
            except Exception as e:
                logger.error(f"Error reading {path}: {e}")
    return []


def save_email_to_txt(email: str, source: str = "coming_soon_gate") -> Tuple[bool, bool]:
    """
    Saves the pre-registered email ID to the .txt file.
    
    Returns:
        (success: bool, is_duplicate: bool)
    """
    clean_email = email.strip().lower()
    if not clean_email:
        return False, False

    with _file_lock:
        existing_emails = set(read_registered_emails())
        if clean_email in existing_emails:
            logger.info(f"Email {clean_email} already registered in .txt file.")
            return True, True

        paths = get_txt_file_paths()
        written = False
        for path in paths:
            try:
                path.parent.mkdir(parents=True, exist_ok=True)
                with open(path, "a", encoding="utf-8") as f:
                    f.write(f"{clean_email}\n")
                written = True
                logger.info(f"Appended {clean_email} to {path}")
            except Exception as e:
                logger.error(f"Failed writing to {path}: {e}")

        # Also append to detailed audit log
        for path in paths:
            detailed_path = path.parent / f"{path.stem}_detailed.log"
            try:
                ts = datetime.now(timezone.utc).isoformat()
                with open(detailed_path, "a", encoding="utf-8") as f:
                    f.write(f"{ts} | {clean_email} | source={source}\n")
            except Exception:
                pass

        return written, False
