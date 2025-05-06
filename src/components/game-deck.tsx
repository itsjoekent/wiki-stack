import { reducer } from '@/game/reducer';
import { selectDeckPages, selectIsGameOver } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { PageCard } from './page-card';
import { TableDraggable } from './table-draggable';
import { FlipCard } from './flip-card';

export function GameDeck() {
  const [deck, isGameOver] = useReducer(
    reducer,
    selectDeckPages,
    selectIsGameOver,
  );

  // If the card is being dragged, don't render FlipCard
  // If the card is being dragged, transition a second card in (flipped)
  //   If the card is dropped outside of a drop zone, pull the secondary card back
  // If the game is over, fade the deck out

  return (
    <div className="game-deck">
      {!isGameOver && (
        <FlipCard isFlipped={false}>
          <TableDraggable page={deck[0]} />
        </FlipCard>
      )}
      {isGameOver && <PageCard page={deck[0]} />}
    </div>
  );
}
