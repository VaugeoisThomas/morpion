import { useState } from 'react'

import Button from '../../../../shared/ui/Button/Button'
import AuthenticationForm from '../../../auth/components/AuthenticationForm/AuthenticationForm'
import { useAuth } from '../../../auth/hooks/useAuth'
import ProfileMissing from '../../components/ProfileMissing/ProfileMissing'
import ProfileOverview from '../../components/ProfileOverview/ProfileOverview'
import { avatars } from '../../data/profile'

import './Profile.css'


/**
 * Affiche l’écran de profil adapté à l’état d’authentification. Pendant le chargement, affiche un
 * message d’attente.
 */
export default function Profile() {
  const { 
    user, 
    profile,
    profileError,
    isLoading,
    refreshProfile, 
  } = useAuth()

  const [isRetrying, setIsRetrying] = useState(false)

  /**
   * Retente la lecture du profil. Le contexte conserve le message d’erreur si la lecture échoue.
   */
async function retryProfile() {
  if (isRetrying) return

  setIsRetrying(true)

  try {
    await refreshProfile()
  } catch {
    // Le message d’erreur est déjà mis à jour par AuthProvider.
  } finally {
    setIsRetrying(false)
  }
}

  if (isLoading) {
    return (
      <main className="profile">
        <output className="profile__message">Chargement du compte...</output>
      </main>
    )
  }
  if (user && !profile && profileError) {
  return (
    <section className="profile">
      <header className="profile__header">
        <h1 className="profile__title">Profil indisponible</h1>
      </header>

      <p className="profile__message profile__message--error" role="alert">
        {profileError}
      </p>

      <Button
        className="profile__logout"
        variant="secondary" 
        onClick={retryProfile}
        isLoading={isRetrying}
      >
        {isRetrying ? 'Chargement...' : 'Réessayer'}
      </Button>
    </section>
  )
}

  if (user && profile) {
    return (
      <ProfileOverview 
        key={user.id} 
        profile={profile} 
        userId={user.id} 
        email={user.email ?? ''} 
      />
    )
  }

  if (user) {

    /**
     * Pseudo initial du formulaire de création du profil manquant. Utilise les métadonnées du
     * compte si username est une chaîne, sinon une chaîne vide.
     */
    const initialUsername = typeof user.user_metadata.username === 'string'
      ? user.user_metadata.username
      : ''

    /**
     * Avatar initial du formulaire de création du profil manquant. Utilise l’avatar des
     * métadonnées s’il appartient au catalogue, sinon le premier avatar disponible.
     */
    const initialAvatar = avatars.find(({ id }) => id === user.user_metadata.avatar)?.id ?? avatars[0].id

    return (
      <ProfileMissing
        key={user.id}
        userId={user.id}
        userEmail={user.email ?? ''}
        initialUsername={initialUsername}
        initialAvatar={initialAvatar}
      />
    )
  }

  return <AuthenticationForm />
}