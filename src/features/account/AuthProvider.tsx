import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '../../lib/supabase'
import { AuthContext } from './AuthContext'
import type { AuthState } from './AuthContext'
import { getAuthCallbackMessage } from './authUrls'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => ({
    session: null,
    loading: supabase !== null,
    error: getAuthCallbackMessage(window.location.href),
  }))

  useEffect(() => {
    if (!supabase) return
    let active = true
    let eventReceived = false
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return
      eventReceived = true
      setAuth((previous) => ({ session, loading: false, error: session ? null : previous.error }))
    })
    // Aucun appel Supabase asynchrone dans le callback d'authentification.
    void supabase.auth.getSession().then(({ data, error }) => {
      if (!active || eventReceived) return
      setAuth((previous) => ({
        session: data.session, loading: false,
        error: error ? 'Impossible de rétablir la connexion. Connecte-toi à nouveau.' : previous.error,
      }))
    }).catch(() => {
      if (active) setAuth({ session: null, loading: false, error: 'Connexion indisponible. Vérifie ton réseau et réessaie.' })
    })
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}
