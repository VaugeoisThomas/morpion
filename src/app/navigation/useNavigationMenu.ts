import { useEffect, useRef, useState } from 'react'


/**
 * Gère l’ouverture et la fermeture du menu de navigation. Initialise le menu fermé.
 *
 * @returns L’état du menu, la référence de son bouton et les actions d’ouverture et de fermeture.
 */
export function useNavigationMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

 /**
  * Référence du bouton de commande utilisée pour lui rendre le focus après une fermeture avec
  * Échap.
  */
  const menuToggleRef = useRef<HTMLButtonElement>(null)

  /* Ferme le menu sans déplacer le focus. */
  function closeMenu() {
    setIsMenuOpen(false)
  }

  /* Inverse l’état du menu à partir de sa valeur précédente. */
  function toggleMenu() {
    setIsMenuOpen((isOpen) => !isOpen)
  }

  /**
   * Écoute la touche Échap uniquement lorsque le menu est ouvert. Retire l’écouteur lorsque le
   * menu se ferme ou lorsque le composant est démonté.
   */
  useEffect(() => {
    if (!isMenuOpen) return

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return

      closeMenu()
      menuToggleRef.current?.focus()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [isMenuOpen])

  return { isMenuOpen, menuToggleRef, closeMenu, toggleMenu }
}