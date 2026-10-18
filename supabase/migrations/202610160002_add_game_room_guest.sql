-- Ajoute le second joueur, facultatif tant que la salle attend.

alter table public.game_rooms
    add column guest_id uuid
        references auth.users (id)
        on delete set null;
    
--Empêche un même compte d'occuper les deux places.

alter table public.game_rooms
    add constraint game_rooms_distinct_players
        check (guest_id is null or guest_id <> host_id);

-- Autorise le second joueur à consulter la salle qu'il a rejointe.

create policy "Guest can read their own game rooms"
    on public.game_rooms
    for select
    to authenticated
    using ((select auth.uid()) = guest_id);


-- Attribue la seconde place à l'utilisateur connecté.

create function public.join_game_room(p_invite_code text)
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
        where invite_code = upper(trim(p_invite_code))
        for update;

        if not found then
            raise exception 'Salle introuvable.';
        end if;
        -- Un participant peut retrouver sa salle sans reprendre une place.
    if selected_room.host_id = current_user_id
        or selected_room.guest_id = current_user_id then
        return selected_room.id;
    end if;

    if selected_room.status <> 'waiting' then
        raise exception 'Cette salle ne peut plus être rejointe.';
    end if;

    if selected_room.guest_id is not null then
        raise exception 'Cette salle est complète.';
    end if;

    update public.game_rooms
    set guest_id = current_user_id
    where id = selected_room.id;

    return selected_room.id;
end;
$$;

-- Réserve l’exécution aux utilisateurs connectés.
revoke execute on function public.join_game_room(text)
    from public, anon;

grant execute on function public.join_game_room(text)
    to authenticated;