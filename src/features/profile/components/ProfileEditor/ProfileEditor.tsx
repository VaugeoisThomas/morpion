import { LogOut } from 'lucide-react'

import Button from '../../../../shared/ui/Button/Button'
import { useProfileEditor } from '../../hooks/useProfileEditor'
import AvatarPicker from '../AvatarPicker/AvatarPicker'
import ProfileHeader from '../ProfileHeader/ProfileHeader'
import UsernameField from '../UsernameField/UsernameField'

import type { SavedProfile } from '../../data/profile'

interface ProfileEditorProps {
  profile: SavedProfile
  userId: string
  email: string
}

/**
 * Affiche le formulaire de modification du profil connecté. Permet de modifier le pseudo et
 * l’avatar, affiche l’adresse email et propose la déconnexion.
 *
 * @param profile - Profil utilisé pour initialiser les champs.
 * @param userId - Identifiant de l’utilisateur dont le profil est modifié.
 * @param email - Adresse email affichée pour le compte.
 */
export default function ProfileEditor({
  profile,
  userId,
  email,
}: Readonly<ProfileEditorProps>) {
  const {
    username,
    setUsername,
    selectedAvatar,
    setSelectedAvatar,
    message,
    errorMessage,
    isSubmitting,
    isValidUsername,
    handleSubmit,
    handleSignOut,
  } = useProfileEditor({ profile, userId })

  return (
    <section className="profile">
      <ProfileHeader title="Mon profil" subtitle="Ton profil est associé à ton compte." />
      <div className="profile__content profile__content--single">
        <section className="profile__panel" aria-label="Modifier mon profil">
          <p className="profile__account-email">Connecté avec {email}</p>
          <form onSubmit={handleSubmit}>
            <AvatarPicker selectedAvatar={selectedAvatar} onSelect={setSelectedAvatar} />
            <UsernameField
              id="username"
              value={username}
              onChange={setUsername}
            />
            {message && <output className="profile__message">{message}</output>}
            {errorMessage && (
              <p className="profile__message profile__message--error" role="alert">
                {errorMessage}
              </p>
            )}
            <Button
              className="profile__submit"
              type="submit"
              isLoading={isSubmitting}
              disabled={!isValidUsername}
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer le profil'}
            </Button>
          </form>
          <Button 
            className="profile__logout" 
            variant="secondary" 
            onClick={handleSignOut}>
              <LogOut size={17} aria-hidden="true" />
              <span>Se déconnecter</span>
          </Button>
        </section>
      </div>
    </section>
  )
}