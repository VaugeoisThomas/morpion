export type Symbol = 'X' | 'O'
export type Cell = Symbol | null
export type Board = readonly Cell[]
export type Result =
  | { status: 'playing' }
  | { status: 'won'; winner: Symbol; line: readonly number[] }
  | { status: 'draw' }

export type Game = {
  board: Board
  turn: Symbol
  result: Result
}

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
] as const

export function getResult(board: Board): Result {
  if (board.length !== 9) throw new Error('La grille doit contenir neuf cases.')

  for (const line of winningLines) {
    const [a, b, c] = line
    const symbol = board[a]
    if (symbol !== null && symbol === board[b] && symbol === board[c]) {
      return { status: 'won', winner: symbol, line }
    }
  }

  return board.every((cell) => cell !== null)
    ? { status: 'draw' }
    : { status: 'playing' }
}

export function createGame(firstPlayer: Symbol = 'X'): Game {
  return {
    board: Array<Cell>(9).fill(null),
    turn: firstPlayer,
    result: { status: 'playing' },
  }
}

// Un coup refusé conserve le même état, sans modifier la grille d'origine.
export function playMove(game: Game, index: number, player: Symbol): Game {
  if (
    game.result.status !== 'playing' || player !== game.turn ||
    !Number.isInteger(index) || index < 0 || index > 8 ||
    game.board[index] !== null
  ) return game

  const board = [...game.board]
  board[index] = player
  const result = getResult(board)

  return {
    board,
    turn: result.status === 'playing' ? (player === 'X' ? 'O' : 'X') : player,
    result,
  }
}
