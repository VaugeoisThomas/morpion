import './PagePlaceholder.css'
interface PagePlaceholderProps {
  /** Titre principal affiché dans la page. */
  title: string
  /** Texte complémentaire facultatif. */
  description?: string
}

/**
 * Affiche une page simple composée d’un titre et d’une description facultative. Utilisé pour les
 * fonctionnalités encore à développer et pour la page introuvable.
 */
export default function PagePlaceholder({ title, description }: Readonly<PagePlaceholderProps>) {
  return (
    <section className="page-placeholder">
      <h1 className="page-placeholder__title">{title}</h1>
      {description && <p className="page-placeholder__description">{description}</p>}
    </section>
  )
}
