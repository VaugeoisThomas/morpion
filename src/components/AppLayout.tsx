import { useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../features/account/AuthContext'

type Props = { page: 'home' | 'computer' | 'account'; children: ReactNode }

export default function AppLayout({ page, children }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { session, loading } = useAuth()
  const links = [
    { label: 'Accueil', icon: 'home-house', destination: '#/', page: 'home' },
    { label: 'Jouer en ligne', icon: 'home-users1' },
    { label: 'Jouer contre l’ordinateur', icon: 'home-bot1', destination: '#/ordinateur', page: 'computer' },
    { label: 'Classement', icon: 'home-trophy1' },
    { label: 'Paramètres', icon: 'home-settings' },
  ]
  return (
    <div className="app-shell">
      <a className="skip-link" href="#content">Aller au contenu</a>
      <aside className="sidebar">
        <div className="sidebar-heading">
          <a href="#/" className="sidebar-brand">MORPION</a>
          <p>Aligne trois symboles. Gagne.</p>
        </div>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen}
          aria-controls="navigation" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        </button>
        <nav id="navigation" className={`navigation ${menuOpen ? 'navigation--open' : ''}`} aria-label="Navigation principale">
          {links.map(({ label, icon, destination, page: linkPage }) => {
            const content = <><img src={`/figma/home/${icon}.svg`} alt="" /><span>{label}</span></>
            return destination ? (
              <a key={label} className={`navigation-item ${page === linkPage ? 'navigation-item--active' : ''}`}
                href={destination} aria-current={page === linkPage ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}>{content}</a>
            ) : <button key={label} className="navigation-item" type="button" disabled>{content}</button>
          })}
        </nav>
        <a className="account-link" href="#/compte" aria-current={page === 'account' ? 'page' : undefined}
          onClick={() => setMenuOpen(false)}>
          {loading ? 'Connexion…' : session ? 'Mon compte' : 'Se connecter'}
        </a>
      </aside>
      {children}
    </div>
  )
}
