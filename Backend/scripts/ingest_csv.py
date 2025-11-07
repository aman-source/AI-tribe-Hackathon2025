"""Utility to load the CSV dataset into Neon."""

from __future__ import annotations

import argparse
import asyncio
import csv
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict

# Ensure the parent directory (Backend) is on sys.path when the script
# is launched from outside the package (e.g., repo root).
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from app.database import async_session, engine  # noqa: E402
from app.db_models import Base, Task  # noqa: E402


def parse_datetime(value: str | None) -> datetime | None:
    """Parse naive timestamps (YYYY-MM-DD HH:MM) into aware UTC datetimes."""

    if not value:
        return None
    return datetime.strptime(value, "%Y-%m-%d %H:%M").replace(tzinfo=timezone.utc)


def parse_float(value: str | None) -> float | None:
    if not value:
        return None
    return float(value)


async def ensure_schema() -> None:
    """Create tables if this is the first time hitting Neon."""

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def ingest(csv_path: Path) -> None:
    """Read CSV rows and upsert them into the database."""

    await ensure_schema()
    async with async_session() as session:
        with csv_path.open(newline="", encoding="utf-8") as handle:
            reader = csv.DictReader(handle)
            for row in reader:
                payload: Dict[str, Any] = {
                    "task_id": row["task_id"],
                    "team_name": row["team_name"],
                    "member_name": row["member_name"],
                    "task_title": row["task_title"],
                    "task_type": row["task_type"].lower(),
                    "priority": row["priority"].lower(),
                    "status": row["status"].lower(),
                    "created_at": parse_datetime(row["created_at"]),
                    "closed_at": parse_datetime(row["closed_at"]),
                    "last_updated": parse_datetime(row["last_updated"]) or parse_datetime(row["created_at"]),
                    "source_tool": row["source_tool"],
                    "cycle_time": parse_float(row.get("cycle_time")),
                }

                existing = await session.get(Task, payload["task_id"])
                if existing:
                    for field, value in payload.items():
                        setattr(existing, field, value)
                else:
                    session.add(Task(**payload))

        await session.commit()


def main() -> None:
    parser = argparse.ArgumentParser(description="Load CSV tasks into Neon.")
    parser.add_argument(
        "--csv",
        type=Path,
        default=Path(__file__).resolve().parents[2] / "team_productivity_metrics.csv",
        help="Path to the CSV file to load.",
    )
    args = parser.parse_args()

    if not args.csv.exists():
        raise FileNotFoundError(f"CSV file not found: {args.csv}")

    asyncio.run(ingest(args.csv))


if __name__ == "__main__":
    main()
