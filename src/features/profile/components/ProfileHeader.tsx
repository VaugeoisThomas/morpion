import { Link } from 'react-router-dom'

import { ArrowLeft } from 'lucide-react'

import { paths } from '../../../app/routes'

import './ProfileHeader.css'

/** Textes affichés dans l’en-tête d’un écran de profil. */
interface ProfileHeaderProps {
  /** Titre principal de la page. */
  title: string

  /** Texte de présentation sous le titre. */
  subtitle: string
}

/**
 * Affiche un lien de retour vers l’accueil, suivi du titre et du sous-titre de l’écran de profil.
 * Doit être utilisé à l’intérieur du routeur, car le lien repose sur React Router.
 */
export default function ProfileHeader({
  title,
  subtitle,
}: Readonly<ProfileHeaderProps>) {
  return (
    <>
      <Link className="profile-header__back" to={paths.home}>
        <ArrowLeft size={20} aria-hidden="true" />
        <span>Retour</span>
      </Link>
      <header className="profile-header">
        <h1 className="profile-header__title">{title}</h1>
        <p className="profile-header__subtitle">{subtitle}</p>
      </header>
    </>
  )
}