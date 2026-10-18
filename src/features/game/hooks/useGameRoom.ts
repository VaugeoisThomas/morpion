import { useEffect, useState } from "react";

import { supabase } from "../../../shared/lib/supabase";
import { useAuth } from "../../auth/hooks/useAuth";
import { type GameRoomDetails, loadGameRoom } from "../data/gameRoom";

/**
 * Résultat du chargement d’une salle pour un compte donné. Associe chaque réponse aux identifiants
 * de la salle et de l’utilisateur.
 */
type GameRoomLoadState =
  | {
      roomId: string;
      userId: string;
      status: "success";
      room: GameRoomDetails | null;
    }
  | {
      roomId: string;
      userId: string;
      status: "error";
      error: string;
    };

/**
 * Charge la salle du compte connecté et suit ses mises à jour Realtime. Ignore les réponses
 * périmées.
 *
 * @param roomId - Identifiant de la salle, ou undefined si le paramètre est absent.
 * @returns La salle, l’état de chargement et le message d’erreur éventuel.
 */
export function useGameRoom(roomId: string | undefined) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;

  /**
   * Dernier résultat de chargement, ou null avant la première réponse. Une lecture réussie peut
   * contenir une salle null si elle est inexistante ou inaccessible selon les règles SQL.
   */
  const [loadState, setLoadState] = useState<GameRoomLoadState | null>(null);

  /** Erreur de connexion Realtime associée à une salle et à un compte. */
  const [realtimeFailure, setRealtimeFailure] = useState<{
    roomId: string;
    userId: string;
    message: string;
  } | null>(null);

  /**
   * Charge la salle pour le compte connecté. Ignore les réponses reçues après le nettoyage de
   * l’effet, notamment après un changement de salle ou de compte.
   */
  useEffect(() => {
    if (isAuthLoading || !userId || !roomId) return;

    let isActive = true;
    let latestRequestId = 0;

    const refreshRoom = () => {
      if (!isActive) return;
      const requestId = ++latestRequestId;

      void loadGameRoom(roomId)
        .then((room) => {
          if (isActive && requestId === latestRequestId) {
            setLoadState({
              roomId,
              userId,
              status: "success",
              room,
            });
          }
        })
        .catch(() => {
          if (!isActive || requestId !== latestRequestId) return;

          setLoadState((previousState) => {
            const hasLoadedRoom =
              previousState?.roomId === roomId &&
              previousState.userId === userId &&
              previousState.status === "success" &&
              previousState.room !== null;

            if (hasLoadedRoom) {
              return previousState;
            }

            return {
              roomId,
              userId,
              status: "error",
              error: "Impossible de charger cette salle.",
            };
          });
        });
    };
    refreshRoom();

    const channel = supabase
      .channel(`game_room:${roomId}:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_rooms",
          filter: `id=eq.${roomId}`,
        },
        refreshRoom,
      )
      .subscribe((status) => {
        if (!isActive) return;
        if (status === "SUBSCRIBED") {
          setRealtimeFailure(null);
          refreshRoom();
          return;
        }

        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setRealtimeFailure({
            roomId,
            userId,
            message:
              "La connexion en temps réel est interrompue. Les informations peuvent ne plus être à jour.",
          });
        }
      });
    return () => {
      isActive = false;
      void supabase.removeChannel(channel);
    };
  }, [isAuthLoading, roomId, userId]);

  /** Vérifie que le résultat correspond à la salle demandée et au compte actuellement connecté. */
  const hasCurrentResult =
    roomId !== undefined &&
    userId !== undefined &&
    loadState !== null &&
    loadState.roomId === roomId &&
    loadState.userId === userId;

  const room =
    !isAuthLoading && hasCurrentResult && loadState.status === "success"
      ? loadState.room
      : null;

  const error = isAuthLoading
    ? ""
    : !user
      ? "Connecte-toi pour consulter cette salle."
      : hasCurrentResult && loadState.status === "error"
        ? loadState.error
        : "";

  /**
   * Indique que l’authentification charge ou qu’un utilisateur connecté attend encore un résultat
   * pour la salle demandée. Sans roomId, aucune lecture n’est attendue.
   */
  const isLoading =
    isAuthLoading || (Boolean(user && roomId) && !hasCurrentResult);

  /** Expose uniquement l'erreur Realtime de la salle et du compte actuellement connectés. */

  const realTimeError =
    !isAuthLoading &&
    roomId !== undefined &&
    userId !== undefined &&
    realtimeFailure !== null &&
    realtimeFailure.roomId === roomId &&
    realtimeFailure.userId === userId
      ? realtimeFailure.message
      : "";

  return { room, isLoading, error, realTimeError };
}
