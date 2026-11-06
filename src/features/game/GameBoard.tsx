import { getResult } from './game'
import type { Board, Symbol } from './game'

export function SymbolImage({ symbol }: Readonly<{ symbol: Symbol }>) {
  return <span className={`game-symbol game-symbol--${symbol}`} aria-hidden="true">
    <img src={`/figma/game/${symbol === 'X' ? 'cross' : 'circle'}.svg`} alt="" />
  </span>
}

export default function GameBoard({ board, disabled, onPlay }: Readonly<{
  board: Board; disabled: boolean; onPlay: (index: number) => void
}>) {
  const result = getResult(board)
  return <div className="game-board" role="group" aria-label="Grille de morpion, trois lignes et trois colonnes">
    {board.map((cell, index) => {
      const winning = result.status === 'won' && result.line.includes(index)
      return <button key={index} type="button" className={`game-cell ${winning ? 'game-cell--winning' : ''}`}
        disabled={disabled || cell !== null}
        aria-label={`Ligne ${Math.floor(index / 3) + 1}, colonne ${index % 3 + 1} : ${cell ?? 'vide'}`}
        onClick={() => onPlay(index)}>{cell !== null && <SymbolImage symbol={cell} />}</button>
    })}
  </div>
}
