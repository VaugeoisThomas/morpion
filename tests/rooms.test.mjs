import test from 'node:test'
import assert from 'node:assert/strict'
import { formatInviteCode, invitationUrl, isInviteCode, roomSecondsLeft } from '../src/features/rooms/rooms.ts'
import { accountLink, accountReturnRoute, readRoute } from '../src/navigation.ts'

test('le code est normalisé et une invitation ne réutilise aucun ancien jeton', () => {
  assert.equal(formatInviteCode('a1b2 c3d4'), 'A1B2-C3D4')
  assert.equal(isInviteCode('A1B2-C3D4'), true)
  assert.equal(isInviteCode('A1B2-C3D'), false)
  assert.equal(invitationUrl('https://morpion.example/?code=secret#/compte','A1B2-C3D4'), 'https://morpion.example/#/rejoindre/A1B2-C3D4')
  assert.equal(readRoute('#/rejoindre/A1B2-C3D4').code, 'A1B2-C3D4')
  assert.equal(readRoute('#/salle/texte-invalide').page, 'home')
})

test('le retour après connexion conserve uniquement des destinations internes valides', () => {
  const invite = '#/rejoindre/A1B2-C3D4'
  assert.equal(accountReturnRoute(accountLink(readRoute(invite))), invite)
  assert.equal(accountReturnRoute(accountLink(readRoute('#/creer'))), '#/creer')
  assert.equal(accountLink(readRoute('#/rejoindre/valeur-invalide')), '#/compte')
  assert.equal(accountReturnRoute('#/compte?retour=https://autre.example'), null)
  assert.equal(accountReturnRoute('#/compte?retour=rejoindre&code=%3Cscript%3E'), null)
  assert.equal(accountReturnRoute('#/compte?retour=salle&id=../autre'), null)
})

test('le chronomètre utilise le départ de tour serveur et s’arrête entre les manches', () => {
  const start = Date.parse('2026-11-06T12:00:00Z')
  const room = { turn_started_at: new Date(start).toISOString(), turn_duration: 15, round_finished: false, status: 'in_progress' }
  assert.equal(roomSecondsLeft(room, start + 1001), 14)
  assert.equal(roomSecondsLeft(room, start + 20000), 0)
  assert.equal(roomSecondsLeft({ ...room, round_finished: true }, start), null)
  assert.equal(roomSecondsLeft({ ...room, status: 'waiting' }, start), null)
})
