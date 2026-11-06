-- Historique récupéré de supabase_migrations.schema_migrations le 6 novembre 2026.
-- Migration déjà appliquée sur maxvfzqcfglvulcmyrnz ; ne pas la rejouer sur ce projet.

create or replace function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, avatar)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'avatar', 'robot')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;

create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.create_profile_for_new_user();
