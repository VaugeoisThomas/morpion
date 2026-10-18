import { describe, expect, test } from "vitest";

import { findWinner } from "./morpion";
import {
  type CellValue,
  createEmptyBoard,
  findWinningMove,
  getBestMove,
  getEmptyCells,
} from "./morpion";

/** Crée un plateau vide indépendant pour les scénarios de recherche. */
function createEmptyBoardFixture(): CellValue[] {
  return [
    null, null, null,
    null, null, null,
    null, null, null,
  ];
}

/** Crée un plateau plein sans alignement gagnant. */
function createFullBoardWithoutWinner(): CellValue[] {
  return [
    "X", "O", "X",
    "X", "O", "O",
    "O", "X", "X",
  ];
}

/** Crée un plateau où X peut gagner en complétant la première ligne. */
function createBoardWithWinningMoveForX(): CellValue[] {
  return [
    "X", "X", null,
    "O", "O", null,
    null, null, null,
  ];
}

/** Crée un plateau où O peut gagner malgré une menace immédiate de X. */
function createBoardWithWinningMoveForO(): CellValue[] {
  return [
    "X", "X", null,
    "O", "O", null,
    "X", null, null,
  ];
}

describe("findWinner", () => {
  /** Vérifie qu’un plateau de neuf cases vides ne possède aucun gagnant. */
  test("ne trouve aucun gagnant sur un plateau vide", () => {
    const board = createEmptyBoardFixture();
    const winner = findWinner(board);

    expect(winner).toBeNull();
  });

  /** Vérifie que trois X sur la première ligne donnent la victoire à X. */
  test("X gagne sur la première ligne.", () => {
    const board: CellValue[] = [
      "X",
      "X",
      "X",
      "O",
      "O",
      null,
      null,
      null,
      null,
    ];
    const winner = findWinner(board);

    expect(winner).toBe("X");
  });

  /** Vérifie que trois O sur une diagonale donnent la victoire à O. */
  test("O gagne sur une diagonale.", () => {
    const board: CellValue[] = ["O", "X", "X", null, "O", "X", null, null, "O"];
    const winner = findWinner(board);

    expect(winner).toBe("O");
  });

  /** Vérifie que trois X sur la diagonale opposée donnent la victoire à X. */
  test("X gagne sur la diagonale opposée.", () => {
    const board: CellValue[] = [
      null,
      "O",
      "X",
      "O",
      "X",
      null,
      "X",
      null,
      null,
    ];
    const winner = findWinner(board);
    expect(winner).toBe("X");
  });

  /** Vérifie que O gagne sur la dernière colonne. */
  test("O gagne sur la dernière colonne", () => {
    const board: CellValue[] = ["X", null, "O", null, null, "O", "X", "X", "O"];
    const winner = findWinner(board);
    expect(winner).toBe("O");
  });

  /** Vérifie qu’un plateau rempli sans alignement gagnant renvoie null. */
  test("ne trouve aucun gagnant sur un plateau rempli", () => {
    const board: CellValue[] = createFullBoardWithoutWinner();
    const winner = findWinner(board);
    expect(winner).toBeNull();
  });

  /** Vérifie qu'il y a le bon nombre de symbole pour une victoire */
  test("deux symboles alignés ne suffisent pas pour gagner", () => {
    const board: CellValue[] = [
      "X",
      "X",
      null,
      "O",
      null,
      null,
      null,
      null,
      null,
    ];
    const winner = findWinner(board);
    expect(winner).toBeNull();
  });

  /** Vérifie qu'une ligne remplie exige trois symboles identiques pour gagner.*/
  test("ne déclare pas de gagnant sur une ligne de symboles différents", () => {
    const board: CellValue[] = [
      "X",
      "O",
      "X",
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const winner = findWinner(board);
    expect(winner).toBeNull();
  });

  /** Vérifie que trois X sur la dernière ligne donnent la victoire à X.*/
  test("X gagne sur la dernière ligne", () => {
    const board: CellValue[] = [
      null,
      null,
      null,
      null,
      "O",
      "O",
      "X",
      "X",
      "X",
    ];
    const winner = findWinner(board);
    expect(winner).toBe("X");
  });

  /** Vérifie que trois O sur la ligne centrale donnent la victoire à O.*/
  test("O gagne sur la ligne centrale", () => {
    const board: CellValue[] = [null, null, "X", "O", "O", "O", null, "X", "X"];
    const winner = findWinner(board);
    expect(winner).toBe("O");
  });

  /** Vérifie que trois X sur la colonne centrale donnent la victoire à X */
  test("X gagne sur la colonne centrale", () => {
    const board: CellValue[] = [
      "O",
      "X",
      "O",
      null,
      "X",
      null,
      null,
      "X",
      null,
    ];
    const winner = findWinner(board);
    expect(winner).toBe("X");
  });

  /** Vérifie que trois O sur la première colonne donnent la victoire à O */
  test("O gagne sur la première colonne", () => {
    const board: CellValue[] = ["O", "X", null, "O", "X", null, "O", null, "X"];
    const winner = findWinner(board);
    expect(winner).toBe("O");
  });
});

describe("getEmptyCells", () => {
  /** Vérifie que seules les positions des cases vides sont renvoyées, dans l'ordre */
  test("Renvois les indices des cases vide d'un plateau partiellement rempli", () => {
    const board: CellValue[] = [
      "X",
      null,
      "O",
      null,
      "X",
      null,
      "O",
      null,
      "X",
    ];
    const emptyCell = getEmptyCells(board);
    expect(emptyCell).toEqual([1, 3, 5, 7]);
  });

  /** Vérifie qu’un plateau plein ne contient aucun indice de case vide. */
  test("un plateau plein ne contient aucune case vide.", () => {
    const board: CellValue[] = createFullBoardWithoutWinner();
    const emptyCell = getEmptyCells(board);
    expect(emptyCell).toEqual([]);
  });

  /** Vérifie qu'un plateau vide contient tous les indices de case vide. */
  test("un plateau vide contient toute les cases vides.", () => {
    const board: CellValue[] = createEmptyBoardFixture();
    const emptyCell = getEmptyCells(board);
    expect(emptyCell).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});

describe("findWinningMove", () => {
  /** Vérifie que le coup complétant la première ligne de X est trouvé. */
  test("cherche le coup gagnant de X", () => {
    const board: CellValue[] = createBoardWithWinningMoveForX();
    const bestMove = findWinningMove(board, "X");
    expect(bestMove).toBe(2);
  });

  /** Vérifie que le coup complétant la deuxième ligne de O est trouvé. */
  test("cherche le coup gagnant de O", () => {
    const board: CellValue[] = createBoardWithWinningMoveForO();
    const bestMove = findWinningMove(board, "O");
    expect(bestMove).toBe(5);
  });

  /** Vérifie que la recherche renvoie null sans coup gagnant immédiat. */
  test("aucun coup gagnant ne permet de gagner immédiatement", () => {
    const board: CellValue[] = ["X", "O", "X", "X", "O", "O", "O", "X", null];
    const bestMove = findWinningMove(board, "X");
    expect(bestMove).toBeNull();
  });

  /** Vérifie qu’aucun coup gagnant n’est proposé sur un plateau plein sans gagnant. */
  test("un plateau plein sans gagnant ne propose aucun coup gagnant", () => {
    const board: CellValue[] = createFullBoardWithoutWinner();
    const bestMove = findWinningMove(board, "X");
    expect(bestMove).toBeNull();
  });

  /** Vérifie que la recherche d’un coup gagnant ne modifie pas le plateau reçu. */
  test("conserve le plateau pendant la recherche d'un coup gagnant", () => {
    const board: CellValue[] = createBoardWithWinningMoveForX();
    const initialBoard = [...board];
    findWinningMove(board, "X");
    expect(board).toEqual(initialBoard);
  });

  /** Vérifie que le plateau reste inchangé lorsqu’aucun coup gagnant n’est trouvé. */
  test("conserve le plateau même lorsqu'aucun coup gagnant n'est trouvé", () => {
    const board: CellValue[] = [
      "X",
      "O",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const initialBoard = [...board];
    const winningMove = findWinningMove(board, "X");
    expect(winningMove).toBeNull();
    expect(board).toEqual(initialBoard);
  });

  /** Vérifie qu’un coup complétant une diagonale gagnante est trouvé. */
  test("trouve le coup gagnant de X sur la diagonale principale", () => {
    const board: CellValue[] = [
      "X",
      "O",
      null,
      "O",
      "X",
      null,
      null,
      null,
      null,
    ];
    const winningMove = findWinningMove(board, "X");
    expect(winningMove).toBe(8);
  });

  /** Vérifie qu’un coup complétant la colonne centrale de O est trouvé. */
  test("trouve le coup gagnant de O sur la colonne centrale.", () => {
    const board: CellValue[] = [
      "X",
      "O",
      "X",
      null,
      "O",
      null,
      "X",
      null,
      null,
    ];
    const winningMove = findWinningMove(board, "O");
    expect(winningMove).toBe(7);
  });

  /** Vérifie que le premier indice gagnant est choisi si plusieurs coups gagnent. */
  test("choisit le premier indice parmi plusieurs coups gagnants", () => {
    const board: CellValue[] = ["X", "O", "X", "O", "X", "O", null, null, null];

    expect(findWinningMove(board, "X")).toBe(6);
  });
});

describe("createEmptyBoard", () => {
  /** Vérifie que le plateau créé contient neuf cases vides. */
  test("crée un plateau de neuf cases vides", () => {
    const board: CellValue[] = createEmptyBoard();
    const emptyBoard = [null, null, null, null, null, null, null, null, null];
    expect(board).toEqual(emptyBoard);
  });

  /** Vérifie que modifier un plateau ne change pas celui créé par un autre appel. */
  test("crée des plateaux indépendants à chaque appel", () => {
    const firstBoard: CellValue[] = createEmptyBoard();
    const secondBoard: CellValue[] = createEmptyBoard();

    firstBoard[0] = "X";
    expect(secondBoard[0]).toBeNull();
  });
});

describe("getBestMove", () => {
  /** Vérifie que le blocage est prioritaire même lorsque le centre est libre. */
  test("bloque une victoire de X avant de prendre le centre", () => {
    const board: CellValue[] = ["X", "X", null, null, null, null, "O", null, null];

    expect(getBestMove(board)).toBe(2);
  });

  /** Vérifie que les coins occupés sont ignorés. */
  test("choisit le prochain coin disponible lorsque le premier est occupé", () => {
    const board: CellValue[] = ["X", null, null, null, "O", "X", null, null, null];

    expect(getBestMove(board)).toBe(2);
  });

  /** Vérifie que l’ordinateur privilégie sa victoire immédiate au blocage de X. */
  test("préfère gagner immédiatement plutôt que bloquer l'adversaire", () => {
    const board: CellValue[] = createBoardWithWinningMoveForO();
    const bestMove = getBestMove(board);
    expect(bestMove).toBe(5);
  });

  /** Vérifie que l’ordinateur bloque une victoire immédiate de X. */
  test("bloque X lorsque O ne peux pas gagner immédiatement.", () => {
    const board: CellValue[] = [
      "X",
      "X",
      null,
      null,
      "O",
      null,
      null,
      null,
      null,
    ];
    const bestMove = getBestMove(board);
    expect(bestMove).toBe(2);
  });

  /** Vérifie que l’ordinateur choisit le centre en l’absence de coup urgent. */
  test("prendre le centre sans victoire ni menace immédiate", () => {
    const board: CellValue[] = [
      "X",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ];
    const bestMove = getBestMove(board);
    expect(bestMove).toBe(4);
  });

  /** Vérifie que l’ordinateur choisit un coin lorsque le centre est occupé. */
  test("choisir un coin lorsque le centre est occupé", () => {
    const board: CellValue[] = [
      null,
      null,
      null,
      null,
      "X",
      null,
      null,
      null,
      null,
    ];
    const bestMove = getBestMove(board);
    expect(bestMove).toBe(0);
  });

  /** Vérifie que l’ordinateur ne propose aucun coup sur un plateau plein sans gagnant. */
  test("ne proposer aucun coup sur un plateau plein sans gagnant", () => {
    const board: CellValue[] = createFullBoardWithoutWinner();
    const bestMove = getBestMove(board);
    expect(bestMove).toBeNull();
  });

  /** Vérifie le choix de la première case libre en l’absence de coup prioritaire. */
  test("choisit une case libre lorsque le centre et les coins sont occupés", () => {
    const board: CellValue[] = ["O", null, "X", "X", "X", "O", "O", null, "X"];
    const bestMove = getBestMove(board);
    expect(bestMove).toBe(1);
  });

  /** Vérifie que le choix du meilleur coup ne modifie pas le plateau reçu. */
  test("conserve le plateau pendant le choix du meilleur coup", () => {
    const board: CellValue[] = [
      "X",
      "O",
      "X",
      "X",
      "O",
      null,
      null,
      null,
      null,
    ];
    const initialBoard = [...board];
    getBestMove(board);
    expect(board).toEqual(initialBoard);
  });
});
