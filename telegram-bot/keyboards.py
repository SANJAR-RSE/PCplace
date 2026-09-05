from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton

ROOM_TYPE_LABEL = {"vip": "VIP xona", "umumiy": "Umumiy zal"}
PC_STATUS_EMOJI = {"bosh": "🟢", "band": "🔴", "texnik_xizmat": "⚪"}


def main_menu_keyboard() -> ReplyKeyboardMarkup:
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text="🎮 Klublar"), KeyboardButton(text="📅 Bronlarim")],
            [KeyboardButton(text="👤 Profil"), KeyboardButton(text="🚪 Chiqish")],
        ],
        resize_keyboard=True,
    )


def clubs_keyboard(clubs: list[dict]) -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(text=f"{c['name']} · ⭐{c['ratingAverage']:.1f}", callback_data=f"club:{c['_id']}")]
        for c in clubs
    ]
    return InlineKeyboardMarkup(inline_keyboard=rows)


def rooms_keyboard(rooms: list[dict]) -> InlineKeyboardMarkup:
    rows = [
        [
            InlineKeyboardButton(
                text=f"{r['name']} ({ROOM_TYPE_LABEL.get(r['type'], r['type'])}) — {r['pricePerHour']:,} so'm/soat",
                callback_data=f"room:{r['_id']}",
            )
        ]
        for r in rooms
    ]
    rows.append([InlineKeyboardButton(text="🔙 Klublarga qaytish", callback_data="back_to_clubs")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def pcs_keyboard(pcs: list[dict]) -> InlineKeyboardMarkup:
    rows = []
    row: list[InlineKeyboardButton] = []
    for pc in pcs:
        emoji = PC_STATUS_EMOJI.get(pc["status"], "")
        btn = InlineKeyboardButton(text=f"{emoji} {pc['label']}", callback_data=f"pc:{pc['_id']}" if pc["status"] == "bosh" else "noop")
        row.append(btn)
        if len(row) == 3:
            rows.append(row)
            row = []
    if row:
        rows.append(row)
    rows.append([InlineKeyboardButton(text="🔙 Xonalarga qaytish", callback_data="back_to_rooms")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def snacks_keyboard(snacks: list[dict], selected: set[str]) -> InlineKeyboardMarkup:
    rows = [
        [
            InlineKeyboardButton(
                text=f"{'✅' if s['_id'] in selected else '☐'} {s['name']} — {s['price']:,} so'm",
                callback_data=f"snack:{s['_id']}",
            )
        ]
        for s in snacks
    ]
    rows.append([InlineKeyboardButton(text="✅ Davom etish", callback_data="snacks_done")])
    return InlineKeyboardMarkup(inline_keyboard=rows)


def confirm_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(text="✅ Tasdiqlash", callback_data="confirm_booking"),
                InlineKeyboardButton(text="❌ Bekor qilish", callback_data="cancel_flow"),
            ]
        ]
    )


def booking_actions_keyboard(booking_id: str, status: str) -> InlineKeyboardMarkup | None:
    if status in ("pending", "confirmed"):
        return InlineKeyboardMarkup(
            inline_keyboard=[[InlineKeyboardButton(text="❌ Bronni bekor qilish", callback_data=f"cancelbk:{booking_id}")]]
        )
    return None
