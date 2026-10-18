import { useState } from "react";

import { useAuth } from "../../auth/hooks/useAuth";
import {
    type CreateGameRoom as CreatedGameRoom,
    createGameRoom,
    type CreateGameRoomInput,
} from '../data/gameRoom'

/**
 * Paramètres de création fournis par le formulaire. Exclut l’identifiant de l’hôte, récupéré
 * depuis le contexte d’authentification.
 */
type GameRoomOption = Omit<CreateGameRoomInput, 'userId'>

/**
 * Gère la création d’une salle pour l’utilisateur connecté. Expose l’état de création, le message
 * d’erreur et les informations de la dernière salle créée.
 *
 * @returns L’action de création, l’état de chargement, l’erreur éventuelle et la dernière salle
 * créée.
 */
export function useCreateRoom() {
    const { user } = useAuth()
    const [isCreating, setIsCreating] = useState(false)
    const [error, setError] = useState('')

    /**
     * Dernière salle créée avec succès par cette instance du hook. Reste mémorisée si une
     * tentative suivante échoue.
     */
    const [createdRoom, setCreatedRoom] = useState<CreatedGameRoom | null>(null)

    /**
     * Tente de créer une salle avec les paramètres fournis. Refuse la création si aucun
     * utilisateur n’est connecté.
     *
     * @param options - Paramètres sélectionnés dans le formulaire.
     * @returns Les informations de la salle créée, ou null si l’utilisateur est déconnecté ou si
     * la création échoue.
     * @todo Refuser une nouvelle création lorsqu’une requête est en cours.
     */
    async function createRoom(options: GameRoomOption) : Promise<CreatedGameRoom | null> {
        if (!user) {
            setError('Connecte-toi pour créer une partie.')
            return null
        }

        setIsCreating(true)
        setError('')

        try {
            const room = await createGameRoom({
                ...options,
                userId: user.id,
            })
            
            setCreatedRoom(room)
            return room
        } catch {
            setError('La partie n\'a pas pu être créée. Rééssaie.')
            return null
        } finally {
            setIsCreating(false)
        }
    }

    return { createRoom, isCreating, error, createdRoom }
}