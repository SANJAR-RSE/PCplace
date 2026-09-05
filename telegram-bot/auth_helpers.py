from typing import Optional, Union

from aiogram.types import CallbackQuery, Message

from storage import Session, get_session

LOGIN_PROMPT = (
    "Avval tizimga kirishingiz kerak 🔐\n\n"
    "1) Web saytda ro'yxatdan o'ting va tizimga kiring.\n"
    "2) Profil sahifasidan bir martalik kod oling (\"Telegram botga ulanish\").\n"
    "3) Bu yerga /login buyrug'ini yuboring va kodni kiriting."
)


async def require_session(target: Union[Message, CallbackQuery]) -> Optional[Session]:
    """Sessiyani tekshiradi; yo'q bo'lsa login qilish haqida eslatib None qaytaradi."""
    telegram_id = target.from_user.id
    session = await get_session(telegram_id)
    if session:
        return session

    if isinstance(target, CallbackQuery):
        await target.message.answer(LOGIN_PROMPT)
        await target.answer()
    else:
        await target.answer(LOGIN_PROMPT)
    return None
