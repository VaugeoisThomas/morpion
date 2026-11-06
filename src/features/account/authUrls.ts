import { accountLink, accountReturnRoute, readRoute } from '../../navigation.ts'

/** Ne jamais réutiliser un ancien code ou jeton dans l'URL du prochain e-mail. */
export function getAuthRedirectUrl(currentUrl: string): string {
  const url = new URL(currentUrl)
  url.search = ''
  const pendingRoute = accountReturnRoute(url.hash)
  url.hash = pendingRoute ? accountLink(readRoute(pendingRoute)) : '/compte'
  return url.toString()
}

export function getAuthCallbackMessage(currentUrl: string): string | null {
  const url = new URL(currentUrl)
  const query = url.searchParams
  const fragment = new URLSearchParams(url.hash.slice(1))
  const code = query.get('error_code') ?? fragment.get('error_code')
  const error = query.get('error') ?? fragment.get('error')
  if (!code && !error) return null
  return code === 'otp_expired'
    ? 'Ce lien a expiré ou a déjà été utilisé. Connecte-toi si ton compte est confirmé ; sinon, renvoie la confirmation depuis « Créer un compte ».'
    : 'La confirmation n’a pas abouti. Réessaie depuis « Créer un compte » ou connecte-toi si ton adresse est déjà confirmée.'
}
