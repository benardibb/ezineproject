// Naikkan ?v= setiap kali file yang di-import berubah agar browser tidak memakai versi lama.
import { site, materi, videos, quiz, pairGame, sources } from "./content.js?v=7";
import { store, remote, submitQuiz, quizHistory } from "./db.js?v=7";
import { icon } from "./icons.js?v=7";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $("#view"), topMeta = $("#topMeta"), progress = $("#progress"), progressWrap = $("#progressWrap"), backBtn = $("#backBtn");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200);
}
function setProgress(pct) {
  progressWrap.classList.toggle("is-empty", pct == null);
  progress.style.width = `${pct || 0}%`;
}

/* ---------- Tab bar ---------- */
const tabs = [["home", "#/", "home", "Beranda"], ["materi", "#/materi", "book", "Materi"], ["video", "#/video", "video", "Video"], ["kuis", "#/kuis", "quiz", "Kuis"]];
$("#tabbar").innerHTML = tabs.map(([k, h, ic, l]) => `<a href="${h}" data-tab="${k}">${icon(ic)}<span>${l}</span></a>`).join("");
backBtn.innerHTML = icon("left");
backBtn.addEventListener("click", () => (location.hash = "#/materi"));

/* ---------- Status baca ---------- */
const readSet = () => new Set(store.get("gc:read", []));
const markRead = (id) => { const s = readSet(); s.add(id); store.set("gc:read", [...s]); };
const readPct = () => Math.round((readSet().size / materi.length) * 100);

/* ==========================================================
   Router: #/  #/materi  #/materi/:id  #/video  #/kuis  #/tentang
   ========================================================== */
const routes = { "": home, materi: materiList, video: videoPage, kuis: quizPage, tentang: about };
function router() {
  const [, page = "", id] = location.hash.replace(/^#/, "").split("/");
  const isArticle = page === "materi" && id;
  topMeta.textContent = ""; setProgress(null);
  backBtn.hidden = !isArticle;
  view.dataset.page = isArticle ? "article" : (routes[page] ? page || "home" : "home");
  $$("#tabbar a").forEach((a) => a.setAttribute("aria-current", a.dataset.tab === (page || "home") ? "page" : "false"));
  view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
  (isArticle ? () => article(id) : routes[page] || home)();
  scrollTo(0, 0);
  view.focus({ preventScroll: true });
}
addEventListener("hashchange", router);

function tocList(read) {
  return `<ol class="toc">${materi.map((m, i) => `
    <li><a href="#/materi/${m.id}">
      <span class="n">${pad(i + 1)}</span>
      <span class="txt"><b>${esc(m.title)}</b><span>${esc(m.summary)}</span></span>
      <span class="end ${read.has(m.id) ? "done" : ""}">${icon(read.has(m.id) ? "check" : "chev")}</span>
    </a></li>`).join("")}</ol>`;
}

/* ==========================================================
   Beranda
   ========================================================== */
function home() {
  document.title = `${site.title}: ${site.subtitle}`;
  const read = readSet(), pct = readPct();
  const next = materi.find((m) => !read.has(m.id)) || materi[0];
  const weeks = store.get("gc:ttd", [false, false, false, false]);

  view.innerHTML = `
    <div class="home-left">
    <section class="hero">
      <h1>Gizi Cerdas,<br><span>Lawan Anemia</span></h1>
      <p>${esc(site.tagline)}</p>
      ${read.size ? "" : `<a class="btn" href="#/materi/${materi[0].id}">Mulai baca ${icon("right")}</a>`}
    </section>

    ${read.size ? `
    <a class="resume" href="#/materi/${next.id}">
      <span class="txt">
        <b>${pct === 100 ? "Semua materi sudah dibaca" : `Lanjut: ${esc(next.title)}`}</b>
        <span>${read.size} dari ${materi.length} materi</span>
        <span class="meter"><span style="width:${pct}%"></span></span>
      </span>
      ${icon("chev")}
    </a>` : ""}
    </div>

    <div class="home-right">
    <p class="label label--first">Materi</p>
    ${tocList(read)}

    <p class="label">Lainnya</p>
    <div class="links">
      <a href="#/video">${icon("video")}<span><b>Video</b><span>${videos.length} video edukasi</span></span></a>
      <a href="#/kuis">${icon("quiz")}<span><b>Kuis</b><span>${quiz.questions.length} soal evaluasi</span></span></a>
    </div>

    <p class="label">Catatan minum TTD</p>
    <div class="tracker">
      <div class="tracker__head"><b>1 tablet setiap minggu</b><span id="ttdCount">${weeks.filter(Boolean).length}/4</span></div>
      <div class="weeks">
        ${weeks.map((on, i) => `<button class="week" aria-pressed="${on}" data-i="${i}">${icon(on ? "check" : "pill")}Minggu ${i + 1}</button>`).join("")}
      </div>
      <p>Ketuk setelah minum TTD. Tersimpan di HP kamu.</p>
    </div>

    <p class="foot"><a href="#/tentang">Tentang & sumber materi</a></p>
    </div>`;

  $$(".week", view).forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.i;
    weeks[i] = !weeks[i];
    b.setAttribute("aria-pressed", String(weeks[i]));
    b.innerHTML = `${icon(weeks[i] ? "check" : "pill")}Minggu ${i + 1}`;
    store.set("gc:ttd", weeks);
    const n = weeks.filter(Boolean).length;
    $("#ttdCount").textContent = `${n}/4`;
    if (weeks[i]) toast(n === 4 ? "Sebulan penuh, keren!" : "Tercatat");
  }));
}

/* ==========================================================
   Daftar materi
   ========================================================== */
function materiList() {
  document.title = `Materi · ${site.title}`;
  const read = readSet();
  topMeta.textContent = `${read.size}/${materi.length} dibaca`;
  setProgress(readPct());
  view.innerHTML = `
    <h1 class="h1">Materi</h1>
    <p class="lead">Baca berurutan, atau pilih topik yang kamu perlukan.</p>
    ${tocList(read)}`;
}

/* ==========================================================
   Halaman materi
   ========================================================== */
function article(id) {
  const i = materi.findIndex((m) => m.id === id);
  if (i < 0) { location.hash = "#/materi"; return; }
  const m = materi[i], prev = materi[i - 1], next = materi[i + 1];
  document.title = `${m.title} · ${site.title}`;
  topMeta.textContent = `${i + 1} / ${materi.length}`;
  setProgress(((i + 1) / materi.length) * 100);
  markRead(m.id);

  view.innerHTML = `
    <article class="article">
      <header class="a-head">
        <div class="kicker">${icon(m.icon)}Materi ${i + 1}</div>
        <h1 class="h1">${esc(m.title)}</h1>
        <p>${esc(m.summary)}</p>
      </header>
      ${m.blocks.map(block).join("")}
    </article>
    <nav class="pager" aria-label="Pindah materi">
      ${prev ? `<a href="#/materi/${prev.id}"><small>${icon("left")}Sebelumnya</small><b>${esc(prev.title)}</b></a>` : ""}
      ${next
        ? `<a class="next" href="#/materi/${next.id}"><small>Selanjutnya${icon("right")}</small><b>${esc(next.title)}</b></a>`
        : `<a class="next" href="#/kuis"><small>Selesai${icon("right")}</small><b>Kerjakan kuis</b></a>`}
    </nav>
    <p class="swipe-hint">Geser kiri/kanan untuk pindah halaman</p>`;
  bindBlocks();

  let x0 = null, y0 = 0;
  view.ontouchstart = (e) => { if (e.target.closest(".flip, .pair, .check")) { x0 = null; return; } x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; };
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
    case "callout": return `<div class="callout">${icon(b.tone === "warn" ? "alert" : "info")}<div><b>${b.title}</b><p>${b.text}</p></div></div>`;
    case "grid": return `<div class="cards${b.items.length === 3 ? " n3" : ""}">${b.items.map((c) => `
      <div class="card">${icon(c.icon)}<b>${c.title}</b>${c.text ? `<span>${c.text}</span>` : ""}</div>`).join("")}</div>`;
    case "letters": return `<div class="letters">${b.items.map((w) => `<div><b>${w[0]}</b><span>${w}</span></div>`).join("")}</div>`;
    case "stat": return `<div class="stat"><div class="v">${b.value}</div><div><div class="u">${b.unit}</div><p>${b.text}</p></div></div>`;
    case "steps": return `<ol class="steps">${b.items.map((s) => `<li><div><b>${s.title}</b><span>${s.text}</span></div></li>`).join("")}</ol>`;
    case "dodont": return `<div class="dodont">
      <div class="do"><h3>Lakukan</h3><ul>${b.do.map((x) => `<li>${icon("check")}<span>${x}</span></li>`).join("")}</ul></div>
      <div class="dont"><h3>Hindari</h3><ul>${b.dont.map((x) => `<li>${icon("x")}<span>${x}</span></li>`).join("")}</ul></div></div>`;
    case "flip": return `<h2 class="h2">Mitos atau fakta?</h2><div class="flips">${b.items.map((f) => `
      <button class="flip" aria-pressed="false"><span class="flip__in">
        <span class="flip__face flip__front"><small>Mitos</small><strong>${f.front}</strong><span class="flip__hint">Ketuk untuk lihat fakta</span></span>
        <span class="flip__face flip__back"><small>Fakta</small>${f.back}</span>
      </span></button>`).join("")}</div>`;
    case "check": return `<div class="check" data-result="${esc(b.result)}"><h3>${b.title}</h3>${b.items.map((x) => `
      <label><input type="checkbox" />${x}</label>`).join("")}<p class="res" hidden></p></div>`;
    case "pair": return `<div class="pair"><h3>${pairGame.title}</h3><p>${pairGame.intro}</p>
      <div class="pair__opts">${pairGame.options.map((o, i) => `<button data-i="${i}">${icon(o.icon)}${o.label}</button>`).join("")}</div>
      <p class="pair__note" aria-live="polite"></p></div>`;
    case "video": { const v = videos.find((x) => x.id === b.id); return v ? videoRow(v) : ""; }
    default: return "";
  }
}

function videoRow(v) {
  return `<a class="vrow" href="${esc(v.url)}" target="_blank" rel="noopener">
    <span class="play">${icon("play")}</span>
    <span class="txt"><b>${esc(v.title)}</b><span>Buka video</span></span>
    ${icon("ext")}</a>`;
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
  document.title = `Video · ${site.title}`;
  view.innerHTML = `
    <h1 class="h1">Video</h1>
    <p class="lead">Video edukasi pendek. Ketuk untuk membuka.</p>
    <div class="vlist">${videos.map(videoRow).join("")}</div>`;
}

/* ==========================================================
   Kuis evaluasi
   ========================================================== */
const Q = { step: -1, answers: [], code: "", saved: false };
const reset = () => { Q.step = 0; Q.answers = []; Q.saved = false; };

function quizPage() {
  document.title = `Kuis · ${site.title}`;
  if (Q.step < 0) return quizIntro();
  if (Q.step >= quiz.questions.length) return quizResult();
  quizQuestion();
}

function quizIntro() {
  const hist = quizHistory(quiz.id), last = hist[hist.length - 1];
  view.innerHTML = `
    <h1 class="h1">Kuis evaluasi</h1>
    <p class="lead">${esc(quiz.intro)}</p>
    <div class="facts">
      <div><b>${quiz.questions.length}</b><span>soal</span></div>
      <div><b>± 5</b><span>menit</span></div>
      ${last ? `<div><b>${last.score}/${last.total}</b><span>skor terakhir</span></div>` : ""}
    </div>
    ${readPct() < 100 ? `<div class="notice">${icon("info")}<span>Kamu baru membaca ${readSet().size} dari ${materi.length} materi. Kuis tetap bisa dimulai.</span></div>` : ""}
    ${quiz.askCode ? `<div class="field">
      <label for="code">Kode responden <span class="muted" style="font-weight:400">(opsional)</span></label>
      <input id="code" maxlength="40" autocomplete="off" placeholder="Contoh: R-012" value="${esc(Q.code)}" />
      <small>Isi jika diminta peneliti atau guru. Jangan isi nama lengkap.</small>
    </div>` : ""}
    <button class="btn btn--block" id="start">Mulai kuis</button>`;
  $("#start").onclick = () => { Q.code = $("#code")?.value.trim() || ""; reset(); quizPage(); };
}

function quizQuestion() {
  const n = Q.step, item = quiz.questions[n], total = quiz.questions.length;
  topMeta.textContent = `${n + 1} / ${total}`;
  view.innerHTML = `
    <div class="q-top"><span>Soal ${n + 1} dari ${total}</span></div>
    <div class="q-bar"><span style="width:${(n / total) * 100}%"></span></div>
    <p class="q-text">${esc(item.q)}</p>
    <div class="opts">${item.o.map((o, i) => `<button class="opt" data-i="${i}"><span class="k">${"ABCD"[i]}</span>${esc(o)}</button>`).join("")}</div>
    <div id="explain"></div>
    <div class="q-actions" id="actions"></div>`;
  $$(".opt", view).forEach((b) => b.addEventListener("click", () => {
    const pick = +b.dataset.i, ok = pick === item.a;
    Q.answers[n] = pick;
    $$(".opt", view).forEach((x) => {
      x.disabled = true;
      const xi = +x.dataset.i;
      x.classList.add(xi === item.a ? "correct" : xi === pick ? "wrong" : "dim");
    });
    $(".q-bar span", view).style.width = `${((n + 1) / total) * 100}%`;
    $("#explain").innerHTML = `<div class="explain ${ok ? "ok" : "no"}"><b>${ok ? "Benar" : "Belum tepat"}</b>${esc(item.e)}</div>`;
    const last = n === total - 1;
    $("#actions").innerHTML = `<button class="btn btn--block" id="nextQ">${last ? "Lihat hasil" : "Lanjut"}</button>`;
    $("#nextQ").onclick = () => { Q.step++; quizPage(); scrollTo(0, 0); };
    $("#actions").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
}

async function quizResult() {
  const qs = quiz.questions, total = qs.length;
  const score = Q.answers.reduce((s, a, i) => s + (a === qs[i].a ? 1 : 0), 0);
  const pct = Math.round((score / total) * 100);
  topMeta.textContent = "Selesai";
  const [title, text] = pct >= 80
    ? ["Pemahamanmu sangat baik", "Bagikan yang kamu tahu ke teman-temanmu, termasuk soal rutin minum TTD."]
    : pct >= 60
      ? ["Sudah cukup baik", "Cek pembahasan di bawah untuk soal yang belum tepat."]
      : ["Ayo coba lagi", "Baca ulang materinya, lalu ulangi kuis ini."];

  view.innerHTML = `
    <div class="result">
      <div class="big">${score}<small>/${total}</small></div>
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="stack">
        <button class="btn" id="retry">Ulangi kuis</button>
        <a class="btn btn--ghost" href="#/materi">Baca materi lagi</a>
      </div>
      <p class="small muted" id="saveInfo" style="margin-top:14px">${remote ? "Menyimpan hasil…" : ""}</p>
      <div class="review">
        <h3>Pembahasan</h3>
        ${qs.map((q, i) => { const ok = Q.answers[i] === q.a; return `
          <details><summary><span class="${ok ? "ok" : "no"}">${icon(ok ? "check" : "x")}</span>${i + 1}. ${esc(q.q)}</summary>
          <p>${ok ? "" : `Jawabanmu: ${esc(q.o[Q.answers[i]] ?? "-")}<br>`}Jawaban benar: <b>${esc(q.o[q.a])}</b><br>${esc(q.e)}</p></details>`; }).join("")}
      </div>
    </div>`;
  $("#retry").onclick = () => { reset(); quizPage(); scrollTo(0, 0); };

  if (Q.saved) return;
  Q.saved = true;
  const r = await submitQuiz({
    quizId: quiz.id, code: Q.code, score, total,
    answers: qs.map((q, i) => ({ no: i + 1, pilihan: Q.answers[i], benar: Q.answers[i] === q.a })),
  });
  const info = $("#saveInfo");
  if (info) info.textContent = r.saved ? "Hasil tersimpan." : "";
}

/* ==========================================================
   Tentang
   ========================================================== */
function about() {
  document.title = `Tentang · ${site.title}`;
  view.innerHTML = `
    <h1 class="h1">Tentang</h1>
    <p class="lead">${esc(site.title)}: ${esc(site.subtitle)} adalah media edukasi gizi berbentuk e-zine interaktif untuk remaja.</p>
    <div class="callout">${icon("alert")}<div><b>Catatan</b><p>Materi ini untuk edukasi dan tidak menggantikan pemeriksaan tenaga kesehatan. Jika mengalami gejala anemia, periksakan Hb di Puskesmas.</p></div></div>
    <h2 class="h2">Sumber rujukan</h2>
    <ol class="sources">${sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`;
}

router();
