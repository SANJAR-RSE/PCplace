# PCplace — Loyiha topshirig'i (Claude Code uchun)

## 1. Loyiha haqida umumiy ma'lumot

**PCplace** — kompyuter klublarida (kompyuterhonalarda) o'rin bron qilish uchun platforma.
Loyiha 4 ta qismdan iborat:

1. **Landing page** — bitta chiroyli, animatsiyali HTML sahifa (marketing/tanishtirish uchun)
2. **Web sayt** — asosiy platforma (foydalanuvchi, admin, kompyuterhona egasi uchun)
3. **Telegram bot** — web saytga sinxron ishlaydigan bot (login/booking uchun)
4. **Backend** — barcha tizimlarga xizmat ko'rsatuvchi yagona API

## 2. Texnologiyalar

| Qism                          | Texnologiya                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Frontend (web)                | Next.js                                                                                            |
| Backend                       | Node.js — NestJS (tavsiya etiladi, tuzilishi tartibli bo'lgani uchun) yoki Express.js              |
| Telegram bot                  | Python — aiogram                                                                                   |
| Landing                       | Toza HTML/CSS/JS, animatsiyali, chiroyli dizayn                                                    |
| Ma'lumotlar bazasi            | MongoDB                                                                                            |
| To'lov tizimi (booking uchun) | Yo'q (bron uchun to'lov joyida naqd/karta orqali amalga oshiriladi)                                |
| To'lov tizimi (obuna uchun)   | Kerak — online to'lov (masalan Payme/Click integratsiyasi) — Pro/Max obunalarini sotib olish uchun |

## 3. Foydalanuvchi rollari

- **User (foydalanuvchi)**
- **Admin**
- **Kompyuterhona egasi (club owner)**

## 4. Web sayt va Telegram bot sinxronizatsiyasi (MUHIM)

- Ro'yxatdan o'tish (**registratsiya**) **faqat web saytda** amalga oshiriladi.
- Telegram bot orqali ro'yxatdan o'tish **YO'Q** — botda faqat **login** bo'ladi.
- Login jarayoni:
  1. Foydalanuvchi web saytda ro'yxatdan o'tadi.
  2. Web sayt foydalanuvchiga **maxsus bir martalik kod** (masalan, 6 xonali raqam yoki token) generatsiya qiladi.
  3. Foydalanuvchi shu kodni Telegram botga yuboradi.
  4. Bot kodni backend orqali tekshiradi va foydalanuvchini **avtomatik login** qiladi (o'sha web-akkauntga bog'laydi).
- Bitta foydalanuvchi akkaunti ikkala tizimda (web + bot) bir xil bo'lishi, ma'lumotlar konflikt qilmasligi kerak — ya'ni backend'da **bitta umumiy User modeli** bo'lib, ikkala klient (web, bot) shu bitta manbaga murojaat qiladi.
- Kod muddati cheklangan bo'lishi kerak (masalan, 5-10 daqiqa amal qiladi, keyin eskiradi).

## 5. Funksional talablar — User (foydalanuvchi)

### 5.1 Xarita (Map)

- Barcha hamkor kompyuterhonalar xaritada ko'rinadi (geolokatsiya bo'yicha).
- Xaritadan kompyuterhonani tanlaganda:
  - Reyting ko'rsatiladi (masalan: **4.7 / 5**)
  - Boshqa foydalanuvchilarning izohlari (comment + baho) ko'rinadi (masalan: "Admin muomalasi zo'r ekan — 5/5")

### 5.2 Bron qilish jarayoni

Kompyuterhona tanlangandan so'ng:

1. Bo'sh xonalar va PC'lar ko'rsatiladi (real-time band/bo'sh holati bilan)
2. Xona turlari: **VIP xona** va **umumiy zal**, har birining narxi alohida ko'rsatiladi
3. Bitta PC tanlanganda — nechi soat o'ynamoqchi ekanligi so'raladi (masalan: 2 soat, 3 soat, yoki boshqa)
4. Snacks/qo'shimcha xizmatlar taklif qilinadi (masalan: Lays, Cola va h.k.) — qo'shish/qo'shmaslik tanlanadi
5. Umumiy narx hisoblanadi (xona narxi + PC vaqti + tanlangan snacklar)
6. Bron tasdiqlanadi — to'lov **joyida (naqd/karta)** amalga oshiriladi

### 5.3 Boshqa User funksiyalari

- Profil (bron tarixi, joriy bronlar)
- Kompyuterhonaga baho va izoh qoldirish (faqat borib kelgan/bron qilgan foydalanuvchilar uchun)

## 6. Funksional talablar — Admin

- Userlarni boshqarish (CRUD: yaratish, ko'rish, tahrirlash, o'chirish)
- Kompyuterhona egalarini boshqarish (CRUD)
- Adminlarni boshqarish (CRUD)
- Kompyuterhonalarni tasdiqlash/bloklash
- Umumiy statistika (bronlar soni, foydalanuvchilar soni va h.k.)

## 7. Funksional talablar — Kompyuterhona egasi (club owner)

- O'z kompyuterhonasi profilini boshqarish (nom, manzil, rasm, narxlar)
- Xonalar va PC'larni qo'shish/tahrirlash (VIP/umumiy, PC soni, narxlar)
- Snacks/qo'shimcha xizmatlar ro'yxatini boshqarish
- Kelgan bronlarni ko'rish va boshqarish (tasdiqlash/bekor qilish)
- O'z kompyuterhonasiga yozilgan izoh/baholarni ko'rish

## 8. Landing page talablari

- Bitta HTML sahifa, chiroyli va zamonaviy animatsiyalar bilan (scroll animation, smooth transitions)
- PCplace nima ekanligini tushuntiruvchi qism (hero section)
- Asosiy funksiyalar taqdimoti (map, booking, VIP xonalar)
- "Ro'yxatdan o'tish / Boshlash" tugmasi — bosilganda web saytning registratsiya sahifasiga yo'naltiradi

## 9. Pullik obuna tizimi (Pro / Max)

Ham **User**, ham **Kompyuterhona egasi** uchun bir xil narxda ikkita obuna tarifi mavjud:

| Tarif   | Oylik    | Yillik    |
| ------- | -------- | --------- |
| **Pro** | $10 / oy | $54 / yil |
| **Max** | $10 / oy | $54 / yil |

> **Eslatma:** Hozircha Pro va Max narxlari bir xil ko'rsatilgan ($10/oy, $54/yil) — bu, ehtimol, keyinchalik farqlanishi mumkin. Claude Code'ga ishni boshlashdan oldin buni tasdiqlab olish kerak (masalan, Max qimmatroq bo'lishi kerakmi, yoki narx rostdan ham bir xil, faqat funksiyalar farq qiladimi).

### 9.1 Tariflar orasidagi farq (taxminiy — loyihani ishlab chiqishda aniqlashtirish kerak)

**User uchun:**

- **Bepul (Free):** cheklangan sonda bron qilish (masalan, oyiga 3-5 marta), izoh qoldirish
- **Pro:** cheklovsiz bron qilish, bronni ustuvor tasdiqlash (band joylarga navbatsiz imkoniyat), maxsus chegirmalar
- **Max:** Pro'dagi barchasi + VIP xonalarga ustuvor bron, shaxsiy statistika (o'ynagan vaqt, xarajatlar tarixi), maxsus badge/status profilda

**Kompyuterhona egasi uchun:**

- **Bepul (Free):** cheklangan sonda xona/PC qo'shish, asosiy statistikasiz
- **Pro:** cheklovsiz xona/PC qo'shish, batafsil statistika (kunlik/oylik daromad, band bo'lish darajasi), izohlarga javob berish imkoniyati
- **Max:** Pro'dagi barchasi + xaritada/qidiruvda yuqoriroq o'rinda chiqish (promo/reklama imkoniyati), kengaytirilgan analitika, ustuvor texnik yordam

### 9.2 Texnik talablar

- `Subscription` modeli (MongoDB): foydalanuvchi/egasi ID, tarif turi (`pro` / `max`), davomiylik (`monthly` / `yearly`), boshlanish va tugash sanasi, holati (`active` / `expired` / `cancelled`)
- Obuna tugagach avtomatik `Free` tarifga qaytarish (yoki avtomatik yangilash — auto-renewal, agar kerak bo'lsa)
- To'lov integratsiyasi (Payme/Click) obuna sotib olish uchun
- Backend darajasida obuna tekshiruvi (middleware/guard) — Pro/Max funksiyalariga kirishni cheklash uchun

## 10. Backend arxitekturasi bo'yicha talablar

- Yagona REST (yoki GraphQL) API — Next.js frontend va Telegram bot ikkalasi ham shu API'ga murojaat qiladi
- Autentifikatsiya: JWT asosida (web uchun oddiy login/parol yoki OAuth; bot uchun — yuqoridagi kod orqali login)
- MongoDB uchun asosiy modellar (kamida): `User`, `Admin`, `ClubOwner`, `Club` (kompyuterhona), `Room` (xona: VIP/umumiy), `PC`, `Booking`, `Snack`, `Review` (baho/izoh), `LoginCode` (bot login kodlari uchun), `Subscription` (Pro/Max obunalari uchun)
- Rol asosida ruxsatlar (Role-based access control): user / admin / club owner

## 11. Muhit o'zgaruvchilari (Environment Variables)

Loyihani ishga tushirish uchun quyidagi manbalar/kalitlar ishlatiladi. Bular `.env` faylida saqlanishi va **hech qachon GitHub'ga commit qilinmasligi** kerak (`.gitignore`ga qo'shilsin):

```env
GITHUB_REPO=https://github.com/SANJAR-RSE/PCplace.git
MONGO_URI=mongodb+srv://rasulberdievsanjar_db_user:aGVDb7zpYK8D9MqE@cluster0.k6qlvor.mongodb.net/?appName=Cluster0
MONGO_USER=rasulberdievsanjar_db_user
MONGO_PASSWORD=aGVDb7zpYK8D9MqE
RENDER_TOKEN=rnd_2eNNC9OnUAqdC1FRt6Oe0PHDQSdp
BOT_TOKEN=8826550375:AAGpj1ubR9Pwu-Gw6j-LDPL8JON1E6r37Tk
```

> ⚠️ **Xavfsizlik bo'yicha muhim eslatma:** Bu kalitlar (ayniqsa `MONGO_PASSWORD`, `RENDER_TOKEN`, `BOT_TOKEN`) haqiqiy va ishlaydigan kalitlar bo'lsa, ular endi shu suhbatda ko'rinib turibdi. Tavsiya:
>
> - MongoDB parolini **Atlas panelidan almashtiring** (rotate qiling) va yangi parolni faqat `.env` faylida saqlang.
> - Telegram bot tokenini ham **@BotFather** orqali "Revoke token" qilib, yangisini oling.
> - Render tokenini ham Render dashboard'dan qayta generatsiya qiling.
> - Bu faylni (yoki `.env`ni) hech qachon ochiq repo'ga yuklamang — faqat lokal yoki maxfiy muhit sozlamalarida (Render/Vercel environment variables) saqlang.

## 12. Nima kutilyapti (Claude Code'dan so'raladigan ish)

1. Loyiha strukturasini (monorepo yoki alohida papkalar: `frontend/`, `backend/`, `telegram-bot/`, `landing/`) tuzib bering
2. Backend'da MongoDB modellarini va asosiy CRUD/booking logikasini yarating
3. Web + bot sinxron login logikasini (kod orqali) amalga oshiring
4. Har bir rol uchun asosiy sahifalar/endpoint'larni yarating
5. Pro/Max obuna tizimini (to'lov integratsiyasi bilan) amalga oshiring
6. Landing page'ni chiroyli animatsiyalar bilan yarating

---

**Eslatma:** Loyihani bir vaqtning o'zida to'liq yozishdan ko'ra, bosqichma-bosqich boring — masalan, avval backend modellar va autentifikatsiya, keyin user flow, keyin admin/club owner panel, oxirida landing.
