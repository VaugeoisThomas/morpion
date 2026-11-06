export type Page = 'home' | 'computer' | 'account' | 'create' | 'join' | 'room'
export type Route = { page: Page; id: string; code: string }
const roomId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function readRoute(hash: string): Route {
  const [path, parameter = ''] = hash.replace(/^#\//, '').split('/')
  const route: Route = { page: 'home', id: '', code: '' }
  if (path === 'ordinateur') route.page = 'computer'
  if (path === 'compte') route.page = 'account'
  if (path === 'creer') route.page = 'create'
  if (path === 'rejoindre') { route.page = 'join'; route.code = parameter }
  if (path === 'salle' && roomId.test(parameter)) { route.page = 'room'; route.id = parameter }
  return route
}

export function consumeReturnRoute() {
  try {
    const hash = sessionStorage.getItem('morpion:returnTo')
    sessionStorage.removeItem('morpion:returnTo')
    if (hash && ['create', 'join', 'room'].includes(readRoute(hash).page)) return hash
  } catch { /* Le stockage peut être désactivé. */ }
  return null
}
