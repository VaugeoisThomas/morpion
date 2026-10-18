import { 
    useEffect, 
    useState 
} from 'react'

import {
  type GameStatistics,
  loadGameStatistics,
} from '../../game/data/games'

import './ProfileStatistics.css'

type StatisticsState =
  | { userId: string; status: 'success'; statistics: GameStatistics }
  | { userId: string; status: 'error' }

/**
 * Charge et affiche les statistiques du compte indiqué. Ignore les réponses tardives après un
 * changement de compte ou le démontage du composant.
 */
export default function ProfileStatistics({
  userId,
}: Readonly<{ userId: string }>) {
  const [state, setState] = useState<StatisticsState | null>(null)

  useEffect(() => {
    let isActive = true

    void loadGameStatistics(userId)
      .then((statistics) => {
        if (isActive) {
          setState({ userId, status: 'success', statistics })
        }
      })
      .catch(() => {
        if (isActive) {
          setState({ userId, status: 'error' })
        }
      })

    return () => {
      isActive = false
    }
  }, [userId])

  if (!state || state.userId !== userId) {
    return <p role="status">Chargement des statistiques...</p>
  }

  if (state.status === 'error') {
    return (
      <p className="profile-statistics__error" role="alert">
        Impossible de charger les statistiques.
      </p>
    )
  }

  const { statistics } = state

  const cards = [
    { label: 'Parties', value: statistics.total, kind: 'total' },
    { label: 'Victoires', value: statistics.wins, kind: 'wins' },
    { label: 'Défaites', value: statistics.losses, kind: 'losses' },
    { label: 'Nuls', value: statistics.draws, kind: 'draws' },
  ]

  return (
    <section className="profile-statistics">
      <h2 className="profile-statistics__title">Tes statistiques</h2>

      <dl className="profile-statistics__grid">
        {cards.map((card) => (
          <div
            className={`profile-statistics__card profile-statistics__card--${card.kind}`}
            key={card.kind}
          >
            <dt className="profile-statistics__label">{card.label}</dt>
            <dd className="profile-statistics__value">{card.value}</dd>
          </div>
        ))}
      </dl>

      <div className="profile-statistics__win-rate">
        <label htmlFor="profile-win-rate">Taux de victoire</label>
        <span className="profile-statistics__rate-value">{statistics.winRate} %</span>
      </div>

      <progress
        id="profile-win-rate"
        className="profile-statistics__progress"
        max={100}
        value={statistics.winRate}
      >
        {statistics.winRate} %
      </progress>

      {statistics.total === 0 && (
        <p className="profile-statistics__note">
          Tes statistiques apparaîtront après ta première partie enregistrée.
        </p>
      )}
    </section>
  )
}