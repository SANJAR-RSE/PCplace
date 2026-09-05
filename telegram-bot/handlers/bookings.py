from aiogram import F, Router
from aiogram.filters import Command
from aiogram.types import CallbackQuery, Message

from api_client import ApiError, get, patch
from auth_helpers import require_session
from keyboards import booking_actions_keyboard
from resolve import format_booking, resolve_booking_refs

router = Router(name="bookings")

MAX_SHOWN = 10


@router.message(Command("mybookings"))
@router.message(F.text == "📅 Bronlarim")
async def cmd_my_bookings(message: Message) -> None:
    session = await require_session(message)
    if not session:
        return

    try:
        bookings = await get("/bookings/mine", token=session["access_token"])
    except ApiError as err:
        await message.answer(f"❌ {err.message}")
        return

    if not bookings:
        await message.answer("Hali bron qilmagansiz. \"🎮 Klublar\" orqali bron qiling.")
        return

    refs = await resolve_booking_refs(bookings)
    for booking in bookings[:MAX_SHOWN]:
        await message.answer(
            format_booking(booking, refs),
            reply_markup=booking_actions_keyboard(booking["_id"], booking["status"]),
        )
    if len(bookings) > MAX_SHOWN:
        await message.answer(f"… va yana {len(bookings) - MAX_SHOWN} ta bron. To'liq ro'yxat uchun web saytga o'ting.")


@router.callback_query(F.data.startswith("cancelbk:"))
async def cancel_booking(callback: CallbackQuery) -> None:
    session = await require_session(callback)
    if not session:
        return

    booking_id = callback.data.split(":", 1)[1]
    try:
        await patch(f"/bookings/{booking_id}/cancel", token=session["access_token"])
    except ApiError as err:
        await callback.answer(err.message, show_alert=True)
        return

    await callback.message.edit_text(callback.message.text + "\n\n❌ Bekor qilindi.", reply_markup=None)
    await callback.answer("Bron bekor qilindi")
