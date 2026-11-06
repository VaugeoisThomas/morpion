import test from 'node:test'
import assert from 'node:assert/strict'
import { access } from 'node:fs/promises'
import { avatars, isAvatarId, isValidUsername } from '../src/features/account/profile.ts'

test('les pseudos respectent les contraintes PostgreSQL existantes', () => {
  for (const username of ['abc', 'Thomas_42', 'a'.repeat(16)]) assert.equal(isValidUsername(username), true)
  for (const username of ['', 'ab', 'a'.repeat(17), 'André', 'a b', ' abc', 'abc ', '<script>']) {
    assert.equal(isValidUsername(username), false, username)
  }
})

test('les avatars inconnus sont refusés et chaque ressource du catalogue existe', async () => {
  assert.equal(isAvatarId('../robot'), false)
  assert.equal(isAvatarId(''), false)
  assert.equal(new Set(avatars.map(({ id }) => id)).size, avatars.length)
  for (const { id } of avatars) {
    assert.equal(isAvatarId(id), true)
    await access(new URL(`../public/avatars/${id}.svg`, import.meta.url))
  }
})
