import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'

const db = new PGlite()
const alice = '10000000-0000-0000-0000-000000000001'
const bob = '10000000-0000-0000-0000-000000000002'

// Substitut local du socle Supabase Auth : aucun appel réseau ni véritable compte.
before(async () => {
  await db.exec(`
    create role anon;
    create role authenticated;
    create schema auth;
    create table auth.users (id uuid primary key, raw_user_meta_data jsonb not null);
    create function auth.uid() returns uuid language sql stable as
      $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    grant usage on schema auth, public to anon, authenticated;
    grant execute on function auth.uid() to anon, authenticated;
    alter default privileges in schema public grant all on tables to anon, authenticated;
    create publication supabase_realtime;
  `)
  const directory = new URL('../supabase/migrations/', import.meta.url)
  for (const filename of (await readdir(directory)).filter((name) => name.endsWith('.sql')).sort()) {
    await db.exec(await readFile(new URL(filename, directory), 'utf8'))
  }
  await db.query(`insert into auth.users (id, raw_user_meta_data) values
    ($1, '{"username":"Alice","avatar":"robot"}'),
    ($2, '{"username":"Bob","avatar":"chat"}')`, [alice, bob])
  await db.query(`insert into public.games (user_id, opponent_type, result) values
    ($1, 'online', 'win'), ($2, 'online', 'loss')`, [alice, bob])
})

after(async () => { await db.close() })

async function asUser(userId, run) {
  await db.exec('set role authenticated')
  await db.query("select set_config('request.jwt.claim.sub', $1, false)", [userId])
  try { return await run() }
  finally { await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub', '', false)") }
}

test('un visiteur ne lit aucun profil et ne peut pas exécuter le trigger directement', async () => {
  await db.exec('set role anon')
  try {
    await assert.rejects(db.query('select * from public.profiles'), { code: '42501' })
    await assert.rejects(db.query('select public.create_profile_for_new_user()'), { code: '42501' })
  } finally { await db.exec('reset role') }
})

test('le trigger crée toujours les profils après restriction de ses droits', async () => {
  const { rows } = await db.query('select username, avatar from public.profiles order by username')
  assert.deepEqual(rows, [{ username: 'Alice', avatar: 'robot' }, { username: 'Bob', avatar: 'chat' }])
})

test('un joueur modifie son profil mais pas celui d’un autre ni les dates serveur', async () => {
  await asUser(alice, async () => {
    const other = await db.query("update public.profiles set username='Intrusion' where id=$1 returning id", [bob])
    assert.equal(other.rows.length, 0)
    const own = await db.query("update public.profiles set avatar='dragon' where id=$1 returning avatar", [alice])
    assert.equal(own.rows[0].avatar, 'dragon')
    await assert.rejects(db.query('update public.profiles set created_at=now() where id=$1', [alice]), { code: '42501' })
    await assert.rejects(db.query('update public.profiles set id=$1 where id=$2', [bob, alice]), { code: '42501' })
    await assert.rejects(db.query('select public.create_profile_for_new_user()'), { code: '42501' })
  })
})

test('les pseudos restent uniques sans distinction de casse', async () => {
  await asUser(alice, async () => {
    await assert.rejects(db.query("update public.profiles set username='bOB' where id=$1", [alice]), { code: '23505' })
  })
})

test('les résultats sont isolés et ne peuvent pas être falsifiés depuis le client', async () => {
  await asUser(alice, async () => {
    const { rows } = await db.query('select user_id, result from public.games')
    assert.deepEqual(rows, [{ user_id: alice, result: 'win' }])
    await assert.rejects(db.query("insert into public.games (user_id,opponent_type,result) values ($1,'online','win')", [alice]), { code: '42501' })
    await assert.rejects(db.query("update public.games set result='win'"), { code: '42501' })
    for (const table of ['profiles', 'games', 'game_rooms']) {
      await assert.rejects(db.query(`truncate table public.${table} cascade`), { code: '42501' })
    }
  })
})

test('une salle accepte ses options mais pas un plateau ou score imposé par le client', async () => {
  let room
  await asUser(alice, async () => {
    await assert.rejects(db.query(`insert into public.game_rooms
      (host_id,invite_code,visibility,round_count,host_symbol,turn_duration,host_score)
      values ($1,'FAUX-0000','private',3,'X',30,1)`, [alice]), { code: '42501' })
    await assert.rejects(db.query(`insert into public.game_rooms
      (host_id,invite_code,visibility,round_count,host_symbol,turn_duration)
      values ($1,'FAUX-0001','private',3,'X',30)`, [bob]), { code: '42501' })
    const { rows } = await db.query(`insert into public.game_rooms
      (host_id,invite_code,visibility,round_count,host_symbol,turn_duration)
      values ($1,'ABCD-1234','private',3,'X',30) returning id,board,host_score`, [alice])
    assert.equal(rows[0].host_score, 0)
    assert.deepEqual(rows[0].board, Array(9).fill(null))
    room = rows[0].id
  })
  await asUser(bob, async () => {
    assert.equal((await db.query('select id from public.game_rooms')).rows.length, 0)
    await db.query("select public.join_game_room('ABCD-1234')")
    assert.equal((await db.query('select id from public.game_rooms')).rows.length, 1)
    await assert.rejects(db.query('select public.start_game_room($1)', [room]), /accès refusé/)
  })
  await asUser(alice, async () => {
    await db.query('select public.start_game_room($1)', [room])
    await db.query('select public.play_game_room_move($1, 0)', [room])
    await assert.rejects(db.query('select public.play_game_room_move($1, 1)', [room]), /tour/)
  })
  await asUser(bob, async () => {
    await assert.rejects(db.query('select public.play_game_room_move($1, 0)', [room]), /occupée/)
    await db.query('select public.play_game_room_move($1, 1)', [room])
  })
})

test('un profil absent peut être recréé seulement pour son propre compte', async () => {
  await db.query('delete from public.profiles where id=$1', [alice])
  await asUser(alice, async () => {
    await assert.rejects(db.query("insert into public.profiles (id,username,avatar) values ($1,'Intrusion','robot')", [bob]), { code: '42501' })
    const { rows } = await db.query("insert into public.profiles (id,username,avatar) values ($1,'Alice','robot') returning id", [alice])
    assert.equal(rows[0].id, alice)
  })
})
