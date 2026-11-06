-- Historique récupéré de supabase_migrations.schema_migrations le 6 novembre 2026.
-- Migration déjà appliquée sur maxvfzqcfglvulcmyrnz ; ne pas la rejouer sur ce projet.

-- Autorise le nouvel avatar sans modifier les choix des profils existants.
begin;

alter table public.profiles
  drop constraint if exists profiles_avatar_check;

alter table public.profiles
  add constraint profiles_avatar_check
  check (avatar in ('robot', 'cosmo', 'renard', 'ninja', 'alien', 'chat', 'tigre'));

commit;
