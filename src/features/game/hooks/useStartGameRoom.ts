import { useRef, useState } from "react";

import { startGameRoom } from "../data/gameRoom";

/**
 * Gère la demande de démarrage d'une salle.
 *
 * @returns L'état du démarrage, le message d'erreur et la fonction permettant de démarrer la
 * salle.
 */

export function useStartGameRoom() {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  /** Empêche plusieurs demandes simultanées. */
  const isStartingRef = useRef(false);

  /**
   * Demande le démarrage de la salle.
   *
   * @param roomId - Identifiant de la salle à démarrer.
   * @returns L'identifiant de la salle, ou null si la demande échoue ou qu'un démarrage est déjà
   * en cours.
   */

  async function startRoom(roomId: string): Promise<string | null> {
    if (isStartingRef.current) return null;
    isStartingRef.current = true;
    setIsStarting(true);
    setError("");

    try {
      return await startGameRoom(roomId);
    } catch {
      setError("Impossible de démarrer la partie. Réessaie.");
      return null;
    } finally {
      isStartingRef.current = false;
      setIsStarting(false);
    }
  }
  return { startRoom, isStarting, error };
}
