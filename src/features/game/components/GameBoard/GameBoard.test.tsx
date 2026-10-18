// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, test, vi } from "vitest";

import { createEmptyBoard } from '../../model/morpion';
import GameBoard from './GameBoard';

afterEach(cleanup);

/** Prépare un utilisateur simulé, un espion onPay, et un plateau vide */
function setUpGameBoardTest() {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  const board = createEmptyBoard();

  return { user, onPlay, board };
}

describe("GameBoard", () => {

  /** Vérifie qu’un clic sur une case vide transmet son indice à onPlay. */
  test("transmet l'indice de la case vide sélectionnée", async () => {
    const { user, onPlay, board } = setUpGameBoardTest();

    render(<GameBoard board={board} onPlay={onPlay} />);
    const firstCell = screen.getByRole("button", { name: "Case 1 vide" });
    await user.click(firstCell);
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(0);
  });

  /** Vérifie qu’un clic sur une case occupée ne déclenche pas onPlay. */
  test("ignore le clic sur une case occupée", async () => {
    const { user, onPlay, board } = setUpGameBoardTest();
    board[0] = "X"
    render(<GameBoard board={board} onPlay={onPlay} />);
    const occupiedCell = screen.getByRole("button", { name: "Case 1: X" });
    await user.click(occupiedCell)
    expect(onPlay).not.toHaveBeenCalled();
  })
});
