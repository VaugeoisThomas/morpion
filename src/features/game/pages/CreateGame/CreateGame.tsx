import { Link, useNavigate } from "react-router-dom";

import { ArrowLeft, CirclePlus } from "lucide-react";

import { paths } from "../../../../app/routes";
import Button from '../../../../shared/ui/Button/Button'
import { useAuth } from "../../../auth/hooks/useAuth";
import { avatars } from "../../../profile/data/profile";
import GameHostSummary from '../../components/GameHostSummary/GameHostSummary';
import GameInvitationPanel from '../../components/GameInvitationPanel/GameInvitationPanel'
import GameOptionsForm from '../../components/GameOptionsForm/GameOptionsForm';
import { useCreateGameOptions } from "../../hooks/useCreateGameOptions";
import { useCreateRoom } from "../../hooks/useCreateGameRoom";

import './CreateGame.css'


/**
 * Affiche le formulaire de création d’une salle multijoueur. Permet de choisir la visibilité, le
 * nombre de manches, le symbole de l’hôte et la durée des tours.
 */
export default function CreateGame() {
    const navigate = useNavigate()
    const {
        visibility,
        setVisibility,
        roundCount,
        setRoundCount,
        availableRoundCounts,
        playerSymbol,
        setPlayerSymbol,
        turnDuration,
        setTurnDuration,
        availableTurnDurations,
    } = useCreateGameOptions()

    const { user, profile } = useAuth()
    const {
        createRoom,
        isCreating,
        error: createError,
        createdRoom,
    } = useCreateRoom()

    async function handleCreateRoom() {
        const room = await createRoom({
            visibility,
            roundCount,
            hostSymbol: playerSymbol,
            turnDuration,
        })

        if (room) {
            await navigate(paths.room.replace(':roomId', room.id))
        }
    }

    /**
     * Identifiant de l’avatar de l’utilisateur connecté. Utilise le premier avatar du catalogue si
     * le profil est absent ou si son avatar ne correspond pas au catalogue.
     */
    const hostAvatar =
        avatars.find(({ id }) => id === profile?.avatar)?.id ?? avatars[0].id

    /**
     * Nom affiché pour l’hôte. Utilise le pseudo du profil, puis l’email du compte, et enfin
     * "Invité" lorsqu’aucune identité n’est disponible.
     */
    const hostName = profile?.username ?? user?.email ?? 'Invité'
    return (
        <main className="create-game">
            <Link className="create-game__back" to={paths.home}>
                <ArrowLeft size={20} aria-hidden="true" />
                <span>Retour</span>
            </Link>

            <header className="create-game__header">
                <h1 className="create-game__title">Créer une partie</h1>
                <p className="create-game__subtitle">Invite un ami et lance le défi.</p>
            </header>
            <div className="create-game__layout">
                <GameHostSummary
                    className='create-game__host'
                    avatarId={hostAvatar}
                    name={hostName}
                    status={
                        user
                            ? 'Hôte de la partie'
                            : 'Connecte-toi pour créer une partie'
                    }
                />
                <GameOptionsForm
                    className='create-game__options'
                    visibility={visibility}
                    onVisibilityChange={setVisibility}
                    roundCount={roundCount}
                    onRoundCountChange={setRoundCount}
                    availableRoundCounts={availableRoundCounts}
                    playerSymbol={playerSymbol}
                    onPlayerSymbolChange={setPlayerSymbol}
                    turnDuration={turnDuration}
                    onTurnDurationChange={setTurnDuration}
                    availableTurnDurations={availableTurnDurations}
                />

                <aside className="create-game__sidebar" aria-label="Invitation à la partie">
                    <GameInvitationPanel
                        className='create-game__invite'
                        description={
                            visibility === 'private'
                                ? 'Accessible uniquement avec le code ou le lien.'
                                : 'La partie sera visible par les joueurs qui cherchent une partie.'
                        }
                    />
                    <Button
                        className="create-game__create-button"
                        onClick={handleCreateRoom}
                        isLoading={isCreating}
                        disabled={!user || createdRoom !== null}
                    >
                        <CirclePlus size={22} aria-hidden="true" />
                        <span>
                            {isCreating
                                ? 'Création...'
                                : createdRoom
                                    ? 'Partie créée'
                                    : 'Créer la partie'}
                        </span>
                    </Button>
                    {createError && (
                        <p className="create-game__error" role="alert">{createError}</p>
                    )}
                    <p className="create-game__note">
                        {createdRoom
                            ? <>Code d'invitation: <strong>{createdRoom.inviteCode}</strong></>
                            : "Un code d'invitation sera généré dans la salle d'attente."}
                    </p>
                </aside>
            </div>
        </main>
    )
}