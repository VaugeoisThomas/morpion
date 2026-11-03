import { useEffect, useState } from 'react'
import { chooseComputerMove } from './computer'
import { createGame, playMove } from './game'
import type { Result, Symbol } from './game'
import './ComputerGame.css'

type Settings = { human: Symbol; rounds: 1 | 3 | 5 }

function SymbolImage({ symbol }: { symbol: Symbol }) {
  return <span className={`game-symbol game-symbol--${symbol}`} aria-hidden="true">
    <img src={`/figma/game/${symbol === 'X' ? 'cross' : 'circle'}.svg`} alt="" />
  </span>
}

function Match({ settings }: { settings: Settings }) {
  const [game, setGame] = useState(createGame)
  const [previousResults, setPreviousResults] = useState<Result[]>([])
  const computer = settings.human === 'X' ? 'O' : 'X'
  const finished = game.result.status !== 'playing'
  const round = previousResults.length + 1
  const seriesFinished = finished && round === settings.rounds
  const results = finished ? [...previousResults, game.result] : previousResults
  const humanScore = results.filter((result) => result.status === 'won' && result.winner === settings.human).length
  const computerScore = results.filter((result) => result.status === 'won' && result.winner === computer).length
  const draws = results.filter((result) => result.status === 'draw').length

  useEffect(() => {
    if (game.result.status !== 'playing' || game.turn !== computer) return
    const timer = window.setTimeout(() => {
      setGame((current) => {
        const index = chooseComputerMove(current, computer)
        return index === null ? current : playMove(current, index, computer)
      })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [game, computer])

  let status = game.turn === settings.human ? 'À toi de jouer.' : 'L’ordinateur réfléchit…'
  if (game.result.status === 'draw') status = 'Match nul.'
  if (game.result.status === 'won') {
    status = game.result.winner === settings.human ? 'Tu as gagné la manche !' : 'L’ordinateur gagne la manche.'
  }
  const seriesStatus = humanScore > computerScore ? 'Tu remportes la série !'
    : humanScore < computerScore ? 'L’ordinateur remporte la série.' : 'La série se termine à égalité.'

  function nextRound() {
    if (!finished || seriesFinished) return
    setPreviousResults((previous) => [...previous, game.result])
    setGame(createGame())
  }

  function replay() {
    setPreviousResults([])
    setGame(createGame())
  }

  return (
    <section className="computer-match" aria-label="Partie contre l’ordinateur">
      <header className="match-topbar" aria-label="Score de la série">
        <div className={`match-player match-player--${settings.human}`}>
          <span>Toi</span><SymbolImage symbol={settings.human} /><strong>{humanScore}</strong>
        </div>
        <div className="match-progress">
          <p>Manche {round}/{settings.rounds}</p>
          <div className="round-markers" aria-hidden="true">
            {Array.from({ length: settings.rounds }, (_, index) =>
              <span key={index} className={index < round ? 'round-marker round-marker--filled' : 'round-marker'} />)}
          </div>
          <span className="draw-count">{draws} nul{draws > 1 ? 's' : ''}</span>
        </div>
        <div className={`match-player match-player--opponent match-player--${computer}`}>
          <strong>{computerScore}</strong><SymbolImage symbol={computer} /><span>Ordinateur</span>
        </div>
        <a href="#/" className="match-exit">Retour à l’accueil</a>
      </header>
      <div className="match-body">
        <aside className="turn-indicator" data-symbol={game.turn}>
          <SymbolImage symbol={game.turn} />
          <p className="match-status" role="status" aria-live="polite">{status}</p>
          <p className="turn-hint">{finished ? 'Manche terminée' : game.turn === settings.human ? 'Place ton signe' : 'À son tour de jouer'}</p>
        </aside>
        <div className="match-board-area">
      <div className="game-board" role="group" aria-label="Grille de morpion, trois lignes et trois colonnes">
        {game.board.map((cell, index) => {
          const winning = game.result.status === 'won' && game.result.line.includes(index)
          return <button key={index} type="button" className={`game-cell ${winning ? 'game-cell--winning' : ''}`}
            disabled={finished || game.turn !== settings.human || cell !== null}
            aria-label={`Ligne ${Math.floor(index / 3) + 1}, colonne ${index % 3 + 1} : ${cell ?? 'vide'}`}
            onClick={() => setGame((current) => playMove(current, index, settings.human))}>
            {cell !== null && <SymbolImage symbol={cell} />}
          </button>
        })}
      </div>
      {finished && <div className="match-result">
        {seriesFinished && <p role="status">{seriesStatus}</p>}
        <button type="button" className="primary-button" onClick={seriesFinished ? replay : nextRound}>
          {seriesFinished ? 'Rejouer' : 'Manche suivante'}
        </button>
      </div>}
        </div>
      </div>
    </section>
  )
}

export default function ComputerGame() {
  const [human, setHuman] = useState<Symbol>('X')
  const [rounds, setRounds] = useState<1 | 3 | 5>(3)
  const [settings, setSettings] = useState<Settings | null>(null)

  return <main id="content" className="computer-page">
    <a href="#/" className="back-link">← Retour à l’accueil</a>
    <header className="computer-header">
      <h1>Jouer contre l’ordinateur</h1>
      <p>Entraîne-toi à ton rythme.</p>
    </header>
    {settings === null ? <form className="computer-setup" onSubmit={(event) => {
      event.preventDefault()
      setSettings({ human, rounds })
    }}>
      <section className="computer-info">
        <h2><img src="/figma/home/home-bot.svg" alt="" />Ton adversaire</h2>
        <p>Affronte l’ordinateur dans une partie de morpion classique.</p>
      </section>
      <div className="computer-options">
        <fieldset>
          <legend>Ton symbole</legend>
          <div className="symbol-options">
            {(['X', 'O'] as const).map((symbol) => <label className="option-choice" key={symbol}>
              <input type="radio" name="symbol" value={symbol} checked={human === symbol} onChange={() => setHuman(symbol)} />
              <SymbolImage symbol={symbol} /><span>{symbol === 'X' ? 'Croix' : 'Rond'}</span>
            </label>)}
          </div>
          <p className="option-hint">La croix commence chaque manche.</p>
        </fieldset>
        <fieldset>
          <legend>Nombre de manches</legend>
          <div className="round-options">
            {([1, 3, 5] as const).map((count) => <label className="option-choice" key={count}>
              <input type="radio" name="rounds" value={count} checked={rounds === count} onChange={() => setRounds(count)} />
              <span>{count} manche{count > 1 ? 's' : ''}</span>
            </label>)}
          </div>
          <p className="option-hint">Les matchs nuls comptent dans le total.</p>
        </fieldset>
      </div>
      <div className="setup-footer"><button type="submit" className="primary-button">▷ Lancer la partie</button></div>
    </form> : <Match settings={settings} />}
  </main>
}
