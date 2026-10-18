import { describe, expect, test } from "vitest";

import { getGameRoomStatusMessage } from "./getGameRoomStatusMessage";

/**
 * Données communes d’une salle en attente sans invité. Copier cet objet avant de redéfinir les
 * propriétés d’un scénario.
 */
const baseOptions: Parameters<typeof getGameRoomStatusMessage>[0] = {
  status: "waiting",
  hasGuest: false,
  hostSymbol: "X",
  currentTurn: "X",
  playerSymbol: "X",
  winner: null,
  isDraw: false,
  hostName: "Tigrou",
  guestName: "Invité",
  hostScore: 0,
  guestScore: 0,
};

describe("getGameRoomStatusMessage", () => {
  /** Vérifie le message d’attente sans invité. */
  test("affiche un message d'attente quand aucun invité n'a rejoint la salle", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
    });
    expect(message).toBe("En attente d'un adversaire...");
  });

  /** Vérifie que la salle complète reste en attente du démarrage. */
  test("annonce la présence des deux joueurs dans une salle en attente", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      hasGuest: true,
    });
    expect(message).toBe("Les deux joueurs ont rejoint la salle.");
  });

  /** Vérifie le message du tour courant lorsque le joueur connecté joue X. */
  test("annonce le tour du joueur connecté", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "in_progress",
      hasGuest: true,
    });
    expect(message).toBe("À toi de jouer (X).");
  });

  /** Vérifie que le joueur O attend le tour de son adversaire X. */
  test("annonce le tour de l'adversaire", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "in_progress",
      hasGuest: true,
      playerSymbol: "O",
    });
    expect(message).toBe("Au tour du joueur X.");
  });

  /** Vérifie que la victoire de manche de l’hôte affiche son pseudo. */
  test("annonce le pseudo de l'hôte gagnant de la manche", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "in_progress",
      hasGuest: true,
      winner: "X",
    });
    expect(message).toBe("Tigrou remporte la manche.");
  });

  /** Vérifie que la victoire de manche de l’invité affiche son pseudo. */
  test("annonce le pseudo de l'invité gagnant de la manche", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "in_progress",
      hasGuest: true,
      winner: "O",
    });
    expect(message).toBe("Invité remporte la manche.");
  });

  /** Vérifie le message d’une manche nulle dans une partie encore en cours. */
  test("annonce une manche nulle", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "in_progress",
      hasGuest: true,
      isDraw: true,
    });
    expect(message).toBe("Manche terminée : match nul.");
  });

  /** Vérifie que l’hôte remporte la partie lorsque son score final est supérieur. */
  test("annonce la victoire globale de l'hôte", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "finished",
      hasGuest: true,
      hostScore: 2,
      guestScore: 1,
    });
    expect(message).toBe("Tigrou remporte la partie !");
  });

  /** Vérifie que l’invité remporte la partie lorsque son score final est supérieur. */
  test("annonce la victoire globale de l'invité", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "finished",
      hasGuest: true,
      hostScore: 1,
      guestScore: 2,
    });
    expect(message).toBe("Invité remporte la partie !");
  });

  /** Vérifie qu’une partie terminée avec des scores identiques annonce une égalité globale. */
  test("annonce l'égalité globale", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "finished",
      hasGuest: true,
      hostScore: 1,
      guestScore: 1,
    });
    expect(message).toBe("Partie terminée: égalité.");
  });

  /** Vérifie qu’une salle annulée annonce l’annulation de la partie. */
  test("annonce l'annulation de la partie", () => {
    const message = getGameRoomStatusMessage({
      ...baseOptions,
      status: "cancelled",
    });
    expect(message).toBe("La partie a été annulée.");
  });
});
