import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { avatars, isAvatarId, isValidUsername } from './profile'
import type { AvatarId, Profile } from './profile'

export default function ProfileEditor({ userId }: { userId: string }) {
  const [state, setState] = useState<{ loading: boolean; error: boolean; profile: Profile | null }>({
    loading: true, error: false, profile: null,
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!supabase) return
    const controller = new AbortController()
    async function load() {
      try {
        const { data, error } = await supabase!.from('profiles')
          .select('id, username, avatar').eq('id', userId)
          .abortSignal(controller.signal).maybeSingle()
        if (!controller.signal.aborted) {
          setState({ loading: false, error: Boolean(error), profile: error ? null : data })
        }
      } catch {
        if (!controller.signal.aborted) setState({ loading: false, error: true, profile: null })
      }
    }
    void load()
    return () => controller.abort()
  }, [userId, attempt])

  if (state.loading) return <p role="status">Chargement du profil…</p>
  if (state.error) return <>
    <p className="account-error" role="alert">Impossible de charger ton profil.</p>
    <button type="button" className="primary-button" onClick={() => {
      setState({ loading: true, error: false, profile: null })
      setAttempt((value) => value + 1)
    }}>Réessayer</button>
  </>
  return <ProfileForm userId={userId} initialProfile={state.profile} />
}

function ProfileForm({ userId, initialProfile }: { userId: string; initialProfile: Profile | null }) {
  const [username, setUsername] = useState(initialProfile?.username ?? '')
  const [avatar, setAvatar] = useState<AvatarId>(initialProfile?.avatar ?? 'robot')
  const [exists, setExists] = useState(initialProfile !== null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null)

  async function save(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!supabase || busy) return
    const trimmed = username.trim()
    if (!isValidUsername(trimmed) || !isAvatarId(avatar)) {
      setMessage({ error: true, text: 'Choisis un pseudo de 3 à 16 lettres, chiffres ou caractères _.' })
      return
    }
    setBusy(true)
    setMessage(null)
    try {
      // L'identifiant vient de la session ; les politiques RLS imposent aussi auth.uid() = id.
      const query = exists
        ? supabase.from('profiles').update({ username: trimmed, avatar }).eq('id', userId)
        : supabase.from('profiles').insert({ id: userId, username: trimmed, avatar })
      const { error } = await query.select('id').single()
      if (error?.code === '23505') {
        setMessage({ error: true, text: 'Ce pseudo est déjà utilisé. Choisis-en un autre.' })
        return
      }
      if (error) throw error
      setExists(true)
      setUsername(trimmed)
      setMessage({ error: false, text: 'Ton profil a été enregistré.' })
    } catch {
      setMessage({ error: true, text: 'Enregistrement impossible. Vérifie ton réseau puis réessaie.' })
    } finally { setBusy(false) }
  }

  return <form className="profile-form" onSubmit={(event) => void save(event)}>
    <h2>{exists ? 'Ton profil joueur' : 'Complète ton profil joueur'}</h2>
    <label htmlFor="profile-username">Pseudo</label>
    <input id="profile-username" autoComplete="nickname" required minLength={3} maxLength={16}
      pattern="[A-Za-z0-9_]{3,16}" aria-describedby="profile-username-help" value={username}
      disabled={busy} onChange={(event) => { setUsername(event.target.value); setMessage(null) }} />
    <small id="profile-username-help">3 à 16 lettres sans accent, chiffres ou caractères _. Visible par les joueurs connectés.</small>
    <fieldset disabled={busy} className="avatar-picker">
      <legend>Choisis ton avatar</legend>
      <div className="avatar-options">
        {avatars.map(({ id, label }) => <label key={id} className="avatar-option">
          <input type="radio" name="avatar" value={id} checked={avatar === id}
            onChange={() => { setAvatar(id); setMessage(null) }} />
          <img src={`/avatars/${id}.svg`} alt="" width="48" height="48" />
          <span>{label}</span>
        </label>)}
      </div>
    </fieldset>
    <button type="submit" className="primary-button" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer mon profil'}</button>
    {message && <p className={message.error ? 'account-error' : 'account-success'} role={message.error ? 'alert' : 'status'}>{message.text}</p>}
  </form>
}
