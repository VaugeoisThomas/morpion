-- Historique récupéré de supabase_migrations.schema_migrations le 6 novembre 2026.
-- Migration déjà appliquée sur maxvfzqcfglvulcmyrnz ; ne pas la rejouer sur ce projet.

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
