import { useRef, useState } from "react";

import { playGameRoomMove } from "../data/gameRoom";

/**
 * Gère l'envoi d'un coup dans une salle.
 *
 * @returns L'état de l'envoi, le message d'erreur et la fonction permettant de jouer.
 */

export function usePlayGameRoomMove() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  /** Empêche plusieurs envois simultanés. */
  const isPlayingRef = useRef(false);

  /**
   * Envoie le coup demandé à Supabase.
   *
   * @param roomId - Identifiant de la salle.
   * @param cellIndex - Indice de la case choisie, entre 0 et 8.
   * @returns L'identifiant de la salle, ou null si l'envoi échoue ou qu'un autre envoi est déjà en
   * cours.
   */
  async function playMove(
    roomId: string,
    cellIndex: number,
  ): Promise<string | null> {
    if (isPlayingRef.current) return null;

    isPlayingRef.current = true;
    setIsPlaying(true);
    setError("");

    try {
      return await playGameRoomMove(roomId, cellIndex);
    } catch {
      setError("Impossible de jouer ce coup. Réessaie.");
      return null;
    } finally {
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }
  return { playMove, isPlaying, error };
}
