import { useState } from "react";
import { Link } from "react-router-dom";

import { ArrowLeft, Pencil } from "lucide-react";

import { paths } from "../../../../app/routes";
import Button from '../../../../shared/ui/Button/Button'
import { avatars, type SavedProfile } from "../../data/profile";
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar'
import ProfileEditor from "../ProfileEditor/ProfileEditor";
import ProfileRecentGames from "../ProfileRecentGames/ProfileRecentGames";
import ProfileStatistics from "../ProfileStatistics/ProfileStatistics";


interface ProfileOverviewProps {
    /** Profil affiché dans la carte et transmis à l'éditeur. */
    profile: SavedProfile

    /** Identifiant du compte connecté. */
    userId: string

    /** Adresse email transmise à l'éditeur. */
    email: string
}

/**
 * Affiche la carte du profil ou son formulaire de modification. Le bouton de retour permet de
 * quitter le formulaire.
 */

export default function ProfileOverview({
    profile,
    userId,
    email,
}: Readonly<ProfileOverviewProps>) {
    const [isEditing, setIsEditing] = useState(false)
    const avatar = avatars.find(({ id }) => id === profile.avatar)
        ?? avatars[0]
    
    if (isEditing) {
        return (
            <div>
                <Button 
                    className="profile__editor-return"
                    variant="secondary" 
                    onClick={() => setIsEditing(false)}
                >
                    <ArrowLeft size={18} aria-hidden="true" />
                    Retour au profil
                </Button>
                <ProfileEditor
                    profile={profile}
                    userId={userId}
                    email={email}
                />
            </div>
        )
    }
    return (
        <section className="profile profile--overview">
            <Link className="profile__back" to={paths.home}>
                <ArrowLeft size={18} aria-hidden="true" />
                Retour
            </Link>

            <header className="profile__header">
                <h1 className="profile__title">Profil</h1>
            </header>

            <section className="profile__identity" aria-label="Ton profil">
                <ProfileAvatar avatarId={avatar.id} size="large" className="profile__identity-avatar" />

                <div className="profile__identity-info">
                    <h2 className="profile__identity-name">
                        {profile.username}
                    </h2>

                    <p className="profile__identity-status">
                        <span className="profile__identity-dot" aria-hidden="true" />
                        {profile.status}
                    </p>
                </div>

                <Button 
                    className="profile__edit-button" 
                    variant="secondary" 
                    onClick={() => setIsEditing(true)}
                >
                    <Pencil size={17} aria-hidden="true" />Modifier le profil
                </Button>
            </section>
            <ProfileStatistics userId={userId} />
            <ProfileRecentGames />
        </section>
    )
}