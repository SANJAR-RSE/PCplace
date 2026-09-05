from aiogram import F, Router
from aiogram.filters import Command, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import CallbackQuery, Message

from api_client import ApiError, get, post
from auth_helpers import require_session
from keyboards import clubs_keyboard, confirm_keyboard, pcs_keyboard, rooms_keyboard, snacks_keyboard
from states import BookingFlow

router = Router(name="clubs")

MAX_CLUBS_SHOWN = 15


async def _show_clubs(message: Message) -> None:
    clubs = await get("/clubs")
    if not clubs:
        await message.answer("Hozircha hamkor klublar yo'q.")
        return
    await message.answer(
        "🎮 Hamkor klublar (reyting bo'yicha):",
        reply_markup=clubs_keyboard(clubs[:MAX_CLUBS_SHOWN]),
    )


@router.message(Command("clubs"))
@router.message(F.text == "🎮 Klublar")
async def cmd_clubs(message: Message, state: FSMContext) -> None:
    session = await require_session(message)
    if not session:
        return
    await state.clear()
    await _show_clubs(message)


@router.callback_query(F.data == "back_to_clubs")
async def back_to_clubs(callback: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    clubs = await get("/clubs")
    if not clubs:
        await callback.message.edit_text("Hozircha hamkor klublar yo'q.")
    else:
        await callback.message.edit_text(
            "🎮 Hamkor klublar (reyting bo'yicha):",
            reply_markup=clubs_keyboard(clubs[:MAX_CLUBS_SHOWN]),
        )
    await callback.answer()


@router.callback_query(F.data.startswith("club:"))
async def choose_club(callback: CallbackQuery, state: FSMContext) -> None:
    session = await require_session(callback)
    if not session:
        return

    club_id = callback.data.split(":", 1)[1]
    club = await get(f"/clubs/{club_id}")
    rooms = await get(f"/rooms?club={club_id}")

    if not rooms:
        await callback.answer("Bu klubda hali xonalar yo'q", show_alert=True)
        return

    await state.update_data(club_id=club_id, club_name=club["name"])
    await state.set_state(BookingFlow.choosing_room)
    await callback.message.edit_text(
        f"<b>{club['name']}</b>\n{club['address']}\n\nXonani tanlang:",
        reply_markup=rooms_keyboard(rooms),
    )
    await callback.answer()


@router.callback_query(F.data == "back_to_rooms")
async def back_to_rooms(callback: CallbackQuery, state: FSMContext) -> None:
    data = await state.get_data()
    club_id = data.get("club_id")
    if not club_id:
        await back_to_clubs(callback, state)
        return

    rooms = await get(f"/rooms?club={club_id}")
    await state.set_state(BookingFlow.choosing_room)
    await callback.message.edit_text(
        f"<b>{data.get('club_name', '')}</b>\n\nXonani tanlang:",
        reply_markup=rooms_keyboard(rooms),
    )
    await callback.answer()


@router.callback_query(F.data.startswith("room:"), StateFilter(BookingFlow.choosing_room))
async def choose_room(callback: CallbackQuery, state: FSMContext) -> None:
    room_id = callback.data.split(":", 1)[1]
    data = await state.get_data()
    rooms = await get(f"/rooms?club={data['club_id']}")
    room = next((r for r in rooms if r["_id"] == room_id), None)
    if not room:
        await callback.answer("Xona topilmadi", show_alert=True)
        return

    pcs = await get(f"/pcs?room={room_id}")
    if not pcs:
        await callback.answer("Bu xonada hali PC yo'q", show_alert=True)
        return

    await state.update_data(room_id=room_id, room_name=room["name"], room_price=room["pricePerHour"], pcs=pcs)
    await state.set_state(BookingFlow.choosing_pc)
    await callback.message.edit_text(
        f"<b>{room['name']}</b> — {room['pricePerHour']:,} so'm/soat\n\n"
        "Bo'sh (🟢) kompyuterni tanlang:",
        reply_markup=pcs_keyboard(pcs),
    )
    await callback.answer()


@router.callback_query(F.data == "noop")
async def noop(callback: CallbackQuery) -> None:
    await callback.answer("Bu PC hozir band yoki texnik xizmatda")


@router.callback_query(F.data.startswith("pc:"), StateFilter(BookingFlow.choosing_pc))
async def choose_pc(callback: CallbackQuery, state: FSMContext) -> None:
    pc_id = callback.data.split(":", 1)[1]
    data = await state.get_data()
    pc = next((p for p in data.get("pcs", []) if p["_id"] == pc_id), None)
    if not pc:
        await callback.answer("PC topilmadi", show_alert=True)
        return

    await state.update_data(pc_id=pc_id, pc_label=pc["label"])
    await state.set_state(BookingFlow.entering_hours)
    await callback.message.edit_text(f"Tanlandi: <b>{pc['label']}</b>\n\nNecha soat o'ynamoqchisiz? (raqam yuboring)")
    await callback.answer()


@router.message(StateFilter(BookingFlow.entering_hours), F.text)
async def enter_hours(message: Message, state: FSMContext) -> None:
    text = message.text.strip()
    if not text.isdigit() or int(text) < 1:
        await message.answer("Iltimos, 1 yoki undan katta butun son yuboring (masalan: 2).")
        return

    hours = int(text)
    data = await state.get_data()
    snacks = await get(f"/snacks?club={data['club_id']}")

    await state.update_data(hours=hours, snacks=snacks, selected_snacks=[])

    if not snacks:
        await _show_confirmation(message, state)
        return

    await state.set_state(BookingFlow.choosing_snacks)
    await message.answer(
        "Snacks / qo'shimcha xizmatlar tanlang (ixtiyoriy), so'ng \"✅ Davom etish\" bosing:",
        reply_markup=snacks_keyboard(snacks, set()),
    )


@router.callback_query(F.data.startswith("snack:"), StateFilter(BookingFlow.choosing_snacks))
async def toggle_snack(callback: CallbackQuery, state: FSMContext) -> None:
    snack_id = callback.data.split(":", 1)[1]
    data = await state.get_data()
    selected: list[str] = data.get("selected_snacks", [])
    if snack_id in selected:
        selected.remove(snack_id)
    else:
        selected.append(snack_id)
    await state.update_data(selected_snacks=selected)

    await callback.message.edit_reply_markup(reply_markup=snacks_keyboard(data.get("snacks", []), set(selected)))
    await callback.answer()


@router.callback_query(F.data == "snacks_done", StateFilter(BookingFlow.choosing_snacks))
async def snacks_done(callback: CallbackQuery, state: FSMContext) -> None:
    await state.set_state(BookingFlow.confirming)
    await _show_confirmation(callback.message, state, edit=True)
    await callback.answer()


async def _show_confirmation(message: Message, state: FSMContext, *, edit: bool = False) -> None:
    data = await state.get_data()
    hours = data["hours"]
    room_price = data["room_price"]
    room_cost = room_price * hours

    snacks_by_id = {s["_id"]: s for s in data.get("snacks", [])}
    selected = data.get("selected_snacks", [])
    snacks_cost = sum(snacks_by_id[s]["price"] for s in selected if s in snacks_by_id)
    total = room_cost + snacks_cost

    lines = [
        "🧾 <b>Bron tafsilotlari</b>",
        f"Klub: {data.get('club_name', '')}",
        f"Xona: {data.get('room_name', '')} · PC: {data.get('pc_label', '')}",
        f"Vaqt: {hours} soat — {room_cost:,} so'm",
    ]
    if selected:
        names = ", ".join(snacks_by_id[s]["name"] for s in selected if s in snacks_by_id)
        lines.append(f"Snacks: {names} — {snacks_cost:,} so'm")
    lines.append(f"\n<b>Jami: {total:,} so'm</b>")
    lines.append("\nTo'lov joyida (naqd/karta) amalga oshiriladi.")

    text = "\n".join(lines)
    if edit:
        await message.edit_text(text, reply_markup=confirm_keyboard())
    else:
        await message.answer(text, reply_markup=confirm_keyboard())

    await state.set_state(BookingFlow.confirming)


@router.callback_query(F.data == "confirm_booking", StateFilter(BookingFlow.confirming))
async def confirm_booking(callback: CallbackQuery, state: FSMContext) -> None:
    session = await require_session(callback)
    if not session:
        return

    data = await state.get_data()
    selected = data.get("selected_snacks", [])

    try:
        await post(
            "/bookings",
            {
                "pc": data["pc_id"],
                "hours": data["hours"],
                "snacks": [{"snack": s, "quantity": 1} for s in selected],
            },
            token=session["access_token"],
        )
    except ApiError as err:
        await callback.message.edit_text(f"❌ {err.message}\n\nQaytadan urinib ko'ring: /clubs")
        await state.clear()
        await callback.answer()
        return

    await state.clear()
    await callback.message.edit_text("✅ Bron muvaffaqiyatli yaratildi! Holatini \"📅 Bronlarim\"dan kuzating.")
    await callback.answer()


@router.callback_query(F.data == "cancel_flow")
async def cancel_flow(callback: CallbackQuery, state: FSMContext) -> None:
    await state.clear()
    await callback.message.edit_text("Bekor qilindi. Qaytadan boshlash uchun /clubs yuboring.")
    await callback.answer()
