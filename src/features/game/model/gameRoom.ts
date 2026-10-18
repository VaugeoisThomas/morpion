/**
 * Visibilité choisie pour une salle. Cette option est enregistrée en base, mais ne définit pas à
 * elle seule les autorisations d’accès, qui dépendent des règles SQL.
 */
export type GameVisibility = "private" | "public";

/** Nombre de manches prévu pour une partie. */
export type RoundCount = 1 | 3 | 5;

/** Symbole attribué à un joueur. */
export type PlayerSymbol = "X" | "O";

/** Durée prévue pour un tour, en secondes. Le compte à rebours n’est pas encore implémenté. */
export type TurnDuration = 15 | 30 | 60;

/** État d'un salle au cours de son cycle de vie. */
export type GameRoomStatus =
  | "waiting"
  | "in_progress"
  | "finished"
  | "cancelled";
