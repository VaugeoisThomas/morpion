import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "../../../../app/routes";
import Button from "../../../../shared/ui/Button/Button";
import { useJoinGameRoom } from "../../hooks/useJoinGameRoom";

import "./JoinGame.css";


/** Affiche le formulaire pour rejoindre une salle à partir de son code d'invitation. */

export default function JoinGame() {
    const navigate = useNavigate();
    const [inviteCode, setInviteCode] = useState("");
    const { joinRoom, isJoining, error } = useJoinGameRoom();

    /** Rejoint la salle demandée puis ouvre sa page. */

    async function handleJoinRoom() {
        const roomId = await joinRoom(inviteCode)
        if (roomId === null) return;

        navigate(paths.room.replace(":roomId", roomId));
    }

    return (
        <main className="join-game">
            <h1 className="join-game__title">Rejoindre une partie</h1>
            <form
                className="join-game__form"
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleJoinRoom();
                }}
            >
                <label htmlFor="invite-code" className="join-game__label">
                    Code d'invitation
                </label>
                <input
                    className="join-game__input"
                    id="invite-code"
                    name="inviteCode"
                    type="text"
                    placeholder="AB12-CD34"
                    value={inviteCode}
                    onChange={(e) => {
                        const characters = e.target.value
                            .toUpperCase()
                            .replace(/[^A-F0-9]/g, "")
                            .slice(0, 8);

                        const formattedCode =
                            characters.length > 4
                                ? `${characters.slice(0, 4)}-${characters.slice(4)}`
                                : characters
                        setInviteCode(formattedCode);
                    }}
                    required
                    pattern="[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}"
                    maxLength={9}
                    spellCheck={false}
                    autoCapitalize="characters"
                    autoComplete="off"
                    aria-describedby="invite-code-hint"
                    readOnly={isJoining}
                />
                <p className="join-game__hint" id="invite-code-hint">
                    Saisis les huit caractères. Le tiret est ajouté automatiquement.
                </p>
                <Button type="submit" isLoading={isJoining}>
                    {isJoining ? "Connexion à la salle..." : "Rejoindre la partie"}
                </Button>

                {error && (
                    <p className="join-game__error" role="alert">
                        {error}
                    </p>
                )}
            </form>
        </main>
    );
}