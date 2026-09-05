"""Telegram chat -> web akkaunt sessiyasini saqlash (oddiy JSON fayl).

Web sayt va bot bitta backend/bitta User modeliga murojaat qiladi (spec 4-bo'lim);
bot faqat o'zining joriy sessiyasi uchun accessToken'ni shu yerda lokal saqlaydi.
"""

import asyncio
import json
import os
from typing import Optional, TypedDict

from config import SESSIONS_FILE


class Session(TypedDict):
    access_token: str
    user_id: str
    full_name: str
    email: str


_lock = asyncio.Lock()


def _read_all() -> dict[str, Session]:
    if not os.path.exists(SESSIONS_FILE):
        return {}
    try:
        with open(SESSIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def _write_all(data: dict[str, Session]) -> None:
    with open(SESSIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


async def get_session(telegram_id: int) -> Optional[Session]:
    async with _lock:
        return _read_all().get(str(telegram_id))


async def set_session(telegram_id: int, session: Session) -> None:
    async with _lock:
        data = _read_all()
        data[str(telegram_id)] = session
        _write_all(data)


async def clear_session(telegram_id: int) -> None:
    async with _lock:
        data = _read_all()
        data.pop(str(telegram_id), None)
        _write_all(data)
