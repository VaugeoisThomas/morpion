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
    room = '20000000-0000-0000-0000-000000000001'
    await db.query("select public.create_friend_room($1,'private',3::smallint,'X',30::smallint)", [room])
    const { rows } = await db.query('select id,board,host_score from public.game_rooms where id=$1', [room])
    assert.equal(rows[0].host_score, 0)
    assert.deepEqual(rows[0].board, Array(9).fill(null))
    room = rows[0].id
  })
  await asUser(bob, async () => {
    assert.equal((await db.query('select id from public.game_rooms')).rows.length, 0)
  })
  const { rows: codes } = await db.query('select invite_code from public.game_rooms where id=$1', [room])
  await asUser(bob, async () => {
    await db.query('select public.join_game_room($1)', [codes[0].invite_code])
    assert.equal((await db.query('select id from public.game_rooms')).rows.length, 1)
    await assert.rejects(db.query("select public.friend_room_action($1,'start',1,1)", [room]), /hôte/)
  })
  await asUser(alice, async () => {
    await assert.rejects(db.query('select public.play_game_room_move($1,0)', [room]), { code: '42501' })
    await db.query("select public.friend_room_action($1,'start',1,1)", [room])
    await db.query("select public.friend_room_action($1,'move',1,1,0)", [room])
    await assert.rejects(db.query("select public.friend_room_action($1,'move',1,1,1)", [room]), /tour/)
  })
  await asUser(bob, async () => {
    await assert.rejects(db.query("select public.friend_room_action($1,'move',1,1,0)", [room]), /occupée/)
    await db.query("select public.friend_room_action($1,'move',1,1,1)", [room])
  })
})

test('les codes sont générés côté serveur, la création est idempotente et une troisième place est refusée', async () => {
  const id = '20000000-0000-0000-0000-000000000002'
  await asUser(alice, async () => {
    const sql = "select public.create_friend_room($1,'private',1::smallint,'O',15::smallint) as id"
    assert.equal((await db.query(sql, [id])).rows[0].id, id)
    assert.equal((await db.query(sql, [id])).rows[0].id, id)
    assert.equal((await db.query('select id from public.game_rooms where id=$1', [id])).rows.length, 1)
  })
  const { rows } = await db.query('select invite_code from public.game_rooms where id=$1', [id])
  assert.match(rows[0].invite_code, /^[A-Z0-9]{4}-[A-Z0-9]{4}$/)
  await asUser(bob, () => db.query('select public.join_game_room($1)', [rows[0].invite_code]))
  await asUser('10000000-0000-0000-0000-000000000003', async () => {
    await assert.rejects(db.query('select public.join_game_room($1)', [rows[0].invite_code]), /complète/)
    await assert.rejects(db.query("select public.friend_room_action($1,'move',1,1,0)", [id]), /accès refusé/)
  })
})

test('le délai est jugé par le serveur, attribue une seule victoire et la revanche exige deux accords', async () => {
  const id = '20000000-0000-0000-0000-000000000002'
  await asUser(alice, () => db.query("select public.friend_room_action($1,'start',1,1)", [id]))
  await asUser(bob, () => db.query("select public.friend_room_action($1,'expire',1,1)", [id]))
  assert.equal((await db.query('select round_finished from public.game_rooms where id=$1', [id])).rows[0].round_finished, false)
  // Avancer l'horloge de la salle dans la base de test uniquement.
  await db.query("update public.game_rooms set turn_started_at=clock_timestamp()-interval '16 seconds' where id=$1", [id])
  await asUser(bob, () => db.query("select public.friend_room_action($1,'move',1,1,0)", [id]))
  const ended = (await db.query('select * from public.game_rooms where id=$1', [id])).rows[0]
  assert.equal(ended.round_winner, 'O')
  assert.equal(ended.host_score, 1)
  assert.equal(ended.guest_score, 0)
  assert.equal(ended.status, 'finished')
  assert.equal(ended.round_end_reason, 'timeout')
  assert.deepEqual(ended.board, Array(9).fill(null))
  await asUser(alice, async () => {
    await assert.rejects(db.query("select public.friend_room_action($1,'expire',1,1)", [id]), /manche/)
    await db.query("select public.friend_room_action($1,'replay',1,1)", [id])
    await db.query("select public.friend_room_action($1,'replay',1,1)", [id])
  })
  assert.equal((await db.query('select status from public.game_rooms where id=$1', [id])).rows[0].status, 'finished')
  await asUser(bob, () => db.query("select public.friend_room_action($1,'replay',1,1)", [id]))
  const replay = (await db.query('select * from public.game_rooms where id=$1', [id])).rows[0]
  assert.equal(replay.series_number, 2)
  assert.equal(replay.current_turn, 'X')
  assert.equal(replay.status, 'in_progress')
  assert.equal(replay.host_score + replay.guest_score, 0)
  await asUser(alice, async () => {
    await assert.rejects(db.query("select public.friend_room_action($1,'replay',1,1)", [id]), /changé/)
  })
})

test('une victoire est comptée une seule fois puis X commence la manche suivante', async () => {
  const id = '20000000-0000-0000-0000-000000000001'
  // Premier test : X en 0, O en 1 ; X gagne la première colonne.
  for (const [user, cell] of [[alice,3],[bob,2],[alice,6]]) {
    await asUser(user, () => db.query("select public.friend_room_action($1,'move',1,1,$2)", [id,cell]))
  }
  const ended = (await db.query('select * from public.game_rooms where id=$1', [id])).rows[0]
  assert.equal(ended.host_score, 1)
  assert.equal(ended.round_winner, 'X')
  assert.equal(ended.round_finished, true)
  await asUser(bob, async () => {
    await assert.rejects(db.query("select public.friend_room_action($1,'next',1,1)", [id]), /hôte/)
  })
  await asUser(alice, async () => {
    await db.query("select public.friend_room_action($1,'next',1,1)", [id])
    await assert.rejects(db.query("select public.friend_room_action($1,'move',1,1,0)", [id]), /changé/)
  })
  const next = (await db.query('select * from public.game_rooms where id=$1', [id])).rows[0]
  assert.equal(next.current_round, 2)
  assert.equal(next.current_turn, 'X')
  assert.equal(next.host_score, 1)
  assert.deepEqual(next.board, Array(9).fill(null))
})

test('un profil absent peut être recréé seulement pour son propre compte', async () => {
  await db.query('delete from public.profiles where id=$1', [alice])
  await asUser(alice, async () => {
    await assert.rejects(db.query("insert into public.profiles (id,username,avatar) values ($1,'Intrusion','robot')", [bob]), { code: '42501' })
    const { rows } = await db.query("insert into public.profiles (id,username,avatar) values ($1,'Alice','robot') returning id", [alice])
    assert.equal(rows[0].id, alice)
  })
})

test('un match nul compte dans les manches et ne donne aucun point', async () => {
  const id = '20000000-0000-0000-0000-000000000001'
  for (const [index, cell] of [0,1,2,4,3,5,7,6,8].entries()) {
    await asUser(index % 2 === 0 ? alice : bob, () => db.query("select public.friend_room_action($1,'move',2,1,$2)", [id,cell]))
  }
  const ended = (await db.query('select * from public.game_rooms where id=$1', [id])).rows[0]
  assert.equal(ended.round_end_reason, 'draw')
  assert.equal(ended.host_score, 1)
  assert.equal(ended.guest_score, 0)
  await asUser(alice, () => db.query("select public.friend_room_action($1,'next',2,1)", [id]))
  assert.equal((await db.query('select current_round from public.game_rooms where id=$1', [id])).rows[0].current_round, 3)
})

test('un invité peut libérer sa place et l’hôte annuler avant le démarrage', async () => {
  const id = '20000000-0000-0000-0000-000000000003'
  await asUser(alice, () => db.query("select public.create_friend_room($1,'private',1::smallint,'X',15::smallint)", [id]))
  const code = (await db.query('select invite_code from public.game_rooms where id=$1', [id])).rows[0].invite_code
  await asUser(bob, async () => {
    await db.query('select public.join_game_room($1)', [code])
    await db.query("select public.friend_room_action($1,'leave',1,1)", [id])
    assert.equal((await db.query('select id from public.game_rooms where id=$1', [id])).rows.length, 0)
  })
  await asUser(alice, async () => {
    await assert.rejects(db.query("select public.friend_room_action($1,'start',1,1)", [id]), /second joueur/)
    await db.query("select public.friend_room_action($1,'leave',1,1)", [id])
  })
  await asUser(bob, () => assert.rejects(db.query('select public.join_game_room($1)', [code]), /rejointe/))
})
