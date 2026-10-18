// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from "vitest";

import { createEmptyBoard } from '../../model/morpion';
import GameBoard from './GameBoard';

describe("GameBoard", () => {

  /** Vérifie qu’un clic sur une case vide transmet son indice à onPlay. */
  test("transmet l'indice de la case vide sélectionnée", async () => {
    const user = userEvent.setup();
    const onPlay = vi.fn();
    const board = createEmptyBoard();
    render(<GameBoard board={board} onPlay={onPlay} />);
    const firstCell = screen.getByRole("button", { name: "Case 1 vide" });
    await user.click(firstCell);
    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(0);
  });
});
