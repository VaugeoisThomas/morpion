import { useState } from 'react'

/**
 * Gère la copie d’un code d’invitation dans le presse-papiers. Expose un indicateur de réussite et
 * un message d’erreur.
 *
 * @returns L’action de copie, l’indicateur de réussite et le message d’erreur éventuel.
 */
export function useCopyGameCode() {
    /**
     * Indique que la dernière tentative de copie a réussi. Reste à true jusqu’à la prochaine
     * tentative ou au démontage du composant.
     */
    const [isCopied, setIsCopied] = useState(false)
    const [error, setError] = useState('')

    /**
     * Copie le texte fourni dans le presse-papiers du navigateur. Efface l’ancienne erreur et
     * réinitialise l’indicateur de réussite.
     *
     * @param code - Code d’invitation à copier.
     * @returns Une promesse résolue après le traitement de la tentative.
     */
    async function copyCode(code: string) {
        setError('')
        setIsCopied(false)

        try {
            await navigator.clipboard.writeText(code)
            setIsCopied(true)
        } catch {
            setError('Impossible de copier le code.')
        }
    }
    return { copyCode, isCopied, error }
}