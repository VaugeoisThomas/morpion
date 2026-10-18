import { Link, useParams } from 'react-router-dom'

import { paths } from '../../../../app/routes'
import Button from '../../../../shared/ui/Button/Button'
import { useAuth } from '../../../auth/hooks/useAuth'
import { avatars } from '../../../profile/data/profile'
import GameBoard from '../../components/GameBoard'
import GameRoomInvitation from '../../components/GameRoomInvitation'
import GameRoomPlayerCard from '../../components/GameRoomPlayerCard'
import GameRoomScoreboard from '../../components/GameRoomScoreboard'
import GameRoomStatus from '../../components/GameRoomStatus'
import { useCopyGameCode } from '../../hooks/useCopyGame'
import { useGameRoom } from '../../hooks/useGameRoom'
import { useGameRoomPlayer } from '../../hooks/useGameRoomPlayer'
import { usePlayGameRoomMove } from '../../hooks/usePlayGameRoomMove'
import { useStartGameRoom } from '../../hooks/useStartGameRoom'
import { useStartNextGameRoomRound } from '../../hooks/useStartNextGameRoomRound'
import { getGameRoomStatusMessage } from '../../model/getGameRoomStatusMessage'
import { findWinner } from '../../model/morpion'

import type { PlayerSymbol } from '../../model/gameRoom'

import './GameRoom.css'

/**
 * Affiche la salle multijoueur et ses mises à jour Realtime. Les coups et changements de manche
 * sont validés en base.
 */
export default function GameRoom() {
  const { roomId } = useParams()
  const { user } = useAuth();

  const { startNextRound, isStartingNextRound, error: nextRoundError, } = useStartNextGameRoomRound()
  const { startRoom, isStarting, error: startError, } = useStartGameRoom()
  const { room, isLoading, error, realTimeError } = useGameRoom(roomId)
  const { playMove, isPlaying, error: moveError } = usePlayGameRoomMove()
  const { copyCode, isCopied, error: copyError } = useCopyGameCode()
  const { profile: hostProfile, isLoading: isHostLoading, error: hostError } = useGameRoomPlayer(room?.hostId)
  const { profile: guestProfile, isLoading: isGuestLoading, error: guestError, } = useGameRoomPlayer(room?.guestId ?? undefined)

  const hostName = hostProfile?.username ?? 'Hôte'
  const hostAvatar = hostProfile?.avatar ?? avatars[0].id


  if (isLoading || isHostLoading) {
    return (
      <main className="game-room">
        <h1 className="game-room__title">Salle d'attente</h1>
      </main>
    )
  }

  if (error) {
    return (
      <main className="game-room">
        <h1 className="game-room__title">Salle d'attente</h1>
        <p className="game-room__error" role="alert">{error}</p>
      </main>
    )
  }

  if (!room) {
    return (
      <main className="game-room">
        <h1 className="game-room__title">Salle introuvable</h1>
        <p className="game-room__status">
          Cette salle n'existe pas ou tu n'as pas accès à celle-ci.
        </p>
      </main>
    )
  }
  const guestSymbol = room.hostSymbol === "X" ? 'O' : "X"
  let playerSymbol: PlayerSymbol | null = null

  if (user?.id === room.hostId) {
    playerSymbol = room.hostSymbol
  } else if (user?.id === room.guestId) {
    playerSymbol = guestSymbol
  }

  const winner = findWinner(room.board)
  const isDraw = winner === null && room.board.every((cell) => cell !== null)
  const isRoundOver = winner !== null || isDraw

  const canPlay =
    room.status === 'in_progress' &&
    room.guestId !== null &&
    playerSymbol !== null &&
    room.currentTurn === playerSymbol &&
    !isRoundOver &&
    !isPlaying &&
    !realTimeError

  let hostStatus = "Hôte de la partie"
  if (hostError) {
    hostStatus = hostError
  } else if (!hostProfile) {
    hostStatus = "Profil de l'hôte indisponible."
  }

  const guestName = guestProfile?.username ?? "Invité"
  const guestAvatar = guestProfile?.avatar ?? avatars[0].id

  let guestStatus = "En attente..."

  if (room.guestId) {
    if (isGuestLoading) {
      guestStatus = "Chargement du profil..."
    } else if (guestError) {
      guestStatus = guestError
    } else if (!guestProfile) {
      guestStatus = "Profil du joueur indisponible."
    } else {
      guestStatus = "A rejoint la salle"
    }
  }

  const roomStatusMessage = getGameRoomStatusMessage({
    status: room.status,
    hasGuest: Boolean(room.guestId),
    hostSymbol: room.hostSymbol,
    currentTurn: room.currentTurn,
    playerSymbol: playerSymbol,
    winner: winner,
    isDraw: isDraw,
    hostName: hostName,
    guestName: guestName,
    hostScore: room.hostScore,
    guestScore: room.guestScore
  })

  return (
    <main className="game-room">
      <nav className="game-room__navigation" aria-label='Navigation de la salle'>
        <Link className='game-room__back' to={paths.home}>
          Retour à l'accueil
        </Link>
      </nav>

      <h1 className="game-room__title">Salle d'attente</h1>

      {realTimeError && (
        <p className="game-room__error" role="alert">
          {realTimeError}
        </p>
      )}
      <section className="game-room__players" aria-label="Joueurs">
        <GameRoomPlayerCard
          title="Joueur 1"
          name={hostName}
          avatarId={hostAvatar}
          status={hostStatus}
          symbol={room.hostSymbol}
          isOccupied
          hasError={Boolean(hostError)}
        />
        <span className="game-room__versus" aria-hidden="true">VS</span>
        <GameRoomPlayerCard
          title="Joueur 2"
          name={guestName}
          avatarId={guestAvatar}
          status={guestStatus}
          symbol={guestSymbol}
          isOccupied={Boolean(room.guestId)}
          hasError={Boolean(guestError)}
        />
      </section>
      {(room.status === "in_progress" || room.status === "finished") && (
        <GameRoomScoreboard
          currentRound={room.currentRound}
          roundCount={room.roundCount}
          hostName={hostName}
          guestName={guestName}
          hostScore={room.hostScore}
          guestScore={room.guestScore}
        />
      )}
      {(room.status === 'in_progress' || room.status === 'finished') && (
        <>
          <GameBoard
            board={room.board}
            disabled={!canPlay}
            onPlay={(index) => {
              if (!canPlay) return;
              void playMove(room.id, index);
            }}
          />

          {moveError && (
            <p className="game-room__error" role="alert">
              {moveError}
            </p>
          )}
        </>
      )}
      <GameRoomInvitation
        inviteCode={room.inviteCode}
        roundCount={room.roundCount}
        turnDuration={room.turnDuration}
        canCopy={room.status === "waiting"}
        isCopied={isCopied}
        copyError={copyError}
        onCopy={() => {
          const roomPath = paths.room.replace(':roomId', room.id)
          const invitationUrl = new URL(roomPath, window.location.origin).href
          void copyCode(invitationUrl)
        }}
      />
      <GameRoomStatus
        message={roomStatusMessage}
        showLoader={room.status === 'waiting' && !room.guestId}
      />

      {user?.id === room.hostId && room.status === 'waiting' && (
        <div className="game-room__actions">
          <Button
            isLoading={isStarting}
            disabled={!room.guestId}
            onClick={() => { void startRoom(room.id) }}
          >
            {isStarting ? 'Démarrage...' : 'Démarrer la partie'}
          </Button>
          {startError && (
            <p className="game-room__error" role="alert">{startError}</p>
          )}
        </div>
      )}
      {user?.id === room.hostId &&
        room.status === 'in_progress' &&
        room.guestId !== null &&
        isRoundOver &&
        room.currentRound < room.roundCount && (
          <div className="game-room__actions">
            <Button
              isLoading={isStartingNextRound}
              disabled={Boolean(realTimeError)}
              onClick={() => { void startNextRound(room.id) }}
            >
              {isStartingNextRound ? 'Démarrage...' : 'Manche suivante'}
            </Button>

            {nextRoundError && (
              <p className="game-room__error" role="alert">{nextRoundError}</p>
            )}
          </div>
        )}
    </main>
  )
}
