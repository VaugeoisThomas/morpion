import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../account/profile'
import GameBoard, { SymbolImage } from '../game/GameBoard'
import { roomAction, roomError } from './roomApi'
import { invitationUrl, roomSecondsLeft } from './rooms'
import type { Room, RoomAction } from './rooms'
import { useRoom } from './useRoom'

function Player({ profile, label, symbol, score }: Readonly<{
  profile?: Profile; label: string; symbol: 'X' | 'O'; score: number
}>) {
  return <div className={`match-player match-player--${symbol}`}>
    {profile && <img className="room-avatar" src={`/avatars/${profile.avatar}.svg`} alt="" width="44" height="44" />}
    <span>{profile?.username ?? label}</span><SymbolImage symbol={symbol} /><strong>{score}</strong>
  </div>
}

function matchMessage(room: Room, symbol: 'X' | 'O') {
  if (room.round_end_reason === 'timeout') return room.round_winner === symbol ? 'Temps écoulé : tu gagnes la manche !' : 'Temps écoulé : tu perds la manche.'
  if (room.round_end_reason === 'draw') return 'Match nul.'
  if (room.round_winner) return room.round_winner === symbol ? 'Tu gagnes la manche !' : 'Ton ami gagne la manche.'
  return room.current_turn === symbol ? 'À toi de jouer.' : 'À ton ami de jouer.'
}

export default function RoomView({ id, userId }: Readonly<{ id: string; userId: string }>) {
  const { room, error: readError, connected, refresh } = useRoom(id)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const actionPending = useRef(false)
  const [now, setNow] = useState(Date.now)
  const [copyMessage, setCopyMessage] = useState('')
  const hostId = room?.host_id
  const guestId = room?.guest_id

  useEffect(() => {
    if (!supabase || !hostId) return
    const abort = new AbortController()
    void supabase.from('profiles').select('id,username,avatar').in('id', guestId ? [hostId, guestId] : [hostId])
      .abortSignal(abort.signal).then(({ data }) => { if (!abort.signal.aborted && data) setProfiles(data) })
    return () => abort.abort()
  }, [hostId, guestId])

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!room?.turn_started_at || room.round_finished || room.status !== 'in_progress') return
    let active = true
    let pending = false
    const timer = window.setInterval(() => {
      if (!active || pending || roomSecondsLeft(room, Date.now()) !== 0) return
      pending = true
      void roomAction(room, 'expire').then(() => refresh()).catch(() => {
        // L'autre joueur a pu clôturer la manche en premier ; relire l'état.
        if (active) void refresh()
      }).finally(() => { pending = false })
    }, 1000)
    return () => { active = false; window.clearInterval(timer) }
  }, [room, refresh])

  async function act(action: RoomAction, cell?: number) {
    if (!room || actionPending.current) return
    actionPending.current = true; setBusy(true); setError(null)
    try {
      await roomAction(room, action, cell)
      if (action === 'leave') window.location.hash = '/'
      else await refresh()
    } catch (failure) { setError(roomError(failure)); await refresh() }
    finally { actionPending.current = false; setBusy(false) }
  }

  async function copyInvitation() {
    if (!room) return
    try {
      await navigator.clipboard.writeText(invitationUrl(window.location.href, room.invite_code))
      setCopyMessage('Lien copié.')
    } catch { setCopyMessage('Copie indisponible. Sélectionne le lien ci-dessous pour le partager.') }
  }

  if (!room) return <section className="room-panel"><output>{readError ?? 'Chargement de la salle…'}</output></section>
  if (room.status === 'cancelled') return <section className="room-panel"><h1>Partie annulée</h1><p>L’hôte a fermé cette salle.</p><a href="#/">Retour à l’accueil</a></section>
  const isHost = room.host_id === userId
  const symbol = isHost ? room.host_symbol : room.host_symbol === 'X' ? 'O' : 'X'
  const host = profiles.find((profile) => profile.id === room.host_id)
  const guest = profiles.find((profile) => profile.id === room.guest_id)
  const seconds = roomSecondsLeft(room, now)
  const ownReplay = isHost ? room.host_replay_ready : room.guest_replay_ready
  const opponentReplay = isHost ? room.guest_replay_ready : room.host_replay_ready
  const canPlay = !busy && !readError && connected && !room.round_finished && room.current_turn === symbol && seconds !== 0
  const feedback = <>{(error || readError) && <p className="account-error" role="alert">{error ?? readError}</p>}
    {!connected && <output className="room-connection">Reconnexion en cours…</output>}</>
  const players = <><Player profile={host} label="Hôte" symbol={room.host_symbol} score={room.host_score} />
    <Player profile={guest} label={room.guest_id ? 'Invité' : 'En attente d’un ami'} symbol={room.host_symbol === 'X' ? 'O' : 'X'} score={room.guest_score} /></>

  if (room.status === 'waiting') return <section className="room-lobby">
    <h1>Salle d’attente</h1><p>Invite ton ami et préparez-vous à jouer.</p>
    <div className="room-lobby-players">{players}</div>
    <div className="room-panel room-invitation"><p>Code de la partie</p><strong className="room-code">{room.invite_code}</strong>
      <button type="button" className="primary-button" onClick={() => void copyInvitation()}>Copier le lien</button>
      <input aria-label="Lien d’invitation" readOnly value={invitationUrl(window.location.href, room.invite_code)} onFocus={(event) => event.target.select()} />
      <output>{copyMessage}</output><p>{room.round_count} manche(s) · {room.turn_duration} secondes par tour · {room.visibility === 'private' ? 'Privée' : 'Publique'}</p>
    </div>
    {isHost && <button className="primary-button" disabled={busy || !room.guest_id || !connected} onClick={() => void act('start')}>Lancer la partie</button>}
    {!isHost && <output>L’hôte peut maintenant lancer la partie.</output>}
    {feedback}<button type="button" className="room-text-button" disabled={busy} onClick={() => void act('leave')}>{isHost ? 'Annuler la partie' : 'Quitter la salle'}</button>
  </section>

  const seriesMessage = room.host_score === room.guest_score ? 'La série se termine à égalité.'
    : (room.host_score > room.guest_score) === isHost ? 'Tu remportes la série !' : 'Ton ami remporte la série.'
  return <section className="computer-match friend-match" aria-label="Partie entre amis">
    <header className="match-topbar">{players}<div className="match-progress">Manche {room.current_round}/{room.round_count}</div><a href="#/" className="match-exit">Retour à l’accueil</a></header>
    <div className="match-body"><aside className="turn-indicator" data-symbol={room.current_turn}>
      <SymbolImage symbol={room.current_turn} /><output className="match-status">{matchMessage(room, symbol)}</output>
      {seconds !== null && <p className="room-clock" aria-label={`Temps restant : ${seconds} secondes`}>{seconds} s</p>}
      <p className="turn-hint">Ton symbole : {symbol}</p>{feedback}
    </aside><div className="match-board-area">
      <GameBoard board={room.board} disabled={!canPlay} onPlay={(cell) => void act('move', cell)} />
      {room.round_finished && <div className="match-result">
        {room.status === 'finished' ? <>
          <output>{seriesMessage}</output>
          <button className="primary-button" disabled={busy || ownReplay} onClick={() => void act('replay')}>{ownReplay ? 'En attente de ton ami…' : 'Rejouer'}</button>
          {opponentReplay && !ownReplay && <p>Ton ami souhaite rejouer.</p>}
        </> : isHost ? <button className="primary-button" disabled={busy} onClick={() => void act('next')}>Manche suivante</button>
          : <output>L’hôte peut lancer la manche suivante.</output>}
      </div>}
    </div></div>
  </section>
}
