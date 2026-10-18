import { useEffect, useState } from "react";

import { loadProfile, type SavedProfile } from "../../profile/data/profile";

/**
 * Résultat du chargement du profil d’un joueur. Conserve son identifiant pour éviter d’afficher le
 * profil d’une salle précédente pendant un nouveau chargement.
 */

interface GameRoomPlayerResult {
  /** Identifiant du joueur auquel correspond le résultat. */
  playerId: string;

  /** Profil trouvé, ou null s’il est absent ou inaccessible. */
  profile: SavedProfile | null;

  /** Message affiché si le chargement échoue. */
  error: string;
}

/**
 * Charge le profil du joueur à partir de son identifiant. Ignore les réponses reçues après un
 * changement de joueur ou le démontage du composant.
 */

export function useGameRoomPlayer(playerId: string | undefined) {
  const [result, setResult] = useState<GameRoomPlayerResult | null>(null);

  useEffect(() => {
    if (!playerId) return;
    let isActive = true;

    void loadProfile(playerId)
      .then((profile) => {
        if (isActive) {
          setResult({
            playerId,
            profile,
            error: "",
          });
        }
      })
      .catch(() => {
        if (isActive) {
          setResult({
            playerId,
            profile: null,
            error: "Impossible de charger le profil du joueur.",
          });
        }
      });
    return () => {
      isActive = false;
    };
  }, [playerId]);

  const currentResult =
    playerId !== undefined && result?.playerId === playerId ? result : null;

  return {
    profile: currentResult?.profile ?? null,
    error: currentResult?.error ?? "",
    isLoading: Boolean(playerId) && currentResult === null,
  };
}
