import { Fragment } from 'react';
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
      {deck.map((page, index) => (
        <Fragment key={page.url}>
          {!isGameOver && index === 0 && (
            <TableDraggable key={page.url} page={page} />
          )}
          {(isGameOver || index > 0) && <PageCard key={page.url} page={page} />}
        </Fragment>
      ))}
    </div>
  );
}
