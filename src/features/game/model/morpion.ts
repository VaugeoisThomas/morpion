/** Symbole X ou O, ou null pour une case vide. */
export type CellValue = 'X' | 'O' | null

/** Nombre de lignes et de colonnes du plateau. */
export const BOARD_SIZE = 3

/** Indice de la case centrale du plateau 3 × 3. */
export const CENTER_INDEX = 4

/** Indices des quatre coins du plateau 3 × 3. */
export const CORNER_INDICES = [0, 2, 6, 8]

/**
 * Crée un nouveau plateau dont toutes les cases sont vides.
 *
 * @returns Un tableau de BOARD_SIZE × BOARD_SIZE cases contenant null.
 */
export function createEmptyBoard(): CellValue[] {
    return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => null)
}


/**
 * Construit les alignements gagnants d’un plateau carré. Chaque alignement contient les indices
 * d’une ligne, d’une colonne ou de l’une des deux diagonales complètes.
 *
 * @param size - Nombre de lignes et de colonnes du plateau.
 * @returns Les groupes d’indices constituant les alignements gagnants.
 */
function createWinningLines(size: number): number[][] {
    const lines: number[][] = []
    const descendingDiagonal: number[] = []
    const ascendingDiagonal: number[] = []

    for (let position = 0; position < size; position++) {
        const row: number[] = []
        const column: number[] = []

        for (let cell = 0; cell < size; cell++) {
            row.push(position * size + cell)
            column.push(cell * size + position)
        }

        lines.push(row, column)
        descendingDiagonal.push(position * size + position)
        ascendingDiagonal.push(position * size + (size - 1 - position))
    }

    lines.push(descendingDiagonal, ascendingDiagonal)
    return lines
}

/** Alignements gagnants calculés une seule fois pour la taille du plateau. */
const winningLines = createWinningLines(BOARD_SIZE)

/**
 * Recherche un alignement entièrement occupé par le même symbole. Suppose que le plateau respecte
 * la taille et les valeurs attendues.
 *
 * @param board - Plateau à examiner, parcouru ligne par ligne.
 * @returns Le symbole gagnant, ou null si aucun alignement n’est trouvé.
 */
export function findWinner(board: CellValue[]): 'X' | 'O' | null {
    for (const line of winningLines) {
        const firstCell = board[line[0]]

        if (firstCell && line.every((cellIndex) => board[cellIndex] === firstCell)) {
            return firstCell
        }
    }

    return null
}


/**
 * Recherche les cases vides du plateau.
 *
 * @param board - Plateau à examiner.
 * @returns Les indices des cases contenant null, par ordre croissant.
 */
export function getEmptyCells(board: CellValue[]): number[] {
    return board
        .map((cell, index) => (cell === null ? index : -1))
        .filter((index) => index !== -1)
}

/**
 * Recherche une case vide dont l’occupation produit une victoire pour le symbole indiqué. Simule
 * chaque coup sur une copie sans modifier le plateau reçu.
 *
 * @param board - Plateau sur lequel rechercher le coup.
 * @param player - Symbole pour lequel rechercher une victoire.
 * @returns L’indice du premier coup gagnant trouvé, ou null.
 */
export function findWinningMove(board: CellValue[], player: 'X' | 'O'): number | null {
    for (const index of getEmptyCells(board)) {
        const nextBoard = [...board]
        nextBoard[index] = player

        if (findWinner(nextBoard) === player) {
            return index
        }
    }

    return null
}

/**
 * Choisit un coup pour l’ordinateur, qui joue avec le symbole "O". Applique les priorités
 * suivantes : gagner immédiatement, bloquer une victoire immédiate de "X", occuper le centre,
 * prendre un coin, puis prendre une case libre. Cette stratégie ne garantit donc pas un jeu
 * imbattable.
 *
 * @param board - Plateau d’une partie encore en cours.
 * @returns L’indice du coup choisi, ou null si aucune case n’est libre.
 */
export function getBestMove(board: CellValue[]): number | null {
    const immediateWin = findWinningMove(board, 'O')
    if (immediateWin !== null) {
        return immediateWin
    }

    const humanWinningMove = findWinningMove(board, 'X')
    if (humanWinningMove !== null) {
        return humanWinningMove
    }

    if (board[CENTER_INDEX] === null) {
        return CENTER_INDEX
    }

    const availableCorner = CORNER_INDICES.find((index) => board[index] === null)
    if (availableCorner !== undefined) {
        return availableCorner
    }

    const emptyCells = getEmptyCells(board)
    return emptyCells[0] ?? null
}