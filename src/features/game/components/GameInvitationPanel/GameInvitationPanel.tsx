import { CirclePlus } from "lucide-react"

import GameSymbol from "../GameSymbol/GameSymbol"

import './GameInvitationPanel.css'

interface GameInvitationPanelProps {
    /** Texte décrivant les conditions d’accès à la partie. */
    description: string

    /** Classe supplémentaire pour le placement dans la page. */
    className?: string
}

/**
 * Présente l’invitation à une partie et ses conditions d’accès. La description et les classes de
 * placement sont fournies par la page.
 */
export default function GameInvitationPanel({
    description,
    className = '',
}: Readonly<GameInvitationPanelProps>) {
    return (
        <section className={`game-invitation-panel ${className}`.trim()}>
            <span className="game-invitation-panel__icon" aria-hidden="true">
                <CirclePlus size={32} />
            </span>

            <h2 className="game-invitation-panel__title">
                Invite un ami et lance le défi.
            </h2>

            <p className="game-invitation-panel__description">
                {description}
            </p>

            <div className="game-invitation-panel__symbols" aria-hidden="true">
                <GameSymbol symbol="X" />
                <GameSymbol symbol="O" />
            </div>
        </section>
    )
}