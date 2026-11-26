# Pelan — Ezine Interaktif

Majalah digital interaktif yang minimalis dan open source. Edisi 01: **Seni Melambat**.

Tanpa framework dan tanpa build step: cukup HTML, CSS, dan JavaScript. Hosting gratis di **Vercel**, database gratis di **Supabase**.

## Fitur

| Elemen | Isi |
|---|---|
| Visual dinamis | Sampul parallax, animasi muncul saat digulir, tema terang/gelap |
| Navigasi intuitif | Daftar isi (menu), titik navigasi samping, progress bar, pintasan `J`/`K`/`M`/`T` |
| Multimedia | Galeri geser (swipe/drag/panah + lightbox), video player kustom, ruang dengar (suara hujan/ombak/angin dibangkitkan Web Audio API) |
| Interaktif | Kalkulator waktu (infografis), kuis kepribadian + statistik pembaca, polling, tombol suka, bagikan |

## Struktur

```
index.html          # semua konten edisi
assets/style.css    # desain
assets/app.js       # interaksi
assets/db.js        # data: Supabase RPC + cadangan localStorage
assets/config.js    # URL & publishable key Supabase
supabase/schema.sql # tabel + fungsi + keamanan (RLS)
```

## Menjalankan lokal

```bash
npx serve .
```

## Menghubungkan Supabase

1. Buka Supabase Dashboard → **SQL Editor** → tempel isi `supabase/schema.sql` → **Run**.
2. Buka **Project Settings → API**, salin *Project URL* dan *anon / publishable key*.
3. Isi keduanya di `assets/config.js`, lalu deploy ulang.

Tanpa langkah ini situs tetap jalan dalam *mode lokal* (data hanya tersimpan di peramban pengunjung).

> Kunci anon/publishable aman di frontend: tabel dikunci RLS dan publik hanya bisa memanggil fungsi yang mengembalikan angka agregat. Jangan pernah memakai `service_role`/secret key di sini.

## Deploy ke Vercel

```bash
npx vercel --prod
```

Atau push ke GitHub lalu *Import Project* di vercel.com (Framework: **Other**, tanpa build command).

## Menambah edisi / konten

Setiap bab adalah `<section class="chapter" data-title="...">` di `index.html`. Daftar isi dan titik navigasi dibuat otomatis dari atribut `data-title`. Foto galeri, pertanyaan kuis, dan opsi polling ada di `assets/app.js`.

## Kredit

Foto: Lorem Picsum (Unsplash) · Video: "Flower", MDN Web Docs (CC0) · Font: Fraunces & Inter (Google Fonts).

## Lisensi

MIT
