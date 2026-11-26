// Lapisan data: Supabase (via REST RPC) dengan cadangan localStorage.
import { SUPABASE_URL, SUPABASE_KEY } from "./config.js";

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* abaikan */ } },
};

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
}

let memVoter;
export function voterId() {
  let id = store.get("pelan:voter");
  if (!id) { id = memVoter || uuid(); memVoter = id; store.set("pelan:voter", id); }
  return id;
}

export const remote = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function rpc(fn, params) {
  const headers = { "Content-Type": "application/json", apikey: SUPABASE_KEY };
  // Kunci anon lama berbentuk JWT perlu header Authorization; kunci publishable baru tidak.
  if (SUPABASE_KEY.startsWith("eyJ")) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  const res = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/rpc/${fn}`, {
    method: "POST", headers, body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`${fn}: ${res.status} ${await res.text()}`);
  return res.json();
}

// ---------- Mode lokal (fallback) ----------
const local = {
  castVote(poll, option) {
    const all = store.get(`pelan:poll:${poll}`, {});
    const mine = store.get(`pelan:mine:${poll}`);
    if (mine) all[mine] = Math.max(0, (all[mine] || 1) - 1);
    all[option] = (all[option] || 0) + 1;
    store.set(`pelan:poll:${poll}`, all);
    return all;
  },
  pollResults(poll) { return store.get(`pelan:poll:${poll}`, {}); },
  saveQuiz(quiz, result) {
    const all = store.get(`pelan:quiz:${quiz}`, {});
    const prev = store.get(`pelan:quizmine:${quiz}`);
    if (prev) all[prev] = Math.max(0, (all[prev] || 1) - 1);
    all[result] = (all[result] || 0) + 1;
    store.set(`pelan:quiz:${quiz}`, all);
    return all;
  },
  toggleReaction(article) {
    const on = !store.get(`pelan:react:${article}`, false);
    store.set(`pelan:react:${article}`, on);
    return { count: on ? 1 : 0, on };
  },
  reaction(article) {
    const on = store.get(`pelan:react:${article}`, false);
    return { count: on ? 1 : 0, on };
  },
};

// Jalankan via Supabase bila ada; jika gagal, jatuh ke mode lokal.
async function run(remoteFn, localFn) {
  if (remote) {
    try { return await remoteFn(); }
    catch (e) { console.warn("[pelan] Supabase gagal, memakai mode lokal:", e.message); }
  }
  return localFn();
}

export const db = {
  async castVote(poll, option) {
    const r = await run(() => rpc("cast_vote", { p_poll: poll, p_option: option, p_voter: voterId() }),
      () => local.castVote(poll, option));
    store.set(`pelan:mine:${poll}`, option);
    return r || {};
  },
  async pollResults(poll) {
    return (await run(() => rpc("poll_results", { p_poll: poll }), () => local.pollResults(poll))) || {};
  },
  myVote(poll) { return store.get(`pelan:mine:${poll}`); },

  async saveQuiz(quiz, result) {
    const r = await run(() => rpc("save_quiz", { p_quiz: quiz, p_result: result, p_voter: voterId() }),
      () => local.saveQuiz(quiz, result));
    store.set(`pelan:quizmine:${quiz}`, result);
    return r || {};
  },
  myQuiz(quiz) { return store.get(`pelan:quizmine:${quiz}`); },

  async toggleReaction(article) {
    return run(() => rpc("toggle_reaction", { p_article: article, p_voter: voterId() }),
      () => local.toggleReaction(article));
  },
  async reaction(article) {
    return run(() => rpc("reaction_state", { p_article: article, p_voter: voterId() }),
      () => local.reaction(article));
  },
};
