import './GameRoomStatus.css';

/** Message de statut et visibilité de l’indicateur d’attente. */

interface GameRoomStatusProps {
    message: string,
    showLoader: boolean
}

/** Annonce le message de la salle et affiche un indicateur décoratif si showLoader vaut true. */


export default function GameRoomStatus({
    message,
    showLoader,
}: Readonly<GameRoomStatusProps>) {
    return (
        <output className="game-room-status">
            {showLoader && (
                <picture className="game-room-status__loader">
                    <source
                        media="(max-width: 600px)"
                        srcSet="/figma/waiting-room/loader-mobile.svg"
                    />
                    <img
                        src="/figma/waiting-room/loader-desktop.svg"
                        alt="" />
                </picture>
            )}
            <span>{message}</span>
        </output>
    )
}