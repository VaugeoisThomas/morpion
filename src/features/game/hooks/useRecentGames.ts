import { useEffect, useState } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import { loadRecentGames, type RecentGame } from "../data/games";

/**
 * Résultat du chargement de l’historique pour un utilisateur. Associe chaque réponse à
 * l’identifiant de l’utilisateur concerné et distingue une lecture réussie d’une erreur.
 */
type RecentGamesState = 
    | { userId: string; status: 'success'; games: RecentGame[] }
    | { userId: string; status: 'error'; error: string }


    /**
     * Charge les dernières parties de l’utilisateur connecté. Attend la fin du chargement de
     * l’authentification avant la requête.
     *
     * @returns Les parties récentes, l’état de chargement et le message d’erreur éventuel.
     * @todo Permettre de recharger l’historique à la demande, notamment après l’enregistrement
     * d’une partie.
     */
export function useRecentGames() {
    const { user, isLoading: isAuthLoading } = useAuth()

    /**
     * Dernier résultat reçu, ou null avant la première réponse. Peut conserver le résultat d’un
     * ancien utilisateur ; hasCurrentResult empêche alors son affichage.
     */
    const [requestState, setRequestState] = useState<RecentGamesState | null>(null)


    /**
     * Lance la lecture de l’historique lorsque l’authentification est prête et qu’un utilisateur
     * est connecté. Stocke les parties reçues ou un message d’erreur.
     */
    useEffect(() => {
        if (isAuthLoading || !user) return

        let isActive = true

        void loadRecentGames(user.id)
          .then((games) => {
            if (isActive) {
              setRequestState({ userId: user.id, status: 'success', games })
            }
          })
          .catch(() => {
            if (isActive) {
                setRequestState({
                    userId: user.id,
                    status: 'error',
                    error: 'Impossible de charger les dernières parties.',
                })
            }
          })
        return () => {
            isActive = false
        }
    }, [isAuthLoading, user])


    /**
     * Indique si le résultat mémorisé appartient à l’utilisateur connecté. Évite d’afficher
     * l’historique d’un autre compte.
     */
    const hasCurrentResult = user !== null && requestState?.userId === user.id

    const games = 
      hasCurrentResult && requestState.status === 'success'
      ? requestState.games
      : []
    
    const error = 
      hasCurrentResult && requestState.status === 'error'
      ? requestState.error
      : ''

    /**
     * Indique que l’authentification est en cours de chargement ou qu’aucun résultat n’est encore
     * disponible pour l’utilisateur. Une réponse en erreur termine également le chargement.
     */
      const isLoading = 
        isAuthLoading || (user !== null && !hasCurrentResult)

    return { games, isLoading, error }
}