export type Page = 'home' | 'computer' | 'account' | 'create' | 'join' | 'room'
export type Route = { page: Page; id: string; code: string }
const roomId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function readRoute(hash: string): Route {
  const [path, parameter = ''] = hash.split('?')[0].replace(/^#\//, '').split('/')
  const route: Route = { page: 'home', id: '', code: '' }
  if (path === 'ordinateur') route.page = 'computer'
  if (path === 'compte') route.page = 'account'
  if (path === 'creer') route.page = 'create'
  if (path === 'rejoindre') { route.page = 'join'; route.code = parameter }
  if (path === 'salle' && roomId.test(parameter)) { route.page = 'room'; route.id = parameter }
  return route
}

// Retour limité aux routes internes attendues, sans conserver une URL brute en stockage.
export function accountLink(route: Route) {
  if (route.page === 'create') return '#/compte?retour=creer'
  if (route.page === 'join' && /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(route.code)) {
    return `#/compte?retour=rejoindre&code=${route.code}`
  }
  if (route.page === 'room' && roomId.test(route.id)) return `#/compte?retour=salle&id=${route.id}`
  return '#/compte'
}

export function accountReturnRoute(hash: string) {
  if (readRoute(hash).page !== 'account') return null
  const query = new URLSearchParams(hash.split('?')[1] ?? '')
  const target = query.get('retour')
  if (target === 'creer') return '#/creer'
  const code = query.get('code') ?? ''
  if (target === 'rejoindre' && /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return `#/rejoindre/${code}`
  const id = query.get('id') ?? ''
  if (target === 'salle' && roomId.test(id)) return `#/salle/${id}`
  return null
}
