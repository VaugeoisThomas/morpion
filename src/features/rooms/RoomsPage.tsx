import { useAuth } from '../account/AuthContext'
import { CreateRoom, JoinRoom } from './RoomSetup'
import RoomView from './RoomView'
import type { Route } from '../../navigation'
import './RoomsPage.css'

export default function RoomsPage({ route }: Readonly<{ route: Route }>) {
  const { session, loading } = useAuth()
  let content
  if (loading) content = <output>Vérification de ta connexion…</output>
  else if (!session) content = <section className="room-panel room-join">
    <h1>Joue avec tes amis</h1><p>Connecte-toi pour créer ou rejoindre une partie.</p>
    <a className="primary-button" href="#/compte" onClick={() => {
      try { sessionStorage.setItem('morpion:returnTo', window.location.hash) } catch { /* Navigation disponible même sans stockage. */ }
    }}>Se connecter ou créer un compte</a>
  </section>
  else if (route.page === 'create') content = <CreateRoom />
  else if (route.page === 'join') content = <JoinRoom key={route.code} initialCode={route.code} />
  else content = <RoomView key={`${session.user.id}:${route.id}`} id={route.id} userId={session.user.id} />
  return <main id="content" className="computer-page rooms-page"><a href="#/" className="back-link">← Retour à l’accueil</a>{content}</main>
}
