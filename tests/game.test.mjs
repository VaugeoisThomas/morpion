import assert from 'node:assert/strict'
import test from 'node:test'
import { createGame, getResult, playMove } from '../src/features/game/game.ts'

test('une nouvelle partie contient neuf cases vides et accepte le premier joueur choisi', () => {
  assert.deepEqual(createGame().board, Array(9).fill(null))
  assert.equal(createGame('O').turn, 'O')
  assert.deepEqual(createGame().result, { status: 'playing' })
})

test('un coup valide alterne le tour sans modifier la partie précédente', () => {
  const initial = createGame()
  const next = playMove(initial, 4, 'X')
  assert.equal(next.board[4], 'X')
  assert.equal(next.turn, 'O')
  assert.equal(initial.board[4], null)
})

test('les coups hors tour, hors grille ou sur une case occupée sont refusés', () => {
  const initial = createGame()
  assert.equal(playMove(initial, 0, 'O'), initial)
  for (const index of [-1, 9, 0.5, NaN, Infinity]) {
    assert.equal(playMove(initial, index, 'X'), initial)
  }
  const next = playMove(initial, 0, 'X')
  assert.equal(playMove(next, 0, 'O'), next)
})

test('les huit alignements sont reconnus pour les deux symboles', () => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ]
  for (const symbol of ['X', 'O']) {
    for (const line of lines) {
      const board = Array(9).fill(null)
      for (const index of line) board[index] = symbol
      assert.deepEqual(getResult(board), { status: 'won', winner: symbol, line })
    }
  }
})

test('une victoire au neuvième coup reste une victoire', () => {
  assert.deepEqual(getResult(['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'X']), {
    status: 'won', winner: 'X', line: [0, 4, 8],
  })
})

test('un match nul termine la partie et une nouvelle partie repart vide', () => {
  let game = createGame()
  for (const index of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
    game = playMove(game, index, game.turn)
  }
  assert.deepEqual(game.result, { status: 'draw' })
  assert.equal(playMove(game, 0, game.turn), game)
  assert.deepEqual(createGame().board, Array(9).fill(null))
})

test('aucun coup ne peut être ajouté après une victoire', () => {
  let game = createGame()
  for (const index of [0, 3, 1, 4, 2]) game = playMove(game, index, game.turn)
  assert.equal(game.result.status, 'won')
  assert.equal(playMove(game, 5, 'O'), game)
})

test('une grille de taille incorrecte est refusée', () => {
  assert.throws(() => getResult([]), /neuf cases/)
})
