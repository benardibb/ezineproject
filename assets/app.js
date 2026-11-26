import { site, materi, videos, quiz, pairGame, sources } from "./content.js";
import { store, remote, submitQuiz, quizHistory } from "./db.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $("#view"), topMeta = $("#topMeta"), progress = $("#progress"), backBtn = $("#backBtn");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2400);
}

/* ---------- Status baca ---------- */
const readSet = () => new Set(store.get("gc:read", []));
function markRead(id) { const s = readSet(); s.add(id); store.set("gc:read", [...s]); }
const readPct = () => Math.round((readSet().size / materi.length) * 100);

/* ==========================================================
   Router (hash): #/  #/materi  #/materi/:id  #/video  #/kuis  #/tentang
   ========================================================== */
const routes = { "": home, materi: materiList, video: videoPage, kuis: quizPage, tentang: about };

function router() {
  const [, page = "", id] = location.hash.replace(/^#/, "").split("/");
  const fn = page === "materi" && id ? () => article(id) : routes[page] || home;
  topMeta.textContent = ""; progress.style.width = "0";
  backBtn.hidden = !(page === "materi" && id);
  $$(".tabbar a").forEach((a) => a.setAttribute("aria-current", a.dataset.tab === (page || "home") ? "page" : "false"));
  view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
  fn();
  scrollTo(0, 0);
  view.focus({ preventScroll: true });
}
addEventListener("hashchange", router);
backBtn.addEventListener("click", () => (location.hash = "#/materi"));

/* ==========================================================
   Beranda
   ========================================================== */
function home() {
  document.title = `${site.title}: ${site.subtitle}`;
  const read = readSet(), pct = readPct();
  const next = materi.find((m) => !read.has(m.id)) || materi[0];
  const weeks = store.get("gc:ttd", [false, false, false, false]);
  view.innerHTML = `
    <section class="cover">
      <p class="eyebrow">${esc(site.edition)}</p>
      <h1>${esc(site.title)}:<span>${esc(site.subtitle)}</span></h1>
      <p>${esc(site.tagline)}</p>
      <a class="btn" href="#/materi/${materi[0].id}">Mulai membaca →</a>
    </section>

    ${read.size ? `
    <a class="continue" href="#/materi/${next.id}">
      <span class="ring" style="--p:${pct}"><span>${pct}%</span></span>
      <span class="txt"><b>${pct === 100 ? "Semua materi selesai 🎉" : "Lanjutkan membaca"}</b><span>${pct === 100 ? "Saatnya uji pemahamanmu di kuis." : esc(next.title)}</span></span>
      <span class="chev" aria-hidden="true">›</span>
    </a>` : ""}

    <div class="section-head"><h2>Menu Materi</h2><a href="#/materi">Lihat semua</a></div>
    <div class="menu-grid">
      ${materi.map((m, i) => `
        <a class="tile ${read.has(m.id) ? "is-read" : ""}" href="#/materi/${m.id}">
          <span class="n">${read.has(m.id) ? "✓" : String(i + 1).padStart(2, "0")}</span>
          <span class="ico" aria-hidden="true">${m.icon}</span>
          <b>${esc(m.title)}</b>
        </a>`).join("")}
    </div>

    <div class="section-head"><h2>Belajar Lebih Lanjut</h2></div>
    <div class="feature-row">
      <a class="feature feature--amber" href="#/video"><b>▶ Video Edukasi</b><span>${videos.length} video pilihan</span></a>
      <a class="feature feature--green" href="#/kuis"><b>✓ Kuis Evaluasi</b><span>${quiz.questions.length} soal + pembahasan</span></a>
    </div>

    <div class="section-head"><h2>Pengingat TTD Bulan Ini</h2></div>
    <div class="tracker">
      <div class="tracker__head"><b>1 tablet setiap minggu</b><span class="small muted" id="ttdCount">${weeks.filter(Boolean).length}/4 minggu</span></div>
      <div class="weeks">
        ${weeks.map((on, i) => `<button class="week" aria-pressed="${on}" data-i="${i}"><span class="pill" aria-hidden="true">💊</span>Minggu ${i + 1}</button>`).join("")}
      </div>
      <p class="small muted" style="margin:12px 0 0">Ketuk setelah kamu minum TTD. Tersimpan di perangkat ini.</p>
    </div>

    <p class="small muted" style="text-align:center;margin-top:28px"><a href="#/tentang">Tentang & sumber materi</a></p>`;

  $$(".week", view).forEach((b) => b.addEventListener("click", () => {
    weeks[b.dataset.i] = !weeks[b.dataset.i];
    b.setAttribute("aria-pressed", weeks[b.dataset.i]);
    store.set("gc:ttd", weeks);
    const n = weeks.filter(Boolean).length;
    $("#ttdCount").textContent = `${n}/4 minggu`;
    if (weeks[b.dataset.i]) toast(n === 4 ? "Hebat! Sebulan penuh rutin minum TTD 🎉" : "Tercatat. Terus pertahankan!");
  }));
}

/* ==========================================================
   Daftar materi
   ========================================================== */
function materiList() {
  document.title = `Materi — ${site.title}`;
  const read = readSet();
  topMeta.textContent = `${read.size}/${materi.length} dibaca`;
  progress.style.width = `${readPct()}%`;
  view.innerHTML = `
    <p class="eyebrow">Materi Edukasi</p>
    <h1 class="h1">Pilih materi</h1>
    <p class="lead">Baca berurutan atau pilih topik yang ingin kamu pelajari.</p>
    <div class="list">
      ${materi.map((m, i) => `
        <a class="row" href="#/materi/${m.id}">
          <span class="ico" aria-hidden="true">${m.icon}</span>
          <span class="txt"><b>${i + 1}. ${esc(m.title)}</b><span>${esc(m.summary)}</span></span>
          ${read.has(m.id) ? '<span class="done">✓</span>' : '<span class="chev" aria-hidden="true">›</span>'}
        </a>`).join("")}
    </div>`;
}

/* ==========================================================
   Halaman materi
   ========================================================== */
function article(id) {
  const i = materi.findIndex((m) => m.id === id);
  if (i < 0) { location.hash = "#/materi"; return; }
  const m = materi[i], prev = materi[i - 1], next = materi[i + 1];
  document.title = `${m.title} — ${site.title}`;
  topMeta.textContent = `${i + 1} / ${materi.length}`;
  progress.style.width = `${((i + 1) / materi.length) * 100}%`;
  markRead(m.id);

  view.innerHTML = `
    <article class="article">
      <header class="article-head">
        <div class="ico" aria-hidden="true">${m.icon}</div>
        <p class="eyebrow">Materi ${i + 1}</p>
        <h1 class="h1">${esc(m.title)}</h1>
        <p class="lead" style="margin:0">${esc(m.summary)}</p>
      </header>
      ${m.blocks.map(block).join("")}
    </article>
    <nav class="pager" aria-label="Navigasi materi">
      ${prev ? `<a class="prev" href="#/materi/${prev.id}"><small>← Sebelumnya</small><b>${esc(prev.title)}</b></a>` : ""}
      ${next
        ? `<a class="next" href="#/materi/${next.id}"><small>Selanjutnya →</small><b>${esc(next.title)}</b></a>`
        : `<a class="next" href="#/kuis"><small>Selesai membaca →</small><b>Kerjakan Kuis</b></a>`}
    </nav>
    <p class="swipe-hint">Geser kiri/kanan untuk berpindah halaman</p>`;
  bindBlocks();

  // Geser untuk berpindah halaman
  let x0 = null, y0 = null;
  view.ontouchstart = (e) => { if (e.target.closest(".flip, .pair, input")) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; };
  view.ontouchend = (e) => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) < 70 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    if (dx < 0) location.hash = next ? `#/materi/${next.id}` : "#/kuis";
    else if (prev) location.hash = `#/materi/${prev.id}`;
  };
}

function block(b) {
  switch (b.t) {
    case "p": return `<p>${b.text}</p>`;
    case "list": return `<ul class="bullets">${b.items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    case "callout": return `<div class="callout callout--${b.tone || "info"}"><b>${b.title}</b><p>${b.text}</p></div>`;
    case "grid": return `<div class="cards ${b.compact ? "compact" : ""}">${b.items.map((c) => `
      <div class="card"><div class="ico" aria-hidden="true">${c.icon}</div><b>${c.title}</b>${c.text ? `<span>${c.text}</span>` : ""}</div>`).join("")}</div>`;
    case "stat": return `<div class="stat"><div class="v">${b.value}</div><div><div class="u">${b.unit}</div><p>${b.text}</p></div></div>`;
    case "steps": return `<ol class="steps">${b.items.map((s) => `<li><b>${s.title}</b><span>${s.text}</span></li>`).join("")}</ol>`;
    case "dodont": return `<div class="dodont">
      <div class="do"><h3>Lakukan</h3><ul>${b.do.map((x) => `<li>${x}</li>`).join("")}</ul></div>
      <div class="dont"><h3>Hindari</h3><ul>${b.dont.map((x) => `<li>${x}</li>`).join("")}</ul></div></div>`;
    case "flip": return `<p class="flips-title">Mitos atau fakta? Ketuk kartu untuk membalik.</p><div class="flips">${b.items.map((f) => `
      <button class="flip" aria-pressed="false"><span class="flip__in">
        <span class="flip__face flip__front"><small>Mitos</small>${f.front.replace(/^Mitos:\s*/, "")}</span>
        <span class="flip__face flip__back"><small>Fakta</small>${f.back.replace(/^Fakta:\s*/, "")}</span>
      </span></button>`).join("")}</div>`;
    case "check": return `<div class="check" data-result="${esc(b.result)}"><h3>${b.title}</h3>${b.items.map((x) => `
      <label><input type="checkbox" />${x}</label>`).join("")}<p class="res" hidden></p></div>`;
    case "pair": return `<div class="pair"><h3>${pairGame.title}</h3><p>${pairGame.intro}</p>
      <div class="pair__opts">${pairGame.options.map((o, i) => `<button data-i="${i}"><span class="e" aria-hidden="true">${o.icon}</span>${o.label}</button>`).join("")}</div>
      <p class="pair__note" aria-live="polite"></p></div>`;
    case "video": { const v = videos.find((x) => x.id === b.id); return v ? videoCard(v) : ""; }
    default: return "";
  }
}

function videoCard(v) {
  return `<a class="vcard" href="${esc(v.url)}" target="_blank" rel="noopener">
    <span class="thumb" aria-hidden="true"></span>
    <span class="txt"><b>${esc(v.title)}</b><span>${esc(v.duration)} · buka tautan</span></span>
    <span class="ext" aria-hidden="true">↗</span></a>`;
}

function bindBlocks() {
  $$(".flip", view).forEach((f) => f.addEventListener("click", () => f.setAttribute("aria-pressed", String(f.getAttribute("aria-pressed") !== "true"))));
  $$(".check", view).forEach((c) => {
    const res = $(".res", c);
    c.addEventListener("change", () => {
      const n = $$("input:checked", c).length;
      res.hidden = n === 0; res.textContent = c.dataset.result.replace("{n}", n);
    });
  });
  $$(".pair", view).forEach((p) => {
    const note = $(".pair__note", p);
    $$("button", p).forEach((b) => b.addEventListener("click", () => {
      const o = pairGame.options[b.dataset.i];
      b.classList.add(o.good ? "good" : "bad");
      note.textContent = o.note;
    }));
  });
}

/* ==========================================================
   Video
   ========================================================== */
function videoPage() {
  document.title = `Video — ${site.title}`;
  view.innerHTML = `
    <p class="eyebrow">Video Edukasi</p>
    <h1 class="h1">Tonton & pahami</h1>
    <p class="lead">Ketuk video untuk membukanya melalui tautan.</p>
    <div class="vlist">${videos.map(videoCard).join("")}</div>`;
}

/* ==========================================================
   Kuis evaluasi
   ========================================================== */
const Q = { step: -1, answers: [], code: "" };

function quizPage() {
  document.title = `Kuis — ${site.title}`;
  if (Q.step < 0) return quizIntro();
  if (Q.step >= quiz.questions.length) return quizResult();
  quizQuestion();
}

function quizIntro() {
  const hist = quizHistory(quiz.id), last = hist[hist.length - 1];
  view.innerHTML = `
    <p class="eyebrow">${esc(quiz.title)}</p>
    <h1 class="h1">Uji pemahamanmu</h1>
    <p class="lead">${esc(quiz.intro)}</p>
    <div class="quiz-card">
      ${readPct() < 100 ? `<div class="callout callout--warn" style="margin-top:0"><b>Belum selesai membaca?</b><p>Kamu baru membaca ${readSet().size} dari ${materi.length} materi. Kamu tetap bisa mulai kuis sekarang.</p></div>` : ""}
      ${quiz.askCode ? `<div class="field">
        <label for="code">Kode responden <span class="muted">(opsional)</span></label>
        <input id="code" maxlength="40" autocomplete="off" placeholder="Contoh: R-012" value="${esc(Q.code)}" />
        <small>Diisi jika diminta oleh peneliti/guru. Jangan isi nama lengkap.</small>
      </div>` : ""}
      ${last ? `<p class="small muted">Skor terakhirmu: <b>${last.score}/${last.total}</b></p>` : ""}
      <button class="btn btn--red btn--block" id="start">Mulai Kuis</button>
    </div>`;
  $("#start").onclick = () => { Q.code = $("#code")?.value.trim() || ""; Q.step = 0; Q.answers = []; Q.saved = false; quizPage(); };
}

function quizQuestion() {
  const n = Q.step, item = quiz.questions[n], total = quiz.questions.length;
  topMeta.textContent = `Soal ${n + 1} / ${total}`;
  progress.style.width = `${(n / total) * 100}%`;
  view.innerHTML = `
    <div class="quiz-card">
      <div class="qbar">${quiz.questions.map((_, i) => `<i class="${i < n ? (Q.answers[i] === quiz.questions[i].a ? "ok" : "no") : i === n ? "on" : ""}"></i>`).join("")}</div>
      <div class="qmeta">Soal ${n + 1} dari ${total}</div>
      <p class="qtext">${esc(item.q)}</p>
      <div class="opts">${item.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="k">${"ABCD"[i]}</span>${esc(o)}</button>`).join("")}</div>
      <div id="explain"></div>
      <div class="quiz-actions" id="actions"></div>
    </div>`;
  $$(".opt", view).forEach((b) => b.addEventListener("click", () => {
    const pick = +b.dataset.i, ok = pick === item.a;
    Q.answers[n] = pick;
    $$(".opt", view).forEach((x) => { x.disabled = true; if (+x.dataset.i === item.a) x.classList.add("correct"); });
    if (!ok) b.classList.add("wrong");
    $(".qbar i.on", view).className = ok ? "ok" : "no";
    $("#explain").innerHTML = `<div class="explain ${ok ? "ok" : "no"}"><b>${ok ? "Benar!" : "Kurang tepat."}</b>${esc(item.e)}</div>`;
    const last = n === total - 1;
    $("#actions").innerHTML = `<button class="btn btn--block" id="nextQ">${last ? "Lihat Hasil" : "Soal Berikutnya →"}</button>`;
    $("#nextQ").onclick = () => { Q.step++; quizPage(); scrollTo(0, 0); };
    $("#nextQ").focus({ preventScroll: true });
    $("#actions").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
}

async function quizResult() {
  const qs = quiz.questions, total = qs.length;
  const score = Q.answers.reduce((s, a, i) => s + (a === qs[i].a ? 1 : 0), 0);
  const pct = Math.round((score / total) * 100);
  topMeta.textContent = "Selesai"; progress.style.width = "100%";
  const msg = pct >= 80 ? ["Luar biasa! 🎉", "Pemahamanmu tentang anemia dan TTD sudah sangat baik. Bagikan ilmumu ke teman-temanmu!"]
    : pct >= 60 ? ["Bagus! 👍", "Sebagian besar sudah kamu pahami. Baca lagi materi yang belum tepat agar makin mantap."]
    : ["Ayo coba lagi 💪", "Tidak apa-apa! Baca kembali materinya, lalu ulangi kuis ini."];

  view.innerHTML = `
    <div class="quiz-card score">
      <div class="ring" style="--p:0;--c:${pct >= 60 ? "var(--green)" : "var(--red)"}"><div><b>${score}/${total}</b><span>${pct}%</span></div></div>
      <h2>${msg[0]}</h2>
      <p>${msg[1]}</p>
      <p class="small muted" id="saveInfo">${remote ? "Menyimpan hasil…" : ""}</p>
      <div class="stack">
        <button class="btn btn--red btn--block" id="retry">Ulangi Kuis</button>
        <a class="btn btn--ghost btn--block" href="#/materi">Baca Materi Lagi</a>
      </div>
      <div class="review">
        <p class="small" style="font-weight:700;margin:0 0 4px">Pembahasan</p>
        ${qs.map((q, i) => { const ok = Q.answers[i] === q.a; return `
          <details><summary><span class="mark ${ok ? "ok" : "no"}">${ok ? "✓" : "✕"}</span>${i + 1}. ${esc(q.q)}</summary>
          <p>${ok ? "" : `Jawabanmu: ${esc(q.o[Q.answers[i]] ?? "-")}<br>`}Jawaban benar: <b>${esc(q.o[q.a])}</b><br>${esc(q.e)}</p></details>`; }).join("")}
      </div>
    </div>`;
  const ring = $(".ring", view);
  requestAnimationFrame(() => animateRing(ring, pct));
  $("#retry").onclick = () => { Q.step = 0; Q.answers = []; Q.saved = false; quizPage(); scrollTo(0, 0); };

  if (Q.saved) return;
  Q.saved = true;
  const r = await submitQuiz({
    quizId: quiz.id, code: Q.code, score, total,
    answers: qs.map((q, i) => ({ no: i + 1, pilihan: Q.answers[i], benar: Q.answers[i] === q.a })),
  });
  const info = $("#saveInfo");
  if (info) info.textContent = r.saved ? `Hasil tersimpan. Rata-rata skor ${r.count} percobaan: ${r.avg}%.` : "";
}

function animateRing(el, to) {
  const t0 = performance.now();
  const step = (t) => { const p = Math.min(1, (t - t0) / 900); el.style.setProperty("--p", (to * (1 - Math.pow(1 - p, 3))).toFixed(1)); if (p < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* ==========================================================
   Tentang
   ========================================================== */
function about() {
  document.title = `Tentang — ${site.title}`;
  view.innerHTML = `
    <p class="eyebrow">Tentang</p>
    <h1 class="h1">${esc(site.title)}: ${esc(site.subtitle)}</h1>
    <p class="lead">${esc(site.tagline)}</p>
    <div class="callout callout--warn"><b>Catatan</b><p>Materi ini untuk edukasi dan tidak menggantikan pemeriksaan atau saran tenaga kesehatan. Periksakan kadar Hb di Puskesmas bila mengalami gejala anemia.</p></div>
    <h2 class="h2">Sumber rujukan</h2>
    <ol class="sources">${sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <h2 class="h2">Open source</h2>
    <p class="muted small">Kode e-zine ini terbuka (lisensi MIT) dan dapat diadaptasi untuk media edukasi lain.</p>`;
}

router();
