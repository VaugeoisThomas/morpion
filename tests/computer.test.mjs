import assert from 'node:assert/strict'
import test from 'node:test'
import { chooseComputerMove } from '../src/features/game/computer.ts'
import { createGame, playMove } from '../src/features/game/game.ts'

function playSequence(indices) {
  return indices.reduce((game, index) => playMove(game, index, game.turn), createGame())
}

test('l’ordinateur attend son tour et ne joue plus après le résultat', () => {
  assert.equal(chooseComputerMove(createGame()), null)
  assert.equal(chooseComputerMove(playSequence([0, 3, 1, 4, 2])), null)
  assert.equal(chooseComputerMove(playSequence([0, 1, 2, 4, 3, 5, 7, 6, 8])), null)
})

test('l’ordinateur joue une victoire immédiate quand elle est disponible', () => {
  const game = playSequence([0, 3, 1, 4, 8])
  assert.equal(chooseComputerMove(game), 5)
})

test('l’ordinateur bloque une menace de victoire adverse', () => {
  const game = playSequence([0, 4, 1])
  assert.equal(chooseComputerMove(game), 2)
})

test('choisir un coup ne modifie pas l’état de la partie', () => {
  const game = playSequence([0])
  const before = structuredClone(game)
  chooseComputerMove(game)
  assert.deepEqual(game, before)
})

test('contre toutes les suites de coups humains, l’IA joue légalement et ne perd pas', () => {
  let terminalPositions = 0
  function visit(game, computer) {
    if (game.result.status !== 'playing') {
      terminalPositions++
      if (game.result.status === 'won') assert.equal(game.result.winner, computer)
      return
    }
    if (game.turn === computer) {
      const index = chooseComputerMove(game, computer)
      assert.notEqual(index, null)
      assert.equal(game.board[index], null)
      visit(playMove(game, index, computer), computer)
      return
    }
    game.board.forEach((cell, index) => {
      if (cell === null) visit(playMove(game, index, game.turn), computer)
    })
  }
  visit(createGame(), 'O')
  visit(createGame(), 'X')
  assert.ok(terminalPositions > 100)
})
