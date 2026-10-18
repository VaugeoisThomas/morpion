import type { PlayerSymbol } from '../model/gameRoom'

import './GameSymbol.css'

/** Propriétés du symbole néon partagé par les écrans de jeu. */
interface GameSymbolProps {
  /** Symbole à afficher avec le tracé de la maquette Figma. */
  symbol: PlayerSymbol
  /** Taille adaptée au contexte : choix, joueur, tour ou plateau. */
  size?: 'small' | 'medium' | 'large' | 'board'
  /** Classe supplémentaire fournie par le composant parent. */
  className?: string
}

/**
 * Affiche le SVG néon correspondant au symbole, sur fond transparent. Le symbole est décoratif :
 * son parent fournit le libellé accessible.
 */
export default function GameSymbol({ symbol, size = 'medium', className = '' }: Readonly<GameSymbolProps>) {
  const classes = ['game-symbol', 'game-symbol--' + size, className].filter(Boolean).join(' ')
  return (
    <span className={classes} aria-hidden="true">
      <img
        className="game-symbol__image"
        src={symbol === 'X' ? '/figma/game/cross.svg' : '/figma/game/circle.svg'}
        alt=""
        draggable={false}
      />
    </span>
  )
}
