import { useDroppable } from '@dnd-kit/core';
import type { Page } from '@/game/types';
import classNames from 'classnames';
import { MessyCardStack } from './messy-card-stack';
import { PageCard } from './page-card';
import { useCallback, useMemo } from 'react';

export function TableDropZone(props: { stackIndex: number, stack: Page[] }) {
  const { stackIndex, stack } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: stackIndex.toString(),
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  const conditionalClasses = classNames({
    '--hovering': isOver,
  });

  const stackCardIds = useMemo(() => stack.map((page) => page.url), [stack]);
  const renderCard = useCallback((url: string) => {
    const page = stack.find((page) => page.url === url);
    if (!page) throw new Error(`Page not found: ${url}`);

    return <PageCard key={url} page={page} />;
  }, [stack]);

  return (
    <div
      ref={setNodeRef}
      className={`game-drop-zone ${conditionalClasses}`}
      style={style}
    >
      <MessyCardStack ids={stackCardIds} renderCard={renderCard} />
    </div>
  );
}
