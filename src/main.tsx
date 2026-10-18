import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app/App.tsx'

import './app/App.css'

/**
 * Point de démarrage de l’application React dans le navigateur. Recherche le conteneur HTML
 * "root", puis y affiche App sous StrictMode.
 */
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element was not found in the document.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
