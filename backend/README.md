# PCplace — Backend

NestJS + MongoDB (Mongoose) — web (Next.js) va Telegram bot uchun yagona API.
To'liq talablar: `../PCplace-claude-code-prompt.md`.

## Ishga tushirish

```bash
npm install
npm run start:dev
```

Server `http://localhost:4000` da ko'tariladi (`.env`dagi `PORT`).

## Birinchi Admin yaratish

Adminlar o'zi ro'yxatdan o'ta olmaydi — birinchi admin quyidagi skript orqali yaratiladi:

```bash
npm run seed:admin -- --email=admin@pcplace.uz --password=SuperSecret123 --name="Bosh admin"
```

Klub egalarini esa shu Admin akkaunt orqali `POST /club-owners` bilan yaratadi.

## Asosiy oqim (auth)

1. `POST /auth/register` — User ro'yxatdan o'tadi (fullName, email, password, phone?)
2. `POST /auth/login` — User/Admin/ClubOwner uchun umumiy login (email + password) → JWT
3. `POST /auth/bot-code` — (JWT bilan, faqat User) web sessiyasidan bot-login kodi olish
4. `POST /auth/bot-login` — (faqat bot server, `x-bot-secret` header bilan) kod + telegramId → JWT, User.telegramId bog'lanadi

## Modullar

`schemas/`, `auth/`, `users/`, `admin/`, `club-owners/`, `clubs/`, `rooms/`, `pcs/`, `snacks/`, `bookings/`, `reviews/`, `subscriptions/` — har biri spec'dagi rol asosidagi ruxsatlar bilan.

`subscriptions/payment/` — Payme/Click uchun haqiqiy merchant kalitlari hozircha yo'q, shuning uchun `MockPaymentProvider` ishlatiladi. Real integratsiya qo'shilganda faqat shu provayderni almashtirish kifoya (`PAYMENT_PROVIDER` DI token orqali).

## Muhim

`.env` faylida haqiqiy `MONGO_URI`/`BOT_TOKEN` bor — hech qachon commit qilinmaydi (`.gitignore`da). Ishni oxirida bu kalitlarni Atlas/BotFather/Render panellaridan rotate qilish tavsiya etiladi.
