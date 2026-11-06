-- Complète les politiques RLS avec des privilèges limités aux actions de l'application.
-- À appliquer seulement après revue ; aucune suppression de données.
alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.game_rooms enable row level security;

-- Les profils sont consultables par les joueurs connectés, jamais par les visiteurs.
drop policy if exists "Profiles are publicly readable" on public.profiles;
create policy "Profiles are publicly readable"
  on public.profiles for select to authenticated using (true);

revoke all privileges on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant insert (id, username, avatar) on public.profiles to authenticated;
grant update (username, avatar) on public.profiles to authenticated;

-- Un client ne peut pas déclarer lui-même une victoire ni modifier son historique.
drop policy if exists "Users can insert their own games" on public.games;
revoke all privileges on table public.games from public, anon, authenticated;
grant select on table public.games to authenticated;

-- À la création d'une salle, seul son paramétrage est fourni par le client.
-- Plateau, scores, invité et statut sont contrôlés par les valeurs par défaut et RPC.
revoke all privileges on table public.game_rooms from public, anon, authenticated;
grant select on table public.game_rooms to authenticated;
grant insert (host_id, invite_code, visibility, round_count, host_symbol, turn_duration)
  on public.game_rooms to authenticated;

-- Cette fonction est appelée par le trigger Auth, jamais directement par un joueur.
revoke execute on function public.create_profile_for_new_user()
  from public, anon, authenticated;
