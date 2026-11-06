import { useState } from 'react'
import type { SubmitEvent } from 'react'
import { createRoom, joinRoom, roomError } from './roomApi'
import { formatInviteCode, isInviteCode } from './rooms'
import type { RoomOptions } from './rooms'
import { SymbolImage } from '../game/GameBoard'

type Choice = { value: string; label: string }
function Choices({ name, title, values, value, onChange }: Readonly<{
  name: string; title: string; values: readonly Choice[]; value: string; onChange: (value: string) => void
}>) {
  return <fieldset className="room-choices"><legend>{title}</legend><div>
    {values.map((choice) => <label className="option-choice" key={choice.value}>
      <input type="radio" name={name} value={choice.value} checked={value === choice.value} onChange={() => onChange(choice.value)} />
      {name === 'symbol' && <SymbolImage symbol={choice.value === 'X' ? 'X' : 'O'} />}<span>{choice.label}</span>
    </label>)}
  </div></fieldset>
}

export function CreateRoom() {
  const [options, setOptions] = useState<RoomOptions>({ visibility: 'private', rounds: 3, symbol: 'X', duration: 30 })
  const [requestId] = useState(() => crypto.randomUUID())
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  function choose(key: keyof RoomOptions, value: string) {
    setOptions((previous) => ({ ...previous, [key]: ['rounds', 'duration'].includes(key) ? Number(value) : value }))
  }
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true); setError(null)
    try { window.location.hash = `/salle/${await createRoom(options, requestId)}` }
    catch (failure) { setError(roomError(failure)) }
    finally { setBusy(false) }
  }
  return <>
    <header className="computer-header"><h1>Créer une partie</h1><p>Invite un ami et lance le défi.</p></header>
    <form className="room-setup" onSubmit={(event) => void submit(event)}>
      <fieldset disabled={busy} className="room-options-panel">
        <legend className="visually-hidden">Options de la partie</legend>
        <Choices name="visibility" title="Visibilité de la partie" values={[{ value: 'private', label: 'Privée' }, { value: 'public', label: 'Publique' }]}
          value={options.visibility} onChange={(value) => choose('visibility', value)} />
        <Choices name="rounds" title="Nombre de manches" values={[1, 3, 5].map((value) => ({ value: String(value), label: `${value} manche${value > 1 ? 's' : ''}` }))}
          value={String(options.rounds)} onChange={(value) => choose('rounds', value)} />
        <Choices name="symbol" title="Ton symbole" values={[{ value: 'X', label: 'Croix' }, { value: 'O', label: 'Rond' }]}
          value={options.symbol} onChange={(value) => choose('symbol', value)} />
        <label className="room-duration" htmlFor="room-duration">Temps par tour
          <select id="room-duration" value={options.duration} onChange={(event) => choose('duration', event.target.value)}>
            {[15, 30, 60].map((value) => <option key={value} value={value}>{value} secondes</option>)}
          </select>
        </label>
        <p className="option-hint">X commence chaque manche. Les matchs nuls comptent. Dépasser le temps fait perdre la manche.</p>
      </fieldset>
      <aside className="room-panel">
        <h2>Invite ton ami</h2><p>Un code et un lien de partage seront créés avec ta salle.</p>
        <p>Une partie privée se rejoint avec son invitation. Une partie publique pourra aussi accueillir un adversaire via la recherche.</p>
        <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Création…' : 'Créer la partie'}</button>
        {error && <p className="account-error" role="alert">{error}</p>}
      </aside>
    </form>
  </>
}

export function JoinRoom({ initialCode }: Readonly<{ initialCode: string }>) {
  const [code, setCode] = useState(() => formatInviteCode(initialCode))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || !isInviteCode(code)) return
    setBusy(true); setError(null)
    try { window.location.hash = `/salle/${await joinRoom(code)}` }
    catch (failure) { setError(roomError(failure)) }
    finally { setBusy(false) }
  }
  return <>
    <header className="computer-header"><h1>Rejoindre une partie</h1><p>Avec le code partagé par ton ami.</p></header>
    <form className="room-panel room-join" onSubmit={(event) => void submit(event)}>
      <label htmlFor="invite-code">Code de la partie</label>
      <input id="invite-code" value={code} onChange={(event) => setCode(formatInviteCode(event.target.value))}
        autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={9} pattern="[A-Z0-9]{4}-[A-Z0-9]{4}"
        placeholder="A1B2-C3D4" required disabled={busy} aria-describedby="invite-hint" />
      <p id="invite-hint">Huit lettres ou chiffres. Le tiret est ajouté automatiquement.</p>
      <button type="submit" className="primary-button" disabled={busy || !isInviteCode(code)}>{busy ? 'Connexion à la salle…' : 'Rejoindre la partie'}</button>
      {error && <p className="account-error" role="alert">{error}</p>}
    </form>
  </>
}
