import RadioChoice from '../../../shared/ui/RadioChoice/RadioChoice'
import GameSymbol from './GameSymbol'

import type {
    GameVisibility,
    PlayerSymbol,
    RoundCount,
    TurnDuration
} from '../model/gameRoom'

import './GameOptionsForm.css'

/** Valeurs affichées et actions disponibles dans le panneau des options. */
interface GameOptionsFormProps {
    /** Visibilité actuellement sélectionnée. */
    visibility: GameVisibility

    /** Modifie la visibilité de la partie. */
    onVisibilityChange: (value: GameVisibility) => void

    /** Nombre de manches sélectionné. */
    roundCount: RoundCount

    /** Modifie le nombre de manches. */
    onRoundCountChange: (value: RoundCount) => void

    /** Nombres de manches proposés. */
    availableRoundCounts: readonly RoundCount[]

    /** Symbole choisi pour l’hôte. */
    playerSymbol: PlayerSymbol

    /** Modifie le symbole de l’hôte. */
    onPlayerSymbolChange: (value: PlayerSymbol) => void

    /** Durée sélectionnée pour chaque tour. */
    turnDuration: TurnDuration

    /** Modifie la durée des tours. */
    onTurnDurationChange: (value: TurnDuration) => void

    /** Durées proposées, en secondes. */
    availableTurnDurations: readonly TurnDuration[]

    /** Classe supplémentaire pour le placement dans la page. */
    className?: string
}

/**
 * Affiche les options de création d’une partie. Les valeurs et leurs modifications sont gérées par
 * la page appelante.
 */
export default function GameOptionsForm({
    visibility,
    onVisibilityChange,
    className = '',
    roundCount,
    onRoundCountChange,
    availableRoundCounts,
    playerSymbol,
    onPlayerSymbolChange,
    turnDuration,
    onTurnDurationChange,
    availableTurnDurations,
}: Readonly<GameOptionsFormProps>) {
    return (
        <section
            className={`game-options-form ${className}`.trim()}
            aria-label="Options de la partie"
        >
            <fieldset className="game-options-form__field game-options-form__field--choices">
                <legend className="game-options-form__field-title">
                    Visibilité de la partie
                </legend>

                <RadioChoice
                    name="visibility"
                    value="private"
                    checked={visibility === 'private'}
                    onChange={() => onVisibilityChange('private')}
                >
                    Privée
                </RadioChoice>

                <RadioChoice
                    name="visibility"
                    value="public"
                    checked={visibility === 'public'}
                    onChange={() => onVisibilityChange('public')}
                >
                    Publique
                </RadioChoice>

                <p className="game-options-form__field-description">
                    {visibility === 'private'
                        ? 'Accessible uniquement avec le code ou le lien.'
                        : 'Visible par les joueurs qui cherchent une partie.'}
                </p>
            </fieldset>

            <fieldset className="game-options-form__field game-options-form__field--choices game-options-form__field--rounds">
                <legend className="game-options-form__field-title">
                    Nombre de manches
                </legend>

                {availableRoundCounts.map((rounds) => (
                    <RadioChoice
                        key={rounds}
                        name="roundCount"
                        value={rounds}
                        checked={roundCount === rounds}
                        onChange={() => onRoundCountChange(rounds)}
                    >
                        {rounds} {rounds === 1 ? 'manche' : 'manches'}
                    </RadioChoice>
                ))}
            </fieldset>

            <fieldset className="game-options-form__field game-options-form__field--choices">
                <legend className="game-options-form__field-title">
                    Ton symbole
                </legend>

                <RadioChoice
                    variant="symbol"
                    name="playerSymbol"
                    value="X"
                    checked={playerSymbol === 'X'}
                    onChange={() => onPlayerSymbolChange('X')}
                >
                    <GameSymbol symbol="X" size="small" />
                    Croix
                </RadioChoice>

                <RadioChoice
                    variant="symbol"
                    name="playerSymbol"
                    value="O"
                    checked={playerSymbol === 'O'}
                    onChange={() => onPlayerSymbolChange('O')}
                >
                    <GameSymbol symbol="O" size="small" />
                    Rond
                </RadioChoice>
            </fieldset>

            <div className="game-options-form__duration">
                <label
                    className="game-options-form__field-label"
                    htmlFor="turn-duration"
                >
                    Temps par tour
                </label>

                <select
                    className="game-options-form__select"
                    id="turn-duration"
                    value={turnDuration}
                    onChange={(e) => {
                        const selectedDuration = availableTurnDurations.find(
                            (duration) => String(duration) === e.target.value,
                        )

                        if (selectedDuration !== undefined) {
                            onTurnDurationChange(selectedDuration)
                        }
                    }}
                >
                    {availableTurnDurations.map((duration) => (
                        <option key={duration} value={duration}>
                            {duration} secondes
                        </option>
                    ))}
                </select>
            </div>
        </section>
    )
}