import type { GameRoomStatus, PlayerSymbol } from "./gameRoom";
/** État de la salle, joueurs et résultats nécessaires au message de statut. */

interface GameRoomStatusMessageOptions {
  status: GameRoomStatus;
  hasGuest: boolean;
  hostSymbol: PlayerSymbol;
  currentTurn: PlayerSymbol;
  playerSymbol: PlayerSymbol | null;
  winner: PlayerSymbol | null;
  isDraw: boolean;
  hostName: string;
  guestName: string;
  hostScore: number;
  guestScore: number;
}

/**
 * Retourne le message adapté à l’état de la salle, au résultat ou au tour courant.
 *
 * @param options - État de la salle, résultats et informations des joueurs.
 * @returns Le message à afficher dans la salle.
 */

export function getGameRoomStatusMessage(
  options: Readonly<GameRoomStatusMessageOptions>,
): string {
  if (options.status === "cancelled") {
    return "La partie a été annulée.";
  }

  if (options.status === "waiting") {
    return options.hasGuest
      ? "Les deux joueurs ont rejoint la salle."
      : "En attente d'un adversaire...";
  }

  if (options.status === "finished") {
    if (options.hostScore === options.guestScore) {
      return "Partie terminée: égalité.";
    }
    const winnerName =
      options.hostScore > options.guestScore
        ? options.hostName
        : options.guestName;

    return `${winnerName} remporte la partie !`;
  }

  if (options.winner !== null) {
    const roundWinnerName =
      options.winner === options.hostSymbol
        ? options.hostName
        : options.guestName;

    return `${roundWinnerName} remporte la manche.`;
  }

  if (options.isDraw) {
    return "Manche terminée : match nul.";
  }

  return options.currentTurn === options.playerSymbol
    ? `À toi de jouer (${options.currentTurn}).`
    : `Au tour du joueur ${options.currentTurn}.`;
}
