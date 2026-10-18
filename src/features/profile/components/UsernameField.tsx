import './UsernameField.css'

/** Propriétés du champ de saisie du pseudo */
interface UsernameFieldProps {
    /** Identifiant reliant le label et le champ. */
    id: string

    /** Pseudo actuellement saisi. */
    value: string

    /** Fonction appelée lorsque le pseudo change */
    onChange: (value: string) => void

    /** Text indicatif lorsque le champ est vide */
    placeholder?: string

    /** Affiche les règles de saisie sous le champ. */
    showHint?: boolean
}
/**
 * Affiche un champ de pseudo controlé par le formulaire parent. Applique les contraintes de saisie
 * et affiche une aide facultative, reliée au champ pour les technologies d'assistances.
 */

export default function UsernameField({
    id,
    value,
    onChange,
    placeholder,
    showHint = true,
}: Readonly<UsernameFieldProps>) {
    const hintId = `${id}-hint`

    return (
        <div className="username-field">
            <label htmlFor={id} className="username-field__label">
                Ton pseudo
            </label>
            <input
                id={id}
                className="username-field__input"
                type="text"
                value={value}
                minLength={3}
                maxLength={16}
                pattern="[A-Za-z0-9_]{3,16}"
                autoComplete="nickname"
                placeholder={placeholder}
                aria-describedby={showHint ? hintId : undefined}
                required
                onChange={(e) => onChange(e.target.value)}
            />

            {showHint && (
                <small id={hintId} className="username-field__hint">
                    3 à 16 caractères: lettres, chiffres, et _
                </small>
            )}
        </div>
    )
}