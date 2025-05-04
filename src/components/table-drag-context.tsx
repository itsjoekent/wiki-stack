import { useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
} from '@dnd-kit/core';
import { TOTAL_STACKS } from '@/game/constants';
import { pushTopOfDeckToStack } from '@/game/actions';
import { reducer } from '@/game/reducer';
import { selectTopOfStackPage } from '@/game/selectors';
import { useReducer } from '@/lib/reducer';
import { GameDeck } from './game-deck';
import { TableDropZone } from './table-drop-zone';

const stacksIterator = Array.from({ length: TOTAL_STACKS });

export function TableDragContext() {
  const [topOfStacks] = useReducer(reducer, (state) =>
    stacksIterator.map((_, index) => selectTopOfStackPage(state, index)),
  );

  const onDragEnd = useCallback((event: DragEndEvent) => {
    pushTopOfDeckToStack({
      stackIndex: Number(event.over?.id),
    });
  }, []);

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="game-zones-grid">
        {stacksIterator.map((_, index) => (
          <TableDropZone
            key={index}
            stackIndex={index}
            topOfStack={topOfStacks[index]}
          />
        ))}
      </div>
      <GameDeck />
    </DndContext>
  );
}
