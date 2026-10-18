import GameResultBadge from '../../../game/components/GameResultBadge/GameResultBadge'
import { useRecentGames } from '../../../game/hooks/useRecentGames'

import './ProfileRecentGames.css'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

/**
 * Affiche les cinq dernières parties du compte connecté. Gère le chargement, les erreurs et
 * l’absence de résultats.
 */
export default function ProfileRecentGames() {
  const { games, isLoading, error } = useRecentGames()

  /**
   * Contenu affiché selon l’état de l’historique : chargement, erreur, absence de parties ou
   * tableau des résultats.
   */
  let content

  if (isLoading) {
    content = (
      <output className='profile-recent-games__note'>
        Chargement des dernières parties ...
      </output>
    )
  }
  else if (error) {
    content = (
      <p className='profile-recent-games__error' role="alert"> {error} </p>
    )
  } else if (games.length === 0) {
    content = (
      <p className='profile-recent-games__note'>Aucune partie enregistrée pour le moment.</p>
    )
  } else {
    content = (
      <div className="profile-recent-games__scroll">
        <table className="profile-recent-games__table">
          <caption className="profile-recent-games__caption">
            Tes cinq dernières parties enregistrées
          </caption>

          <thead>
            <tr>
              <th className="profile-recent-games__heading" scope="col">Adversaire</th>
              <th className="profile-recent-games__heading" scope="col">Date</th>
              <th className="profile-recent-games__heading" scope="col">Résultat</th>
            </tr>
          </thead>

          <tbody>
            {games.map((game) => (
              <tr key={game.id}>
                <td className="profile-recent-games__cell">
                  {game.opponent_type === 'computer'
                    ? 'Ordinateur'
                    : 'Joueur en ligne'}
                </td>

                <td className="profile-recent-games__cell">
                  <time className="profile-recent-games__time" dateTime={game.created_at}>
                    {dateFormatter.format(new Date(game.created_at))}
                  </time>
                </td>

                <td className="profile-recent-games__cell">
                  <GameResultBadge result={game.result} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <section className="profile-recent-games">
      <h2 className="profile-recent-games__title">Dernières parties</h2>
      {content}
    </section>
  )
}