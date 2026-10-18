import { Outlet, useLocation } from 'react-router-dom'

import BackgroundDecoration from '../background/BackgroundDecoration'
import Navigation from '../navigation/Navigation'
import { paths } from '../routes'

import './AppLayout.css'

/**
 * Mise en page commune à toutes les routes de l'application. Affiche le décor, la navigation et la
 * zone principale de contenu.
 */
export default function AppLayout() {
  const isHome = useLocation().pathname === paths.home
  return (
    <div className={isHome ? "app app--home" : "app"}>
      <BackgroundDecoration />
      <Navigation />
      <main className="app__content">
        <Outlet />
      </main>
    </div>
  )
}
