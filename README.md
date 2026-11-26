# Gizi Cerdas: Lawan Anemia — E-Zine Interaktif

Media edukasi gizi berbentuk majalah digital interaktif untuk remaja, berisi materi tentang anemia, penyebab, tanda dan gejala, dampak, pencegahan, pentingnya Tablet Tambah Darah (TTD), cara minum TTD yang benar, serta makanan yang meningkatkan penyerapan zat besi. Dirancang mobile-first agar nyaman diakses lewat smartphone.

Tanpa framework dan tanpa build step. Hosting gratis di **Vercel**, database gratis di **Supabase**.

## Fitur

| Layar | Isi |
|---|---|
| **Navigasi menu** | Sampul, menu materi (grid), progres baca, pengingat minum TTD mingguan |
| **Materi edukasi** | 8 materi dengan infografis, kartu mitos vs fakta, cek gejala, permainan pasangan makanan, tombol navigasi sebelumnya/selanjutnya, dan geser kiri/kanan |
| **Video & informasi** | Daftar video edukasi lewat tautan |
| **Kuis & evaluasi** | 10 soal pilihan ganda dengan umpan balik langsung, skor, dan pembahasan. Hasil disimpan ke Supabase (opsional dengan kode responden) |

## Struktur

```
index.html          # kerangka aplikasi (top bar + tab bar)
assets/content.js   # SEMUA KONTEN: materi, video, soal kuis, sumber
assets/app.js       # router & interaksi
assets/db.js        # penyimpanan hasil kuis (Supabase + cadangan lokal)
assets/config.js    # URL & publishable key Supabase
assets/style.css    # desain
supabase/schema.sql # tabel quiz_attempts + fungsi + keamanan (RLS)
```

## Mengubah konten

Semua teks ada di `assets/content.js`:
- **Materi:** tambah, ubah, atau hapus objek di array `materi`. Jenis blok yang tersedia dijelaskan di bagian atas file.
- **Video:** ganti `url` di array `videos` dengan tautan YouTube/Drive pilihanmu. Tautan bawaan masih berupa pencarian YouTube.
- **Kuis:** ubah array `quiz.questions`. `a` adalah indeks jawaban benar, dimulai dari 0.

## Menghubungkan Supabase (menyimpan hasil kuis)

1. Buka Supabase Dashboard → **SQL Editor**, tempel isi `supabase/schema.sql`, lalu klik **Run**.
2. Buka **Project Settings → API**, lalu salin *Project URL* dan *anon / publishable key*.
3. Isi keduanya di `assets/config.js`, lalu commit dan push.
4. Lihat hasil di **Table Editor → quiz_attempts**, atau dengan contoh query di bagian bawah `schema.sql`.

Tanpa Supabase, kuis tetap berfungsi dan skor tersimpan di perangkat pengguna.

## Menjalankan lokal

```bash
npx serve .
```

## Deploy

Repo ini terhubung ke Vercel: setiap push ke `main` akan otomatis ter-deploy. Untuk deploy manual: `npx vercel --prod`.

## Catatan

Materi bersifat edukasi dan tidak menggantikan pemeriksaan tenaga kesehatan. Rujukan: Kemenkes RI (Pedoman Pencegahan dan Penanggulangan Anemia pada Rematri & WUS, Pedoman Gizi Seimbang) dan WHO.

## Lisensi

MIT
