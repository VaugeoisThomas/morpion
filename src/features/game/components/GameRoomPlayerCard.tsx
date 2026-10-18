import ProfileAvatar from "../../profile/components/ProfileAvatar";
import GameSymbol from "./GameSymbol";

import type { PlayerSymbol } from "../model/gameRoom";

import "./GameRoomPlayerCard.css";

/** Informations nécessaires pour afficher un joueur ou une place libre. */
interface GameRoomPlayerCardProps {
    /** Titre de la carte, par exemple « Joueur 1 » ou « Joueur 2 ». */
    title: string,
    /** Pseudo affiché lorsque la place est occupée. */
    name?: string,
    /** Affiche le joueur si true, ou la silhouette de place libre si false. */
    isOccupied: boolean,
    /** Signale que le message de statut doit être annoncé comme une erreur. */
    hasError?: boolean,
    /** Symbole X ou O attribué à cette place, même lorsqu’elle est libre. */
    symbol: PlayerSymbol,
    /** Message sous le pseudo ou la silhouette : attente, chargement ou erreur. */
    status: string
    /** Identifiant de l’avatar ; son absence utilise le repli de ProfileAvatar. */
    avatarId?: string,
}

/**
 * Affiche un joueur ou une place libre. hasError annonce le statut comme une erreur et vaut false
 * par défaut.
 */

export default function GameRoomPlayerCard({
    title,
    name,
    avatarId,
    status,
    symbol,
    isOccupied,
    hasError = false,
}: Readonly<GameRoomPlayerCardProps>) {
    return (
        <div className="game-room-player-card">
            <h2 className="game-room-player-card__title">{title}</h2>
            {isOccupied ? (
                <ProfileAvatar
                    avatarId={avatarId}
                    size="large"
                    decorative
                    className="game-room-player-card__avatar"
                />
            ) : (
                <span className="game-room-player-card__placeholder" aria-hidden="true">
                    <img src="/figma/waiting-room/player-placeholder.svg" alt="" />
                </span>
            )}

            {isOccupied && (
                <p className="game-room-player-card__name">
                    {name}
                </p>
            )}
            <p className="game-room-player-card__status" role={hasError ? "alert" : undefined}>
                {status}
            </p>
            <span className="game-room-player-card__symbol" role="img" aria-label={`Symbole ${symbol}`}>
                <GameSymbol symbol={symbol} />
            </span>
        </div>
    )
}