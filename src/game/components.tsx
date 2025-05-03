import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useReducer } from '@/lib/reducer';
import * as actions from './actions';
import { reducer } from './reducer';
import * as selectors from './selectors';
import type { Page } from './types';
import { formatTimeLeft } from './utils';

export function GameScene() {
  const [isReadyToPlay] = useReducer(reducer, selectors.selectIsReadyToPlay);

  if (!isReadyToPlay) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Timer />
      <TableDragContext />
    </div>
  );
}

export function Timer() {
  const [timerEndsAt, isGameOver, gameOverReason] = useReducer(
    reducer,
    selectors.selectTimerEndsAt,
    selectors.selectIsGameOver,
    selectors.selectGameOverReason,
  );

  const [displayValue, setDisplayValue] = useState<string>('00:000');

  const intervalId = useRef<number | null>(null);
  const displayRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (isGameOver || !timerEndsAt) {
      return;
    }

    let timeLeft = formatTimeLeft(Math.max(timerEndsAt - Date.now(), 0));

    intervalId.current = setInterval(() => {
      timeLeft = formatTimeLeft(Math.max(timerEndsAt - Date.now(), 0));

      if (displayRef.current) {
        displayRef.current.textContent = timeLeft;
      }
    }, 50);

    return () => {
      setDisplayValue(timeLeft);

      if (intervalId.current) {
        clearInterval(intervalId.current);
      }

      intervalId.current = null;
    };
  }, [timerEndsAt, isGameOver]);

  useEffect(() => {
    if (isGameOver && intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, [isGameOver]);

  return (
    <div>
      <h2>Timer</h2>
      {gameOverReason === 'time' && <span>{formatTimeLeft(0)}</span>}
      {gameOverReason !== 'time' && (
        <span ref={displayRef}>{displayValue}</span>
      )}
    </div>
  );
}

export function TableDragContext() {
  const [stacks] = useReducer(reducer, selectors.selectStacks);
  const [topOfStacks] = useReducer(reducer, (state) =>
    stacks.map((_, index) => selectors.selectTopOfStackPage(state, index)),
  );

  const onDragEnd = useCallback((event: DragEndEvent) => {
    actions.pushTopOfDeckToStack({
      stackIndex: Number(event.over?.id),
    });
  }, []);

  return (
    <DndContext onDragEnd={onDragEnd}>
      {stacks.map((_, index) => (
        <TableDropZone
          key={index}
          stackIndex={index}
          topOfStack={topOfStacks[index]}
        />
      ))}
      <GameDeck />
    </DndContext>
  );
}

export function TableDropZone(props: { stackIndex: number, topOfStack: Page }) {
  const { stackIndex, topOfStack } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: stackIndex.toString(),
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <h2>Stack {stackIndex}</h2>
      <p>{topOfStack.title}</p>
    </div>
  );
}

export function GameDeck() {
  const [deck, isGameOver] = useReducer(
    reducer,
    selectors.selectDeckPages,
    selectors.selectIsGameOver,
  );

  return (
    <div>
      <h2>Deck</h2>
      {deck.map((page, index) => (
        <Fragment key={page.url}>
          {(!isGameOver && index === 0) && <TableDraggable key={page.url} page={page} />}
          {(isGameOver || index > 0) && <PageCard key={page.url} page={page} />}
        </Fragment>
      ))}
    </div>
  );
}

export function TableDraggable(props: { page: Page }) {
  const { page } = props;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: page.url,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  if (!page) {
    return null;
  }

  return (
    <PageCard
      page={page}
      divProps={{
        ref: setNodeRef,
        style,
        ...listeners,
        ...attributes,
      }}
    />
  );
}

export function PageCard(props: { page: Page, divProps?: React.HTMLProps<HTMLDivElement> }) {
  const { page, divProps } = props;

  return (
    <div {...divProps}>
      <img src={page.imageSrc || undefined} alt={page.imageAlt} />
      <h2>{page.title}</h2>
    </div>
  );
}
