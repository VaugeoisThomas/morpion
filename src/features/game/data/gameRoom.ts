import { supabase } from "../../../shared/lib/supabase";

import type {
  GameRoomStatus,
  GameVisibility,
  PlayerSymbol,
  RoundCount,
  TurnDuration,
} from "../model/gameRoom";
import type { CellValue } from "../model/morpion";

/**
 * Options nécessaires à la création d’une salle. Associe l’utilisateur hôte aux paramètres choisis
 * : visibilité, nombre de manches, symbole et durée des tours.
 */
export interface CreateGameRoomInput {
  userId: string;
  visibility: GameVisibility;
  roundCount: RoundCount;
  hostSymbol: PlayerSymbol;
  turnDuration: TurnDuration;
}

/**
 * Informations d’une salle utilisées dans l’interface. Contient son identifiant, son code
 * d’invitation, l’identifiant de l’hôte, ses options et son état.
 */
export interface GameRoomDetails extends CreateGameRoom {
  hostId: string;
  visibility: GameVisibility;
  roundCount: RoundCount;
  hostSymbol: PlayerSymbol;
  turnDuration: TurnDuration;
  status: GameRoomStatus;
  guestId: string | null;
  board: CellValue[];
  currentTurn: PlayerSymbol;
  currentRound: number;
  hostScore: number;
  guestScore: number;
}

/**
 * Identifiant et code d’invitation d’une salle. Constitue notamment le résultat retourné après sa
 * création.
 */
export interface CreateGameRoom {
  id: string;
  inviteCode: string;
}

/**
 * Recherche une salle par son identifiant dans Supabase. Convertit les noms des colonnes SQL en
 * propriétés utilisées par l’application.
 *
 * @param roomId - Identifiant de la salle recherchée.
 * @returns Les informations de la salle, ou null si aucune salle accessible ne correspond.
 * @throws Si la requête Supabase échoue.
 */
export async function loadGameRoom(
  roomId: string,
): Promise<GameRoomDetails | null> {
  const { data, error } = await supabase
    .from("game_rooms")
    .select(
      "id, host_id, invite_code, visibility, round_count, host_symbol, turn_duration, status, guest_id, board, current_turn, current_round, host_score, guest_score",
    )
    .eq("id", roomId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    hostId: data.host_id,
    inviteCode: data.invite_code,
    visibility: data.visibility,
    roundCount: data.round_count,
    hostSymbol: data.host_symbol,
    turnDuration: data.turn_duration,
    status: data.status,
    guestId: data.guest_id,
    board: data.board,
    currentTurn: data.current_turn,
    currentRound: data.current_round,
    hostScore: data.host_score,
    guestScore: data.guest_score,
  };
}

/** Nombre de caractères dans chaque groupe du code d’invitation. */
const INVITE_CODE_PART_LENGTH = 4;

/** Nombre total de caractères du code, sans le tiret séparateur. */
const INVITE_CODE_LENGTH = INVITE_CODE_PART_LENGTH * 2;

/**
 * Génère un code d’invitation à partir d’un UUID aléatoire. Conserve huit caractères hexadécimaux
 * en majuscules, répartis en deux groupes de quatre séparés par un tiret. Ne vérifie pas si le
 * code existe déjà dans la base.
 *
 * @returns Un code au format "AB12-CD34".
 */
function createInviteCode(): string {
  const rawCode = crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, INVITE_CODE_LENGTH)
    .toUpperCase();

  return `${rawCode.slice(0, INVITE_CODE_PART_LENGTH)}-${rawCode.slice(INVITE_CODE_PART_LENGTH)}`;
}

/**
 * Crée une salle avec les options fournies et un code d’invitation. La base attribue l’identifiant
 * et l’état initial "waiting".
 *
 * @param options - Identifiant de l’hôte et paramètres de la partie.
 * @returns L’identifiant et le code d’invitation de la salle créée.
 * @throws Si l’insertion ou la récupération de la salle échoue, notamment si le code généré existe
 * déjà.
 * @todo Générer un nouveau code et retenter l’insertion en cas de collision sur le code
 * d’invitation.
 */

export async function createGameRoom(
  options: CreateGameRoomInput,
): Promise<CreateGameRoom> {
  const inviteCode = createInviteCode();

  const { data, error } = await supabase
    .from("game_rooms")
    .insert({
      host_id: options.userId,
      invite_code: inviteCode,
      visibility: options.visibility,
      round_count: options.roundCount,
      host_symbol: options.hostSymbol,
      turn_duration: options.turnDuration,
    })
    .select("id, invite_code")
    .single();

  if (error) throw error;

  return {
    id: data.id,
    inviteCode: data.invite_code,
  };
}

/**
 * Rejoint une salle avec son code d'invitation. La base identifie l'utilisateur connecté et
 * vérifie si la seconde place peut lui être attribuée.
 *
 * @param inviteCode - Code d'invitation de la salle.
 * @returns L'identifiant de la salle rejointe.
 * @throws Si la demande échoue ou si l'identifiant retourné est invalide.
 */
export async function joinGameRoom(inviteCode: string): Promise<string> {
  const { data, error } = await supabase.rpc("join_game_room", {
    p_invite_code: inviteCode,
  });

  if (error) throw error;
  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Identifiant de la salle invalide.");
  }

  return data;
}

/**
 * Demande le démarrage d'une salle. La base vérifie que l'utilisateur connecté est l'hôte que le
 * second joueur est inscrit et que la salle attend.
 *
 * @param roomId - Identifiant de la salle à démarrer.
 * @returns L'identifiant de la salle démarrée.
 * @throws Si le démarrage échoue ou si le résultat est invalide.
 */

export async function startGameRoom(roomId: string): Promise<string> {
  const { data, error } = await supabase.rpc("start_game_room", {
    p_room_id: roomId,
  });

  if (error) throw error;
  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Identifiant de la salle invalide.");
  }

  return data;
}

/**
 * Demande à jouer un coup dans une salle. La base vérifie le joueur, son tour, la disponibilité de
 * la case et si la manche peut encore être jouée.
 *
 * @param roomId - Identifiant de la salle.
 * @param cellIndex - Indice de la case choisie, entre 0 et 8.
 * @returns L'identifiant de la salle mise à jour.
 * @throws Si le coup est refusé ou si le résultat est invalide.
 */

export async function playGameRoomMove(
  roomId: string,
  cellIndex: number,
): Promise<string> {
  const { data, error } = await supabase.rpc("play_game_room_move", {
    p_room_id: roomId,
    p_cell_index: cellIndex,
  });

  if (error) throw error;

  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Identifiant de salle invalide.");
  }

  return data;
}

/**
 * Demande le démarrage de la manche suivante. La base vérifie que l’utilisateur connecté est
 * l’hôte, que la manche actuelle est terminée et qu’il en reste à jouer.
 *
 * @param roomId - Identifiant de la salle.
 * @returns L’identifiant de la salle mise à jour.
 * @throws Si la demande est refusée ou si le résultat est invalide.
 */

export async function startNextGameRoomRound(roomId: string): Promise<string> {
  const { data, error } = await supabase.rpc("start_next_game_room_round", {
    p_room_id: roomId,
  });

  if (error) throw error;

  if (typeof data !== "string" || data.length === 0) {
    throw new Error("Identifiant de la salle invalide.");
  }
  return data;
}
