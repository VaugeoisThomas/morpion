import { useState } from 'react'

const asset = (name: string) => `/figma/home/${name}.svg`
const actions = [
  { label: 'Jouer en ligne', description: 'Affronte des joueurs du monde', icon: 'users', color: 'online' },
  { label: 'Jouer contre l’ordinateur', description: 'Défie l’IA et améliore-toi', icon: 'bot', color: 'computer' },
  { label: 'Créer une partie', description: 'Invite tes amis et joue', icon: 'circle-plus', color: 'create' },
  { label: 'Rejoindre une partie', description: 'Avec un code ou un lien', icon: 'link', color: 'join' },
] as const

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="app-shell">
      <a className="skip-link" href="#content">Aller au contenu</a>
      <aside className="sidebar">
        <div className="sidebar-heading">
          <a href="/" className="sidebar-brand">MORPION</a>
          <p>Aligne trois symboles. Gagne.</p>
        </div>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen}
          aria-controls="navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        </button>
        <nav id="navigation" className={`navigation ${menuOpen ? 'navigation--open' : ''}`} aria-label="Navigation principale">
          <a className="navigation-item navigation-item--active" href="/" aria-current="page">
            <img src={asset('home-house')} alt="" />Accueil
          </a>
          {[
            ['Jouer en ligne', 'home-users1'], ['Jouer contre l’ordinateur', 'home-bot1'],
            ['Classement', 'home-trophy1'], ['Paramètres', 'home-settings'],
          ].map(([label, icon]) => (
            <button type="button" className="navigation-item" disabled key={label}>
              <img src={asset(icon)} alt="" /><span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
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
          {actions.map(({ label, description, icon, color }) => (
            <button type="button" className={`game-action game-action--${color}`} key={color} disabled>
              <picture aria-hidden="true">
                <source media="(max-width: 600px)" srcSet={asset(`mobile-${icon}`)} />
                <img src={asset(`home-${icon}`)} alt="" />
              </picture>
              <span className="game-action-copy"><strong>{label}</strong><span>{description}</span></span>
              <img className="action-chevron" src={asset('home-chevron-right')} alt="" />
            </button>
          ))}
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
    </div>
  )
}
