// ==========================================================
// KONTEN E-ZINE — ubah teks, video, dan soal kuis di file ini.
// "icon" = nama ikon dari assets/icons.js
// "color" = warna kartu: pink | lilac | mint | butter | sky | peach
// ==========================================================

export const site = {
  title: "Gizi Cerdas",
  subtitle: "Lawan Anemia",
  tagline: "Panduan santai soal anemia, Tablet Tambah Darah, dan makanan kaya zat besi. Baca pelan-pelan, sambil rebahan juga boleh.",
};

// Jenis blok:
//  { t: "p", text }                                  → paragraf
//  { t: "list", items: [] }                          → daftar poin
//  { t: "callout", tone: "info|warn", title, text }
//  { t: "grid", items: [{ icon, title, text }] }     → kartu ikon
//  { t: "letters", word, items: [] }                 → kartu huruf (5L)
//  { t: "stat", value, unit, text }                  → angka besar
//  { t: "steps", items: [{ title, text }] }          → langkah bernomor
//  { t: "dodont", do: [], dont: [] }                 → lakukan / hindari
//  { t: "flip", items: [{ front, back }] }           → kartu mitos/fakta
//  { t: "check", title, items: [], result }          → daftar centang
//  { t: "pair" }                                     → permainan pasangan makanan
//  { t: "video", id }                                → kartu video

export const materi = [
  {
    id: "apa-itu-anemia", icon: "drop", color: "pink",
    title: "Apa itu Anemia?",
    summary: "Kenalan dulu sama si kurang darah.",
    blocks: [
      { t: "p", text: "Anemia itu kondisi saat kadar <b>hemoglobin (Hb)</b> di darah kamu lebih rendah dari normal. Hb adalah protein di sel darah merah yang tugasnya mengantar oksigen ke seluruh tubuh, termasuk ke otak dan otot." },
      { t: "p", text: "Kalau Hb rendah, oksigen yang sampai ke tubuh berkurang. Hasilnya: gampang capek, susah fokus, dan wajah kelihatan pucat." },
      { t: "grid", items: [
        { icon: "person", title: "Remaja putri", text: "Anemia kalau Hb < 12 g/dL" },
        { icon: "person", title: "Remaja putra ≥ 15 th", text: "Anemia kalau Hb < 13 g/dL" },
        { icon: "bump", title: "Ibu hamil", text: "Anemia kalau Hb < 11 g/dL" },
      ] },
      { t: "callout", tone: "info", title: "Kenapa cewek lebih rawan?", text: "Tiap bulan ada darah yang keluar saat menstruasi, tubuh lagi tumbuh cepat, dan sering kurang makan sumber zat besi." },
    ],
  },
  {
    id: "penyebab", icon: "search", color: "lilac",
    title: "Penyebab Anemia",
    summary: "Bukan cuma soal kurang makan.",
    blocks: [
      { t: "p", text: "Penyebab paling sering pada remaja adalah <b>kekurangan zat besi</b>, padahal zat besi adalah bahan utama untuk membuat hemoglobin." },
      { t: "grid", items: [
        { icon: "plate", title: "Asupan kurang", text: "Jarang makan lauk hewani, sayur hijau, dan kacang-kacangan." },
        { icon: "drop", title: "Kehilangan darah", text: "Menstruasi, apalagi yang banyak atau lama." },
        { icon: "worm", title: "Cacingan", text: "Cacing di usus ikut menghisap darah dan zat gizi." },
        { icon: "virus", title: "Infeksi", text: "Penyakit seperti malaria dan TBC bisa menurunkan Hb." },
        { icon: "cup", title: "Penyerapan terganggu", text: "Minum teh atau kopi barengan makan menghambat zat besi." },
        { icon: "scale", title: "Diet ketat", text: "Ngurangin makan demi berat badan tanpa mikirin gizi." },
      ] },
    ],
  },
  {
    id: "tanda-gejala", icon: "steth", color: "mint",
    title: "Tanda & Gejala",
    summary: "Ingat 5L, dan cek bagian tubuh yang pucat.",
    blocks: [
      { t: "p", text: "Gejala anemia sering dianggap biasa aja. Gampangnya, ingat <b>5L</b>:" },
      { t: "letters", items: ["Lemah", "Letih", "Lesu", "Lelah", "Lalai"] },
      { t: "list", items: [
        "Wajah, kelopak mata bagian dalam, bibir, kuku, dan telapak tangan kelihatan <b>pucat</b>",
        "Sering pusing dan mata berkunang-kunang",
        "Susah konsentrasi waktu belajar",
        "Gampang ngos-ngosan atau jantung berdebar saat beraktivitas",
        "Gampang ngantuk dan gampang sakit",
      ] },
      { t: "check", title: "Cek diri: mana yang sering kamu alami?", items: [
        "Gampang capek walau tidur cukup", "Sering pusing atau berkunang-kunang", "Kelopak mata bagian dalam pucat",
        "Susah fokus saat belajar", "Ngos-ngosan saat naik tangga", "Menstruasi banyak atau lama",
      ], result: "Kamu centang {n} tanda. Ini bukan alat diagnosis ya. Kalau kamu sering mengalami beberapa tanda, coba cek Hb di Puskesmas atau UKS." },
    ],
  },
  {
    id: "dampak", icon: "alert", color: "butter",
    title: "Dampak Anemia",
    summary: "Ngaruh ke sekarang, juga ke masa depan.",
    blocks: [
      { t: "p", text: "Anemia bukan cuma soal gampang capek. Efeknya kerasa sekarang, dan bisa kebawa sampai nanti." },
      { t: "steps", items: [
        { title: "Sekarang, sebagai remaja", text: "Konsentrasi dan prestasi turun, badan kurang bugar, daya tahan lemah jadi gampang sakit." },
        { title: "Nanti, sebagai calon ibu", text: "Remaja putri yang anemia berisiko tetap anemia saat hamil." },
        { title: "Saat hamil", text: "Risiko perdarahan saat melahirkan, bayi lahir prematur, dan berat badan lahir rendah (BBLR) jadi lebih tinggi." },
        { title: "Generasi berikutnya", text: "Bayi BBLR berisiko stunting. Cegah anemia dari sekarang = jaga generasi selanjutnya." },
      ] },
    ],
  },
  {
    id: "pencegahan", icon: "shield", color: "sky",
    title: "Cara Mencegah",
    summary: "Lima kebiasaan kecil buat Hb yang sehat.",
    blocks: [
      { t: "steps", items: [
        { title: "Makan gizi seimbang", text: "Pakai prinsip Isi Piringku: makanan pokok, lauk (terutama hewani), sayur, dan buah tiap makan." },
        { title: "Perbanyak sumber zat besi", text: "Hati, daging merah, ikan, ayam, telur, juga bayam, daun kelor, kacang-kacangan, dan tempe." },
        { title: "Minum TTD rutin", text: "Remaja putri: 1 tablet tiap minggu, sepanjang tahun." },
        { title: "Lengkapi vitamin C", text: "Jeruk, jambu biji, dan pepaya bantu tubuh menyerap zat besi." },
        { title: "Jaga kebersihan", text: "Cuci tangan pakai sabun, pakai alas kaki, dan minum obat cacing sesuai anjuran." },
      ] },
      { t: "video", id: "pencegahan" },
    ],
  },
  {
    id: "pentingnya-ttd", icon: "pill", color: "peach",
    title: "Pentingnya TTD",
    summary: "Kenapa Tablet Tambah Darah perlu rutin.",
    blocks: [
      { t: "p", text: "<b>Tablet Tambah Darah (TTD)</b> adalah suplemen berisi zat besi dan asam folat. Biasanya dibagikan gratis lewat sekolah dan Puskesmas, karena kebutuhan zat besi remaja putri sering nggak cukup kalau cuma dari makanan." },
      { t: "stat", value: "1", unit: "tablet / minggu", text: "Anjuran untuk remaja putri usia 12–18 tahun, sepanjang tahun." },
      { t: "grid", items: [
        { icon: "brain", title: "Fokus belajar", text: "Otak dapat oksigen yang cukup." },
        { icon: "bolt", title: "Lebih bugar", text: "Nggak gampang capek." },
        { icon: "shield", title: "Daya tahan", text: "Nggak gampang sakit." },
        { icon: "heart", title: "Investasi masa depan", text: "Siap untuk kehamilan yang sehat kelak." },
      ] },
      { t: "flip", items: [
        { front: "TTD bikin gemuk.", back: "TTD nggak mengandung kalori yang bikin gemuk. Nafsu makan bisa membaik karena badan lebih sehat." },
        { front: "Kalau nggak pucat, nggak perlu TTD.", back: "Anemia bisa terjadi tanpa gejala jelas. TTD rutin mencegah sebelum kejadian." },
        { front: "TTD bikin darah haid makin banyak.", back: "Nggak. TTD justru mengganti zat besi yang hilang saat menstruasi." },
        { front: "BAB jadi hitam, berarti bahaya.", back: "Tinja hitam saat minum TTD itu normal, asalnya dari sisa zat besi." },
      ] },
    ],
  },
  {
    id: "cara-minum-ttd", icon: "glass", color: "mint",
    title: "Cara Minum TTD",
    summary: "Waktu, minuman, dan trik biar nggak mual.",
    blocks: [
      { t: "dodont",
        do: ["Minum setelah makan, misalnya malam sebelum tidur, biar nggak mual", "Minum pakai air putih atau jus buah yang kaya vitamin C", "Minum di hari yang sama tiap minggu biar nggak lupa", "Simpan di tempat kering, jauh dari sinar matahari"],
        dont: ["Minum barengan teh atau kopi", "Minum barengan susu", "Minum barengan obat maag (kasih jarak ± 2 jam)", "Berhenti cuma karena efek samping ringan"] },
      { t: "callout", tone: "warn", title: "Efek samping ringan itu wajar", text: "Mual, nyeri ulu hati, atau tinja hitam bisa muncul dan nggak berbahaya. Minum setelah makan malam bisa menguranginya. Kalau keluhannya berat, konsultasi ke tenaga kesehatan." },
      { t: "video", id: "cara-minum" },
    ],
  },
  {
    id: "makanan", icon: "leaf", color: "lilac",
    title: "Makanan Kaya Zat Besi",
    summary: "Sumber zat besi dan pasangan makan yang pas.",
    blocks: [
      { t: "p", text: "Zat besi di makanan ada dua jenis. <b>Zat besi hewani (heme)</b> lebih gampang diserap tubuh dibanding <b>zat besi nabati (non-heme)</b>." },
      { t: "grid", items: [
        { icon: "fish", title: "Hewani (heme)", text: "Hati ayam/sapi, daging merah, ikan, ayam, telur, kerang." },
        { icon: "leaf", title: "Nabati (non-heme)", text: "Bayam, daun kelor, daun singkong, kacang merah, tempe, tahu." },
        { icon: "citrus", title: "Bantu penyerapan", text: "Vitamin C: jeruk, jambu biji, pepaya, tomat, mangga." },
        { icon: "tea", title: "Hambat penyerapan", text: "Teh, kopi (tanin), dan susu (kalsium) kalau diminum barengan." },
      ] },
      { t: "pair" },
    ],
  },
];

export const pairGame = {
  title: "Main sebentar, yuk",
  intro: "Menu makan kamu: <b>nasi, hati ayam, sayur bayam</b>. Minumnya apa yang paling pas?",
  options: [
    { icon: "citrus", label: "Jus jeruk", good: true, note: "Pas! Vitamin C bantu penyerapan zat besi." },
    { icon: "tea", label: "Teh manis", good: false, note: "Kurang pas. Tanin di teh menghambat zat besi. Kasih jarak 1–2 jam." },
    { icon: "milk", label: "Susu", good: false, note: "Kurang pas. Kalsium di susu bersaing sama zat besi. Minum di waktu lain." },
    { icon: "water", label: "Air putih", good: true, note: "Aman! Tambah buah biar makin optimal." },
    { icon: "coffee", label: "Kopi", good: false, note: "Kurang pas. Kopi menghambat penyerapan zat besi." },
    { icon: "fruit", label: "Jus jambu", good: true, note: "Pas banget! Jambu biji kaya vitamin C." },
  ],
};

// Video edukasi — ganti "url" dengan tautan video pilihanmu (YouTube, Drive, dsb).
export const videos = [
  { id: "anemia", title: "Mengenal Anemia pada Remaja", color: "pink", url: "https://www.youtube.com/results?search_query=video+edukasi+anemia+remaja+putri" },
  { id: "cara-minum", title: "Cara Minum Tablet Tambah Darah", color: "mint", url: "https://www.youtube.com/results?search_query=cara+minum+tablet+tambah+darah+remaja+putri" },
  { id: "pencegahan", title: "Isi Piringku & Cegah Anemia", color: "butter", url: "https://www.youtube.com/results?search_query=isi+piringku+cegah+anemia+remaja" },
];

// Kuis evaluasi. "a" = indeks jawaban benar (mulai dari 0).
export const quiz = {
  id: "evaluasi-anemia",
  intro: "10 soal singkat buat ngecek pemahamanmu. Tiap jawaban langsung ada pembahasannya.",
  askCode: true,
  questions: [
    { q: "Anemia adalah kondisi ketika…", o: ["Tekanan darah rendah", "Kadar hemoglobin dalam darah di bawah normal", "Kadar gula darah tinggi", "Kekurangan cairan tubuh"], a: 1, e: "Anemia ditandai kadar Hb di bawah normal. Anemia beda dengan tekanan darah rendah (hipotensi)." },
    { q: "Remaja putri dikatakan anemia bila kadar Hb…", o: ["Kurang dari 12 g/dL", "Kurang dari 15 g/dL", "Kurang dari 9 g/dL", "Kurang dari 20 g/dL"], a: 0, e: "Batasnya 12 g/dL untuk remaja putri." },
    { q: "Penyebab anemia paling umum pada remaja adalah…", o: ["Kurang tidur", "Kekurangan zat besi", "Terlalu banyak olahraga", "Kelebihan vitamin C"], a: 1, e: "Zat besi adalah bahan pembentuk hemoglobin, jadi kekurangannya paling sering jadi penyebab." },
    { q: "Yang termasuk gejala 5L adalah…", o: ["Lemah, letih, lesu, lelah, lalai", "Lapar, lemas, lupa, lambat, lelah", "Lesu, lapar, lucu, lemah, lalai", "Lambat, lupa, lemah, lesu, lapar"], a: 0, e: "5L: Lemah, Letih, Lesu, Lelah, dan Lalai." },
    { q: "Anjuran minum TTD untuk remaja putri adalah…", o: ["1 tablet setiap hari", "1 tablet setiap minggu", "1 tablet setiap bulan", "Hanya saat sakit"], a: 1, e: "Remaja putri dianjurkan 1 tablet TTD setiap minggu sepanjang tahun." },
    { q: "Minuman paling baik untuk menemani minum TTD adalah…", o: ["Teh manis", "Kopi", "Jus jeruk atau air putih", "Susu"], a: 2, e: "Vitamin C di jus jeruk membantu penyerapan. Teh, kopi, dan susu justru menghambat." },
    { q: "Supaya nggak mual, TTD sebaiknya diminum…", o: ["Saat perut kosong di pagi hari", "Setelah makan, misalnya malam sebelum tidur", "Sebelum olahraga", "Barengan obat maag"], a: 1, e: "Minum setelah makan, misalnya malam hari, bisa mengurangi mual." },
    { q: "Tinja berwarna hitam setelah minum TTD menandakan…", o: ["Perdarahan berbahaya", "Keracunan", "Efek wajar dari sisa zat besi", "TTD sudah kedaluwarsa"], a: 2, e: "Tinja hitam itu efek samping wajar dan nggak berbahaya." },
    { q: "Sumber zat besi yang paling mudah diserap tubuh adalah…", o: ["Hati ayam dan daging merah", "Nasi putih", "Teh hijau", "Roti tawar"], a: 0, e: "Zat besi hewani (heme) seperti di hati dan daging lebih mudah diserap." },
    { q: "Dampak anemia pada remaja putri saat hamil kelak adalah…", o: ["Bayi lebih tinggi", "Risiko perdarahan dan bayi berat lahir rendah", "Kehamilan lebih cepat", "Tidak ada dampak"], a: 1, e: "Anemia saat hamil menaikkan risiko perdarahan, bayi prematur, dan BBLR yang bisa berujung stunting." },
  ],
};

export const sources = [
  "Kementerian Kesehatan RI — Pedoman Pencegahan dan Penanggulangan Anemia pada Remaja Putri dan Wanita Usia Subur (WUS).",
  "WHO — Haemoglobin concentrations for the diagnosis of anaemia and assessment of severity.",
  "Kementerian Kesehatan RI — Pedoman Gizi Seimbang (Isi Piringku).",
];
