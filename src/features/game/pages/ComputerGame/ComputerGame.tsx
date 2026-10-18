import Button from '../../../../shared/ui/Button/Button'
import GameBoard from '../../components/GameBoard'
import { useComputerGame } from '../../hooks/useComputerGame'
import { useSaveFinishedGame } from '../../hooks/useSaveFinishedGame'

import './ComputerGame.css'


/**
 * Affiche une partie de morpion contre l’ordinateur. Utilise useComputerGame pour gérer le plateau
 * et les coups.
 */
export default function ComputerGame() {
    const {
        gameId,
        board,
        winner,
        isDraw,
        isGameOver,
        playAt,
        resetGame
    } = useComputerGame()
    const {
        error: saveError,
        isSaving,
        retrySave,
    } = useSaveFinishedGame({ gameId, isGameOver, winner })

    /**
     * Message affiché selon l’état de la partie : invitation à jouer, victoire, défaite ou match
     * nul.
     */
    let status = 'A toi de jouer.'
    if (winner === 'X') status = 'Tu as gagné'
    else if (winner === "O") status = 'L\'ordinateur a gagné.'
    else if (isDraw) status = 'Match nul.'

    return (
        <main className='computer-game'>
            <h1 className='computer-game__title'>Jouer contre l'ordinateur</h1>
            <p className='computer-game__status' role='status'>{status}</p>
            {saveError && (
                <div>
                    <p className="computer-game__error" role="alert">{saveError}</p>

                    <Button
                        className="computer-game__replay"
                        variant="secondary"
                        onClick={retrySave}
                    >
                        Réessayer l’enregistrement
                    </Button>
                </div>
            )}

            {isSaving && (
                <p role="status">
                    Enregistrement en cours ...
                </p>
            )}

            <GameBoard
                board={board}
                disabled={isGameOver}
                onPlay={playAt}
            />
            {isGameOver && (
                <Button
                    className="computer-game__replay"
                    onClick={resetGame}>
                    Rejouer
                </Button>
            )}
        </main>
    )
}