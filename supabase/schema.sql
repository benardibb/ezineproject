-- ==========================================================
-- Pelan — skema database Supabase
-- Jalankan sekali di: Supabase Dashboard → SQL Editor → New query → Run
--
-- Keamanan: semua tabel memakai RLS TANPA policy, jadi tidak bisa
-- dibaca/ditulis langsung oleh publik. Pengunjung hanya bisa memakai
-- fungsi-fungsi di bawah (security definer) yang memvalidasi input
-- dan hanya mengembalikan angka agregat — tidak ada data pribadi.
-- ==========================================================

create table if not exists public.poll_votes (
  poll_id    text not null,
  voter_id   uuid not null,
  option_id  text not null,
  created_at timestamptz not null default now(),
  primary key (poll_id, voter_id)
);

create table if not exists public.quiz_results (
  quiz_id    text not null,
  voter_id   uuid not null,
  result_id  text not null,
  created_at timestamptz not null default now(),
  primary key (quiz_id, voter_id)
);

create table if not exists public.reactions (
  article_id text not null,
  voter_id   uuid not null,
  created_at timestamptz not null default now(),
  primary key (article_id, voter_id)
);

alter table public.poll_votes   enable row level security;
alter table public.quiz_results enable row level security;
alter table public.reactions    enable row level security;

revoke all on public.poll_votes, public.quiz_results, public.reactions from anon, authenticated;

-- Validasi id sederhana: huruf kecil, angka, tanda minus, maks 40 karakter
create or replace function public.pelan_valid_id(v text) returns boolean
language sql immutable as $$ select v ~ '^[a-z0-9-]{1,40}$' $$;

-- ---------- Polling ----------
create or replace function public.poll_results(p_poll text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(option_id, n), '{}'::jsonb)
  from (select option_id, count(*) n from poll_votes where poll_id = p_poll group by option_id) t
$$;

create or replace function public.cast_vote(p_poll text, p_option text, p_voter uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not (pelan_valid_id(p_poll) and pelan_valid_id(p_option)) then
    raise exception 'id tidak valid';
  end if;
  insert into poll_votes (poll_id, voter_id, option_id) values (p_poll, p_voter, p_option)
  on conflict (poll_id, voter_id) do update set option_id = excluded.option_id, created_at = now();
  return poll_results(p_poll);
end $$;

-- ---------- Kuis ----------
create or replace function public.quiz_stats(p_quiz text)
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(result_id, n), '{}'::jsonb)
  from (select result_id, count(*) n from quiz_results where quiz_id = p_quiz group by result_id) t
$$;

create or replace function public.save_quiz(p_quiz text, p_result text, p_voter uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not (pelan_valid_id(p_quiz) and pelan_valid_id(p_result)) then
    raise exception 'id tidak valid';
  end if;
  insert into quiz_results (quiz_id, voter_id, result_id) values (p_quiz, p_voter, p_result)
  on conflict (quiz_id, voter_id) do update set result_id = excluded.result_id, created_at = now();
  return quiz_stats(p_quiz);
end $$;

-- ---------- Reaksi (suka) ----------
create or replace function public.reaction_state(p_article text, p_voter uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'count', (select count(*) from reactions where article_id = p_article),
    'on',    exists (select 1 from reactions where article_id = p_article and voter_id = p_voter)
  )
$$;

create or replace function public.toggle_reaction(p_article text, p_voter uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
begin
  if not pelan_valid_id(p_article) then raise exception 'id tidak valid'; end if;
  if exists (select 1 from reactions where article_id = p_article and voter_id = p_voter) then
    delete from reactions where article_id = p_article and voter_id = p_voter;
  else
    insert into reactions (article_id, voter_id) values (p_article, p_voter);
  end if;
  return reaction_state(p_article, p_voter);
end $$;

-- Izin: publik hanya boleh memanggil fungsi-fungsi ini
revoke execute on function
  public.pelan_valid_id(text),
  public.poll_results(text), public.cast_vote(text, text, uuid),
  public.quiz_stats(text), public.save_quiz(text, text, uuid),
  public.reaction_state(text, uuid), public.toggle_reaction(text, uuid)
from public, anon, authenticated;
grant execute on function
  public.poll_results(text), public.cast_vote(text, text, uuid),
  public.quiz_stats(text), public.save_quiz(text, text, uuid),
  public.reaction_state(text, uuid), public.toggle_reaction(text, uuid)
to anon, authenticated;
