import { useRef, useState } from "react";

import { joinGameRoom } from "../data/gameRoom";

/**
 * Gère la demande pour rejoindre une salle.
 *
 * @returns L'état de la demande, le message d'erreur et la fonction permettant de rejoindre une
 * salle.
 */

export function useJoinGameRoom() {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  /** Empêche plusieurs demandes simultanées. */
  const isJoiningRef = useRef(false);

  /**
   * Demande à rejoindre une salle avec son code.
   *
   * @param inviteCode - Code d'invitation saisi.
   * @returns L'identifiant de la salle, ou null si la demande échoue ou qu'une autre demande est
   * déjà en cours.
   */
  async function joinRoom(inviteCode: string): Promise<string | null> {
    if (isJoiningRef.current) return null;

    isJoiningRef.current = true;
    setIsJoining(true);
    setError("");

    try {
      return await joinGameRoom(inviteCode);
    } catch {
      setError(
        "Impossible de rejoindre cette salle. Vérifie le code et réessaie.",
      );
      return null;
    } finally {
      isJoiningRef.current = false;
      setIsJoining(false);
    }
  }

  return { joinRoom, isJoining, error };
}
