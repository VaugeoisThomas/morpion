create table public.games (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  opponent_type text not null
    check (opponent_type in ('computer', 'online')),
  result text not null
    check (result in ('win', 'loss', 'draw')),
  created_at timestamptz not null default now()
);

create index games_user_created_at_idx
  on public.games (user_id, created_at desc);

alter table public.games enable row level security;

create policy "Users can read their own games"
  on public.games
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own games"
  on public.games
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);