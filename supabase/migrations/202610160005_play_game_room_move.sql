-- Recherche un alignement gagnant sur le plateau.
create function public.game_board_winner(p_board text[])
returns text
language sql
immutable
strict
set search_path = ''
as $$
    select p_board[line.a]
    from (
        values
            (1, 2, 3),
            (4, 5, 6),
            (7, 8, 9),
            (1, 4, 7),
            (2, 5, 8),
            (3, 6, 9),
            (1, 5, 9),
            (3, 5, 7)
    ) as line(a, b, c)
    where p_board[line.a] is not null
        and p_board[line.a] = p_board[line.b]
        and p_board[line.a] = p_board[line.c]
    limit 1;
$$;

-- Cette fonction sera utilisée par la fonction SQL qui joue un coup.
revoke execute on function public.game_board_winner(text[])
    from public, anon, authenticated;

    -- Vérifie et enregistre un coup pour le joueur connecté.
create function public.play_game_room_move(
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

    next_turn := case player_symbol
        when 'X' then 'O'
        else 'X'
    end;

    update public.game_rooms
    set board = next_board,
        current_turn = next_turn
    where id = selected_room.id;

    return selected_room.id;
end;
$$;

-- Autorise les comptes connectés à demander un coup.
revoke execute on function public.play_game_room_move(uuid, integer)
    from public, anon;

grant execute on function public.play_game_room_move(uuid, integer)
    to authenticated;