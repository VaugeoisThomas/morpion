import ProfileAvatar from '../../../profile/components/ProfileAvatar/ProfileAvatar'

import type { AvatarId } from '../../../profile/data/avatars'

import './GameHostSummary.css'

interface GameHostSummaryProps {
    /** Identifiant de l’avatar représentant l’hôte de la partie. */
    avatarId: AvatarId

    /** Nom affiché pour l'hôte. */
    name: string

    /** Message décrivant le statut de l'hôte. */
    status: string

    /** Classe supplémentaire pour le placement dans la page */
    className?: string
}

/**
 * Affiche l'avatar, le nom et le statut de l'hôte. Les informations sont fournies par la page
 * appelante.
 */

export default function GameHostSummary({
    avatarId,
    name,
    status,
    className = '',
}: Readonly<GameHostSummaryProps>) {
    return (
        <section
            className={`game-host-summary ${className}`.trim()}
            aria-label="Hôte de la partie">
            <ProfileAvatar avatarId={avatarId} className="game-host-summary__avatar" decorative />
            <div className="game-host-summary__details">
                <strong className="game-host-summary__name">{name}</strong>
                <p className="game-host-summary__status">{status}</p>
            </div>
        </section>
    )
}