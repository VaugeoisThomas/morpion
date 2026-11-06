import { useEffect, useRef, useState } from 'react'
import type { SubmitEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from './AuthContext'
import { getAuthRedirectUrl } from './authUrls'
import ProfileEditor from './ProfileEditor'
import { isValidUsername } from './profile'
import { authenticate } from './authenticate'
import './AccountPage.css'

export default function AccountPage() {
  const { session, loading, error: sessionError } = useAuth()
  const [email, setEmail] = useState('')
  const [creatingAccount, setCreatingAccount] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const emailInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cooldown === 0) return
    const timer = window.setTimeout(() => setCooldown((remaining) => Math.max(0, remaining - 1)), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  async function submitCredentials(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || busy || (creatingAccount && cooldown > 0)) return
    if (creatingAccount && !isValidUsername(username.trim())) {
      setError('Choisis un pseudo de 3 à 16 lettres, chiffres ou caractères _.')
      return
    }
    if (creatingAccount && password !== confirmation) {
      setError('Les deux mots de passe doivent être identiques.')
      return
    }
    setBusy(true)
    setError(null)
    setSent(false)
    try {
      const { data, error } = await authenticate(supabase.auth, { email, password }, creatingAccount
        ? { username, redirectUrl: getAuthRedirectUrl(window.location.href) } : undefined)
      if (error) {
        setError(error.status === 429 ? 'Trop de demandes. Patiente un peu avant de réessayer.'
          : creatingAccount ? 'Création impossible. Vérifie les champs et les exigences du mot de passe.'
          : error.code === 'email_not_confirmed' ? 'Confirme ton adresse avec l’e-mail reçu à la création du compte.'
          : 'Connexion impossible. Vérifie ton adresse e-mail et ton mot de passe.')
      } else {
        setPassword('')
        setConfirmation('')
        if (creatingAccount && !data.session) {
          setSent(true)
          setCooldown(60)
        }
      }
    } catch {
      setError('Connexion au serveur impossible. Vérifie ton réseau et réessaie.')
    } finally { setBusy(false) }
  }

  async function signOut() {
    if (!supabase || busy) return
    setBusy(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      if (error) setError('La déconnexion a échoué. Réessaie.')
    } catch { setError('La déconnexion a échoué. Vérifie ton réseau et réessaie.') }
    finally { setBusy(false) }
  }

  async function resendConfirmation() {
    if (!supabase || !creatingAccount || busy || cooldown > 0) return
    if (!emailInput.current?.reportValidity()) return
    setBusy(true)
    setError(null)
    setSent(false)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup', email: email.trim(),
        options: { emailRedirectTo: getAuthRedirectUrl(window.location.href) },
      })
      if (error) {
        setError(error.status === 429 ? 'Trop de demandes. Patiente avant de réessayer.'
          : 'La confirmation n’a pas pu être renvoyée. Vérifie ton adresse et réessaie.')
      } else {
        setSent(true)
        setCooldown(60)
      }
    } catch {
      setError('Envoi impossible. Vérifie ton réseau et réessaie.')
    } finally { setBusy(false) }
  }

  return <main id="content" className="account-page">
    <a href="#/" className="back-link">← Retour à l’accueil</a>
    <section className="account-card" aria-labelledby="account-title">
      <h1 id="account-title">{session ? 'Mon compte' : creatingAccount ? 'Créer un compte' : 'Se connecter'}</h1>
      {loading ? <p role="status">Vérification de ta connexion…</p> : session ? <>
        <p>Tu es connecté avec <strong>{session.user.email}</strong>.</p>
        <ProfileEditor key={session.user.id} userId={session.user.id} />
        <button type="button" className="primary-button" disabled={busy} onClick={() => void signOut()}>
          {busy ? 'Déconnexion…' : 'Se déconnecter'}
        </button>
      </> : <>
        <p>{creatingAccount ? 'Crée ton compte et confirme ton adresse avec l’e-mail reçu.' : 'Connecte-toi avec ton adresse e-mail et ton mot de passe.'}</p>
        <div className="account-mode" role="group" aria-label="Connexion ou création de compte">
          <button type="button" aria-pressed={!creatingAccount} disabled={busy} onClick={() => { setCreatingAccount(false); setError(null); setSent(false); setPassword(''); setConfirmation('') }}>Se connecter</button>
          <button type="button" aria-pressed={creatingAccount} disabled={busy} onClick={() => { setCreatingAccount(true); setError(null); setSent(false); setPassword(''); setConfirmation('') }}>Créer un compte</button>
        </div>
        <form onSubmit={(event) => void submitCredentials(event)}>
          {creatingAccount && <>
            <label htmlFor="signup-username">Ton pseudo</label>
            <input id="signup-username" autoComplete="nickname" required minLength={3} maxLength={16}
              pattern="[A-Za-z0-9_]{3,16}" aria-describedby="signup-username-help" value={username}
              disabled={busy || !supabase} onChange={(event) => setUsername(event.target.value)} />
            <small id="signup-username-help">3 à 16 lettres sans accent, chiffres ou caractères _. Tu pourras ensuite choisir ton avatar.</small>
          </>}
          <label htmlFor="account-email">Adresse e-mail</label>
          <input ref={emailInput} id="account-email" type="email" autoComplete="email" required maxLength={254}
            value={email} onChange={(event) => { setEmail(event.target.value); setSent(false) }}
            disabled={busy || !supabase} />
          <label htmlFor="account-password">Mot de passe</label>
          <input id="account-password" type="password" autoComplete={creatingAccount ? 'new-password' : 'current-password'}
            required minLength={creatingAccount ? 8 : undefined} aria-describedby={creatingAccount ? 'password-help' : undefined}
            value={password} onChange={(event) => setPassword(event.target.value)} disabled={busy || !supabase} />
          {creatingAccount && <>
            <small id="password-help">Au moins 8 caractères. Utilise un mot de passe unique.</small>
            <label htmlFor="account-password-confirmation">Confirmer le mot de passe</label>
            <input id="account-password-confirmation" type="password" autoComplete="new-password" required minLength={8}
              value={confirmation} onChange={(event) => setConfirmation(event.target.value)} disabled={busy || !supabase} />
          </>}
          <button className="primary-button" type="submit" disabled={busy || (creatingAccount && cooldown > 0) || !supabase}>
            {busy ? (creatingAccount ? 'Création…' : 'Connexion…') : creatingAccount ? (cooldown > 0 ? `Réessayer dans ${cooldown} s` : 'Créer mon compte') : 'Se connecter'}
          </button>
        </form>
        {creatingAccount && <div className="confirmation-actions">
          <p>Déjà inscrit, mais l’e-mail de confirmation est absent ou expiré ? Renseigne ton adresse ci-dessus.</p>
          <button type="button" className="confirmation-resend" disabled={busy || cooldown > 0 || !supabase}
            onClick={() => void resendConfirmation()}>
            {cooldown > 0 ? `Renvoyer dans ${cooldown} s` : 'Renvoyer la confirmation d’inscription'}
          </button>
        </div>}
        {sent && <p className="account-success" role="status">Si cette adresse peut être inscrite, un e-mail de confirmation a été envoyé. Consulte aussi tes courriers indésirables. Ouvre le lien dans ce navigateur pour confirmer ton compte, puis connecte-toi avec ton mot de passe.</p>}
        {!supabase && <p role="status">La connexion est indisponible pour le moment.</p>}
        <p className="account-note">Un compte est nécessaire pour jouer en ligne. Le mode ordinateur reste accessible sans compte.</p>
      </>}
      {(error || (!session && sessionError)) && <p className="account-error" role="alert">{error ?? sessionError}</p>}
    </section>
  </main>
}
