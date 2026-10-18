import { type AvatarId,avatars } from '../data/avatars'
import ProfileAvatar from './ProfileAvatar'

import './ProfilePreview.css'

/** Valeurs utilisées pour afficher l’aperçu du profil. */
interface ProfilePreviewProps {
  /** Pseudo saisi dans le formulaire. */
  username: string

  /** Identifiant de l’avatar sélectionné. */
  selectedAvatar: AvatarId
}

/**
 * Affiche un aperçu du profil à partir des valeurs du formulaire. Utilise le premier avatar du
 * catalogue si l’identifiant est inconnu.
 */
export default function ProfilePreview({
  username,
  selectedAvatar,
}: Readonly<ProfilePreviewProps>) {
  const avatar = avatars.find(({ id }) => id === selectedAvatar) ?? avatars[0]

  return (
    <aside className="profile-preview" aria-label="Aperçu du profil">
      <ProfileAvatar avatarId={avatar.id} size="preview" className="profile-preview__avatar" />
      <h2 className="profile-preview__name">{username.trim() || 'Ton pseudo'}</h2>
      <p className="profile-preview__role">Nouveau joueur</p>
      <div className="profile-preview__tip">
        <span className="profile-preview__tip-mark" aria-hidden="true">i</span>
        <p className="profile-preview__tip-description">Les statistiques apparaîtront après tes premières parties enregistrées.</p>
      </div>
    </aside>
  )
}