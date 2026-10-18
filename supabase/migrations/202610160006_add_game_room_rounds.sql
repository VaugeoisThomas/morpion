-- Ajoute le numéro de manche et les scores des deux joueurs.
alter table public.game_rooms
    add column current_round smallint not null default 1,
    add column host_score smallint not null default 0,
    add column guest_score smallint not null default 0;

-- Le numéro de manche reste dans les limites choisies.
alter table public.game_rooms
    add constraint game_rooms_valid_current_round
        check (current_round between 1 and round_count);

-- Chaque victoire rapporte un point à un seul joueur.
alter table public.game_rooms
    add constraint game_rooms_valid_scores
        check (
            host_score >= 0
            and guest_score >= 0
            and host_score + guest_score <= current_round
        );

-- Enregistre un coup et compte le résultat lorsque la manche se termine.
create or replace function public.play_game_room_move(
    p_room_id uuid,
    p_cell_index integer
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    selected_room public.game_rooms%rowtype;
    player_symbol text;
    next_board text[];
    next_turn text;
    round_winner text;
    round_is_over boolean;
    next_host_score smallint;
    next_guest_score smallint;
    next_status text;
begin
    if current_user_id is null then
        raise exception 'Connexion requise.';
    end if;

    if p_cell_index is null
        or p_cell_index < 0
        or p_cell_index > 8 then
        raise exception 'Case invalide.';
    end if;

    select *
    into selected_room
    from public.game_rooms
    where id = p_room_id
        and (
            host_id = current_user_id
            or guest_id = current_user_id
        )
    for update;

    if not found then
        raise exception 'Salle introuvable ou accès refusé.';
    end if;

    if selected_room.status <> 'in_progress'
        or selected_room.guest_id is null then
        raise exception 'La partie ne peut pas être jouée.';
    end if;

    if public.game_board_winner(selected_room.board) is not null
        or array_position(selected_room.board, null::text) is null then
        raise exception 'Cette manche est terminée.';
    end if;

    if selected_room.host_id = current_user_id then
        player_symbol := selected_room.host_symbol;
    else
        player_symbol := case selected_room.host_symbol
            when 'X' then 'O'
            else 'X'
        end;
    end if;

    if selected_room.current_turn <> player_symbol then
        raise exception 'Ce n’est pas ton tour.';
    end if;

    if selected_room.board[p_cell_index + 1] is not null then
        raise exception 'Cette case est déjà occupée.';
    end if;

    next_board := selected_room.board;
    next_board[p_cell_index + 1] := player_symbol;

    -- Calcule le résultat après le nouveau coup.
    round_winner := public.game_board_winner(next_board);
    round_is_over := round_winner is not null
        or array_position(next_board, null::text) is null;

    -- Une victoire rapporte un point ; un match nul aucun.
    next_host_score := selected_room.host_score;
    next_guest_score := selected_room.guest_score;

    if round_winner is not null then
        if round_winner = selected_room.host_symbol then
            next_host_score := next_host_score + 1;
        else
            next_guest_score := next_guest_score + 1;
        end if;
    end if;

    -- La partie se termine après toutes les manches prévues.
    next_status := selected_room.status;

    if round_is_over
        and selected_room.current_round = selected_room.round_count then
        next_status := 'finished';
    end if;

    next_turn := case player_symbol
        when 'X' then 'O'
        else 'X'
    end;

    update public.game_rooms
    set board = next_board,
        current_turn = next_turn,
        host_score = next_host_score,
        guest_score = next_guest_score,
        status = next_status
    where id = selected_room.id;

    return selected_room.id;
end;
$$;

-- Conserve explicitement les permissions de la fonction de jeu.
revoke execute on function public.play_game_room_move(uuid, integer)
    from public, anon;

grant execute on function public.play_game_room_move(uuid, integer)
    to authenticated;

-- Récupère le résultat des manches terminées avant cette migration.
-- Ces salles ne possédaient jusque-là qu’un seul plateau.
with completed_rooms as (
    select
        id,
        public.game_board_winner(board) as winner
    from public.game_rooms
    where status = 'in_progress'
        and (
            public.game_board_winner(board) is not null
            or array_position(board, null::text) is null
        )
)
update public.game_rooms as room
set host_score = case
        when completed.winner = room.host_symbol then 1
        else 0
    end,
    guest_score = case
        when completed.winner is not null
            and completed.winner <> room.host_symbol then 1
        else 0
    end,
    status = case
        when room.round_count = 1 then 'finished'
        else room.status
    end
from completed_rooms as completed
where room.id = completed.id;

-- Permet à l’hôte de lancer la manche suivante.
create function public.start_next_game_room_round(p_room_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
    current_user_id uuid := auth.uid();
    selected_room public.game_rooms%rowtype;
begin
    if current_user_id is null then
        raise exception 'Connexion requise.';
    end if;

    select *
    into selected_room
    from public.game_rooms
    where id = p_room_id
        and host_id = current_user_id
    for update;

    if not found then
        raise exception 'Salle introuvable ou accès refusé.';
    end if;

    if selected_room.status <> 'in_progress'
        or selected_room.guest_id is null then
        raise exception 'La partie ne peut pas continuer.';
    end if;

    if selected_room.current_round >= selected_room.round_count then
        raise exception 'Toutes les manches ont été jouées.';
    end if;

    if public.game_board_winner(selected_room.board) is null
        and array_position(selected_room.board, null::text) is not null then
        raise exception 'La manche actuelle n’est pas terminée.';
    end if;

    -- Conserve les scores et prépare un nouveau plateau.
    -- X commence chaque manche.
    update public.game_rooms
    set board = array_fill(null::text, array[9]),
        current_turn = 'X',
        current_round = selected_room.current_round + 1
    where id = selected_room.id;

    return selected_room.id;
end;
$$;

-- Réserve la demande de manche suivante aux comptes connectés.
-- La fonction vérifie ensuite que le compte est celui de l’hôte.
revoke execute on function public.start_next_game_room_round(uuid)
    from public, anon;

grant execute on function public.start_next_game_room_round(uuid)
    to authenticated;