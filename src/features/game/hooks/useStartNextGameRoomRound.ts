import { useRef, useState } from "react";

import { startNextGameRoomRound } from "../data/gameRoom";

/**
 * Gère la demande de démarrage de la manche suivante.
 *
 * @returns La fonction de démarrage, son état de chargement et le message d’erreur éventuel.
 */
export function useStartNextGameRoomRound() {
  const [isStartingNextRound, setIsStartingNextRound] = useState(false);
  const [error, setError] = useState("");

  /** Empêche plusieurs demandes simultanées. */
  const isStartingRef = useRef(false);

  /**
   * Demande à Supabase de préparer la manche suivante.
   *
   * @param roomId - Identifiant de la salle.
   * @returns L’identifiant de la salle, ou null en cas d’échec ou si une demande est déjà en
   * cours.
   */
  async function startNextRound(roomId: string): Promise<string | null> {
    if (isStartingRef.current) return null;

    isStartingRef.current = true;
    setIsStartingNextRound(true);
    setError("");

    try {
      return await startNextGameRoomRound(roomId);
    } catch {
      setError("Impossible de démarrer la manche suivante. Réessaie.");
      return null;
    } finally {
      isStartingRef.current = false;
      setIsStartingNextRound(false);
    }
  }

  return { startNextRound, isStartingNextRound, error };
}
