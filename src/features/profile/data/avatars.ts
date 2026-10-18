/** Catalogue d’avatars. Les identifiants doivent correspondre aux valeurs autorisées en base. */

export const avatars = [
  { id: 'robot', label: 'Robot', src: '/avatars/robot.svg' },
  { id: 'cosmo', label: 'Cosmo', src: '/avatars/cosmo.svg' },
  { id: 'renard', label: 'Renard', src: '/avatars/renard.svg' },
  { id: 'ninja', label: 'Ninja', src: '/avatars/ninja.svg' },
  { id: 'alien', label: 'Alien', src: '/avatars/alien.svg' },
  { id: 'chat', label: 'Chat', src: '/avatars/chat.svg' },
  { id: 'tigre', label: 'Tigre', src: '/avatars/tigre.svg' },
  { id: 'homme', label: 'Homme', src: '/avatars/homme.svg' },
  { id: 'femme', label: 'Femme', src: '/avatars/femme.svg' },
  { id: 'dragon', label: 'Dragon', src: '/avatars/dragon.svg' },
] as const


/**
 * Identifiant d'un avatar appartenant au catalogue de l'application. Déduit des entrées de
 * avatars[] pour conserver les mêmes valeurs dans le catalogue et le type.
 */
export type AvatarId = (typeof avatars)[number]['id']


