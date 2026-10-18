import type { ComponentPropsWithRef } from "react";

import './Button.css'

type ButtonProps = ComponentPropsWithRef<'button'> & {
    /** Apparance du bouton */
    variant?: 'primary' | 'secondary' | 'text' | 'danger'

    /** Désactive le bouton et signale une opération en cours. */
    isLoading?: boolean
}

/**
 * Affiche un bouton d'action réutilisable. Utilise le type "button" par défaut pour éviter une
 * soumission involontaire dans un formulaire.
 */

export default function Button ({
    variant = 'primary',
    isLoading = false,
    type = 'button',
    disabled = false,
    className = '',
    children,
    'aria-busy': ariaBusy,
    ...props
}: Readonly<ButtonProps>)  {
    const classes = [
        'button',
        `button--${variant}`,
        className,
    ].filter(Boolean).join(' ')

    return (
        <button
            {...props}
            type={type}
            className={classes}
            disabled={disabled || isLoading}
            aria-busy={isLoading || ariaBusy}
        >
            {children}
        </button>
    )
}

