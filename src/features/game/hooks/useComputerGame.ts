import { useState } from 'react'

import { type CellValue,createEmptyBoard, findWinner, getBestMove, getEmptyCells } from '../model/morpion'

/**
 * Gère le plateau et les résultats contre l’ordinateur. Le joueur X commence, puis l’ordinateur O
 * répond immédiatement.
 *
 * @returns Le plateau, les états de la partie et les actions permettant de jouer ou de
 * recommencer.
 */
export function useComputerGame() {
    const [board, setBoard] = useState<CellValue[]>(createEmptyBoard)

    /** Identifiant conservé jusqu’au démarrage de la prochaine partie. */
    const [gameId, setGameId] = useState(() => crypto.randomUUID())

    /** Symbole gagnant, ou null si aucun alignement gagnant n’existe. */
    const winner = findWinner(board)

    /** Indique que le plateau est plein sans aucun gagnant. */
    const isDraw = winner === null && board.every((cell) => cell !== null)

    /** Indique qu’une victoire ou un match nul termine la partie. */
    const isGameOver = winner !== null || isDraw


    /**
     * Joue X puis O si la partie continue. Ignore les cases occupées ; l’ordinateur choisit un
     * coup aléatoire dans 60 % des cas.
     *
     * @param index - Indice de la case choisie par le joueur, entre 0 et 8.
     */
    function playAt(index: number) {
        if (isGameOver || board[index] !== null) {
            return
        }

        const boardAfterPlayer = board.map((value, cellIndex) =>
            cellIndex === index ? 'X' : value
        )

        if (findWinner(boardAfterPlayer) === 'X') {
            setBoard(boardAfterPlayer)
            return
        }

        const bestMove = getBestMove(boardAfterPlayer)
        let computerIndex = bestMove
        if (bestMove !== null && Math.random() < 0.6) {
            const availableMoves = getEmptyCells(boardAfterPlayer)
            const randomChoice = Math.floor(Math.random() * availableMoves.length)
            computerIndex = availableMoves[randomChoice]
        }
        if (computerIndex === null) {
            setBoard(boardAfterPlayer)
            return
        }

        const boardAfterComputer = boardAfterPlayer.map((value, cellIndex) =>
            cellIndex === computerIndex ? 'O' : value
        )

        setBoard(boardAfterComputer)
    }

    /**
     * Démarre une nouvelle partie avec un plateau vide et un nouvel identifiant d’enregistrement.
     */
    function resetGame() {
        setBoard(createEmptyBoard())
        setGameId(crypto.randomUUID())
    }

    return {
        gameId,
        board,
        winner, 
        isDraw, 
        isGameOver, 
        playAt, 
        resetGame 
    }
}