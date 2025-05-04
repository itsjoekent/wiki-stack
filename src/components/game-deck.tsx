import { reducer } from '@/game/reducer';
import { selectDeckPages, selectIsGameOver } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { PageCard } from './page-card';
import { TableDraggable } from './table-draggable';

export function GameDeck() {
  const [deck, isGameOver] = useReducer(
    reducer,
    selectDeckPages,
    selectIsGameOver,
  );

  return (
    <div className="game-deck">
      {!isGameOver && <TableDraggable page={deck[0]} />}
      {isGameOver && <PageCard page={deck[0]} />}
    </div>
  );
}
