// Lapisan data: Supabase (REST RPC) dengan cadangan localStorage.
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

export const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* mode privat */ } },
};

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}
let mem;
export function deviceId() {
  let id = store.get("gc:device");
  if (!id) { id = mem || uuid(); mem = id; store.set("gc:device", id); }
  return id;
}

export const remote = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function rpc(fn, params) {
  const headers = { "Content-Type": "application/json", apikey: SUPABASE_KEY };
  if (SUPABASE_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
    method: "POST", headers, body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`${fn}: ${res.status} ${await res.text()}`);
  return res.json();
}

/**
 * Simpan hasil kuis. Mengembalikan { saved: boolean, count, avg } —
 * count/avg = jumlah percobaan dan rata-rata skor semua pembaca (bila Supabase aktif).
 */
export async function submitQuiz({ quizId, code, score, total, answers }) {
  const history = store.get(`gc:quiz:${quizId}`, []);
  history.push({ score, total, at: Date.now() });
  store.set(`gc:quiz:${quizId}`, history.slice(-20));
  if (remote) {
    try {
      const r = await rpc("submit_quiz", {
        p_quiz: quizId, p_code: code || null, p_score: score, p_total: total,
        p_answers: answers, p_device: deviceId(),
      });
      return { saved: true, ...r };
    } catch (e) { console.warn("[gizi-cerdas] gagal menyimpan ke Supabase:", e.message); }
  }
  return { saved: false };
}

export function quizHistory(quizId) { return store.get(`gc:quiz:${quizId}`, []); }
