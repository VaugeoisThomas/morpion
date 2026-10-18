import { ChevronRight } from 'lucide-react'

import { useAuth } from '../../auth/hooks/useAuth'
import ProfileAvatar from './ProfileAvatar'

import './UserProfileSummary.css'

interface UserProfileSummaryProps {
  /** Affiche une flèche après les informations du profil. */
  showArrow?: boolean
}

/**
 * Affiche un résumé du compte dans les navigations desktop et mobile. Pendant le chargement de
 * l’authentification, affiche un texte d’attente.
 */
export default function UserProfileSummary({ showArrow = false }: Readonly<UserProfileSummaryProps>) {
  const { profile, user, isLoading } = useAuth()

  if (isLoading) {
    return <span className="user-profile-summary__info">Chargement...</span>
  }

  if (!profile) {
    return (
      <div className="user-profile-summary user-profile-summary--empty" aria-live="polite">
        <ProfileAvatar className="user-profile-summary__welcome-avatar" decorative />
        <span className="user-profile-summary__welcome-copy">
          <span className="user-profile-summary__welcome-title">{user ? 'Profil introuvable' : 'Bienvenue !'}</span>
          <span className="user-profile-summary__welcome-subtitle">
            {user ? 'Vérifie la création de ton profil' : 'Ton profil t\'attend'}
          </span>
        </span>
      </div>
    )
  }

 /**
  * Identifiant de l’avatar du profil affiché par le composant commun, avec un repli sur le robot
  * si l’identifiant est inconnu.
  */
  const avatarId = profile.avatar

  return (
    <div className="user-profile-summary">
      <ProfileAvatar avatarId={avatarId} className="user-profile-summary__avatar" decorative />
      <span className="user-profile-summary__info">
        <span className="user-profile-summary__username">{profile.username}</span>
        <span className="user-profile-summary__status">
          <span className="user-profile-summary__status-dot" aria-hidden="true" />
          <span>{profile.status}</span>
        </span>
      </span>
      {showArrow && <ChevronRight className="user-profile-summary__arrow" size={18} aria-hidden="true" />}
    </div>
  )
}
