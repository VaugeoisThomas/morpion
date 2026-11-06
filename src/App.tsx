import { useEffect, useState } from 'react'
import AppLayout from './components/AppLayout'
import ComputerGame from './features/game/ComputerGame'
import AccountPage from './features/account/AccountPage'
import { getAuthCallbackMessage } from './features/account/authUrls'
import Home from './features/home/Home'
import RoomsPage from './features/rooms/RoomsPage'
import { useAuth } from './features/account/AuthContext'
import { consumeReturnRoute, readRoute } from './navigation'
import './App.css'

export default function App() {
  const { session } = useAuth()
  const [route, setRoute] = useState(() => {
    if (getAuthCallbackMessage(window.location.href)) return readRoute('#/compte')
    return readRoute(window.location.hash)
  })

  useEffect(() => {
    function navigate() {
      // Le lien d'évitement ne doit pas changer l'écran courant.
      if (window.location.hash === '#content') return
      setRoute(readRoute(window.location.hash))
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])

  useEffect(() => {
    if (!session) return
    const pendingRoute = consumeReturnRoute()
    if (pendingRoute) window.location.hash = pendingRoute
  }, [session])

  let content
  if (route.page === 'home') content = <Home />
  else if (route.page === 'computer') content = <ComputerGame />
  else if (route.page === 'account') content = <AccountPage />
  else content = <RoomsPage route={route} />
  return <AppLayout page={route.page}>{content}</AppLayout>
}
