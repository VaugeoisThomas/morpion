import { Bot, House, type LucideIcon,Settings, Trophy, UsersRound } from 'lucide-react'

import { paths } from '../routes'

/** Informations nécessaires à l’affichage d’un lien de navigation. */
export interface NavigationItem {
  /** Libellé visible et accessible du lien. */
  label: string
  /** Chemin interne associé au lien. */
  path: string
  /** Icône Lucide rendue à côté du libellé. */
  icon: LucideIcon
}

/** Liens affichés dans la navigation principale, dans leur ordre visuel. */
export const navigationItems = [
  { label: 'Accueil', path: paths.home, icon: House },
  { label: 'Jouer en ligne', path: paths.online, icon: UsersRound },
  { label: "Jouer contre l'ordinateur", path: paths.computer, icon: Bot },
  { label: 'Classement', path: paths.ranking, icon: Trophy },
  { label: 'Paramètres', path: paths.settings, icon: Settings },
] satisfies readonly NavigationItem[]
