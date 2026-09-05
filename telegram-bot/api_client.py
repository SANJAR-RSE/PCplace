"""Yagona backend API bilan ishlash uchun yengil async client (frontend/src/lib/api.ts bilan bir xil mantiq)."""

from typing import Any, Optional

import httpx

from config import API_URL, BOT_INTERNAL_SECRET


class ApiError(Exception):
    def __init__(self, status: int, message: str):
        super().__init__(message)
        self.status = status
        self.message = message


async def _request(
    method: str,
    path: str,
    *,
    token: Optional[str] = None,
    json_body: Optional[dict[str, Any]] = None,
    extra_headers: Optional[dict[str, str]] = None,
) -> Any:
    headers: dict[str, str] = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if extra_headers:
        headers.update(extra_headers)

    async with httpx.AsyncClient(base_url=API_URL, timeout=15) as client:
        res = await client.request(method, path, json=json_body, headers=headers)

    if res.status_code >= 400:
        message = res.reason_phrase
        try:
            body = res.json()
            msg = body.get("message")
            message = ", ".join(msg) if isinstance(msg, list) else (msg or message)
        except ValueError:
            pass
        raise ApiError(res.status_code, message)

    if res.status_code == 204 or not res.content:
        return None
    return res.json()


async def get(path: str, token: Optional[str] = None) -> Any:
    return await _request("GET", path, token=token)


async def post(path: str, body: Optional[dict[str, Any]] = None, token: Optional[str] = None) -> Any:
    return await _request("POST", path, token=token, json_body=body)


async def patch(path: str, body: Optional[dict[str, Any]] = None, token: Optional[str] = None) -> Any:
    return await _request("PATCH", path, token=token, json_body=body)


async def delete(path: str, token: Optional[str] = None) -> Any:
    return await _request("DELETE", path, token=token)


async def bot_login(code: str, telegram_id: int) -> Any:
    """POST /auth/bot-login — faqat bot serveri chaqira oladi (x-bot-secret bilan)."""
    return await _request(
        "POST",
        "/auth/bot-login",
        json_body={"code": code, "telegramId": str(telegram_id)},
        extra_headers={"x-bot-secret": BOT_INTERNAL_SECRET},
    )
