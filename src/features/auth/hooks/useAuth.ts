import { useContext } from 'react'

import { AuthContext } from '../context/auth-context'

/**
 * Donnes l'accès à l'état d'autentification et au rechargement du profil. Doit être appelé dans un
 * composant ou un hook placé sous AuthProvider.
 *
 * @returns La valeur actuelle du contexte d'autentification.
 * @throws Si le hook est utilisé en dehors d'AuthProvider.
 */

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) throw new Error('useAuth must be used inside AuthProvider.')

  return auth
}