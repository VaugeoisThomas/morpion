import { createContext } from "react";

import type { SavedProfile } from "../../profile/data/profile";
import type { User } from "@supabase/supabase-js";

/** État partagé de l’authentification et du profil. */
export interface AuthState {
  /** Utilisateur de la session, ou null en l’absence de connexion. */
  user: User | null
  /** Profil chargé, ou null s’il est absent, non chargé ou si sa lecture a échoué. */
  profile: SavedProfile | null

  /** Erreur de lecture du profil, ou null si aucune erreur n'est signalée. */
  profileError: string | null

  /** Indique que la session ou son profil est en cours de chargement. */
  isLoading: boolean
}

export interface AuthContextValue extends AuthState {
  refreshProfile: () => Promise<void>
}

/**
 * Contexte partagé par AuthProvider et les composants utilisant useAuth. La valeur par défaut null
 * permet à useAuth de détecter une utilisation en dehors du provider.
 */
export const AuthContext = createContext<AuthContextValue | null>(null)
