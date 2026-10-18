import { useState } from "react";

import type {
    GameVisibility,
    PlayerSymbol,
    RoundCount,
    TurnDuration,
} from '../model/gameRoom'

/** Nombres de manches proposés dans le formulaire de création. */
const AVAILABLE_ROUND_COUNTS: readonly RoundCount[] = [1, 3, 5]

/** Durées de tour proposées dans le formulaire, en secondes. */
const AVAILABLE_TURN_DURATIONS: readonly TurnDuration[] = [15, 30, 60]


/**
 * Gère les paramètres sélectionnés pour créer une salle. Initialise une salle privée de trois
 * manches, avec le symbole "X" pour l’hôte et des tours de trente secondes.
 *
 * @returns Les options sélectionnées, leurs fonctions de modification et les listes des nombres de
 * manches et durées disponibles.
 */
export function useCreateGameOptions() {
    const [visibility, setVisibility] = useState<GameVisibility>('private')
    const [roundCount, setRoundCount] = useState<RoundCount>(3)
    const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>('X')
    const [turnDuration, setTurnDuration] = useState<TurnDuration>(30)

    return { 
        visibility, 
        setVisibility, 
        roundCount, 
        setRoundCount, 
        availableRoundCounts: AVAILABLE_ROUND_COUNTS,
        playerSymbol,
        setPlayerSymbol,
        turnDuration,
        setTurnDuration,
        availableTurnDurations: AVAILABLE_TURN_DURATIONS,
    }
}