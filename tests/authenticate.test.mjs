import test from 'node:test'
import assert from 'node:assert/strict'
import { authenticate } from '../src/features/account/authenticate.ts'

test('une connexion utilise le mot de passe sans inscription ni envoi de lien', async () => {
  let received
  const auth = {
    signInWithPassword: async (input) => { received = input; return { error: null } },
    signUp: () => assert.fail('Une connexion ne doit pas créer de compte'),
    signInWithOtp: () => assert.fail('Une connexion ne doit pas envoyer de lien'),
  }
  await authenticate(auth, { email: ' joueur@example.com ', password: ' mot de passe ' })
  assert.deepEqual(received, { email: 'joueur@example.com', password: ' mot de passe ' })
})

test('une inscription transmet le mot de passe et les métadonnées attendues par le trigger', async () => {
  let received
  const auth = {
    signUp: async (input) => { received = input; return { error: null } },
    signInWithPassword: () => assert.fail('La confirmation doit précéder la connexion'),
    signInWithOtp: () => assert.fail('Aucun magic link de connexion ne doit être demandé'),
  }
  await authenticate(auth, { email: ' joueur@example.com ', password: 'secret-de-test' }, {
    username: ' Thomas_42 ', redirectUrl: 'http://localhost:5173/#/compte',
  })
  assert.deepEqual(received, {
    email: 'joueur@example.com', password: 'secret-de-test',
    options: {
      emailRedirectTo: 'http://localhost:5173/#/compte',
      data: { username: 'Thomas_42', avatar: 'robot' },
    },
  })
})
