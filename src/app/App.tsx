import { RouterProvider } from 'react-router-dom'

import { router } from './router'

/** Affiche le routeur principal de l’application. */

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
