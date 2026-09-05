# PCplace — Telegram bot (aiogram)

Web sayt bilan sinxron ishlaydigan bot: **faqat login** (ro'yxatdan o'tish yo'q) va **booking**.
Bitta umumiy backend/User modeliga murojaat qiladi (`../backend`) — ro'yxatdan o'tish faqat web saytda.

## Ishga tushirish

```bash
python -m venv .venv
./.venv/Scripts/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # BOT_TOKEN, API_URL, BOT_INTERNAL_SECRET to'ldiring
python bot.py
```

`BOT_INTERNAL_SECRET` backend'dagi `.env`dagi `BOT_INTERNAL_SECRET` bilan **bir xil** bo'lishi shart —
bu qiymat `POST /auth/bot-login` endpointini himoya qiladi (faqat bot serveri chaqira oladi).

## Login oqimi (spec 4-bo'lim)

1. Foydalanuvchi web saytda ro'yxatdan o'tadi va profilidan bir martalik kod oladi.
2. Botga `/login` yuboradi, so'ng 6 xonali kodni kiritadi.
3. Bot `POST /auth/bot-login` orqali kodni tekshiradi, `telegramId`ni akkountga bog'laydi va
   `accessToken` oladi — shu tokenni sessiya faylida (`sessions.json`, `telegramId -> token`) saqlaydi.

## Funksiyalar

- `/login`, `/logout` — akkountga ulanish/uzilish
- `/clubs` (yoki "🎮 Klublar") — klublar → xona → bo'sh PC → soat → snacklar → tasdiqlash (spec 5.1–5.2)
- `/mybookings` (yoki "📅 Bronlarim") — bronlar tarixi, kutilayotgan/tasdiqlangan bronni bekor qilish
- `/profile` (yoki "👤 Profil") — asosiy profil ma'lumotlari

## Struktura

- `bot.py` — kirish nuqtasi (polling)
- `config.py` — `.env`dan sozlamalar
- `api_client.py` — backend REST API bilan async (httpx) ishlash
- `storage.py` — `telegramId -> accessToken` sessiyasi (JSON fayl)
- `states.py` — booking oqimi uchun FSM holatlari
- `keyboards.py` — inline/reply klaviaturalar
- `handlers/` — `/start`, `/login`, profil, klublar+booking, bronlar
