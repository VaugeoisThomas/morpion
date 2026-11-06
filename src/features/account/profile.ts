// Ces valeurs correspondent aux contraintes de public.profiles inspectées sur Supabase.
export const avatars = [
  { id: 'robot', label: 'Robot' }, { id: 'cosmo', label: 'Cosmo' },
  { id: 'renard', label: 'Renard' }, { id: 'ninja', label: 'Ninja' },
  { id: 'alien', label: 'Alien' }, { id: 'chat', label: 'Chat' },
  { id: 'tigre', label: 'Tigre' }, { id: 'homme', label: 'Homme' },
  { id: 'femme', label: 'Femme' }, { id: 'dragon', label: 'Dragon' },
] as const

export type AvatarId = typeof avatars[number]['id']
export type Profile = { id: string; username: string; avatar: AvatarId }

export function isValidUsername(username: string) {
  return /^[A-Za-z0-9_]{3,16}$/.test(username)
}

export function isAvatarId(value: string): value is AvatarId {
  return avatars.some(({ id }) => id === value)
}
