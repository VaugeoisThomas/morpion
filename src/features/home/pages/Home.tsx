import { Link } from 'react-router-dom'

import { navigationItems } from '../../../app/navigation/navigationItems'
import { paths } from '../../../app/routes'
import GameResultBadge from '../../game/components/GameResultBadge'
import { useRecentGames } from '../../game/hooks/useRecentGames'
import UserProfileSummary from '../../profile/components/UserProfileSummary'
import { quickLinks } from '../data/home'

import './Home.css'

/** SVG de la maquette associés aux variantes des raccourcis. */
const quickLinkAssets = { online: 'users', computer: 'bot', new: 'circle-plus', link: 'link' } as const

/** Formateurs partagés pour les dates de l’historique de l’accueil. */
const relativeDateFormatter = new Intl.RelativeTimeFormat('fr-FR', { numeric: 'always' })
const fullDateFormatter = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' })

/** Affiche une durée relative récente, ou une date courte au-delà de trente jours. */
function formatRecentGameDate(date: Date): string {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (elapsedSeconds < 60) return 'À l’instant'
  if (elapsedSeconds < 3600) return relativeDateFormatter.format(-Math.floor(elapsedSeconds / 60), 'minute')
  if (elapsedSeconds < 86400) return relativeDateFormatter.format(-Math.floor(elapsedSeconds / 3600), 'hour')
  if (elapsedSeconds < 2592000) return relativeDateFormatter.format(-Math.floor(elapsedSeconds / 86400), 'day')
  return date.toLocaleDateString('fr-FR')
}
const mobileNavigationItems = navigationItems.filter(({ path }) =>
  path === paths.ranking || path === paths.settings,
)


/** Regroupe les panneaux de classement et d’historique récent dans la mise en page de l’accueil. */
function HomePanels() {
  return (
    <div className="home__panels">
      <RankingPanel />
      <RecentGamesPanel />
    </div>
  )
}

/**
 * Compose la page d’accueil avec la présentation du jeu, les raccourcis, les accès mobiles et les
 * panneaux de résultats.
 */
export default function Home() {
  return (
    <section className="home">
      <HomeHeader />
      <QuickLinks />
      <MobileTools />
      <HomePanels />
    </section>
  )
}

/** Affiche le titre, les symboles décoratifs et le texte de présentation de l’accueil. */
function HomeHeader() {
  return (
    <header className="home__header">
      <div className="home__brand-mark" aria-hidden="true">
        <picture className="home__brand-x"><source media="(min-width: 601px)" srcSet="/figma/home/home-symbole4.svg" /><img src="/figma/home/mobile-symbole4.svg" alt="" /></picture>
        <picture className="home__brand-o"><source media="(min-width: 601px)" srcSet="/figma/home/home-symbole5.svg" /><img src="/figma/home/mobile-symbole5.svg" alt="" /></picture>
      </div>
      <h1 className="home__title">MORPION</h1>
      <p className="home__subtitle">Défie tes amis, aligne trois symboles. Gagne.</p>
    </header>
  )
}

/** Affiche les raccourcis vers les modes de jeu à partir des entrées définies dans data/home. */
function QuickLinks() {
  return (
    <section className="home__quick-links" aria-label="Raccourcis">
      {quickLinks.map(({ label, description, to, role }) => (
        <Link className={`home__quick-link home__quick-link--${role}`} key={to} to={to}>
          <picture className="home__quick-icon" aria-hidden="true">
            <source media="(min-width: 601px)" srcSet={"/figma/home/home-" + quickLinkAssets[role] + ".svg"} />
            <img src={"/figma/home/mobile-" + quickLinkAssets[role] + ".svg"} alt="" />
          </picture>
          <span className="home__quick-copy">
            <strong className="home__quick-title">{label}</strong>
            <span className="home__quick-description">{description}</span>
          </span>
          <span className="home__quick-arrow" aria-hidden="true"><img src="/figma/home/home-chevron-right.svg" alt="" /></span>
        </Link>
      ))}
    </section>
  )
}

/**
 * Affiche les accès au profil, au classement et aux paramètres destinés aux petits écrans. Leur
 * visibilité selon la largeur de l’écran est gérée par le CSS.
 */
function MobileTools() {
  return (
    <div className="home__mobile-tools">
      <Link className="home__profile" to={paths.profile}>
        <UserProfileSummary />
      </Link>
      <nav className="home__mobile-navigation" aria-label="Autres pages">
        {mobileNavigationItems.map(({ label, path }) => (
          <Link className="home__mobile-navigation-link" key={path} to={path}>
            {path === paths.ranking && (
              <span className="home__mobile-navigation-icon" aria-hidden="true">
                <img src="/figma/home/home-trophy.svg" alt="" />
              </span>
            )}
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

/**
 * Affiche un panneau provisoire de classement et un lien vers la page correspondante. Ne charge
 * actuellement aucune donnée de classement.
 *
 * @todo Charger et afficher le classement réel des joueurs.
 */
function RankingPanel() {
  return (
    <section className="home__panel home__panel--ranking" aria-labelledby="home-ranking-title">
      <div className="home__panel-header">
        <div className="home__panel-title">
          <img className="home__panel-icon" src="/figma/home/home-trophy.svg" alt="" />
          <h2 className="home__panel-heading" id="home-ranking-title">Classement (semaine)</h2>
        </div>
      </div>
      <div className="home__ranking-list">
        <p className="home__ranking-empty">
          Le classement s’affichera après les premières parties enregistrées.
        </p>
      </div>
      <Link className="home__panel-link" to={paths.ranking}>
        Voir le classement général <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}

/**
 * Affiche les dernières parties de l’utilisateur connecté à partir de useRecentGames. Présente le
 * chargement, une erreur éventuelle ou un historique vide.
 */
function RecentGamesPanel() {
  const { games, isLoading, error } = useRecentGames()

  return (

    <section className="home__panel home__panel--games" aria-labelledby="home-games-title">
      <div className="home__panel-header">
        <h2 className="home__panel-heading" id="home-games-title">Dernières parties</h2>
      </div>
      <div className="home__games-list">
        {isLoading && (
          <output className="home__games-empty">Chargement des parties...</output>
        )}

        {!isLoading && error && (
          <p className="home__games-empty" role="alert">{error}</p>
        )}

        {!isLoading && !error && games.length === 0 && (
          <p className="home__games-empty">
            Aucune partie enregistrée pour le moment.
          </p>
        )}

        {!isLoading && !error && games.map((game) => {
          const playedAt = new Date(game.created_at)
          return (
            <div className="home__game-row" key={game.id}>
              <GameResultBadge
                result={game.result}
                className={`home__game-result home__game-result--${game.result}`}
              />
              <span className="home__game-opponent">
                {game.opponent_type === 'computer' ? 'Ordinateur' : 'Joueur en ligne'}
              </span>
              <time
                dateTime={game.created_at}
                className="home__game-time"
                title={fullDateFormatter.format(playedAt)}
              >
                {formatRecentGameDate(playedAt)}
              </time>
            </div>
          )
        })}
      </div>
    </section>
  )
}

