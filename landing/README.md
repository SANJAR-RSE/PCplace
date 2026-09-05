# PCplace — Landing page

Bitta statik HTML sahifa (toza HTML/CSS/JS, build kerak emas) — marketing/tanishtirish uchun.
To'liq talablar: `../PCplace-claude-code-prompt.md` (8-bo'lim).

## Ishga tushirish

Shunchaki `index.html`ni brauzerda oching, yoki istalgan statik hosting'ga (Vercel, Netlify, GitHub Pages) joylang.

```bash
# lokal ko'rish uchun (ixtiyoriy, oddiy static server):
npx serve .
```

## Sozlash

Faylning boshida (`<head>` ichida) bitta konfiguratsiya bor:

```html
<script>
  const APP_URL = 'http://localhost:3000';
</script>
```

Production'ga chiqishda shu qatorni web ilova (`../frontend`) domeniga o'zgartiring —
barcha "Ro'yxatdan o'tish" / "Kirish" tugmalari shu manzilga yo'naltiriladi.

## Tarkib

- Hero (tanishtirish + CTA)
- Xususiyatlar (xarita, real-time holat, VIP/umumiy xona, snacks)
- "Qanday ishlaydi" — 4 qadam
- Klub egalari uchun taklif
- Pro/Max narxlar (spec 9-bo'lim bilan mos: $10/oy, $54/yil)
- Yopilish CTA + footer

Animatsiyalar: scroll-reveal (`IntersectionObserver`), sticky/blur navbar, hover effektlar,
hero mockup card animatsiyasi — barchasi sof CSS/JS, tashqi kutubxonasiz.
