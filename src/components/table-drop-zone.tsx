import { useDroppable } from '@dnd-kit/core';
import type { Page } from '@/game/types';
import classNames from 'classnames';
import { PageCard } from './page-card';

export function TableDropZone(props: { stackIndex: number, topOfStack: Page }) {
  const { stackIndex, topOfStack } = props;

  const { isOver, setNodeRef } = useDroppable({
    id: stackIndex.toString(),
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  const conditionalClasses = classNames({
    '--hovering': isOver,
  });

  return (
    <div
      ref={setNodeRef}
      className={`game-drop-zone ${conditionalClasses}`}
      style={style}
    >
      <PageCard page={topOfStack} />
    </div>
  );
}
