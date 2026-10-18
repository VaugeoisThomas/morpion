import Button from "../../../../shared/ui/Button/Button"

import type { RoundCount, TurnDuration } from "../../model/gameRoom"

import "./GameRoomInvitation.css";

/**
 * Code, options et état de copie de l’invitation. copyError est vide sans erreur ; onCopy ne
 * reçoit aucun argument.
 */
interface GameRoomInvitationProps {
    inviteCode: string,
    roundCount: RoundCount,
    turnDuration: TurnDuration,
    canCopy: boolean,
    isCopied: boolean,
    copyError: string,
    onCopy: () => void,
}
/**
 * Affiche l’invitation et le retour de copie. Appelle onCopy ; le bouton est désactivé si canCopy
 * vaut false.
 */

export default function GameRoomInvitation({
    inviteCode,
    roundCount,
    turnDuration,
    canCopy,
    isCopied,
    copyError,
    onCopy,
}: Readonly<GameRoomInvitationProps>) {
    return (
        <section className="game-room-invitation" aria-label="Invitation à la partie">
            <p className="game-room-invitation__label">Code de la partie</p>
            <p className="game-room-invitation__code">{inviteCode}</p>
            <Button
                className="game-room-invitation__copy-button"
                variant="secondary"
                disabled={!canCopy}
                onClick={onCopy}
            >
                <img src="/figma/waiting-room/link.svg" alt="" aria-hidden="true" />
                {isCopied ? 'Lien copié' : 'Copier le lien'}
            </Button>
            <p className="game-room-invitation__detail">
                {roundCount} {roundCount === 1 ? 'manche' : 'manches'}
                {' · '}
                {turnDuration} secondes par tour
            </p>
            {isCopied && (
                <output className="game-room-invitation__feedback">
                    Lien copié dans le presse-papiers
                </output>
            )}
            {copyError && (
                <p className="game-room-invitation__error" role="alert">
                    {copyError}
                </p>
            )}
        </section>
    )
}
