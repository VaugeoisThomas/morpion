import type { GameResult } from "../data/games";

import "./GameResultBadge.css"

/** Propriété de l'indicateur de résultat d'une partie. */

interface GameResultBadgeProps {
    /** Résultat à afficher : victoire, défaite ou match nul. */
    result: GameResult

    /** Classe permettant d'adapter la présentation au contexte. */
    className?: string
}

/** Libellés français des résultats d'une partie. */
const resultLabels: Record<GameResult, string> = {
    win: 'Victoire',
    loss: 'Défaite',
    draw: 'Match nul'
}

/**
 * Affiche le libellé français du résultat d'une partie. Ajoute une classe correspondant au
 * résultat et permet au parent de compléter la présentation.
 */

export default function GameResultBadge({
    result,
    className = '',
}: Readonly<GameResultBadgeProps>) {
    const classes = [
        'game-result',
        `game-result--${result}`,
        className,
    ].filter(Boolean).join(' ')

    return (
        <span className={classes}>
            {resultLabels[result]}
        </span>
    )
}