import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { supabase } from '../../../shared/lib/supabase'
import { loadProfile } from '../../profile/data/profile'
import { AuthContext, type AuthState } from './auth-context'

import type { User } from '@supabase/supabase-js'

/**
 * Fournit l’état d’authentification aux composants enfants. Seule la dernière demande de profil
 * peut modifier le contexte.
 */
export function AuthProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    profileError: null,
    isLoading: true,
  })

  /** Numéro partagé par les synchronisations et les rechargements. */
  const latestRequestId = useRef(0)

  /** Indique si le provider peut encore recevoir des mises à jour. */
  const isActive = useRef(false)

  useEffect(() => {
    let isMounted = true
    let hasReceivedAuthEvent = false
    const pendingTimers = new Set<number>()

    isActive.current = true

    /**
     * Applique la session et programme la lecture du profil. Invalide immédiatement les anciennes
     * requêtes.
     */
    function syncUser(user: User | null) {
      if (!isMounted) return

      const requestId = ++latestRequestId.current

      setAuthState({
        user,
        profile: null,
        profileError: null,
        isLoading: user !== null,
      })

      if (!user) return

      function canUpdateState() {
        return isMounted && requestId === latestRequestId.current
      }

      const timerId = window.setTimeout(() => {
        pendingTimers.delete(timerId)

        if (!canUpdateState()) return

        void loadProfile(user.id)
          .then((profile) => {
            if (canUpdateState()) {
              setAuthState({
                user,
                profile,
                profileError: null,
                isLoading: false,
              })
            }
          })
          .catch(() => {
            if (canUpdateState()) {
              setAuthState({
                user,
                profile: null,
                profileError: "Impossible de charger ton profil. Réessaie.",
                isLoading: false,
              })
            }
          })
      }, 0)

      pendingTimers.add(timerId)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return

      hasReceivedAuthEvent = true
      syncUser(session?.user ?? null)
    })

    /**
     * Récupère la session initiale uniquement si aucun événement d’authentification plus récent
     * n’a déjà été reçu.
     */
    void supabase.auth.getSession()
      .then(({ data, error }) => {
        if (!isMounted || hasReceivedAuthEvent) return

        syncUser(error ? null : data.session?.user ?? null)
      })
      .catch(() => {
        if (isMounted && !hasReceivedAuthEvent) {
          syncUser(null)
        }
      })

    return () => {
      isMounted = false
      isActive.current = false
      latestRequestId.current += 1

      subscription.unsubscribe()
      pendingTimers.forEach((timerId) => {
        window.clearTimeout(timerId)
      })
    }
  }, [])

  /**
   * Recharge le profil de l’utilisateur connecté. Ignore le résultat si une nouvelle demande ou un
   * changement de session survient pendant la lecture.
   *
   * @throws Si la lecture du profil échoue.
   */
  const refreshProfile = useCallback(async () => {
    const user = authState.user

    if (!user || !isActive.current) return

    const requestId = ++latestRequestId.current

    function canUpdateState() {
      return isActive.current && requestId === latestRequestId.current
    }

    try {
      const profile = await loadProfile(user.id)

      if (canUpdateState()) {
        setAuthState({
          user,
          profile,
          profileError: null,
          isLoading: false,
        })
      }
    } catch (error) {
      if (canUpdateState()) {
        setAuthState((current) => ({
          ...current,
          profileError: 'Impossible de charger ton profil. Réessaie.',
          isLoading: false,
        }))
      }

      throw error
    }
  }, [authState.user])

  const contextValue = useMemo(
    () => ({ ...authState, refreshProfile }),
    [authState, refreshProfile],
  )

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}