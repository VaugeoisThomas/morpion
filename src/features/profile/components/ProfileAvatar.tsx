import { avatars } from '../data/avatars'

import './ProfileAvatar.css'

interface ProfileAvatarProps {
  /** Identifiant du catalogue ; un identifiant inconnu utilise le robot. */
  avatarId?: string | null
  /** Taille de base ; la page peut adapter les dimensions avec une classe. */
  size?: 'small' | 'medium' | 'large' | 'preview'
  /** Désactive le halo pour les avatars non sélectionnés de la galerie. */
  muted?: boolean
  /** Masque l’avatar lorsque le nom du joueur ou le choix le décrit déjà. */
  decorative?: boolean
  /** Classe supplémentaire pour le placement et les dimensions. */
  className?: string
}

/** Affiche un avatar pixel art du catalogue avec son cadre et un repli sur le robot. */
export default function ProfileAvatar({
  avatarId,
  size = 'medium',
  muted = false,
  decorative = false,
  className = '',
}: Readonly<ProfileAvatarProps>) {
  const avatar = avatars.find(({ id }) => id === avatarId) ?? avatars[0]
  const classes = [
    'profile-avatar',
    'profile-avatar--' + size,
    muted && 'profile-avatar--muted',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : avatar.label}
      aria-hidden={decorative ? true : undefined}
    >
      <img className="profile-avatar__image" src={avatar.src} alt="" draggable={false} />
    </span>
  )
}
