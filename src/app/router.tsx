import { createBrowserRouter } from 'react-router-dom'

import { AuthProvider } from '../features/auth/context/AuthProvider'
import Home from '../features/home/pages/Home/Home'
import AppLayout from './layout/AppLayout'
import PagePlaceholder from './pages/PagePlaceholder/PagePlaceholder'
import { paths } from './routes'

/**
 * Pages dont le contenu est encore provisoire. Chaque entrée associe un chemin à un titre affiché
 * par le composant PagePlaceholder.
 */
const secondaryPages = [
    { path: paths.online, title: 'Jouer en ligne' },
    { path: paths.ranking, title: 'Classement' },
    { path: paths.settings, title: 'Paramètres' },
] as const


/**
 * Router principal de l'application. Toutes les pages utilisent AppLayout et partagent
 * AuthProvider.
 *
 * @todo Remplacer les pages provisoires du mode en ligne, du classement et des paramètres.
 */
export const router = createBrowserRouter([
    {
        path: paths.home,
        element: (
            <AuthProvider>
                <AppLayout />
            </AuthProvider>
        ),
        hydrateFallbackElement: <output>Chargement de la page...</output>,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: paths.room.slice(1),
                lazy: async () => {
                    const { default: Component } = await import('../features/game/pages/GameRoom/GameRoom')
                    return { Component }
                },
            },
            {
                path: paths.profile.slice(1),
                lazy: async () => {
                    const { default: Component } = await import('../features/profile/pages/Profile/Profile')
                    return { Component }
                },
            },
            {
                path: paths.computer.slice(1),
                lazy: async () => {
                    const { default: Component } = await import('../features/game/pages/ComputerGame/ComputerGame')
                    return { Component }
                },
            },
            {
                path: paths.createGame.slice(1),
                lazy: async () => {
                    const { default: Component } = await import('../features/game/pages/CreateGame/CreateGame')
                    return { Component }
                },
            },
            {
                path: paths.joinGame.slice(1),
                lazy: async () => {
                    const { default: Component } = await import('../features/game/pages/JoinGame/JoinGame')
                    return { Component }
                },
            },
            {
                path: paths.notFound,
                element: <PagePlaceholder title="Page Introuvable" description="Cette page n'existe pas" />,
            },
            ...secondaryPages.map((page) => ({
                path: page.path.slice(1),
                element: <PagePlaceholder title={page.title} />
            })),
        ]
    }
])