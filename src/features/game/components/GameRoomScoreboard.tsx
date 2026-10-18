import "./GameRoomScoreboard.css";
/** Numéro de manche, nombre de manches, pseudos et scores des joueurs. */

interface GameRoomScoreboardProps {
    currentRound: number,
    roundCount: number,
    hostName: string,
    guestName: string,
    hostScore: number,
    guestScore: number,
}

/**
 * Affiche le numéro de manche et les scores des deux joueurs. Présente « Manche N sur M », puis
 * chaque pseudo avec son score.
 */
export default function GameRoomScoreboard({
    currentRound,
    roundCount,
    hostName,
    guestName,
    hostScore,
    guestScore,
}: Readonly<GameRoomScoreboardProps>) {
    return (
        <section className="game-room-scoreboard" aria-label="Scores de la partie">
            <p className="game-room-scoreboard__round">Manche {currentRound} sur {roundCount}</p>
            <p className="game-room-scoreboard__score">{hostName} : {hostScore} - {guestName} : {guestScore}</p>
        </section>
    )
}