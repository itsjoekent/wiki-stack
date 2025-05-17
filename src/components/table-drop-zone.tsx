import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { useDroppable } from '@dnd-kit/core';
import type { Page } from '@/game/types';
import { MessyCardStack } from './messy-card-stack';
import { PageCard } from './page-card';

export function TableDropZone(props: {
  stackIndex: number;
  isIncorrect: boolean;
  stack: Page[];
}) {
  const { isIncorrect, stackIndex, stack } = props;

  const [highlightCorrect, setHighlightCorrect] = useState(false);
  const previousStackLength = useRef(stack.length);

  useEffect(() => {
    if (stack.length > previousStackLength.current && !isIncorrect) {
      setHighlightCorrect(true);
      previousStackLength.current = stack.length;

      const timer = setTimeout(() => setHighlightCorrect(false), 750);
      return () => clearTimeout(timer);
    }

    previousStackLength.current = stack.length;
  }, [stack.length, isIncorrect]);
  
  const { isOver, setNodeRef } = useDroppable({
    id: stackIndex.toString(),
  });

  const conditionalClasses = classNames({
    '--hovering': isOver,
    '--incorrect': isIncorrect,
    '--correct': highlightCorrect,
  });

  const stackCardIds = useMemo(
    () => stack.map((page) => page.url).reverse(),
    [stack],
  );

  const renderCard = useCallback(
    (url: string) => {
      const page = stack.find((page) => page.url === url);
      if (!page) throw new Error(`Page not found: ${url}`);

      return <PageCard key={url} page={page} />;
    },
    [stack],
  );

  return (
    <div ref={setNodeRef} className={`game-drop-zone ${conditionalClasses}`}>
      <MessyCardStack ids={stackCardIds} renderCard={renderCard} />
    </div>
  );
}
