import { useEffect, useState } from 'react'
import AppLayout from './components/AppLayout'
import ComputerGame from './features/game/ComputerGame'
import Home from './features/home/Home'
import './App.css'

export default function App() {
  const [page, setPage] = useState<'home' | 'computer'>(() =>
    window.location.hash === '#/ordinateur' ? 'computer' : 'home')

  useEffect(() => {
    function navigate() {
      // Le lien d'évitement ne doit pas changer l'écran courant.
      if (window.location.hash === '#content') return
      setPage(window.location.hash === '#/ordinateur' ? 'computer' : 'home')
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])

  return <AppLayout page={page}>{page === 'computer' ? <ComputerGame /> : <Home />}</AppLayout>
}
