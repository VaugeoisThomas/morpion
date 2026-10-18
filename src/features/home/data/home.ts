import { Bot, CirclePlus, Link as LinkIcon, type LucideIcon,UsersRound } from 'lucide-react'

import { paths } from '../../../app/routes'

/** Variante visuelle utilisée pour colorer un raccourci de jeu. */
export type QuickLinkRole = 'online' | 'computer' | 'new' | 'link'

/**
 * Raccourcis affichés sur la page d’accueil, dans leur ordre visuel. Associe chaque action à un
 * texte, une destination, une icône et une variante de présentation. La présence d’un raccourci ne
 * garantit pas que sa page est déjà fonctionnelle.
 */
export interface QuickLinkItem {
  /** Libellé principal du raccourci. */
  label: string
  /** Courte explication affichée sur les écrans larges. */
  description: string
  /** Destination interne ouverte par le raccourci. */
  to: string
  /** Icône Lucide associée à l’action. */
  icon: LucideIcon
  /** Variante visuelle définie par `QuickLinkRole`. */
  role: QuickLinkRole
}

/** Actions principales proposées sur la page d’accueil. */
export const quickLinks = [
  { label: 'Jouer en ligne', description: 'Affronte des joueurs du monde', to: paths.online, icon: UsersRound, role: 'online' },
  { label: 'Jouer contre l’ordinateur', description: 'Défie l’IA et améliore-toi', to: paths.computer, icon: Bot, role: 'computer' },
  { label: 'Créer une partie', description: 'Invite tes amis et joue', to: paths.createGame, icon: CirclePlus, role: 'new' },
  { label: 'Rejoindre une partie', description: 'Avec un code ou un lien', to: paths.joinGame, icon: LinkIcon, role: 'link' },
] satisfies readonly QuickLinkItem[]
