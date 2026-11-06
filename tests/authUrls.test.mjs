import assert from 'node:assert/strict'
import test from 'node:test'
import { getAuthRedirectUrl, getAuthCallbackMessage } from '../src/features/account/authUrls.ts'

test('l’URL de retour conserve le déploiement mais retire code et ancien fragment', () => {
  assert.equal(getAuthRedirectUrl('https://morpion.example/app/?code=ancien#/ordinateur'), 'https://morpion.example/app/#/compte')
  assert.equal(getAuthRedirectUrl('http://localhost:5173/#access_token=ancien'), 'http://localhost:5173/#/compte')
})

test('un lien expiré est reconnu dans la query et dans le fragment', () => {
  for (const url of ['https://morpion.example/?error_code=otp_expired', 'https://morpion.example/#error=access_denied&error_code=otp_expired']) {
    assert.match(getAuthCallbackMessage(url), /expiré/)
  }
})

test('les erreurs ne reflètent pas le texte distant et une route normale n’est pas une erreur', () => {
  assert.equal(getAuthCallbackMessage('https://morpion.example/#/compte'), null)
  assert.equal(getAuthCallbackMessage('https://morpion.example/?code=abc#/compte'), null)
  assert.equal(getAuthCallbackMessage('https://morpion.example/#error=refused&error_description=texte-distant'), 'La confirmation n’a pas abouti. Réessaie depuis « Créer un compte » ou connecte-toi si ton adresse est déjà confirmée.')
})
