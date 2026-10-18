import Button from '../../../shared/ui/Button/Button'
import AvatarPicker from '../../profile/components/AvatarPicker'
import ProfileHeader from '../../profile/components/ProfileHeader'
import ProfilePreview from '../../profile/components/ProfilePreview'
import UsernameField from '../../profile/components/UsernameField'
import { useAuthenticationForm } from '../hooks/useAuthenticationForm'

/**
 * Affiche le formulaire d’inscription ou de connexion. Utilise useAuthenticationForm pour gérer
 * les champs, la soumission et les messages de succès ou d’erreur.
 */

export default function AuthenticationForm() {
  const { mode, email, setEmail, password, setPassword, username, setUsername, selectedAvatar, setSelectedAvatar, isSubmitting, message, errorMessage, isValidUsername, submitLabel, handleSubmit, switchMode } = useAuthenticationForm()

  return (
    <main className="profile">
      <ProfileHeader
        title={mode === 'signup' ? 'Crée ton profil' : 'Connexion'}
        subtitle={mode === 'signup'
          ? 'Choisis un pseudo et un avatar pour commencer.'
          : 'Connecte-toi pour retrouver ton profil.'}
      />
      <div className="profile__content">
        <section className="profile__panel" aria-label={mode === 'signup' ? 'Créer un compte' : 'Se connecter'}>
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <AvatarPicker 
                  selectedAvatar={selectedAvatar} 
                  onSelect={setSelectedAvatar} />
                <UsernameField 
                  id="username"
                  value={username}
                  onChange={setUsername}
                  placeholder='Entre ton pseudo'
                />
              </>
            )}

            <div className="profile__field">
              <label className="profile__label" htmlFor="email">Adresse email</label>
              <input
                id="email"
                className="profile__input profile__input--standalone"
                type="email"
                value={email}
                autoComplete="email"
                placeholder="nom@exemple.com"
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="profile__field">
              <label className="profile__label" htmlFor="password">Mot de passe</label>
              <input
                id="password"
                className="profile__input profile__input--standalone"
                type="password"
                value={password}
                minLength={8}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="8 caractères minimum"
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {message && <output className="profile__message">{message}</output>}
            {errorMessage && <p className="profile__message profile__message--error" role="alert">{errorMessage}</p>}

            <Button
              type="submit"
              className="profile__submit"
              isLoading={isSubmitting}
              disabled={mode === 'signup' && !isValidUsername}
            >
              {submitLabel}
              {!isSubmitting && <span aria-hidden="true"> →</span>}
            </Button>
            {mode === 'signup' && !isValidUsername && (
              <p className="profile__hint">Choisis un pseudo valide pour continuer.</p>
            )}
            <Button 
            className="profile__mode-toggle" 
            variant="text" 
            onClick={switchMode}>
              {mode === 'signup' 
                ? 'Déjà un compte ? Connecte-toi' 
                : 'Pas encore de compte ? Crée ton profil'
              }
            </Button>
          </form>
        </section>
        {mode === 'signup' && <ProfilePreview username={username} selectedAvatar={selectedAvatar} />}
      </div>
    </main>
  )
}