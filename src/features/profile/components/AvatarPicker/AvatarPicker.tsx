import { type AvatarId,avatars } from '../../data/avatars'
import ProfileAvatar from '../ProfileAvatar/ProfileAvatar'

import './AvatarPicker.css'


/** Propriétés du sélecteur d’avatar. */
interface AvatarPickerProps {
  /** Identifiant de l’avatar actuellement sélectionné. */
  selectedAvatar: AvatarId

  /** Fonction appelée avec l’identifiant de l’avatar choisi. */
  onSelect: (avatar: AvatarId) => void
}


/**
 * Affiche les avatars du catalogue sous forme de boutons. Signale l’avatar sélectionné
 * visuellement et avec aria-pressed.
 */
export default function AvatarPicker({ selectedAvatar, onSelect }: Readonly<AvatarPickerProps>) {
  return (
    <div className="avatar-picker">
      <div className="avatar-picker__title">Choisis ton avatar</div>

      <div className="avatar-picker__options">
        {avatars.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            aria-pressed={selectedAvatar === avatar.id}
            className={`avatar-picker__option${
              selectedAvatar === avatar.id ? ' avatar-picker__option--selected' : ''
            }`}
            onClick={() => onSelect(avatar.id)}
          >
            <ProfileAvatar
              avatarId={avatar.id}
              muted={selectedAvatar !== avatar.id}
              decorative
            />
            <span className="avatar-picker__label">{avatar.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}