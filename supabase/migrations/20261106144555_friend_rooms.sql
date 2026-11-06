alter table public.game_rooms
  add column turn_started_at timestamptz,
  add column round_finished boolean not null default false,
  add column round_winner text check (round_winner in ('X', 'O')),
  add column round_end_reason text check (round_end_reason in ('alignment', 'draw', 'timeout')),
  add column series_number integer not null default 1 check (series_number > 0),
  add column host_replay_ready boolean not null default false,
  add column guest_replay_ready boolean not null default false;

-- Les salles préexistantes reprennent avec un tour complet ou une manche terminée.
update public.game_rooms set
  round_finished = public.game_board_winner(board) is not null or array_position(board, null::text) is null,
  round_winner = public.game_board_winner(board),
  round_end_reason = case when public.game_board_winner(board) is not null then 'alignment'
    when array_position(board, null::text) is null then 'draw' end,
  turn_started_at = case when status = 'in_progress'
    and public.game_board_winner(board) is null and array_position(board, null::text) is not null
    then clock_timestamp() end;

-- L'ancienne logique de coup reste interne, derrière la vérification du délai.
revoke execute on function public.play_game_room_move(uuid, integer) from public, anon, authenticated;
revoke execute on function public.start_game_room(uuid) from public, anon, authenticated;
revoke execute on function public.start_next_game_room_round(uuid) from public, anon, authenticated;
revoke insert on public.game_rooms from authenticated;
revoke insert (host_id, invite_code, visibility, round_count, host_symbol, turn_duration)
  on public.game_rooms from authenticated;

create function public.create_friend_room(
  p_request_id uuid, p_visibility text, p_round_count smallint,
  p_host_symbol text, p_turn_duration smallint
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  user_id uuid := auth.uid();
  existing_host uuid;
  raw_code text;
begin
  if user_id is null then raise exception 'Connexion requise.'; end if;
  if not exists (select 1 from public.profiles where id = user_id) then
    raise exception 'Complète ton profil avant de créer une partie.';
  end if;
  if p_request_id is null then raise exception 'Demande invalide.'; end if;
  select host_id into existing_host from public.game_rooms where id = p_request_id;
  if found then
    if existing_host <> user_id then raise exception 'Demande invalide.'; end if;
    return p_request_id;
  end if;
  for attempt in 1..5 loop
    raw_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    begin
      insert into public.game_rooms(id, host_id, invite_code, visibility, round_count, host_symbol, turn_duration)
      values (p_request_id, user_id, substr(raw_code,1,4) || '-' || substr(raw_code,5,4),
        p_visibility, p_round_count, p_host_symbol, p_turn_duration);
      return p_request_id;
    exception when unique_violation then
      -- Une réponse perdue ou deux requêtes identiques ne créent pas deux salles.
      select host_id into existing_host from public.game_rooms where id = p_request_id;
      if found then
        if existing_host <> user_id then raise exception 'Demande invalide.'; end if;
        return p_request_id;
      end if;
    end;
  end loop;
  raise exception 'Création indisponible. Réessaie.';
end;
$$;

-- Chaque action est liée à une série et une manche, pour refuser les requêtes périmées.
create function public.friend_room_action(
  p_room_id uuid, p_action text, p_round integer, p_series integer, p_cell integer default null
) returns uuid language plpgsql security definer set search_path = '' as $$
declare
  user_id uuid := auth.uid();
  room public.game_rooms%rowtype;
  winner text;
  over boolean;
  host_ready boolean;
  guest_ready boolean;
begin
  if user_id is null then raise exception 'Connexion requise.'; end if;
  select * into room from public.game_rooms
    where id = p_room_id and (host_id = user_id or guest_id = user_id) for update;
  if not found then raise exception 'Salle introuvable ou accès refusé.'; end if;
  if p_series is distinct from room.series_number or p_round is distinct from room.current_round then
    raise exception 'La partie a changé. Actualise son état.';
  end if;

  if p_action = 'leave' then
    if room.status <> 'waiting' then raise exception 'La partie a déjà démarré.'; end if;
    if room.host_id = user_id then
      update public.game_rooms set status = 'cancelled' where id = room.id;
    else
      update public.game_rooms set guest_id = null where id = room.id;
    end if;
    return room.id;
  end if;

  if p_action = 'replay' then
    if room.status <> 'finished' or room.guest_id is null then raise exception 'La série n’est pas terminée.'; end if;
    host_ready := room.host_replay_ready or room.host_id = user_id;
    guest_ready := room.guest_replay_ready or room.guest_id = user_id;
    if host_ready and guest_ready then
      update public.game_rooms set board = array_fill(null::text,array[9]), current_turn = 'X',
        current_round = 1, host_score = 0, guest_score = 0, status = 'in_progress',
        series_number = series_number + 1, host_replay_ready = false, guest_replay_ready = false,
        round_finished = false, round_winner = null, round_end_reason = null,
        turn_started_at = clock_timestamp() where id = room.id;
    else
      update public.game_rooms set host_replay_ready = host_ready, guest_replay_ready = guest_ready where id = room.id;
    end if;
    return room.id;
  end if;

  if p_action in ('start','next') then
    if room.host_id <> user_id then raise exception 'Seul l’hôte peut démarrer une manche.'; end if;
    if room.guest_id is null then raise exception 'Un second joueur doit rejoindre la salle.'; end if;
    if p_action = 'start' and room.status <> 'waiting' then raise exception 'La partie a déjà démarré.'; end if;
    if p_action = 'next' and (room.status <> 'in_progress' or not room.round_finished
      or room.current_round >= room.round_count) then raise exception 'Manche suivante indisponible.'; end if;
    update public.game_rooms set status = 'in_progress', board = array_fill(null::text,array[9]),
      current_turn = 'X', current_round = case when p_action = 'next' then current_round + 1 else 1 end,
      round_finished = false, round_winner = null, round_end_reason = null,
      turn_started_at = clock_timestamp() where id = room.id;
    return room.id;
  end if;

  if p_action not in ('move','expire') or p_action is null then raise exception 'Action invalide.'; end if;
  if room.status <> 'in_progress' or room.guest_id is null or room.round_finished then
    raise exception 'Cette manche ne peut pas être jouée.';
  end if;
  if room.turn_started_at is null then raise exception 'Aucun tour actif.'; end if;

  if clock_timestamp() >= room.turn_started_at + make_interval(secs => room.turn_duration) then
    -- Une demande de coup arrivée trop tard entraîne aussi la perte de la manche.
    winner := case room.current_turn when 'X' then 'O' else 'X' end;
    update public.game_rooms set round_finished = true, round_winner = winner,
      round_end_reason = 'timeout', turn_started_at = null,
      host_score = host_score + case when winner = host_symbol then 1 else 0 end,
      guest_score = guest_score + case when winner <> host_symbol then 1 else 0 end,
      status = case when current_round = round_count then 'finished' else status end
      where id = room.id;
    return room.id;
  end if;
  if p_action = 'expire' then return room.id; end if;

  perform public.play_game_room_move(room.id, p_cell);
  select * into room from public.game_rooms where id = room.id;
  winner := public.game_board_winner(room.board);
  over := winner is not null or array_position(room.board,null::text) is null;
  update public.game_rooms set round_finished = over, round_winner = winner,
    round_end_reason = case when winner is not null then 'alignment' when over then 'draw' end,
    turn_started_at = case when over then null else clock_timestamp() end where id = room.id;
  return room.id;
end;
$$;

revoke execute on function public.create_friend_room(uuid,text,smallint,text,smallint) from public, anon;
grant execute on function public.create_friend_room(uuid,text,smallint,text,smallint) to authenticated;
revoke execute on function public.friend_room_action(uuid,text,integer,integer,integer) from public, anon;
grant execute on function public.friend_room_action(uuid,text,integer,integer,integer) to authenticated;
