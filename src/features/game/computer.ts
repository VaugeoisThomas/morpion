import { playMove } from './game.ts'
import type { Game, Symbol } from './game.ts'

// À score égal, privilégier le centre, puis les coins et les bords.
const preferredCells = [4, 0, 2, 6, 8, 1, 3, 5, 7] as const

function scorePosition(game: Game, computer: Symbol): number {
  if (game.result.status === 'won') {
    // Terminer une victoire dès que possible et retarder une défaite forcée.
    const score = 10 + game.board.filter((cell) => cell === null).length
    return game.result.winner === computer ? score : -score
  }
  if (game.result.status === 'draw') return 0

  const scores = preferredCells
    .filter((index) => game.board[index] === null)
    .map((index) => scorePosition(playMove(game, index, game.turn), computer))

  return game.turn === computer ? Math.max(...scores) : Math.min(...scores)
}

/** Une seule IA : examiner les suites possibles et choisir le meilleur résultat. */
export function chooseComputerMove(game: Game, computer: Symbol = 'O'): number | null {
  if (game.result.status !== 'playing' || game.turn !== computer) return null

  let bestMove: number | null = null
  let bestScore = -Infinity

  for (const index of preferredCells) {
    if (game.board[index] !== null) continue
    const score = scorePosition(playMove(game, index, computer), computer)
    if (score > bestScore) {
      bestMove = index
      bestScore = score
    }
  }

  return bestMove
}
