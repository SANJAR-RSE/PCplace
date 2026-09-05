from aiogram import F, Router
from aiogram.filters import Command
from aiogram.types import Message

from api_client import ApiError, get
from auth_helpers import require_session

router = Router(name="profile")


@router.message(Command("profile"))
@router.message(F.text == "👤 Profil")
async def cmd_profile(message: Message) -> None:
    session = await require_session(message)
    if not session:
        return

    try:
        user = await get("/users/me", token=session["access_token"])
    except ApiError:
        user = None

    lines = [
        "👤 <b>Profil</b>",
        f"Ism: {session['full_name']}",
        f"Email: {session['email']}",
    ]
    if user:
        lines.append(f"Telefon: {user.get('phone') or '—'}")
        lines.append(f"Tarif: {(user.get('plan') or 'free').upper()}")

    lines.append("\nMa'lumotlarni tahrirlash uchun web saytdagi profilga o'ting.")
    await message.answer("\n".join(lines))
