// ==========================================================
// KONTEN E-ZINE — ubah teks, video, dan soal kuis di file ini.
// Tidak perlu menyentuh app.js untuk mengganti isi.
// ==========================================================

export const site = {
  title: "Gizi Cerdas",
  subtitle: "Lawan Anemia",
  tagline: "E-Zine interaktif tentang anemia, Tablet Tambah Darah (TTD), dan makanan kaya zat besi untuk remaja.",
  edition: "Media Edukasi Gizi",
};

// Jenis blok yang bisa dipakai di "blocks":
//  { t: "p", text }                                  → paragraf
//  { t: "list", items: [] }                          → daftar poin
//  { t: "callout", tone: "info|warn|ok", title, text }
//  { t: "grid", items: [{ icon, title, text }] }     → kartu ikon (infografis)
//  { t: "stat", value, unit, text }                  → angka besar
//  { t: "steps", items: [{ title, text }] }          → langkah bernomor
//  { t: "dodont", do: [], dont: [] }                 → boleh / hindari
//  { t: "flip", items: [{ front, back }] }           → kartu mitos/fakta (ketuk untuk balik)
//  { t: "check", title, items: [], result }          → daftar centang interaktif
//  { t: "pair" }                                     → permainan pasangan makanan
//  { t: "video", id }                                → tautan ke video (lihat daftar videos)

export const materi = [
  {
    id: "apa-itu-anemia",
    icon: "🩸",
    title: "Apa itu Anemia?",
    summary: "Kenali kondisi kurang darah dan batas normal hemoglobin.",
    blocks: [
      { t: "p", text: "Anemia adalah kondisi ketika kadar <b>hemoglobin (Hb)</b> dalam darah lebih rendah dari normal. Hemoglobin adalah protein dalam sel darah merah yang bertugas membawa oksigen ke seluruh tubuh — termasuk otak dan otot." },
      { t: "p", text: "Saat Hb rendah, tubuh kekurangan oksigen sehingga mudah lelah, sulit fokus, dan tampak pucat." },
      { t: "grid", items: [
        { icon: "👧", title: "Remaja putri", text: "Anemia bila Hb < 12 g/dL" },
        { icon: "👦", title: "Remaja putra (≥15 th)", text: "Anemia bila Hb < 13 g/dL" },
        { icon: "🤰", title: "Ibu hamil", text: "Anemia bila Hb < 11 g/dL" },
      ] },
      { t: "callout", tone: "info", title: "Kenapa remaja putri lebih berisiko?", text: "Remaja putri kehilangan darah setiap bulan saat menstruasi, sedang dalam masa pertumbuhan cepat, dan sering kurang mengonsumsi makanan sumber zat besi." },
    ],
  },
  {
    id: "penyebab",
    icon: "🔎",
    title: "Penyebab Anemia",
    summary: "Dari kurang zat besi hingga infeksi cacing.",
    blocks: [
      { t: "p", text: "Penyebab paling umum anemia pada remaja adalah <b>kekurangan zat besi</b>. Zat besi adalah bahan utama pembentuk hemoglobin." },
      { t: "grid", items: [
        { icon: "🍽", title: "Asupan kurang", text: "Jarang makan lauk hewani, sayur hijau, dan kacang-kacangan." },
        { icon: "🩸", title: "Kehilangan darah", text: "Menstruasi, terutama yang banyak atau lama." },
        { icon: "🪱", title: "Cacingan", text: "Cacing di usus menghisap darah dan zat gizi." },
        { icon: "🦠", title: "Infeksi", text: "Penyakit seperti malaria dan TBC dapat menurunkan Hb." },
        { icon: "☕", title: "Penyerapan terganggu", text: "Minum teh/kopi bersamaan dengan makan menghambat penyerapan zat besi." },
        { icon: "🥗", title: "Diet ketat", text: "Membatasi makan demi berat badan tanpa memperhatikan gizi." },
      ] },
    ],
  },
  {
    id: "tanda-gejala",
    icon: "🩺",
    title: "Tanda & Gejala",
    summary: "Kenali 5L dan tanda pucat pada tubuh.",
    blocks: [
      { t: "p", text: "Gejala anemia sering dianggap biasa. Ingat istilah <b>5L</b>:" },
      { t: "grid", items: [
        { icon: "L", title: "Lemah", text: "" },
        { icon: "L", title: "Letih", text: "" },
        { icon: "L", title: "Lesu", text: "" },
        { icon: "L", title: "Lelah", text: "" },
        { icon: "L", title: "Lalai", text: "" },
      ], compact: true },
      { t: "list", items: [
        "Wajah, kelopak mata bagian dalam, bibir, kuku, dan telapak tangan tampak <b>pucat</b>",
        "Sering pusing dan mata berkunang-kunang",
        "Sulit berkonsentrasi saat belajar",
        "Mudah sesak napas atau jantung berdebar saat beraktivitas",
        "Mudah mengantuk dan mudah sakit",
      ] },
      { t: "check", title: "Cek diri: mana yang sering kamu alami?", items: [
        "Mudah lelah walau tidur cukup", "Sering pusing / berkunang-kunang", "Kelopak mata bagian dalam pucat",
        "Sulit fokus saat belajar", "Sesak saat naik tangga", "Menstruasi banyak atau lama",
      ], result: "Kamu mencentang {n} tanda. Daftar ini bukan alat diagnosis. Jika kamu mengalami beberapa tanda, periksakan kadar Hb di Puskesmas atau UKS." },
    ],
  },
  {
    id: "dampak",
    icon: "⚠️",
    title: "Dampak Anemia",
    summary: "Pengaruhnya untuk prestasi hari ini dan kesehatan masa depan.",
    blocks: [
      { t: "p", text: "Anemia bukan sekadar mudah capek. Dampaknya bisa terasa sekarang dan berlanjut di masa depan." },
      { t: "steps", items: [
        { title: "Sekarang — sebagai remaja", text: "Konsentrasi dan prestasi belajar menurun, kebugaran berkurang, daya tahan tubuh lemah sehingga mudah sakit." },
        { title: "Nanti — sebagai calon ibu", text: "Remaja putri yang anemia berisiko tetap anemia saat hamil." },
        { title: "Saat hamil", text: "Meningkatkan risiko perdarahan saat persalinan, bayi lahir prematur, dan berat badan lahir rendah (BBLR)." },
        { title: "Generasi berikutnya", text: "Bayi dengan BBLR berisiko mengalami stunting. Mencegah anemia hari ini berarti melindungi generasi mendatang." },
      ] },
    ],
  },
  {
    id: "pencegahan",
    icon: "🛡",
    title: "Pencegahan Anemia",
    summary: "Lima kebiasaan sederhana untuk Hb yang sehat.",
    blocks: [
      { t: "steps", items: [
        { title: "Makan gizi seimbang", text: "Ikuti pedoman Isi Piringku: makanan pokok, lauk pauk (terutama hewani), sayur, dan buah setiap makan." },
        { title: "Perbanyak sumber zat besi", text: "Hati, daging merah, ikan, ayam, telur, serta bayam, daun kelor, kacang-kacangan, dan tempe." },
        { title: "Minum TTD rutin", text: "Remaja putri: 1 tablet setiap minggu sepanjang tahun." },
        { title: "Lengkapi vitamin C", text: "Buah seperti jeruk, jambu biji, dan pepaya membantu penyerapan zat besi." },
        { title: "Jaga kebersihan", text: "Cuci tangan pakai sabun, pakai alas kaki, dan minum obat cacing sesuai anjuran untuk mencegah cacingan." },
      ] },
      { t: "video", id: "pencegahan" },
    ],
  },
  {
    id: "pentingnya-ttd",
    icon: "💊",
    title: "Pentingnya TTD",
    summary: "Kenapa Tablet Tambah Darah perlu diminum rutin.",
    blocks: [
      { t: "p", text: "<b>Tablet Tambah Darah (TTD)</b> adalah suplemen berisi zat besi dan asam folat yang dibagikan gratis melalui sekolah dan Puskesmas. Kebutuhan zat besi remaja putri sering tidak tercukupi dari makanan saja." },
      { t: "stat", value: "1", unit: "tablet / minggu", text: "Anjuran untuk remaja putri usia 12–18 tahun, sepanjang tahun." },
      { t: "grid", items: [
        { icon: "🧠", title: "Fokus belajar", text: "Oksigen cukup untuk otak." },
        { icon: "💪", title: "Lebih bugar", text: "Tidak mudah lelah." },
        { icon: "🛡", title: "Daya tahan", text: "Tidak mudah sakit." },
        { icon: "👶", title: "Investasi masa depan", text: "Menyiapkan kehamilan yang sehat kelak." },
      ] },
      { t: "flip", items: [
        { front: "Mitos: TTD bikin gemuk.", back: "Fakta: TTD tidak mengandung kalori yang membuat gemuk. Nafsu makan bisa membaik karena tubuh lebih sehat." },
        { front: "Mitos: Kalau tidak pucat, tidak perlu TTD.", back: "Fakta: Anemia bisa terjadi tanpa gejala jelas. TTD rutin mencegah sebelum terjadi." },
        { front: "Mitos: TTD menambah darah saat menstruasi.", back: "Fakta: TTD tidak membuat darah menstruasi lebih banyak. TTD justru mengganti zat besi yang hilang." },
        { front: "Mitos: BAB hitam berarti berbahaya.", back: "Fakta: Tinja berwarna hitam saat minum TTD itu normal, berasal dari sisa zat besi." },
      ] },
    ],
  },
  {
    id: "cara-minum-ttd",
    icon: "🥤",
    title: "Cara Minum TTD yang Benar",
    summary: "Waktu, minuman, dan cara mengurangi mual.",
    blocks: [
      { t: "dodont",
        do: ["Minum setelah makan, misalnya malam sebelum tidur, untuk mengurangi mual", "Minum dengan air putih atau jus buah kaya vitamin C", "Minum rutin di hari yang sama setiap minggu", "Simpan di tempat kering, terhindar dari sinar matahari"],
        dont: ["Minum bersama teh atau kopi", "Minum bersama susu", "Minum bersamaan dengan obat maag (beri jarak ± 2 jam)", "Berhenti karena efek samping ringan"] },
      { t: "callout", tone: "warn", title: "Efek samping ringan itu wajar", text: "Mual, nyeri ulu hati, atau tinja berwarna hitam dapat muncul dan tidak berbahaya. Minum TTD setelah makan malam dapat menguranginya. Bila keluhan berat, konsultasikan ke tenaga kesehatan." },
      { t: "video", id: "cara-minum" },
    ],
  },
  {
    id: "makanan",
    icon: "🥦",
    title: "Makanan Kaya Zat Besi",
    summary: "Sumber zat besi dan pasangan makanan yang tepat.",
    blocks: [
      { t: "p", text: "Ada dua jenis zat besi dalam makanan. <b>Zat besi hewani (heme)</b> lebih mudah diserap tubuh dibanding <b>zat besi nabati (non-heme)</b>." },
      { t: "grid", items: [
        { icon: "🥩", title: "Hewani (heme)", text: "Hati ayam/sapi, daging merah, ikan, ayam, telur, kerang." },
        { icon: "🥬", title: "Nabati (non-heme)", text: "Bayam, daun kelor, daun singkong, kacang merah, tempe, tahu." },
        { icon: "🍊", title: "Penambah penyerapan", text: "Vitamin C: jeruk, jambu biji, pepaya, tomat, mangga." },
        { icon: "🍵", title: "Penghambat penyerapan", text: "Teh, kopi (tanin) dan susu (kalsium) bila diminum bersamaan." },
      ] },
      { t: "pair" },
    ],
  },
];

// Permainan pasangan: pilih minuman/pendamping yang tepat untuk menu kaya zat besi
export const pairGame = {
  title: "Uji cepat: pasangan yang tepat",
  intro: "Kamu makan <b>nasi + hati ayam + sayur bayam</b>. Pilih minuman pendampingnya!",
  options: [
    { icon: "🍊", label: "Jus jeruk", good: true, note: "Tepat! Vitamin C membantu penyerapan zat besi." },
    { icon: "🍵", label: "Teh manis", good: false, note: "Kurang tepat. Tanin dalam teh menghambat penyerapan zat besi. Beri jarak 1–2 jam." },
    { icon: "🥛", label: "Susu", good: false, note: "Kurang tepat. Kalsium dalam susu bersaing dengan zat besi. Minum di waktu lain." },
    { icon: "💧", label: "Air putih", good: true, note: "Aman! Air putih tidak menghambat penyerapan. Tambah buah agar lebih optimal." },
    { icon: "☕", label: "Kopi", good: false, note: "Kurang tepat. Kopi menghambat penyerapan zat besi." },
    { icon: "🥭", label: "Jus jambu biji", good: true, note: "Tepat! Jambu biji sangat kaya vitamin C." },
  ],
};

// Video edukasi — ganti "url" dengan tautan video pilihanmu (YouTube, Drive, dsb).
export const videos = [
  { id: "anemia", title: "Mengenal Anemia pada Remaja", duration: "Video edukasi", url: "https://www.youtube.com/results?search_query=video+edukasi+anemia+remaja+putri" },
  { id: "cara-minum", title: "Cara Minum Tablet Tambah Darah yang Benar", duration: "Video edukasi", url: "https://www.youtube.com/results?search_query=cara+minum+tablet+tambah+darah+remaja+putri" },
  { id: "pencegahan", title: "Isi Piringku & Cegah Anemia", duration: "Video edukasi", url: "https://www.youtube.com/results?search_query=isi+piringku+cegah+anemia+remaja" },
];

// Kuis evaluasi pemahaman. "a" = indeks jawaban benar (mulai dari 0).
export const quiz = {
  id: "evaluasi-anemia",
  title: "Kuis Evaluasi",
  intro: "10 soal untuk menguji pemahamanmu tentang anemia dan TTD. Setiap jawaban dilengkapi pembahasan.",
  askCode: true, // tampilkan kolom "Kode responden" (opsional) sebelum kuis
  questions: [
    { q: "Anemia adalah kondisi ketika…", o: ["Tekanan darah rendah", "Kadar hemoglobin dalam darah di bawah normal", "Kadar gula darah tinggi", "Kekurangan cairan tubuh"], a: 1, e: "Anemia ditandai kadar Hb di bawah normal. Anemia berbeda dengan tekanan darah rendah (hipotensi)." },
    { q: "Batas kadar Hb remaja putri dikatakan anemia adalah…", o: ["Kurang dari 12 g/dL", "Kurang dari 15 g/dL", "Kurang dari 9 g/dL", "Kurang dari 20 g/dL"], a: 0, e: "Remaja putri dikatakan anemia bila Hb kurang dari 12 g/dL." },
    { q: "Penyebab anemia yang paling umum pada remaja adalah…", o: ["Kurang tidur", "Kekurangan zat besi", "Terlalu banyak olahraga", "Kelebihan vitamin C"], a: 1, e: "Kekurangan zat besi adalah penyebab paling umum karena zat besi adalah bahan pembentuk hemoglobin." },
    { q: "Yang termasuk gejala 5L adalah…", o: ["Lemah, letih, lesu, lelah, lalai", "Lapar, lemas, lupa, lambat, lelah", "Lesu, lapar, lucu, lemah, lalai", "Lambat, lupa, lemah, lesu, lapar"], a: 0, e: "5L: Lemah, Letih, Lesu, Lelah, dan Lalai." },
    { q: "Anjuran minum TTD untuk remaja putri adalah…", o: ["1 tablet setiap hari", "1 tablet setiap minggu", "1 tablet setiap bulan", "Hanya saat sakit"], a: 1, e: "Remaja putri dianjurkan minum 1 tablet TTD setiap minggu sepanjang tahun." },
    { q: "Minuman yang paling baik untuk menemani minum TTD adalah…", o: ["Teh manis", "Kopi", "Jus jeruk atau air putih", "Susu"], a: 2, e: "Vitamin C dalam jus jeruk membantu penyerapan. Teh, kopi, dan susu menghambatnya." },
    { q: "Waktu yang dianjurkan untuk minum TTD agar mengurangi mual adalah…", o: ["Saat perut kosong di pagi hari", "Setelah makan, misalnya malam sebelum tidur", "Sebelum olahraga", "Bersamaan dengan obat maag"], a: 1, e: "Minum setelah makan, misalnya malam hari, dapat mengurangi rasa mual." },
    { q: "Tinja berwarna hitam setelah minum TTD menandakan…", o: ["Perdarahan berbahaya", "Keracunan", "Efek wajar dari sisa zat besi", "TTD sudah kedaluwarsa"], a: 2, e: "Tinja hitam adalah efek samping wajar dan tidak berbahaya." },
    { q: "Sumber zat besi yang paling mudah diserap tubuh adalah…", o: ["Hati ayam dan daging merah", "Nasi putih", "Teh hijau", "Roti tawar"], a: 0, e: "Zat besi hewani (heme) seperti pada hati dan daging lebih mudah diserap." },
    { q: "Dampak anemia pada remaja putri di masa depan saat hamil adalah…", o: ["Bayi lebih tinggi", "Risiko perdarahan dan bayi berat lahir rendah", "Kehamilan lebih cepat", "Tidak ada dampak"], a: 1, e: "Anemia saat hamil meningkatkan risiko perdarahan, bayi prematur, dan BBLR yang dapat berujung stunting." },
  ],
};

export const sources = [
  "Kementerian Kesehatan RI — Pedoman Pencegahan dan Penanggulangan Anemia pada Remaja Putri dan Wanita Usia Subur (WUS).",
  "WHO — Haemoglobin concentrations for the diagnosis of anaemia and assessment of severity.",
  "Kementerian Kesehatan RI — Pedoman Gizi Seimbang (Isi Piringku).",
];
