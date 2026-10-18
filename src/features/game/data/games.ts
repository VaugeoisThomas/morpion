import { supabase } from "../../../shared/lib/supabase";

/** Résultat d’une partie du point de vue de l’utilisateur : victoire, défaite ou match nul. */
export type GameResult = "win" | "loss" | "draw";

/** Type d’adversaire associé à une partie enregistrée. */
export type OpponentType = "computer" | "online";

/**
 * Données d’une partie utilisées pour afficher l’historique. Les propriétés conservent les noms
 * des colonnes Supabase.
 */
export interface RecentGame {
  id: string;
  opponent_type: OpponentType;
  result: GameResult;
  created_at: string;
}

/**
 * Données nécessaires à l’enregistrement d’un résultat. Associe un utilisateur à un type
 * d’adversaire et au résultat obtenu.
 */
interface SaveGameInput {
  gameId: string;
  userId: string;
  opponentType: OpponentType;
  result: GameResult;
}

/** Nombre maximal de parties récupérées pour l’historique récent. */
const RECENT_GAMES_LIMIT = 5;

/**
 * Enregistre une partie sans créer de doublon pour le même identifiant. Ignore l’insertion si
 * l’identifiant existe déjà, puis vérifie que le résultat enregistré correspond aux données
 * demandées.
 *
 * @throws Si l’enregistrement ou sa vérification échoue.
 */
export async function saveGame({
  gameId,
  userId,
  opponentType,
  result,
}: SaveGameInput): Promise<void> {
  const { error } = await supabase.from("games").upsert(
    {
      id: gameId,
      user_id: userId,
      opponent_type: opponentType,
      result,
    },
    {
      onConflict: "id",
      ignoreDuplicates: true,
    },
  );

  if (error) throw error;

  const { data, error: verificationError } = await supabase
    .from("games")
    .select("user_id, opponent_type, result")
    .eq("id", gameId)
    .single();

  if (verificationError) throw verificationError;

  if (
    data.user_id !== userId ||
    data.opponent_type !== opponentType ||
    data.result !== result
  ) {
    throw new Error("Le résultat enregistré ne correspond pas à cette partie.");
  }
}

/**
 * Charge les dernières parties accessibles pour un utilisateur. Trie les enregistrements du plus
 * récent au plus ancien et limite leur nombre à RECENT_GAMES_LIMIT.
 *
 * @param userId - Identifiant de l’utilisateur dont l’historique est demandé.
 * @returns Les parties trouvées, ou un tableau vide si aucune partie accessible ne correspond.
 * @throws Si la requête Supabase échoue.
 */
export async function loadRecentGames(userId: string): Promise<RecentGame[]> {
  const { data, error } = await supabase
    .from("games")
    .select("id, opponent_type, result, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(RECENT_GAMES_LIMIT);

  if (error) throw error;
  return data ?? [];
}

/** Statistique calculées à partir des résultats enregistrés. */

export interface GameStatistics {
  total: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

/**
 * Compte les résultats d’un utilisateur sans charger son historique. Le taux de victoire inclut
 * toutes les parties, matchs nuls compris.
 *
 * @param userId - Identifiant de l’utilisateur concerné.
 * @returns Les compteurs et le taux de victoire arrondi.
 * @throws Si une requête Supabase échoue.
 */

export async function loadGameStatistics(
  userId: string,
): Promise<GameStatistics> {
  const results = await Promise.all(
    (["win", "loss", "draw"] as const).map((result) =>
      supabase
        .from("games")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("result", result),
    ),
  );

  for (const result of results) {
    if (result.error) throw result.error;
  }

  const wins = results[0].count ?? 0;
  const losses = results[1].count ?? 0;
  const draws = results[2].count ?? 0;
  const total = wins + losses + draws;

  return {
    total,
    wins,
    losses,
    draws,
    winRate: total === 0 ? 0 : Math.round((wins / total) * 100),
  };
}
