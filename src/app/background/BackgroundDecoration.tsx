import './BackgroundDecoration.css'

interface BackgroundDecorationProps {
  /** Affiche le même fond derrière le menu mobile ouvert. */
  menu?: boolean
}

/**
 * Affiche le fond commun de la maquette : halo et symboles décoratifs. Le positionnement
 * proportionnel adapte le décor à la taille de l’écran.
 */
export default function BackgroundDecoration({ menu = false }: Readonly<BackgroundDecorationProps>) {
  return (
    <div className={menu ? 'background-decoration background-decoration--menu' : 'background-decoration'} aria-hidden="true">
      <img className="background-decoration__halo" src="/figma/background/halo.svg" alt="" />
      <img className="background-decoration__circle background-decoration__circle--left" src="/figma/background/circle-left.svg" alt="" />
      <img className="background-decoration__circle background-decoration__circle--right" src="/figma/background/circle-right.svg" alt="" />
      <img className="background-decoration__cross background-decoration__cross--left" src="/figma/background/cross-left.svg" alt="" />
      <img className="background-decoration__cross background-decoration__cross--bottom" src="/figma/background/cross-bottom.svg" alt="" />
      <span className="background-decoration__line background-decoration__line--blue" />
      <span className="background-decoration__line background-decoration__line--purple" />
    </div>
  )
}
