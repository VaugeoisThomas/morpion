import { useEffect, useRef, useState } from 'react'

import { useAuth } from '../../auth/hooks/useAuth'
import { type GameResult,saveGame } from '../data/games'

interface UseSaveFinishedGameOptions {
  gameId: string
  isGameOver: boolean
  winner: 'X' | 'O' | null
}

interface SaveFeedback {
  key: string
  status: 'saving' | 'success' | 'error'
}

/**
 * Enregistre une partie terminée et permet de retenter en cas d’échec. Toutes les tentatives
 * utilisent le même identifiant de partie.
 */
export function useSaveFinishedGame({
  gameId,
  isGameOver,
  winner,
}: UseSaveFinishedGameOptions) {
  const { user } = useAuth()
  const userId = user?.id

  const [retryCount, setRetryCount] = useState(0)
  const [feedback, setFeedback] = useState<SaveFeedback | null>(null)

  /** Promesse réutilisée lorsque React réexécute le même effet. */
  const attemptRef = useRef<{
    key: string
    retryCount: number
    promise: Promise<void>
  } | null>(null)

  const key = `${gameId}:${userId ?? ''}`
  const result: GameResult =
    winner === 'X' ? 'win' : winner === 'O' ? 'loss' : 'draw'

  useEffect(() => {
    if (!isGameOver || !userId) return

    if (
      attemptRef.current?.key !== key ||
      attemptRef.current.retryCount !== retryCount
    ) {
      attemptRef.current = {
        key,
        retryCount,
        promise: Promise.resolve().then(() =>
          saveGame({
            gameId,
            userId,
            opponentType: 'computer',
            result,
          }),
        ),
      }
    }

    let isActive = true

    void attemptRef.current.promise
      .then(() => {
        if (isActive) {
          setFeedback({ key, status: 'success' })
        }
      })
      .catch(() => {
        if (isActive) {
          setFeedback({ key, status: 'error' })
        }
      })

    return () => {
      isActive = false
    }
  }, [gameId, isGameOver, userId, key, result, retryCount])

  const currentFeedback = feedback?.key === key ? feedback : null
  const canSave = isGameOver && Boolean(userId)
  const hasError = canSave && currentFeedback?.status === 'error'
  const isSaving =
    canSave && (!currentFeedback || currentFeedback.status === 'saving')

  /**
   * Déclenche une nouvelle tentative pour la même partie. Efface immédiatement le message et
   * désactive le bouton.
   */
  function retrySave() {
    if (!hasError || isSaving) return

    setFeedback({ key, status: 'saving' })
    setRetryCount((count) => count + 1)
  }

  return {
    error: hasError
      ? 'La partie est terminée, mais son enregistrement a échoué.'
      : '',
    isSaving,
    retrySave,
  }
}