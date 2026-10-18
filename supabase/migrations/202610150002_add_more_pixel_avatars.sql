-- Ajoute trois avatars et conserve tous les identifiants existants.
begin;

alter table public.profiles
  drop constraint if exists profiles_avatar_check;

alter table public.profiles
  add constraint profiles_avatar_check
  check (avatar in (
    'robot', 'cosmo', 'renard', 'ninja', 'alien', 'chat', 'tigre',
    'homme', 'femme', 'dragon'
  ));

commit;
