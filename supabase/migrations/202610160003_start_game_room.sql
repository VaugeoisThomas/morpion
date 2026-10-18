-- Permet à l’hôte de démarrer une salle complète.
create function public.start_game_room(p_room_id uuid)
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

    if selected_room.status <> 'waiting' then
        raise exception 'Cette salle ne peut pas être démarrée.';
    end if;

    if selected_room.guest_id is null then
        raise exception 'Un second joueur doit rejoindre la salle.';
    end if;

    update public.game_rooms
    set status = 'in_progress'
    where id = selected_room.id;

    return selected_room.id;
end;
$$;

-- Réserve l’exécution aux utilisateurs connectés.
revoke execute on function public.start_game_room(uuid)
    from public, anon;

grant execute on function public.start_game_room(uuid)
    to authenticated;