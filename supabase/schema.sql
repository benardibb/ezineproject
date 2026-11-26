-- ==========================================================
-- Gizi Cerdas: Lawan Anemia — skema database Supabase
-- Jalankan sekali di: Supabase Dashboard → SQL Editor → New query → Run
--
-- Keamanan: tabel memakai RLS TANPA policy publik, jadi pengunjung
-- tidak bisa membaca jawaban orang lain. Pengunjung hanya bisa
-- memanggil fungsi submit_quiz (validasi input) yang mengembalikan
-- angka agregat. Peneliti melihat data lengkap lewat Table Editor
-- atau SQL Editor di dashboard Supabase.
-- ==========================================================

create table if not exists public.quiz_attempts (
  id          bigint generated always as identity primary key,
  quiz_id     text        not null,
  kode_responden text,                -- opsional, diisi responden (mis. R-012)
  skor        int         not null,
  total       int         not null,
  jawaban     jsonb       not null,   -- [{ no, pilihan, benar }]
  device_id   uuid        not null,   -- id acak per perangkat, bukan data pribadi
  created_at  timestamptz not null default now()
);
create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts (quiz_id, created_at);

alter table public.quiz_attempts enable row level security;
revoke all on public.quiz_attempts from anon, authenticated;

create or replace function public.submit_quiz(
  p_quiz text, p_code text, p_score int, p_total int, p_answers jsonb, p_device uuid
) returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_code text := nullif(btrim(p_code), '');
begin
  if p_quiz !~ '^[a-z0-9-]{1,40}$' then raise exception 'quiz id tidak valid'; end if;
  if v_code is not null and char_length(v_code) > 40 then raise exception 'kode terlalu panjang'; end if;
  if p_total not between 1 and 100 or p_score not between 0 and p_total then raise exception 'skor tidak valid'; end if;
  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) > 100 then raise exception 'jawaban tidak valid'; end if;

  -- batas sederhana: maks 20 percobaan per perangkat per jam
  if (select count(*) from quiz_attempts where device_id = p_device and created_at > now() - interval '1 hour') >= 20 then
    raise exception 'terlalu banyak percobaan';
  end if;

  insert into quiz_attempts (quiz_id, kode_responden, skor, total, jawaban, device_id)
  values (p_quiz, v_code, p_score, p_total, p_answers, p_device);

  return (
    select jsonb_build_object('count', count(*), 'avg', round(avg(skor::numeric * 100 / total), 0))
    from quiz_attempts where quiz_id = p_quiz
  );
end $$;

revoke execute on function public.submit_quiz(text, text, int, int, jsonb, uuid) from public, anon, authenticated;
grant  execute on function public.submit_quiz(text, text, int, int, jsonb, uuid) to anon, authenticated;

-- ---------- Contoh query untuk peneliti (jalankan di SQL Editor) ----------
-- Semua hasil:
--   select created_at, kode_responden, skor, total from quiz_attempts order by created_at desc;
-- Nilai terakhir per responden:
--   select distinct on (kode_responden) kode_responden, skor, total, created_at
--   from quiz_attempts where kode_responden is not null
--   order by kode_responden, created_at desc;
