-- Ajoute un plateau vide et le symbole qui joue en premier.
alter table public.game_rooms
    add column board text[] not null
        default array_fill(null::text, array[9]),
    add column current_turn text not null
        default 'X';

-- Impose un tableau à une dimension contenant neuf cases.
-- Chaque case contient uniquement null, X ou O.
alter table public.game_rooms
    add constraint game_rooms_valid_board
        check (
            array_ndims(board) = 1
            and array_lower(board, 1) = 1
            and cardinality(board) = 9
            and array_remove(board, null::text)
                <@ array['X', 'O']::text[]
        );

-- Limite le symbole du tour courant aux deux symboles du jeu.
alter table public.game_rooms
    add constraint game_rooms_valid_current_turn
        check (current_turn in ('X', 'O'));