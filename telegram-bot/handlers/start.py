from aiogram import F, Router
from aiogram.filters import Command, CommandStart, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message

from api_client import ApiError, bot_login
from keyboards import main_menu_keyboard
from states import LoginFlow
from storage import clear_session, get_session, set_session

router = Router(name="start")

WELCOME = (
    "🎮 <b>PCplace</b> botiga xush kelibsiz!\n\n"
    "Bu bot orqali kompyuterhonalarni ko'rish, bo'sh joy bron qilish va bronlaringizni "
    "boshqarish mumkin.\n\n"
    "Ro'yxatdan o'tish faqat web saytda amalga oshiriladi — bu yerda faqat <b>login</b> qilasiz."
)


@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext) -> None:
    await state.clear()
    session = await get_session(message.from_user.id)
    if session:
        await message.answer(
            f"Salom, {session['full_name']}! 👋\nAkkountingiz allaqachon bog'langan.",
            reply_markup=main_menu_keyboard(),
        )
        return
    await message.answer(WELCOME + "\n\nBoshlash uchun /login buyrug'ini yuboring.")


@router.message(Command("login"))
async def cmd_login(message: Message, state: FSMContext) -> None:
    session = await get_session(message.from_user.id)
    if session:
        await message.answer("Siz allaqachon tizimga kirgansiz.", reply_markup=main_menu_keyboard())
        return
    await state.set_state(LoginFlow.waiting_for_code)
    await message.answer(
        "Web saytdagi profilingizdan olgan 6 xonali kodni yuboring.\n"
        "(Profil → \"Telegram botga ulanish\" → \"Kod olish\")"
    )


@router.message(StateFilter(LoginFlow.waiting_for_code), F.text)
async def process_login_code(message: Message, state: FSMContext) -> None:
    code = message.text.strip()
    if not code.isdigit() or len(code) != 6:
        await message.answer("Kod 6 ta raqamdan iborat bo'lishi kerak. Qaytadan yuboring yoki /cancel bilan bekor qiling.")
        return

    try:
        result = await bot_login(code, message.from_user.id)
    except ApiError as err:
        await message.answer(f"❌ {err.message}\nQaytadan urinib ko'ring yoki yangi kod so'rang.")
        return

    user = result["user"]
    await set_session(
        message.from_user.id,
        {
            "access_token": result["accessToken"],
            "user_id": user["_id"],
            "full_name": user["fullName"],
            "email": user["email"],
        },
    )
    await state.clear()
    await message.answer(
        f"✅ Xush kelibsiz, {user['fullName']}! Akkountingiz muvaffaqiyatli bog'landi.",
        reply_markup=main_menu_keyboard(),
    )


@router.message(Command("cancel"), StateFilter(LoginFlow.waiting_for_code))
async def cancel_login(message: Message, state: FSMContext) -> None:
    await state.clear()
    await message.answer("Bekor qilindi. Qayta urinish uchun /login yuboring.")


@router.message(Command("logout"))
@router.message(F.text == "🚪 Chiqish")
async def cmd_logout(message: Message, state: FSMContext) -> None:
    await state.clear()
    await clear_session(message.from_user.id)
    await message.answer("Tizimdan chiqdingiz. Qayta kirish uchun /login yuboring.")
