import { LogOut } from 'lucide-react'

import Button from '../../../../shared/ui/Button/Button'
import { useProfileRecovery } from '../../hooks/useProfileRecovery'
import AvatarPicker from '../AvatarPicker/AvatarPicker'
import ProfileHeader from '../ProfileHeader/ProfileHeader'
import UsernameField from '../UsernameField/UsernameField'

import type { AvatarId } from '../../data/profile'

interface ProfileMissingProps {
  userId: string
  userEmail: string
  initialUsername: string
  initialAvatar: AvatarId
}


/**
 * Affiche le formulaire de création d’un profil manquant pour un utilisateur déjà connecté.
 * Propose un pseudo et un avatar initialisés à partir des valeurs fournies par la page Profile.
 *
 * @param userId - Identifiant de l’utilisateur auquel associer le profil.
 * @param userEmail - Adresse email affichée pour le compte.
 * @param initialUsername - Pseudo initial proposé dans le formulaire.
 * @param initialAvatar - Avatar initial proposé dans le formulaire.
 */
export default function ProfileMissing({
  userId,
  userEmail,
  initialUsername,
  initialAvatar,
}: Readonly<ProfileMissingProps>) {
  const {
    username,
    setUsername,
    selectedAvatar,
    setSelectedAvatar,
    isSubmitting,
    errorMessage,
    isValidUsername,
    createProfile,
    signOut,
  } = useProfileRecovery({ userId, initialUsername, initialAvatar })

  return (
    <main className="profile">

      <ProfileHeader
        title="Profil indisponible"
        subtitle={`Compte connecté : ${userEmail}`}
      />
      <div className="profile__content profile__content--single">
        <section className="profile__panel" aria-label="Terminer la création du profil">
          <p className="profile__account-email">
            Ton compte est connecté, mais son profil n’existe pas encore dans la base.
          </p>
          <form onSubmit={createProfile}>
            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
            />
            <UsernameField
              id="username"
              value={username}
              onChange={setUsername}
              showHint={false}
            />
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
              {isSubmitting ? 'Création...' : 'Créer mon profil'}
            </Button>
          </form>
          <Button
            className="profile__logout"
            variant="secondary"
            onClick={signOut}>
            <LogOut size={17} aria-hidden="true" />
            <span>Se déconnecter</span>
          </Button>
        </section>
      </div>
    </main>
  )
}