-- Active les évènements RealTime pour les salles de jeu.

do $$
begin
    if not exists (
        select 1
        from pg_publication_tables
        where pubname = 'supabase_realtime'
            and schemaname = 'public'
            and tablename = 'game_rooms'
    ) then
    alter publication supabase_realtime
        add table public.game_rooms;
    end if;
end;
$$;