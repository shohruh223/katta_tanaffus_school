# Katta Tanaffus School — sayt va platforma (demo)

Katta Tanaffus — **xususiy maktab (1–11-sinflar)**. Fanlar maktab darslarida o‘tiladi, alohida kurs sotilmaydi.
Alohida yoziladigan va to‘lanadigan faqat ikkita to‘garak bor: **Taekwondo** va **Gimnastika** (darsdan keyin).
Hammasi brauzerda ishlaydi, server shart emas: `platforma.html` ni oching yoki pastki burchakdagi **Demo** tugmasini bosing.

## v4: maktab modeliga o‘tkazildi
- Menyuda “Kurslar” o‘rniga **Fanlar** (`courses.html`): kuchaytirilgan fanlar (ingliz tili, matematika, informatika, robotika, mental arifmetika, jismoniy tarbiya) — narxsiz, “darsda” deb; pastda **to‘garaklar** — guruhlar, jadval, bo‘sh o‘rinlar va “To‘garakka yozilish”.
- Asosiy tugma — **Qabulga ariza** (`yozilish.html`): ota-ona telefoni → farzand → sinf yoki to‘garak (AI tavsiya) → roziliklar → qabul suhbati yoki bepul sinov mashg‘uloti. To‘lov qadami yo‘q: o‘qish to‘lovi va shartnoma — suhbatdan keyin.
  Havolalar: `yozilish.html?grade=5`, `?tugarak=taekwondo`, `?tugarak=gymnastics`, `?branch=yunusobod`, `?class=5a`.
- Bosh sahifa: yosh surgichi endi **sinf**ni ko‘rsatadi (11 yosh → 5-sinf) va unga mos fanlar va to‘garaklarni yoqadi.
- Biz haqimizda: 5-A sinfning namunaviy kuni (darslar + to‘garak). Filiallar: sinflar va to‘garaklardagi bo‘sh o‘rinlar.
- Aloqa: FAQ — qabul, o‘qish to‘lovi (qabul bo‘limi aytadi), to‘garaklar.
- Eski `mahsulotlar.html`, `mahsulot-detail.html`, `cart.html` — `courses.html` ga yo‘naltiradi.
- AI assistent: narx aytmaydi (qabul bo‘limiga yo‘naltiradi), sinf va to‘garak bo‘yicha javob beradi, qabul arizasi yaratadi.

## v6: Ro‘yxatdan o‘tish — menyuda
- Eski saytdagidek, sarlavhada **Kirish | Ro‘yxatdan o‘tish** (mobil menyuda va footerda ham). “Bosh sahifa” menyudan olindi — logotip bosh sahifaga olib boradi (mobil menyuda qoldi).
- `register.html` — ota-ona oila hisobini ochadi: telefon + SMS kod → ism → farzandlar → farzandga portal logini → roziliklar. Bitta raqamga bitta oila hisobi (qayta urinilsa “Kirish”ga yo‘naltiradi).
- Ro‘yxatdan keyin **Kabinetimga o‘tish** → `ota-ona.html` sizning ismingiz bilan ochiladi va yuqorida **Qabul jarayoni** chiqadi: har farzand uchun oila hisobi → bepul diagnostika → qabulga ariza → qabul suhbati → shartnoma. Qabul bo‘limi (`admin.html`) arizani surganda qadamlar jonli yangilanadi.
- Kabinetdan “Yuborish” — qabul arizasi farzand ismi, yoshi va sinfi bilan ochiladi; raqam allaqachon tasdiqlangan, SMS kod so‘ralmaydi.
- Keyinroq `login.html` → Ota-ona → shu raqam: kabinet yana sizning ismingiz bilan ochiladi. Farzand o‘quvchi portaliga (`dashboard.html`) ota-ona yaratgan login va parol bilan kiradi.
- Eski saytdagi email + parol shakli o‘rniga — telefon va SMS kod (parol shart emas).

## “Demo” tugmasi nima
Pastki chap burchakdagi **Demo** — taqdimot paneli, oddiy ota-onalar uchun emas:
- **Rolni almashtirish** — ota-ona, o‘qituvchi, qabul bo‘limi, rahbar, o‘quvchi kabinetlarini kirishsiz ochish;
- **Investor turi** — 8 qadamli yo‘l-yo‘riq: ariza → qabul → davomat → hisobot → rahbar paneli;
- **Platforma haqida**, **Taqdimot rejimi** (`pitch.html`);
- **Demo ma’lumotni tiklash** — namunaviy ma’lumotlarni boshlang‘ich holatga qaytaradi.
Sayt haqiqiy foydalanuvchilarga ochilganda bu tugmani yashirish kerak.

## Kabinetlar
| Sahifa | Kim uchun | Nima bor |
|---|---|---|
| `platforma.html` | Investor, hamkor | Muammo → yechim, 6 rol, 20 AI funksiya, bolalar xavfsizligi, bozor, kalkulyatorlar, KPI, reja |
| `pitch.html` | Taqdimot | 13 ta slayd: ← → tugmalari, F — to‘liq ekran |
| `diagnostika.html` | Mehmon | Ingliz tili adaptiv testi → daraja, zaif mavzular, bo‘sh o‘rinli sinflar |
| `yozilish.html` | Ota-ona | Qabulga ariza (maktab yoki to‘garak) |
| `ota-ona.html` | Ota-ona | Bugungi maktab kuni (dars jadvali + to‘garak), davomat, haftalik hisobot (fanlar bo‘yicha), baholar, o‘qish to‘lovi va to‘garak hisoblari, roziliklar |
| `oqituvchi.html` | O‘qituvchi | Ingliz tili o‘qituvchisi, 5-A sinf rahbari: 4-dars davomati, AI takliflari, 5 ballik jurnal, test generatori |
| `admin.html` | Qabul bo‘limi | Qabul arizalari (maktab / Taekwondo / Gimnastika), AI baholash, sinf va to‘garak tavsiyasi, to‘lov nazorati |
| `rahbar.html` | Rahbar | KPI, qabul voronkasi, filiallar, AI savol-javob |
| `bilim.html` | O‘quvchi | Ingliz tili bilim xaritasi va 5 daqiqalik mashq, coin qoidalari |

## Demo qanday ko‘rsatiladi
1. `platforma.html` → **Investor turini boshlash** — 8 qadam, ~3 daqiqa.
2. `oqituvchi.html` va `ota-ona.html` ni yonma-yon oching: o‘qituvchida Sardorni “kelmadi” deb saqlang — ota-ona telefoniga xabar keladi.
3. Saytda “Qabulga ariza” yoki assistent → `admin.html` da yangi ariza “issiq” bo‘lib chiqadi.
4. Boshlang‘ich holatga qaytarish: **Demo → Demo ma’lumotni tiklash**.

## Tasdiqlash kerak (taxminlar)
- Sinflar, xonalar, to‘garak jadvallari va bo‘sh o‘rinlar — **demo ma’lumot**.
- Ota-ona kabinetidagi summalar (o‘qish 2 400 000, Taekwondo 300 000, Gimnastika 250 000 so‘m) — **namuna**; saytning ochiq sahifalarida narx ko‘rsatilmaydi.
- To‘garak yosh oralig‘i: Taekwondo 5–17, Gimnastika 4–14.

## Muhim: bu demo
- Ma’lumot brauzer xotirasida (`localStorage`, `ktp:` kalitlari) — bitta brauzer ichida tablar orasida sinxron.
- AI javoblari qoidaviy namunalar; SMS va Telegram — taqlid.
- Keyingi qadam (TZ 15–17-bo‘limlar): Django + DRF backend, `/api/v1/`, Payme/Click webhook, Telegram bot, LLM.

## Fayllar
- `static/js/kt-data.js` — yagona katalog: fanlar, to‘garaklar, sinflar, to‘garak guruhlari, dars jadvali, filiallar, demo oila va arizalar
- `static/js/kt-platform.js` — demo “backend”, AI qoidalari (ariza bahosi, sinf/to‘garak tavsiyasi), investor turi
- `static/js/kt-assistant.js` — AI qabul assistenti
- `static/css/site.css`, `static/js/ks.js` — sayt dizayni (v2 “olov”), mobil menyu, ariza oynasi
