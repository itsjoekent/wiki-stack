import { useCallback, useEffect, useMemo, useState } from 'react';
import { reducer } from '@/game/reducer';
import { selectDeckPages, selectIsGameOver } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { MessyCardStack } from './messy-card-stack';
import { TableDraggable } from './table-draggable';
import { FlipCard } from './flip-card';

export function GameDeck() {
  const [deck, isGameOver] = useReducer(
    reducer,
    selectDeckPages,
    selectIsGameOver,
  );

  const topOfDeck = useMemo(() => deck[0], [deck]);
  const [isFlipped, setIsFlipped] = useState<string[]>([]);

  useEffect(() => {
    if (isGameOver || !topOfDeck) {
      return;
    }

    if (!isFlipped.includes(topOfDeck.url)) {
      const timeoutId = setTimeout(() => {
        setIsFlipped((prev) => [...prev, topOfDeck.url]);
      }, 250);

      return () => clearTimeout(timeoutId);
    }
  }, [isFlipped, topOfDeck, isGameOver]);

  const deckCardIds = useMemo(() => deck.map((page) => page.url), [deck]);
  const renderCard = useCallback(
    (url: string) => {
      const page = deck.find((page) => page.url === url);
      if (!page) throw new Error(`Page not found: ${url}`);

      return (
        <FlipCard
          key={page.url}
          side={isFlipped.includes(page.url) ? 'front' : 'back'}
        >
          <TableDraggable page={page} />
        </FlipCard>
      );
    },
    [deck, isFlipped],
  );

  // TODO: fade out on game over

  return (
    <div className="game-deck">
      <span>Deck</span>
      <MessyCardStack ids={deckCardIds} renderCard={renderCard} zIndexOffset={1000000} />
    </div>
  );
}
