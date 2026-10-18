/**
 * Chemins utilisés par le router et les liens de navigation Centralise les URL pour éviter de les
 * répéter dans les composants. Le chemin room contient le paramètre dynamique :roomId, Le chemin
 * notFound correspond aux URL sans routes associée.
 */

export const paths = {
  home: '/',
  online: '/online',
  computer: '/computer',
  ranking: '/ranking',
  settings: '/settings',
  createGame: '/new',
  joinGame: '/play',
  room: '/room/:roomId',
  profile: '/profile',
  notFound: '*',
} as const
