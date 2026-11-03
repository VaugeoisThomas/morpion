const asset = (name: string) => `/figma/home/${name}.svg`
const actions = [
  { label: 'Jouer en ligne', description: 'Affronte des joueurs du monde', icon: 'users', color: 'online' },
  { label: 'Jouer contre l’ordinateur', description: 'Défie l’IA et améliore-toi', icon: 'bot', color: 'computer' },
  { label: 'Créer une partie', description: 'Invite tes amis et joue', icon: 'circle-plus', color: 'create' },
  { label: 'Rejoindre une partie', description: 'Avec un code ou un lien', icon: 'link', color: 'join' },
] as const

export default function Home() {
  return (
      <main id="content" className="home">
        <header className="home-header">
          <div className="brand-symbols" aria-hidden="true">
            <span className="brand-cross"><img src={asset('home-symbole4')} alt="" /></span>
            <span className="brand-circle"><img src={asset('home-symbole5')} alt="" /></span>
          </div>
          <h1>MORPION</h1>
          <p>Défie tes amis, aligne trois symboles. Gagne.</p>
        </header>
        <section className="game-actions" aria-label="Modes de jeu">
          {actions.map(({ label, description, icon, color }) => {
            const content = <>
              <picture aria-hidden="true">
                <source media="(max-width: 600px)" srcSet={asset(`mobile-${icon}`)} />
                <img src={asset(`home-${icon}`)} alt="" />
              </picture>
              <span className="game-action-copy"><strong>{label}</strong><span>{description}</span></span>
              <img className="action-chevron" src={asset('home-chevron-right')} alt="" />
            </>
            return color === 'computer'
              ? <a className={`game-action game-action--${color}`} href="#/ordinateur" key={color}>{content}</a>
              : <button type="button" className={`game-action game-action--${color}`} key={color} disabled>{content}</button>
          })}
        </section>
        <div className="home-panels">
          <section className="home-panel" aria-labelledby="ranking-title">
            <h2 id="ranking-title"><img src={asset('home-trophy')} alt="" />Classement (semaine)</h2>
            <p className="empty-state">Aucun classement disponible pour le moment.</p>
          </section>
          <section className="home-panel home-panel--recent" aria-labelledby="recent-title">
            <h2 id="recent-title">Dernières parties</h2>
            <p className="empty-state">Aucune partie à afficher pour le moment.</p>
          </section>
        </div>
      </main>
  )
}
