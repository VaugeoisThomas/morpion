create table public.game_rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid not null references auth.users (id) on delete cascade,
  invite_code text not null unique,
  visibility text not null
    check (visibility in ('private', 'public')),
  round_count smallint not null
    check (round_count in (1, 3, 5)),
  host_symbol text not null
    check (host_symbol in ('X', 'O')),
  turn_duration smallint not null
    check (turn_duration in (15, 30, 60)),
  status text not null default 'waiting'
    check (status in ('waiting', 'in_progress', 'finished', 'cancelled')),
  created_at timestamptz not null default now()
);

alter table public.game_rooms enable row level security;

create policy "Hosts can read their own game rooms"
  on public.game_rooms
  for select
  to authenticated
  using ((select auth.uid()) = host_id);

create policy "Users can create their own game rooms"
  on public.game_rooms
  for insert
  to authenticated
  with check ((select auth.uid()) = host_id);