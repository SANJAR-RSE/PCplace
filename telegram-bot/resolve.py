"""Booking'lardagi ObjectId referenslarni (klub/xona/PC nomi) frontend bilan bir xil
mantiqda hal qilish — backend booking'larni populate qilmasdan qaytaradi."""

from api_client import get

STATUS_LABEL = {"pending": "Kutilmoqda", "confirmed": "Tasdiqlangan", "completed": "Yakunlangan", "cancelled": "Bekor qilingan"}
STATUS_EMOJI = {"pending": "🟡", "confirmed": "🟢", "completed": "⚪", "cancelled": "🔴"}


async def resolve_booking_refs(bookings: list[dict]) -> dict:
    club_ids = {b["club"] for b in bookings}
    clubs, rooms, pcs = {}, {}, {}

    for club_id in club_ids:
        try:
            clubs[club_id] = await get(f"/clubs/{club_id}")
        except Exception:
            continue
        try:
            for r in await get(f"/rooms?club={club_id}"):
                rooms[r["_id"]] = r
        except Exception:
            pass

    room_ids = {b["room"] for b in bookings}
    for room_id in room_ids:
        try:
            for p in await get(f"/pcs?room={room_id}"):
                pcs[p["_id"]] = p
        except Exception:
            pass

    return {"clubs": clubs, "rooms": rooms, "pcs": pcs}


def format_booking(booking: dict, refs: dict) -> str:
    club = refs["clubs"].get(booking["club"], {})
    room = refs["rooms"].get(booking["room"], {})
    pc = refs["pcs"].get(booking["pc"], {})
    status = booking["status"]

    lines = [
        f"{STATUS_EMOJI.get(status, '')} <b>{club.get('name', 'Klub')}</b>",
        f"{room.get('name', 'Xona')} · {pc.get('label', 'PC')} · {booking['hours']} soat",
        f"Holat: {STATUS_LABEL.get(status, status)}",
        f"Jami: {booking['totalPrice']:,} so'm",
    ]
    return "\n".join(lines)
