import GameSymbol from "../GameSymbol/GameSymbol";

import type { CellValue } from "../../model/morpion";

import "./GameBoard.css"

/** Propriétés du plateau commun aux différents modes de jeu. */
interface GameBoardProps {
    /** Contenu des neuf cases, parcourues ligne par ligne */
    board: readonly CellValue[];

    /** Désactive toutes les cases, notamment pendant le tour adverse. */
    disabled?: boolean;

    /** Action appelée avec l'indice de la case choisie, entre 0 et 8. */
    onPlay: (index: number) => void;
}

/**
 * Affiche le plateau sans gérer les règles ni modifier ses données. Les cases occupées sont
 * toujours désactivées.
 */

export default function GameBoard({
    board,
    disabled = false,
    onPlay,
}: Readonly<GameBoardProps>) {
    return (
        <div className="game-board" role="group" aria-label="Plateau de morpion">
            {board.map((value, index) => (
                <button
                    className="game-board__cell"
                    key={index}
                    type="button"
                    aria-label={`Case ${index + 1}${value ? `: ${value} ` : " vide"}`}
                    disabled={disabled || value !== null}
                    onClick={() => onPlay(index)}
                >
                    {value && <GameSymbol symbol={value} size="board" />}
                </button>
            ))}
        </div>
    )
}