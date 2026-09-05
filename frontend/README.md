# PCplace — Frontend (Next.js)

User, Admin va Klub egasi uchun web platforma. To'liq talablar: `../PCplace-claude-code-prompt.md`.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL — backend manzili
npm run dev
```

Backend (`../backend`) `http://localhost:4000`da ishlab turishi kerak.

## Struktura

- `src/app` — App Router sahifalari (rol bo'yicha: `/clubs`, `/profile`, `/owner`, `/admin`)
- `src/lib` — API client, auth context (JWT localStorage'da saqlanadi)
- `src/components` — qayta ishlatiladigan UI qismlar
- `src/types` — backend schemalariga mos TypeScript tiplari

## Rollar va oqim

- **User**: ro'yxatdan o'tadi → `/clubs` xaritasidan klub tanlaydi → xona/PC/soat/snack tanlab bron qiladi → `/profile`da bronlarini ko'radi, izoh qoldiradi, Telegram bot uchun kod oladi.
- **Klub egasi**: login qiladi (admin yaratadi) → `/owner`da klublarini, xona/PC/snacklarini boshqaradi → `/owner/bookings`da kelgan bronlarni tasdiqlaydi.
- **Admin**: login qiladi → `/admin`da statistika, klublarni tasdiqlash/bloklash, user/klub egasi/admin CRUD.
