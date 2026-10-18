import type { ComponentPropsWithoutRef, ReactNode } from "react";

import './RadioChoice.css'

/**
 * Propriétés d'un choix radio et de son contenu. Conserve les propriétés natives de l'input,
 * notamment name, value, checked, onChange et disabled.
 */

type RadioChoiceProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'children'> & {
    /** Texte ou éléments affichés à côté du champ radio. */
    children: ReactNode

    /** Adapte la présentation aux choix contenant un symbole */
    variant?: 'default' | 'symbol'
}

/**
 * Affiche un choix radio avec un texte ou un contenu personnalisé. Le label permet de sélectionner
 * le choix en cliquant sur son contenu.
 */

export default function RadioChoice({
    children,
    variant = 'default',
    checked,
    disabled,
    className = '',
    ...props
}: Readonly<RadioChoiceProps>) {
    return (
        <label className={
            variant === 'symbol'
                ? 'radio-choice radio-choice--symbol'
                : 'radio-choice'
        }>
            <input
                {...props}
                type="radio"
                className={`radio-choice__input ${className}`.trim()}
                checked={checked}
                disabled={disabled}
            />
            <span className="radio-choice__content">{children}</span>
        </label>
    )
}