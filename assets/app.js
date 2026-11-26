import { db, remote } from "./db.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fmt = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("is-on");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("is-on"), 2400);
}

/* ==========================================================
   Tema
   ========================================================== */
(function theme() {
  const root = document.documentElement;
  try { const saved = localStorage.getItem("pelan:theme"); if (saved) root.dataset.theme = saved; } catch {}
  $("#themeBtn").addEventListener("click", toggle);
  function toggle() {
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("pelan:theme", root.dataset.theme); } catch {}
  }
  theme.toggle = toggle;
})();

/* ==========================================================
   Navigasi: daftar isi, titik samping, progres, keyboard
   ========================================================== */
const chapters = $$(".chapter");
const tocList = $("#tocList"), dots = $("#dots"), toc = $("#toc"), menuBtn = $("#menuBtn");

chapters.forEach((c, i) => {
  const title = c.dataset.title;
  const li = document.createElement("li");
  li.innerHTML = `<a href="#${c.id}"><span class="n">${String(i).padStart(2, "0")}</span>${title}</a>`;
  tocList.append(li);
  const d = document.createElement("a");
  d.href = `#${c.id}`; d.setAttribute("aria-label", title);
  d.innerHTML = `<span>${title}</span>`;
  dots.append(d);
});

function setMenu(open) {
  toc.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
  if (open) $("a", tocList)?.focus();
}
menuBtn.addEventListener("click", () => setMenu(toc.hidden));
toc.addEventListener("click", (e) => { if (e.target.closest("a") || e.target === toc) setMenu(false); });

let current = 0;
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    current = chapters.indexOf(en.target);
    $$("a", dots).forEach((a, i) => a.setAttribute("aria-current", String(i === current)));
    $$("a", tocList).forEach((a, i) => a.setAttribute("aria-current", String(i === current)));
    document.body.classList.toggle("cover-visible", current === 0);
  });
}, { rootMargin: "-45% 0px -50% 0px" });
chapters.forEach((c) => io.observe(c));

const bar = $("#progressBar"), topbar = $("#topbar"), coverImg = $(".cover__media img");
let lastY = 0, ticking = false;
addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = `${(y / h) * 100}%`;
    topbar.classList.toggle("is-scrolled", y > 10);
    topbar.classList.toggle("is-hidden", y > lastY && y > 400 && toc.hidden);
    if (!reduceMotion && y < innerHeight) coverImg.style.transform = `translateY(${y * 0.25}px) scale(1.02)`;
    lastY = y; ticking = false;
  });
}, { passive: true });

function go(i) {
  const c = chapters[Math.max(0, Math.min(chapters.length - 1, i))];
  c.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}
addEventListener("keydown", (e) => {
  if (e.target.closest("input, select, textarea") || e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key.toLowerCase();
  if (k === "escape" && !toc.hidden) setMenu(false);
  else if (k === "m") setMenu(toc.hidden);
  else if (k === "t") theme.toggle();
  else if (k === "j") go(current + 1);
  else if (k === "k") go(current - 1);
});

/* Animasi muncul saat digulir */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); } });
}, { rootMargin: "0px 0px -8% 0px" });
$$(".reveal").forEach((el) => revealIO.observe(el));

/* ==========================================================
   Reaksi (suka)
   ========================================================== */
$$(".react").forEach(async (el) => {
  const id = el.dataset.react, btn = $(".react__btn", el), count = $(".react__count", el);
  const paint = ({ count: n = 0, on = false } = {}) => {
    btn.setAttribute("aria-pressed", String(on));
    $(".react__label", el).textContent = on ? "Kamu menyukai ini" : "Suka esai ini";
    count.textContent = remote ? `${fmt.format(n)} pembaca menyukai ini` : "";
  };
  paint(await db.reaction(id));
  btn.addEventListener("click", async () => {
    btn.disabled = true;
    paint(await db.toggleReaction(id));
    btn.disabled = false;
  });
});

/* ==========================================================
   Infografis: kalkulator waktu
   ========================================================== */
(function calc() {
  const input = $("#hours"), out = $("#hoursOut"), day = $("#dayBar");
  for (let i = 0; i < 16; i++) day.insertAdjacentHTML("beforeend", "<i><b></b></i>");
  const cells = $$("b", day);
  const nums = Object.fromEntries($$("[data-k]").map((n) => [n.dataset.k, n]));
  const shown = {};

  function animate(el, key, to) {
    const from = shown[key] ?? to; shown[key] = to;
    if (reduceMotion || from === to) { el.textContent = fmt.format(to); return; }
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 500), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(from + (to - from) * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function update() {
    const h = parseFloat(input.value);
    const label = h % 1 === 0 ? `${h}` : `${Math.floor(h) ? Math.floor(h) + " " : ""}${{ 0.25: "¼", 0.5: "½", 0.75: "¾" }[h % 1]}`;
    out.textContent = `${label} jam / hari`;
    const year = h * 365;
    animate(nums.hoursYear, "hoursYear", Math.round(year));
    animate(nums.books, "books", Math.floor(year / 15));
    animate(nums.km, "km", Math.round(year * 4.5));
    animate(nums.days, "days", Math.round(year / 24));
    cells.forEach((c, i) => { c.style.width = `${Math.max(0, Math.min(1, h - i)) * 100}%`; });
    const pct = ((h - input.min) / (input.max - input.min)) * 100;
    input.style.background = `linear-gradient(90deg, var(--accent) ${pct}%, var(--line) ${pct}%)`;
  }
  input.addEventListener("input", update);
  update();
})();

/* ==========================================================
   Galeri geser + lightbox
   ========================================================== */
(function gallery() {
  const photos = [
    [1018, "Sebelum alarm berbunyi."],
    [1039, "Air yang tidak pernah terburu-buru."],
    [1043, "Jalan yang belum ramai."],
    [1044, "Cahaya pertama di jendela."],
    [1050, "Angin yang datang tanpa janji."],
    [1036, "Diam yang terasa hangat."],
    [1069, "Satu napas panjang, lalu hari dimulai."],
  ];
  const track = $("#galleryTrack"), dotsEl = $("#galDots");
  photos.forEach(([id, cap], i) => {
    track.insertAdjacentHTML("beforeend", `
      <figure class="slide">
        <button type="button" data-full="https://picsum.photos/id/${id}/1800/1200" data-cap="${cap}" aria-label="Perbesar foto ${i + 1}: ${cap}">
          <img src="https://picsum.photos/id/${id}/1080/720" alt="${cap}" loading="lazy" draggable="false" />
        </button>
        <figcaption><strong>${String(i + 1).padStart(2, "0")}</strong> ${cap}</figcaption>
      </figure>`);
    dotsEl.insertAdjacentHTML("beforeend", `<button type="button" aria-label="Ke foto ${i + 1}"></button>`);
  });
  const slides = $$(".slide", track), dotBtns = $$("button", dotsEl);
  let idx = 0;

  const toSlide = (i) => {
    idx = (i + slides.length) % slides.length;
    const s = slides[idx];
    track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
  };
  $("#galPrev").onclick = () => toSlide(idx - 1);
  $("#galNext").onclick = () => toSlide(idx + 1);
  dotBtns.forEach((b, i) => (b.onclick = () => toSlide(i)));
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); toSlide(idx + 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); toSlide(idx - 1); }
  });

  const slideIO = new IntersectionObserver((ents) => ents.forEach((en) => {
    if (en.intersectionRatio > 0.6) {
      idx = slides.indexOf(en.target);
      dotBtns.forEach((b, i) => b.setAttribute("aria-current", String(i === idx)));
    }
  }), { root: track, threshold: [0.6] });
  slides.forEach((s) => slideIO.observe(s));

  // Seret dengan mouse (sentuh sudah ditangani scroll native)
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
  });
  addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 5) { moved = true; track.classList.add("is-dragging"); }
    track.scrollLeft = startLeft - dx;
  });
  addEventListener("pointerup", () => {
    if (!down) return; down = false;
    track.classList.remove("is-dragging");
    if (moved) {
      const center = track.scrollLeft + track.clientWidth / 2;
      let best = 0, dist = Infinity;
      slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft + s.clientWidth / 2 - center); if (d < dist) { dist = d; best = i; } });
      toSlide(best);
    }
  });

  const lb = $("#lightbox");
  track.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-full]");
    if (!b || moved) return;
    $("#lbImg").src = b.dataset.full; $("#lbImg").alt = b.dataset.cap; $("#lbCap").textContent = b.dataset.cap;
    lb.showModal();
  });
  $("#lbClose").onclick = () => lb.close();
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
})();

/* ==========================================================
   Ruang Dengar — suara dibangkitkan dengan Web Audio API
   ========================================================== */
(function sound() {
  const playBtn = $("#playSound"), vol = $("#volume"), timerSel = $("#timer"), status = $("#soundStatus");
  const canvas = $("#viz"), ctx2d = canvas.getContext("2d");
  let ac, master, analyser, current = null, choice = "hujan", playing = false, timerId, endAt = 0;

  function noiseBuffer(type) {
    const len = ac.sampleRate * 4, buf = ac.createBuffer(2, len, ac.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      let b0 = 0, b1 = 0, b2 = 0, last = 0;
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1;
        if (type === "brown") { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
        else if (type === "pink") {
          b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913;
          d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
        } else d[i] = w * 0.5;
      }
    }
    return buf;
  }

  function lfo(target, rate, depth, base) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = rate; g.gain.value = depth; target.value = base;
    o.connect(g).connect(target); o.start();
    return o;
  }

  function build(kind) {
    const out = ac.createGain(); out.gain.value = 0; out.connect(master);
    const nodes = [], timers = [];
    const src = (type) => { const s = ac.createBufferSource(); s.buffer = noiseBuffer(type); s.loop = true; s.start(); nodes.push(s); return s; };

    if (kind === "hujan") {
      const s = src("pink");
      const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 500;
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 7000;
      const g = ac.createGain(); g.gain.value = 0.9;
      s.connect(hp).connect(lp).connect(g).connect(out);
      const rumble = src("brown"); const rg = ac.createGain(); rg.gain.value = 0.35; rumble.connect(rg).connect(out);
      // tetes hujan acak
      const dropBuf = ac.createBuffer(1, ac.sampleRate * 0.03, ac.sampleRate);
      const dd = dropBuf.getChannelData(0); for (let i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / dd.length, 4);
      const drip = () => {
        const b = ac.createBufferSource(); b.buffer = dropBuf;
        const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 1800 + Math.random() * 4000; bp.Q.value = 6;
        const pg = ac.createGain(); pg.gain.value = 0.15 + Math.random() * 0.35;
        const pan = ac.createStereoPanner(); pan.pan.value = Math.random() * 2 - 1;
        b.connect(bp).connect(pg).connect(pan).connect(out); b.start();
        timers.push(setTimeout(drip, 30 + Math.random() * 160));
        if (timers.length > 50) timers.splice(0, 25);
      };
      drip();
    } else if (kind === "ombak") {
      const s = src("brown");
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.Q.value = 0.7;
      const g = ac.createGain();
      nodes.push(lfo(lp.frequency, 0.09, 700, 900), lfo(g.gain, 0.09, 0.45, 0.55));
      s.connect(lp).connect(g).connect(out);
      const fizz = src("white"); const hp = ac.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
      const fg = ac.createGain(); nodes.push(lfo(fg.gain, 0.09, 0.05, 0.05));
      fizz.connect(hp).connect(fg).connect(out);
    } else {
      const s = src("pink");
      const bp = ac.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = 1.4;
      const g = ac.createGain();
      nodes.push(lfo(bp.frequency, 0.07, 350, 600), lfo(bp.Q, 0.13, 0.9, 1.6), lfo(g.gain, 0.05, 0.4, 1.1));
      s.connect(bp).connect(g).connect(out);
      const s2 = src("pink"); const bp2 = ac.createBiquadFilter(); bp2.type = "bandpass"; bp2.Q.value = 8;
      const g2 = ac.createGain(); g2.gain.value = 0.25; nodes.push(lfo(bp2.frequency, 0.11, 500, 1200));
      s2.connect(bp2).connect(g2).connect(out);
    }
    out.gain.setTargetAtTime(1, ac.currentTime, 0.6);
    return {
      stop() {
        timers.forEach(clearTimeout);
        out.gain.setTargetAtTime(0, ac.currentTime, 0.3);
        setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch {} }); out.disconnect(); }, 1500);
      },
    };
  }

  function init() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    master = ac.createGain(); master.gain.value = +vol.value * 0.6;
    analyser = ac.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.85;
    master.connect(analyser).connect(ac.destination);
  }

  async function play() {
    if (!ac) init();
    await ac.resume();
    current?.stop(); current = build(choice); playing = true;
    playBtn.setAttribute("aria-pressed", "true");
    $(".play-ico", playBtn).textContent = "❚❚"; $(".txt", playBtn).textContent = "Jeda";
    setTimer();
  }
  function stop() {
    current?.stop(); current = null; playing = false; clearInterval(timerId); endAt = 0;
    playBtn.setAttribute("aria-pressed", "false");
    $(".play-ico", playBtn).textContent = "▶"; $(".txt", playBtn).textContent = "Putar";
    status.textContent = "";
  }
  function setTimer() {
    clearInterval(timerId);
    const sec = +timerSel.value;
    const label = { hujan: "Hujan", ombak: "Ombak", angin: "Angin" }[choice];
    if (!sec) { endAt = 0; status.textContent = `Sedang memutar: ${label}`; return; }
    endAt = Date.now() + sec * 1000;
    const tick = () => {
      const left = Math.max(0, Math.round((endAt - Date.now()) / 1000));
      status.textContent = `Sedang memutar: ${label} · berhenti dalam ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
      if (!left) stop();
    };
    tick(); timerId = setInterval(tick, 1000);
  }

  playBtn.addEventListener("click", () => (playing ? stop() : play()));
  vol.addEventListener("input", () => { if (master) master.gain.setTargetAtTime(+vol.value * 0.6, ac.currentTime, 0.05); });
  timerSel.addEventListener("change", () => playing && setTimer());
  $$(".sound__choices button").forEach((b) => b.addEventListener("click", () => {
    $$(".sound__choices button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    choice = b.dataset.sound;
    if (playing) play();
  }));

  function draw() {
    const dpr = devicePixelRatio || 1, w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.clearRect(0, 0, w, h);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#b5562f";
    ctx2d.fillStyle = color;
    const data = new Uint8Array(analyser ? analyser.frequencyBinCount : 64);
    if (analyser) analyser.getByteFrequencyData(data);
    const n = 48, gap = 3, bw = (w - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const v = data[Math.floor((i / n) * data.length * 0.7)] / 255;
      const bh = Math.max(2, v * (h - 10));
      ctx2d.globalAlpha = 0.35 + v * 0.65;
      ctx2d.fillRect(i * (bw + gap), (h - bh) / 2, bw, bh);
    }
    ctx2d.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw(); // garis datar sebelum audio dimulai
})();

/* ==========================================================
   Video player kustom
   ========================================================== */
(function video() {
  const v = $("#vid"), wrap = $(".video"), big = $("#vidPlay"), tog = $("#vidToggle"),
    seek = $("#vidSeek"), time = $("#vidTime"), speed = $("#vidSpeed"), full = $("#vidFull");
  const t = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const toggle = () => (v.paused ? v.play() : v.pause());
  big.onclick = toggle; tog.onclick = toggle; v.onclick = toggle;
  v.onplay = () => { wrap.classList.add("is-playing"); tog.textContent = "❚❚"; };
  v.onpause = () => { wrap.classList.remove("is-playing"); tog.textContent = "▶"; };
  v.ontimeupdate = () => { if (v.duration) seek.value = (v.currentTime / v.duration) * 100; time.textContent = `${t(v.currentTime)} / ${t(v.duration || 0)}`; };
  v.onloadedmetadata = v.ontimeupdate;
  seek.oninput = () => { if (v.duration) v.currentTime = (seek.value / 100) * v.duration; };
  const speeds = [1, 0.5, 0.25, 2];
  speed.onclick = () => { const n = speeds[(speeds.indexOf(v.playbackRate) + 1) % speeds.length]; v.playbackRate = n; speed.textContent = `${n}×`; toast(`Kecepatan ${n}×${n < 1 ? " — lebih pelan" : ""}`); };
  full.onclick = () => (document.fullscreenElement ? document.exitFullscreen() : (wrap.requestFullscreen?.() || v.webkitEnterFullscreen?.()));
  v.onerror = () => toast("Video gagal dimuat.");
  // jeda otomatis saat keluar layar
  new IntersectionObserver(([en]) => { if (!en.isIntersecting && !v.paused) v.pause(); }, { threshold: 0.2 }).observe(wrap);
})();

/* ==========================================================
   Kuis
   ========================================================== */
(function quiz() {
  const QUIZ_ID = "tipe-pelambat";
  const types = {
    jalan:  { emoji: "🚶", name: "Si Pejalan", desc: "Kamu melambat dengan bergerak. Langkah kaki adalah meditasimu — kota, taman, dan gang kecil adalah ruang bernapasmu." },
    renung: { emoji: "📖", name: "Si Perenung", desc: "Kamu melambat lewat kata dan pikiran. Buku, jurnal, dan keheningan membuat duniamu terasa lebih luas." },
    rasa:   { emoji: "🍵", name: "Si Penikmat", desc: "Kamu melambat lewat rasa. Menyeduh teh, memasak pelan, dan makan tanpa layar adalah ritualmu." },
    dengar: { emoji: "🎧", name: "Si Pendengar", desc: "Kamu melambat lewat suara. Hujan, musik, dan ombak menolongmu kembali ke saat ini." },
  };
  const qs = [
    ["Minggu pagi tanpa rencana. Kamu…", [["jalan", "Jalan kaki keliling lingkungan"], ["renung", "Membaca di kasur sampai siang"], ["rasa", "Membuat sarapan pelan-pelan"], ["dengar", "Memutar musik sambil rebahan"]]],
    ["Benda yang selalu ada di tasmu?", [["jalan", "Sepatu nyaman & payung lipat"], ["renung", "Buku catatan kecil"], ["rasa", "Tumbler berisi teh"], ["dengar", "Earphone"]]],
    ["Saat pikiran penuh, yang paling menolong adalah…", [["jalan", "Keluar rumah dan bergerak"], ["renung", "Menulis apa saja di jurnal"], ["rasa", "Memasak atau makan enak"], ["dengar", "Mendengarkan sesuatu yang tenang"]]],
    ["Liburan impianmu?", [["jalan", "Menyusuri kota tua tanpa peta"], ["renung", "Kabin sepi dengan rak buku"], ["rasa", "Berkeliling pasar dan warung lokal"], ["dengar", "Pantai sepi, hanya suara ombak"]]],
  ];
  const el = $("#quiz");
  let step = 0, score = {};

  function renderQ() {
    const [q, opts] = qs[step];
    el.innerHTML = `
      <div class="quiz__meta"><span>Pertanyaan ${step + 1} dari ${qs.length}</span>${step ? '<button class="poll__foot-btn link" id="qBack" style="background:none;border:0;color:inherit;cursor:pointer;text-decoration:underline">Kembali</button>' : ""}</div>
      <div class="quiz__bar"><span style="width:${(step / qs.length) * 100}%"></span></div>
      <p class="quiz__q">${q}</p>
      <div class="quiz__opts">${opts.map(([k, t], i) => `<button class="opt" data-k="${k}"><span class="k">${"ABCD"[i]}</span>${t}</button>`).join("")}</div>`;
    $$(".opt", el).forEach((b) => (b.onclick = () => answer(b.dataset.k)));
    $("#qBack", el)?.addEventListener("click", () => { step--; renderQ(); });
  }
  const answers = [];
  function answer(k) {
    answers[step] = k;
    if (++step < qs.length) renderQ(); else finish();
  }
  async function finish() {
    score = {}; answers.forEach((k) => (score[k] = (score[k] || 0) + 1));
    const best = Object.keys(score).reduce((a, b) => (score[b] > score[a] ? b : a), answers[answers.length - 1]);
    el.innerHTML = `<div class="quiz__result"><p class="note">Menyimpan hasil…</p></div>`;
    const stats = await db.saveQuiz(QUIZ_ID, best);
    showResult(best, stats);
  }
  function showResult(best, stats) {
    const t = types[best];
    const total = Object.values(stats).reduce((a, b) => a + b, 0) || 1;
    el.innerHTML = `
      <div class="quiz__result">
        <div class="quiz__emoji">${t.emoji}</div>
        <p class="eyebrow" style="justify-content:center">Kamu adalah</p>
        <h3>${t.name}</h3>
        <p>${t.desc}</p>
        <div class="quiz__stats">
          <p class="note" style="margin:0 0 4px">${remote ? `Hasil ${fmt.format(total)} pembaca:` : "Hasil di perangkat ini (mode lokal):"}</p>
          ${Object.entries(types).map(([k, v]) => {
            const pct = Math.round(((stats[k] || 0) / total) * 100);
            return `<div class="quiz__row ${k === best ? "is-me" : ""}"><span>${v.emoji} ${v.name}</span><span class="track"><span style="width:0" data-w="${pct}"></span></span><span>${pct}%</span></div>`;
          }).join("")}
        </div>
        <button class="btn btn--ghost" id="qRetry">Ulangi kuis</button>
      </div>`;
    requestAnimationFrame(() => requestAnimationFrame(() => $$("[data-w]", el).forEach((s) => (s.style.width = s.dataset.w + "%"))));
    $("#qRetry").onclick = () => { step = 0; answers.length = 0; renderQ(); };
  }
  renderQ();
})();

/* ==========================================================
   Polling
   ========================================================== */
(function poll() {
  const el = $("#poll"), POLL_ID = el.dataset.poll;
  const options = [
    ["tidur", "😴", "Tidur & istirahat"],
    ["pangan", "🌾", "Pangan lokal & dapur rumah"],
    ["jalan", "🏙", "Kota yang ramah pejalan kaki"],
    ["sepi", "📵", "Sepi digital"],
  ];
  let mine = db.myVote(POLL_ID), results = {}, showing = Boolean(mine);

  function render() {
    const total = Object.values(results).reduce((a, b) => a + b, 0);
    el.innerHTML = options.map(([id, emo, label]) => {
      const n = results[id] || 0, pct = total ? Math.round((n / total) * 100) : 0;
      return `<button class="poll__opt ${mine === id ? "is-mine" : ""}" data-id="${id}" ${showing ? `aria-label="${label}, ${pct} persen${mine === id ? ", pilihanmu" : ""}"` : ""}>
        <span class="poll__fill" style="width:${showing ? pct : 0}%"></span>
        <span>${emo}&nbsp; ${label}${mine === id ? " ✓" : ""}</span>
        <span class="pct">${showing ? `${pct}%` : ""}</span>
      </button>`;
    }).join("") + `<div class="poll__foot"><span>${showing ? `${fmt.format(total)} suara${remote ? "" : " · mode lokal"}` : "Pilih satu untuk melihat hasil"}</span>${mine ? '<span>Klik opsi lain untuk mengganti pilihan</span>' : '<button type="button" id="peek">Lihat hasil</button>'}</div>`;
    $$(".poll__opt", el).forEach((b) => (b.onclick = () => vote(b.dataset.id)));
    $("#peek", el)?.addEventListener("click", () => { showing = true; render(); });
  }
  async function vote(id) {
    if (id === mine) return;
    $$(".poll__opt", el).forEach((b) => (b.disabled = true));
    results = await db.castVote(POLL_ID, id);
    mine = id; showing = true; render();
    toast("Terima kasih, suaramu tercatat!");
  }
  async function refresh() { results = await db.pollResults(POLL_ID); render(); }
  render(); refresh();
  // perbarui berkala saat bagian terlihat
  let iv;
  new IntersectionObserver(([en]) => {
    clearInterval(iv);
    if (en.isIntersecting && remote) iv = setInterval(() => !document.hidden && refresh(), 15000);
  }).observe(el);
})();

/* ==========================================================
   Bagikan
   ========================================================== */
$("#shareBtn").addEventListener("click", async () => {
  const data = { title: "Pelan — Ezine Interaktif", text: "Edisi 01: Seni Melambat", url: location.href.split("#")[0] };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(data.url); toast("Tautan disalin ke clipboard"); }
  } catch { /* dibatalkan */ }
});

$("#backendLabel").textContent = remote ? "Supabase (tersambung)" : "Mode lokal — hubungkan Supabase di assets/config.js";
