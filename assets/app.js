// Naikkan ?v= setiap kali file yang di-import berubah agar browser tidak memakai versi lama.
import { site, materi, videos, quiz, pairGame, sources } from "./content.js?v=4";
import { store, remote, submitQuiz, quizHistory } from "./db.js?v=4";
import { icon, mascot } from "./icons.js?v=4";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const view = $("#view"), topMeta = $("#topMeta"), progress = $("#progress"), progressWrap = $("#progressWrap"), backBtn = $("#backBtn");
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = (n) => String(n).padStart(2, "0");

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2400);
}
function setProgress(pct) {
  progressWrap.classList.toggle("is-empty", pct == null);
  progress.style.width = `${pct || 0}%`;
}

/* ---------- Tab bar ---------- */
const tabs = [["home", "#/", "home", "Beranda"], ["materi", "#/materi", "book", "Materi"], ["video", "#/video", "video", "Video"], ["kuis", "#/kuis", "quiz", "Kuis"]];
$("#tabbar").innerHTML = tabs.map(([k, h, ic, l]) => `<a href="${h}" data-tab="${k}" aria-label="${l}">${icon(ic)}<span>${l}</span></a>`).join("");
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
  $$("#tabbar a").forEach((a) => a.setAttribute("aria-current", a.dataset.tab === (page || "home") ? "page" : "false"));
  view.style.animation = "none"; void view.offsetWidth; view.style.animation = "";
  (isArticle ? () => article(id) : routes[page] || home)();
  scrollTo(0, 0);
  view.focus({ preventScroll: true });
}
addEventListener("hashchange", router);

/* ==========================================================
   Beranda
   ========================================================== */
function home() {
  document.title = `${site.title}: ${site.subtitle}`;
  const read = readSet(), pct = readPct();
  const next = materi.find((m) => !read.has(m.id)) || materi[0];
  const weeks = store.get("gc:ttd", [false, false, false, false]);
  const squiggle = `<svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 11c30-8 50-8 70-3s45 6 70 0 40-6 54-2" stroke="#161616" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;

  view.innerHTML = `
    <section class="hero">
      <span class="hero__sticker">e-zine edukasi gizi</span>
      <h1>Gizi Cerdas, <em>Lawan Anemia${squiggle}</em></h1>
      ${mascot("happy")}
      <p>${esc(site.tagline)}</p>
      <a class="btn" href="#/materi/${read.size ? next.id : materi[0].id}">${read.size ? "Lanjut baca" : "Mulai baca"} ${icon("right")}</a>
    </section>

    ${read.size ? `
    <a class="continue" href="#/materi/${next.id}">
      <span class="ring" style="--p:${pct}"><span>${pct}%</span></span>
      <span class="txt"><b>${pct === 100 ? "Semua materi kelar!" : `Berikutnya: ${esc(next.title)}`}</b><span>${pct === 100 ? "Waktunya cek pemahaman di kuis." : `${read.size} dari ${materi.length} materi sudah dibaca`}</span></span>
      ${icon("chev")}
    </a>` : ""}

    <div class="sec-head"><h2>Mau baca apa?</h2><a href="#/materi">Semua materi</a></div>
    <div class="bento">
      ${materi.map((m, i) => `
        <a class="tile c-${m.color}" href="#/materi/${m.id}">
          <span class="top-row">
            <span class="ic">${icon(m.icon)}</span>
            ${read.has(m.id) ? `<span class="n done">${icon("check")}dibaca</span>` : `<span class="n">${pad(i + 1)}</span>`}
          </span>
          <b>${esc(m.title)}</b>
        </a>`).join("")}
    </div>

    <div class="sec-head"><h2>Selain baca</h2></div>
    <div class="duo">
      <a href="#/video"><span class="ic">${icon("play")}</span><span><b>Nonton video</b><span>${videos.length} video pendek</span></span></a>
      <a href="#/kuis"><span class="ic">${icon("quiz")}</span><span><b>Ikut kuis</b><span>${quiz.questions.length} soal + pembahasan</span></span></a>
    </div>

    <div class="sec-head"><h2>Catatan TTD-ku</h2></div>
    <div class="tracker">
      <div class="tracker__head"><b>Sudah minum minggu ini?</b><span id="ttdCount">${weeks.filter(Boolean).length}/4</span></div>
      <div class="weeks">
        ${weeks.map((on, i) => `<button class="week" aria-pressed="${on}" data-i="${i}">${icon("pill")}Mg ${i + 1}</button>`).join("")}
      </div>
      <p>Ketuk setelah minum TTD. Catatan ini hanya tersimpan di HP kamu.</p>
    </div>

    <p class="foot"><a href="#/tentang">Tentang e-zine & sumber materi</a></p>`;

  $$(".week", view).forEach((b) => b.addEventListener("click", () => {
    const i = +b.dataset.i;
    weeks[i] = !weeks[i];
    b.setAttribute("aria-pressed", String(weeks[i]));
    store.set("gc:ttd", weeks);
    const n = weeks.filter(Boolean).length;
    $("#ttdCount").textContent = `${n}/4`;
    if (weeks[i]) toast(n === 4 ? "Sebulan penuh rutin. Keren!" : "Tercatat. Pertahankan ya!");
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
    <p class="lead">Baca urut dari awal, atau loncat ke topik yang bikin kamu penasaran.</p>
    <div class="list">
      ${materi.map((m, i) => `
        <a class="row c-${m.color}" href="#/materi/${m.id}">
          <span class="ic">${icon(m.icon)}</span>
          <span class="txt"><b>${esc(m.title)}</b><span>${esc(m.summary)}</span></span>
          <span class="end ${read.has(m.id) ? "done" : ""}">${icon(read.has(m.id) ? "check" : "chev")}</span>
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
  document.title = `${m.title} · ${site.title}`;
  topMeta.textContent = `${i + 1} dari ${materi.length}`;
  setProgress(((i + 1) / materi.length) * 100);
  markRead(m.id);

  view.innerHTML = `
    <article class="article">
      <header class="a-head c-${m.color}">
        <span class="num" aria-hidden="true">${pad(i + 1)}</span>
        <span class="ic">${icon(m.icon)}</span>
        <h1 class="h1">${esc(m.title)}</h1>
        <p>${esc(m.summary)}</p>
      </header>
      ${m.blocks.map((b) => block(b, m)).join("")}
    </article>
    <nav class="pager" aria-label="Pindah materi">
      ${prev ? `<a href="#/materi/${prev.id}"><small>${icon("left")}Sebelumnya</small><b>${esc(prev.title)}</b></a>` : ""}
      ${next
        ? `<a class="next" href="#/materi/${next.id}"><small>Selanjutnya${icon("right")}</small><b>${esc(next.title)}</b></a>`
        : `<a class="next" href="#/kuis"><small>Udah kelar${icon("right")}</small><b>Kerjakan kuis</b></a>`}
    </nav>
    <p class="swipe-hint">Geser kiri atau kanan buat pindah halaman</p>`;
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

function block(b, m) {
  switch (b.t) {
    case "p": return `<p>${b.text}</p>`;
    case "list": return `<ul class="bullets">${b.items.map((x) => `<li>${x}</li>`).join("")}</ul>`;
    case "callout": return `<div class="callout ${b.tone === "warn" ? "callout--warn" : ""}">${icon(b.tone === "warn" ? "alert" : "info")}<div><b>${b.title}</b><p>${b.text}</p></div></div>`;
    case "grid": return `<div class="cards">${b.items.map((c) => `
      <div class="card"><span class="ic">${icon(c.icon)}</span><b>${c.title}</b>${c.text ? `<span>${c.text}</span>` : ""}</div>`).join("")}</div>`;
    case "letters": return `<div class="letters c-${m.color}">${b.items.map((w) => `<div><b>${w[0]}</b><span>${w}</span></div>`).join("")}</div>`;
    case "stat": return `<div class="stat"><div class="v">${b.value}</div><div><div class="u">${b.unit}</div><p>${b.text}</p></div></div>`;
    case "steps": return `<ol class="steps">${b.items.map((s) => `<li><div><b>${s.title}</b><span>${s.text}</span></div></li>`).join("")}</ol>`;
    case "dodont": return `<div class="dodont">
      <div class="do"><h3>Lakukan</h3><ul>${b.do.map((x) => `<li>${icon("check")}<span>${x}</span></li>`).join("")}</ul></div>
      <div class="dont"><h3>Hindari</h3><ul>${b.dont.map((x) => `<li>${icon("x")}<span>${x}</span></li>`).join("")}</ul></div></div>`;
    case "flip": return `<div class="flips-head">${icon("flip")}Mitos atau fakta?</div><div class="flips">${b.items.map((f) => `
      <button class="flip" aria-pressed="false"><span class="flip__in">
        <span class="flip__face flip__front"><span class="tag tag--myth">Mitos</span><strong>“${f.front}”</strong><span class="flip__hint">Ketuk untuk lihat faktanya</span></span>
        <span class="flip__face flip__back"><span class="tag tag--fact">Fakta</span>${f.back}</span>
      </span></button>`).join("")}</div>`;
    case "check": return `<div class="check" data-result="${esc(b.result)}"><h3>${b.title}</h3>${b.items.map((x) => `
      <label><input type="checkbox" />${x}</label>`).join("")}<p class="res" hidden></p></div>`;
    case "pair": return `<div class="pair"><h3>${pairGame.title}</h3><p>${pairGame.intro}</p>
      <div class="pair__opts">${pairGame.options.map((o, i) => `<button data-i="${i}">${icon(o.icon)}${o.label}</button>`).join("")}</div>
      <p class="pair__note" aria-live="polite"></p></div>`;
    case "video": { const v = videos.find((x) => x.id === b.id); return v ? videoCard(v) : ""; }
    default: return "";
  }
}

function videoCard(v) {
  return `<a class="vcard c-${v.color}" href="${esc(v.url)}" target="_blank" rel="noopener">
    <span class="thumb"><span>${icon("play")}</span></span>
    <span class="txt"><b>${esc(v.title)}</b><span>Tonton video</span></span>
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
    <p class="lead">Lagi males baca? Tonton videonya aja dulu.</p>
    <div class="vlist">${videos.map((v, i) => `
      <a class="vbig c-${v.color}" href="${esc(v.url)}" target="_blank" rel="noopener">
        <span class="thumb"><small>Video ${i + 1}</small><span>${icon("play")}</span></span>
        <span class="meta"><b>${esc(v.title)}</b>${icon("ext")}</span>
      </a>`).join("")}</div>`;
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
    <h1 class="h1">Kuis</h1>
    <p class="lead">${esc(quiz.intro)}</p>
    <div class="intro-card">
      <div class="facts"><span>${quiz.questions.length} soal</span><span>± 5 menit</span><span>Ada pembahasan</span></div>
      <p>Santai aja, ini bukan ujian. Yang penting paham.</p>
      ${mascot("wow")}
    </div>
    ${readPct() < 100 ? `<div class="notice">${icon("info")}<span>Kamu baru baca ${readSet().size} dari ${materi.length} materi. Boleh langsung kuis, tapi baca dulu biar makin lancar.</span></div>` : ""}
    ${quiz.askCode ? `<div class="field">
      <label for="code">Kode responden <span class="muted" style="font-weight:500">(opsional)</span></label>
      <input id="code" maxlength="40" autocomplete="off" placeholder="Contoh: R-012" value="${esc(Q.code)}" />
      <small>Isi kalau diminta peneliti atau guru. Jangan isi nama lengkap.</small>
    </div>` : ""}
    ${last ? `<p class="small muted">Skor terakhirmu: <b style="color:var(--ink)">${last.score}/${last.total}</b></p>` : ""}
    <button class="btn btn--block" id="start">Mulai kuis ${icon("right")}</button>`;
  $("#start").onclick = () => { Q.code = $("#code")?.value.trim() || ""; reset(); quizPage(); };
}

function quizQuestion() {
  const n = Q.step, item = quiz.questions[n], total = quiz.questions.length;
  topMeta.textContent = `Soal ${n + 1} dari ${total}`;
  view.innerHTML = `
    <div class="q-dots">${quiz.questions.map((_, i) => `<i class="${i < n ? (Q.answers[i] === quiz.questions[i].a ? "ok" : "no") : i === n ? "on" : ""}"></i>`).join("")}</div>
    <div class="q-num">${pad(n + 1)} / ${total}</div>
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
      if (xi === item.a) x.classList.add("correct");
      else if (xi === pick) x.classList.add("wrong");
      else x.classList.add("dim");
    });
    $(".q-dots i.on", view).className = ok ? "ok" : "no";
    $("#explain").innerHTML = `<div class="explain ${ok ? "ok" : "no"}">${icon(ok ? "check" : "info")}<div><b>${ok ? "Betul!" : "Belum tepat"}</b>${esc(item.e)}</div></div>`;
    const last = n === total - 1;
    $("#actions").innerHTML = `<button class="btn btn--block" id="nextQ">${last ? "Lihat hasil" : "Lanjut"} ${icon("right")}</button>`;
    $("#nextQ").onclick = () => { Q.step++; quizPage(); scrollTo(0, 0); };
    $("#actions").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }));
}

async function quizResult() {
  const qs = quiz.questions, total = qs.length;
  const score = Q.answers.reduce((s, a, i) => s + (a === qs[i].a ? 1 : 0), 0);
  const pct = Math.round((score / total) * 100);
  topMeta.textContent = "Selesai";
  const [mood, title, text, color] = pct >= 80
    ? ["happy", "Mantap, kamu paham banget!", "Ilmunya jangan disimpan sendiri. Ajak temanmu rutin minum TTD juga.", "var(--mint-ink)"]
    : pct >= 60
      ? ["happy", "Udah oke nih!", "Sebagian besar sudah kamu kuasai. Cek pembahasan di bawah biar makin mantap.", "var(--sky-ink)"]
      : ["meh", "Gapapa, coba lagi yuk", "Baca ulang materinya pelan-pelan, terus ulangi kuisnya. Pasti bisa.", "var(--red)"];

  view.innerHTML = `
    <div class="result">
      ${mascot(mood)}
      <div class="big">${score}<small>/${total}</small></div>
      <div class="bar"><span style="background:${color}"></span></div>
      <h2>${title}</h2>
      <p>${text}</p>
      <div class="stack">
        <button class="btn" id="retry">Ulangi kuis</button>
        <a class="btn btn--soft" href="#/materi">Baca materi lagi</a>
      </div>
      <p class="small muted" id="saveInfo" style="margin-top:14px">${remote ? "Menyimpan hasil…" : ""}</p>
      <div class="review">
        <h3>Pembahasan</h3>
        ${qs.map((q, i) => { const ok = Q.answers[i] === q.a; return `
          <details><summary><span class="${ok ? "ok" : "no"}">${icon(ok ? "check" : "x")}</span>${i + 1}. ${esc(q.q)}</summary>
          <p>${ok ? "" : `Jawabanmu: ${esc(q.o[Q.answers[i]] ?? "-")}<br>`}Jawaban benar: <b>${esc(q.o[q.a])}</b><br>${esc(q.e)}</p></details>`; }).join("")}
      </div>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => ($(".bar span", view).style.width = `${pct}%`)));
  $("#retry").onclick = () => { reset(); quizPage(); scrollTo(0, 0); };

  if (Q.saved) return;
  Q.saved = true;
  const r = await submitQuiz({
    quizId: quiz.id, code: Q.code, score, total,
    answers: qs.map((q, i) => ({ no: i + 1, pilihan: Q.answers[i], benar: Q.answers[i] === q.a })),
  });
  const info = $("#saveInfo");
  if (info) info.textContent = r.saved ? `Hasil tersimpan. Rata-rata skor semua pembaca: ${r.avg}%` : "";
}

/* ==========================================================
   Tentang
   ========================================================== */
function about() {
  document.title = `Tentang · ${site.title}`;
  view.innerHTML = `
    <h1 class="h1">Tentang</h1>
    <p class="lead">${esc(site.title)}: ${esc(site.subtitle)} adalah media edukasi gizi berbentuk e-zine interaktif untuk remaja.</p>
    <div class="callout callout--warn">${icon("alert")}<div><b>Catatan</b><p>Materi ini untuk edukasi dan tidak menggantikan pemeriksaan tenaga kesehatan. Kalau ada gejala anemia, cek Hb di Puskesmas ya.</p></div></div>
    <h2 class="h2">Sumber rujukan</h2>
    <ol class="sources">${sources.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    <h2 class="h2">Open source</h2>
    <p class="muted">Kode e-zine ini terbuka (lisensi MIT) dan boleh diadaptasi untuk media edukasi lain.</p>`;
}

router();
